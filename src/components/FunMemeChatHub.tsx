import React, { useState, useMemo, useCallback } from 'react';
import { memeChats, speedOxBank, SpeedOxQuestion } from '../data/memeChatData';
import { Lecture } from '../data';
import { sound } from '../utils/audio';
import { 
  MessageCircle, 
  Flame, 
  Sparkles, 
  RotateCcw, 
  Check, 
  X, 
  Zap, 
  Award, 
  Smile, 
  BookOpen, 
  Tv, 
  ChevronRight,
  TrendingUp,
  Volume2,
  VolumeX
} from 'lucide-react';

interface FunMemeChatHubProps {
  currentLecture: Lecture;
  allLectures: Lecture[];
  onSelectLecture: (id: number) => void;
  onGoToVideo: () => void;
  onGoToQuiz: () => void;
}

export function FunMemeChatHub({
  currentLecture,
  allLectures,
  onSelectLecture,
  onGoToVideo,
  onGoToQuiz
}: FunMemeChatHubProps) {
  // Speed OX Mini-game state
  const [oxIndex, setOxIndex] = useState(0);
  const [oxScore, setOxScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [oxAnswered, setOxAnswered] = useState<boolean | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'chat' | 'speedOx' | 'mnemonic'>('chat');

  const currentChat = useMemo(() => {
    return memeChats[currentLecture.id] || memeChats[21];
  }, [currentLecture.id]);

  // Current OX question
  const currentOxQuestion: SpeedOxQuestion = useMemo(() => {
    return speedOxBank[oxIndex] || speedOxBank[0];
  }, [oxIndex]);

  const handleOxAnswer = useCallback((chosenO: boolean) => {
    if (oxAnswered !== null || isGameOver) return;
    const isCorrect = chosenO === currentOxQuestion.isO;
    setOxAnswered(isCorrect);

    if (isCorrect) {
      sound.playCorrect();
      setOxScore(prev => prev + 10);
      setCombo(prev => {
        const next = prev + 1;
        if (next > maxCombo) setMaxCombo(next);
        if (next >= 3) {
          sound.playFanfare();
        }
        return next;
      });
    } else {
      sound.playWrong();
      setCombo(0);
    }
  }, [oxAnswered, isGameOver, currentOxQuestion, maxCombo]);

  const handleNextOx = useCallback(() => {
    setOxAnswered(null);
    if (oxIndex < speedOxBank.length - 1) {
      setOxIndex(prev => prev + 1);
    } else {
      setIsGameOver(true);
      sound.playFanfare();
    }
  }, [oxIndex]);

  const handleResetOx = useCallback(() => {
    setOxIndex(0);
    setOxScore(0);
    setCombo(0);
    setOxAnswered(null);
    setIsGameOver(false);
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner - Clean White with Bright Relatable Student Vibes */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-black text-rose-600 bg-rose-50 border border-rose-200 px-3 py-1 rounded-xl uppercase tracking-wider mb-2">
              <Flame className="w-4 h-4 fill-rose-500 text-rose-500" />
              노잼 줄글은 가라! 도파민 뿜뿜 역사 꿀잼존
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              역사 인물 가상 단톡방 &amp; 3초 컷 밈 썰 💬
            </h2>
            <p className="text-sm md:text-base text-slate-600 mt-1 font-medium">
              그 당시 인물들이 카톡 단톡방에서 싸웠다면?! 1분 만에 머리에 박히는 상황극과 10초 스피드 OX로 벼락치기 끝내기!
            </p>
          </div>

          {/* Sub Navigation Segmented Switcher */}
          <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 self-start md:self-auto shrink-0">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setActiveSubTab('chat');
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'chat'
                  ? 'bg-white text-rose-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              인물 단톡방 썰
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setActiveSubTab('speedOx');
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'speedOx'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap className="w-4 h-4 text-blue-500" />
              스피드 OX 폭탄
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setActiveSubTab('mnemonic');
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'mnemonic'
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-500" />
              100점 암기 공식집
            </button>
          </div>
        </div>

        {/* Lecture Quick Navigation Rail */}
        <div className="flex items-center gap-2 overflow-x-auto pt-4 mt-4 border-t border-slate-100 scrollbar-thin">
          <span className="text-xs font-bold text-slate-400 shrink-0">강의 선택:</span>
          {allLectures.map(lec => {
            const isSelected = lec.id === currentLecture.id;
            return (
              <button
                key={lec.id}
                type="button"
                onClick={() => {
                  sound.playClick();
                  onSelectLecture(lec.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer shrink-0 border ${
                  isSelected
                    ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {lec.id}강
              </button>
            );
          })}
        </div>
      </div>

      {/* SUB-TAB 1: 역사 인물 가상 단톡방 */}
      {activeSubTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Chat Window (Clean Mobile Kakao-Talk style with crisp white backdrop) */}
          <div className="lg:col-span-8 bg-white border-2 border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            {/* Chat Room Top Bar */}
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <h3 className="font-black text-sm md:text-base text-white">
                    {currentChat.roomTitle}
                  </h3>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  {currentChat.subTitle} · 참여자 {currentChat.messages.length}명
                </p>
              </div>

              <button
                type="button"
                onClick={onGoToVideo}
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black transition shadow-sm cursor-pointer flex items-center gap-1"
              >
                <Tv className="w-3.5 h-3.5" />
                영상 보러가기
              </button>
            </div>

            {/* 3초 요약 밈 띠 */}
            <div className="bg-amber-50 border-b border-amber-200 px-5 py-3 text-xs md:text-sm font-bold text-amber-900 flex items-center gap-2">
              <span className="shrink-0 text-base">⚡</span>
              <span>{currentChat.summaryMeme}</span>
            </div>

            {/* Message Area */}
            <div className="p-4 md:p-6 bg-slate-50/70 space-y-4 max-h-[580px] overflow-y-auto">
              <div className="text-center">
                <span className="text-[11px] font-bold text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-2xs">
                  📜 역사적 사건 시작일
                </span>
              </div>

              {currentChat.messages.map((msg) => (
                <div key={msg.id} className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-xl shrink-0 shadow-2xs">
                    {msg.avatar}
                  </div>

                  {/* Bubble Container */}
                  <div className="space-y-1 max-w-[80%]">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-black text-slate-900">{msg.sender}</span>
                      <span className="text-[10px] text-slate-400 font-semibold">{msg.role}</span>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm p-3.5 text-xs md:text-sm text-slate-800 leading-relaxed shadow-2xs">
                      {msg.text}
                    </div>

                    <div className="flex items-center gap-2 pt-0.5">
                      <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                      {msg.reaction && (
                        <span className="text-[11px] bg-rose-50 border border-rose-200 text-rose-700 px-2 py-0.5 rounded-full font-bold">
                          {msg.reaction}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Input Mock */}
            <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between gap-3 text-xs text-slate-400">
              <span className="font-medium">💡 보람쌤의 꿀팁: 단톡방 대화 순서대로 외우면 시험 사건 순서가 바로 외워져요!</span>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setActiveSubTab('speedOx');
                }}
                className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 font-black border border-blue-200 hover:bg-blue-100 transition cursor-pointer shrink-0"
              >
                OX 퀴즈로 테스트 ➔
              </button>
            </div>
          </div>

          {/* Right Sidebar: Quick Memory Cheatsheet for this lecture */}
          <div className="lg:col-span-4 space-y-4">
            {/* 1. 핵심 인물 대결 구도 */}
            <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-rose-600 font-black text-xs uppercase tracking-wider">
                <Flame className="w-4 h-4 fill-rose-500" />
                {currentLecture.id}강 인물 대결 매치업
              </div>
              <h4 className="text-base font-black text-slate-900">
                {currentLecture.topic}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {currentLecture.bgSummary}
              </p>
            </div>

            {/* 2. 람보쌤의 100점 암기 공식 */}
            <div className="bg-emerald-50/70 border-2 border-emerald-300 rounded-3xl p-5 shadow-sm space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-black text-emerald-800">
                <Sparkles className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                보람쌤 3초 컷 족집게 암기 공식
              </div>
              <div className="bg-white border border-emerald-200 rounded-2xl p-3 text-xs font-bold text-emerald-900 leading-relaxed">
                {currentLecture.ramboTips[0] || '사건의 원인과 결과를 세트로 묶어서 외우자!'}
              </div>
            </div>

            {/* 3. 모의고사 바로가기 버튼 */}
            <div className="bg-blue-50/70 border border-blue-200 rounded-3xl p-5 text-center space-y-2.5">
              <h5 className="font-black text-sm text-blue-900">
                개념 정리 끝났다면?
              </h5>
              <p className="text-xs text-blue-700">
                실제 기출 문제로 100점 실력을 완성해보세요!
              </p>
              <button
                type="button"
                onClick={onGoToQuiz}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-sm transition cursor-pointer"
              >
                실전 모의고사 풀기 ➔
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: 스피드 OX 폭탄 퀴즈 (Speed OX Mini-Game with Sound & Combos) */}
      {activeSubTab === 'speedOx' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white border-2 border-blue-300 rounded-3xl p-6 md:p-8 shadow-sm text-center relative overflow-hidden">
            {/* Header info */}
            <div className="flex items-center justify-between text-xs font-black mb-4">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-xl">
                문제 {oxIndex + 1} / {speedOxBank.length}
              </span>
              <div className="flex items-center gap-2">
                {combo >= 2 && (
                  <span className="bg-rose-500 text-white px-2.5 py-0.5 rounded-full font-black animate-bounce flex items-center gap-1">
                    🔥 {combo} 콤보!
                  </span>
                )}
                <span className="text-slate-500">
                  내 점수: <strong className="text-blue-600 text-sm">{oxScore}점</strong>
                </span>
              </div>
            </div>

            {!isGameOver ? (
              <div className="space-y-6">
                <div className="inline-block bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-full">
                  {currentOxQuestion.wittyTag}
                </div>

                <div className="min-h-[100px] flex items-center justify-center">
                  <p className="text-base md:text-lg font-black text-slate-900 leading-snug max-w-lg mx-auto">
                    Q. {currentOxQuestion.question}
                  </p>
                </div>

                {/* Big OX Buttons */}
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                  <button
                    type="button"
                    disabled={oxAnswered !== null}
                    onClick={() => handleOxAnswer(true)}
                    className="p-6 rounded-3xl bg-blue-50 hover:bg-blue-100 border-2 border-blue-400 text-blue-700 font-black text-4xl shadow-sm transition active:scale-95 disabled:opacity-60 cursor-pointer flex flex-col items-center gap-1"
                  >
                    <span>⭕</span>
                    <span className="text-xs font-bold text-blue-900">맞다 (O)</span>
                  </button>

                  <button
                    type="button"
                    disabled={oxAnswered !== null}
                    onClick={() => handleOxAnswer(false)}
                    className="p-6 rounded-3xl bg-rose-50 hover:bg-rose-100 border-2 border-rose-400 text-rose-700 font-black text-4xl shadow-sm transition active:scale-95 disabled:opacity-60 cursor-pointer flex flex-col items-center gap-1"
                  >
                    <span>❌</span>
                    <span className="text-xs font-bold text-rose-900">틀리다 (X)</span>
                  </button>
                </div>

                {/* Feedback result */}
                {oxAnswered !== null && (
                  <div className={`p-4 rounded-2xl border text-xs md:text-sm font-bold text-left animate-fadeIn ${
                    oxAnswered 
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
                      : 'bg-rose-50 border-rose-300 text-rose-900'
                  }`}>
                    <div className="flex items-center gap-1.5 font-black text-base mb-1">
                      {oxAnswered ? '🎉 딩동댕! 정답이야!' : '💥 땡! 아쉽다! 함정에 빠졌어!'}
                    </div>
                    <p className="font-normal text-slate-700">
                      💡 <strong>해설:</strong> {currentOxQuestion.explanation}
                    </p>
                    <div className="mt-3 flex justify-end">
                      <button
                        type="button"
                        onClick={handleNextOx}
                        className="px-4 py-2 rounded-xl bg-slate-900 text-white font-black text-xs hover:bg-slate-800 transition cursor-pointer"
                      >
                        다음 문제 풀기 ➔
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Game Over Screen */
              <div className="space-y-4 py-6">
                <div className="text-5xl">🏆</div>
                <h3 className="text-2xl font-black text-slate-900">
                  스피드 OX 폭탄 완주 성공!
                </h3>
                <div className="text-3xl font-black text-blue-600">
                  최종 점수: {oxScore}점 / 최대 {maxCombo}연속 콤보!
                </div>
                <p className="text-xs sm:text-sm text-slate-600">
                  {oxScore >= 120 
                    ? '👑 미쳤다! 넌 이미 역사 100점이야! 시험지 찢고 와라!' 
                    : oxScore >= 80 
                    ? '⚡ 엄청난 실력! 헷갈린 개념만 한번 더 복습하면 만점 확정!' 
                    : '🌱 괜찮아! 틀린 문제 해설 보면서 다시 한번 도전해보자!'}
                </p>
                <div className="flex justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleResetOx}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-black text-xs hover:bg-slate-800 transition cursor-pointer flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    다시 도전하기
                  </button>
                  <button
                    type="button"
                    onClick={onGoToQuiz}
                    className="px-5 py-2.5 rounded-xl bg-rose-600 text-white font-black text-xs hover:bg-rose-500 transition cursor-pointer"
                  >
                    실전 4지선다 모의고사 풀기 ➔
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: 보람쌤 100점 암기 공식집 */}
      {activeSubTab === 'mnemonic' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allLectures.map(lec => (
            <div 
              key={lec.id} 
              className="bg-white border-2 border-slate-200 hover:border-emerald-400 rounded-3xl p-5 shadow-sm transition space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  {lec.id}강
                </span>
                <span className="text-[11px] font-mono font-bold text-slate-400">{lec.unit}</span>
              </div>
              <h4 className="text-sm font-black text-slate-900 line-clamp-1">
                {lec.title.replace(/2026 중2역사①\|\s*/, '')}
              </h4>
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3 text-xs font-bold text-emerald-900 leading-relaxed">
                ⭐ {lec.ramboTips[0] || '원인과 결과 세트로 외우기!'}
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-2">
                {lec.bgSummary}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
