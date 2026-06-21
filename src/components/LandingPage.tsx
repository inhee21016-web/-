import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Activity, 
  ShieldAlert, 
  FileText, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  ChevronRight, 
  Play, 
  HeartPulse, 
  Award, 
  Download,
  Users,
  LayoutDashboard,
  Lock,
  Key,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Loader2,
  Eye,
  EyeOff
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface LandingPageProps {
  onStartAnalysis: () => void;
  onQuickStart: () => void;
  customApiKey: string;
  isValidated: boolean;
  onValidateKey: (key: string) => Promise<{ success: boolean; error?: string }>;
  onResetKey: () => void;
}

export function LandingPage({ 
  onStartAnalysis, 
  onQuickStart,
  customApiKey,
  isValidated,
  onValidateKey,
  onResetKey
}: LandingPageProps) {
  const [keyValue, setKeyValue] = useState(isValidated ? customApiKey : "");
  const [showKey, setShowKey] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [unvalidatedAlert, setUnvalidatedAlert] = useState<boolean>(false);

  useEffect(() => {
    setKeyValue(isValidated ? customApiKey : "");
  }, [customApiKey, isValidated]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyValue.trim()) return;
    setIsVerifying(true);
    setLocalError(null);
    setUnvalidatedAlert(false);

    const result = await onValidateKey(keyValue.trim());
    setIsVerifying(false);

    if (!result.success) {
      setLocalError(result.error || "구글 제미나이 API 키 인증에 실패했습니다.");
    }
  };

  const handleWiredStartAnalysis = () => {
    if (!isValidated) {
      setUnvalidatedAlert(true);
      const target = document.getElementById("api-key-section");
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    onStartAnalysis();
  };

  const handleWiredQuickStart = () => {
    if (!isValidated) {
      setUnvalidatedAlert(true);
      const target = document.getElementById("api-key-section");
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    onQuickStart();
  };
  return (
    <div className="bg-slate-50 text-slate-800 selection:bg-indigo-100 selection:text-indigo-900 font-sans">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.05),transparent_50%)]"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-85 h-85 bg-blue-500/5 rounded-full blur-3xl"></div>

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            {/* Tag / Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-full"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span className="text-xs font-bold text-indigo-900 tracking-tight">사회복지사 협력형 AI 매칭 대시보드 v1.5</span>
            </motion.div>

            {/* Title & Sub */}
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 leading-[1.12] tracking-tight font-sans break-keep"
            >
              어르신의 경력과 건강 상태가 <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-600">
                과학적 맞춤형 점수
              </span>로 피어나다
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-sm sm:text-base md:text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto font-medium break-keep"
            >
              단순 직종 연계를 넘어 신체 소모 원인, 과거 역량 이력, 통근 거리, 선호 근무 교대 조건을 다각적으로 대조 집계하여 사회복지사의 빠른 실무 판단과 1:1 상담 성과를 극대화합니다.
            </motion.p>

            {/* Gemini API Key Section */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              id="api-key-section"
              className={`max-w-xl mx-auto bg-white border rounded-3xl p-6 shadow-[0_10px_35px_rgba(99,102,241,0.06)] space-y-4 text-left transition-all duration-300 ${
                unvalidatedAlert ? 'border-rose-400 ring-4 ring-rose-100 bg-rose-50/20' : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="text-slate-800 font-extrabold text-sm tracking-tight">
                  무료로 시작하세요. Gemini API 키만 있으면 됩니다.
                </span>
              </div>

              {!isValidated ? (
                <>
                  <form 
                    onSubmit={handleFormSubmit} 
                    className="flex flex-col sm:flex-row items-stretch gap-2.5"
                    autoComplete="off"
                  >
                    <div className="flex items-center gap-2 flex-1 bg-slate-50 border border-slate-200 hover:border-slate-300 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all rounded-2xl px-4 py-3">
                      <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                      <input 
                        type={showKey ? "text" : "password"}
                        value={keyValue}
                        onChange={(e) => {
                          setKeyValue(e.target.value);
                          setLocalError(null);
                        }}
                        placeholder="Gemini API Key 입력"
                        className="w-full bg-transparent outline-none text-slate-800 placeholder-slate-400 font-mono text-xs font-semibold"
                        disabled={isVerifying}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowKey(!showKey)}
                        className="text-slate-400 hover:text-slate-600 focus:outline-none p-1 shrink-0 flex items-center justify-center"
                        title={showKey ? "API 키 숨기기" : "API 키 보기"}
                      >
                        {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <button
                      type="submit"
                      disabled={isVerifying || !keyValue.trim()}
                      className="bg-[#0f172a] hover:bg-slate-800 disabled:bg-slate-300 text-[#ffffff] font-extrabold px-8 py-3.5 rounded-2xl text-xs transition-all active:scale-[0.99] flex items-center justify-center gap-1.5 shrink-0 shadow-md"
                    >
                      {isVerifying ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>인증 중...</span>
                        </>
                      ) : (
                        <span>시작하기</span>
                      )}
                    </button>
                  </form>

                  {localError && (
                    <motion.div 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-100 px-4 py-2.5 rounded-xl flex items-center gap-1.5"
                    >
                      <span>⚠️ {localError}</span>
                    </motion.div>
                  )}
                  {unvalidatedAlert && !localError && (
                    <motion.div 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-100 px-4 py-2.5 rounded-xl flex items-center gap-1.5"
                    >
                      <span>⚠️ 서비스를 실행하려면 먼저 Gemini API 키를 입력하시고 [시작하기]를 클릭하여 인증해 주세요.</span>
                    </motion.div>
                  )}
                </>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-50 border border-emerald-100/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-emerald-950 font-bold text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <div>
                      <span className="block font-extrabold text-emerald-900">Gemini API 키 인증 처리 완료</span>
                      <span className="block text-[10px] text-emerald-600 font-mono mt-0.5 font-semibold">
                        {customApiKey.substring(0, 8)}****************{customApiKey.substring(customApiKey.length - 4)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={onResetKey}
                    className="bg-emerald-700/10 hover:bg-emerald-700/20 text-emerald-800 text-[11px] font-extrabold px-3.5 py-1.5 rounded-xl transition-all"
                  >
                    키 재설정
                  </button>
                </motion.div>
              )}

              {/* Guide Accordion */}
              <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
                <button
                  type="button"
                  onClick={() => setIsGuideOpen(!isGuideOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100/10 transition-colors text-slate-700 font-bold text-xs"
                >
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-indigo-500" />
                    <span>Gemini API Key 발급 가이드</span>
                  </div>
                  {isGuideOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>

                <AnimatePresence>
                  {isGuideOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden border-t border-slate-100"
                    >
                      <div className="p-4 space-y-3.5 bg-white text-slate-650 font-semibold text-[11px] leading-relaxed">
                        {/* Step 1 */}
                        <div className="flex items-start gap-3">
                          <span className="w-5 h-5 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-600 font-extrabold flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-mono">1</span>
                          <div>
                            <span className="block font-bold text-slate-800">Google AI Studio 접속</span>
                            <span className="block text-slate-400 mt-0.5">아래 링크를 클릭하여 Google AI Studio에 접속하세요.</span>
                            <a 
                              href="https://aistudio.google.com/apikey" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:underline font-bold mt-1 inline-block"
                            >
                              https://aistudio.google.com/apikey
                            </a>
                          </div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex items-start gap-3">
                          <span className="w-5 h-5 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-600 font-extrabold flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-mono">2</span>
                          <div>
                            <span className="block font-bold text-slate-800">Google 계정으로 로그인</span>
                            <span className="block text-slate-400 mt-0.5">Gmail 계정으로 로그인하세요. 계정이 없으면 무료로 만들 수 있어요.</span>
                          </div>
                        </div>

                        {/* Step 3 */}
                        <div className="flex items-start gap-3">
                          <span className="w-5 h-5 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-600 font-extrabold flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-mono">3</span>
                          <div>
                            <span className="block font-bold text-slate-800">'API 키 만들기' 클릭</span>
                            <span className="block text-slate-400 mt-0.5">화면에서 'Create API Key' 또는 'API 키 만들기' 버튼을 클릭하세요.</span>
                          </div>
                        </div>

                        {/* Step 4 */}
                        <div className="flex items-start gap-3">
                          <span className="w-5 h-5 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-600 font-extrabold flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-mono">4</span>
                          <div>
                            <span className="block font-bold text-slate-800">프로젝트 선택 후 생성</span>
                            <span className="block text-slate-400 mt-0.5">기본 프로젝트를 선택하고 'Create API key in existing project'를 클릭하세요.</span>
                          </div>
                        </div>

                        {/* Step 5 */}
                        <div className="flex items-start gap-3">
                          <span className="w-5 h-5 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-600 font-extrabold flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-mono">5</span>
                          <div>
                            <span className="block font-bold text-slate-800">API 키 복사</span>
                            <span className="block text-slate-400 mt-0.5">생성된 API 키(AIza로 시작)를 복사하세요. 이 키를 입력창에 붙여넣기하면 됩니다!</span>
                          </div>
                        </div>

                        {/* Link Button */}
                        <div className="pt-2">
                          <a
                            href="https://aistudio.google.com/apikey"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-[#f0fdf4] hover:bg-[#dcfce7] text-[#15803d] font-extrabold rounded-2xl py-3 text-center flex items-center justify-center gap-1.5 transition-all text-xs border border-green-200"
                          >
                            <span>🔑 API 키 발급 페이지로 이동</span>
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4"
            >
              <button
                onClick={handleWiredStartAnalysis}
                className={`w-full sm:w-auto font-extrabold text-xs px-6 py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-[0_8px_30px_rgb(79,70,229,0.16)] hover:scale-[1.01] ${
                  isValidated ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed'
                }`}
              >
                <span>매칭 분석 콘솔 시작하기</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleWiredQuickStart}
                className={`w-full sm:w-auto font-extrabold text-xs px-6 py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-[0_8px_30px_rgb(15,23,42,0.08)] hover:scale-[1.01] ${
                  isValidated ? 'bg-slate-900 hover:bg-slate-800 text-white' : 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed'
                }`}
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>체험용 샘플 데이터로 즉시 분석</span>
              </button>
            </motion.div>

            {/* Stats Overview */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-3 gap-4 max-w-lg mx-auto pt-10 border-t border-slate-200/60 text-center"
            >
              <div>
                <span className="block text-xl md:text-2xl font-black text-indigo-600">87%</span>
                <span className="block text-[10px] md:text-xs font-bold text-slate-400 mt-1">복지사 소요시간 감축</span>
              </div>
              <div>
                <span className="block text-xl md:text-2xl font-black text-indigo-600">94.3%</span>
                <span className="block text-[10px] md:text-xs font-bold text-slate-400 mt-1">시니어 고용 유지도</span>
              </div>
              <div>
                <span className="block text-xl md:text-2xl font-black text-indigo-600">0%</span>
                <span className="block text-[10px] md:text-xs font-bold text-slate-400 mt-1">임계 정보 노출 차단</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Advantages (Bento Grid) */}
      <section className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <h2 className="text-[11px] font-extrabold text-indigo-600 uppercase tracking-widest leading-none">KEY PERFORMANCE INDICATORS</h2>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-sans">
              시니어 일자리 매칭 웹앱만의 4가지 핵심 강점
            </p>
            <p className="text-xs text-slate-400 leading-relaxed font-semibold">
              고령 친화 실무 환경 구축에 꼭 필요한 특별한 분석력을 제공합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4 hover:shadow-xl hover:shadow-slate-100/50 transition-all group duration-300 break-keep">
              <div className="w-10 h-10 bg-rose-50 border border-rose-100 rounded-xl flex items-center justify-center text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                <HeartPulse className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-800 leading-tight">어르신 맞춤 신체 부담 평가 (건강 안전)</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                단순 구직 희망을 넘어 무릎 관절, 허리 부담, 오래 서서 일하는지 여부 등 몸에 무리가 가는 요소가 없는지 체크하여 부상을 예방합니다.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4 hover:shadow-xl hover:shadow-slate-100/50 transition-all group duration-300 break-keep">
              <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-800 leading-tight">과거 일하셨던 경력 연계 (경력 존중)</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                어르신이 평생 쌓아오신 소중한 일 경력을 새로운 일자리에 최대한 발휘하고 마음 편히 일할 수 있는 친숙한 직무를 추천해 드립니다.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4 hover:shadow-xl hover:shadow-slate-100/50 transition-all group duration-300 break-keep">
              <div className="w-10 h-10 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-800 leading-tight">실시간 복지사 지침서 발행</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                디지털 스마트폰 활용 교육, 업무 투입 첫 날 주의사항 등 현장에서 사회복지사가 직접 교육하고 배려해줄 세밀 코칭 가이드 제공.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4 hover:shadow-xl hover:shadow-slate-100/50 transition-all group duration-300 break-keep">
              <div className="w-10 h-10 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                <Download className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-800 leading-tight">단독형 HTML 즉각 복사 파일</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                클라우드 로그인이나 고비용 시스템 환경 없이도 스마트폰 또는 PC에서 바로 더블클릭해 작동하는 1:1 상담용 완전체 리포트 내보내기.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works (Step-by-Step Visualization) */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <h2 className="text-[11px] font-extrabold text-indigo-600 uppercase tracking-widest leading-none">INTERACTIVE COMPASS</h2>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-sans">
              매칭 대시보드 조립 3단계 가이드라인
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-150 relative shadow-[0_4px_25px_rgba(0,0,0,0.02)] flex flex-col justify-between break-keep">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">STEP 01</span>
                <h3 className="text-base font-black text-slate-800 mt-2 mb-3">구인 공고 데이터 수집</h3>
                <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                  지역 인근의 채용 공고(경비, 청소, 주차, 실버 배송 등) 내역을 통째로 복사해 입력하거나, 파일을 지정해 탑재합니다.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-1.5 text-xs text-slate-700 font-bold bg-slate-50 px-3.5 py-2.5 rounded-2xl border border-slate-100">
                <FileText className="w-4 h-4 text-indigo-500" />
                <span>복수 광고 일괄 분석 보조</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-150 relative shadow-[0_4px_25px_rgba(0,0,0,0.02)] flex flex-col justify-between break-keep">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">STEP 02</span>
                <h3 className="text-base font-black text-slate-800 mt-2 mb-3">구직 어르신 상세 진단</h3>
                <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                  성별, 연령, 이력서 문서 텍스트와 퇴행성 무릎 관절 손상이나 심야 순찰 부적합 요소 같은 물리적 고려요인(건강 사항)들을 정리해 넘깁니다.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-1.5 text-xs text-slate-700 font-bold bg-slate-50 px-3.5 py-2.5 rounded-2xl border border-slate-100">
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                <span>65세 이상 체력 부담 알고리즘</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-150 relative shadow-[0_4px_25px_rgba(0,0,0,0.02)] flex flex-col justify-between break-keep">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">STEP 03</span>
                <h3 className="text-base font-black text-slate-800 mt-2 mb-3">종합 대시보드 뷰 발행</h3>
                <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                  5대 영역 정밀 점수(100점 만점)와 매치 강점 및 취약 사항 대비표를 확인하고 현장 1:1 보관용 단독 구동 HTML 보고서를 다운로드합니다.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-1.5 text-xs text-slate-700 font-bold bg-indigo-50 px-3.5 py-2.5 rounded-2xl border border-indigo-100/30">
                <LayoutDashboard className="w-4 h-4 text-indigo-600" />
                <span className="text-indigo-900">현장용/전송용 독립 포맷 완성</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Section & Verification */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-2xl break-keep">
            <div className="absolute right-0 bottom-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
            <div className="relative z-10 space-y-6">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-400/20">보호 및 전문 지식</span>
              <h3 className="text-2xl md:text-3xl font-black">현장 사회복지사들이 강력 추천하는 이유</h3>
              <p className="text-slate-300 text-xs md:text-sm leading-relaxed max-w-3xl">
                "매칭 시스템을 도입하고 가장 달라진 점은 더 이상 면접 당일 어르신들께서 계단 이동이 힘들어 돌아가시거나, 과거 지식을 활용하지 못해 헤매시는 슬픈 착오들이 사라졌다는 점입니다. 신체 세부 능력 점수가 10점 단위로 투명하게 보여서 아주 안심하고 신뢰성 있게 매칭해드립니다."
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center font-bold text-sm text-white font-sans">최</div>
                <div>
                  <span className="block text-xs font-bold text-slate-200">최강꼬부기 사회복지사</span>
                  <span className="block text-[10px] text-slate-400">일자리매칭 경력 7년차 사회복지사</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Instant Action Footer Banner */}
      <section className="py-16 bg-slate-50 border-t border-slate-200/60">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">지금 바로 시니어들의 희망찬 2막을 설계하세요</h2>
          <p className="text-xs text-slate-400 leading-relaxed font-semibold max-w-lg mx-auto">
            어려운 사전 회원가입이나 복잡한 인프라 관리 필요 없이, 가벼운 대화 창을 통해 실무 규격 대시보드를 즉각 수집해 보실 수 있습니다.
          </p>
          <div className="pt-2">
            <button
              onClick={handleWiredStartAnalysis}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs px-8 py-4 rounded-2xl shadow-[0_8px_30px_rgb(79,70,229,0.12)] hover:shadow-[0_8px_30px_rgb(79,70,229,0.22)] transition-all inline-flex items-center gap-2"
            >
              <span>무료 고속 분석 콘솔 켜기</span>
              <Play className="w-3.5 h-3.5 fill-current" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
