export interface ChatMessage {
  id: string;
  sender: string;
  avatar: string; // Emoji or short badge
  role: string;
  text: string;
  isMe?: boolean;
  timestamp: string;
  reaction?: string;
}

export interface LectureMemeChat {
  lectureId: number;
  roomTitle: string;
  subTitle: string;
  summaryMeme: string;
  messages: ChatMessage[];
}

export const memeChats: Record<number, LectureMemeChat> = {
  21: {
    lectureId: 21,
    roomTitle: "🧭 [단톡] 신항로 개척 & 종교 개혁 뒷담화방",
    subTitle: "후추 하나 사려다 지구 돌고 면벌부 찢은 역사적 사건",
    summaryMeme: "💡 3초 요약: 오스만이 길 막음 ➔ 후추 찾아 바다로 ➔ 은 쏟아져 물가 폭등(가격 혁명) ➔ 루터: '면벌부 사기 치지 마라'!",
    messages: [
      { id: "21-1", sender: "오스만 제국", avatar: "👳", role: "지중해 길목 장악", text: "유럽 애들아~ 지중해 비단길 내가 다 먹었다. 통행세 10배 내놔라 ㅋㅋㅋ", timestamp: "1453년" },
      { id: "21-2", sender: "유럽인들", avatar: "🥩", role: "후추 고픈 유럽", text: "고기 누린내 나서 후추 없으면 밥 못 먹는다고 ㅠㅠ 바닷길 뚫으러 간다!", timestamp: "1492년" },
      { id: "21-3", sender: "콜럼버스", avatar: "⛵", role: "길치 탐험가", text: "얘들아 나 인도 도착함! 여기 사는 사람들 인디언임!", timestamp: "1492년" },
      { id: "21-4", sender: "아메리카 원주민", avatar: "🌽", role: "어리둥절", text: "저기요 여긴 아메리카인데요... 그리고 왜 우리 금은 다 털어가요?", timestamp: "1493년", reaction: "😢" },
      { id: "21-5", sender: "마젤란 함대", avatar: "🌍", role: "최초 세계일주", text: "형들 계속 서쪽으로 갔더니 출발지로 돌아옴 ㅋㅋㅋ 지구 진짜 둥긂 인정!", timestamp: "1522년", reaction: "🔥" },
      { id: "21-6", sender: "마르틴 루터", avatar: "📜", role: "95개조 반박문", text: "야 교황청! 면벌부 돈 주고 사면 천국 간다고? 성당 문짝에 95개조 반박문 박았으니 읽어봐라!", timestamp: "1517년", reaction: "👍 95" },
      { id: "21-7", sender: "칼뱅", avatar: "💼", role: "스위스 제네바", text: "구원받을 사람은 이미 하나님이 정해둠(예정설). 그러니까 딴짓 말고 성실히 일해서 부자나 돼라!", timestamp: "1536년", reaction: "💰" }
    ]
  },
  22: {
    lectureId: 22,
    roomTitle: "☕ [단톡] 보스턴 앞바다 거대 홍차탕 사건",
    subTitle: "'대표 없는 곳에 과세 없다' 미국 독립 혁명",
    summaryMeme: "💡 3초 요약: 영국이 홍차에 세금 때림 ➔ 인디언 분장하고 바다에 투척 ➔ 워싱턴 참전 ➔ 최초의 민주 공화국 USA 탄생!",
    messages: [
      { id: "22-1", sender: "영국 국왕 조지 3세", avatar: "👑", role: "영국 본국", text: "식민지 녀석들아~ 7년 전쟁하느라 빚졌으니까 인지세, 설탕세, 홍차세 다 내라!", timestamp: "1765년" },
      { id: "22-2", sender: "식민지 대표들", avatar: "🎩", role: "북아메리카 13주", text: "영국 의회에 우리 식민지 대표 1명도 없는데 세금을 왜 냄? '대표 없는 곳에 세금 없다' 몰라?!", timestamp: "1765년", reaction: "😡" },
      { id: "22-3", sender: "보스턴 시민들", avatar: "🪶", role: "보스턴 차 사건", text: "인디언 분장하고 영국 배에 실린 홍차 상자 342개 바다에 다 던져버림 ㅋㅋㅋ 바다 맛이 구수하네", timestamp: "1773년", reaction: "🫖 342" },
      { id: "22-4", sender: "조지 워싱턴", avatar: "🦅", role: "독립군 총사령관", text: "영국군이 보스턴항 막았음. 대륙군 소집한다. 독립 전쟁 스타트!", timestamp: "1775년" },
      { id: "22-5", sender: "토머스 제퍼슨", avatar: "✍️", role: "독립선언서 작성", text: "독립선언서 썼음. 모든 인간은 평등하게 태어났고 자유와 행복을 추구할 권리가 있다!", timestamp: "1776년", reaction: "🇺🇸 만세" }
    ]
  },
  23: {
    lectureId: 23,
    roomTitle: "👑 [단톡] 영국 의회 vs 고집불통 왕들의 전쟁",
    subTitle: "의회 무시하다 단두대 간 찰스 1세 & 피 없이 성공한 명예혁명",
    summaryMeme: "💡 3초 요약: 찰스 1세 의회 무시 ➔ 청교도 혁명(크롬웰 참수) ➔ 크롬웰 독재(노잼) ➔ 명예혁명(피 없이 성공) ➔ 권리장전!",
    messages: [
      { id: "23-1", sender: "찰스 1세", avatar: "👑", role: "스튜어트 왕조", text: "왕권은 신이 줬다(왕권신수설)! 의회 너네 잔소리 듣기 싫으니까 해산하고 세금 걷는다!", timestamp: "1628년" },
      { id: "23-2", sender: "영국 의회", avatar: "⚖️", role: "의회파", text: "선 넘네? 권리청원 승인해놓고 또 배 째네? 의회군 출동!", timestamp: "1642년" },
      { id: "23-3", sender: "올리버 크롬웰", avatar: "⚔️", role: "철기대 대장", text: "찰스 1세 단두대 보내고 왕 없는 공화정 시작합니다. 대신 청교도 믿어야 하니 축구 금지, 극장 금지, 술 금지!", timestamp: "1649년", reaction: "😱" },
      { id: "23-4", sender: "영국 시민들", avatar: "🍺", role: "답답한 시민", text: "아니 왕 없앤 건 좋은데 축구랑 극장도 못 보게 하면 어떡하냐... 크롬웰 독재 숨 막혀 죽겠음", timestamp: "1658년" },
      { id: "23-5", sender: "윌리엄 3세 & 메리 2세", avatar: "👸", role: "공동 왕 추대", text: "피 한 방울 안 흘리고(명예혁명) 왕 됨! 의회 존중하고 권리장전 승인합니다. '왕은 군림하나 통치하지 않는다'!", timestamp: "1689년", reaction: "🇬🇧 평화" }
    ]
  },
  24: {
    lectureId: 24,
    roomTitle: "🏰 [단톡] 베르사유 파티룸과 절대군주들",
    subTitle: "하이힐 신고 발레 추던 루이 14세 & 수염 깎은 표트르 대제",
    summaryMeme: "💡 3초 요약: 왕권신수설 + 상비군 + 관료제 = 절대왕정 완성! 서유럽은 상인 키우고, 동유럽은 왕이 직접 계몽!",
    messages: [
      { id: "24-1", sender: "태양왕 루이 14세", avatar: "🌞", role: "짐이 곧 국가다", text: "베르사유 궁전 완공! 귀족들 파티하러 와라~ 내 기상 시중드는 사람만 벼슬 준다 ㅋㅋㅋ", timestamp: "1682년" },
      { id: "24-2", sender: "엘리자베스 1세", avatar: "👸", role: "영국 절대군주", text: "에스파냐 펠리페 2세의 무적함대 우리 영국 해군이 박살 냄! 난 국가와 결혼했다!", timestamp: "1588년", reaction: "🌊" },
      { id: "24-3", sender: "표트르 대제", avatar: "✂️", role: "러시아 서구화", text: "러시아 귀족들 긴 옷 입고 수염 기르는 거 구림! 서양식 양복 입고 수염 다 깎아라! 안 깎으면 수염세 부과함!", timestamp: "1698년", reaction: "🧔 세금" },
      { id: "24-4", sender: "프리드리히 2세", avatar: "🎖️", role: "프로이센", text: "난 루이 14세처럼 사치 안 부림. '군주는 국가 제1의 공복(심부름꾼)'이다!", timestamp: "1740년", reaction: "👏" }
    ]
  },
  25: {
    lectureId: 25,
    roomTitle: "🥖 [단톡] 빵값을 내놔라! 프랑스 혁명 오프닝",
    subTitle: "인구 2%가 꿀 빨던 신분제 박살 낸 바스티유 습격",
    summaryMeme: "💡 3초 요약: 구제도의 모순(앙시앵 레짐) ➔ 삼부회 파행 ➔ 테니스 코트 서약 ➔ 바스티유 감옥 습격 ➔ 인간과 시민의 권리 선언!",
    messages: [
      { id: "25-1", sender: "제3신분 평민들", avatar: "🧑‍🌾", role: "인구 98%", text: "우리가 세금 다 내는데 왜 성직자랑 귀족(인구 2%)만 면세 혜택받고 땅 절반 차지함? 억울해 죽겠네!", timestamp: "1789년" },
      { id: "25-2", sender: "루이 16세", avatar: "👑", role: "프랑스 왕", text: "국고가 바닥났으니 삼부회 열어서 신분별로 투표해서 세금 걷자!", timestamp: "1789년 5월" },
      { id: "25-3", sender: "제3신분 대표들", avatar: "🎾", role: "국민의회", text: "신분별 투표하면 1·2신분이 2대1로 맨날 이기잖아! 머릿수대로 투표해라! 테니스 코트로 모여!", timestamp: "1789년 6월", reaction: "🎾 서약" },
      { id: "25-4", sender: "파리 시민들", avatar: "🥖", role: "바스티유 습격", text: "빵값 미쳤다! 국왕이 군대 푼다는데 바스티유 감옥 습격해서 총과 화약 털어오자!", timestamp: "1789년 7월 14일", reaction: "🔥 함락" },
      { id: "25-5", sender: "라파예트", avatar: "📜", role: "인권선언 기초", text: "'인간과 시민의 권리 선언' 발표! 자유, 평등, 재산권, 국민주권은 침해받을 수 없다!", timestamp: "1789년 8월", reaction: "🇫🇷 자유·평등·우애" }
    ]
  },
  26: {
    lectureId: 26,
    roomTitle: "⚔️ [단톡] 단두대의 공포와 나폴레옹의 몰락",
    subTitle: "로베스피에르의 공포정치 & 러시아 추위에 무너진 내 사전에 불가능은 없다",
    summaryMeme: "💡 3초 요약: 루이 16세 처형 ➔ 로베스피에르 폭주 ➔ 테르미도르 반동 ➔ 나폴레옹 집권 ➔ 모스크바 원정 실패(영하 30도) ➔ 빈 체제!",
    messages: [
      { id: "26-1", sender: "로베스피에르", avatar: "⚖️", role: "공안위원회", text: "루이 16세와 마리 앙투아네트 단두대 처형 완료! 혁명에 조금이라도 반대하면 너도 단두대!", timestamp: "1793년", reaction: "😱" },
      { id: "26-2", sender: "파리 시민들", avatar: "🥶", role: "테르미도르 반동", text: "하루가 멀다 하고 목이 날아가네... 도저히 못 살겠다! 로베스피에르 너도 단두대로 가라!", timestamp: "1794년" },
      { id: "26-3", sender: "나폴레옹", avatar: "🐎", role: "황제 즉위", text: "나라 꼴이 엉망이네. 쿠데타로 집권하고 국민투표로 황제 됨. '내 사전에 불가능이란 없다' 유럽 정복 간다!", timestamp: "1804년", reaction: "👑" },
      { id: "26-4", sender: "러시아 장군 쿠투조프", avatar: "❄️", role: "모스크바 방어", text: "나폴레옹 60만 대군 끌고 왔네? 응 모스크바 다 불태우고 후퇴함~ 영하 30도 맛 좀 봐라 ㅋㅋㅋ", timestamp: "1812년", reaction: "🥶 얼어죽음" },
      { id: "26-5", sender: "메테르니히", avatar: "👴", role: "빈 회의 주최", text: "나폴레옹 워털루에서 패배했지? 유럽 국경선 프랑스 혁명 이전으로 다 되돌려라!(빈 체제)", timestamp: "1815년" }
    ]
  },
  27: {
    lectureId: 27,
    roomTitle: "🚂 [단톡] 칙칙폭폭! 기계 부수는 노동자들",
    subTitle: "제임스 와트의 증기기관 & 러다이트 운동과 차티스트 운동",
    summaryMeme: "💡 3초 요약: 영국에서 면직물 혁명 ➔ 증기기관으로 대량생산 ➔ 아동 16시간 노동(지옥) ➔ 러다이트(기계파괴) ➔ 차티스트(투표권 내놔)!",
    messages: [
      { id: "27-1", sender: "영국 공장주", avatar: "🎩", role: "자본가", text: "영국은 석탄·철 풍부하고 인클로저 운동으로 일할 사람 넘침! 공장 돌려서 떼돈 벌자!", timestamp: "1780년대" },
      { id: "27-2", sender: "제임스 와트", avatar: "⚙️", role: "증기기관 개량", text: "증기기관 개량 성공! 이제 날씨랑 바람 상관없이 기계가 24시간 슉슉 돌아갑니다!", timestamp: "1769년", reaction: "🚀 대량생산" },
      { id: "27-3", sender: "소년 노동자", avatar: "👦", role: "10세 노동자", text: "하루 16시간씩 먼지 구덩이에서 기계 닦고 일하는데 밥도 제대로 안 줘요 ㅠㅠ", timestamp: "1810년", reaction: "😢" },
      { id: "27-4", sender: "러다이트 비밀 결사", avatar: "🔨", role: "기계 파괴 운동", text: "기계 녀석들 때문에 우리 장인들 일자리 다 뺏겼다! 밤에 몰래 가서 공장 기계 다 박살 내자!", timestamp: "1811년", reaction: "💥 와장창" },
      { id: "27-5", sender: "차티스트 노동자들", avatar: "📜", role: "인민헌장(1838)", text: "기계 부수는 걸로는 안 끝남. 우리 노동자한테도 국회의원 뽑을 '보통 선거권' 달라!", timestamp: "1838년", reaction: "🗳️ 투표권" }
    ]
  },
  28: {
    lectureId: 28,
    roomTitle: "🌍 [단톡] 아프리카 지도에 자 대고 줄 긋기",
    subTitle: "약육강식 제국주의 & 파쇼다에서 만난 영국과 프랑스",
    summaryMeme: "💡 3초 요약: 사회진화론(우리가 우월해) ➔ 아프리카 분할 ➔ 영국 종단(세로) vs 프랑스 횡단(가로) ➔ 파쇼다 충돌 ➔ 에티오피아·라이베리아만 독립!",
    messages: [
      { id: "28-1", sender: "서양 열강 14국", avatar: "📐", role: "베를린 회의(1884)", text: "아프리카 부족이나 민족 경계선 알 바임? 지도에 자 대고 똑바로 선 그어서 나눠 먹자!", timestamp: "1884년" },
      { id: "28-2", sender: "영국", avatar: "🧭", role: "아프리카 종단 정책", text: "이집트 카이로부터 남아공 케이프타운까지 세로로 쭉 잇는다! (종단 정책)", timestamp: "1898년" },
      { id: "28-3", sender: "프랑스", avatar: "🗺️", role: "아프리카 횡단 정책", text: "우리는 알제리부터 마다가스카르까지 가로로 쭉 뚫는다! (횡단 정책)", timestamp: "1898년" },
      { id: "28-4", sender: "파쇼다 마을", avatar: "💥", role: "파쇼다 사건(1898)", text: "어? 종단선이랑 횡단선이 여기서 딱 겹쳤네? 영국군이랑 프랑스군 총 겨누고 대치 중!", timestamp: "1898년", reaction: "⚔️ 일촉즉발" },
      { id: "28-5", sender: "에티오피아 메넬리크 2세", avatar: "🦁", role: "아도와 전투 승리", text: "이탈리아 쳐들어왔는데 우리가 아도와 전투(1896)에서 박살 냄! 아프리카에서 독립 지켰다!", timestamp: "1896년", reaction: "🎉 유이한 독립국" }
    ]
  },
  29: {
    lectureId: 29,
    roomTitle: "🕌 [단톡] '유럽의 환자' 오스만의 눈물겨운 개혁",
    subTitle: "탄지마트 개혁 & 이란의 담배 피우지 마 운동",
    summaryMeme: "💡 3초 요약: 오스만 영토 털림 ➔ 탄지마트(은혜개혁) ➔ 청년 튀르크당 쿠데타 ➔ 이란: 영국 담배 불매 운동(종교 지도자 선언)!",
    messages: [
      { id: "29-1", sender: "오스만 제국", avatar: "🤕", role: "유럽의 환자", text: "그리스 독립하고 발칸반도 다 털렸음 ㅠㅠ 서양 무기랑 헌법 도입하는 '탄지마트(은혜 개혁)' 시작한다!", timestamp: "1839년" },
      { id: "29-2", sender: "미드하트 파샤", avatar: "📜", role: "아시아 최초 헌법", text: "아시아 최초로 근대적 헌법(1876) 제정하고 의회 열었음! 이제 입헌군주국이다!", timestamp: "1876년" },
      { id: "29-3", sender: "술탄 압둘 하미트 2세", avatar: "👑", role: "전제군주 복귀", text: "응 러시아랑 전쟁 터졌어~ 비상사태 핑계로 의회 해산하고 헌법 정지! 전제 정치 부활!", timestamp: "1878년", reaction: "🤦‍♂️ 도로아미타불" },
      { id: "29-4", sender: "청년 튀르크당", avatar: "✊", role: "군인·지식인 혁명", text: "술탄이 나라 말아먹네! 군대 몰고 가서 술탄 폐위시키고 헌법 부활시켰다!", timestamp: "1908년" },
      { id: "29-5", sender: "이란(카자르 왕조) 시민들", avatar: "🚭", role: "담배 불매 운동", text: "왕실이 영국에 담배 독점권 팔아넘겼다고? 전국민 담배 불매 운동 돌입! 물담배 다 부숴!", timestamp: "1891년", reaction: "🚭 담배금지" }
    ]
  },
  30: {
    lectureId: 30,
    roomTitle: "🐘 [단톡] 총알에 기름 발랐다고?! 세포이 항쟁",
    subTitle: "동인도 회사의 선 넘은 만행 & 벵골 분할령에 맞선 인도 국민 회의",
    summaryMeme: "💡 3초 요약: 세포이 항쟁(소·돼지기름 분노) ➔ 무굴 제국 멸망 ➔ 영국령 인도 제국 ➔ 벵골 분할령 ➔ 스와라지·스와데시 4대 강령!",
    messages: [
      { id: "30-1", sender: "영국 동인도 회사", avatar: "📦", role: "인도 침탈", text: "플라시 전투로 프랑스 쫓아내고 인도 전역 독점! 면화랑 차 싹 쓸어가자~", timestamp: "1850년대" },
      { id: "30-2", sender: "세포이 용병들", avatar: "🔫", role: "인도인 용병", text: "새 엔필드 소총 탄약포를 입으로 뜯으라는데 소기름(힌두교 성물)이랑 돼지기름(이슬람 금기) 발랐다고?! 우리 신앙 모욕하냐?!", timestamp: "1857년", reaction: "😡 대폭발" },
      { id: "30-3", sender: "빅토리아 여왕", avatar: "👑", role: "영국 황제", text: "세포이 항쟁 진압 완료. 동인도 회사 해체하고 내가 직접 '인도 제국 황제'로 즉위한다!", timestamp: "1877년" },
      { id: "30-4", sender: "영국 총독 커즌", avatar: "✂️", role: "벵골 분할령", text: "힌두교도랑 이슬람교도 단결 못 하게 벵골을 반으로 쪼개서 통치하겠다(벵골 분할령 1905)!", timestamp: "1905년" },
      { id: "30-5", sender: "인도 국민 회의(틸라크)", avatar: "🇮🇳", role: "4대 강령 발표", text: "영국산 불매(스와데시)! 자치 획득(스와라지)! 민족 교육! 국산품 애용! 벵골 분할령 당장 취소해라!", timestamp: "1906년", reaction: "🔥 승리(1911년 취소)" }
    ]
  },
  31: {
    lectureId: 31,
    roomTitle: "🌴 [단톡] 서양 열강들의 동남아 땅따먹기",
    subTitle: "홀로 독립 지킨 태국(시암) 라마 5세의 완충 지대 외교",
    summaryMeme: "💡 3초 요약: 영국(미얀마·말레이) vs 프랑스(베트남·라오스·캄보디아) vs 네덜란드(인니) ➔ 태국(시암)만 완충지대로 독립 성공!",
    messages: [
      { id: "31-1", sender: "네덜란드", avatar: "☕", role: "인도네시아 지배", text: "바타비아(자카르타) 거점으로 커피, 설탕 강제 재배! 향신료는 다 내 거야~", timestamp: "17세기~" },
      { id: "31-2", sender: "판보이쩌우", avatar: "🇻🇳", role: "베트남 광복회", text: "프랑스 인도차이나 총독부의 가혹한 식민지배에 맞서자! 청년들아 일본으로 유학 가자(동유 운동)!", timestamp: "1905년" },
      { id: "31-3", sender: "필리핀 아기날도", avatar: "🇵🇭", role: "독립선언", text: "에스파냐 300년 지배 끝내고 독립 선언했는데, 미국이 2천만 달러 주고 우리 땅 샀다고 또 쳐들어옴 ㅠㅠ", timestamp: "1898년", reaction: "😢" },
      { id: "31-4", sender: "태국(시암) 라마 5세(쭐랄롱꼰)", avatar: "🐘", role: "지혜로운 외교", text: "서쪽엔 영국(미얀마), 동쪽엔 프랑스(베트남)가 있네? 둘 사이에 끼어있는 완충 지대 명분으로 외교 협상해서 독립 유지 성공! 철도 깔고 근대 개혁 간다!", timestamp: "1890년대", reaction: "👑 레전드" }
    ]
  },
  32: {
    lectureId: 32,
    roomTitle: "🫖 [단톡] 홍차 빚 갚으려 마약 판 영국의 최후",
    subTitle: "제1·2차 아편 전쟁 & 예수 동생 자칭한 홍수전의 태평천국",
    summaryMeme: "💡 3초 요약: 영국 아편 밀수 ➔ 임칙서 아편 몰수 ➔ 아편전쟁 ➔ 난징조약(홍콩 뺏김) ➔ 홍수전 '멸만흥한' 태평천국!",
    messages: [
      { id: "32-1", sender: "영국 상인", avatar: "🫖", role: "차 무역 적자", text: "중국에서 도자기, 홍차 사느라 은이 바닥남... 인도산 아편 몰래 밀수해서 중국 애들 중독시키자!", timestamp: "1830년대" },
      { id: "32-2", sender: "임칙서", avatar: "🌊", role: "흠차대신", text: "마약으로 온 나라 백성들이 피폐해졌다! 광저우 호문 앞바다에 아편 2만 상자 소금물로 다 녹여버림!", timestamp: "1839년", reaction: "🔥 사이다" },
      { id: "32-3", sender: "영국 해군", avatar: "🚢", role: "증기군함 출동", text: "감히 우리 무역을 방해해? 군함 끌고 가서 베이징 앞바다 포격한다! (제1차 아편 전쟁)", timestamp: "1840년" },
      { id: "32-4", sender: "청나라 조정", avatar: "📜", role: "난징 조약(1842)", text: "불평등 조약 체결... 5개 항구 개항하고 홍콩 영국에 뺏기고 막대한 배상금 지급 ㅠㅠ", timestamp: "1842년", reaction: "😢" },
      { id: "32-5", sender: "홍수전", avatar: "✝️", role: "태평천국 운동", text: "꿈에 하느님이 계시를 줌! 만주족 청나라 멸망시키고 한족 부흥하자(멸만흥한)! 남녀평등! 토지 균등 분배(천조전무제)!", timestamp: "1851년", reaction: "🌾 농민 열광" }
    ]
  },
  33: {
    lectureId: 33,
    roomTitle: "💥 [단톡] 서양 무기만 사면 뭐 하냐? 청나라의 몰락",
    subTitle: "양무운동의 굴욕 ➔ 변법자강 ➔ 의화단 부청멸양 ➔ 신해혁명",
    summaryMeme: "💡 3초 요약: 양무운동(무기만 카피) ➔ 청일전쟁 참패 ➔ 변법자강(제도 바꾸자) ➔ 서태후 탄압 ➔ 의화단(부청멸양) ➔ 쑨원의 신해혁명!",
    messages: [
      { id: "33-1", sender: "이홍장 (양무파)", avatar: "🏭", role: "중체서용", text: "중국 유교 사상은 지키고 서양의 기술과 무기만 도입하자(중체서용)! 북양함대 창설!", timestamp: "1860~90s" },
      { id: "33-2", sender: "일본군", avatar: "🗾", role: "청일전쟁 승리", text: "청나라 북양함대 전멸 ㅋㅋㅋ 무기만 좋으면 뭐 함? 제도가 썩었는데! 시모노세키 조약 도장 찍어라!", timestamp: "1894년", reaction: "😱 충격" },
      { id: "33-3", sender: "캉유웨이 & 량치차오", avatar: "📜", role: "변법자강 운동", text: "일본 메이지 유신처럼 법과 의회 제도까지 싹 바꿔야 산다! (변법자강)", timestamp: "1898년" },
      { id: "33-4", sender: "서태후", avatar: "👵", role: "보수파 실세", text: "어린 황제랑 유생 놈들이 감히 내 권력을 넘봐? 100일 만에 주동자 전부 처형!", timestamp: "1898년", reaction: "🤦 100일 천하" },
      { id: "33-5", sender: "의화단", avatar: "🥋", role: "부청멸양", text: "청나라를 돕고 서양 오랑캐를 멸하자(부청멸양)! 철도 부수고 교회 불태워라!", timestamp: "1899년" },
      { id: "33-6", sender: "쑨원", avatar: "🤝", role: "신해혁명(1911)", text: "청나라는 이제 답이 없다! 민족·민권·민생의 '삼민주의'! 황제정 폐지하고 아시아 최초 민주 공화국 '중화민국' 세운다!", timestamp: "1911년", reaction: "🇹🇼 신해혁명 승리" }
    ]
  },
  34: {
    lectureId: 34,
    roomTitle: "🏯 [단톡] 상투 자르고 양복 입은 일본의 폭주",
    subTitle: "페리 제독의 흑선 내항 & 메이지 유신과 제국주의 침략",
    summaryMeme: "💡 3초 요약: 미국 페리 흑선 내항 ➔ 메이지 유신(천황 중심 근대화) ➔ 서양 옷 입고 단발령 ➔ 정한론 ➔ 강화도 조약 ➔ 청일전쟁!",
    messages: [
      { id: "34-1", sender: "미국 페리 제독", avatar: "🚢", role: "구로후네(흑선)", text: "대포 달린 검은 증기선 끌고 에도만 진입! 문 안 열면 포격한다? (미·일 화친 조약 1854)", timestamp: "1854년" },
      { id: "34-2", sender: "하급 무사 & 조슈·사쓰마", avatar: "⚔️", role: "막부 타도", text: "서양에 굴욕적으로 문 연 무능한 막부 타도하고 천황을 옹립하자! (존왕양이 ➔ 도막)", timestamp: "1867년" },
      { id: "34-3", sender: "메이지 천황 정부", avatar: "👔", role: "메이지 유신(1868)", text: "신분제 폐지! 상투 자르고(단발령) 서양식 양복 입고 양식 먹어라! 근대식 군대와 의회 설립!", timestamp: "1868년", reaction: "✨ 탈아입구" },
      { id: "34-4", sender: "이와쿠라 사절단", avatar: "🚢", role: "서양 시찰단", text: "미국·유럽 2년 동안 돌아보니 서양이 너무 앞서감... '아시아를 벗어나 서구 열강이 되자(탈아입구)'!", timestamp: "1871년" },
      { id: "34-5", sender: "일본 제국주의", avatar: "🎯", role: "침략 야욕", text: "내부 불만 돌릴 겸 조선을 정벌하자(정한론)! 운요호 사건 일으켜 강화도 조약 강요하고 청일전쟁 도발!", timestamp: "1876년", reaction: "😡 한반도 침탈" }
    ]
  }
};

