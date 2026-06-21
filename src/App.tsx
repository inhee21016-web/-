import React, { useState, useRef, useEffect } from 'react';
import { 
  Briefcase, 
  Clock, 
  RefreshCw, 
  Sparkles,
  LayoutDashboard,
  Home
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Import custom types
import { MatchData, ChatMessage } from './types';

// Import sample data
import { 
  SAMPLE_JOB_ADS, 
  SAMPLE_SEEKER_INFO, 
  SAMPLE_ADDITIONAL_INFO 
} from './data/samples';

// Import helpers
import { generateStandaloneHtml } from './utils/htmlGenerator';

// Import components
import { LandingPage } from './components/LandingPage';
import { MatchingConsole } from './components/MatchingConsole';
import { DashboardView } from './components/DashboardView';

export default function App() {
  const [screenMode, setScreenMode] = useState<'landing' | 'workspace'>('landing');
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 'analyzing' | 'completed'>(1);
  
  // Custom API key validation states
  const [isValidated, setIsValidated] = useState<boolean>(() => {
    return !!sessionStorage.getItem("GEMINI_API_KEY_VALID_SESSION");
  });
  const [customApiKey, setCustomApiKey] = useState<string>(() => {
    const validated = !!sessionStorage.getItem("GEMINI_API_KEY_VALID_SESSION");
    return validated ? (localStorage.getItem("GEMINI_API_KEY_CUSTOM") || "") : "";
  });

  const handleValidateKey = async (key: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const resp = await fetch("/api/validate-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: key })
      });

      // Safely handle non-JSON / HTML responses (e.g. server starting/failed pages)
      const contentType = resp.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await resp.text();
        console.error("Non-JSON Server Response:", text);
        return { 
          success: false, 
          error: "서버가 아직 준비 중이거나 일시적인 연결 지연이 발생했습니다. 3초 정도 대기 후 다시 [시작하기]를 눌러보세요." 
        };
      }

      const data = await resp.json();
      if (data.valid) {
        const keyToUse = data.cleanedKey || key;
        setCustomApiKey(keyToUse);
        setIsValidated(true);
        localStorage.setItem("GEMINI_API_KEY_CUSTOM", keyToUse);
        sessionStorage.setItem("GEMINI_API_KEY_VALID_SESSION", "true");
        return { success: true };
      } else {
        return { success: false, error: data.error || "올바르지 않은 API 키입니다." };
      }
    } catch (err: any) {
      return { success: false, error: err.message || "서버 혹은 네트워크 연결에 실패했습니다." };
    }
  };

  const handleResetKey = () => {
    setCustomApiKey("");
    setIsValidated(false);
    localStorage.removeItem("GEMINI_API_KEY_CUSTOM");
    sessionStorage.removeItem("GEMINI_API_KEY_VALID_SESSION");
  };
  const [inputText, setInputText] = useState<string>('');
  
  // Accumulated inputs
  const [jobAdsInput, setJobAdsInput] = useState<string>('');
  const [seekerInfoInput, setSeekerInfoInput] = useState<string>('');
  const [additionalInfoInput, setAdditionalInfoInput] = useState<string>('');
  
  // Real analysis result from server
  const [matchResult, setMatchResult] = useState<MatchData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Chat console messages
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "안녕하세요! 시니어 맞춤 일자리 찾기 도우미입니다. 😊\n총 3단계 정보를 하나씩 입력해 주시면, 어르신의 몸에 무리가 가지 않는 출퇴근 조건과 과거 경력을 모두 연계한 '가장 귀한 맞춤 일자리'를 찾아 대시보드로 정성껏 보여 드립니다.\n\n**[1/3] 먼저 비교해 보고 싶으신 구인 광고 내용(텍스트)을 자유롭게 적어주시거나, 채용 공고 문서를 마우스로 끌어서 올려주세요.**",
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      step: 1
    }
  ]);
  
  // Drag and drop state
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  
  // Tab state for dashboard
  const [activeTab, setActiveTab] = useState<'dashboard' | 'html-code'>('dashboard');
  const [copied, setCopied] = useState<boolean>(false);
  
  // Current Live Clock
  const [liveTime, setLiveTime] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setLiveTime(now.toLocaleString('ko-KR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        weekday: 'short',
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat window
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Handle standard template autofills
  const fillSampleDataForStep = (step: number) => {
    switch(step) {
      case 1:
        setInputText(SAMPLE_JOB_ADS);
        setUploadedFileName("추천_구인공고_리스트.txt");
        break;
      case 2:
        setInputText(SAMPLE_SEEKER_INFO);
        setUploadedFileName("구직자_김복수_지원신청서.doc");
        break;
      case 3:
        setInputText(SAMPLE_ADDITIONAL_INFO);
        setUploadedFileName(null);
        break;
    }
  };

  // Direct quick model fill all and trigger immediately
  const fillAllSampleAndRun = () => {
    setScreenMode('workspace');
    setJobAdsInput(SAMPLE_JOB_ADS);
    setSeekerInfoInput(SAMPLE_SEEKER_INFO);
    setAdditionalInfoInput(SAMPLE_ADDITIONAL_INFO);
    
    const timeStr = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    
    const newMessages: ChatMessage[] = [
      {
        id: `user-quick-1`,
        sender: 'user',
        text: "⚡ 3단계 상담 시연용 정보 일괄 기입 및 맞춤 결과 분석 요청",
        timestamp: timeStr
      },
      {
        id: `assistant-step1-summary`,
        sender: 'assistant',
        text: "수집 완료. ✅ [1단계 구인 정보 등록 완료]\n비교할 시니어 일자리 구인 공고 3곳이 정상 등록되었습니다.",
        timestamp: timeStr
      },
      {
        id: `assistant-step2-summary`,
        sender: 'assistant',
        text: "수집 완료. ✅ [2단계 구직 이력 등록 완료]\n의뢰인 김복수 어르신(68세, 건물 보안 요원 11년)의 경력 정보를 일자리 매칭 데이터베이스에 연계했습니다.",
        timestamp: timeStr
      },
      {
        id: `assistant-step3-summary`,
        sender: 'assistant',
        text: "수집 완료. ✅ [3단계 희망 및 건강 조건 등록 완료]\n어르신의 무릎 불편함과 새벽 교대 근무 제외 희망, 주거지 마포구 인근 출퇴근 조건을 분석 조건에 꼼꼼히 탑재했습니다.",
        timestamp: timeStr
      },
      {
        id: 'assistant-analysis-active',
        sender: 'assistant',
        text: "시니어 맞춤형 일자리 찾기 분석을 작동하여, 어르신께 가장 알맞은 대시보드와 보관용 보고서를 만들고 있습니다... ⚙️",
        timestamp: timeStr
      }
    ];

    setChatMessages(prev => [...prev, ...newMessages]);
    setCurrentStep('analyzing');
    executeMatchAnalysis(SAMPLE_JOB_ADS, SAMPLE_SEEKER_INFO, SAMPLE_ADDITIONAL_INFO);
  };

  // Drag and drop events
  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const processSelectedFile = (file: File) => {
    setIsUploading(true);
    let displayName = file.name;
    if (file.type.startsWith('image/')) {
      if (file.name === 'image.png' || file.name.startsWith('image')) {
        const timeClean = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }).replace(/ /g, '');
        displayName = `스크린샷_참조_${timeClean}.png`;
      } else {
        displayName = `사진_${file.name}`;
      }
    }
    setUploadedFileName(displayName);
    
    setTimeout(() => {
      setIsUploading(false);
      if (currentStep === 1) {
        setInputText(SAMPLE_JOB_ADS);
      } else if (currentStep === 2) {
        setInputText(SAMPLE_SEEKER_INFO);
      } else if (currentStep === 3) {
        setInputText(SAMPLE_ADDITIONAL_INFO);
      }
    }, 1200);
  };

  const handleFilePaste = (e: React.ClipboardEvent) => {
    if (e.clipboardData && e.clipboardData.files && e.clipboardData.files.length > 0) {
      const file = e.clipboardData.files[0];
      if (
        file.type.startsWith('image/') || 
        file.name.endsWith('.pdf') || 
        file.name.endsWith('.txt') || 
        file.name.endsWith('.doc') || 
        file.name.endsWith('.docx')
      ) {
        e.preventDefault();
        processSelectedFile(file);
      }
    }
  };

  const handleStepSubmit = () => {
    if (!inputText.trim()) return;

    const timeStr = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `user-${currentStep}-${Date.now()}`,
      sender: 'user',
      text: uploadedFileName 
        ? `📎 파일 업로드: ${uploadedFileName}\n\n${inputText}`
        : inputText,
      timestamp: timeStr,
      step: currentStep as number
    };

    setChatMessages(prev => [...prev, userMsg]);
    const savedInput = inputText;
    
    setInputText('');
    setUploadedFileName(null);

    if (currentStep === 1) {
      setJobAdsInput(savedInput);
      const confirmationText = "구인 사업체 정보를 확인했습니다. ✅\n입력된 일자리 직무 요건이 접수되었습니다. 어르신의 몸 무리와 과거 경력에 어울리는 일자리인지 분석할 준비를 마쳤습니다.";
      
      setTimeout(() => {
        setChatMessages(prev => [
          ...prev,
          {
            id: `confirm-1`,
            sender: 'assistant',
            text: confirmationText,
            timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
          },
          {
            id: `q-2`,
            sender: 'assistant',
            text: `[2/3] 다음은 일자리를 추천받으실 어르신의 기본 정보를 입력할 차례입니다. 준비해 두신 어르신의 경력, 연세, 자격증 정보를 적거나 올려주세요.`,
            timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
            step: 2
          }
        ]);
        setCurrentStep(2);
      }, 700);

    } else if (currentStep === 2) {
      setSeekerInfoInput(savedInput);
      const confirmationText = "어르신 정보를 확인했습니다. ✅\n어르신의 과거 대표 경력과 나이, 취득하신 자격증 사항이 정성껏 기록되었습니다. 마음에 쏙 드실 일자리 추천 가준과 꼼꼼히 비교하겠습니다.";
      
      setTimeout(() => {
        setChatMessages(prev => [
          ...prev,
          {
            id: `confirm-2`,
            sender: 'assistant',
            text: confirmationText,
            timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
          },
          {
            id: `q-3`,
            sender: 'assistant',
            text: `[3/3] 마지막 단계입니다. 어르신의 관절염이나 허리 건강 상태, 밤샘 기피 요일, 거주지 같은 추가 건강 정보나 희망하는 출퇴근 조건을 적어주세요. 없으시면 '없음'으로 작성하셔도 됩니다.`,
            timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
            step: 3
          }
        ]);
        setCurrentStep(3);
      }, 700);

    } else if (currentStep === 3) {
      setAdditionalInfoInput(savedInput);
      const confirmationText = "접수 완료했습니다. ✅ [보살핌 및 희망 사항 등록 완료]\n어르신의 아프신 부위나 희망 근무시간 조건이 정상 접수되었습니다. 무리 없는 건강한 안전 일자리를 찾아내겠습니다.";
      
      setCurrentStep('analyzing');
      
      setTimeout(() => {
        setChatMessages(prev => [
          ...prev,
          {
            id: `confirm-3`,
            sender: 'assistant',
            text: confirmationText,
            timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
          },
          {
            id: `active-analyzing`,
            sender: 'assistant',
            text: "시니어 맞춤형 일자리 찾기 분석을 작동하여, 어르신께 가장 알맞은 대시보드와 보관용 보고서를 만들고 있습니다... ⚙️",
            timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        
        executeMatchAnalysis(jobAdsInput, seekerInfoInput, savedInput);
      }, 700);
    }
  };

  // Call server-side API to perform Gemini analysis
  const executeMatchAnalysis = async (jobs: string, seeker: string, additional: string) => {
    setErrorMessage(null);
    try {
      const response = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobAds: jobs,
          seekerInfo: seeker,
          additionalInfo: additional,
          customApiKey: customApiKey
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "분석 과정 중 이상 오류가 감지되었습니다.");
      }

      const parsedResult: MatchData = await response.json();
      setMatchResult(parsedResult);
      setCurrentStep('completed');
      
      setChatMessages(prev => [
        ...prev,
        {
          id: `success-completed-${Date.now()}`,
          sender: 'assistant',
          text: `분석 보고서 조판이 완공되었습니다! 🎉\n\n**대상 아버님/어르신:** ${parsedResult.seekerSummary.name}\n**최적 직권 추천 1순위:** ${parsedResult.generalSummary.topPick}\n\n우측 모니터의 **현장용 종합 대시보드**에 세밀 점수표가 업데이트되었습니다. 사회복지사 전송/공유 가이드용 **HTML 독립형 보고서 파일**도 다운로드 준비를 끝마쳤습니다.`,
          timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setActiveTab('dashboard');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "서버 통신 오류");
      setCurrentStep(3); // Go back to steps so user can adjust
      setChatMessages(prev => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          sender: 'assistant',
          text: `❌ 정량 데이터가 불충분하여 분석 중 오류가 발생했습니다: ${err.message || '서버 오류'}\n\n다시 분석을 요청하거나 혹은 상단의 [샘플 자동 일괄 분석] 버튼으로 빠른 적정 구동 규격을 검증하시기 바랍니다.`,
          timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  const handleRestart = () => {
    setCurrentStep(1);
    setInputText('');
    setUploadedFileName(null);
    setJobAdsInput('');
    setSeekerInfoInput('');
    setAdditionalInfoInput('');
    setMatchResult(null);
    setErrorMessage(null);
    setChatMessages([
      {
        id: `restart-${Date.now()}`,
        sender: 'assistant',
        text: "안녕하세요! 시니어 맞춤 일자리 찾기 도우미입니다. 😊\n총 3단계 정보를 하나씩 입력해 주시면, 어르신의 몸에 무리가 가지 않는 출퇴근 조건과 과거 경력을 모두 연계한 '가장 귀한 맞춤 일자리'를 찾아 대시보드로 정성껏 보여 드립니다.\n\n**[1/3] 먼저 비교해 보고 싶으신 구인 광고 내용(텍스트)을 자유롭게 적어주시거나, 채용 공고 문서를 마우스로 끌어서 올려주세요.**",
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        step: 1
      }
    ]);
  };

  const fullHtmlCode = matchResult ? generateStandaloneHtml(matchResult) : '';

  const handleCopyCode = () => {
    if (!fullHtmlCode) return;
    navigator.clipboard.writeText(fullHtmlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    if (!fullHtmlCode || !matchResult) return;
    const blob = new Blob([fullHtmlCode], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `시니어일자리매칭보고서_${matchResult.seekerSummary.name.replace(/\*/g, 'X')}.html`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 font-sans flex flex-col antialiased">
      
      {/* Top Header Navigation */}
      <header id="header-nav" className="bg-slate-900 text-white shrink-0 sticky top-0 z-40 shadow-sm border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setScreenMode('landing')}>
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center font-extrabold text-lg text-white">S</div>
            <div>
              <span className="text-[9px] font-bold text-indigo-400 block tracking-widest uppercase font-mono">Senior Employment AI Partner</span>
              <h1 className="text-sm md:text-base font-extrabold tracking-tight text-slate-100 break-keep">
                시니어 일자리 매칭 전문가 대시보드
              </h1>
            </div>
          </div>
          
          {/* Main Mode Toggles */}
          <div className="flex items-center gap-3">
            <nav className="flex space-x-1.5 bg-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setScreenMode('landing')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  screenMode === 'landing' 
                    ? 'bg-slate-700 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>소개 및 특장점</span>
              </button>
              
              <button
                onClick={() => {
                  if (!isValidated) {
                    alert("실시간 매칭 분석을 시작하려면 먼저 소개 화면에서 Gemini API 키를 입력하고 승인받으셔야 합니다. 😊");
                    const target = document.getElementById("api-key-section");
                    if (target) {
                      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                    return;
                  }
                  setScreenMode('workspace');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  screenMode === 'workspace' 
                    ? 'bg-slate-700 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>실시간 매칭 분석기</span>
              </button>
            </nav>

            <div className="hidden lg:flex items-center gap-2 bg-slate-800 text-slate-400 px-3 py-1.5 rounded-xl font-mono text-[10px] font-bold border border-slate-755">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{liveTime || "시계 가동 중..."}</span>
            </div>

            {screenMode === 'workspace' && currentStep !== 1 && (
              <button
                onClick={handleRestart}
                id="restart-button-top"
                className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3.5 py-2 rounded-xl transition-all font-bold border border-slate-755"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>처음부터</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          {screenMode === 'landing' ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <LandingPage 
                onStartAnalysis={() => setScreenMode('workspace')}
                onQuickStart={fillAllSampleAndRun}
                customApiKey={customApiKey}
                isValidated={isValidated}
                onValidateKey={handleValidateKey}
                onResetKey={handleResetKey}
              />
            </motion.div>
          ) : (
            <motion.main 
              key="workspace"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Side: Drag-drop Wizard Console */}
                <div className="lg:col-span-5">
                  <MatchingConsole 
                    currentStep={currentStep}
                    chatMessages={chatMessages}
                    inputText={inputText}
                    setInputText={setInputText}
                    uploadedFileName={uploadedFileName}
                    isUploading={isUploading}
                    isDragging={isDragging}
                    setIsDragging={setIsDragging}
                    handleFileDrop={handleFileDrop}
                    handleFileSelect={handleFileSelect}
                    handleFilePaste={handleFilePaste}
                    fillSampleDataForStep={fillSampleDataForStep}
                    handleStepSubmit={handleStepSubmit}
                    fillAllSampleAndRun={fillAllSampleAndRun}
                    handleRestart={handleRestart}
                    handleDownloadFile={handleDownloadFile}
                    chatContainerRef={chatContainerRef}
                  />
                </div>

                {/* Right Side: Dashboard Monitor */}
                <div className="lg:col-span-7">
                  <DashboardView 
                    matchResult={matchResult}
                    currentStep={currentStep}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    fullHtmlCode={fullHtmlCode}
                    handleCopyCode={handleCopyCode}
                    copied={copied}
                    handleDownloadFile={handleDownloadFile}
                    fillAllSampleAndRun={fillAllSampleAndRun}
                  />
                </div>

              </div>
            </motion.main>
          )}
        </AnimatePresence>
      </div>

      {/* Footer copyright */}
      <footer className="bg-white border-t border-slate-200 mt-20 py-8 text-center text-xs text-slate-400 font-semibold break-keep">
        <div className="max-w-7xl mx-auto px-4 space-y-1.5">
          <p>© 2026 시니어 일자리 매칭 대시보드 전문가 시스템. All Rights Reserved.</p>
          <p className="text-slate-350">고령층 구직자의 건강 권익 보호와 경력 친화적인 근로 생태계 활성화를 추구하는 사회복지사용 소통형 협력 도구입니다.</p>
        </div>
      </footer>

    </div>
  );
}
