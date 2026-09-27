import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  allLectures, 
  fullQuizBank,
  getRandomQuizzes, 
  Lecture, 
  QuizQuestion 
} from './data';
import { FunVideoTheater } from './components/FunVideoTheater';
import { FunMemeChatHub } from './components/FunMemeChatHub';
import { VisualStudyGuide } from './components/VisualStudyGuide';
import { WrongAnswerNotes } from './components/WrongAnswerNotes';
import { sound } from './utils/audio';
import { 
  BookOpen, 
  CheckCircle2, 
  Circle, 
  Play, 
  Search, 
  FileText, 
  Sparkles, 
  HelpCircle, 
  Copy, 
  Check, 
  ChevronRight, 
  Flame, 
  Shuffle, 
  Lightbulb, 
  Printer,
  Bookmark,
  Tv,
  Award,
  Volume2,
  VolumeX,
  MessageCircle,
  Zap
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
  // Default to 'video' for easy video-based learning
  const [activeTab, setActiveTab] = useState<'video' | 'memeChat' | 'lecture' | 'summary' | 'quiz' | 'wrong' | 'export'>('video');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRegion, setFilterRegion] = useState<'all' | 'west' | 'asia'>('all');
  
  // Safe initial state for completed lectures
  const [completedLectures, setCompletedLectures] = useState<number[]>(getInitialCompletedLectures);
  const [copied, setCopied] = useState(false);
  const [isMuted, setIsMuted] = useState(() => sound.getMuted());

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
      const isAdding = !list.includes(id);
      if (isAdding) {
        sound.playFanfare();
      } else {
        sound.playClick();
      }
      return isAdding ? [...list, id] : list.filter(item => item !== id);
    });
  }, []);

  const handleToggleSound = useCallback(() => {
    const nextMuted = sound.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) {
      sound.playCorrect();
    }
  }, []);

  // Shuffle quiz questions safely
  const handleShuffleQuizzes = useCallback((count = 12) => {
    sound.playClick();
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
    const newlyWrong = currentQuizzes.filter(q => q && quizAnswers[q.id] !== q.correctIndex);
    if (newlyWrong.length === 0 && currentQuizzes.length > 0) {
      sound.playFanfare();
    } else {
      sound.playCorrect();
    }

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

  // Student Title Level based on progress
  const studentTitle = useMemo(() => {
    const count = safeCompletedList.length;
    if (count >= 13) return { rank: "👑 내신 1등급 람보 수제자", color: "text-rose-600 bg-rose-50 border-rose-200" };
    if (count >= 8) return { rank: "🚀 우등생 역사 꿈나무", color: "text-blue-600 bg-blue-50 border-blue-200" };
    if (count >= 4) return { rank: "⚡ 벼락치기 샛별", color: "text-emerald-700 bg-emerald-50 border-emerald-200" };
    return { rank: "🥔 역사 감자 탈출 중", color: "text-amber-800 bg-amber-50 border-amber-200" };
  }, [safeCompletedList.length]);

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
          `### 📌 보람쌤 칠판 판서 & 핵심 스토리\n${lec.bgSummary}\n\n` +
          `### 🖍️ 시험에 꼭 나오는 형광펜 핵심 개념\n${concepts}\n\n` +
          `### ⏳ 한눈에 보는 사건 타임라인\n${timeline}\n\n` +
          `### 📢 100점 족집게 암기 공식\n${tips}\n\n` +
          `### 💯 학교 시험 100점 서술형 & 단답형 족보\n${exams}\n\n---\n`;
      }).join('\n');
    } catch {
      return '';
    }
  }, []);

  const handleCopyMarkdown = useCallback(async () => {
    sound.playClick();
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
      sound.playFanfare();
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Copy error suppressed:', err);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [fullMarkdownContent]);

  const handlePrint = useCallback(() => {
    sound.playClick();
    try {
      if (typeof window !== 'undefined' && typeof window.print === 'function') {
        window.print();
      }
    } catch (err) {
      console.warn('Window print is not supported in this frame environment:', err);
    }
  }, []);

  const handleSelectQuiz = useCallback((qId: number, optIdx: number) => {
    sound.playClick();
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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Top Header - Pure Crisp White Canvas with Red / Green / Blue Accents */}
      <header className="border-b-2 border-slate-200 bg-white sticky top-0 z-40 px-4 lg:px-8 py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-600 flex items-center justify-center shadow-md shadow-rose-600/20 shrink-0 border border-rose-500 text-white">
              <Flame className="w-6 h-6 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-rose-600 text-white text-[11px] px-2.5 py-0.5 rounded-lg font-black tracking-wide shadow-2xs flex items-center gap-1">
                  빡공시대 2026
                </span>
                <span className="text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-lg">
                  중2 역사① 21~34강 전범위 스터디 📖
                </span>
                <span className={`text-[11px] font-black px-2 py-0.5 rounded-lg border ${studentTitle.color}`}>
                  {studentTitle.rank}
                </span>
              </div>
              <h1 className="text-lg md:text-xl font-black tracking-tight text-slate-900 mt-0.5 flex items-center gap-2">
                보람쌤과 함께하는 내신 100점 꿀잼 스터디 🎬
              </h1>
            </div>
          </div>

          {/* Study Progress Box & Sound Button */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            {/* Sound Toggle Button */}
            <button
              type="button"
              onClick={handleToggleSound}
              className={`p-2 rounded-2xl border transition cursor-pointer flex items-center gap-1 text-xs font-bold ${
                isMuted
                  ? 'bg-slate-100 text-slate-400 border-slate-200 hover:text-slate-700'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-2xs'
              }`}
              title={isMuted ? "소리 켜기" : "소리 끄기 (무음 모드)"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{isMuted ? "음소거" : "효과음 ON"}</span>
            </button>

            {/* Study Progress Box (Green Accent) */}
            <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 shadow-2xs">
              <div className="flex flex-col">
                <span className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 완강 달성률
                </span>
                <span className="text-sm font-black text-emerald-700">
                  {safeCompletedList.length} / {allLectures.length} 강 완료 ({progressPercent}%)
                </span>
              </div>
              <div className="w-24 md:w-32 bg-slate-200 rounded-full h-2.5 overflow-hidden border border-slate-300">
                <div 
                  className="bg-emerald-500 h-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs - Clean White Segmented Bar with Red/Green/Blue Accents */}
        <div className="max-w-7xl mx-auto mt-3 flex items-center gap-2 border-t border-slate-100 pt-2.5 overflow-x-auto text-xs sm:text-sm scrollbar-none">
          {/* TAB 1: 꿀잼 영상 (Red Theme) */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveTab('video');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl font-black transition-all shrink-0 cursor-pointer border ${
              activeTab === 'video'
                ? 'bg-rose-600 text-white border-rose-600 shadow-sm scale-[1.02]'
                : 'text-slate-600 hover:text-slate-900 bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Tv className="w-4 h-4" />
            꿀잼 영상 스터디
            <span className="text-[10px] bg-white text-rose-600 px-1.5 py-0.2 rounded-md font-black ml-0.5">
              추천!
            </span>
          </button>

          {/* TAB 2: 3초 밈 & 인물 단톡방 (New Dopamine Zone) */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveTab('memeChat');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl font-black transition-all shrink-0 cursor-pointer border ${
              activeTab === 'memeChat'
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm scale-[1.02]'
                : 'text-slate-600 hover:text-slate-900 bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <MessageCircle className="w-4 h-4 text-rose-500" />
            3초 밈 &amp; 인물 단톡방
            <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded-md font-black ml-0.5">
              꿀잼!
            </span>
          </button>

          {/* TAB 3: 개념 강의 (Blue Theme) */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveTab('lecture');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl font-black transition-all shrink-0 cursor-pointer border ${
              activeTab === 'lecture'
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm scale-[1.02]'
                : 'text-slate-600 hover:text-slate-900 bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            개념 교재 &amp; 칠판 판서
          </button>

          {/* TAB 4: 요약본 (White / Highlighter Theme) */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveTab('summary');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl font-black transition-all shrink-0 cursor-pointer border ${
              activeTab === 'summary'
                ? 'bg-amber-500 text-white border-amber-500 shadow-sm scale-[1.02]'
                : 'text-slate-600 hover:text-slate-900 bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            비주얼 손필기장
          </button>

          {/* TAB 5: 실전 모의 퀴즈 (Blue Theme) */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveTab('quiz');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl font-black transition-all shrink-0 cursor-pointer border ${
              activeTab === 'quiz'
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm scale-[1.02]'
                : 'text-slate-600 hover:text-slate-900 bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            실전 모의 퀴즈
          </button>

          {/* TAB 6: 오답 노트 (Red Theme with Badge) */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveTab('wrong');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl font-black transition-all shrink-0 cursor-pointer border ${
              activeTab === 'wrong'
                ? 'bg-rose-600 text-white border-rose-600 shadow-sm scale-[1.02]'
                : 'text-slate-600 hover:text-slate-900 bg-slate-50 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            오답 노트
            {wrongQuestionIds.length > 0 && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-black leading-none ml-0.5 ${
                activeTab === 'wrong'
                  ? 'bg-white text-rose-700'
                  : 'bg-rose-600 text-white'
              }`}>
                {wrongQuestionIds.length}
              </span>
            )}
          </button>

          {/* TAB 7: 요약본 인쇄 복사 (Clean Theme) */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveTab('export');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl font-black transition-all shrink-0 cursor-pointer border ${
              activeTab === 'export'
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm scale-[1.02]'
                : 'text-slate-600 hover:text-slate-900 bg-slate-50 border-slate-200 hover:bg-slate-100'
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
            onGoToChat={() => setActiveTab('memeChat')}
          />
        )}

        {/* TAB 2: 3초 밈 & 역사 인물 단톡방 (New Dopamine Zone) */}
        {activeTab === 'memeChat' && (
          <FunMemeChatHub
            currentLecture={currentLecture}
            allLectures={allLectures}
            onSelectLecture={(id) => setSelectedId(id)}
            onGoToVideo={() => setActiveTab('video')}
            onGoToQuiz={() => setActiveTab('quiz')}
          />
        )}

        {/* TAB 3: 개념 강의 & 칠판 판서 (21~34강 상세 교재 & 칠판 판서) */}
        {activeTab === 'lecture' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Sidebar: Lecture Navigation */}
            <aside className="lg:col-span-4 bg-white border-2 border-slate-200 rounded-3xl p-4.5 flex flex-col gap-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-800 flex items-center gap-1">
                  📚 보람쌤 강의 리스트 (21~34강)
                </span>
                <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200">
                  총 {allLectures.length}강
                </span>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="궁금한 키워드 검색! (예: 루터, 링컨, 양무)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-9 pr-3 py-2 text-xs md:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-rose-500 focus:bg-white"
                />
              </div>

              {/* Region Filter Buttons */}
              <div className="flex gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setFilterRegion('all');
                  }}
                  className={`flex-1 py-1.5 rounded-xl border font-bold transition cursor-pointer ${
                    filterRegion === 'all'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  전체 (14)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setFilterRegion('west');
                  }}
                  className={`flex-1 py-1.5 rounded-xl border font-bold transition cursor-pointer ${
                    filterRegion === 'west'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  서양사 (21~28)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setFilterRegion('asia');
                  }}
                  className={`flex-1 py-1.5 rounded-xl border font-bold transition cursor-pointer ${
                    filterRegion === 'asia'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  아시아 (29~34)
                </button>
              </div>

              {/* Lecture List */}
              <div className="space-y-2 max-h-[calc(100vh-320px)] overflow-y-auto pr-1">
                {filteredLectures.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400 space-y-1">
                    <p className="font-bold text-slate-600">검색된 강의가 없습니다.</p>
                    <p>다른 검색어를 입력하거나 필터를 '전체'로 바꿔보세요.</p>
                  </div>
                ) : (
                  filteredLectures.map(lec => {
                    const isDone = safeCompletedList.includes(lec.id);
                    const isCurrent = lec.id === selectedId;

                    return (
                      <div
                        key={`lecture-nav-${lec.id}`}
                        onClick={() => {
                          sound.playClick();
                          setSelectedId(lec.id);
                        }}
                        className={`group flex items-start justify-between gap-2 p-3 rounded-2xl cursor-pointer border transition-all ${
                          isCurrent
                            ? 'bg-rose-50/50 border-l-4 border-rose-600 text-slate-900 shadow-2xs'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleComplete(lec.id);
                            }}
                            className="mt-0.5 text-slate-400 hover:text-emerald-600 transition cursor-pointer"
                            title={isDone ? "공부 완료 취소" : "공부 완료 체크"}
                          >
                            {isDone ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-300" />
                            )}
                          </button>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-black text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                                {lec.id}강
                              </span>
                              <span className="text-[11px] text-slate-400 font-mono">{lec.unit}</span>
                            </div>
                            <p className="text-xs font-bold text-slate-800 mt-1 line-clamp-1 group-hover:text-rose-600">
                              {(lec.title || '').replace(/2026 중2역사①\|\s*/, '')}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className={`w-4 h-4 mt-1 transition ${isCurrent ? 'text-rose-600 translate-x-0.5' : 'text-slate-300'}`} />
                      </div>
                    );
                  })
                )}
              </div>
            </aside>

            {/* Right Detailed Note Panel */}
            <article className="lg:col-span-8 bg-white border-2 border-slate-200 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
              {/* Header inside lecture view */}
              <div className="border-b border-slate-100 pb-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-rose-600 text-white font-black text-sm px-3 py-1 rounded-xl shadow-2xs">
                      제 {currentLecture.id} 강
                    </span>
                    <span className="text-xs font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg">
                      교과서 {currentLecture.unit}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setActiveTab('memeChat');
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-slate-900 text-white hover:bg-slate-800 transition shadow-2xs cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-rose-400" />
                      인물 단톡방 보기 ➔
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setActiveTab('video');
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-rose-600 text-white hover:bg-rose-500 transition shadow-2xs cursor-pointer"
                    >
                      <Tv className="w-3.5 h-3.5" />
                      영상관에서 보기 ↗
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleComplete(currentLecture.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                        safeCompletedList.includes(currentLecture.id)
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {safeCompletedList.includes(currentLecture.id) ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          공부 완료함! 👍
                        </>
                      ) : (
                        <>
                          <Circle className="w-3.5 h-3.5 text-slate-400" />
                          공부 완료로 체크
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <h2 className="text-xl md:text-2xl font-black text-slate-900 mt-3 leading-snug">
                  {currentLecture.title}
                </h2>
                <div className="mt-2 inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 px-3 py-1 rounded-xl text-xs md:text-sm font-bold text-blue-800">
                  <Lightbulb className="w-4 h-4 text-blue-600 shrink-0" />
                  오늘의 공부 핵심: {currentLecture.topic}
                </div>
              </div>

              {/* 1. 배경 및 스토리라인 총정리 */}
              <section className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 uppercase tracking-wide">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  1. 보람쌤 칠판 판서 &amp; 핵심 스토리 (이야기로 술술 풀기)
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed pt-1 font-normal">
                  {currentLecture.bgSummary}
                </p>
              </section>

              {/* 2. 핵심 개념 심층 분석 */}
              <section className="space-y-3">
                <h3 className="text-sm font-black text-blue-700 flex items-center gap-2 uppercase tracking-wide">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  2. 시험에 무조건 나오는 형광펜 핵심 개념
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {(currentLecture.coreConcepts || []).map((concept, idx) => (
                    <div 
                      key={`concept-${idx}`}
                      className="bg-white border-2 border-slate-200 hover:border-blue-400 rounded-2xl p-4 transition shadow-2xs"
                    >
                      <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-lg bg-blue-600 text-white text-xs flex items-center justify-center font-black">
                          {idx + 1}
                        </span>
                        {concept.name}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 mt-2 pl-7 leading-relaxed">
                        {concept.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* 3. 사건 연표 및 역사적 의의 */}
              <section className="space-y-3">
                <h3 className="text-sm font-black text-blue-700 flex items-center gap-2 uppercase tracking-wide">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  3. 한눈에 보는 사건 타임라인 (연도별 순서 외우기)
                </h3>
                <div className="relative border-l-2 border-blue-200 ml-4 space-y-4 py-1">
                  {(currentLecture.timeline || []).map((item, idx) => (
                    <div key={`timeline-${idx}`} className="relative pl-6">
                      <div className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-blue-600 border-2 border-white" />
                      <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                        <span className="font-mono text-xs font-black text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                          {item.yearOrPeriod}
                        </span>
                        <span className="text-sm font-black text-slate-900">
                          {item.event}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        ↳ <strong className="text-slate-700 font-semibold">시험 포인트:</strong> {item.significance}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* 4. 보람쌤 시험 족집게 암기 비법 (Red Theme) */}
              <section className="bg-rose-50/70 border-2 border-rose-300 rounded-2xl p-5 space-y-3 shadow-2xs">
                <h3 className="text-sm font-black text-rose-800 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-rose-600 fill-rose-600" />
                  4. 보람쌤 육성 지원! 100점 족집게 암기 공식 &amp; 함정 피하기
                </h3>
                <ul className="space-y-2.5">
                  {(currentLecture.ramboTips || []).map((tip, idx) => (
                    <li key={`tip-${idx}`} className="text-xs sm:text-sm text-slate-800 flex items-start gap-2 bg-white p-3.5 rounded-xl border border-rose-200">
                      <span className="text-rose-600 font-black mt-0.5 text-base">🔴</span>
                      <span className="leading-relaxed font-semibold">{tip}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* 5. 실전 기출 단답형·서술형 문제 (Green Theme) */}
              <section className="space-y-3">
                <h3 className="text-sm font-black text-emerald-800 flex items-center gap-2 uppercase tracking-wide">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  5. 학교 시험 100점 서술형 &amp; 단답형 적중 족보
                </h3>
                <div className="space-y-3">
                  {(currentLecture.examQuestions || []).map((eq, idx) => (
                    <div key={`exam-${idx}`} className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-2">
                      <div className="text-sm font-bold text-slate-900 flex items-start gap-2">
                        <span className="text-emerald-600 font-black">Q{idx + 1}.</span>
                        <span>{eq.q}</span>
                      </div>
                      <div className="bg-white rounded-xl p-3.5 border border-slate-200 text-xs space-y-1.5">
                        <div className="text-emerald-800 font-black">
                          [모범 정답] {eq.a}
                        </div>
                        <div className="text-slate-600">
                          💡 <span className="text-slate-800 font-semibold">감점 안 당하는 채점 팁:</span> {eq.explain}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Next/Prev Buttons */}
              <div className="border-t border-slate-100 pt-6 flex items-center justify-between">
                <button
                  type="button"
                  disabled={currentLecture.id <= 21}
                  onClick={() => {
                    sound.playClick();
                    setSelectedId(prev => Math.max(21, prev - 1));
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
                >
                  {currentLecture.id > 21 ? `← 이전 강의 (${currentLecture.id - 1}강)` : '첫 강의 (21강)'}
                </button>
                <span className="text-xs text-slate-500 font-mono font-bold">
                  {currentLecture.id} / 34 강
                </span>
                <button
                  type="button"
                  disabled={currentLecture.id >= 34}
                  onClick={() => {
                    sound.playClick();
                    setSelectedId(prev => Math.min(34, prev + 1));
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-black bg-rose-600 text-white hover:bg-rose-500 disabled:opacity-40 disabled:pointer-events-none transition flex items-center gap-1 shadow-sm cursor-pointer"
                >
                  {currentLecture.id < 34 ? `다음 강의 (${currentLecture.id + 1}강) →` : '마지막 강의 (34강)'}
                </button>
              </div>
            </article>
          </div>
        )}

        {/* TAB 4: 요약본 (비주얼 손필기장) */}
        {activeTab === 'summary' && (
          <VisualStudyGuide />
        )}

        {/* TAB 5: 실전 모의 퀴즈 (랜덤 셔플 기능 탑재) */}
        {activeTab === 'quiz' && (
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Top Control Bar */}
            <div className="bg-white border-2 border-blue-200 rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 font-black text-xs px-3 py-1 rounded-xl uppercase tracking-wider border border-blue-200">
                    <Sparkles className="w-3 h-3 fill-blue-600" />
                    랜덤 기출 시험지 (세트 #{quizSetCounter})
                  </div>
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 mt-2">
                    21강 ~ 34강 전범위 실전 모의 퀴즈 🎯
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    총 <strong className="text-blue-600 font-bold">{fullQuizBank.length}문제</strong>의 실제 기출 문제 은행에서 
                    매번 다른 문제가 무작위로 섞여서 출제돼요!
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleShuffleQuizzes(12)}
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm shadow-sm transition shrink-0 cursor-pointer"
                >
                  <Shuffle className="w-4 h-4 text-white stroke-[3]" />
                  🎲 모의 퀴즈 바꾸기 (새 문제)
                </button>
              </div>

              {/* Mode switch (10제, 15제, 전범위) */}
              <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-slate-100 text-xs">
                <span className="text-slate-500 font-bold">시험 문제 수:</span>
                <button
                  type="button"
                  onClick={() => handleShuffleQuizzes(10)}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-400 text-slate-700 font-bold transition cursor-pointer"
                >
                  10문제 뽑기
                </button>
                <button
                  type="button"
                  onClick={() => handleShuffleQuizzes(15)}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-400 text-slate-700 font-bold transition cursor-pointer"
                >
                  15문제 뽑기
                </button>
                <button
                  type="button"
                  onClick={() => handleShuffleQuizzes(fullQuizBank.length)}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-400 text-slate-700 font-bold transition cursor-pointer"
                >
                  전체 풀세트 ({fullQuizBank.length}문제 완벽 정복)
                </button>
              </div>

              {showQuizResults && (
                <div className="mt-5 p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fadeIn">
                  <div className="space-y-1">
                    <span className="text-xs text-emerald-800 font-bold">이번 시험 결과표</span>
                    <div className="text-2xl font-black text-emerald-900">
                      {score} / {currentQuizzes.length} 개 정답 ({scorePercent}점)
                    </div>
                    <p className="text-xs text-emerald-800 font-medium">
                      {score === currentQuizzes.length 
                        ? '🎉 대박! 만점이야! 이번 중간·기말고사 무조건 1등급이다!' 
                        : '틀린 문제는 [오답 노트]에 자동으로 저장되었어요!'}
                    </p>
                  </div>

                  <div className="flex flex-wrap sm:flex-nowrap gap-2 self-stretch sm:self-auto">
                    {score < currentQuizzes.length && (
                      <button
                        type="button"
                        onClick={() => {
                          sound.playClick();
                          setActiveTab('wrong');
                        }}
                        className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-black bg-rose-600 text-white hover:bg-rose-500 transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                      >
                        <Bookmark className="w-3.5 h-3.5 fill-white" />
                        오답 노트로 복습하기 ({wrongQuestionIds.length}) →
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleShuffleQuizzes(currentQuizzes.length)}
                      className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-black bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 transition cursor-pointer"
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
                    className="bg-white border-2 border-slate-200 rounded-3xl p-5 md:p-6 space-y-3.5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <span className="w-7 h-7 rounded-xl bg-blue-600 text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                          {qIndex + 1}
                        </span>
                        <div>
                          <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                            {quiz.lectureTitle}
                          </span>
                          <p className="text-sm sm:text-base font-bold text-slate-900 mt-1 leading-relaxed">
                            {quiz.question}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 pl-0 sm:pl-10">
                      {(quiz.options || []).map((opt, oIndex) => {
                        const isChosen = selectedOpt === oIndex;
                        let btnStyle = "bg-slate-50 border-slate-200 text-slate-700 hover:border-blue-400 hover:bg-blue-50/50";

                        if (showQuizResults) {
                          if (oIndex === quiz.correctIndex) {
                            btnStyle = "bg-emerald-600 text-white font-black border-emerald-600 shadow-sm";
                          } else if (isChosen) {
                            btnStyle = "bg-rose-50 text-rose-700 border-rose-300 line-through";
                          } else {
                            btnStyle = "bg-slate-50 text-slate-400 border-slate-200";
                          }
                        } else if (isChosen) {
                          btnStyle = "bg-blue-600 text-white font-black border-blue-600 shadow-sm";
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
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                            : 'bg-rose-50 border-rose-300 text-rose-900'
                        }`}>
                          <div className="font-black text-sm flex items-center gap-1.5">
                            {isCorrect ? '✅ 딩동댕! 정답이야!' : `❌ 아쉽다! 정답은 ${quiz.correctIndex + 1}번이야.`}
                          </div>
                          <div className="text-slate-700">
                            <strong>해설:</strong> {quiz.explanation}
                          </div>
                          <div className="bg-white p-2.5 rounded-xl border border-rose-200 text-rose-800 font-bold flex items-center gap-1.5">
                            <Flame className="w-3.5 h-3.5 text-rose-600 shrink-0 fill-rose-600" />
                            <span>보람쌤 암기 팁: {quiz.tip}</span>
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
                className="w-full sm:w-auto px-10 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-base shadow-sm transition cursor-pointer"
              >
                💯 채점하고 내 점수 확인하기!
              </button>
              <button
                type="button"
                onClick={() => handleShuffleQuizzes(currentQuizzes.length)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Shuffle className="w-4 h-4" />
                모의 퀴즈 바꾸기 (새 문제 풀기)
              </button>
            </div>
          </div>
        )}

        {/* TAB 6: 오답 노트 (틀린 문제 집중 복습 및 재도전) */}
        {activeTab === 'wrong' && (
          <WrongAnswerNotes
            wrongQuestionIds={wrongQuestionIds}
            onRemoveWrongQuestion={handleRemoveWrongQuestion}
            onClearAllWrong={handleClearAllWrong}
            onGoToQuiz={() => setActiveTab('quiz')}
            onGoToLecture={handleGoToLecture}
          />
        )}

        {/* TAB 7: 요약본 인쇄 복사 (프린트 및 마크다운 복사) */}
        {activeTab === 'export' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
              <div>
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Printer className="w-5 h-5 text-rose-600" />
                  요약본 인쇄 복사 (나만의 필기장 소장용)
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  노션(Notion), 아이패드 굿노트(GoodNotes), 또는 A4 용지로 뽑아서 시험 직전에 가볍게 들고 다니며 외우세요!
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCopyMarkdown}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-black bg-blue-600 text-white hover:bg-blue-500 transition shadow-2xs cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-white stroke-[3]" /> : <Copy className="w-4 h-4" />}
                  {copied ? '복사 완료!' : '텍스트 전체 복사'}
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition cursor-pointer flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  프린트 인쇄 / PDF 저장
                </button>
              </div>
            </div>

            {/* Clean Paper Container */}
            <div className="bg-white text-slate-900 rounded-3xl p-8 font-mono text-xs max-h-[600px] overflow-y-auto whitespace-pre-wrap leading-relaxed shadow-sm border-2 border-slate-200 selection:bg-rose-500 selection:text-white">
              {fullMarkdownContent}
            </div>
          </div>
        )}
      </main>

      {/* Footer - Clean Crisp White */}
      <footer className="border-t border-slate-200 bg-white px-4 py-6 text-center text-xs text-slate-500 mt-12">
        <p className="font-bold text-slate-700">2026 빡공시대 중2 역사① (21~34강) 전범위 시험 대비 꿀잼 스터디 노트</p>
        <p className="mt-1 text-slate-400">빨강(필수암기) · 초록(완강성공) · 파랑(사건흐름) · 흰색(고대비 필기)로 가장 쉽고 센스있게 정복하세요!</p>
      </footer>
    </div>
  );
}
