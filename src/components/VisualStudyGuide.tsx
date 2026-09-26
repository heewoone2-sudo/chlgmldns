import React, { useState } from 'react';
import { 
  Sparkles, 
  Flame, 
  Ship, 
  Crown, 
  Train, 
  Globe2, 
  Flag, 
  Layers, 
  Zap, 
  Pencil, 
  Bookmark, 
  Check, 
  AlertTriangle 
} from 'lucide-react';

export function VisualStudyGuide() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'revolution' | 'industrial' | 'asia'>('all');

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Handcrafted Study Notebook Top Banner */}
      <div className="bg-gradient-to-r from-amber-500/20 via-rose-500/15 to-purple-500/20 border-2 border-amber-400/40 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
        <div className="max-w-3xl relative z-10 space-y-2.5">
          <div className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow">
            <Pencil className="w-3.5 h-3.5 fill-slate-950" />
            시험 전날 밤 10분 벼락치기 손필기장 📝
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            그림 문자와 형광펜으로 한눈에 쏙 들어오는 요약본 🎨
          </h2>
          <p className="text-sm md:text-base text-slate-200 leading-relaxed font-medium">
            교과서 긴 줄글 읽다가 지친 친구들 주목! 람보쌤이 시험에 꼭 낸다고 강조한 핵심 사건들의 
            <strong className="text-amber-300"> [원인 ➔ 전개 ➔ 결과]</strong>를 그림 기호와 컬러 카드로 쏙쏙 정리했어.
          </p>
        </div>

        {/* Category Pill Filters */}
        <div className="flex flex-wrap gap-2 mt-6 relative z-10">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-black transition cursor-pointer flex items-center gap-1.5 ${
              activeCategory === 'all'
                ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20 scale-[1.02]'
                : 'bg-slate-900/80 border border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            🌟 전체 몰아보기 (21~34강)
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('revolution')}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-black transition cursor-pointer flex items-center gap-1.5 ${
              activeCategory === 'revolution'
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20 scale-[1.02]'
                : 'bg-slate-900/80 border border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            🗽 시민 혁명 &amp; 자유주의 (21~26강)
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('industrial')}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-black transition cursor-pointer flex items-center gap-1.5 ${
              activeCategory === 'industrial'
                ? 'bg-sky-400 text-slate-950 shadow-lg shadow-sky-400/20 scale-[1.02]'
                : 'bg-slate-900/80 border border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            🚂 산업화 &amp; 제국주의 (27~28강)
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('asia')}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-black transition cursor-pointer flex items-center gap-1.5 ${
              activeCategory === 'asia'
                ? 'bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-400/20 scale-[1.02]'
                : 'bg-slate-900/80 border border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            🐉 아시아 각국의 근대화 (29~34강)
          </button>
        </div>
      </div>

      {/* 1. 시민 혁명 파트 (21 ~ 26강) */}
      {(activeCategory === 'all' || activeCategory === 'revolution') && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <span className="text-2xl">🗽</span>
            <h3 className="text-lg md:text-xl font-black text-rose-400">
              서양 근대의 태동과 시민 혁명 (21강 ~ 26강)
            </h3>
            <span className="text-xs text-slate-400 font-semibold ml-auto">※ 왕정을 무너뜨리고 국민이 주인이 된 시대!</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 카드 21강: 신항로 개척 & 종교 개혁 */}
            <div className="bg-slate-950/90 border-2 border-amber-500/40 rounded-3xl p-5 hover:border-amber-400 transition shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="bg-amber-400/20 text-amber-300 text-xs px-2.5 py-0.5 rounded-full font-bold border border-amber-500/40 flex items-center gap-1">
                    <Ship className="w-3.5 h-3.5 text-amber-400" /> 21강 바닷길 &amp; 신앙
                  </span>
                  <span className="text-2xl">⛵ ⛪</span>
                </div>
                <h4 className="text-base font-extrabold text-white mt-3">
                  신항로 개척과 종교 개혁
                </h4>

                {/* 흐름도 */}
                <div className="mt-3 space-y-2 text-xs">
                  <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800">
                    <strong className="text-amber-300 block mb-1">🌊 신항로 개척 왜 떠났을까?</strong>
                    오스만 튀르크가 비단길·지중해 막음 ➔ 새로운 바닷길 개척!<br/>
                    • <strong>콜럼버스</strong>: 아메리카 도착<br/>
                    • <strong>마젤란 함대</strong>: 최초 세계 일주(지구는 둥글다!)<br/>
                    ➔ <span className="text-rose-400 font-bold underline">가격 혁명(은 쏟아져 물가 폭등)</span> + <span className="text-sky-300 font-bold underline">상업 혁명(주식회사·금융)</span>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800">
                    <strong className="text-amber-300 block mb-1">📖 종교 개혁 2대 거두 완벽 구분</strong>
                    • <strong>루터</strong>: 면벌부 썩었어! ➔ 「95개조 반박문」(오직 믿음과 성서)<br/>
                    • <strong>칼뱅</strong>: 예정설(구원은 신이 미리 정함) ➔ 정당하게 일해 돈 버는 건 신의 축복! ➔ <span className="text-emerald-300 font-bold">도시 상인들 대환호!</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-amber-300 font-bold flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-rose-500 shrink-0" />
                루터는 '성서만 믿어!', 칼뱅은 '돈 버는 것도 신의 뜻!'
              </div>
            </div>

            {/* 카드 22강: 미국 독립 혁명 */}
            <div className="bg-slate-950/90 border-2 border-rose-500/40 rounded-3xl p-5 hover:border-rose-400 transition shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="bg-rose-500/20 text-rose-300 text-xs px-2.5 py-0.5 rounded-full font-bold border border-rose-500/40 flex items-center gap-1">
                    <Flag className="w-3.5 h-3.5 text-rose-400" /> 22강 최초의 공화국
                  </span>
                  <span className="text-2xl">☕ 🦅</span>
                </div>
                <h4 className="text-base font-extrabold text-white mt-3">
                  미국 독립 혁명 (1776)
                </h4>

                <div className="mt-3 space-y-2 text-xs">
                  <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800">
                    <strong className="text-rose-300 block mb-1">📢 식민지 사람들의 빡침 포인트</strong>
                    영국이 빚더미 앉더니 인지세·홍차세 세금 폭탄 ➔ <br/>
                    <span className="bg-rose-950 text-rose-300 px-2 py-0.5 rounded font-black border border-rose-800 inline-block mt-1">
                      "대표 없는 곳에 과세 없다!"
                    </span>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800">
                    <strong className="text-rose-300 block mb-1">💥 시험에 나오는 순서 4단계</strong>
                    ① 보스턴 차 사건(홍차를 바다로 슛!) ➔ ② 대륙 회의 ➔ ③ 독립 선언서(1776, 천부인권) ➔ ④ 요크타운 승리
                  </div>

                  <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800">
                    <strong className="text-rose-300 block mb-1">🏛️ 미국 헌법 3대 세트</strong>
                    <span className="text-emerald-400 font-bold">삼권 분립</span>(입법·사법·행정) + <span className="text-sky-300 font-bold">연방제</span> + <span className="text-amber-300 font-bold">민주 공화정</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-rose-300 font-bold flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-rose-500 shrink-0" />
                세계 최초의 근대 민주 공화국 탄생! (왕이 없는 나라)
              </div>
            </div>

            {/* 카드 23강: 프랑스 혁명 & 나폴레옹 */}
            <div className="bg-slate-950/90 border-2 border-sky-500/40 rounded-3xl p-5 hover:border-sky-400 transition shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="bg-sky-500/20 text-sky-300 text-xs px-2.5 py-0.5 rounded-full font-bold border border-sky-500/40 flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5 text-sky-400" /> 23강 유럽 최대 혁명
                  </span>
                  <span className="text-2xl">🏰 ⚔️</span>
                </div>
                <h4 className="text-base font-extrabold text-white mt-3">
                  프랑스 혁명 &amp; 나폴레옹
                </h4>

                <div className="mt-3 space-y-2 text-xs">
                  <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800">
                    <strong className="text-sky-300 block mb-1">💣 앙시앵 레짐(구제도의 모순)</strong>
                    2% 귀족·성직자는 땅 절반 먹고 세금 면제! ↔ 98% 평민만 세금 몽땅 냄 ➔ 폭발!
                  </div>

                  <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800">
                    <strong className="text-sky-300 block mb-1">🔄 혁명의 파란만장 전개</strong>
                    바스티유 감옥 습격 ➔ 인권선언 발표 ➔ 로베스피에르의 공포정치(단두대 피바람) ➔ 나폴레옹 쿠데타 황제 즉위
                  </div>

                  <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800">
                    <strong className="text-sky-300 block mb-1">👑 나폴레옹의 몰락 2가지 실수</strong>
                    영국 못 잡아서 <strong>대륙 봉쇄령</strong> 내림 ➔ 어긴 러시아 치러 갔다가 <strong>추위로 러시아 원정 참패</strong>!
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-sky-300 font-bold flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-rose-500 shrink-0" />
                나폴레옹 덕분에 유럽 전역에 '자유주의'와 '민족주의'가 쫙 퍼짐!
              </div>
            </div>

            {/* 카드 24강: 자유주의와 민족주의 */}
            <div className="bg-slate-950/90 border-2 border-purple-500/40 rounded-3xl p-5 hover:border-purple-400 transition shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="bg-purple-500/20 text-purple-300 text-xs px-2.5 py-0.5 rounded-full font-bold border border-purple-500/40 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-purple-400" /> 24강 복고 vs 혁명
                  </span>
                  <span className="text-2xl">🛡️ 🤝</span>
                </div>
                <h4 className="text-base font-extrabold text-white mt-3">
                  자유주의와 독일·이탈리아 통일
                </h4>

                <div className="mt-3 space-y-2 text-xs">
                  <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800">
                    <strong className="text-purple-300 block mb-1">💥 7월 혁명 vs 2월 혁명 1초 비교</strong>
                    • <strong>7월 혁명(1830)</strong>: 샤를 10세 추방 ➔ <span className="text-amber-300 font-bold">7월 왕정(입헌군주정)</span><br/>
                    • <strong>2월 혁명(1848)</strong>: 노동자 선거권 요구 ➔ <span className="text-rose-400 font-bold">제2공화정</span> + <span className="text-emerald-300 font-bold">메테르니히 추방(빈체제 끝!)</span>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800">
                    <strong className="text-purple-300 block mb-1">🇬🇧 영국의 점진적 개혁</strong>
                    피 흘리지 않고 법 개정: 노동자의 선거권 요구 ➔ <strong>차티스트 운동 (인민헌장)</strong>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800">
                    <strong className="text-purple-300 block mb-1">🇮🇹 🇩🇪 통일 영웅들</strong>
                    • 이탈리아: <strong>카보우르</strong>(북부 외교) + <strong>가리발디</strong>(붉은 셔츠단)<br/>
                    • 독일: 관세동맹(경제) ➔ <strong>비스마르크 철혈정책</strong>(군사력)
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-purple-300 font-bold flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-rose-500 shrink-0" />
                2월 혁명으로 빈 체제(옛날 왕정 복고)가 완전히 무너졌다!
              </div>
            </div>

            {/* 카드 25강: 미국 남북전쟁 & 러시아 */}
            <div className="bg-slate-950/90 border-2 border-emerald-500/40 rounded-3xl p-5 hover:border-emerald-400 transition shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-0.5 rounded-full font-bold border border-emerald-500/40 flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-emerald-400" /> 25강 강대국의 체질 개선
                  </span>
                  <span className="text-2xl">🎩 🌾</span>
                </div>
                <h4 className="text-base font-extrabold text-white mt-3">
                  미국 남북전쟁 &amp; 러시아 근대화
                </h4>

                <div className="mt-3 space-y-2 text-xs">
                  <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800">
                    <strong className="text-emerald-300 block mb-1">⚔️ 미국 북부 vs 남부 (시험 단골 표)</strong>
                    • <strong>북부(승리)</strong>: 상공업, 보호무역, <span className="text-emerald-300 font-bold">노예 반대</span>, 링컨 대통령<br/>
                    • <strong>남부</strong>: 목화 대농장, 자유무역, <span className="text-rose-400 font-bold">노예 찬성</span><br/>
                    ➔ 링컨의 <strong>노예 해방 선언(1863)</strong> ➔ 북부 승리 ➔ <strong>대륙횡단철도(1869)</strong> 완공
                  </div>

                  <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800">
                    <strong className="text-emerald-300 block mb-1">🇷🇺 러시아의 뒤늦은 몸부림</strong>
                    크림전쟁 패배 ➔ 알렉산드르 2세의 <strong>농노 해방령(1861)</strong>(토지 값 너무 비싸서 불만) ➔ 지식인들의 <strong>브나로드 운동</strong>(민중 속으로!)
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-emerald-300 font-bold flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-rose-500 shrink-0" />
                1861년 기억법: 미국의 남북전쟁 시작 = 러시아의 농노 해방령!
              </div>
            </div>

            {/* 카드 26강: 라틴아메리카 독립 */}
            <div className="bg-slate-950/90 border-2 border-yellow-500/40 rounded-3xl p-5 hover:border-yellow-400 transition shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="bg-yellow-500/20 text-yellow-300 text-xs px-2.5 py-0.5 rounded-full font-bold border border-yellow-500/40 flex items-center gap-1">
                    <Globe2 className="w-3.5 h-3.5 text-yellow-400" /> 26강 중남미의 해방
                  </span>
                  <span className="text-2xl">🌴 🗽</span>
                </div>
                <h4 className="text-base font-extrabold text-white mt-3">
                  라틴아메리카 국가들의 독립
                </h4>

                <div className="mt-3 space-y-2 text-xs">
                  <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800">
                    <strong className="text-yellow-300 block mb-1">🧑‍🤝‍🧑 누가 독립을 주도했을까?</strong>
                    아메리카 현지에서 태어난 백인인 <strong>'크리오요'</strong>!<br/>
                    (스페인 본토 출신 관리들의 무시와 차별에 분노함)
                  </div>

                  <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800">
                    <strong className="text-yellow-300 block mb-1">🌟 핵심 나라 &amp; 영웅들</strong>
                    • <strong>아이티(1804)</strong>: 투생 루베르튀르 (최초의 독립국이자 흑인 공화국!)<br/>
                    • <strong>시몬 볼리바르 &amp; 산마르틴</strong>: 남아메리카를 해방시킨 영웅<br/>
                    • <strong>미국 먼로 선언(1823)</strong>: "유럽은 아메리카 일에 끼어들지 마!"
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-yellow-300 font-bold flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-rose-500 shrink-0" />
                아이티 = 최초 독립국 + 최초 흑인 공화국 (서술형 단골!)
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. 산업 혁명과 제국주의 파트 (27 ~ 28강) */}
      {(activeCategory === 'all' || activeCategory === 'industrial') && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <span className="text-2xl">🚂</span>
            <h3 className="text-lg md:text-xl font-black text-sky-400">
              산업화와 제국주의의 명암 (27강 ~ 28강)
            </h3>
            <span className="text-xs text-slate-400 font-semibold ml-auto">※ 기계로 부자가 된 열강, 식민지로 짓밟힌 약소국</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 카드 27강: 산업 혁명 */}
            <div className="bg-slate-950/90 border-2 border-cyan-500/40 rounded-3xl p-5 hover:border-cyan-400 transition shadow-lg">
              <div className="flex items-center justify-between">
                <span className="bg-cyan-500/20 text-cyan-300 text-xs px-2.5 py-0.5 rounded-full font-bold border border-cyan-500/40 flex items-center gap-1">
                  <Train className="w-3.5 h-3.5 text-cyan-400" /> 27강 공장과 기계
                </span>
                <span className="text-2xl">🏭 ⚙️</span>
              </div>
              <h4 className="text-base font-extrabold text-white mt-3">
                영국 산업 혁명 &amp; 노동 문제
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3 text-xs">
                <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800">
                  <strong className="text-cyan-300 block mb-1">🇬🇧 왜 영국에서 먼저 시작됐을까?</strong>
                  ① 명예혁명 후 정치 안정<br/>
                  ② 모직물로 번 풍부한 자본<br/>
                  ③ <strong>인클로저 운동</strong> ➔ 땅 잃은 농민들이 공장 노동자로 유입<br/>
                  ④ 철·석탄 지하자원 풍부<br/>
                  ⑤ 넓은 식민지 시장
                </div>

                <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800">
                  <strong className="text-cyan-300 block mb-1">⚡ 핵심 기술 &amp; 노동자의 분노</strong>
                  • <strong>면직물 공업</strong>(옷감)에서 시작!<br/>
                  • <strong>제임스 와트의 증기 기관</strong> 개량 (동력 혁명)<br/>
                  • <strong>러다이트 운동</strong>: "기계 때문에 굶어죽겠다!" 기계 파괴 운동<br/>
                  • <strong>마르크스</strong>: 과학적 사회주의 대두
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-cyan-300 font-bold flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-rose-500 shrink-0" />
                모직물이 아니라 '면직물'에서 방적기·방직기가 나온 거 낚이지 말기!
              </div>
            </div>

            {/* 카드 28강: 제국주의의 등장 */}
            <div className="bg-slate-950/90 border-2 border-indigo-500/40 rounded-3xl p-5 hover:border-indigo-400 transition shadow-lg">
              <div className="flex items-center justify-between">
                <span className="bg-indigo-500/20 text-indigo-300 text-xs px-2.5 py-0.5 rounded-full font-bold border border-indigo-500/40 flex items-center gap-1">
                  <Globe2 className="w-3.5 h-3.5 text-indigo-400" /> 28강 잔혹한 침략
                </span>
                <span className="text-2xl">🌍 🗡️</span>
              </div>
              <h4 className="text-base font-extrabold text-white mt-3">
                제국주의와 아프리카 쟁탈전
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3 text-xs">
                <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800">
                  <strong className="text-indigo-300 block mb-1">😈 식민지 침략의 말도 안 되는 핑계</strong>
                  • <strong>사회진화론</strong>: 약육강식은 자연의 섭리다!<br/>
                  • <strong>백인의 짐</strong>: 미개한 유색인종을 교화시키는 의무다!<br/>
                  • <strong>베를린 회의(1884)</strong>: 먼저 깃발 꽂는 놈이 임자(선점권) 합의
                </div>

                <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800">
                  <strong className="text-indigo-300 block mb-1">📍 결정적 충돌 &amp; 지켜낸 나라</strong>
                  • <strong>파쇼다 사건(1898)</strong>: 영국의 남북 종단 vs 프랑스의 동서 횡단이 충돌!<br/>
                  • 아프리카에서 독립 지킨 2개국: <span className="text-emerald-300 font-bold">에티오피아</span>(이탈리아 격퇴) &amp; <span className="text-emerald-300 font-bold">라이베리아</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-indigo-300 font-bold flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-rose-500 shrink-0" />
                아프리카 독립국 딱 2개: 에티오피아(아도와 승리) + 라이베리아!
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. 아시아 각국의 근대화 운동 (29 ~ 34강) */}
      {(activeCategory === 'all' || activeCategory === 'asia') && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <span className="text-2xl">🐉</span>
            <h3 className="text-lg md:text-xl font-black text-emerald-400">
              아시아·아프리카의 국민 국가 건설과 저항 (29강 ~ 34강)
            </h3>
            <span className="text-xs text-slate-400 font-semibold ml-auto">※ 서양 침략에 맞서 나라를 지키려던 민족 운동</span>
          </div>

          {/* 특급 요약: 중국 5단계 도장깨기 배너 */}
          <div className="bg-slate-950 border-2 border-rose-500/60 rounded-3xl p-5 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="bg-rose-500 text-white font-black text-xs px-2.5 py-0.5 rounded-full">
                  🔥 시험 1순위
                </span>
                <h4 className="text-base font-black text-white">
                  33강 중국 근대화 5단계 도장깨기 (시대순 &amp; 구호 비교)
                </h4>
              </div>
              <span className="text-xs text-rose-300 font-mono font-bold">아편전쟁(1840) ➔ 신해혁명(1911)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex flex-col justify-between">
                <div>
                  <span className="text-amber-400 font-bold block mb-1">1단계 (1851)</span>
                  <strong className="text-white text-sm">태평천국 운동</strong>
                  <div className="mt-1 text-slate-400">홍수전 (배상제회)</div>
                </div>
                <div className="mt-2 bg-slate-950 p-1.5 rounded-xl border border-rose-900/60 text-rose-300 font-bold text-center">
                  "멸만흥한"
                </div>
                <p className="text-[11px] text-slate-400 mt-1">천조전무제도, 남녀평등</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex flex-col justify-between">
                <div>
                  <span className="text-amber-400 font-bold block mb-1">2단계 (1860s)</span>
                  <strong className="text-white text-sm">양무운동</strong>
                  <div className="mt-1 text-slate-400">이홍장, 증국번</div>
                </div>
                <div className="mt-2 bg-slate-950 p-1.5 rounded-xl border border-amber-900/60 text-amber-300 font-bold text-center">
                  "중체서용"
                </div>
                <p className="text-[11px] text-slate-400 mt-1">무기만 수용 ➔ 청일전쟁 참패</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex flex-col justify-between">
                <div>
                  <span className="text-amber-400 font-bold block mb-1">3단계 (1898)</span>
                  <strong className="text-white text-sm">변법자강운동</strong>
                  <div className="mt-1 text-slate-400">캉유웨이, 량치차오</div>
                </div>
                <div className="mt-2 bg-slate-950 p-1.5 rounded-xl border border-sky-900/60 text-sky-300 font-bold text-center">
                  "입헌군주제"
                </div>
                <p className="text-[11px] text-slate-400 mt-1">제도 개혁 ➔ 100일 만에 좌절</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex flex-col justify-between">
                <div>
                  <span className="text-amber-400 font-bold block mb-1">4단계 (1899)</span>
                  <strong className="text-white text-sm">의화단 운동</strong>
                  <div className="mt-1 text-slate-400">농민, 의화권 무술</div>
                </div>
                <div className="mt-2 bg-slate-950 p-1.5 rounded-xl border border-rose-900/60 text-rose-300 font-bold text-center">
                  "부청멸양"
                </div>
                <p className="text-[11px] text-slate-400 mt-1">철도·교회 파괴 ➔ 외국군 주둔</p>
              </div>

              <div className="bg-slate-900 border-2 border-emerald-500/70 rounded-2xl p-3 flex flex-col justify-between">
                <div>
                  <span className="text-emerald-400 font-bold block mb-1">5단계 (1911)</span>
                  <strong className="text-white text-sm">신해혁명</strong>
                  <div className="mt-1 text-slate-400">쑨원 (혁명동맹회)</div>
                </div>
                <div className="mt-2 bg-emerald-950 p-1.5 rounded-xl border border-emerald-700 text-emerald-300 font-bold text-center">
                  "삼민주의"
                </div>
                <p className="text-[11px] text-emerald-300 mt-1 font-semibold">청 멸망 ➔ 중화민국(공화국)</p>
              </div>
            </div>
          </div>

          {/* 나머지 아시아 국가 카드 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 오스만 (29강) */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-3xl p-5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  29강 오스만 제국
                </span>
                <span className="text-xl">🕌</span>
              </div>
              <h5 className="font-bold text-white text-sm">탄지마트 &amp; 청년 튀르크당</h5>
              <div className="text-xs text-slate-300 space-y-2 bg-slate-900 p-3 rounded-2xl border border-slate-800/80">
                <div>• <strong>탄지마트(1839)</strong>: 은혜 개혁, 서구화·만인평등 선언</div>
                <div>• <strong>미드하트 헌법(1876)</strong>: 아시아 최초 근대 헌법</div>
                <div>• <strong>청년 튀르크당(1908)</strong>: 무력 혁명으로 헌법 부활! 그러나 <span className="text-rose-400 font-bold underline">극단적 튀르크 민족주의</span>로 아랍인 반발 초래</div>
              </div>
            </div>

            {/* 서아시아 3국 (30강) */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-3xl p-5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                  30강 서아시아 3국
                </span>
                <span className="text-xl">🐫</span>
              </div>
              <h5 className="font-bold text-white text-sm">아라비아·이란·이집트</h5>
              <div className="text-xs text-slate-300 space-y-2 bg-slate-900 p-3 rounded-2xl border border-slate-800/80">
                <div>• <strong>아라비아</strong>: 와하브 운동 (순수 이슬람 복귀 ➔ 사우디아라비아)</div>
                <div>• <strong>이란</strong>: <span className="text-amber-300 font-bold">담배 불매 운동(1891)</span> ➔ 입헌 혁명</div>
                <div>• <strong>이집트</strong>: 수에즈 운하 빚 ➔ <strong>아라비 파샤</strong>("이집트인을 위한 이집트") ➔ 실패 후 영국의 보호국 전락</div>
              </div>
            </div>

            {/* 인도 (31강) */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-3xl p-5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                  31강 인도
                </span>
                <span className="text-xl">🐘</span>
              </div>
              <h5 className="font-bold text-white text-sm">세포이 &amp; 국민회의 4대 강령</h5>
              <div className="text-xs text-slate-300 space-y-2 bg-slate-900 p-3 rounded-2xl border border-slate-800/80">
                <div>• <strong>세포이 항쟁(1857)</strong>: 소·돼지기름 탄약지 반발 ➔ 무굴 멸망, <span className="text-rose-300 font-bold">영국령 인도 제국</span>(직접 지배)</div>
                <div>• <strong>벵골 분할령(1905)</strong>: 힌두-이슬람 이간질</div>
                <div>• <strong>인도 국민 회의 4대 강령</strong>:<br/>
                  <span className="text-amber-300 font-bold">① 스와라지(자치) ② 스와데시(국산품) ③ 보이콧(불매) ④ 민족교육</span>
                </div>
              </div>
            </div>

            {/* 일본 (34강) */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-3xl p-5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  34강 일본
                </span>
                <span className="text-xl">⛩️</span>
              </div>
              <h5 className="font-bold text-white text-sm">메이지 유신과 제국주의</h5>
              <div className="text-xs text-slate-300 space-y-2 bg-slate-900 p-3 rounded-2xl border border-slate-800/80">
                <div>• 페리 흑선 개항(1854) ➔ 막부 타도</div>
                <div>• <strong>메이지 유신 3종 세트</strong>:<br/>
                  <span className="text-emerald-300 font-bold">① 폐번치현(중앙집권) ② 징병제(무사해체) ③ 지조개정(세금안정)</span>
                </div>
                <div>• <strong>대일본 제국 헌법(1889)</strong>: 천황 절대권한 ➔ 청일·러일전쟁 승리 후 침략 가속</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 시험 직전 3초 컷 족집게 키워드 매칭 박스 */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <h4 className="text-base font-black text-amber-300 flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
          시험지 받자마자 1초 만에 짝짓는 초스피드 연결 공식
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
          <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 text-center">
            <span className="text-slate-400 block text-[11px] font-semibold">인민헌장</span>
            <strong className="text-rose-400 text-xs">영국 차티스트</strong>
          </div>
          <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 text-center">
            <span className="text-slate-400 block text-[11px] font-semibold">철혈 정책</span>
            <strong className="text-amber-400 text-xs">독일 비스마르크</strong>
          </div>
          <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 text-center">
            <span className="text-slate-400 block text-[11px] font-semibold">동유 운동</span>
            <strong className="text-sky-400 text-xs">베트남 판보이쩌우</strong>
          </div>
          <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 text-center">
            <span className="text-slate-400 block text-[11px] font-semibold">완충 독립국</span>
            <strong className="text-emerald-400 text-xs">타이 (라마 5세)</strong>
          </div>
          <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 text-center">
            <span className="text-slate-400 block text-[11px] font-semibold">파쇼다 사건</span>
            <strong className="text-purple-400 text-xs">영(종단) vs 프(횡단)</strong>
          </div>
          <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 text-center">
            <span className="text-slate-400 block text-[11px] font-semibold">폐번치현</span>
            <strong className="text-cyan-400 text-xs">일본 메이지 유신</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
