import { useMemo, useState } from "react";

export default function App() {
  const [step, setStep] = useState("ppe"); // ppe | quiz | done | incident
  const [ppeOk, setPpeOk] = useState(null); // null | true | false
  const [quiz, setQuiz] = useState(() => makeQuiz());
  const [answers, setAnswers] = useState({});

  const score = useMemo(() => {
    if (!quiz?.length) return 0;
    let s = 0;
    for (const q of quiz) {
      if (answers[q.id] === q.correct) s += 1;
    }
    return s;
  }, [answers, quiz]);

  const pass = quiz.length > 0 && score >= Math.ceil(quiz.length * 0.7); // 70% 이상 통과

  function resetAll() {
    setStep("ppe");
    setPpeOk(null);
    setQuiz(makeQuiz());
    setAnswers({});
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <div style={styles.title}>SAFE-STEP</div>
          <div style={styles.subTitle}>1단계: 보호구 확인 → 안전 퀴즈</div>
        </div>
        <button style={styles.ghostBtn} onClick={resetAll}>
          처음부터
        </button>
      </header>

      {step === "ppe" && (
        <Card>
          <h2 style={styles.h2}>보호구 착용 여부 확인</h2>
          <p style={styles.p}>
            (프로토타입) 지금은 AI 대신 버튼으로 판정해요. 나중에 카메라/AI로
            연결합니다.
          </p>

          <div style={styles.row}>
            <button
              style={{ ...styles.btn, ...styles.good }}
              onClick={() => {
                setPpeOk(true);
                setStep("quiz");
              }}
            >
              ✅ 착용함(통과 → 퀴즈)
            </button>

            <button
              style={{ ...styles.btn, ...styles.bad }}
              onClick={() => setPpeOk(false)}
            >
              ❌ 미착용(통과 불가)
            </button>
          </div>

          {ppeOk === false && (
            <div style={styles.alert}>
              보호구 미착용입니다. 착용 후 다시 확인해주세요.
            </div>
          )}
        </Card>
      )}

      {step === "quiz" && (
        <Card>
          <h2 style={styles.h2}>안전 퀴즈 (총 {quiz.length}문제)</h2>
          <p style={styles.p}>70% 이상 맞추면 1단계 통과입니다.</p>

          <div style={{ display: "grid", gap: 12 }}>
            {quiz.map((q, idx) => (
              <div key={q.id} style={styles.qBox}>
                <div style={styles.qTitle}>
                  Q{idx + 1}. {q.question}
                </div>
                <div style={styles.options}>
                  {q.options.map((opt, i) => {
                    const selected = answers[q.id] === i;
                    return (
                      <button
                        key={i}
                        style={{
                          ...styles.optionBtn,
                          ...(selected ? styles.optionSelected : null),
                        }}
                        onClick={() =>
                          setAnswers((prev) => ({ ...prev, [q.id]: i }))
                        }
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div style={styles.footer}>
            <div>
              현재 점수: <b>{score}</b> / {quiz.length}{" "}
              {pass ? <span style={styles.pass}>통과 가능</span> : null}
            </div>
            <div style={styles.row}>
              <button
                style={{ ...styles.btn, ...styles.gray }}
                onClick={() => {
                  setQuiz(makeQuiz());
                  setAnswers({});
                }}
              >
                문제 다시 뽑기
              </button>
              <button
                style={{ ...styles.btn, ...styles.good }}
                disabled={!pass}
                onClick={() => setStep("done")}
              >
                1단계 통과
              </button>
            </div>
          </div>

          {!pass && (
            <div style={styles.hint}>
              * 아직 통과 점수가 아니에요. 답을 바꾸거나 문제를 다시 뽑아보세요.
            </div>
          )}
        </Card>
      )}

      {step === "done" && (
        <Card>
          <h2 style={styles.h2}>✅ 1단계 완료!</h2>
          <p style={styles.p}>
            다음 단계(사고 상황 입력 → 대응법/신고문 자동생성)로 넘어갈 수 있어요.
          </p>

          <div style={styles.row}>
            <button style={{ ...styles.btn, ...styles.gray }} onClick={resetAll}>
              다시 해보기
            </button>
            <button
              style={{ ...styles.btn, ...styles.good }}
              onClick={() => setStep("incident")}
            >
              2단계로 이동
            </button>
          </div>
        </Card>
      )}

      {step === "incident" && (
        <Card>
          <h2 style={styles.h2}>2단계: 사고 상황 입력</h2>
          <p style={styles.p}>
            (프로토타입) 단어 선택 + 한 줄 설명을 입력하면, AI가 상황을 분류하고
            대응 절차/신고문을 만들어줍니다.
          </p>

          <IncidentForm />
        </Card>
      )}

      <footer style={styles.bottomNote}>
        저장하면 브라우저 화면이 자동으로 바뀝니다.
      </footer>
    </div>
  );
}

function IncidentForm() {
  const [keywords, setKeywords] = useState([]);
  const [note, setNote] = useState("");
  const [result, setResult] = useState(null);

  const allKeywords = [
    "끼임",
    "추락",
    "화상",
    "출혈",
    "화학물질",
    "감전",
    "의식저하",
    "호흡곤란",
    "골절 의심",
    "눈/피부 자극",
  ];

  function toggle(k) {
    setKeywords((prev) =>
      prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]
    );
  }

  function analyze() {
    // (프로토타입) 규칙 기반으로 “AI처럼” 결과 생성
    const urgent =
      keywords.includes("의식저하") ||
      keywords.includes("호흡곤란") ||
      keywords.includes("감전") ||
      keywords.includes("추락");

    const label = makeLabel(keywords);
    const actions = makeActions(label);
    const report119 = makeReport119({ label, keywords, note });

    setResult({
      label,
      urgent,
      actions,
      report119,
    });
  }

  return (
    <div style={{ marginTop: 14 }}>
      <div style={styles.qBox}>
        <div style={{ fontWeight: 800, marginBottom: 8 }}>
          상황 키워드 선택(단어식)
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {allKeywords.map((k) => {
            const on = keywords.includes(k);
            return (
              <button
                key={k}
                style={{ ...styles.chip, ...(on ? styles.chipOn : null) }}
                onClick={() => toggle(k)}
              >
                {k}
              </button>
            );
          })}
        </div>

        <div style={{ marginTop: 12 }}>
          <div style={{ fontWeight: 800, marginBottom: 6 }}>
            한 줄 추가 설명(선택)
          </div>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="예: 작업 중 손가락이 장비에 끼였음"
            style={styles.input}
          />
        </div>

        <div style={styles.row}>
          <button
            style={{ ...styles.btn, ...styles.good }}
            onClick={analyze}
            disabled={keywords.length === 0}
          >
            AI 판단하기(프로토타입)
          </button>
        </div>

        {keywords.length === 0 && (
          <div style={styles.hint}>* 키워드를 하나 이상 선택해야 합니다.</div>
        )}
      </div>

      {result && (
        <div style={{ marginTop: 14, display: "grid", gap: 12 }}>
          <div style={styles.qBox}>
            <div style={{ fontWeight: 900, marginBottom: 6 }}>
              판단 결과: {result.label}
              {result.urgent ? (
                <span style={styles.urgent}> · 위급(신고 권고)</span>
              ) : (
                <span style={styles.notUrgent}> · 일반(절차 안내)</span>
              )}
            </div>
            <ol style={{ margin: 0, paddingLeft: 18, lineHeight: 1.5 }}>
              {result.actions.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ol>
          </div>

          <div style={styles.qBox}>
            <div style={{ fontWeight: 900, marginBottom: 6 }}>
              119 신고문(자동 생성)
            </div>
            <textarea readOnly value={result.report119} style={styles.textarea} />
            <div style={styles.row}>
              <button
                style={{ ...styles.btn, ...styles.gray }}
                onClick={() => {
                  navigator.clipboard.writeText(result.report119);
                  alert("신고문을 복사했어요!");
                }}
              >
                신고문 복사
              </button>
              <a
                href="tel:119"
                style={{ ...styles.btn, ...styles.good, textDecoration: "none" }}
              >
                119 전화걸기
              </a>
            </div>
            <div style={styles.hint}>
              * 실제 자동 접수는 어렵기 때문에 “문장 자동작성 + 복사 + 전화”로
              데모하면 좋아요.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function makeLabel(keywords) {
  if (keywords.includes("감전")) return "감전 사고 의심";
  if (keywords.includes("화학물질")) return "화학물질 노출";
  if (keywords.includes("화상")) return "화상";
  if (keywords.includes("출혈")) return "출혈/절단 의심";
  if (keywords.includes("끼임")) return "끼임 사고";
  if (keywords.includes("추락")) return "추락 사고";
  if (keywords.includes("호흡곤란")) return "호흡 곤란";
  if (keywords.includes("의식저하")) return "의식 저하";
  return "일반 사고/위험 상황";
}

function makeActions(label) {
  switch (label) {
    case "감전 사고 의심":
      return [
        "즉시 전원 차단",
        "환자와 접촉 전 절연 확보",
        "호흡/의식 확인",
        "119 신고 권고",
      ];
    case "화학물질 노출":
      return [
        "노출 부위 흐르는 물로 충분히 세척(가능한 오래)",
        "오염 의복 제거",
        "MSDS 확인",
        "필요시 119/의료기관",
      ];
    case "화상":
      return [
        "찬물로 냉각(얼음 직접 X)",
        "물집 터뜨리지 않기",
        "멸균 거즈로 덮기",
        "범위 크면 119/의료기관",
      ];
    case "출혈/절단 의심":
      return [
        "압박 지혈",
        "절단 부위 보존(젖은 거즈+비닐)",
        "쇼크 예방(보온)",
        "즉시 119 권고",
      ];
    case "끼임 사고":
      return [
        "장비 정지/전원 차단",
        "무리한 구조 금지(2차 사고 방지)",
        "출혈/골절 확인",
        "필요시 119",
      ];
    case "추락 사고":
      return [
        "움직이지 않게 하고 의식/호흡 확인",
        "경추 손상 가능성 고려",
        "즉시 119 권고",
        "현장 통제",
      ];
    default:
      return ["현장 안전 확보", "상태 확인", "관리자 보고", "필요시 의료기관/119"];
  }
}

function makeReport119({ label, keywords, note }) {
  const kw = keywords.join(", ");
  const extra = note?.trim() ? `추가 설명: ${note.trim()}. ` : "";
  return `안녕하세요. 작업장 사고 신고입니다. 상황: ${label}. 키워드: ${kw}. ${extra}환자 상태를 확인 중이며, 신속한 출동 요청드립니다. 위치: (현장/공정/주소를 입력). 연락처: (담당자).`;
}

function makeQuiz() {
  const base = [
    {
      id: "q1",
      question: "안전모(헬멧)는 어떤 상황에서 착용해야 하나요?",
      options: [
        "작업 중 항상",
        "더울 때만",
        "관리자가 볼 때만",
        "필요하다고 느낄 때만",
      ],
      correct: 0,
    },
    {
      id: "q2",
      question: "화학물질이 피부에 닿았을 때 가장 먼저 할 일은?",
      options: ["물로 충분히 세척", "그냥 닦기", "방치", "연고부터 바르기"],
      correct: 0,
    },
    {
      id: "q3",
      question: "끼임 사고 위험이 있는 장비 점검 시 올바른 행동은?",
      options: [
        "전원 차단/잠금 후 점검",
        "돌아가는 상태로 빠르게",
        "혼자 무리해서",
        "장갑만 끼면 OK",
      ],
      correct: 0,
    },
    {
      id: "q4",
      question: "작업장 내 미끄럼 위험을 줄이는 방법으로 맞는 것은?",
      options: ["바닥 정리/청소 유지", "물기 그대로", "통로에 자재 적재", "조명 줄이기"],
      correct: 0,
    },
    {
      id: "q5",
      question: "비상 상황에서 가장 먼저 해야 할 것은?",
      options: ["상황 파악 후 안전 확보/보고", "혼자 해결", "사진부터 찍기", "그냥 계속 작업"],
      correct: 0,
    },
  ];

  const shuffled = [...base].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 4);
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0b1220",
    color: "white",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
    padding: 16,
    boxSizing: "border-box",
    maxWidth: 720,
    margin: "0 auto",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 16,
  },
  title: { fontSize: 20, fontWeight: 800, letterSpacing: 0.5 },
  subTitle: { fontSize: 13, opacity: 0.85, marginTop: 4 },
  ghostBtn: {
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.25)",
    color: "white",
    padding: "8px 12px",
    borderRadius: 10,
    cursor: "pointer",
  },
  h2: { margin: 0, fontSize: 18 },
  p: { marginTop: 8, marginBottom: 0, opacity: 0.9, lineHeight: 1.4 },
  row: { display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 },
  btn: {
    border: "none",
    borderRadius: 12,
    padding: "12px 14px",
    cursor: "pointer",
    fontWeight: 700,
    color: "#06101f",
  },
  good: { background: "#7CFCB2" },
  bad: { background: "#FF8FA3" },
  gray: { background: "#D6DCE7" },
  alert: {
    marginTop: 14,
    padding: 12,
    borderRadius: 12,
    background: "rgba(255, 143, 163, 0.15)",
    border: "1px solid rgba(255, 143, 163, 0.35)",
    color: "#FFD3DA",
  },
  qBox: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 14,
    padding: 12,
  },
  qTitle: { fontWeight: 800, marginBottom: 10, lineHeight: 1.3 },
  options: { display: "grid", gap: 8 },
  optionBtn: {
    textAlign: "left",
    padding: 10,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.04)",
    color: "white",
    cursor: "pointer",
  },
  optionSelected: {
    border: "1px solid rgba(124,252,178,0.7)",
    background: "rgba(124,252,178,0.12)",
  },
  footer: {
    marginTop: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    flexWrap: "wrap",
  },
  pass: { marginLeft: 8, color: "#7CFCB2", fontWeight: 800 },
  hint: { marginTop: 10, opacity: 0.85, fontSize: 12 },
  bottomNote: { marginTop: 18, opacity: 0.65, fontSize: 12 },

  chip: {
    padding: "8px 10px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.04)",
    color: "white",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 13,
  },
  chipOn: {
    border: "1px solid rgba(124,252,178,0.7)",
    background: "rgba(124,252,178,0.12)",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.04)",
    color: "white",
    outline: "none",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    minHeight: 120,
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.04)",
    color: "white",
    outline: "none",
    boxSizing: "border-box",
    resize: "vertical",
  },
  urgent: { color: "#FF8FA3", fontWeight: 900 },
  notUrgent: { color: "#D6DCE7", fontWeight: 900 },
};

function Card({ children }) {
  return <section style={styles.card}>{children}</section>;
}

styles.card = {
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 18,
  padding: 16,
  boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
};
