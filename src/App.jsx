import React, { useEffect, useMemo, useState } from "react";

const API_BASE = "http://localhost:8788";

const LS = {
  lang: "safety_lang",
  attendance: "safety_attendance_logs",
  quizLogs: "safety_quiz_logs",
  incidents: "safety_incident_logs",
  adminUnlocked: "safety_admin_unlocked",
};

const ADMIN_PASSWORD = "1234";

const LANGS = ["ko", "en", "ja"];

const I18N = {
  ko: {
    appTitle: "현장 안전 통합 프로토타입",
    subtitle: "A 출입/출석 · B 현장 대응 · C 사후 분석(관리자) — 생성형 AI 데모",
    home: "홈",
    aBtn: "A. 출입/출석(키오스크)",
    bBtn: "B. 현장 대응/대처(태블릿)",
    cBtn: "C. 사후 분석·AI(관리자)",
    apiTest: "API 연결 테스트(/health)",
    apiOk: "API 연결 OK",
    apiFail: "API 연결 실패(오프라인 모드로 동작)",

    langKo: "한국어",
    langEn: "English",
    langJa: "日本語",

    aTitle: "A. 출입/출석 키오스크",
    workerName: "근로자 이름(데모)",
    next: "다음",
    back: "뒤로",
    reset: "처음부터",
    ppeTitle: "보호구(PPE) 착용 확인",
    ppeHelp: "데모: 카메라 대신 버튼으로 판정",
    ppeOk: "착용 OK",
    ppeNo: "착용 NO",
    status: "상태",
    pass: "통과",
    fail: "실패",
    quizTitle: "안전 퀴즈",
    submit: "제출",
    result: "결과",
    saveAttendance: "출석 저장",
    savedAttendance: "출석이 저장되었습니다.",

    bTitle: "B. 현장 대응/대처",
    bDesc: "상황 입력 → 위험 단계 표시 → 대응 가이드 + AI 보강(온라인/오프라인 모두)",
    incidentType: "사고 유형",
    situationInput: "상황 입력",
    riskLevel: "위험 단계",
    showGuide: "대응 가이드 보기",
    aiBoost: "AI로 대응 보강",
    saveIncident: "사고 기록 저장",
    savedIncident: "사고 기록이 저장되었습니다.",
    recentIncidents: "최근 기록 보기",

    type_fall: "낙상/추락",
    type_chem: "화학물질",
    type_caught: "끼임(기계)",
    type_fire: "화재/연기",
    type_cut: "베임/출혈",
    type_elec: "감전",

    guideTitle: "즉시 조치",
    callTitle: "신고/이송 기준",
    reportTitle: "신고용 문구(복사)",

    copy: "복사",
    copied: "복사됨!",

    cTitle: "C. 사후 분석(관리자)",
    adminEnter: "관리자 모드 진입",
    adminLock: "관리자 잠금",
    adminPwAsk: "관리자 비밀번호 입력(데모: 1234)",
    adminWrong: "비밀번호가 틀렸습니다.",
    cDesc: "사고 기록을 목록으로 보고, AI로 원인/재발방지 가설을 생성합니다.",
    aiAnalyze: "AI 분석 실행(선택 기록 기반)",
    noIncidents: "저장된 사고 기록이 없습니다.",
    viewDetail: "상세 보기",
    analyzeThis: "이 기록으로 AI 분석",
    clearAll: "전체 기록 초기화",
    cleared: "초기화 완료",
    offlineNote: "※ API가 꺼져 있으면 오프라인 규칙 기반으로 동작합니다.",
 incidentList: "사고 기록 리스트(최신 20개)",

  },

  en: {
    appTitle: "Site Safety Integrated Prototype",
    subtitle: "A Attendance · B Response · C Post Analysis(Admin) — GenAI Demo",
    home: "Home",
    aBtn: "A. Attendance (Kiosk)",
    bBtn: "B. Response (Tablet)",
    cBtn: "C. Analysis · AI (Admin)",
    apiTest: "Test API (/health)",
    apiOk: "API OK",
    apiFail: "API Failed (Offline fallback)",

    langKo: "한국어",
    langEn: "English",
    langJa: "日本語",

    aTitle: "A. Attendance Kiosk",
    workerName: "Worker name (demo)",
    next: "Next",
    back: "Back",
    reset: "Restart",
    ppeTitle: "PPE Check",
    ppeHelp: "Demo: buttons instead of camera",
    ppeOk: "PPE OK",
    ppeNo: "PPE NO",
    status: "Status",
    pass: "PASS",
    fail: "FAIL",
    quizTitle: "Safety Quiz",
    submit: "Submit",
    result: "Result",
    saveAttendance: "Save attendance",
    savedAttendance: "Attendance saved.",

    bTitle: "B. On-site Response",
    bDesc: "Input situation → risk level → guide + AI boost (online/offline)",
    incidentType: "Incident type",
    situationInput: "Situation",
    riskLevel: "Risk level",
    showGuide: "Show guide",
    aiBoost: "AI boost",
    saveIncident: "Save incident",
    savedIncident: "Incident saved.",
    recentIncidents: "View recent logs",

    type_fall: "Fall",
    type_chem: "Chemical",
    type_caught: "Caught-in",
    type_fire: "Fire/Smoke",
    type_cut: "Cut/Bleeding",
    type_elec: "Electric shock",

    guideTitle: "Immediate actions",
    callTitle: "Call criteria",
    reportTitle: "Report template (copy)",

    copy: "Copy",
    copied: "Copied!",

    cTitle: "C. Post Analysis (Admin)",
    adminEnter: "Enter admin mode",
    adminLock: "Lock admin",
    adminPwAsk: "Enter admin password (demo: 1234)",
    adminWrong: "Wrong password.",
    cDesc: "Browse incident logs and generate cause/prevention hypotheses via AI.",
    aiAnalyze: "Run AI analysis (selected log)",
    noIncidents: "No incident logs.",
    viewDetail: "View detail",
    analyzeThis: "Analyze this log",
    clearAll: "Clear all logs",
    cleared: "Cleared.",
    offlineNote: "If API is off, offline rules will be used.",
incidentList: "Incident log list (latest 20)",

  },

  ja: {
    appTitle: "現場安全 統合プロトタイプ",
    subtitle: "A 出席 · B 対応 · C 事後分析(管理者) — 生成AIデモ",
    home: "ホーム",
    aBtn: "A. 出席(キオスク)",
    bBtn: "B. 現場対応(タブレット)",
    cBtn: "C. 分析・AI(管理者)",
    apiTest: "APIテスト(/health)",
    apiOk: "API OK",
    apiFail: "API 失敗(オフライン動作)",

    langKo: "한국어",
    langEn: "English",
    langJa: "日本語",

    aTitle: "A. 出席キオスク",
    workerName: "作業者名(デモ)",
    next: "次へ",
    back: "戻る",
    reset: "やり直し",
    ppeTitle: "保護具(PPE)確認",
    ppeHelp: "デモ：カメラの代わりにボタンで判定",
    ppeOk: "PPE OK",
    ppeNo: "PPE NO",
    status: "状態",
    pass: "合格",
    fail: "不合格",
    quizTitle: "安全クイズ",
    submit: "送信",
    result: "結果",
    saveAttendance: "出席保存",
    savedAttendance: "出席を保存しました。",

    bTitle: "B. 現場対応",
    bDesc: "状況入力 → 危険度 → ガイド + AI補強(オンライン/オフライン)",
    incidentType: "事故タイプ",
    situationInput: "状況入力",
    riskLevel: "危険度",
    showGuide: "ガイド表示",
    aiBoost: "AI補強",
    saveIncident: "事故保存",
    savedIncident: "事故を保存しました。",
    recentIncidents: "最近の記録",

    type_fall: "転倒/転落",
    type_chem: "化学物質",
    type_caught: "挟まれ",
    type_fire: "火災/煙",
    type_cut: "切創/出血",
    type_elec: "感電",

    guideTitle: "直ちに行うこと",
    callTitle: "通報基準",
    reportTitle: "通報テンプレ(コピー)",

    copy: "コピー",
    copied: "コピーしました！",

    cTitle: "C. 事後分析(管理者)",
    adminEnter: "管理者モード",
    adminLock: "ロック",
    adminPwAsk: "管理者パスワード入力(デモ: 1234)",
    adminWrong: "パスワードが違います。",
    cDesc: "事故記録を一覧し、AIで原因/再発防止仮説を生成します。",
    aiAnalyze: "AI分析実行(選択記録)",
    noIncidents: "事故記録がありません。",
    viewDetail: "詳細",
    analyzeThis: "この記録を分析",
    clearAll: "全記録削除",
    cleared: "削除しました。",
    offlineNote: "APIが停止中の場合、オフライン規則で動作します。",
 incidentList: "事故記録リスト（最新20件）",

  },
};

function lsGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function lsSet(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function nowISO() {
  return new Date().toISOString();
}

async function apiHealth() {
  const r = await fetch(`${API_BASE}/health`);
  if (!r.ok) throw new Error("health fail");
  return r.json();
}

async function callAI(mode, text) {
  const r = await fetch(`${API_BASE}/ai`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode, text }),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j?.error || "ai fail");
  return j;
}

async function safeCopy(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {}
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    return true;
  } catch {
    return false;
  }
}
const QUIZ_BANK = {
  ko: [
    { id: "ko_ppe_1", topic: "PPE", q: "안전모(헬멧)는 언제 착용해야 하나요?", options: ["작업 중 항상", "비 오는 날만", "관리자가 말할 때만", "필요할 때만"], correct: 0 },
    { id: "ko_loto_1", topic: "LOTO", q: "장비 점검 전 올바른 행동은?", options: ["전원 차단/잠금 후 점검", "작동 중 점검", "경고 무시", "혼자 무리"], correct: 0 },
    { id: "ko_fire_1", topic: "FIRE", q: "화재 시 우선 행동으로 적절한 것은?", options: ["대피 유도 및 신고", "연기 속으로 뛰어듦", "문을 열어 연기 확산", "혼자 진화"], correct: 0 },
    { id: "ko_chem_1", topic: "CHEM", q: "화학물질이 피부에 닿았을 때 우선 조치는?", options: ["흐르는 물로 충분히 세척", "마른 천으로 문지름", "약 바름", "기다림"], correct: 0 },
    { id: "ko_fall_1", topic: "FALL", q: "낙상 후 목/허리 손상 의심 시?", options: ["함부로 이동하지 않기", "바로 일으키기", "물 마시게 하기", "혼자 걷게"], correct: 0 },
  ],
  en: [
    { id: "en_ppe_1", topic: "PPE", q: "When should a hard hat be worn?", options: ["Always on site", "Only on rainy days", "Only if told", "Only sometimes"], correct: 0 },
    { id: "en_loto_1", topic: "LOTO", q: "Before inspecting machinery, you should…", options: ["Lockout/tagout power", "Touch moving parts", "Ignore warnings", "Rush alone"], correct: 0 },
    { id: "en_fire_1", topic: "FIRE", q: "In a fire, the best first action is…", options: ["Evacuate and call", "Run into smoke", "Open doors wide", "Fight alone"], correct: 0 },
    { id: "en_chem_1", topic: "CHEM", q: "If a chemical contacts skin, first you should…", options: ["Rinse with running water", "Rub with cloth", "Apply ointment", "Wait"], correct: 0 },
    { id: "en_fall_1", topic: "FALL", q: "If neck/back injury is suspected after a fall…", options: ["Do not move them", "Make them stand up", "Give water", "Walk them away"], correct: 0 },
  ],
  ja: [
    { id: "ja_ppe_1", topic: "PPE", q: "ヘルメットはいつ着用しますか？", options: ["現場では常に", "雨の日だけ", "言われた時だけ", "たまに"], correct: 0 },
    { id: "ja_loto_1", topic: "LOTO", q: "機械点検前の正しい行動は？", options: ["電源遮断・ロックアウト", "動く部品に触る", "警告を無視", "一人で急ぐ"], correct: 0 },
    { id: "ja_fire_1", topic: "FIRE", q: "火災時の最初の行動として適切なのは？", options: ["避難して通報", "煙の中へ", "扉を開放", "一人で消火"], correct: 0 },
    { id: "ja_chem_1", topic: "CHEM", q: "化学物質が皮膚に付着したら最初は？", options: ["流水で十分洗う", "布でこする", "薬を塗る", "待つ"], correct: 0 },
    { id: "ja_fall_1", topic: "FALL", q: "転落後に頸/腰損傷が疑われる場合は？", options: ["動かさない", "立たせる", "水を飲ませる", "歩かせる"], correct: 0 },
  ],
};

