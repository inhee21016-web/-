import { MatchData } from "../types";

export function generateStandaloneHtml(data: MatchData): string {
  const seekerName = data.seekerSummary.name && (data.seekerSummary.name.includes("미기재") || data.seekerSummary.name.includes("미상") || data.seekerSummary.name.includes("어르신"))
    ? data.seekerSummary.name
    : `${data.seekerSummary.name} 어르신`;

  const seekerAge = data.seekerSummary.age && (data.seekerSummary.age.includes("미기재") || data.seekerSummary.age.includes("확인") || data.seekerSummary.age.includes("세"))
    ? data.seekerSummary.age
    : `${data.seekerSummary.age}세`;

  const matchesHtml = data.matches.map(m => `
    <!-- 세부 매칭 카드 ${m.rank}위 -->
    <div class="bg-white rounded-2xl border border-slate-100 p-6 space-y-6" style="box-shadow: 0 4px 20px -2px rgba(148, 163, 184, 0.12);">
      <div class="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div class="flex items-center gap-3">
          <span class="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-extrabold text-sm font-mono" style="font-family: 'Pretendard', sans-serif;">
            ${m.rank}
          </span>
          <div>
            <h4 class="font-bold text-slate-800 text-base" style="font-family: 'Pretendard', sans-serif;">${m.companyName}</h4>
            <p class="text-xs text-slate-400 font-medium" style="font-family: 'Pretendard', sans-serif;">${m.jobTitle}</p>
          </div>
        </div>
        
        <div class="text-right">
          <span class="text-[10px] text-slate-400 block font-bold leading-none" style="font-family: 'Pretendard', sans-serif;">SUITABILITY SCORE</span>
          <span class="text-2xl font-black text-blue-600 mt-1 block" style="font-family: 'Pretendard', sans-serif;">
            ${m.suitabilityScore}<span class="text-xs text-blue-400 font-bold ml-0.5">/100점</span>
          </span>
        </div>
      </div>

      <!-- 배점 테이블 세부 점수 바 -->
      <div>
        <span class="text-[10px] text-slate-400 font-bold block mb-3" style="font-family: 'Pretendard', sans-serif;">📋 평가 부문별 세부 점수 배점</span>
        <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
            <span class="text-[9px] text-slate-400 block font-bold" style="font-family: 'Pretendard', sans-serif;">경력 직무</span>
            <span class="text-xs font-bold text-slate-700 block mt-1" style="font-family: 'Pretendard', sans-serif;">${m.scoreBreakdown.experienceScore}/30</span>
            <div style="background-color: #E2E8F0; height: 4px; border-radius: 9999px; margin-top: 6px; overflow: hidden; width: 100%;">
              <div style="background-color: #334155; height: 100%; border-radius: 9999px; width: ${(m.scoreBreakdown.experienceScore / 30) * 100}%;"></div>
            </div>
          </div>

          <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
            <span class="text-[9px] text-emerald-600 block font-bold" style="font-family: 'Pretendard', sans-serif;">신체 적합</span>
            <span class="text-xs font-bold text-slate-700 block mt-1" style="font-family: 'Pretendard', sans-serif;">${m.scoreBreakdown.physicalScore}/25</span>
            <div style="background-color: #E2E8F0; height: 4px; border-radius: 9999px; margin-top: 6px; overflow: hidden; width: 100%;">
              <div style="background-color: #10B981; height: 100%; border-radius: 9999px; width: ${(m.scoreBreakdown.physicalScore / 25) * 100}%;"></div>
            </div>
          </div>

          <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
            <span class="text-[9px] text-amber-500 block font-bold" style="font-family: 'Pretendard', sans-serif;">근무 조건</span>
            <span class="text-xs font-bold text-slate-700 block mt-1" style="font-family: 'Pretendard', sans-serif;">${m.scoreBreakdown.conditionScore}/20</span>
            <div style="background-color: #E2E8F0; height: 4px; border-radius: 9999px; margin-top: 6px; overflow: hidden; width: 100%;">
              <div style="background-color: #F59E0B; height: 100%; border-radius: 9999px; width: ${(m.scoreBreakdown.conditionScore / 20) * 100}%;"></div>
            </div>
          </div>

          <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
            <span class="text-[9px] text-blue-500 block font-bold" style="font-family: 'Pretendard', sans-serif;">자격 역량</span>
            <span class="text-xs font-bold text-slate-700 block mt-1" style="font-family: 'Pretendard', sans-serif;">${m.scoreBreakdown.qualificationScore}/15</span>
            <div style="background-color: #E2E8F0; height: 4px; border-radius: 9999px; margin-top: 6px; overflow: hidden; width: 100%;">
              <div style="background-color: #3B82F6; height: 100%; border-radius: 9999px; width: ${(m.scoreBreakdown.qualificationScore / 15) * 100}%;"></div>
            </div>
          </div>

          <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
            <span class="text-[9px] text-teal-500 block font-bold" style="font-family: 'Pretendard', sans-serif;">출퇴 거정</span>
            <span class="text-xs font-bold text-slate-700 block mt-1" style="font-family: 'Pretendard', sans-serif;">${m.scoreBreakdown.commuteScore}/10</span>
            <div style="background-color: #E2E8F0; height: 4px; border-radius: 9999px; margin-top: 6px; overflow: hidden; width: 100%;">
              <div style="background-color: #14B8A6; height: 100%; border-radius: 9999px; width: ${(m.scoreBreakdown.commuteScore / 10) * 100}%;"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 강점 vs 우려요인 (Match / Risk-Gap) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
        <!-- 강점 카드 (Match) -->
        <div class="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
          <div class="flex items-center space-x-2 mb-3">
            <span class="bg-emerald-500 text-white px-1.5 py-0.5 rounded text-[10px] font-bold" style="font-family: 'Pretendard', sans-serif;">MATCH</span>
            <h4 class="text-sm font-bold text-emerald-800" style="font-family: 'Pretendard', sans-serif;">상세 분석: 강점 (Match)</h4>
          </div>
          <ul class="space-y-2">
            ${m.strengths.map(s => `
              <li class="text-xs text-emerald-700 flex items-start" style="font-family: 'Pretendard', sans-serif;">
                <span class="mr-2">•</span>
                <span>${s}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <!-- 우려요인 카드 (Risk / Gap) -->
        <div class="bg-rose-50 border border-rose-100 rounded-2xl p-5">
          <div class="flex items-center space-x-2 mb-3">
            <span class="bg-rose-500 text-white px-1.5 py-0.5 rounded text-[10px] font-bold" style="font-family: 'Pretendard', sans-serif;">GAP</span>
            <h4 class="text-sm font-bold text-rose-800" style="font-family: 'Pretendard', sans-serif;">상세 분석: 우려요인 (Risk)</h4>
          </div>
          <ul class="space-y-2">
            ${m.risks.map(r => `
              <li class="text-xs text-rose-700 flex items-start" style="font-family: 'Pretendard', sans-serif;">
                <span class="mr-2">•</span>
                <span>${r}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>

      <!-- 추천 가이드 및 기본 근무 내용 요점 요약 -->
      <div class="bg-slate-50 border border-slate-150 rounded-2xl p-5 space-y-4">
        <div>
          <span class="inline-block text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md mb-2" style="font-family: 'Pretendard', sans-serif;">사회복지사용 실무 코칭 지침</span>
          <p class="text-xs text-slate-600 leading-relaxed font-semibold" style="font-family: 'Pretendard', sans-serif;">
            ${m.recommendPoint}
          </p>
        </div>
        
        <div class="grid grid-cols-2 gap-4 pt-3 border-t border-slate-200 text-[10px] text-slate-500 font-semibold font-mono" style="font-family: 'Pretendard', sans-serif;">
          <div>🕒 <strong>근무 시간:</strong> ${m.workHours}</div>
          <div>💰 <strong>급여 형식:</strong> ${m.salary}</div>
        </div>
      </div>
    </div>
  `).join('\n');

  const tableRowsHtml = data.matches.map(m => {
    const barColor = m.rank === 1 ? "bg-blue-500" : m.rank === 2 ? "bg-emerald-500" : "bg-orange-400";
    return `
    <tr class="hover:bg-blue-50/50 transition-colors border-b border-slate-100">
      <td class="px-6 py-4 text-center font-bold text-blue-600" style="font-family: 'Pretendard', sans-serif;">${String(m.rank).padStart(2, '0')}</td>
      <td class="px-6 py-4">
        <div class="text-sm font-bold text-slate-800" style="font-family: 'Pretendard', sans-serif;">${m.companyName}</div>
        <div class="text-xs text-slate-500" style="font-family: 'Pretendard', sans-serif;">${m.jobTitle}</div>
      </td>
      <td class="px-6 py-4 w-40">
        <div class="flex items-center gap-3">
          <span class="text-sm font-bold text-slate-700" style="font-family: 'Pretendard', sans-serif;">${m.suitabilityScore}</span>
          <div style="background-color: #E2E8F0; height: 8px; border-radius: 9999px; flex-1; overflow: hidden; width: 80px; position: relative;">
            <div class="${barColor}" style="height: 100%; border-radius: 9999px; width: ${m.suitabilityScore}%;"></div>
          </div>
        </div>
      </td>
      <td class="px-6 py-4 text-xs text-slate-600 leading-relaxed max-w-sm" style="font-family: 'Pretendard', sans-serif;">${m.keyReason}</td>
    </tr>
  `}).join('\n');

  return `<!-- 이 코드를 메모장에 붙여넣은 후 'matching_result.html'로 저장하여 사용하세요 -->
<!DOCTYPE html>
<html lang="ko" style="height: 100%; margin: 0;">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[${seekerName}] 맞춤형 시니어 일자리 매칭 대시보드</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" rel="stylesheet">
  <style>
    body {
      font-family: 'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: #F8FAFC;
    }
  </style>
</head>
<body class="min-h-screen pb-16 text-slate-800">
  <div class="max-w-6xl mx-auto px-4 py-8">
    
    <!-- 헤더 영역 -->
    <header class="flex flex-wrap items-center justify-between gap-4 mb-8 bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl">
      <div class="flex items-center space-x-4">
        <div class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-extrabold text-xl text-white">S</div>
        <div>
          <span class="text-[10px] font-bold text-indigo-400 block tracking-widest uppercase font-mono">Senior Matching Report</span>
          <h1 class="text-xl md:text-2xl font-bold mt-1 tracking-tight">${seekerName} 맞춤형 일자리 매칭 결과</h1>
          <p class="text-slate-400 text-xs mt-1">시니어 특성(신체 조건, 경력 여부, 출퇴근 등)을 반영한 최적 직무 적합도 보고서</p>
        </div>
      </div>
      <div class="bg-slate-800 px-4 py-2.5 rounded-2xl text-center text-xs">
        <span class="text-slate-400 block mb-0.5">분석일시</span>
        <span class="font-mono font-bold text-slate-100">${new Date().toLocaleDateString('ko-KR')}</span>
      </div>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <!-- 좌측 칼럼: 구직자 어르신 요약 요약 카드 -->
      <div class="lg:col-span-1 space-y-6">
        <section class="bg-white rounded-3xl p-6" style="box-shadow: 0 4px 30px rgba(0, 0, 0, 0.03);">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-sm font-bold text-slate-500 uppercase tracking-wider">구직자 요약</h2>
            <span class="text-xs text-indigo-600 font-bold bg-indigo-50 px-2.5 py-1 rounded-full">구직중</span>
          </div>
          <div class="space-y-4 text-xs font-medium text-slate-700">
            <div class="flex flex-col">
              <span class="text-[10px] text-slate-400 mb-1">성명 및 연령</span>
              <p class="text-sm font-semibold text-slate-800">${seekerName} (${seekerAge})</p>
            </div>
            <div class="flex flex-col pt-3 border-t border-slate-100">
              <span class="text-[10px] text-slate-400 mb-1">핵심 경력</span>
              <p class="text-sm font-semibold text-slate-800 leading-relaxed">
                ${data.seekerSummary.experience}
              </p>
            </div>
            <div class="flex flex-col pt-3 border-t border-slate-100">
              <span class="text-[10px] text-slate-400 mb-1.5">보유 자격증</span>
              <div class="flex flex-wrap gap-1">
                ${data.seekerSummary.qualifications.length > 0
                  ? data.seekerSummary.qualifications.map(q => `<span class="bg-slate-100 px-2 py-1 rounded text-[10px] font-medium text-slate-700 border border-slate-200">${q}</span>`).join('')
                  : '<span class="text-slate-400">보유 자격 없음</span>'
                }
              </div>
            </div>
            <div class="flex flex-col pt-3 border-t border-slate-100">
              <span class="text-[10px] text-slate-400 mb-1">희망 근무 조건</span>
              <p class="text-sm font-medium text-slate-800 leading-relaxed">
                ${data.seekerSummary.preferences}
              </p>
            </div>
          </div>
        </section>

        <!-- 매칭 총괄 요약 -->
        <section class="bg-indigo-50/70 rounded-3xl p-6 border border-indigo-100/50 flex flex-col justify-between">
          <div>
            <h2 class="text-sm font-bold text-indigo-900 mb-3" style="font-family: 'Pretendard', sans-serif;">매칭 총괄 요약</h2>
            <div class="grid grid-cols-2 gap-4 text-center">
              <div class="bg-white p-4 rounded-2xl border border-indigo-100/30 shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
                <div class="text-3xl font-extrabold text-indigo-600">${String(data.generalSummary.analyzedCount).padStart(2, '0')}</div>
                <div class="text-[10px] text-slate-500 font-bold uppercase mt-1">분석 공고 수</div>
              </div>
              <div class="bg-white p-4 rounded-2xl border border-indigo-100/30 shadow-[0_4px_12px_rgba(0,0,0,0.02)] flex flex-col justify-center items-center">
                <div class="text-2xl font-extrabold text-indigo-600">#1</div>
                <div class="text-[10px] text-slate-500 font-bold uppercase mt-1">추천 TOP 순위</div>
              </div>
            </div>
          </div>
          <p class="mt-4 text-xs text-indigo-950 leading-relaxed italic border-t border-indigo-100/40 pt-4" style="font-family: 'Pretendard', sans-serif;">
            "${data.generalSummary.summaryText}"
          </p>
        </section>
      </div>

      <!-- 우측 칼럼: 우선순위 매칭 테이블 & 구인공고별 상세 분석 -->
      <div class="lg:col-span-2 space-y-8">
        
        <!-- 매칭 테이블 카드 -->
        <div class="bg-white rounded-3xl overflow-hidden flex flex-col min-h-0" style="box-shadow: 0 4px 30px rgba(0, 0, 0, 0.03);">
          <div class="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div>
              <h3 class="font-bold text-slate-800" style="font-family: 'Pretendard', sans-serif;">우선순위 매칭 테이블</h3>
              <p class="text-slate-400 text-[10px] mt-1">경력연계, 지리적 원활성, 신체 제어 능력이 융합된 복합 점수 순입니다.</p>
            </div>
            <div>
              <span class="text-[11px] bg-slate-100 px-3 py-1.5 rounded-full text-slate-600 font-bold border border-slate-200">AI 정밀 계산 엔진</span>
            </div>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead class="bg-slate-50/40">
                <tr class="text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">
                  <th class="px-6 py-3.5 text-center w-20">순위</th>
                  <th class="px-6 py-3.5">업체명 / 직무</th>
                  <th class="px-6 py-3.5">적합도 점수</th>
                  <th class="px-6 py-3.5">핵심 매칭 사유 / 추천 포인트</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-50">
                ${tableRowsHtml}
              </tbody>
            </table>
          </div>
        </div>

        <!-- 공고별 상세 분석 카드 헤더 -->
        <div class="space-y-6">
          <h3 class="font-bold text-slate-800 text-base tracking-tight flex items-center gap-2 pt-2" style="font-family: 'Pretendard', sans-serif;">
            <span>🔍 구인공고별 정밀 다각 분석 피드백</span>
          </h3>
          <div class="space-y-6">
            ${matchesHtml}
          </div>
        </div>

      </div>
    </div>

    <!-- 하단 라이선스 및 푸터 -->
    <footer class="text-center mt-16 pt-8 border-t border-slate-200 text-xs text-slate-400">
      <p>© 2026 시니어 일자리 매칭 대시보드 전문가 시스템. 사회복지사 전용 도구입니다.</p>
    </footer>
  </div>
</body>
</html>`;
}
