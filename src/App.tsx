import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  allLectures, 
  fullQuizBank,
  getRandomQuizzes, 
  Lecture, 
  QuizQuestion 
} from './data';
import { FunVideoTheater } from './components/FunVideoTheater';
import { VisualStudyGuide } from './components/VisualStudyGuide';
import { WrongAnswerNotes } from './components/WrongAnswerNotes';
import { 
  BookOpen, 
  CheckCircle2, 
  Circle, 
  Play, 
  Search, 
  FileText, 
  Sparkles, 
  HelpCircle, 
  ExternalLink, 
  Copy, 
  Check, 
  ChevronRight, 
  Flame, 
  Shuffle, 
  Lightbulb, 
  Printer,
  Heart,
  Pencil,
  AlertCircle,
  Bookmark,
  Tv,
  Award
} from 'lucide-react';

// In-memory fallback in case localStorage is blocked by sandboxed iframe
const memoryStore: Record<string, string> = {};

function safeStorageGet(key: string): string | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
  } catch {
    // blocked by sandbox / third-party storage restrictions
  }
  return memoryStore[key] ?? null;
}

function safeStorageSet(key: string, value: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
      return;
    }
  } catch {
    // blocked by sandbox
  }
  memoryStore[key] = value;
}

function getInitialCompletedLectures(): number[] {
  try {
    const saved = safeStorageGet('ppakong_completed');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed.filter(item => typeof item === 'number');
      }
    }
  } catch {
    // ignore parse error
  }
  return [];
}

function getInitialWrongQuestions(): number[] {
  try {
    const saved = safeStorageGet('ppakong_wrong_questions');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed.filter(item => typeof item === 'number');
      }
    }
  } catch {
    // ignore parse error
  }
  return [];
}