const MANUAL_KB = {
  fall: {
    ko: {
      immediate: ["의식/호흡 확인", "목/허리 손상 의심 시 이동 금지", "출혈 시 압박 지혈", "2차 사고 위험 제거"],
      call: ["의식저하/호흡이상", "심한 출혈/골절 의심", "고소추락"],
    },
    en: {
      immediate: ["Check consciousness/breathing", "Do NOT move if neck/back injury suspected", "Control bleeding", "Remove secondary hazards"],
      call: ["Loss of consciousness / breathing issues", "Severe bleeding / fracture", "Fall from height"],
    },
    ja: {
      immediate: ["意識・呼吸を確認", "頸/腰損傷疑いなら動かさない", "止血", "二次災害を防止"],
      call: ["意識低下/呼吸異常", "大量出血/骨折疑い", "高所からの転落"],
    },
  },
  chem: {
    ko: {
      immediate: ["노출 중지", "피부: 흐르는 물 15분 이상", "흡입: 신선한 공기", "MSDS 확인"],
      call: ["호흡곤란", "눈 노출/시야 이상", "의식 저하", "강산/강알칼리 의심"],
    },
    en: {
      immediate: ["Stop exposure", "Skin: rinse 15+ min", "Inhalation: fresh air", "Check SDS"],
      call: ["Breathing difficulty", "Eye exposure", "Altered mental status", "Strong acid/alkali"],
    },
    ja: {
      immediate: ["曝露を止める", "皮膚：流水で15分以上", "吸入：新鮮な空気", "SDS確認"],
      call: ["呼吸困難", "目への曝露", "意識障害", "強酸/強アルカリ"],
    },
  },
  caught: {
    ko: {
      immediate: ["비상정지/전원차단", "무리하게 빼지 않기", "압박 지혈", "재가동 금지"],
      call: ["절단/압궤 의심", "심한 출혈", "의식/호흡 이상"],
    },
    en: {
      immediate: ["E-stop & power off", "Do not forcefully pull", "Control bleeding", "Prevent restart"],
      call: ["Crush/amputation suspected", "Severe bleeding", "Breathing issues"],
    },
    ja: {
      immediate: ["非常停止・電源遮断", "無理に引き抜かない", "止血", "再稼働禁止"],
      call: ["圧挫/切断疑い", "大量出血", "呼吸異常"],
    },
  },
  fire: {
    ko: {
      immediate: ["연기 흡입 방지(낮은 자세)", "대피 유도", "가능 시 초기 소화", "집결지 이동"],
      call: ["연기/화염 확산", "대피 어려움", "부상자", "폭발 위험"],
    },
    en: {
      immediate: ["Stay low to avoid smoke", "Evacuate", "Use extinguisher if safe", "Go to assembly point"],
      call: ["Fire spreading", "Evacuation difficult", "Injuries", "Explosion risk"],
    },
    ja: {
      immediate: ["低い姿勢で煙回避", "避難誘導", "安全なら初期消火", "集合場所へ"],
      call: ["拡大", "避難困難", "負傷者", "爆発危険"],
    },
  },
  cut: {
    ko: { immediate: ["출혈 확인", "압박 지혈", "오염 방지", "절단물 보존(가능시)"], call: ["지혈 불가", "출혈 심함", "절단 의심"] },
    en: { immediate: ["Check bleeding", "Direct pressure", "Prevent contamination", "Preserve amputated part if any"], call: ["Bleeding not controlled", "Severe bleeding", "Amputation suspected"] },
    ja: { immediate: ["出血確認", "圧迫止血", "汚染防止", "切断部位の保護"], call: ["止血不可", "大量出血", "切断疑い"] },
  },
  elec: {
    ko: { immediate: ["전원 차단(안전 확인)", "접촉 금지", "의식/호흡 확인", "CPR 준비"], call: ["의식 없음", "호흡 이상", "화상/2차 추락"] },
    en: { immediate: ["Cut power safely", "Do not touch directly", "Check breathing", "Prepare CPR"], call: ["Unconscious", "Breathing abnormal", "Burns/secondary fall"] },
    ja: { immediate: ["安全に電源遮断", "直接触れない", "意識/呼吸確認", "CPR準備"], call: ["意識なし", "呼吸異常", "火傷/二次転落"] },
  },
};

function classifyIncidentText(text) {
  const s = (text || "").toLowerCase();
  if (s.includes("낙") || s.includes("fall") || s.includes("転") || s.includes("転倒")) return "fall";
  if (s.includes("화학") || s.includes("chem") || s.includes("酸") || s.includes("アルカリ") || s.includes("薬")) return "chem";
  if (s.includes("끼") || s.includes("caught") || s.includes("挟") || s.includes("巻き込")) return "caught";
  if (s.includes("화재") || s.includes("fire") || s.includes("煙") || s.includes("火")) return "fire";
  if (s.includes("베") || s.includes("cut") || s.includes("出血") || s.includes("切")) return "cut";
  if (s.includes("감전") || s.includes("electric") || s.includes("shock") || s.includes("感電")) return "elec";
  return "fall";
}

function riskToLabel(lang, risk) {

  function calcRiskFromText(type, text) {
  const s = (text || "").toLowerCase();
  let risk = 35;

  // 유형 기본 가중치
  const base = {
    fire: 75,
    elec: 70,
    chem: 65,
    caught: 70,
    fall: 55,
    cut: 45,
  };
  if (base[type]) risk = base[type];

  // 키워드 가중치(상황 입력 기반)
  const bump = (n) => (risk = Math.max(0, Math.min(100, risk + n)));

  if (s.includes("의식") || s.includes("unconscious") || s.includes("無意識")) bump(30);
  if (s.includes("호흡") || s.includes("breath") || s.includes("呼吸")) bump(25);
  if (s.includes("심정지") || s.includes("cardiac") || s.includes("心停止")) bump(35);

  if (s.includes("대량") || s.includes("massive") || s.includes("大量")) bump(25);
  if (s.includes("출혈") || s.includes("bleed") || s.includes("出血")) bump(20);
  if (s.includes("골절") || s.includes("fracture") || s.includes("骨折")) bump(20);
  if (s.includes("절단") || s.includes("amput") || s.includes("切断")) bump(35);

  if (s.includes("연기") || s.includes("smoke") || s.includes("煙")) bump(20);
  if (s.includes("폭발") || s.includes("explos") || s.includes("爆発")) bump(35);

  if (s.includes("누출") || s.includes("leak") || s.includes("漏")) bump(20);
  if (s.includes("산") || s.includes("acid") || s.includes("酸")) bump(15);
  if (s.includes("알칼리") || s.includes("alkali") || s.includes("アルカリ")) bump(15);

  if (s.includes("화상") || s.includes("burn") || s.includes("火傷")) bump(20);
  if (s.includes("고소") || s.includes("height") || s.includes("高所")) bump(20);

  return risk;
}

  const r = Number(risk || 0);
  const tier = r >= 80 ? "HIGH" : r >= 50 ? "MEDIUM" : "LOW";
  if (lang === "en") return tier;
  if (lang === "ja") return tier === "HIGH" ? "高" : tier === "MEDIUM" ? "中" : "低";
  return tier === "HIGH" ? "높음" : tier === "MEDIUM" ? "중간" : "낮음";
}

