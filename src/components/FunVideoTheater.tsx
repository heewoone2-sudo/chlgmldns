import React, { useState, useMemo, useCallback } from 'react';
import { Lecture, funVideoData, VideoTimestamp } from '../data';
import { sound } from '../utils/audio';
import { 
  Play, 
  CheckCircle2, 
  Sparkles, 
  Flame, 
  RotateCcw, 
  Tv, 
  Zap, 
  Award, 
  Check, 
  ChevronRight, 
  ChevronLeft,
  Volume2,
  ExternalLink,
  BookOpen,
  MessageCircle
} from 'lucide-react';

interface FunVideoTheaterProps {
  allLectures: Lecture[];
  currentLecture: Lecture;
  completedLectures: number[];
  onSelectLecture: (id: number) => void;
  onToggleComplete: (id: number) => void;
  onGoToQuiz: () => void;
  onGoToChat: () => void;
}

export function FunVideoTheater({
  allLectures,
  currentLecture,
  completedLectures,
  onSelectLecture,
  onToggleComplete,
  onGoToQuiz,
  onGoToChat
}: FunVideoTheaterProps) {
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

  const handleSelectLecture = useCallback((id: number) => {
    sound.playClick();
    setSeekSeconds(0);
    setQuizSelectedOption(null);
    setQuizSubmitted(false);
    onSelectLecture(id);
  }, [onSelectLecture]);

  const handleJumpToTimestamp = useCallback((seconds: number) => {
    sound.playClick();
    setSeekSeconds(seconds);
  }, []);

  const handleQuizAnswer = useCallback((optIdx: number) => {
    setQuizSelectedOption(optIdx);
    setQuizSubmitted(true);
    if (optIdx === funInfo.quickQuiz.correctIndex) {
      sound.playCorrect();
    } else {
      sound.playWrong();
    }
  }, [funInfo.quickQuiz.correctIndex]);

  const currentIndex = allLectures.findIndex(l => l.id === currentLecture.id);
  const prevLecture = currentIndex > 0 ? allLectures[currentIndex - 1] : null;
  const nextLecture = currentIndex < allLectures.length - 1 ? allLectures[currentIndex + 1] : null;

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
      {/* 21~34강 쾌속 탐색 레일 (Clean White Card with Crisp Red/Green/Blue Badges) */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse" />
            <h3 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
              21강 ~ 34강 꿀잼 영상 숏컷 레일
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-semibold">
            <strong className="text-emerald-600 font-black">{completedLectures.length}</strong> / {allLectures.length}강 완료
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {allLectures.map(lec => {
            const isSelected = lec.id === currentLecture.id;
            const isDone = completedLectures.includes(lec.id);
            return (
              <button
                key={lec.id}
                type="button"
                onClick={() => handleSelectLecture(lec.id)}
                className={`shrink-0 px-3.5 py-2 rounded-2xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-rose-600 text-white border-rose-600 shadow-sm scale-105'
                    : isDone
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:border-emerald-400'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {isDone ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                ) : (
                  <Play className={`w-3 h-3 ${isSelected ? 'fill-white text-white' : 'text-blue-500'}`} />
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
        <div className={theaterMode === 'cinema' ? 'w-full space-y-4' : 'lg:col-span-7 xl:col-span-8 space-y-4'}>
          {/* Video Player Card */}
          <div className="bg-white border-2 border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            {/* Player Top Bar */}
            <div className="bg-slate-900 text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="bg-rose-600 text-white text-xs font-black px-2.5 py-0.5 rounded-lg flex items-center gap-1">
                  <Tv className="w-3.5 h-3.5" />
                  {currentLecture.id}강 영상관
                </span>
                <span className="text-white text-xs sm:text-sm font-bold truncate max-w-[220px] sm:max-w-md">
                  {funInfo.funTitle}
                </span>
              </div>

              {/* View & Speed Toggle */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl text-[11px]">
                  {['1.0x', '1.25x', '1.5x'].map(speed => (
                    <button
                      key={speed}
                      type="button"
                      onClick={() => setActiveSpeed(speed)}
                      className={`px-2 py-0.5 rounded font-bold cursor-pointer transition ${
                        activeSpeed === speed
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {speed}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setTheaterMode(prev => prev === 'split' ? 'cinema' : 'split')}
                  className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer"
                >
                  {theaterMode === 'split' ? '📺 시네마 모드' : '📑 분할 모드'}
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
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {prevLecture && (
                  <button
                    type="button"
                    onClick={() => handleSelectLecture(prevLecture.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 transition cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    이전 {prevLecture.id}강
                  </button>
                )}
                {nextLecture && (
                  <button
                    type="button"
                    onClick={() => handleSelectLecture(nextLecture.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 transition cursor-pointer"
                  >
                    다음 {nextLecture.id}강
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Complete Toggle Button */}
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onToggleComplete(currentLecture.id);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer border ${
                  isCompleted
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50'
                }`}
              >
                <CheckCircle2 className={`w-4 h-4 ${isCompleted ? 'text-white' : 'text-emerald-500'}`} />
                {isCompleted ? '완강 완료! (체크 해제)' : '이 영상 완강했어요!'}
              </button>
            </div>
          </div>

          {/* 🎯 꿀잼 킬링 파트 & 타임스탬프 (High Energy Moments) */}
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-rose-50 text-rose-600 border border-rose-200">
                  <Flame className="w-4 h-4 fill-rose-600" />
                </span>
                <h3 className="text-sm font-black text-slate-900">
                  클릭 한 번에 바로 점프! 꿀잼 킬링 타임스탬프
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                원하는 구간을 누르면 해당 시간으로 즉시 이동합니다
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {funInfo.timestamps.map((ts: VideoTimestamp, idx: number) => {
                const isSong = ts.type === 'song';
                const isExam = ts.type === 'exam';
                const isHumor = ts.type === 'humor';
                
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleJumpToTimestamp(ts.seconds)}
                    className="text-left p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-rose-400 hover:bg-white transition group cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-black text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md flex items-center gap-1 group-hover:bg-rose-600 group-hover:text-white transition">
                        <Play className="w-3 h-3 fill-current" />
                        {ts.time}
                      </span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                        isSong 
                          ? 'bg-blue-100 text-blue-800' 
                          : isExam 
                          ? 'bg-rose-100 text-rose-800' 
                          : isHumor
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}>
                        {isSong ? '🎵 3초 암기송' : isExam ? '🎯 시험 족집게' : isHumor ? '😂 꿀잼 썰' : '⚡ 핵심 요약'}
                      </span>
                    </div>
                    <p className="text-xs font-black text-slate-900 group-hover:text-rose-600 transition">
                      {ts.title}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                      {ts.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ⚡ 영상 직후 10초 번개 퀴즈 (Flash Quiz) */}
          <div className="bg-white border-2 border-blue-200 rounded-3xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-blue-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-blue-100 text-blue-600 border border-blue-200">
                  <Zap className="w-4 h-4 fill-blue-600" />
                </span>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    방금 본 영상 10초 번개 퀴즈!
                  </h3>
                  <span className="text-xs text-blue-600 font-medium">
                    방금 본 영상의 핵심을 바로 체크해보세요!
                  </span>
                </div>
              </div>

              {quizSubmitted && (
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setQuizSelectedOption(null);
                    setQuizSubmitted(false);
                  }}
                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> 다시 풀기
                </button>
              )}
            </div>

            <p className="text-sm font-bold text-slate-900 leading-snug">
              Q. {funInfo.quickQuiz.question}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {funInfo.quickQuiz.options.map((opt: string, optIdx: number) => {
                const isSelected = quizSelectedOption === optIdx;
                const isCorrect = optIdx === funInfo.quickQuiz.correctIndex;
                let btnStyle = 'bg-slate-50 border-slate-200 text-slate-700 hover:border-blue-400 hover:bg-blue-50/50';

                if (quizSubmitted) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-600 text-white border-emerald-600 font-black shadow-sm';
                  } else if (isSelected && !isCorrect) {
                    btnStyle = 'bg-rose-50 text-rose-700 border-rose-300 line-through';
                  } else {
                    btnStyle = 'bg-slate-50 text-slate-400 border-slate-200';
                  }
                } else if (isSelected) {
                  btnStyle = 'bg-blue-600 text-white border-blue-600 font-black';
                }

                return (
                  <button
                    key={optIdx}
                    type="button"
                    disabled={quizSubmitted}
                    onClick={() => handleQuizAnswer(optIdx)}
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
              <div className={`p-3.5 rounded-2xl border text-xs font-bold transition-all ${
                quizSelectedOption === funInfo.quickQuiz.correctIndex
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-rose-50 border-rose-300 text-rose-900'
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

        {/* Right Column: 듀얼 실시간 판서 스터디 노트 */}
        {theaterMode === 'split' && (
          <div className="lg:col-span-5 xl:col-span-4 space-y-4">
            <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-sm space-y-4 text-slate-800">
              
              {/* Header */}
              <div className="border-b border-slate-100 pb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black text-rose-600 uppercase tracking-wider flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                    보람쌤 3분 컷 칠판 판서
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                    단원 {currentLecture.unit}
                  </span>
                </div>
                <h3 className="text-base font-black text-slate-900 leading-tight">
                  {currentLecture.topic}
                </h3>
              </div>

              {/* 1. 보람쌤의 꿀잼 암기 공식 (Green Theme) */}
              <div className="bg-emerald-50/70 border-2 border-emerald-300 rounded-2xl p-4">
                <div className="flex items-center gap-1.5 text-xs font-black text-emerald-800 mb-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                  보람쌤 입에 착 붙는 100점 암기 공식
                </div>
                <p className="text-xs font-bold text-emerald-950 leading-relaxed bg-white p-3 rounded-xl border border-emerald-200">
                  {funInfo.funMnemonic}
                </p>
              </div>

              {/* 2. 시험 1위 족집게 키워드 (Red Theme) */}
              <div className="bg-rose-50/60 border border-rose-200 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-black text-rose-700">
                  <Flame className="w-4 h-4 text-rose-600 fill-rose-600" />
                  시험지 열자마자 보이는 킬러 키워드 3
                </div>
                <div className="space-y-1.5 text-xs">
                  {currentLecture.coreConcepts.slice(0, 3).map((c, i) => (
                    <div key={i} className="bg-white p-2.5 rounded-xl border border-rose-100">
                      <span className="font-black text-rose-700 block mb-0.5">
                        🔴 {c.name}
                      </span>
                      <span className="text-slate-600 text-xs leading-relaxed block">
                        {c.desc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. 사건 전개 타임라인 (Blue Theme) */}
              <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-black text-blue-700">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  한눈에 꿰뚫는 사건 흐름 (인과관계)
                </div>
                <div className="space-y-2 relative pl-2 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-blue-200">
                  {currentLecture.timeline.slice(0, 4).map((t, idx) => (
                    <div key={idx} className="relative pl-4 text-xs">
                      <span className="absolute -left-1 top-1 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
                      <span className="font-mono font-bold text-blue-600 block text-[11px]">
                        {t.yearOrPeriod}
                      </span>
                      <span className="font-bold text-slate-900 block">
                        {t.event}
                      </span>
                      <span className="text-[11px] text-slate-500 block">
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
                  onClick={onGoToChat}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-rose-400" />
                  이 사건 인물 단톡방 보러 가기 ➔
                </button>
                <button
                  type="button"
                  onClick={onGoToQuiz}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
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
