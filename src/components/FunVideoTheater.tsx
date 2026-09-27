import React, { useState, useMemo, useCallback } from 'react';
import { Lecture, funVideoData, VideoTimestamp } from '../data';
import { 
  Play, 
  CheckCircle2, 
  Sparkles, 
  Flame, 
  HelpCircle, 
  RotateCcw, 
  Volume2, 
  ExternalLink, 
  ChevronRight, 
  ChevronLeft,
  Tv,
  Zap,
  Bookmark,
  Award,
  Layers,
  Check
} from 'lucide-react';

interface FunVideoTheaterProps {
  allLectures: Lecture[];
  currentLecture: Lecture;
  completedLectures: number[];
  onSelectLecture: (id: number) => void;
  onToggleComplete: (id: number) => void;
  onGoToQuiz: () => void;
}

export function FunVideoTheater({
  allLectures,
  currentLecture,
  completedLectures,
  onSelectLecture,
  onToggleComplete,
  onGoToQuiz
}: FunVideoTheaterProps) {
  // Current seeking start time in seconds
  const [seekSeconds, setSeekSeconds] = useState<number>(0);
  const [activeSpeed, setActiveSpeed] = useState<string>('1.25x');
  const [quizSelectedOption, setQuizSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [theaterMode, setTheaterMode] = useState<'split' | 'cinema'>('split');

  const funInfo = useMemo(() => {
    return funVideoData[currentLecture.id] || {
      lectureId: currentLecture.id,
      funTitle: currentLecture.title,
      funMnemonic: currentLecture.ramboTips[0] || '보람쌤의 100점 빡공 공식!',
      funDescription: currentLecture.bgSummary,
      timestamps: [
        { time: "01:00", seconds: 60, title: "핵심 스토리 오프닝", type: "humor", desc: "강의 시작과 배경 이야기" },
        { time: "03:30", seconds: 210, title: "시험 족집게 키워드", type: "exam", desc: "시험에 무조건 나오는 핵심 개념" },
        { time: "07:00", seconds: 420, title: "3초 컷 총정리", type: "summary", desc: "이번 강의 완벽 마무리" }
      ],
      quickQuiz: {
        question: currentLecture.examQuestions[0]?.q || "이번 강의 핵심 개념은?",
        options: ["보기 1", "보기 2", "보기 3", "보기 4"],
        correctIndex: 0,
        funReaction: "🎉 정답! 빡공 완료!"
      }
    };
  }, [currentLecture]);

  const isCompleted = completedLectures.includes(currentLecture.id);

  // When changing lecture, reset quiz
  const handleSelectLecture = useCallback((id: number) => {
    setSeekSeconds(0);
    setQuizSelectedOption(null);
    setQuizSubmitted(false);
    onSelectLecture(id);
  }, [onSelectLecture]);

  // Jump to specific timestamp
  const handleJumpToTimestamp = useCallback((seconds: number) => {
    setSeekSeconds(seconds);
  }, []);

  // Previous & Next lecture
  const currentIndex = allLectures.findIndex(l => l.id === currentLecture.id);
  const prevLecture = currentIndex > 0 ? allLectures[currentIndex - 1] : null;
  const nextLecture = currentIndex < allLectures.length - 1 ? allLectures[currentIndex + 1] : null;

  // Embedded video iframe src
  const embedSrc = useMemo(() => {
    const base = `https://www.youtube-nocookie.com/embed/${currentLecture.videoId}`;
    const params = new URLSearchParams({
      autoplay: '0',
      rel: '0',
      modestbranding: '1',
      playsinline: '1'
    });
    if (seekSeconds > 0) {
      params.set('start', seekSeconds.toString());
      params.set('autoplay', '1');
    }
    return `${base}?${params.toString()}`;
  }, [currentLecture.videoId, seekSeconds]);

  return (
    <div className="space-y-6">
      {/* 21~34강 쾌속 탐색 레일 (Red, Green, Blue, White, Black Navigation Strip) */}
      <div className="bg-black border-2 border-zinc-800 rounded-2xl p-3 shadow-xl">
        <div className="flex items-center justify-between mb-2 px-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
            <span className="text-xs font-black text-white uppercase tracking-wider">
              21강~34강 꿀잼 영상 숏컷 레일
            </span>
          </div>
          <span className="text-[11px] text-zinc-400 font-semibold">
            <span className="text-emerald-400 font-bold">{completedLectures.length}</span> / {allLectures.length}강 완강
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-zinc-700">
          {allLectures.map(lec => {
            const isSelected = lec.id === currentLecture.id;
            const isDone = completedLectures.includes(lec.id);
            return (
              <button
                key={lec.id}
                type="button"
                onClick={() => handleSelectLecture(lec.id)}
                className={`shrink-0 px-3 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer border ${
                  isSelected
                    ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-600/30 scale-105'
                    : isDone
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700/60 hover:border-emerald-500'
                    : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-600 hover:text-white'
                }`}
              >
                {isDone ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                ) : (
                  <Play className={`w-3 h-3 ${isSelected ? 'fill-white text-white' : 'text-blue-400'}`} />
                )}
                <span>{lec.id}강</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Video & Study Center */}
      <div className={`grid gap-6 ${theaterMode === 'cinema' ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-12'}`}>
        
        {/* Left Column: Video Player & Timestamp Highlights */}
        <div className={theaterMode === 'cinema' ? 'w-full' : 'lg:col-span-7 xl:col-span-8 space-y-4'}>
          {/* Video Player Card */}
          <div className="bg-black border-2 border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
            {/* Player Top Bar */}
            <div className="bg-zinc-950 px-4 py-3 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="bg-red-600 text-white text-[11px] font-black px-2.5 py-0.5 rounded-md flex items-center gap-1">
                  <Tv className="w-3.5 h-3.5" />
                  {currentLecture.id}강 영상관
                </span>
                <span className="text-white text-xs font-bold truncate max-w-[200px] sm:max-w-xs">
                  {funInfo.funTitle}
                </span>
              </div>

              {/* View & Speed Toggle */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800 text-[11px]">
                  {['1.0x', '1.25x', '1.5x'].map(speed => (
                    <button
                      key={speed}
                      type="button"
                      onClick={() => setActiveSpeed(speed)}
                      className={`px-2 py-0.5 rounded font-bold cursor-pointer transition ${
                        activeSpeed === speed
                          ? 'bg-blue-600 text-white'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      {speed}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setTheaterMode(prev => prev === 'split' ? 'cinema' : 'split')}
                  className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-[11px] font-bold border border-zinc-800 transition cursor-pointer"
                >
                  {theaterMode === 'split' ? '📺 시네마 확대' : '📑 분할 모드'}
                </button>
              </div>
            </div>

            {/* YouTube Iframe Container */}
            <div className="relative w-full aspect-video bg-black">
              <iframe
                key={embedSrc}
                src={embedSrc}
                title={`${currentLecture.title} 빡공시대 강의 영상`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            {/* Video Controls & Navigation Footer */}
            <div className="p-4 bg-zinc-950 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {prevLecture && (
                  <button
                    type="button"
                    onClick={() => handleSelectLecture(prevLecture.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-bold border border-zinc-800 transition cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    이전 {prevLecture.id}강
                  </button>
                )}
                {nextLecture && (
                  <button
                    type="button"
                    onClick={() => handleSelectLecture(nextLecture.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-bold border border-zinc-800 transition cursor-pointer"
                  >
                    다음 {nextLecture.id}강
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Complete Toggle Button */}
              <button
                type="button"
                onClick={() => onToggleComplete(currentLecture.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                  isCompleted
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30'
                    : 'bg-zinc-900 text-white border-zinc-700 hover:border-emerald-500 hover:bg-emerald-950/40'
                }`}
              >
                <CheckCircle2 className={`w-4 h-4 ${isCompleted ? 'text-white' : 'text-emerald-400'}`} />
                {isCompleted ? '완강 완료! (체크 해제)' : '이 영상 완강했어요!'}
              </button>
            </div>
          </div>

          {/* 🎯 꿀잼 킬링 파트 & 3초 암기송 타임스탬프 (High Energy Moments) */}
          <div className="bg-black border-2 border-zinc-800 rounded-3xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-red-600 text-white">
                  <Flame className="w-4 h-4 fill-white" />
                </span>
                <h3 className="text-sm font-black text-white">
                  클릭 한 번에 바로 점프! 꿀잼 킬링 타임스탬프
                </h3>
              </div>
              <span className="text-[11px] text-zinc-400 font-semibold">
                원하는 구간을 누르면 즉시 재생됩니다
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {funInfo.timestamps.map((ts: VideoTimestamp, idx: number) => {
                const isSong = ts.type === 'song';
                const isExam = ts.type === 'exam';
                const isHumor = ts.type === 'humor';
                
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleJumpToTimestamp(ts.seconds)}
                    className="text-left p-3 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-red-500 hover:bg-zinc-900 transition group cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black text-red-400 bg-red-950/80 border border-red-800/70 px-2 py-0.5 rounded-md flex items-center gap-1 group-hover:bg-red-600 group-hover:text-white transition">
                        <Play className="w-3 h-3 fill-current" />
                        {ts.time}
                      </span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                        isSong 
                          ? 'bg-blue-950 text-blue-300 border border-blue-800' 
                          : isExam 
                          ? 'bg-red-950 text-red-300 border border-red-800' 
                          : isHumor
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-zinc-800 text-zinc-300'
                      }`}>
                        {isSong ? '🎵 3초 암기송' : isExam ? '🎯 시험 족집게' : isHumor ? '😂 꿀잼 썰' : '⚡ 핵심 요약'}
                      </span>
                    </div>
                    <p className="text-xs font-black text-white group-hover:text-red-300 transition">
                      {ts.title}
                    </p>
                    <p className="text-[11px] text-zinc-400 mt-0.5 line-clamp-1">
                      {ts.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ⚡ 영상 직후 30초 꿀잼 번개 퀴즈 (Instant Flash Quiz) */}
          <div className="bg-gradient-to-br from-black via-zinc-950 to-blue-950/40 border-2 border-blue-900/60 rounded-3xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-blue-900/40 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-blue-600 text-white">
                  <Zap className="w-4 h-4 fill-white" />
                </span>
                <div>
                  <h3 className="text-sm font-black text-white">
                    영상 보고 10초 번개 퀴즈!
                  </h3>
                  <span className="text-[11px] text-blue-300">
                    방금 본 영상 기억력 바로 테스트!
                  </span>
                </div>
              </div>

              {quizSubmitted && (
                <button
                  type="button"
                  onClick={() => {
                    setQuizSelectedOption(null);
                    setQuizSubmitted(false);
                  }}
                  className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" /> 다시 풀기
                </button>
              )}
            </div>

            <p className="text-sm font-bold text-white leading-snug">
              Q. {funInfo.quickQuiz.question}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {funInfo.quickQuiz.options.map((opt: string, optIdx: number) => {
                const isSelected = quizSelectedOption === optIdx;
                const isCorrect = optIdx === funInfo.quickQuiz.correctIndex;
                let btnStyle = 'bg-zinc-900 border-zinc-800 text-zinc-200 hover:border-blue-500 hover:bg-zinc-800';

                if (quizSubmitted) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-600 text-white border-emerald-400 font-black';
                  } else if (isSelected && !isCorrect) {
                    btnStyle = 'bg-red-600 text-white border-red-400 line-through';
                  } else {
                    btnStyle = 'bg-zinc-900/60 text-zinc-500 border-zinc-800';
                  }
                } else if (isSelected) {
                  btnStyle = 'bg-blue-600 text-white border-blue-400 font-black';
                }

                return (
                  <button
                    key={optIdx}
                    type="button"
                    disabled={quizSubmitted}
                    onClick={() => {
                      setQuizSelectedOption(optIdx);
                      setQuizSubmitted(true);
                    }}
                    className={`p-3 rounded-xl border text-left text-xs font-bold transition flex items-center justify-between cursor-pointer ${btnStyle}`}
                  >
                    <span>{optIdx + 1}. {opt}</span>
                    {quizSubmitted && isCorrect && (
                      <Check className="w-4 h-4 text-white shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Reaction message */}
            {quizSubmitted && (
              <div className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                quizSelectedOption === funInfo.quickQuiz.correctIndex
                  ? 'bg-emerald-950/80 border-emerald-600 text-emerald-200'
                  : 'bg-red-950/80 border-red-600 text-red-200'
              }`}>
                {quizSelectedOption === funInfo.quickQuiz.correctIndex ? (
                  <span>{funInfo.quickQuiz.funReaction}</span>
                ) : (
                  <span>💥 아쉬워요! 정답은 [{funInfo.quickQuiz.correctIndex + 1}번]입니다. 위의 타임스탬프를 눌러 다시 30초 복습해보세요!</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: 듀얼 실시간 판서 스터디 노트 (White/Black with Red, Green, Blue Highlighting) */}
        {theaterMode === 'split' && (
          <div className="lg:col-span-5 xl:col-span-4 space-y-4">
            {/* 칠판 판서 카드 (Blackboard style with high legibility) */}
            <div className="bg-black border-2 border-zinc-800 rounded-3xl p-5 shadow-2xl space-y-4 text-zinc-100">
              
              {/* Header */}
              <div className="border-b border-zinc-800 pb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                    람보쌤 3분 컷 칠판 판서
                  </span>
                  <span className="text-[11px] font-mono font-bold text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                    단원 {currentLecture.unit}
                  </span>
                </div>
                <h3 className="text-base font-black text-white leading-tight">
                  {currentLecture.topic}
                </h3>
              </div>

              {/* 1. 보람쌤의 꿀잼 암기 공식 (Green Theme) */}
              <div className="bg-emerald-950/40 border-2 border-emerald-600/60 rounded-2xl p-4">
                <div className="flex items-center gap-1.5 text-xs font-black text-emerald-400 mb-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                  보람쌤 입에 착 붙는 100점 암기 공식
                </div>
                <p className="text-xs font-bold text-emerald-100 leading-relaxed bg-black/60 p-2.5 rounded-xl border border-emerald-700/50">
                  {funInfo.funMnemonic}
                </p>
              </div>

              {/* 2. 시험 1위 족집게 키워드 (Red Theme) */}
              <div className="bg-red-950/30 border border-red-800/60 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-black text-red-400">
                  <Flame className="w-4 h-4 text-red-500 fill-red-500" />
                  시험지 열자마자 보이는 킬러 키워드 3
                </div>
                <div className="space-y-1.5 text-xs">
                  {currentLecture.coreConcepts.slice(0, 3).map((c, i) => (
                    <div key={i} className="bg-black/60 p-2 rounded-xl border border-red-900/40">
                      <span className="font-black text-red-300 block mb-0.5">
                        🔴 {c.name}
                      </span>
                      <span className="text-zinc-300 text-[11px] leading-relaxed block">
                        {c.desc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. 사건 전개 타임라인 (Blue Theme) */}
              <div className="bg-blue-950/30 border border-blue-800/60 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-black text-blue-400">
                  <Bookmark className="w-4 h-4 text-blue-400" />
                  한눈에 꿰뚫는 사건 흐름 (인과관계)
                </div>
                <div className="space-y-2 relative pl-2 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-blue-800">
                  {currentLecture.timeline.slice(0, 4).map((t, idx) => (
                    <div key={idx} className="relative pl-4 text-xs">
                      <span className="absolute -left-1 top-1 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-blue-950" />
                      <span className="font-mono font-bold text-blue-300 block text-[11px]">
                        {t.yearOrPeriod}
                      </span>
                      <span className="font-bold text-white block">
                        {t.event}
                      </span>
                      <span className="text-[11px] text-zinc-400 block">
                        {t.significance}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={onGoToQuiz}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs transition shadow-md shadow-blue-600/30 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  실전 100점 모의고사 풀러 가기
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