function calcRiskFromText(type, text) {
  const s = (text || "").toLowerCase();
  let risk = 35;

  // 유형 기본 가중치
  const base = {
    fire: 75,
    elec: 70,
    chem: 65,
    caught: 70,
    fall: 55,
    cut: 45,
  };
  if (base[type]) risk = base[type];

  // 키워드 가중치(상황 입력 기반)
  const bump = (n) => (risk = Math.max(0, Math.min(100, risk + n)));

  if (s.includes("의식") || s.includes("unconscious") || s.includes("無意識")) bump(30);
  if (s.includes("호흡") || s.includes("breath") || s.includes("呼吸")) bump(25);
  if (s.includes("심정지") || s.includes("cardiac") || s.includes("心停止")) bump(35);

  if (s.includes("대량") || s.includes("massive") || s.includes("大量")) bump(25);
  if (s.includes("출혈") || s.includes("bleed") || s.includes("出血")) bump(20);
  if (s.includes("골절") || s.includes("fracture") || s.includes("骨折")) bump(20);
  if (s.includes("절단") || s.includes("amput") || s.includes("切断")) bump(35);

  if (s.includes("연기") || s.includes("smoke") || s.includes("煙")) bump(20);
  if (s.includes("폭발") || s.includes("explos") || s.includes("爆発")) bump(35);

  if (s.includes("누출") || s.includes("leak") || s.includes("漏")) bump(20);
  if (s.includes("산") || s.includes("acid") || s.includes("酸")) bump(15);
  if (s.includes("알칼리") || s.includes("alkali") || s.includes("アルカリ")) bump(15);

  if (s.includes("화상") || s.includes("burn") || s.includes("火傷")) bump(20);
  if (s.includes("고소") || s.includes("height") || s.includes("高所")) bump(20);

  return risk;
}


