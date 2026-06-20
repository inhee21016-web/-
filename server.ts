import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API route first
app.post("/api/match", async (req, res) => {
  try {
    const { jobAds, seekerInfo, additionalInfo, customApiKey } = req.body;

    if (!jobAds || !seekerInfo) {
      return res.status(400).json({ error: "구인 광고 정보와 구직자 정보가 모두 입력되지 않았습니다." });
    }

    const apiKey = customApiKey || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(400).json({ error: "Gemini API Key가 승인되지 않았습니다. 메인 화면에서 키를 인증해 주세요." });
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const systemInstruction = `너는 시니어 일자리 현장 매칭 경력 7년 차인 친절하고 노련한 사회복지사 '최강꼬부기'이다.
60세 이상 고령 구직자 어르신의 구직 경험, 자격증, 건강 및 희망 일자리 조건과 수집된 구인 광고를 세심하게 비교하여 어르신의 시선에 맞춘 100점 만점 일자리 추천 적합도를 산출하라.

[쉽고 친근한 용어 사용 원칙 (절대 필수)]
- '신체 손율회피률', '정밀 정산', '융합 점산 지표', '마모 한계' 같은 어렵고 딱딱한 학술용어나 인공지능 전문 용어는 절대로 사용하지 마라.
- 대신 일반 어르신들과 사회복지사들이 단번에 직관적으로 이해할 수 있는 일상 한글 단어를 사용해야 한다:
  * '신체강도 마모 위기선 점검' -> '어르신의 체력 및 건강 부담 한계 점검'
  * '신체 손율회피' -> '신체 부담 및 안전성' or '건강 부담 최소화'
  * '정밀 정산' -> '맞춤형 추천 점수 분석'
  * '출퇴 거정 / 거점' -> '출퇴근 거리 및 시간'
  * '직렬' -> '업무 분류 / 일의 종류'
- 7년 차 배테랑 복지사로서 어르신을 직접 따뜻하게 대하듯이 혹은 동료 복지사와 상의하듯이 고령 구직자의 신체 특성이나 강점을 이해하기 쉬운 문장으로 조곤조곤 다정하게 설명해라.

[추천 점수 계산 기준 (최대 100점)]
1. 일 경험 및 다녔던 전 직장 업무 유사성 (최대 30점): 어르신이 해오셨던 일과의 익숙함 정도
2. 몸에 무리 가지 않는 안전한 일터 강도 (최대 25점): 허리, 무릎, 디스크 등 건강 상태에 미치는 피로 정도 및 안전성 (오래 서 있는 일은 감점 등)
3. 원하는 근무 조건 만족도 (최대 20점): 낮/밤 교대 근무, 주말 근무, 일하는 시간대 등 선호 사항 일치 여부
4. 관련 자격증 및 디지털 기기 다루기 능율 (최대 15점): 자격 면허증, 스마트폰 앱이나 터치 스크린(키오스크, 정산기 등)을 다루는 데 어려움이 없는지 여부
5. 출퇴근하기 편한 교통편과 거리 (최대 10점): 집과 일터까지 걸리는 시간, 버스나 지하철 등 대중교통 이용 편의성 (만약 근무 상세 주소 정보가 없다면 마음 편히 다닐 수 있도록 7~9점 대를 편안하게 부여하고 이유 기재)

[주의 사항]
- 사용자가 입력하지 않은 성함(이름), 주요 경력, 나이, 자격증, 희망 근무 조건 등의 정보에 대해 절대로 "박** 어르신", "김** 어르신", "과거 청소 경력 5년" 등 임의의/가상의 가짜 이름이나 가짜 경력 정보를 지어내서 채워 넣지 말라. 
- 성함이 제공되지 않거나 입력에 이름이 없을 때에는 name 값을 "성함 미기재"로 적고, 나이 정보가 입력을 통해 제공되지 않았다면 age 값을 "연령 미기재"로 적고, 경력이나 자격증 등도 기재되지 않은 실질 데이터에 맞게 "경력 미기재" 또는 "자격증 없음" 등으로 솔직하고 투명하게 반영해야 한다. 절대 상상으로 빈 공간을 메우지 말라.
- 어르신의 실명(예: 홍길동 등)이 입력 데이터에 직접 제공되어 있을 때에만 '홍*동' 형태로 마스킹을 적용하라. 입력에 이름 자체가 아예 없을 때는 마스킹된 가상의 이름을 지어내지도 마라.
- 친절하고 눈에 쏙 들어오게 쉬운 한국어 경어체로 서술하라.`;

    const userPrompt = `## 1. 구인광고 데이터:
${jobAds}

## 2. 구직자 정보:
${seekerInfo}

## 3. 추가 고려사항 (건강, 선호 등):
${additionalInfo || "없음"}

위 정보를 바탕으로 각 구인광고별 정밀 매칭 분석 결과를 JSON 형식에 맞춰 보고해 주세요.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            seekerSummary: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: "의뢰인 이름 (마스킹 적용)" },
                age: { type: Type.STRING, description: "구직자 나이 (예: 68세)" },
                experience: { type: Type.STRING, description: "대표 경력 요약" },
                qualifications: { type: Type.ARRAY, items: { type: Type.STRING }, description: "보유 자격증" },
                preferences: { type: Type.STRING, description: "희망 취업 조건" }
              },
              required: ["name", "age", "experience", "qualifications", "preferences"]
            },
            generalSummary: {
              type: Type.OBJECT,
              properties: {
                analyzedCount: { type: Type.NUMBER, description: "분석된 광고 수" },
                topPick: { type: Type.STRING, description: "추천 1위 직무/채용 업체명" },
                summaryText: { type: Type.STRING, description: "사회복지사를 위한 전체 의견 요약" }
              },
              required: ["analyzedCount", "topPick", "summaryText"]
            },
            matches: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  rank: { type: Type.NUMBER, description: "순위 (1부터 차례로)" },
                  companyName: { type: Type.STRING, description: "구인 업체명" },
                  jobTitle: { type: Type.STRING, description: "직무명" },
                  suitabilityScore: { type: Type.NUMBER, description: "적합도 최종 점수 (100점 만점)" },
                  scoreBreakdown: {
                    type: Type.OBJECT,
                    properties: {
                      experienceScore: { type: Type.NUMBER, description: "경력연관성 (30)" },
                      physicalScore: { type: Type.NUMBER, description: "신체강도적합성 (25)" },
                      conditionScore: { type: Type.NUMBER, description: "근무조건적합성 (20)" },
                      qualificationScore: { type: Type.NUMBER, description: "자격증역량 (15)" },
                      commuteScore: { type: Type.NUMBER, description: "출퇴근편의성 (10)" }
                    },
                    required: ["experienceScore", "physicalScore", "conditionScore", "qualificationScore", "commuteScore"]
                  },
                  keyReason: { type: Type.STRING, description: "핵심 매칭 사유" },
                  recommendPoint: { type: Type.STRING, description: "추천 포인트 및 취업 성공을 위한 코칭 포인트" },
                  strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "강점 항목 (Match)" },
                  risks: { type: Type.ARRAY, items: { type: Type.STRING }, description: "우려요인 항목 (Risk·Gap)" },
                  workHours: { type: Type.STRING, description: "근무 시간" },
                  salary: { type: Type.STRING, description: "급여" }
                },
                required: [
                  "rank", "companyName", "jobTitle", "suitabilityScore", "scoreBreakdown",
                  "keyReason", "recommendPoint", "strengths", "risks", "workHours", "salary"
                ]
              }
            }
          },
          required: ["seekerSummary", "generalSummary", "matches"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Gemini 응답을 받지 못했습니다.");
    }

    res.json(JSON.parse(resultText));
  } catch (err: any) {
    console.error("Match API Error:", err);
    res.status(500).json({ error: err.message || "매칭 분석 중 서버 오류가 발생했습니다." });
  }
});

// API key validation route
app.post("/api/validate-key", async (req, res) => {
  try {
    const { apiKey } = req.body;
    if (!apiKey) {
      return res.json({ valid: false, error: "API 키가 입력되지 않았습니다." });
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    // Test request to ensure key is active
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Valid API Key request",
      config: {
        maxOutputTokens: 5
      }
    });

    if (response && response.text) {
      return res.json({ valid: true });
    } else {
      return res.json({ valid: false, error: "구글 어시스턴스 연결은 성공했으나, 응답 텍스트를 받지 못했습니다." });
    }
  } catch (error: any) {
    console.error("API Key Validation error:", error);
    let msg = "유효하지 않은 API 키이거나 권한이 없습니다.";
    if (error.message) {
      if (error.message.includes("API_KEY_INVALID")) {
        msg = "구글 API 키 형식이 올바르지 않습니다. (API_KEY_INVALID)";
      } else if (error.message.includes("API key not valid")) {
        msg = "유효하지 않은 API 키입니다. 승인된 키인지 다시 한 번 확인해주세요.";
      } else {
        msg = `유효성 검사 오류: ${error.message}`;
      }
    }
    return res.json({ valid: false, error: msg });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server started on http://0.0.0.0:${PORT}`);
  });
}

startServer();
