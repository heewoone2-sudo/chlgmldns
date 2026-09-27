import React, { useState, useMemo, useCallback } from 'react';
import { fullQuizBank, QuizQuestion } from '../data';
import { 
  Bookmark, 
  RotateCcw, 
  Trash2, 
  CheckCircle2, 
  Flame, 
  HelpCircle, 
  Sparkles, 
  Eye, 
  EyeOff, 
  BookOpen, 
  Award, 
  Check, 
  X,
  Shuffle
} from 'lucide-react';

interface WrongAnswerNotesProps {
  wrongQuestionIds: number[];
  onRemoveWrongQuestion: (id: number) => void;
  onClearAllWrong: () => void;
  onGoToQuiz: () => void;
  onGoToLecture: (lectureId: number) => void;
}

export function WrongAnswerNotes({
  wrongQuestionIds,
  onRemoveWrongQuestion,
  onClearAllWrong,
  onGoToQuiz,
  onGoToLecture
}: WrongAnswerNotesProps) {
  // Retest answers state for each question: questionId -> selectedOptionIndex
  const [retestAnswers, setRetestAnswers] = useState<Record<number, number>>({});
  // Mastered question IDs in this session
  const [masteredIds, setMasteredIds] = useState<number[]>([]);
  // Toggle between Practice Mode (hide answers until clicked) and Review Mode (show all explanations)
  const [showAllExplanations, setShowAllExplanations] = useState(false);
  // Region filter
  const [filterSection, setFilterSection] = useState<'all' | 'west' | 'asia'>('all');

  // Lookup actual question objects from fullQuizBank
  const wrongQuestions: QuizQuestion[] = useMemo(() => {
    if (!Array.isArray(wrongQuestionIds) || wrongQuestionIds.length === 0) return [];
    const idSet = new Set(wrongQuestionIds);
    return fullQuizBank.filter(q => idSet.has(q.id));
  }, [wrongQuestionIds]);

  // Filtered wrong questions
  const filteredQuestions = useMemo(() => {
    return wrongQuestions.filter(q => {
      const isWest = q.lectureId <= 28;
      const isAsia = q.lectureId >= 29;

      if (filterSection === 'west' && !isWest) return false;
      if (filterSection === 'asia' && !isAsia) return false;
      return true;
    });
  }, [wrongQuestions, filterSection]);

  const handleSelectOption = useCallback((questionId: number, optionIndex: number) => {
    setRetestAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
    const question = fullQuizBank.find(q => q.id === questionId);
    if (question && question.correctIndex === optionIndex) {
      setMasteredIds(prev => prev.includes(questionId) ? prev : [...prev, questionId]);
    }
  }, []);

  const handleResetRetest = useCallback(() => {
    setRetestAnswers({});
    setMasteredIds([]);
  }, []);

  // Empty state when there are no wrong questions
  if (wrongQuestions.length === 0) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-black border-2 border-zinc-800 rounded-3xl p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden">
          <div className="w-20 h-20 rounded-3xl bg-zinc-900 border-2 border-zinc-700 text-emerald-400 flex items-center justify-center mx-auto mb-6 shadow-inner">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>

          <div className="inline-flex items-center gap-1.5 bg-emerald-950/80 text-emerald-300 text-xs px-3 py-1 rounded-md font-black border border-emerald-700/60 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            현재 오답 제로 (0문제)
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white">
            현재 오답 노트가 완벽하게 깨끗해요! 🎉
          </h2>

          <p className="text-sm sm:text-base text-zinc-300 max-w-lg mx-auto mt-3 leading-relaxed">
            아직 틀린 문제가 없거나 모든 오답을 마스터했어요!<br/>
            <strong className="text-blue-400">[실전 모의 퀴즈]</strong>를 풀고 채점하면, 아쉽게 틀린 문제들이 이곳에 자동으로 모여 반복 복습할 수 있어요.
          </p>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={onGoToQuiz}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-sm shadow-xl shadow-red-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 stroke-[2.5]" />
              실전 모의 퀴즈 풀러 가기 🎯
            </button>
          </div>
        </div>
      </div>
    );
  }

  const masteredCount = masteredIds.filter(id => wrongQuestionIds.includes(id)).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Header Card */}
      <div className="bg-black border-2 border-red-600/60 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-red-600 text-white font-black text-xs px-3 py-1 rounded-md uppercase tracking-wider shadow">
              <Bookmark className="w-3.5 h-3.5 fill-white" />
              100점 벼락치기 오답 정복 노트
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white mt-2 flex items-center gap-2">
              틀린 문제 집중 반복 학습 📝
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 mt-1">
              실전 퀴즈에서 아쉽게 틀린 <strong className="text-red-400 font-extrabold">{wrongQuestions.length}문제</strong>가 모여 있어요.
              완전히 내 것으로 만들 때까지 반복해서 풀어보세요!
            </p>
          </div>

          {/* Quick Clear & Reset Buttons */}
          <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowAllExplanations(prev => !prev)}
              className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl text-xs font-bold bg-zinc-900 border border-zinc-700 hover:border-blue-500 text-zinc-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {showAllExplanations ? (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-zinc-400" />
                  해설 숨기고 다시 풀기
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5 text-blue-400" />
                  정답·해설 전체 보기
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleResetRetest}
              className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl text-xs font-bold bg-zinc-900 border border-zinc-700 hover:border-emerald-500 text-zinc-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
              답안 초기화
            </button>

            <button
              type="button"
              onClick={onClearAllWrong}
              className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl text-xs font-bold bg-red-950/60 border border-red-800 text-red-300 hover:bg-red-900 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              오답 전체 비우기
            </button>
          </div>
        </div>

        {/* Progress Bar & Filter Bar */}
        <div className="mt-6 pt-5 border-t border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Mastered Progress */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-zinc-400 flex items-center gap-1">
                <Award className="w-3 h-3 text-emerald-400" />
                이번 세션 마스터 달성
              </span>
              <span className="text-sm font-black text-emerald-400">
                {masteredCount} / {wrongQuestions.length} 문제 맞춤
              </span>
            </div>
            <div className="w-32 bg-zinc-900 border border-zinc-800 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${wrongQuestions.length > 0 ? (masteredCount / wrongQuestions.length) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* Region Filters */}
          <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800 self-start sm:self-auto text-xs">
            <button
              type="button"
              onClick={() => setFilterSection('all')}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                filterSection === 'all'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              전체 ({wrongQuestions.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterSection('west')}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                filterSection === 'west'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              서양사 (21~28강)
            </button>
            <button
              type="button"
              onClick={() => setFilterSection('asia')}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                filterSection === 'asia'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              아시아 (29~34강)
            </button>
          </div>
        </div>
      </div>

      {/* Wrong Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((q, idx) => {
          const selectedOption = retestAnswers[q.id];
          const isAnswered = selectedOption !== undefined;
          const isCorrect = isAnswered && selectedOption === q.correctIndex;
          const isMastered = masteredIds.includes(q.id);
          const showAnswer = showAllExplanations || isAnswered;

          return (
            <div 
              key={q.id}
              className={`bg-black border-2 rounded-3xl p-5 sm:p-6 transition-all shadow-xl ${
                isCorrect 
                  ? 'border-emerald-600/80' 
                  : isAnswered 
                  ? 'border-red-600/80' 
                  : 'border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-red-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-black text-blue-400">
                    {q.lectureTitle}
                  </span>
                  {isMastered && (
                    <span className="text-[10px] font-black bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-400" />
                      마스터 완료
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => onGoToLecture(q.lectureId)}
                    className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-blue-400 border border-zinc-800 transition text-xs flex items-center gap-1 cursor-pointer"
                    title="해당 강의 개념 보러가기"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-[11px] font-bold">강의 보기</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onRemoveWrongQuestion(q.id)}
                    className="p-1.5 rounded-lg bg-zinc-900 hover:bg-red-950 text-zinc-400 hover:text-red-400 border border-zinc-800 transition cursor-pointer"
                    title="오답 노트에서 삭제"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Question Text */}
              <h3 className="text-base sm:text-lg font-bold text-white mb-4 leading-snug">
                {q.question}
              </h3>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                {q.options.map((opt, optIdx) => {
                  const isThisSelected = selectedOption === optIdx;
                  const isThisCorrect = optIdx === q.correctIndex;

                  let btnStyle = 'bg-zinc-950 border-zinc-800 text-zinc-200 hover:border-blue-500 hover:bg-zinc-900';

                  if (showAnswer) {
                    if (isThisCorrect) {
                      btnStyle = 'bg-emerald-600 text-white border-emerald-400 font-black shadow-md';
                    } else if (isThisSelected && !isThisCorrect) {
                      btnStyle = 'bg-red-600 text-white border-red-400 line-through';
                    } else {
                      btnStyle = 'bg-zinc-950 text-zinc-600 border-zinc-800';
                    }
                  } else if (isThisSelected) {
                    btnStyle = 'bg-blue-600 text-white border-blue-400 font-black';
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      className={`text-left p-3 rounded-xl border text-xs sm:text-sm font-semibold transition flex items-center justify-between cursor-pointer ${btnStyle}`}
                    >
                      <span>
                        <span className="font-mono mr-2 font-bold">{optIdx + 1}.</span>
                        {opt}
                      </span>
                      {showAnswer && isThisCorrect && (
                        <Check className="w-4 h-4 text-white shrink-0" />
                      )}
                      {showAnswer && isThisSelected && !isThisCorrect && (
                        <X className="w-4 h-4 text-white shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Tip */}
              {showAnswer && (
                <div className="mt-3 pt-3 border-t border-zinc-800/80 space-y-2 animate-fadeIn">
                  <div className="bg-zinc-950 p-3 rounded-2xl border border-zinc-800">
                    <span className="text-[11px] font-black text-emerald-400 block mb-1">
                      💡 정답: [{q.correctIndex + 1}번] {q.options[q.correctIndex]}
                    </span>
                    <p className="text-xs text-zinc-300 leading-relaxed font-medium">
                      {q.explanation}
                    </p>
                  </div>

                  {q.tip && (
                    <div className="bg-red-950/40 p-2.5 rounded-xl border border-red-800/50 flex items-center gap-2 text-xs font-bold text-red-200">
                      <Flame className="w-4 h-4 text-red-400 shrink-0 fill-red-400" />
                      <span>{q.tip}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
