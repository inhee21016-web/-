import React, { useState } from 'react';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  Copy, 
  Check, 
  Info,
  Layers,
  FileText
} from 'lucide-react';
import { MatchData } from '../types';

interface DashboardViewProps {
  matchResult: MatchData | null;
  currentStep: 1 | 2 | 3 | 'analyzing' | 'completed';
  activeTab: 'dashboard' | 'html-code';
  setActiveTab: (tab: 'dashboard' | 'html-code') => void;
  fullHtmlCode: string;
  handleCopyCode: () => void;
  copied: boolean;
  handleDownloadFile: () => void;
  fillAllSampleAndRun: () => void;
}

export function DashboardView({
  matchResult,
  currentStep,
  activeTab,
  setActiveTab,
  fullHtmlCode,
  handleCopyCode,
  copied,
  handleDownloadFile,
  fillAllSampleAndRun
}: DashboardViewProps) {
  
  // Tab inner view if result is ready
  if (!matchResult) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-200/50 min-h-[640px] flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-20 h-20 bg-indigo-50/50 rounded-3xl flex items-center justify-center border border-indigo-100 text-indigo-600">
          <Briefcase className="w-10 h-10" />
        </div>
        
        <div className="max-w-md space-y-2 break-keep">
          <h3 className="text-lg font-black text-slate-800 font-sans">일자리 맞춤 추천 결과</h3>
          <p className="text-slate-400 text-xs leading-relaxed font-semibold">
            구인공고, 구직희망, 추가 건강특이조건 수집이 끝나면 어르신 맞춤형 추천 대시보드와 컴퓨터 보관용 웹 보고서 파일이 실시간으로 이곳에 만들어집니다.
          </p>
        </div>

        {/* Weights Explanation Guide */}
        <div className="w-full max-w-lg bg-slate-50 border border-slate-150 rounded-2xl p-5 text-left space-y-4 break-keep">
          <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-indigo-500" />
            일자리 점수 평가 기준 (총 100점 만점)
          </h4>
          
          <div className="space-y-3 text-xs text-slate-600 font-medium">
            <div className="flex justify-between items-center pb-2.5 border-b border-slate-200/40">
              <span className="font-bold text-slate-700">💼 과거 직무 경력 (최대 30점)</span>
              <span className="text-[11px] text-slate-400">하고 계셨던 과거 경력과의 유사성 평가</span>
            </div>
            <div className="flex justify-between items-center pb-2.5 border-b border-slate-200/40">
              <span className="font-bold text-rose-600">💪 일터 안전과 체력 (최대 25점)</span>
              <span className="text-[11px] text-slate-400">관절, 척추 부담을 덜어주는 신체 안전성 점검</span>
            </div>
            <div className="flex justify-between items-center pb-2.5 border-b border-slate-200/40">
              <span className="font-bold text-amber-600">🕒 근무 시간 조건 (최대 20점)</span>
              <span className="text-[11px] text-slate-400">선호하는 일하는 형태와 희망 조건 충족 여부</span>
            </div>
            <div className="flex justify-between items-center pb-2.5 border-b border-slate-200/40">
              <span className="font-bold text-blue-600">🎓 관련 자격 및 기능 (최대 15점)</span>
              <span className="text-[11px] text-slate-400">자격증 사항 및 스마트폰 다루는 능력</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-bold text-teal-600">🚗 출퇴근 편리함 (최대 10점)</span>
              <span className="text-[11px] text-slate-400">거주지에서 회사까지 통근 요건 분석</span>
            </div>
          </div>
        </div>

        <div className="pt-2 break-keep">
          <p className="text-[11px] text-slate-400 flex flex-wrap items-center justify-center gap-1">
            <span>💡 왼쪽 터미널 상단의</span>
            <button 
              onClick={fillAllSampleAndRun}
              className="font-extrabold underline text-indigo-600 hover:text-indigo-500"
            >
              [샘플 자동 일괄 분석]
            </button>
            <span>버튼을 누르면 정산된 실제 대시보드를 바로 참관하실 수 있습니다.</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Visual Workspace Tabs */}
      <div className="bg-white rounded-2xl p-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.01)] border border-slate-200/50 flex gap-2">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex-1 py-3 text-center rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'dashboard'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <LayoutIcon className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">1. 현장용 종합 매칭 대시보드</span>
          <span className="sm:hidden">1. 종합 대시보드</span>
        </button>
        <button
          onClick={() => setActiveTab('html-code')}
          className={`flex-1 py-3 text-center rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'html-code'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">2. 상담 보관용 HTML 보고서 코드</span>
          <span className="sm:hidden">2. HTML 보고서 코드</span>
        </button>
      </div>

      {/* DASHBOARD TAB CONTENT */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Top Panel: Seeker Details & Overall Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Seeker Info Card */}
            <section className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-200/50 flex flex-col justify-between break-keep">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">어르신 정보 요약</h2>
                  <span className="text-xs text-indigo-600 font-extrabold bg-indigo-50 px-2.5 py-1 rounded-full">상담 중 어르신</span>
                </div>

                <div className="space-y-3.5 text-xs font-medium text-slate-700">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 mb-1">어르신 성함 및 연세</span>
                    <p className="text-sm font-semibold text-slate-900">
                      {matchResult.seekerSummary.name && (matchResult.seekerSummary.name.includes("미기재") || matchResult.seekerSummary.name.includes("미상") || matchResult.seekerSummary.name.includes("어르신")) 
                        ? matchResult.seekerSummary.name 
                        : `${matchResult.seekerSummary.name} 어르신`}
                      {" "}
                      ({matchResult.seekerSummary.age && (matchResult.seekerSummary.age.includes("미기재") || matchResult.seekerSummary.age.includes("확인") || matchResult.seekerSummary.age.includes("세")) 
                        ? matchResult.seekerSummary.age 
                        : `${matchResult.seekerSummary.age}세`})
                    </p>
                  </div>

                  <div className="flex flex-col border-t border-slate-100 pt-3">
                    <span className="text-[10px] text-slate-400 mb-1">일해오신 주요 경력</span>
                    <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                      {matchResult.seekerSummary.experience}
                    </p>
                  </div>

                  <div className="flex flex-col border-t border-slate-100 pt-3">
                    <span className="text-[10px] text-slate-400 mb-1.5">취득 자격증</span>
                    <div className="flex flex-wrap gap-1">
                      {matchResult.seekerSummary.qualifications.map((qual, index) => (
                        <span key={index} className="bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-[10px] font-semibold text-slate-600">
                          {qual}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col border-t border-slate-100 pt-3">
                    <span className="text-[10px] text-slate-400 mb-1">희망 요일 및 시간 조건</span>
                    <p className="text-sm font-semibold text-slate-800">
                      {matchResult.seekerSummary.preferences}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Total Summary */}
            <section className="bg-indigo-50/50 rounded-3xl p-6 border border-indigo-100/50 flex flex-col justify-between break-keep">
              <div className="space-y-4">
                <h2 className="text-xs font-extrabold text-indigo-900 uppercase tracking-widest">어르신 일자리 추천 요약</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-2xl border border-indigo-100/40 shadow-sm text-center">
                    <span className="text-[10px] text-slate-400 font-bold block">검토한 모집 공고</span>
                    <span className="text-3xl font-black text-indigo-600 block mt-1">
                      {String(matchResult.generalSummary.analyzedCount).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-indigo-100/40 shadow-sm text-center">
                    <span className="text-[10px] text-slate-400 font-bold block">가장 알맞은 일터</span>
                    <span className="text-sm font-black text-indigo-600 mt-2 block underline underline-offset-4 truncate col-span-1">
                      {matchResult.generalSummary.topPick.split(' ')[0] || "1순위 선정"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 border-t border-indigo-100/80 pt-4 mt-4">
                <span className="text-[10px] text-indigo-800 font-bold block uppercase tracking-wide">일자리 추천 종합 조언</span>
                <p className="text-xs text-indigo-950 font-semibold leading-relaxed italic">
                  "{matchResult.generalSummary.summaryText}"
                </p>
              </div>
            </section>

          </div>

          {/* Table representing Priorty matches */}
          <div className="bg-white rounded-3xl border border-slate-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden flex flex-col min-h-0">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/40 break-keep">
              <div>
                <h3 className="font-bold text-slate-800">어르신 맞춤 일자리 추천 순위</h3>
                <p className="text-slate-400 text-[10px] mt-1">건강 조건, 과거 경력, 교통 편의 등을 고루 더해 100점 만점으로 계산한 추천순입니다.</p>
              </div>
              <span className="text-[10px] bg-slate-100 text-slate-600 font-bold border border-slate-200 px-3 py-1.5 rounded-full">
                실시간 추천순
              </span>
            </div>

            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-left border-collapse min-w-[640px] sm:min-w-full">
                <thead>
                  <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 bg-slate-50/20">
                    <th className="px-3 sm:px-6 py-3 text-center w-14 sm:w-20">순위</th>
                    <th className="px-3 sm:px-6 py-3">구인 사업체명 / 직무</th>
                    <th className="px-3 sm:px-6 py-3 w-32 sm:w-48">종합 적합도</th>
                    <th className="px-3 sm:px-6 py-3">사회복지사 협업 사유 요약</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {matchResult.matches.map((item) => {
                    const barColor = item.rank === 1 ? "bg-indigo-600" : item.rank === 2 ? "bg-indigo-500" : "bg-indigo-400";
                    return (
                      <tr key={item.rank} className="hover:bg-indigo-50/20 transition-colors">
                        <td className="px-3 sm:px-6 py-3 sm:py-4.5 text-center font-black text-indigo-600 font-mono text-xs sm:text-sm">
                          {String(item.rank).padStart(2, '0')}
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4.5">
                          <div className="text-xs sm:text-sm font-extrabold text-slate-800 break-keep">{item.companyName}</div>
                          <div className="text-[10px] sm:text-xs text-slate-400 font-semibold mt-0.5 break-keep">{item.jobTitle}</div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4.5">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-black text-slate-700">{item.suitabilityScore}점</span>
                            <div className="relative w-20 sm:w-28 bg-slate-100 h-2 rounded-full overflow-hidden shrink-0 hidden sm:block">
                              <div className={`h-full rounded-full ${barColor}`} style={{ width: `${item.suitabilityScore}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4.5 text-xs text-slate-600 leading-relaxed font-semibold max-w-xs md:max-w-md break-keep">
                          {item.keyReason}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Details Breakdown Cards */}
          <div className="space-y-6">
            <h3 className="font-extrabold text-slate-800 text-sm tracking-tight flex items-center gap-2 pt-2">
              <span>🔍 구인 사업체별 자세한 장단점 분석과 도움말</span>
              <span className="text-[10px] bg-slate-200 text-slate-600 font-bold font-mono py-0.5 px-2 rounded-full">
                {matchResult.matches.length}개 대상
              </span>
            </h3>

            {matchResult.matches.map((match) => (
              <div 
                key={match.rank}
                className="bg-white rounded-3xl border border-slate-200/40 p-6 space-y-6 hover:shadow-[0_12px_45px_rgba(0,0,0,0.03)] transition-all relative overflow-hidden"
              >
                {/* Ranking Tag on card */}
                <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none opacity-5 flex items-center justify-center">
                  <span className="text-[96px] font-black italic select-none text-indigo-950 font-mono leading-none">
                    {match.rank}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 relative z-10">
                  <div className="flex items-center gap-3.5">
                    <span className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-extrabold text-sm shadow-sm font-mono leading-none">
                      {match.rank}
                    </span>
                    <div>
                      <h4 className="font-black text-slate-800 text-base leading-tight break-keep">{match.companyName}</h4>
                      <p className="text-xs text-slate-400 font-bold mt-1 break-keep">{match.jobTitle}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-[9px] text-slate-400 block font-bold leading-none tracking-wider font-mono">FIT SCORE</span>
                    <span className="text-2xl font-black text-indigo-600 mt-1 block">
                      {match.suitabilityScore}<span className="text-xs text-indigo-400 font-bold ml-0.5">/100점</span>
                    </span>
                  </div>
                </div>

                {/* Score Breakdown Bars */}
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block mb-3.5">📋 세부 평가 점수 (총 100점 만점)</span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
                    
                    <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-150 text-center space-y-1">
                      <span className="text-[10px] text-slate-400 block font-bold">과거 경력</span>
                      <span className="text-xs font-black text-slate-800 block">{match.scoreBreakdown.experienceScore}/30</span>
                      <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                        <div className="h-full bg-slate-700 rounded-full" style={{ width: `${(match.scoreBreakdown.experienceScore / 30) * 100}%` }} />
                      </div>
                    </div>

                    <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-150 text-center space-y-1">
                      <span className="text-[10px] text-rose-500 block font-bold">건강 위험 예방</span>
                      <span className="text-xs font-black text-rose-950 block">{match.scoreBreakdown.physicalScore}/25</span>
                      <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                        <div className="h-full bg-rose-500 rounded-full" style={{ width: `${(match.scoreBreakdown.physicalScore / 25) * 100}%` }} />
                      </div>
                    </div>

                    <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-150 text-center space-y-1">
                      <span className="text-[10px] text-amber-500 block font-bold">일하는 시간</span>
                      <span className="text-xs font-black text-amber-950 block">{match.scoreBreakdown.conditionScore}/20</span>
                      <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(match.scoreBreakdown.conditionScore / 20) * 100}%` }} />
                      </div>
                    </div>

                    <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-150 text-center space-y-1">
                      <span className="text-[10px] text-blue-500 block font-bold">관련 자격증</span>
                      <span className="text-xs font-black text-blue-950 block">{match.scoreBreakdown.qualificationScore}/15</span>
                      <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(match.scoreBreakdown.qualificationScore / 15) * 100}%` }} />
                      </div>
                    </div>

                    <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-150 text-center col-span-2 sm:col-span-1 space-y-1">
                      <span className="text-[10px] text-teal-500 block font-bold">출퇴근 교통</span>
                      <span className="text-xs font-black text-teal-950 block">{match.scoreBreakdown.commuteScore}/10</span>
                      <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-500 rounded-full" style={{ width: `${(match.scoreBreakdown.commuteScore / 10) * 100}%` }} />
                      </div>
                    </div>

                  </div>
                </div>

                {/* Match Strengths vs Risks */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2 break-keep">
                  <div className="bg-emerald-50/50 border border-emerald-100/70 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center gap-2">
                       <span className="bg-emerald-500 text-white rounded px-2 py-0.5 text-[9px] font-bold">MATCH</span>
                      <h5 className="text-xs font-bold text-emerald-800">우수 연계 포인트 (Strengths)</h5>
                    </div>
                    <ul className="space-y-1.5 text-xs text-emerald-700 font-medium">
                      {match.strengths.map((str, i) => (
                        <li key={i} className="flex items-start">
                          <span className="mr-2 text-emerald-500">•</span>
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-rose-50/50 border border-rose-100/70 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="bg-rose-500 text-white rounded px-2 py-0.5 text-[9px] font-bold">GAP RISK</span>
                      <h5 className="text-xs font-bold text-rose-800">우려 상황 및 사전 조정점 (Risks)</h5>
                    </div>
                    <ul className="space-y-1.5 text-xs text-rose-700 font-medium">
                      {match.risks.map((risk, i) => (
                        <li key={i} className="flex items-start">
                          <span className="mr-2 text-rose-400">•</span>
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Social Worker Guidelines */}
                <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 space-y-3 break-keep">
                  <div className="space-y-1">
                    <span className="inline-block text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-xl">복지사 면담 지도 가이드라인</span>
                    <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                      {match.recommendPoint}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-200/60 text-[10px] text-slate-400 font-bold font-mono">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{match.workHours}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>{match.salary}</span>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* HTML EMBED CODE VIEW TAB */}
      {activeTab === 'html-code' && (
        <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-200/50 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm">💾 브라우저 단독 기동형 오프라인 HTML 소스</h3>
              <p className="text-slate-400 text-xs mt-1">다운로드하여 메모장에 저장한 후 더블클릭하면 오프라인에서 똑같이 작동합니다.</p>
            </div>
            
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <button
                onClick={handleCopyCode}
                className="flex-1 sm:flex-initial bg-indigo-50 hover:bg-indigo-150 text-indigo-700 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-indigo-200/40"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>복사 완료</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>클립보드 복사</span>
                  </>
                )}
              </button>
              
              <button
                onClick={handleDownloadFile}
                className="flex-1 sm:flex-initial bg-slate-900 hover:bg-slate-800 text-white px-4.5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                <span>파일 직접 다운로드</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-900 text-slate-350 rounded-2xl p-4.5 font-mono text-[10px] h-[480px] overflow-y-auto border border-slate-800 scrollbar-thin">
            <pre className="whitespace-pre">{fullHtmlCode}</pre>
          </div>
        </div>
      )}

    </div>
  );
}

// Small Icons for Tab buttons
function LayoutIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
    </svg>
  );
}