export default function App() {
  const [selectedId, setSelectedId] = useState<number>(21);
  // Default to 'video' for the most fun and easiest learning experience!
  const [activeTab, setActiveTab] = useState<'video' | 'lecture' | 'summary' | 'quiz' | 'wrong' | 'export'>('video');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRegion, setFilterRegion] = useState<'all' | 'west' | 'asia'>('all');
  
  // Safe initial state for completed lectures
  const [completedLectures, setCompletedLectures] = useState<number[]>(getInitialCompletedLectures);
  const [copied, setCopied] = useState(false);

  // Safe quiz state with random questions
  const [currentQuizzes, setCurrentQuizzes] = useState<QuizQuestion[]>(() => {
    try {
      const quizzes = getRandomQuizzes(12);
      return quizzes && quizzes.length > 0 ? quizzes : fullQuizBank.slice(0, 12);
    } catch {
      return fullQuizBank.slice(0, 12);
    }
  });
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [quizSetCounter, setQuizSetCounter] = useState(1);

  // Wrong questions persistent state
  const [wrongQuestionIds, setWrongQuestionIds] = useState<number[]>(getInitialWrongQuestions);

  // Save progress changes
  useEffect(() => {
    try {
      safeStorageSet('ppakong_completed', JSON.stringify(completedLectures));
    } catch (e) {
      console.warn('Could not save progress:', e);
    }
  }, [completedLectures]);

  // Save wrong question IDs changes
  useEffect(() => {
    try {
      safeStorageSet('ppakong_wrong_questions', JSON.stringify(wrongQuestionIds));
    } catch (e) {
      console.warn('Could not save wrong questions:', e);
    }
  }, [wrongQuestionIds]);

  const toggleComplete = useCallback((id: number) => {
    setCompletedLectures(prev => {
      const list = Array.isArray(prev) ? prev : [];
      return list.includes(id) ? list.filter(item => item !== id) : [...list, id];
    });
  }, []);

  // Shuffle quiz questions safely
  const handleShuffleQuizzes = useCallback((count = 12) => {
    try {
      const numToFetch = Math.max(1, Math.min(count, fullQuizBank.length));
      const newQuizzes = getRandomQuizzes(numToFetch);
      if (newQuizzes && newQuizzes.length > 0) {
        setCurrentQuizzes(newQuizzes);
      } else {
        setCurrentQuizzes(fullQuizBank.slice(0, numToFetch));
      }
    } catch (e) {
      console.warn('Failed to shuffle quizzes, using fallback:', e);
      setCurrentQuizzes(fullQuizBank.slice(0, Math.min(count, fullQuizBank.length)));
    }
    setQuizAnswers({});
    setShowQuizResults(false);
    setQuizSetCounter(prev => prev + 1);
  }, []);

  // Grade quiz and automatically record wrong questions
  const handleGradeQuiz = useCallback(() => {
    setShowQuizResults(true);
    // Find all questions that were answered incorrectly or left blank
    const newlyWrong = currentQuizzes.filter(q => q && quizAnswers[q.id] !== q.correctIndex);
    if (newlyWrong.length > 0) {
      setWrongQuestionIds(prev => {
        const existing = new Set(prev);
        newlyWrong.forEach(q => existing.add(q.id));
        return Array.from(existing);
      });
    }
  }, [currentQuizzes, quizAnswers]);

  // Remove a question from wrong answer list
  const handleRemoveWrongQuestion = useCallback((id: number) => {
    setWrongQuestionIds(prev => prev.filter(qId => qId !== id));
  }, []);

  // Clear all wrong questions
  const handleClearAllWrong = useCallback(() => {
    setWrongQuestionIds([]);
  }, []);

  // Jump to specific lecture from wrong answer note
  const handleGoToLecture = useCallback((lectureId: number) => {
    setSelectedId(lectureId);
    setActiveTab('video');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const filteredLectures = useMemo(() => {
    try {
      const q = (searchQuery || '').trim().toLowerCase();
      return (allLectures || []).filter(lec => {
        if (!lec) return false;
        const isWest = lec.id <= 28;
        const isAsia = lec.id >= 29;

        if (filterRegion === 'west' && !isWest) return false;
        if (filterRegion === 'asia' && !isAsia) return false;

        if (!q) return true;

        const titleMatch = (lec.title || '').toLowerCase().includes(q);
        const topicMatch = (lec.topic || '').toLowerCase().includes(q);
        const bgMatch = (lec.bgSummary || '').toLowerCase().includes(q);
        const conceptMatch = Array.isArray(lec.coreConcepts) && lec.coreConcepts.some(
          c => (c.name || '').toLowerCase().includes(q) || (c.desc || '').toLowerCase().includes(q)
        );

        return titleMatch || topicMatch || bgMatch || conceptMatch;
      });
    } catch (e) {
      console.warn('Filter lectures error:', e);
      return allLectures || [];
    }
  }, [searchQuery, filterRegion]);

  const currentLecture: Lecture = useMemo(() => {
    const found = (allLectures || []).find(l => l && l.id === selectedId);
    return found || allLectures[0] || {
      id: 21,
      videoId: '1MjqXwzClr0',
      unit: '5-1',
      title: '신항로 개척과 종교 개혁',
      topic: '신항로 개척과 종교 개혁',
      bgSummary: '',
      coreConcepts: [],
      timeline: [],
      ramboTips: [],
      examQuestions: []
    };
  }, [selectedId]);

  const safeCompletedList = Array.isArray(completedLectures) ? completedLectures : [];
  const progressPercent = (allLectures && allLectures.length > 0)
    ? Math.round((safeCompletedList.length / allLectures.length) * 100)
    : 0;

  // Generate markdown notes safely
  const fullMarkdownContent = useMemo(() => {
    try {
      return (allLectures || []).map(lec => {
        const concepts = Array.isArray(lec.coreConcepts) 
          ? lec.coreConcepts.map(c => `- **${c.name}**: ${c.desc}`).join('\n') 
          : '';
        const timeline = Array.isArray(lec.timeline)
          ? lec.timeline.map(t => `- **${t.yearOrPeriod}** ${t.event} : ${t.significance}`).join('\n')
          : '';
        const tips = Array.isArray(lec.ramboTips)
          ? lec.ramboTips.map(tip => `⭐ ${tip}`).join('\n')
          : '';
        const exams = Array.isArray(lec.examQuestions)
          ? lec.examQuestions.map(q => `Q. ${q.q}\nA. ${q.a}\n(해설: ${q.explain})`).join('\n\n')
          : '';

        return `## [${lec.id}강] ${lec.title}\n` +
          `**단원:** ${lec.unit} | **주제:** ${lec.topic}\n\n` +
          `### 📌 람보쌤 칠판 판서 & 핵심 스토리\n${lec.bgSummary}\n\n` +
          `### 🖍️ 시험에 꼭 나오는 형광펜 핵심 개념\n${concepts}\n\n` +
          `### ⏳ 한눈에 보는 사건 타임라인\n${timeline}\n\n` +
          `### 📢 람보쌤 100점 족집게 암기 공식\n${tips}\n\n` +
          `### 💯 학교 시험 100점 서술형 & 단답형 족보\n${exams}\n\n---\n`;
      }).join('\n');
    } catch {
      return '';
    }
  }, []);

  // Safe clipboard copy
  const handleCopyMarkdown = useCallback(async () => {
    try {
      let success = false;
      if (typeof navigator !== 'undefined' && navigator?.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(fullMarkdownContent);
          success = true;
        } catch {
          // fallback
        }
      }

      if (!success && typeof document !== 'undefined') {
        const textarea = document.createElement('textarea');
        textarea.value = fullMarkdownContent;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '-9999px';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        try {
          document.execCommand('copy');
          success = true;
        } catch (e) {
          console.warn('execCommand failed:', e);
        }
        document.body.removeChild(textarea);
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Copy error suppressed:', err);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [fullMarkdownContent]);

  // Safe print handler
  const handlePrint = useCallback(() => {
    try {
      if (typeof window !== 'undefined' && typeof window.print === 'function') {
        window.print();
      }
    } catch (err) {
      console.warn('Window print is not supported in this frame environment:', err);
    }
  }, []);

  const handleSelectQuiz = useCallback((qId: number, optIdx: number) => {
    setQuizAnswers(prev => ({ ...(prev || {}), [qId]: optIdx }));
  }, []);

  const score = useMemo(() => {
    if (!Array.isArray(currentQuizzes) || currentQuizzes.length === 0) return 0;
    let count = 0;
    currentQuizzes.forEach(q => {
      if (q && quizAnswers[q.id] === q.correctIndex) count++;
    });
    return count;
  }, [quizAnswers, currentQuizzes]);

  const scorePercent = (Array.isArray(currentQuizzes) && currentQuizzes.length > 0)
    ? Math.round((score / currentQuizzes.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* Top Header - Pure Black & White with Red / Green / Blue Accents */}
      <header className="border-b-2 border-zinc-800 bg-black sticky top-0 z-40 px-4 lg:px-8 py-3.5 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/30 shrink-0 border border-red-400">
              <Flame className="w-6 h-6 text-white fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-red-600 text-white text-[11px] px-2.5 py-0.5 rounded-md font-black tracking-wide shadow-sm flex items-center gap-1">
                  빡공시대 2026
                </span>
                <span className="text-[11px] font-bold text-zinc-300 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-md">
                  중2 역사① 21강~34강 완벽 스터디 📖
                </span>
              </div>
              <h1 className="text-lg md:text-xl font-black tracking-tight text-white mt-0.5 flex items-center gap-2">
                보람쌤과 함께하는 내신 100점 꿀잼 스터디 🎬
              </h1>
            </div>
          </div>

          {/* Study Progress Box (Green Accent) */}
          <div className="flex items-center gap-4 bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-2 self-start md:self-auto shadow-inner">
            <div className="flex flex-col">
              <span className="text-[11px] text-zinc-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 완강 달성률
              </span>
              <span className="text-sm font-black text-emerald-400">
                {safeCompletedList.length} / {allLectures.length} 강 끝냄 ({progressPercent}%)
              </span>
            </div>
            <div className="w-24 md:w-32 bg-zinc-900 rounded-full h-2.5 overflow-hidden border border-zinc-800">
              <div 
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Navigation Tabs - Strict Palette: Red, Green, Blue, White, Black */}
        <div className="max-w-7xl mx-auto mt-3 flex items-center gap-2 border-t border-zinc-800 pt-2.5 overflow-x-auto text-xs sm:text-sm scrollbar-none">
          {/* TAB 1: 꿀잼 영상 (Red Theme) */}
          <button
            type="button"
            onClick={() => setActiveTab('video')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-black transition-all shrink-0 cursor-pointer border ${
              activeTab === 'video'
                ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-600/30 scale-[1.02]'
                : 'text-zinc-300 hover:text-white bg-zinc-900/80 border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <Tv className="w-4 h-4 text-white" />
            꿀잼 영상 스터디
            <span className="text-[10px] bg-white text-red-600 px-1.5 py-0.2 rounded font-black ml-0.5">
              추천!
            </span>
          </button>

          {/* TAB 2: 개념 강의 (Blue Theme) */}
          <button
            type="button"
            onClick={() => setActiveTab('lecture')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-black transition-all shrink-0 cursor-pointer border ${
              activeTab === 'lecture'
                ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/30 scale-[1.02]'
                : 'text-zinc-300 hover:text-white bg-zinc-900/80 border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            개념 강의 &amp; 판서
          </button>

          {/* TAB 3: 요약본 (White Theme) */}
          <button
            type="button"
            onClick={() => setActiveTab('summary')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-black transition-all shrink-0 cursor-pointer border ${
              activeTab === 'summary'
                ? 'bg-white text-black border-white shadow-lg shadow-white/25 scale-[1.02]'
                : 'text-zinc-300 hover:text-white bg-zinc-900/80 border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            비주얼 손필기장
          </button>

          {/* TAB 4: 실전 모의 퀴즈 (Blue Theme) */}
          <button
            type="button"
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-black transition-all shrink-0 cursor-pointer border ${
              activeTab === 'quiz'
                ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/30 scale-[1.02]'
                : 'text-zinc-300 hover:text-white bg-zinc-900/80 border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            실전 모의 퀴즈
          </button>

          {/* TAB 5: 오답 노트 (Red Theme with Badge) */}
          <button
            type="button"
            onClick={() => setActiveTab('wrong')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-black transition-all shrink-0 cursor-pointer border ${
              activeTab === 'wrong'
                ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-600/30 scale-[1.02]'
                : 'text-zinc-300 hover:text-white bg-zinc-900/80 border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            오답 노트
            {wrongQuestionIds.length > 0 && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-black leading-none ml-0.5 ${
                activeTab === 'wrong'
                  ? 'bg-black text-red-400'
                  : 'bg-red-600 text-white'
              }`}>
                {wrongQuestionIds.length}
              </span>
            )}
          </button>

          {/* TAB 6: 요약본 인쇄 복사 (Zinc/White Theme) */}
          <button
            type="button"
            onClick={() => setActiveTab('export')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-black transition-all shrink-0 cursor-pointer border ${
              activeTab === 'export'
                ? 'bg-zinc-800 text-white border-zinc-600 shadow scale-[1.02]'
                : 'text-zinc-300 hover:text-white bg-zinc-900/80 border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <FileText className="w-4 h-4" />
            요약본 인쇄 복사
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6">
        
        {/* TAB 1: 꿀잼 영상 스터디 (Fun Video Theater with Timestamps & Flash Quiz) */}
        {activeTab === 'video' && (
          <FunVideoTheater
            allLectures={allLectures}
            currentLecture={currentLecture}
            completedLectures={completedLectures}
            onSelectLecture={(id) => setSelectedId(id)}
            onToggleComplete={toggleComplete}
            onGoToQuiz={() => setActiveTab('quiz')}
          />
        )}

        {/* TAB 2: 개념 강의 & 판서 (21~34강 상세 교재 & 칠판 판서) */}
        {activeTab === 'lecture' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Sidebar: Lecture Navigation */}
            <aside className="lg:col-span-4 bg-zinc-950 border-2 border-zinc-800 rounded-3xl p-4.5 flex flex-col gap-3 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-300 flex items-center gap-1">
                  📚 람보쌤 강의 리스트 (21~34강)
                </span>
                <span className="text-[11px] font-bold text-red-400 bg-red-950/60 px-2 py-0.5 rounded-md border border-red-800/60">
                  총 {allLectures.length}강
                </span>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  placeholder="궁금한 키워드 검색! (예: 루터, 링컨, 양무)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs md:text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Region Filter Buttons */}
              <div className="flex gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => setFilterRegion('all')}
                  className={`flex-1 py-1.5 rounded-xl border font-bold transition cursor-pointer ${
                    filterRegion === 'all'
                      ? 'bg-white text-black border-white shadow'
                      : 'border-zinc-800 text-zinc-400 hover:bg-zinc-900'
                  }`}
                >
                  전체 (14)
                </button>
                <button
                  type="button"
                  onClick={() => setFilterRegion('west')}
                  className={`flex-1 py-1.5 rounded-xl border font-bold transition cursor-pointer ${
                    filterRegion === 'west'
                      ? 'bg-blue-600 text-white border-blue-500 shadow'
                      : 'border-zinc-800 text-zinc-400 hover:bg-zinc-900'
                  }`}
                >
                  서양사 (21~28)
                </button>
                <button
                  type="button"
                  onClick={() => setFilterRegion('asia')}
                  className={`flex-1 py-1.5 rounded-xl border font-bold transition cursor-pointer ${
                    filterRegion === 'asia'
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow'
                      : 'border-zinc-800 text-zinc-400 hover:bg-zinc-900'
                  }`}
                >
                  아시아 (29~34)
                </button>
              </div>

              {/* Lecture List */}
              <div className="space-y-2 max-h-[calc(100vh-320px)] overflow-y-auto pr-1">
                {filteredLectures.length === 0 ? (
                  <div className="p-6 text-center text-xs text-zinc-500 space-y-1">
                    <p className="font-bold text-zinc-400">검색된 강의가 없습니다.</p>
                    <p>다른 검색어를 입력하거나 필터를 '전체'로 바꿔보세요.</p>
                  </div>
                ) : (
                  filteredLectures.map(lec => {
                    const isDone = safeCompletedList.includes(lec.id);
                    const isCurrent = lec.id === selectedId;

                    return (
                      <div
                        key={`lecture-nav-${lec.id}`}
                        onClick={() => setSelectedId(lec.id)}
                        className={`group flex items-start justify-between gap-2 p-3 rounded-2xl cursor-pointer border transition-all ${
                          isCurrent
                            ? 'bg-zinc-900 border-l-4 border-red-600 text-white shadow-md'
                            : 'bg-black border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/60'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleComplete(lec.id);
                            }}
                            className="mt-0.5 text-zinc-600 hover:text-emerald-400 transition cursor-pointer"
                            title={isDone ? "공부 완료 취소" : "공부 완료 체크"}
                          >
                            {isDone ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Circle className="w-4 h-4 text-zinc-700" />
                            )}
                          </button>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-black text-red-400 bg-red-950/80 px-1.5 py-0.5 rounded border border-red-800/60">
                                {lec.id}강
                              </span>
                              <span className="text-[11px] text-zinc-500 font-mono">{lec.unit}</span>
                            </div>
                            <p className="text-xs font-bold text-zinc-200 mt-1 line-clamp-1 group-hover:text-white">
                              {(lec.title || '').replace(/2026 중2역사①\|\s*/, '')}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className={`w-4 h-4 mt-1 transition ${isCurrent ? 'text-red-500 translate-x-0.5' : 'text-zinc-700'}`} />
                      </div>
                    );
                  })
                )}
              </div>
            </aside>

            {/* Right Detailed Note Panel */}
            <article className="lg:col-span-8 bg-black border-2 border-zinc-800 rounded-3xl p-5 md:p-8 space-y-6 shadow-2xl">
              {/* Header inside lecture view */}
              <div className="border-b border-zinc-800 pb-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-600 text-white font-black text-sm px-3 py-1 rounded-xl shadow">
                      제 {currentLecture.id} 강
                    </span>
                    <span className="text-xs font-bold text-zinc-300 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-lg">
                      교과서 {currentLecture.unit}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Direct jump to Fun Video Center */}
                    <button
                      type="button"
                      onClick={() => setActiveTab('video')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-red-600 text-white hover:bg-red-500 transition shadow cursor-pointer"
                    >
                      <Tv className="w-3.5 h-3.5" />
                      꿀잼 영상관에서 보기 ↗
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleComplete(currentLecture.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                        safeCompletedList.includes(currentLecture.id)
                          ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                      }`}
                    >
                      {safeCompletedList.includes(currentLecture.id) ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          공부 완료함! 👍
                        </>
                      ) : (
                        <>
                          <Circle className="w-3.5 h-3.5 text-zinc-500" />
                          공부 완료로 체크
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <h2 className="text-xl md:text-2xl font-black text-white mt-3 leading-snug">
                  {currentLecture.title}
                </h2>
                <div className="mt-2 inline-flex items-center gap-1.5 bg-blue-950/50 border border-blue-800/60 px-3 py-1 rounded-xl text-xs md:text-sm font-bold text-blue-300">
                  <Lightbulb className="w-4 h-4 text-blue-400 shrink-0" />
                  오늘의 공부 핵심: {currentLecture.topic}
                </div>
              </div>

              {/* 1. 배경 및 스토리라인 총정리 */}
              <section className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-2">
                <h3 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-wide">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  1. 람보쌤 칠판 판서 &amp; 핵심 스토리 (이야기로 술술 풀기)
                </h3>
                <p className="text-sm text-zinc-300 leading-relaxed pt-1 font-normal">
                  {currentLecture.bgSummary}
                </p>
              </section>

              {/* 2. 핵심 개념 심층 분석 */}
              <section className="space-y-3">
                <h3 className="text-sm font-black text-blue-400 flex items-center gap-2 uppercase tracking-wide">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  2. 시험에 무조건 나오는 형광펜 핵심 개념
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {(currentLecture.coreConcepts || []).map((concept, idx) => (
                    <div 
                      key={`concept-${idx}`}
                      className="bg-zinc-950 border border-zinc-800 hover:border-blue-500 rounded-2xl p-4 transition shadow-sm"
                    >
                      <div className="font-bold text-sm text-white flex items-center gap-2">
                        <span className="w-5 h-5 rounded-lg bg-blue-600 text-white text-xs flex items-center justify-center font-black">
                          {idx + 1}
                        </span>
                        {concept.name}
                      </div>
                      <p className="text-xs sm:text-sm text-zinc-300 mt-2 pl-7 leading-relaxed">
                        {concept.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* 3. 사건 연표 및 역사적 의의 */}
              <section className="space-y-3">
                <h3 className="text-sm font-black text-blue-400 flex items-center gap-2 uppercase tracking-wide">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  3. 한눈에 보는 사건 타임라인 (연도별 순서 외우기)
                </h3>
                <div className="relative border-l-2 border-blue-900 ml-4 space-y-4 py-1">
                  {(currentLecture.timeline || []).map((item, idx) => (
                    <div key={`timeline-${idx}`} className="relative pl-6">
                      <div className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-blue-500 border-2 border-black" />
                      <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                        <span className="font-mono text-xs font-black text-blue-300 bg-blue-950 border border-blue-800 px-2 py-0.5 rounded-md">
                          {item.yearOrPeriod}
                        </span>
                        <span className="text-sm font-extrabold text-white">
                          {item.event}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-1">
                        ↳ <strong className="text-zinc-200 font-semibold">시험 포인트:</strong> {item.significance}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* 4. 람보쌤 시험 족집게 암기 비법 (Red Theme) */}
              <section className="bg-red-950/30 border-2 border-red-600/60 rounded-2xl p-5 space-y-3 shadow-lg">
                <h3 className="text-sm font-black text-red-400 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-red-500 fill-red-500" />
                  4. 람보쌤 육성 지원! 100점 족집게 암기 공식 &amp; 함정 피하기
                </h3>
                <ul className="space-y-2.5">
                  {(currentLecture.ramboTips || []).map((tip, idx) => (
                    <li key={`tip-${idx}`} className="text-xs sm:text-sm text-zinc-200 flex items-start gap-2 bg-black/80 p-3 rounded-xl border border-red-900/60">
                      <span className="text-red-400 font-black mt-0.5 text-base">🔴</span>
                      <span className="leading-relaxed font-semibold">{tip}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* 5. 실전 기출 단답형·서술형 문제 (Green Theme) */}
              <section className="space-y-3">
                <h3 className="text-sm font-black text-emerald-400 flex items-center gap-2 uppercase tracking-wide">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  5. 학교 시험 100점 서술형 &amp; 단답형 적중 족보
                </h3>
                <div className="space-y-3">
                  {(currentLecture.examQuestions || []).map((eq, idx) => (
                    <div key={`exam-${idx}`} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4.5 space-y-2">
                      <div className="text-sm font-bold text-white flex items-start gap-2">
                        <span className="text-emerald-400 font-black">Q{idx + 1}.</span>
                        <span>{eq.q}</span>
                      </div>
                      <div className="bg-black rounded-xl p-3.5 border border-zinc-800 text-xs space-y-1.5">
                        <div className="text-emerald-300 font-bold">
                          [모범 정답] {eq.a}
                        </div>
                        <div className="text-zinc-400">
                          💡 <span className="text-zinc-300 font-semibold">감점 안 당하는 채점 팁:</span> {eq.explain}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Next/Prev Buttons */}
              <div className="border-t border-zinc-800 pt-6 flex items-center justify-between">
                <button
                  type="button"
                  disabled={currentLecture.id <= 21}
                  onClick={() => setSelectedId(prev => Math.max(21, prev - 1))}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
                >
                  {currentLecture.id > 21 ? `← 이전 강의 (${currentLecture.id - 1}강)` : '첫 강의 (21강)'}
                </button>
                <span className="text-xs text-zinc-400 font-mono font-bold">
                  {currentLecture.id} / 34 강
                </span>
                <button
                  type="button"
                  disabled={currentLecture.id >= 34}
                  onClick={() => setSelectedId(prev => Math.min(34, prev + 1))}
                  className="px-4 py-2.5 rounded-xl text-xs font-black bg-red-600 text-white hover:bg-red-500 disabled:opacity-40 disabled:pointer-events-none transition flex items-center gap-1 shadow-md cursor-pointer"
                >
                  {currentLecture.id < 34 ? `다음 강의 (${currentLecture.id + 1}강) →` : '마지막 강의 (34강)'}
                </button>
              </div>
            </article>
          </div>
        )}

        {/* TAB 3: 요약본 (비주얼 손필기장) */}
        {activeTab === 'summary' && (
          <VisualStudyGuide />
        )}

        {/* TAB 4: 실전 모의 퀴즈 (랜덤 셔플 기능 탑재) */}
        {activeTab === 'quiz' && (
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Top Control Bar */}
            <div className="bg-black border-2 border-blue-900/60 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 bg-blue-600 text-white font-black text-xs px-3 py-1 rounded-md uppercase tracking-wider">
                    <Sparkles className="w-3 h-3 fill-white" />
                    랜덤 기출 시험지 (세트 #{quizSetCounter})
                  </div>
                  <h2 className="text-xl md:text-2xl font-black text-white mt-2">
                    21강 ~ 34강 전범위 실전 모의 퀴즈 🎯
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-300 mt-1">
                    총 <strong className="text-blue-400 font-bold">{fullQuizBank.length}문제</strong>의 실제 기출 문제 은행에서 
                    매번 다른 문제가 무작위로 섞여서 출제돼요!
                  </p>
                </div>

                {/* 🎲 모의 퀴즈 바꾸기 버튼 */}
                <button
                  type="button"
                  onClick={() => handleShuffleQuizzes(12)}
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm shadow-xl shadow-blue-600/30 transition shrink-0 cursor-pointer"
                >
                  <Shuffle className="w-4 h-4 text-white stroke-[3]" />
                  🎲 모의 퀴즈 바꾸기 (랜덤 새 문제)
                </button>
              </div>

              {/* Mode switch (10제, 15제, 전범위) */}
              <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-zinc-800 text-xs">
                <span className="text-zinc-400 font-bold">시험 문제 수:</span>
                <button
                  type="button"
                  onClick={() => handleShuffleQuizzes(10)}
                  className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-blue-500 text-zinc-200 font-bold transition cursor-pointer"
                >
                  10문제 뽑기
                </button>
                <button
                  type="button"
                  onClick={() => handleShuffleQuizzes(15)}
                  className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-blue-500 text-zinc-200 font-bold transition cursor-pointer"
                >
                  15문제 뽑기
                </button>
                <button
                  type="button"
                  onClick={() => handleShuffleQuizzes(fullQuizBank.length)}
                  className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-blue-500 text-zinc-200 font-bold transition cursor-pointer"
                >
                  전체 풀세트 ({fullQuizBank.length}문제 완벽 정복)
                </button>
              </div>

              {showQuizResults && (
                <div className="mt-5 p-5 rounded-2xl bg-zinc-950 border-2 border-emerald-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs text-zinc-400 font-bold">이번 시험 결과표</span>
                    <div className="text-2xl font-black text-emerald-400">
                      {score} / {currentQuizzes.length} 개 정답 ({scorePercent}점)
                    </div>
                    <p className="text-xs text-zinc-300">
                      {score === currentQuizzes.length 
                        ? '🎉 대박! 만점이야! 이번 중간·기말고사 무조건 1등급이다!' 
                        : '틀린 문제는 [오답 노트]에 자동으로 저장되었어요!'}
                    </p>
                  </div>

                  <div className="flex flex-wrap sm:flex-nowrap gap-2 self-stretch sm:self-auto">
                    {score < currentQuizzes.length && (
                      <button
                        type="button"
                        onClick={() => setActiveTab('wrong')}
                        className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-black bg-red-600 text-white hover:bg-red-500 transition flex items-center justify-center gap-1.5 shadow cursor-pointer"
                      >
                        <Bookmark className="w-3.5 h-3.5 fill-white" />
                        오답 노트로 복습하기 ({wrongQuestionIds.length}) →
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleShuffleQuizzes(currentQuizzes.length)}
                      className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-black bg-white text-black hover:bg-zinc-200 transition cursor-pointer"
                    >
                      새 문제로 재도전 🔄
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {(currentQuizzes || []).map((quiz, qIndex) => {
                if (!quiz) return null;
                const selectedOpt = quizAnswers[quiz.id];
                const isCorrect = selectedOpt === quiz.correctIndex;

                return (
                  <div 
                    key={`quiz-${quiz.id}-${quizSetCounter}-${qIndex}`}
                    className="bg-black border-2 border-zinc-800 rounded-3xl p-5 md:p-6 space-y-3.5 shadow-lg"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <span className="w-7 h-7 rounded-xl bg-blue-600 text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5 shadow">
                          {qIndex + 1}
                        </span>
                        <div>
                          <span className="text-[11px] font-bold text-blue-400 bg-blue-950 border border-blue-800 px-2 py-0.5 rounded-md">
                            {quiz.lectureTitle}
                          </span>
                          <p className="text-sm sm:text-base font-bold text-white mt-1 leading-relaxed">
                            {quiz.question}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 pl-0 sm:pl-10">
                      {(quiz.options || []).map((opt, oIndex) => {
                        const isChosen = selectedOpt === oIndex;
                        let btnStyle = "bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-blue-500 hover:bg-zinc-900";

                        if (showQuizResults) {
                          if (oIndex === quiz.correctIndex) {
                            btnStyle = "bg-emerald-600 text-white font-black border-emerald-400 shadow-md";
                          } else if (isChosen) {
                            btnStyle = "bg-red-600 text-white border-red-400 line-through";
                          } else {
                            btnStyle = "bg-zinc-950/60 text-zinc-600 border-zinc-800";
                          }
                        } else if (isChosen) {
                          btnStyle = "bg-blue-600 text-white font-black border-blue-400 shadow-md";
                        }

                        return (
                          <button
                            key={`opt-${quiz.id}-${oIndex}`}
                            type="button"
                            onClick={() => handleSelectQuiz(quiz.id, oIndex)}
                            className={`p-3.5 rounded-2xl border text-left text-xs sm:text-sm transition flex items-center justify-between cursor-pointer ${btnStyle}`}
                          >
                            <span>{oIndex + 1}. {opt}</span>
                            {showQuizResults && oIndex === quiz.correctIndex && (
                              <Check className="w-4 h-4 text-white shrink-0 stroke-[3]" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {showQuizResults && (
                      <div className="mt-3 pl-0 sm:pl-10">
                        <div className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-1.5 ${
                          isCorrect 
                            ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300'
                            : 'bg-red-950/60 border-red-700 text-red-300'
                        }`}>
                          <div className="font-black text-sm flex items-center gap-1.5">
                            {isCorrect ? '✅ 딩동댕! 정답이야!' : `❌ 아쉽다! 정답은 ${quiz.correctIndex + 1}번이야.`}
                          </div>
                          <div className="text-zinc-200">
                            <strong>해설:</strong> {quiz.explanation}
                          </div>
                          <div className="bg-black p-2.5 rounded-xl border border-zinc-800 text-red-300 font-bold flex items-center gap-1.5">
                            <Flame className="w-3.5 h-3.5 text-red-400 shrink-0 fill-red-400" />
                            <span>람보쌤 암기 팁: {quiz.tip}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                type="button"
                onClick={handleGradeQuiz}
                className="w-full sm:w-auto px-10 py-3.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-base shadow-xl shadow-red-600/30 transition cursor-pointer"
              >
                💯 채점하고 내 점수 확인하기!
              </button>
              <button
                type="button"
                onClick={() => handleShuffleQuizzes(currentQuizzes.length)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-200 font-bold text-sm hover:bg-zinc-800 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Shuffle className="w-4 h-4" />
                모의 퀴즈 바꾸기 (새 문제 풀기)
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: 오답 노트 (틀린 문제 집중 복습 및 재도전) */}
        {activeTab === 'wrong' && (
          <WrongAnswerNotes
            wrongQuestionIds={wrongQuestionIds}
            onRemoveWrongQuestion={handleRemoveWrongQuestion}
            onClearAllWrong={handleClearAllWrong}
            onGoToQuiz={() => setActiveTab('quiz')}
            onGoToLecture={handleGoToLecture}
          />
        )}

        {/* TAB 6: 요약본 인쇄 복사 (프린트 및 마크다운 복사 - Pure Paper Contrast) */}
        {activeTab === 'export' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-black border-2 border-zinc-800 rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Printer className="w-5 h-5 text-red-500" />
                  요약본 인쇄 복사 (나만의 필기장 소장용)
                </h2>
                <p className="text-xs sm:text-sm text-zinc-300 mt-1">
                  노션(Notion), 아이패드 굿노트(GoodNotes), 또는 A4 용지로 뽑아서 시험 직전에 가볍게 들고 다니며 외우세요!
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCopyMarkdown}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-black bg-blue-600 text-white hover:bg-blue-500 transition shadow cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-white stroke-[3]" /> : <Copy className="w-4 h-4" />}
                  {copied ? '복사 완료!' : '텍스트 전체 복사'}
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-zinc-900 border border-zinc-700 text-white hover:bg-zinc-800 transition cursor-pointer flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  프린트 인쇄 / PDF 저장
                </button>
              </div>
            </div>

            {/* High Contrast Paper Print Container */}
            <div className="bg-white text-black rounded-3xl p-8 font-mono text-xs max-h-[600px] overflow-y-auto whitespace-pre-wrap leading-relaxed shadow-2xl border-4 border-black selection:bg-black selection:text-white">
              {fullMarkdownContent}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-black px-4 py-6 text-center text-xs text-zinc-500">
        <p className="font-bold text-zinc-400">2026 빡공시대 중2 역사① (21~34강) 전범위 시험 대비 꿀잼 스터디 노트</p>
        <p className="mt-1 text-zinc-600">빨강(필수암기) · 초록(완강성공) · 파랑(사건흐름) · 흰색/검정(고대비 필기)로 가장 쉽게 정복하세요!</p>
      </footer>
    </div>
  );
}