function offlineAI(mode, lang, text) {
  const k = classifyIncidentText(text);
  const kb = MANUAL_KB[k]?.[lang] || MANUAL_KB[k]?.ko;
  if (mode === "respond") {
    const lines = [
      "OFFLINE AI (RULE-BASED)",
      "",
      "[즉시 조치 / Immediate / 直ちに]",
      ...(kb?.immediate || []).map((x) => "- " + x),
      "",
      "[신고 기준 / Call criteria / 通報基準]",
      ...(kb?.call || []).map((x) => "- " + x),
      "",
      "입력(Input): " + text,
    ];
    return { ok: true, mode, answer: lines.join("\n") };
  }
  const lines = [
    "OFFLINE AI (HEURISTIC)",
    "",
    "원인 가설:",
    "- 작업절차 미준수/교육 미흡/환경 요인 가능",
    "",
    "재발 방지:",
    "- 교육/퀴즈 강화, 작업표준서 개선, 점검/감시 강화",
    "",
    "입력(Input): " + text,
  ];
  return { ok: true, mode, answer: lines.join("\n") };
}
export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem(LS.lang) || "ko");
  const t = useMemo(() => I18N[lang] || I18N.ko, [lang]);

  const [screen, setScreen] = useState("home"); // home | A | B | C

  const [apiOnline, setApiOnline] = useState(false);

  // A 상태
  const [aPhase, setAPhase] = useState("intro"); // intro | ppe | quiz | done
  const [workerName, setWorkerName] = useState("");
  const [ppePassed, setPpePassed] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // B 상태
  const [bType, setBType] = useState("fall");
  const [bRisk, setBRisk] = useState(40);
  const [bText, setBText] = useState("");
  const [bGuide, setBGuide] = useState(null);
  const [bCopied, setBCopied] = useState(false);
  const [bAiOut, setBAiOut] = useState("");

  useEffect(() => {
  const r = calcRiskFromText(bType, bText);
  setBRisk(r);
}, [bType, bText]);


  // C(관리자) 상태
  const [adminUnlocked, setAdminUnlocked] = useState(() => lsGet(LS.adminUnlocked, false));
  const [cSelected, setCSelected] = useState(null);
  const [cAiOut, setCAiOut] = useState("");

  useEffect(() => {
    localStorage.setItem(LS.lang, lang);
  }, [lang]);

  useEffect(() => {
    // API 헬스 체크(자동)
    (async () => {
      try {
        await apiHealth();
        setApiOnline(true);
      } catch {
        setApiOnline(false);
      }
    })();
  }, []);

  const quizQuestions = useMemo(() => {
    const bank = QUIZ_BANK[lang] || QUIZ_BANK.ko;
    // 데모: 2문항
    return bank.slice(0, 2).map((x) => ({
      id: x.id,
      topic: x.topic,
      q: x.q,
      options: x.options,
      correct: x.correct,
    }));
  }, [lang]);

  function resetA() {
    setAPhase("intro");
    setWorkerName("");
    setPpePassed(false);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  }

  function submitQuizA() {
    let score = 0;
    for (const q of quizQuestions) {
      if (quizAnswers[q.id] === q.correct) score += 1;
    }
    setQuizScore(score);
    setQuizSubmitted(true);

    const logs = lsGet(LS.quizLogs, []);
    const wrongTopics = quizQuestions
      .filter((q) => quizAnswers[q.id] !== q.correct)
      .map((q) => q.topic || "UNKNOWN");

    logs.unshift({
      at: nowISO(),
      worker: workerName || "(demo)",
      lang,
      score,
      total: quizQuestions.length,
      wrongTopics,
    });
    lsSet(LS.quizLogs, logs);
  }

  function saveAttendanceA() {
    const passed = ppePassed && quizScore >= 1;
    const logs = lsGet(LS.attendance, []);
    logs.unshift({
      at: nowISO(),
      worker: workerName || "(demo)",
      lang,
      ppePassed,
      quizScore,
      quizTotal: quizQuestions.length,
      passed,
    });
    lsSet(LS.attendance, logs);
    alert(t.savedAttendance);
    setAPhase("done");
  }

  function enterA() {
    setScreen("A");
    resetA();
  }
  function enterB() {
    setScreen("B");
    setBGuide(null);
    setBAiOut("");
    setBCopied(false);
  }
  function enterC() {
    setScreen("C");
    setCSelected(null);
    setCAiOut("");
  }

  async function testAPI() {
    try {
      await apiHealth();
      setApiOnline(true);
      alert(t.apiOk);
    } catch {
      setApiOnline(false);
      alert(t.apiFail);
    }
  }

  async function aiRespond(text) {
    const payload = String(text || "").trim();
    if (!payload) return { ok: true, answer: "" };
    if (apiOnline) {
      try {
        const j = await callAI("respond", payload);
        return j;
      } catch {
        setApiOnline(false);
        return offlineAI("respond", lang, payload);
      }
    }
    return offlineAI("respond", lang, payload);
  }

  async function aiAnalyze(text) {
    const payload = String(text || "").trim();
    if (!payload) return { ok: true, answer: "" };
    if (apiOnline) {
      try {
        const j = await callAI("analyze", payload);
        return j;
      } catch {
        setApiOnline(false);
        return offlineAI("analyze", lang, payload);
      }
    }
    return offlineAI("analyze", lang, payload);
  }

  function saveIncident() {
    const text = bText.trim();
    if (!text) return alert(t.situationInput);

    const list = lsGet(LS.incidents, []);
    list.unshift({
      at: nowISO(),
      lang,
      type: bType,
      risk: bRisk,
      riskLabel: riskToLabel(lang, bRisk),
      text,
    });
    lsSet(LS.incidents, list);
    alert(t.savedIncident);
    setBText("");
  }

  function unlockAdmin() {
    const pw = prompt(t.adminPwAsk) || "";
    if (pw === ADMIN_PASSWORD) {
      setAdminUnlocked(true);
      lsSet(LS.adminUnlocked, true);
    } else {
      alert(t.adminWrong);
    }
  }

  function lockAdmin() {
    setAdminUnlocked(false);
    lsSet(LS.adminUnlocked, false);
    alert(t.adminLock);
  }

  function clearAll() {
    const ok = confirm("모든 기록을 삭제할까요?");
    if (!ok) return;
    localStorage.removeItem(LS.attendance);
    localStorage.removeItem(LS.quizLogs);
    localStorage.removeItem(LS.incidents);
    localStorage.removeItem(LS.adminUnlocked);
    alert(t.cleared);
  }

  const ui = {
    page: {
      minHeight: "100vh",
      background: "radial-gradient(1200px 800px at 20% 10%, rgba(59,130,246,0.22), rgba(11,18,32,1))",
      color: "#ffffff",
      fontFamily:
        "system-ui, -apple-system, Segoe UI, Roboto, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif",
      padding: 14,
      boxSizing: "border-box",
      maxWidth: 1040,
      margin: "0 auto",
    },
    top: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
      flexWrap: "wrap",
      marginBottom: 12,
    },
    title: { margin: 0, fontSize: 20, fontWeight: 1000, letterSpacing: -0.2 },
    small: { fontSize: 12, opacity: 0.88, lineHeight: 1.5 },
    card: {
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.12)",
      borderRadius: 18,
      padding: 14,
    },
    row: { display: "flex", gap: 10, flexWrap: "wrap" },
    btn: {
      padding: "10px 12px",
      borderRadius: 12,
      border: "1px solid rgba(255,255,255,0.16)",
      background: "rgba(255,255,255,0.08)",
      color: "#fff",
      cursor: "pointer",
      fontWeight: 900,
    },
    btnP: {
      padding: "10px 12px",
      borderRadius: 12,
      border: "1px solid rgba(255,255,255,0.22)",
      background: "rgba(59,130,246,0.92)",
      color: "#fff",
      cursor: "pointer",
      fontWeight: 1000,
    },
    btnG: {
      padding: "10px 12px",
      borderRadius: 12,
      border: "1px solid rgba(255,255,255,0.22)",
      background: "rgba(34,197,94,0.90)",
      color: "#fff",
      cursor: "pointer",
      fontWeight: 1000,
    },
    btnO: {
      padding: "10px 12px",
      borderRadius: 12,
      border: "1px solid rgba(255,255,255,0.22)",
      background: "rgba(245,158,11,0.92)",
      color: "#fff",
      cursor: "pointer",
      fontWeight: 1000,
    },
    btnR: {
      padding: "10px 12px",
      borderRadius: 12,
      border: "1px solid rgba(255,255,255,0.22)",
      background: "rgba(239,68,68,0.92)",
      color: "#fff",
      cursor: "pointer",
      fontWeight: 1000,
    },
    input: {
      width: "100%",
      padding: "12px 12px",
      borderRadius: 12,
      border: "1px solid rgba(255,255,255,0.16)",
      background: "rgba(0,0,0,0.25)",
      color: "#fff",
      outline: "none",
      boxSizing: "border-box",
    },
    hr: { border: "none", borderTop: "1px solid rgba(255,255,255,0.12)", margin: "12px 0" },
    badge: (ok) => ({
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "8px 12px",
      borderRadius: 999,
      fontWeight: 1000,
      background: ok ? "rgba(34,197,94,0.18)" : "rgba(239,68,68,0.18)",
      border: `1px solid ${ok ? "rgba(34,197,94,0.35)" : "rgba(239,68,68,0.35)"}`,
    }),
    kioskWrap: {
      borderRadius: 22,
      padding: 18,
      border: "1px solid rgba(255,255,255,0.14)",
      background: "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
    },
    kioskTitle: { fontSize: 30, fontWeight: 1100, margin: "4px 0 10px", letterSpacing: -0.5 },
    kioskBtn: {
      padding: "18px 18px",
      borderRadius: 18,
      border: "1px solid rgba(255,255,255,0.22)",
      background: "rgba(59,130,246,0.92)",
      color: "#fff",
      cursor: "pointer",
      fontWeight: 1100,
      fontSize: 20,
      minWidth: 220,
    },
    kioskBtnG: {
      padding: "18px 18px",
      borderRadius: 18,
      border: "1px solid rgba(255,255,255,0.22)",
      background: "rgba(34,197,94,0.92)",
      color: "#fff",
      cursor: "pointer",
      fontWeight: 1100,
      fontSize: 20,
      minWidth: 220,
    },
    kioskBtnR: {
      padding: "18px 18px",
      borderRadius: 18,
      border: "1px solid rgba(255,255,255,0.22)",
      background: "rgba(239,68,68,0.92)",
      color: "#fff",
      cursor: "pointer",
      fontWeight: 1100,
      fontSize: 20,
      minWidth: 220,
    },
    kioskInput: {
      width: "100%",
      padding: "16px 14px",
      borderRadius: 18,
      border: "1px solid rgba(255,255,255,0.16)",
      background: "rgba(0,0,0,0.25)",
      color: "#fff",
      outline: "none",
      boxSizing: "border-box",
      fontSize: 20,
    },
  };
  return (
    <div style={ui.page}>
      <div style={ui.top}>
        <div>
          <h1 style={ui.title}>{t.appTitle}</h1>
          <div style={ui.small}>{t.subtitle}</div>
          <div style={{ marginTop: 6 }}>
            <span style={ui.badge(apiOnline)}>
              {apiOnline ? "API: ONLINE" : "API: OFFLINE"} · {t.offlineNote}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <button style={lang === "ko" ? ui.btnP : ui.btn} onClick={() => setLang("ko")}>
            {t.langKo}
          </button>
          <button style={lang === "en" ? ui.btnP : ui.btn} onClick={() => setLang("en")}>
            {t.langEn}
          </button>
          <button style={lang === "ja" ? ui.btnP : ui.btn} onClick={() => setLang("ja")}>
            {t.langJa}
          </button>

          <button style={ui.btn} onClick={() => setScreen("home")}>
            {t.home}
          </button>

          <button style={ui.btnO} onClick={testAPI}>
            {t.apiTest}
          </button>
        </div>
      </div>

      {screen === "home" && (
        <div style={ui.card}>
          <div style={ui.row}>
            <button style={ui.btnP} onClick={enterA}>
              {t.aBtn}
            </button>
            <button style={ui.btnP} onClick={enterB}>
              {t.bBtn}
            </button>
            <button style={ui.btnP} onClick={enterC}>
              {t.cBtn}
            </button>
          </div>

          <div style={ui.hr} />

          <div style={{ lineHeight: 1.8, opacity: 0.92 }}>
            <div>• A: PPE 체크 + 퀴즈 통과 → 출석 저장</div>
            <div>• B: 위험 단계 + 즉시 대응 가이드 + AI 보강(온라인/오프라인)</div>
            <div>• C: 관리자 비번 + 사고 리스트 + AI 사후 분석</div>
          </div>
        </div>
      )}

      {screen === "A" && (
        <div style={ui.kioskWrap}>
          <div style={ui.kioskTitle}>{t.aTitle}</div>

          {aPhase === "intro" && (
            <div>
              <div style={{ fontWeight: 1000, marginBottom: 10 }}>{t.workerName}</div>
              <input
                style={ui.kioskInput}
                value={workerName}
                onChange={(e) => setWorkerName(e.target.value)}
                placeholder={t.workerName}
              />

              <div style={{ marginTop: 14 }}>
                <button
                  style={ui.kioskBtn}
                  onClick={() => {
                    if (!workerName.trim()) return alert("이름 입력 / Enter name / 名前入力");
                    setAPhase("ppe");
                  }}
                >
                  {t.next}
                </button>
              </div>
            </div>
          )}

          {aPhase === "ppe" && (
            <div>
              <div style={{ fontSize: 22, fontWeight: 1100, marginBottom: 6 }}>{t.ppeTitle}</div>
              <div style={{ opacity: 0.88, marginBottom: 12 }}>{t.ppeHelp}</div>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                <button style={ui.kioskBtnG} onClick={() => setPpePassed(true)}>
                  {t.ppeOk}
                </button>
                <button style={ui.kioskBtnR} onClick={() => setPpePassed(false)}>
                  {t.ppeNo}
                </button>

                <div style={ui.badge(ppePassed)}>
                  {t.status}: {ppePassed ? t.pass : t.fail}
                </div>
              </div>

              <div style={{ marginTop: 16, display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button
                  style={ppePassed ? ui.kioskBtn : ui.btn}
                  onClick={() => {
                    if (!ppePassed) return alert("PPE 통과 후 진행 가능");
                    setAPhase("quiz");
                  }}
                >
                  {t.next}
                </button>

                <button style={ui.btn} onClick={() => setAPhase("intro")}>
                  ← {t.back}
                </button>
              </div>
            </div>
          )}

          {aPhase === "quiz" && (
            <div>
              <div style={{ fontSize: 22, fontWeight: 1100, marginBottom: 10 }}>{t.quizTitle}</div>

              <div style={{ display: "grid", gap: 12 }}>
                {quizQuestions.map((q, idx) => (
                  <div key={q.id} style={ui.card}>
                    <div style={{ fontWeight: 1100, fontSize: 18 }}>
                      {idx + 1}. {q.q}
                    </div>

                    <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
                      {q.options.map((opt, oi) => (
                        <label
                          key={oi}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            padding: "12px 12px",
                            borderRadius: 14,
                            border: "1px solid rgba(255,255,255,0.14)",
                            background: "rgba(0,0,0,0.18)",
                            cursor: "pointer",
                          }}
                        >
                          <input
                            type="radio"
                            name={q.id}
                            checked={quizAnswers[q.id] === oi}
                            onChange={() => setQuizAnswers((p) => ({ ...p, [q.id]: oi }))}
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {!quizSubmitted ? (
                <div style={{ marginTop: 12, display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <button style={ui.kioskBtn} onClick={submitQuizA}>
                    {t.submit}
                  </button>
                  <button style={ui.btn} onClick={() => setAPhase("ppe")}>
                    ← {t.back}
                  </button>
                </div>
              ) : (
                <div style={{ marginTop: 12 }}>
                  <div style={ui.badge(quizScore >= 1)}>
                    {t.result}: {quizScore}/{quizQuestions.length} ({quizScore >= 1 ? t.pass : t.fail})
                  </div>

                  <div style={{ marginTop: 12, display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <button style={ui.kioskBtnG} onClick={saveAttendanceA}>
                      {t.saveAttendance}
                    </button>
                    <button style={ui.btn} onClick={() => setAPhase("ppe")}>
                      ← {t.back}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {aPhase === "done" && (
            <div>
              <div style={{ fontSize: 26, fontWeight: 1200, marginBottom: 10 }}>✅ {t.savedAttendance}</div>
              <div style={{ opacity: 0.9, lineHeight: 1.8 }}>
                <div>• Worker: {workerName}</div>
                <div>• Lang: {lang.toUpperCase()}</div>
                <div>• PPE: {ppePassed ? t.pass : t.fail}</div>
                <div>
                  • Quiz: {quizScore}/{quizQuestions.length}
                </div>
              </div>

              <div style={{ marginTop: 14, display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button style={ui.kioskBtn} onClick={() => setScreen("home")}>
                  {t.home}
                </button>
                <button style={ui.btn} onClick={resetA}>
                  {t.reset}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      {screen === "B" && (
        <div style={ui.card}>
          <h2 style={{ marginTop: 0 }}>{t.bTitle}</h2>
          <div style={{ marginTop: 6, opacity: 0.92, lineHeight: 1.7 }}>{t.bDesc}</div>

          <div style={ui.hr} />

          <div style={{ fontWeight: 1000, marginBottom: 8 }}>{t.incidentType}</div>
          <div style={ui.row}>
            <button style={bType === "fall" ? ui.btnP : ui.btn} onClick={() => setBType("fall")}>
              {t.type_fall}
            </button>
            <button style={bType === "chem" ? ui.btnP : ui.btn} onClick={() => setBType("chem")}>
              {t.type_chem}
            </button>
            <button style={bType === "caught" ? ui.btnP : ui.btn} onClick={() => setBType("caught")}>
              {t.type_caught}
            </button>
            <button style={bType === "fire" ? ui.btnP : ui.btn} onClick={() => setBType("fire")}>
              {t.type_fire}
            </button>
            <button style={bType === "cut" ? ui.btnP : ui.btn} onClick={() => setBType("cut")}>
              {t.type_cut}
            </button>
            <button style={bType === "elec" ? ui.btnP : ui.btn} onClick={() => setBType("elec")}>
              {t.type_elec}
            </button>
          </div>

          <div style={{ marginTop: 14 }}>
            <div style={{ fontWeight: 1000 }}>
              {t.riskLevel}: {riskToLabel(lang, bRisk)} ({bRisk})
            </div>
            
          </div>

          <div style={{ marginTop: 14, fontWeight: 1000 }}>{t.situationInput}</div>
          <textarea
            style={{ ...ui.input, minHeight: 120, resize: "vertical", marginTop: 8 }}
            value={bText}
            onChange={(e) => setBText(e.target.value)}
            placeholder="예) 작업자가 기계에 손이 끼임, 출혈 있음 / fall + bleeding..."
          />

          <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              style={ui.btnP}
              onClick={() => {
                const k = bType || classifyIncidentText(bText);
                const kb = MANUAL_KB[k]?.[lang] || MANUAL_KB[k]?.ko;
                const name =
                  k === "fall"
                    ? t.type_fall
                    : k === "chem"
                    ? t.type_chem
                    : k === "caught"
                    ? t.type_caught
                    : k === "fire"
                    ? t.type_fire
                    : k === "cut"
                    ? t.type_cut
                    : t.type_elec;

                const report =
                  lang === "ko"
                    ? `긴급 신고 템플릿\n- 상황: ${name}\n- 위험도: ${riskToLabel(lang, bRisk)}(${bRisk})\n- 위치: (현장/층/구역)\n- 환자/피해: (명수/상태)\n- 현재 조치: (조치 내용)\n- 요청: 구급/소방 지원\n`
                    : lang === "en"
                    ? `Emergency Report Template\n- Incident: ${name}\n- Risk: ${riskToLabel(lang, bRisk)}(${bRisk})\n- Location: (site/floor/zone)\n- People affected: (count/condition)\n- Actions taken: (so far)\n- Request: EMS/Fire support\n`
                    : `緊急通報テンプレート\n- 事案: ${name}\n- 危険度: ${riskToLabel(lang, bRisk)}(${bRisk})\n- 場所:（現場/階/区画）\n- 負傷者/被害:（人数/状態）\n- 実施した対応:（現在まで）\n- 要請: 救急/消防支援\n`;

                setBGuide({
                  key: k,
                  name,
                  immediate: kb?.immediate || [],
                  call: kb?.call || [],
                  report,
                });
                setBCopied(false);
              }}
            >
              {t.showGuide}
            </button>

            <button
              style={ui.btnO}
              onClick={async () => {
                const text = `유형:${bType}\n위험도:${riskToLabel(lang, bRisk)}(${bRisk})\n상황:${bText}`;
                try {
                  const j = await aiRespond(text);
                  setBAiOut(j.answer || "");
                } catch {
                  const j = offlineAI("respond", lang, text);
                  setBAiOut(j.answer || "");
                }
              }}
            >
              {t.aiBoost}
            </button>

            <button style={ui.btnG} onClick={saveIncident}>
              {t.saveIncident}
            </button>

            <button
              style={ui.btn}
              onClick={() => {
                const list = lsGet(LS.incidents, []);
                const top = list.slice(0, 8);
                if (top.length === 0) return alert(t.noIncidents);
                const msg = top
                  .map((x, i) => `${i + 1}) ${x.at}\n- ${x.type} / ${x.riskLabel}(${x.risk})\n- ${x.text}`)
                  .join("\n\n");
                alert(msg);
              }}
            >
              {t.recentIncidents}
            </button>
          </div>

          {bGuide && (
            <div style={{ marginTop: 14, padding: 14, borderRadius: 16, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(0,0,0,0.18)" }}>
              <div style={{ fontWeight: 1100, fontSize: 18 }}>{bGuide.name}</div>

              <div style={ui.hr} />

              <div style={{ fontWeight: 1000 }}>{t.guideTitle}</div>
              <ul style={{ margin: "8px 0 0", paddingLeft: 18, lineHeight: 1.7 }}>
                {bGuide.immediate.map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ul>

              <div style={ui.hr} />

              <div style={{ fontWeight: 1000 }}>{t.callTitle}</div>
              <ul style={{ margin: "8px 0 0", paddingLeft: 18, lineHeight: 1.7 }}>
                {bGuide.call.map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ul>

              <div style={ui.hr} />

              <div style={{ fontWeight: 1000 }}>{t.reportTitle}</div>
              <textarea style={{ ...ui.input, minHeight: 140, resize: "vertical", marginTop: 8 }} value={bGuide.report} readOnly />

              <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                <button
                  style={ui.btnP}
                  onClick={async () => {
                    const ok = await safeCopy(bGuide.report);
                    setBCopied(ok);
                    setTimeout(() => setBCopied(false), 1200);
                  }}
                >
                  {t.copy}
                </button>
                {bCopied && <div style={ui.badge(true)}>{t.copied}</div>}
                <button style={ui.btn} onClick={() => setBGuide(null)}>
                  ← {t.back}
                </button>
              </div>
            </div>
          )}

          {bAiOut && (
            <div style={{ marginTop: 14, padding: 14, borderRadius: 16, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(0,0,0,0.18)" }}>
              <div style={{ fontWeight: 1100, fontSize: 18 }}>AI Output</div>
              <textarea style={{ ...ui.input, minHeight: 180, resize: "vertical", marginTop: 10 }} value={bAiOut} readOnly />
            </div>
          )}
        </div>
      )}
      {screen === "C" && (
        <div style={ui.card}>
          <h2 style={{ marginTop: 0 }}>{t.cTitle}</h2>
          <div style={{ marginTop: 6, opacity: 0.92, lineHeight: 1.7 }}>{t.cDesc}</div>

          <div style={ui.hr} />

          {!adminUnlocked ? (
            <div style={{ padding: 14, borderRadius: 16, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(0,0,0,0.18)" }}>
              <div style={{ fontWeight: 1100, marginBottom: 10 }}>🔒 {t.adminPwAsk}</div>
              <button style={ui.btnP} onClick={unlockAdmin}>
                {t.adminEnter}
              </button>
            </div>
          ) : (
            <div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                <button style={ui.btn} onClick={lockAdmin}>
                  🔒 {t.adminLock}
                </button>
                <button style={ui.btnR} onClick={clearAll}>
                  {t.clearAll}
                </button>
              </div>

              <div style={ui.hr} />

              <div style={{ fontWeight: 1100, fontSize: 16, marginBottom: 8 }}>{t.incidentList}</div>

              {(() => {
                const list = lsGet(LS.incidents, []);
                if (!list || list.length === 0) {
                  return <div style={{ opacity: 0.85 }}>{t.noIncidents}</div>;
                }

                return (
                  <div style={{ display: "grid", gap: 10 }}>
                    {list.slice(0, 20).map((x, idx) => {
                      const selected = cSelected?.at === x.at && cSelected?.text === x.text;
                      return (
                        <div
                          key={idx}
                          style={{
                            padding: 12,
                            borderRadius: 14,
                            border: selected ? "1px solid rgba(59,130,246,0.65)" : "1px solid rgba(255,255,255,0.12)",
                            background: selected ? "rgba(59,130,246,0.12)" : "rgba(0,0,0,0.18)",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                            <div style={{ fontWeight: 1100 }}>
                              {x.type} · {x.riskLabel}({x.risk})
                            </div>
                            <div style={{ opacity: 0.85, fontSize: 12 }}>{x.at}</div>
                          </div>

                          <div style={{ marginTop: 8, opacity: 0.92, whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                            {x.text.length > 120 ? x.text.slice(0, 120) + "…" : x.text}
                          </div>

                          <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                            <button
                              style={ui.btn}
                              onClick={() => {
                                setCSelected(x);
                                setCAiOut("");
                              }}
                            >
                              {t.viewDetail}
                            </button>

                            <button
                              style={ui.btnO}
                              onClick={async () => {
                                setCSelected(x);
                                setCAiOut("...");
                                const pack = `관리자 사후 분석\n- 유형:${x.type}\n- 위험도:${x.riskLabel}(${x.risk})\n- 시간:${x.at}\n- 내용:${x.text}\n\n요청: 원인 가설 3개, 재발방지 대책 5개, 교육/퀴즈로 반영할 포인트 5개를 구조화해서 작성`;
                                const j = await aiAnalyze(pack);
                                setCAiOut(j.answer || "");
                              }}
                            >
                              {t.analyzeThis}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}

              {cSelected && (
                <div style={{ marginTop: 14, padding: 14, borderRadius: 16, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(0,0,0,0.18)" }}>
                  <div style={{ fontWeight: 1200, fontSize: 18 }}>DETAIL</div>
                  <div style={{ marginTop: 8, lineHeight: 1.8, opacity: 0.92 }}>
                    <div>• at: {cSelected.at}</div>
                    <div>• type: {cSelected.type}</div>
                    <div>
                      • risk: {cSelected.riskLabel}({cSelected.risk})
                    </div>
                    <div>• lang: {cSelected.lang?.toUpperCase?.() || ""}</div>
                  </div>

                  <div style={ui.hr} />

                  <div style={{ fontWeight: 1000, marginBottom: 6 }}>TEXT</div>
                  <textarea style={{ ...ui.input, minHeight: 120, resize: "vertical" }} value={cSelected.text} readOnly />

                  <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button
                      style={ui.btnO}
                      onClick={async () => {
                        setCAiOut("...");
                        const pack = `관리자 사후 분석\n- 유형:${cSelected.type}\n- 위험도:${cSelected.riskLabel}(${cSelected.risk})\n- 시간:${cSelected.at}\n- 내용:${cSelected.text}\n\n요청: 원인 가설 3개, 재발방지 대책 5개, 교육/퀴즈로 반영할 포인트 5개를 구조화해서 작성`;
                        const j = await aiAnalyze(pack);
                        setCAiOut(j.answer || "");
                      }}
                    >
                      {t.aiAnalyze}
                    </button>

                    <button
                      style={ui.btn}
                      onClick={() => {
                        setCSelected(null);
                        setCAiOut("");
                      }}
                    >
                      ← {t.back}
                    </button>
                  </div>
                </div>
              )}

              {cAiOut && (
                <div style={{ marginTop: 14, padding: 14, borderRadius: 16, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(0,0,0,0.18)" }}>
                  <div style={{ fontWeight: 1200, fontSize: 18 }}>AI Analysis Output</div>
                  <textarea style={{ ...ui.input, minHeight: 220, resize: "vertical", marginTop: 10 }} value={cAiOut} readOnly />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
