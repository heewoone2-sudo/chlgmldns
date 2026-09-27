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
        <div className="bg-slate-950/90 border-2 border-amber-500/30 rounded-3xl p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden">
          <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border-2 border-amber-400/40 text-amber-400 flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Bookmark className="w-10 h-10 fill-amber-400/20" />
          </div>

          <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 text-xs px-3 py-1 rounded-full font-bold border border-emerald-500/30 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            현재 오답 제로 (0문제)
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white">
            현재 오답 노트가 깨끗해요! 🎉
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto mt-3 leading-relaxed">
            아직 틀린 문제가 없거나 모든 오답을 마스터했어요!<br/>
            <strong>[실전 모의 퀴즈]</strong>를 풀고 채점하면, 아쉽게 틀린 문제들이 이곳에 자동으로 모여 반복 복습할 수 있어요.
          </p>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={onGoToQuiz}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-500 to-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
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
      <div className="bg-slate-950/90 border-2 border-rose-500/40 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-rose-500 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow">
              <Bookmark className="w-3.5 h-3.5 fill-white" />
              100점 벼락치기 오답 정복 노트
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white mt-2 flex items-center gap-2">
              틀린 문제 집중 반복 학습 📝
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              실전 퀴즈에서 아쉽게 틀린 <strong className="text-rose-400 font-extrabold">{wrongQuestions.length}문제</strong>가 모여 있어요.
              완전히 내 것으로 만들 때까지 반복해서 풀어보세요!
            </p>
          </div>

          {/* Quick Clear & Reset Buttons */}
          <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowAllExplanations(prev => !prev)}
              className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 border border-slate-700 hover:border-amber-400 text-slate-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {showAllExplanations ? (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                  해설 숨기기 (실전 모드)
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  해설 전체 펼치기
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleResetRetest}
              className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 border border-slate-700 hover:border-amber-400 text-slate-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
              title="다시 풀기 선택 상태 초기화"
            >
              <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
              답안 초기화
            </button>

            <button
              type="button"
              onClick={onClearAllWrong}
              className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-950/60 border border-rose-800/80 hover:bg-rose-900 text-rose-300 transition flex items-center justify-center gap-1.5 cursor-pointer"
              title="오답 노트에 저장된 모든 문제를 비웁니다"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              오답 전체 비우기
            </button>
          </div>
        </div>

        {/* Progress & Encouragement banner */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">이번 세션 정복:</span>
            <span className="bg-emerald-500/20 text-emerald-300 font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              {masteredCount} / {wrongQuestions.length} 문제 정답 맞힘 ({wrongQuestions.length > 0 ? Math.round((masteredCount / wrongQuestions.length) * 100) : 0}%)
            </span>
          </div>

          <div className="text-amber-300 font-medium flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span>람보쌤: "오답을 잡아야 시험 때 똑같은 실수 안 해! 파이팅!"</span>
          </div>
        </div>

        {/* Region Filter Buttons */}
        <div className="flex gap-2 mt-4 pt-3 border-t border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setFilterSection('all')}
            className={`px-3 py-1.5 rounded-xl border font-bold transition cursor-pointer ${
              filterSection === 'all'
                ? 'bg-amber-400 text-slate-950 border-amber-400 shadow'
                : 'border-slate-800 text-slate-400 hover:bg-slate-900'
            }`}
          >
            전체 오답 ({wrongQuestions.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterSection('west')}
            className={`px-3 py-1.5 rounded-xl border font-bold transition cursor-pointer ${
              filterSection === 'west'
                ? 'bg-amber-400 text-slate-950 border-amber-400 shadow'
                : 'border-slate-800 text-slate-400 hover:bg-slate-900'
            }`}
          >
            서양사 파트 (21~28강)
          </button>
          <button
            type="button"
            onClick={() => setFilterSection('asia')}
            className={`px-3 py-1.5 rounded-xl border font-bold transition cursor-pointer ${
              filterSection === 'asia'
                ? 'bg-amber-400 text-slate-950 border-amber-400 shadow'
                : 'border-slate-800 text-slate-400 hover:bg-slate-900'
            }`}
          >
            아시아사 파트 (29~34강)
          </button>
        </div>
      </div>

      {/* Wrong Question Cards List */}
      <div className="space-y-4">
        {filteredQuestions.map((quiz, qIndex) => {
          const selectedOption = retestAnswers[quiz.id];
          const hasAttempted = selectedOption !== undefined;
          const isCorrect = selectedOption === quiz.correctIndex;
          const isMastered = masteredIds.includes(quiz.id);

          return (
            <div 
              key={`wrong-quiz-${quiz.id}`}
              className={`bg-slate-950/80 border rounded-3xl p-5 md:p-6 space-y-4 shadow-lg transition-all ${
                isCorrect 
                  ? 'border-emerald-500/50 ring-1 ring-emerald-500/20' 
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Header info */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-xl bg-rose-500 text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5 shadow">
                    {qIndex + 1}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onGoToLecture(quiz.lectureId)}
                        className="text-[11px] font-bold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/20 flex items-center gap-1 cursor-pointer transition"
                        title="이 강의 바로 듣기"
                      >
                        <BookOpen className="w-3 h-3" />
                        {quiz.lectureTitle}
                      </button>

                      {isMastered && (
                        <span className="text-[10px] font-black text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                          <Check className="w-3 h-3 stroke-[3]" />
                          정복 완료!
                        </span>
                      )}
                    </div>

                    <p className="text-sm sm:text-base font-bold text-white mt-1.5 leading-relaxed">
                      {quiz.question}
                    </p>
                  </div>
                </div>

                {/* Remove from wrong answer list button */}
                <button
                  type="button"
                  onClick={() => onRemoveWrongQuestion(quiz.id)}
                  className="text-xs font-bold text-slate-400 hover:text-rose-400 bg-slate-900 border border-slate-800 hover:border-rose-900/60 px-2.5 py-1.5 rounded-xl transition flex items-center gap-1 shrink-0 cursor-pointer"
                  title="이 문제를 오답 노트에서 삭제합니다"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">오답 삭제</span>
                </button>
              </div>

              {/* Options grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 pl-0 sm:pl-10">
                {(quiz.options || []).map((opt, oIndex) => {
                  const isChosen = selectedOption === oIndex;
                  let btnStyle = "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/80";

                  if (hasAttempted || showAllExplanations) {
                    if (oIndex === quiz.correctIndex) {
                      btnStyle = "bg-emerald-500/25 border-emerald-500 text-emerald-200 font-extrabold shadow-sm";
                    } else if (isChosen) {
                      btnStyle = "bg-rose-500/20 border-rose-500 text-rose-300 line-through";
                    }
                  } else if (isChosen) {
                    btnStyle = "bg-amber-400 text-slate-950 font-black border-amber-400 shadow-md";
                  }

                  return (
                    <button
                      key={`wrong-opt-${quiz.id}-${oIndex}`}
                      type="button"
                      onClick={() => handleSelectOption(quiz.id, oIndex)}
                      className={`p-3.5 rounded-2xl border text-left text-xs sm:text-sm transition flex items-center justify-between cursor-pointer ${btnStyle}`}
                    >
                      <span>{oIndex + 1}. {opt}</span>
                      {(hasAttempted || showAllExplanations) && oIndex === quiz.correctIndex && (
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 stroke-[3]" />
                      )}
                      {hasAttempted && isChosen && !isCorrect && (
                        <X className="w-4 h-4 text-rose-400 shrink-0 stroke-[3]" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Retest Result Feedback & Explanation */}
              {(hasAttempted || showAllExplanations) && (
                <div className="mt-3 pl-0 sm:pl-10 space-y-2">
                  <div className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-1.5 ${
                    isCorrect 
                      ? 'bg-emerald-950/40 border-emerald-700 text-emerald-300'
                      : 'bg-rose-950/40 border-rose-700 text-rose-300'
                  }`}>
                    <div className="font-black text-sm flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        {isCorrect ? '✅ 딩동댕! 이제 완벽하게 이해했어!' : `❌ 아쉽다! 정답은 ${quiz.correctIndex + 1}번이야.`}
                      </div>

                      {isCorrect && (
                        <button
                          type="button"
                          onClick={() => onRemoveWrongQuestion(quiz.id)}
                          className="text-xs bg-emerald-500 text-slate-950 font-black px-2.5 py-1 rounded-lg hover:bg-emerald-400 transition cursor-pointer"
                        >
                          🏆 정복 완료! 오답에서 빼기
                        </button>
                      )}
                    </div>
                    <div className="text-slate-200">
                      <strong>명쾌 해설:</strong> {quiz.explanation}
                    </div>
                    <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 text-amber-300 font-bold flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span>람보쌤 암기 팁: {quiz.tip}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <button
          type="button"
          onClick={onGoToQuiz}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-400/25 hover:bg-amber-300 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <HelpCircle className="w-4 h-4" />
          모의 퀴즈로 실력 다시 점검하기 🎯
        </button>

        <button
          type="button"
          onClick={handleResetRetest}
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-800 border border-slate-700 text-slate-200 font-bold text-sm hover:bg-slate-700 transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          오답 전체 다시 풀기
        </button>
      </div>
    </div>
  );
}
