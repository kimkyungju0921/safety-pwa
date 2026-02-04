// server/index.cjs
const http = require("http");

const port = Number(process.env.PORT || 8788);

// Claude(Anthropic) 설정
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || "";
const CLAUDE_MODEL = process.env.CLAUDE_MODEL || "claude-sonnet-4-5"; // docs 예시 모델
const ANTHROPIC_VERSION = "2023-06-01";

function sendJson(res, status, obj) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(obj));
}

function sendText(res, status, text) {
  res.writeHead(status, {
    "Content-Type": "text/plain; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(text);
}

async function callClaude({ system, userText, maxTokens = 800 }) {
  if (!ANTHROPIC_API_KEY) {
    return { ok: false, error: "ANTHROPIC_API_KEY is not set" };
  }

  const payload = {
    model: CLAUDE_MODEL,
    max_tokens: maxTokens,
    system,
    messages: [{ role: "user", content: userText }],
  };

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": ANTHROPIC_VERSION,
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await r.json().catch(() => ({}));

    if (!r.ok) {
      return { ok: false, error: "Claude API error", status: r.status, data };
    }

    // content: [{type:"text", text:"..."}]
    const text =
      Array.isArray(data.content) && data.content[0] && data.content[0].text
        ? data.content.map((c) => c.text).join("\n")
        : "";

    return { ok: true, text, raw: data };
  } catch (e) {
    return { ok: false, error: "Claude fetch failed", detail: String(e) };
  }
}

function offlineRespond(text) {
  return `즉시 조치 체크리스트(오프라인 샘플):
- 위험구역 통제
- PPE 착용 확인
- 관리자/안전담당 호출
- 119/관할 신고 필요 여부 판단

입력: ${text}`;
}

function offlineAnalyze(text) {
  return `사후 분석(오프라인 샘플/관리자용):
- 원인 가설: 작업절차 미준수/환경요인/교육 미흡 가능
- 재발방지: 교육+퀴즈/점검/표준작업서 개선

입력: ${text}`;
}

function offlineRisk(text) {
  // 매우 단순 휴리스틱(폴백)
  const t = (text || "").toLowerCase();
  let score = 60;
  if (t.includes("출혈") || t.includes("의식") || t.includes("감전")) score = 95;
  else if (t.includes("화재") || t.includes("추락")) score = 85;
  else if (t.includes("끼임")) score = 75;

  const label = score >= 80 ? "HIGH" : score >= 50 ? "MID" : "LOW";
  return {
    risk_score: score,
    risk_label: label,
    rationale:
      "오프라인 규칙 기반(폴백)으로 추정한 위험도입니다. API가 연결되면 Claude 판단으로 대체됩니다.",
  };
}

http
  .createServer((req, res) => {
    // CORS preflight
    if (req.method === "OPTIONS") {
      res.writeHead(204, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      });
      return res.end();
    }

    // health
    if (req.url === "/health") {
      const provider = ANTHROPIC_API_KEY ? "claude" : "offline";
      return sendJson(res, 200, { ok: true, port, provider });
    }

    // main
    if (req.url === "/") {
      return sendText(res, 200, "API server is running. Try /health or POST /ai");
    }

    // ai
    if (req.url === "/ai" && req.method === "POST") {
      let body = "";
      req.on("data", (c) => (body += c));
      req.on("end", async () => {
        let input = {};
        try {
          input = JSON.parse(body || "{}");
        } catch {}

        const text = (input.text || "").trim();
        const mode = input.mode || "respond"; // respond | analyze | risk

        // 1) 위험도(risk) — JSON으로 주기
        if (mode === "risk") {
          const system =
            "너는 산업/현장 안전사고 입력을 보고 위험도를 산정하는 안전 담당 AI다. " +
            "출력은 반드시 JSON만 반환한다. 키는 risk_score(0~100 정수), risk_label(LOW|MID|HIGH), rationale(짧게)만 포함한다.";

          const userText =
            `사건 입력:\n${text}\n\n` +
            `위험도 JSON만 출력해. 예시:\n` +
            `{"risk_score":85,"risk_label":"HIGH","rationale":"..."}\n`;

          const r = await callClaude({ system, userText, maxTokens: 200 });

          if (r.ok) {
            // Claude가 JSON 외 텍스트 섞을 수 있어 안전하게 파싱
            const raw = r.text || "";
            const firstBrace = raw.indexOf("{");
            const lastBrace = raw.lastIndexOf("}");
            if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
              const jsonStr = raw.slice(firstBrace, lastBrace + 1);
              try {
                const obj = JSON.parse(jsonStr);
                return sendJson(res, 200, { ok: true, mode, provider: "claude", ...obj });
              } catch {
                // 파싱 실패 시 폴백
              }
            }
          }

          const fb = offlineRisk(text);
          return sendJson(res, 200, { ok: true, mode, provider: "offline", ...fb });
        }

        // 2) 즉시조치/사후분석 텍스트
        const system =
          "너는 한국의 산업현장 안전사고 대응을 돕는 생성형 AI다. " +
          "현장 즉시조치, 신고 기준, PPE, 2차사고 방지, 응급조치 관점에서 구체적으로 안내하라. " +
          "과도한 확신은 피하고, 필요한 경우 '안전담당/의료기관/119' 문의를 권한다.";

        const userText =
          mode === "analyze"
            ? `아래 사건을 '사후 분석(원인/재발방지/개선안)' 형식으로 정리해줘:\n\n${text}`
            : `아래 사건을 '즉시 조치 체크리스트'로 안내해줘:\n\n${text}`;

        const r = await callClaude({ system, userText, maxTokens: 900 });

        if (r.ok) {
          return sendJson(res, 200, {
            ok: true,
            mode,
            provider: "claude",
            answer: r.text,
          });
        }

        // Claude 실패/키 없음 → 오프라인 샘플
        const answer = mode === "analyze" ? offlineAnalyze(text) : offlineRespond(text);
        return sendJson(res, 200, { ok: true, mode, provider: "offline", answer });
      });
      return;
    }

    return sendText(res, 404, "Not Found");
  })
  .listen(port, () => {
    console.log("API server running on http://localhost:" + port);
    console.log("Provider:", ANTHROPIC_API_KEY ? "claude" : "offline");
  });