export interface SpeedOxQuestion {
  id: number;
  lectureId: number;
  question: string;
  isO: boolean;
  explanation: string;
  wittyTag: string;
}

export const speedOxBank: SpeedOxQuestion[] = [
  { id: 1, lectureId: 21, question: "신항로 개척 이후 유럽으로 아메리카의 금과 은이 대량 유입되어 물가가 폭등한 현상을 '가격 혁명'이라 한다.", isO: true, explanation: "은이 쏟아져 화폐 가치 폭락 ➔ 물가 폭등! (상업 혁명과 구분 필수)", wittyTag: "💸 물가 폭등" },
  { id: 2, lectureId: 21, question: "마르틴 루터는 '예정설'을 주장하여 도시 상공업자의 이윤 추구를 신의 뜻으로 정당화했다.", isO: false, explanation: "예정설은 '칼뱅'의 주장! 루터는 '95개조 반박문'과 '오직 믿음·성서'!", wittyTag: "❌ 칼뱅 낚시 주의" },
  { id: 3, lectureId: 22, question: "미국 독립 혁명의 결정적 도화선이 된 사건은 영국 홍차 상자를 바다에 던진 '보스턴 차 사건'이다.", isO: true, explanation: "바다를 홍차탕으로 만든 날! 이후 워싱턴이 총사령관으로 독립전쟁 지휘!", wittyTag: "🫖 보스턴 바다" },
  { id: 4, lectureId: 23, question: "영국의 '명예혁명'은 수많은 유혈 사태와 전쟁 끝에 크롬웰이 왕으로 즉위한 사건이다.", isO: false, explanation: "피 한 방울 없이(명예롭게) 제임스 2세를 몰아내고 윌리엄·메리가 권리장전 승인!", wittyTag: "❌ 피 한 방울 안 흘림" },
  { id: 5, lectureId: 24, question: "프랑스의 '태양왕' 루이 14세는 '군주는 국가 제1의 공복이다'라는 명언을 남겼다.", isO: false, explanation: "루이 14세는 '짐이 곧 국가다'! '국가 제1의 공복'은 프로이센 프리드리히 2세!", wittyTag: "❌ 절대군주 명언 대결" },
  { id: 6, lectureId: 25, question: "프랑스 혁명 초기 파리 시민들이 전제 정치의 상징이자 무기를 탈취하기 위해 습격한 곳은 바스티유 감옥이다.", isO: true, explanation: "1789년 7월 14일 바스티유 습격으로 프랑스 혁명 발발!", wittyTag: "🥖 바스티유 습격" },
  { id: 7, lectureId: 26, question: "나폴레옹이 몰락하게 된 결정적 계기는 영하 30도의 혹한 속에서 치러진 러시아 원정의 대참패였다.", isO: true, explanation: "러시아의 초토화 작전과 혹한에 60만 대군이 무너짐!", wittyTag: "❄️ 모스크바 혹한" },
  { id: 8, lectureId: 27, question: "산업 혁명 당시 기계 때문에 일자리를 잃은 노동자들이 일으킨 기계 파괴 운동을 '차티스트 운동'이라 한다.", isO: false, explanation: "기계 파괴는 '러다이트 운동'! 차티스트 운동은 '투표권(참정권)' 요구!", wittyTag: "❌ 러다이트 vs 차티스트" },
  { id: 9, lectureId: 28, question: "영국의 종단 정책과 프랑스의 횡단 정책이 아프리카 수단에서 무력 충돌 직전까지 간 사건은 '파쇼다 사건'이다.", isO: true, explanation: "1898년 파쇼다에서 세로선과 가로선이 딱 부딪힘!", wittyTag: "📐 세로 vs 가로" },
  { id: 10, lectureId: 30, question: "인도의 '세포이 항쟁'은 영국이 엔필드 소총 탄약포에 소기름과 돼지기름을 바른 것에 분노하여 일어났다.", isO: true, explanation: "힌두교(소 숭배)와 이슬람교(돼지 금기) 모두의 역린을 건드림!", wittyTag: "🔫 세포이의 분노" },
  { id: 11, lectureId: 31, question: "제국주의 침략 속에서 동남아시아 중 유일하게 독립을 유지한 국가는 '시암(태국)'이다.", isO: true, explanation: "영국(미얀마)과 프랑스(인도차이나) 사이의 완충 지대로 외교적 독립 성공!", wittyTag: "🐘 시암 라마 5세" },
  { id: 12, lectureId: 32, question: "제1차 아편 전쟁 결과 맺어진 난징 조약으로 청나라는 홍콩을 영국에 넘겨주었다.", isO: true, explanation: "난징 조약으로 5개 항구 개항 + 홍콩 할양 + 거액 배상금!", wittyTag: "📜 난징 조약" },
  { id: 13, lectureId: 33, question: "청나라 양무운동은 서양의 유교 사상을 버리고 의회 제도와 헌법을 전면 도입하는 개혁이었다.", isO: false, explanation: "양무운동은 '중체서용'(유교는 지키고 무기 기술만 수용)! 제도 개혁은 '변법자강'!", wittyTag: "❌ 양무 vs 변법자강" },
  { id: 14, lectureId: 34, question: "일본 메이지 정부는 봉건 막부를 타도하고 천황 중심의 근대화 개혁(메이지 유신)을 단행하였다.", isO: true, explanation: "단발령, 신분제 폐지, 징병제, 의회 설립으로 서구 열강 대열 합류!", wittyTag: "👔 메이지 유신" }
];
