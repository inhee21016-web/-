import React from 'react';
import { 
  Sparkles, 
  UploadCloud, 
  FileText, 
  RefreshCw, 
  ArrowRight, 
  CheckCircle2 
} from 'lucide-react';
import { ChatMessage } from '../types';

interface MatchingConsoleProps {
  currentStep: 1 | 2 | 3 | 'analyzing' | 'completed';
  chatMessages: ChatMessage[];
  inputText: string;
  setInputText: (text: string) => void;
  uploadedFileName: string | null;
  isUploading: boolean;
  isDragging: boolean;
  setIsDragging: (drag: boolean) => void;
  handleFileDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFilePaste: (e: React.ClipboardEvent<any>) => void;
  fillSampleDataForStep: (step: number) => void;
  handleStepSubmit: () => void;
  fillAllSampleAndRun: () => void;
  handleRestart: () => void;
  handleDownloadFile: () => void;
  chatContainerRef: React.RefObject<HTMLDivElement>;
}

export function MatchingConsole({
  currentStep,
  chatMessages,
  inputText,
  setInputText,
  uploadedFileName,
  isUploading,
  isDragging,
  setIsDragging,
  handleFileDrop,
  handleFileSelect,
  handleFilePaste,
  fillSampleDataForStep,
  handleStepSubmit,
  fillAllSampleAndRun,
  handleRestart,
  handleDownloadFile,
  chatContainerRef
}: MatchingConsoleProps) {
  return (
    <div id="chat-terminal" className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-200/50 overflow-hidden flex flex-col h-[520px] sm:h-[640px] transition-all">
      {/* Terminal Top Title */}
      <div className="bg-slate-900 text-slate-200 px-5 py-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 bg-rose-500 rounded-full" />
            <span className="w-2.5 h-2.5 bg-amber-500 rounded-full" />
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
          </div>
          <span className="text-xs font-mono font-bold text-slate-400 ml-1.5">AI Matching Engine v1.5</span>
        </div>
        <div className="flex gap-2">
          {currentStep !== 'completed' && currentStep !== 'analyzing' && (
            <button 
              onClick={fillAllSampleAndRun}
              className="text-[11px] font-extrabold bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 shadow-sm shadow-indigo-600/10"
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span className="hidden sm:inline">샘플 자동 일괄 분석</span>
              <span className="sm:hidden">샘플 자동 분석</span>
            </button>
          )}
        </div>
      </div>

      {/* Steps Visualizer inside the Console */}
      <div className="bg-slate-50 px-3 sm:px-5 py-3 border-b border-slate-100 grid grid-cols-3 gap-2 sm:gap-3 text-[10px] font-bold text-slate-400">
        <div className="flex items-center gap-1 sm:gap-1.5">
          <span className={`w-4 h-4 rounded-full flex items-center justify-center font-mono text-[9px] shrink-0 ${
            currentStep === 1 
              ? 'bg-indigo-600 text-white' 
              : (currentStep === 2 || currentStep === 3 || currentStep === 'analyzing' || currentStep === 'completed') 
                ? 'bg-emerald-500 text-white' 
                : 'bg-slate-200 text-slate-500'
          }`}>1</span>
          <span className={`truncate ${currentStep === 1 ? 'text-indigo-600' : (currentStep === 2 || currentStep === 3 || currentStep === 'analyzing' || currentStep === 'completed') ? 'text-emerald-600' : ''}`}>
            <span className="hidden sm:inline">구인 공고 등록</span>
            <span className="sm:hidden">구인 공고</span>
          </span>
        </div>
        <div className="flex items-center gap-1 sm:gap-1.5">
          <span className={`w-4 h-4 rounded-full flex items-center justify-center font-mono text-[9px] shrink-0 ${
            currentStep === 2 
              ? 'bg-indigo-600 text-white' 
              : (currentStep === 3 || currentStep === 'analyzing' || currentStep === 'completed') 
                ? 'bg-emerald-500 text-white' 
                : 'bg-slate-200 text-slate-500'
          }`}>2</span>
          <span className={`truncate ${currentStep === 2 ? 'text-indigo-600' : (currentStep === 3 || currentStep === 'analyzing' || currentStep === 'completed') ? 'text-emerald-600' : ''}`}>
            <span className="hidden sm:inline">구직 어르신 정보</span>
            <span className="sm:hidden">어르신 정보</span>
          </span>
        </div>
        <div className="flex items-center gap-1 sm:gap-1.5">
          <span className={`w-4 h-4 rounded-full flex items-center justify-center font-mono text-[9px] shrink-0 ${
            currentStep === 3 ? 'bg-indigo-600 text-white' : currentStep === 'completed' ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
          }`}>3</span>
          <span className={`truncate ${currentStep === 3 ? 'text-indigo-600' : currentStep === 'completed' ? 'text-emerald-600' : ''}`}>
            <span className="hidden sm:inline">추가 희망사항</span>
            <span className="sm:hidden">추가 조건</span>
          </span>
        </div>
      </div>

      {/* Chat Messages Logs */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/10 scroll-smooth"
      >
        {chatMessages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <span className="text-[10px] text-slate-400 mb-1 font-bold px-1">
              {msg.sender === 'user' ? '최강꼬부기 복지사' : '일자리 맞춤 분석 도우미'} ({msg.timestamp})
            </span>
            <div 
              className={`max-w-[90%] rounded-2xl px-4 py-3 text-xs leading-relaxed whitespace-pre-wrap break-words border transition-all break-keep ${
                msg.sender === 'user' 
                  ? 'bg-indigo-600 text-white border-indigo-700 font-semibold rounded-tr-none shadow-sm' 
                  : 'bg-white text-slate-800 border-slate-200/60 rounded-tl-none shadow-sm shadow-slate-100'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* Loading placeholder */}
        {currentStep === 'analyzing' && (
          <div className="flex flex-col items-start animate-pulse">
            <span className="text-[10px] text-slate-400 mb-1 font-bold px-1">
              일자리 맞춤 분석 도우미 (7년 차 최강꼬부기 복지사와 대조 중)
            </span>
            <div className="bg-white rounded-2xl rounded-tl-none p-4 text-xs font-semibold border border-slate-200/80 shadow-sm text-indigo-700 flex items-center gap-3 break-keep">
              <div className="relative w-5 h-5">
                <div className="absolute w-full h-full border-2 border-indigo-200 rounded-full animate-ping"></div>
                <div className="absolute w-full h-full border-2 border-indigo-600 rounded-full animate-spin border-t-transparent"></div>
              </div>
              <span>어르신을 위한 건강 안전성과 일을 해오신 경험을 하나하나 확인하는 중입니다...</span>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Inputs Frame */}
      {currentStep !== 'completed' && currentStep !== 'analyzing' && (
        <div className="p-4 border-t border-slate-100 bg-white space-y-3">
          
          {/* Uploader / Drag Area */}
          <div 
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileDrop}
            onPaste={handleFilePaste}
            className={`relative rounded-2xl border-2 border-dashed transition-all p-3.5 text-center ${
              isDragging 
                ? 'border-indigo-500 bg-indigo-50/40' 
                : uploadedFileName 
                ? 'border-emerald-300 bg-emerald-50/20' 
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
            }`}
          >
            <input 
              type="file" 
              id="file-selector"
              className="absolute inset-0 opacity-0 cursor-pointer" 
              onChange={handleFileSelect}
              accept="image/*,.heic,.heif,.txt,.pdf,.jpg,.jpeg,.png,.gif,.bmp,.doc,.docx"
            />
            
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-left">
                {isUploading ? (
                  <div className="w-8 h-8 bg-indigo-100 text-indigo-600 flex items-center justify-center rounded-xl animate-spin">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                ) : uploadedFileName ? (
                  <div className="w-8 h-8 bg-emerald-100 text-emerald-700 flex items-center justify-center rounded-xl">
                    <FileText className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-slate-100 text-slate-500 flex items-center justify-center rounded-xl">
                    <UploadCloud className="w-4.5 h-4.5" />
                  </div>
                )}
                <div>
                  <p className="text-xs font-extrabold text-slate-700 leading-none">
                    {isUploading 
                      ? "문서 및 사진(스크린샷) 분석 중..." 
                      : uploadedFileName 
                      ? `첨부 완료: ${uploadedFileName}` 
                      : `[${currentStep}/3] 서류 파일 첨부 / 이미지 / 스크린샷`}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1 font-semibold">
                    {uploadedFileName ? "문서 및 스크린샷 분석을 완료했습니다." : "모든 이미지(JPG, PNG), 문서 드래그 또는 붙여넣기(Ctrl+V) 지원"}
                  </p>
                </div>
              </div>

              {!uploadedFileName && !isUploading && (
                <button
                  type="button"
                  onClick={() => fillSampleDataForStep(currentStep as number)}
                  className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-xl text-[10px] font-extrabold transition-all flex items-center gap-1 border border-indigo-100/30"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  <span>예제 채우기</span>
                </button>
              )}
            </div>
          </div>

          {/* Prompt Fields */}
          <div className="space-y-2">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onPaste={handleFilePaste}
              placeholder={
                currentStep === 1 
                  ? "[1단계] 비교해볼 일자리 구인 공고(업체명, 일하는 시간 등)를 자유롭게 적거나 파일을 올려주세요..."
                  : currentStep === 2
                  ? "[2단계] 일자리를 찾으시는 어르신의 과거 일하셨던 경력, 나이, 원하시는 일 종류를 적어주세요..."
                  : "[3단계] 어르신의 관절/허리 건강 상태, 새벽 일 하기 어려움 등 특별히 고려해야 할 점을 적어주세요..."
              }
              className="w-full h-24 p-3 border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none bg-slate-50/55 focus:bg-white transition-all font-medium leading-relaxed"
            />
            
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-400 font-mono font-semibold">
                {inputText.length}자 적음
              </span>
              <button
                type="button"
                onClick={handleStepSubmit}
                disabled={!inputText.trim() || isUploading}
                className={`px-5 py-2.5 rounded-2xl font-extrabold text-xs transition-all flex items-center gap-1.5 shadow-sm ${
                  inputText.trim() && !isUploading
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-200'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>{currentStep === 3 ? "맞춤 일자리 종합 분석 시작" : "등록 완료 및 다음 단계"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Completed States Box */}
      {currentStep === 'completed' && (
        <div className="p-4 border-t border-slate-150 bg-white flex flex-col gap-2.5 break-keep">
          <div className="bg-emerald-50 text-emerald-800 p-3 rounded-2xl border border-emerald-100/50 flex items-center gap-2 text-xs font-bold font-sans">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>어르신 전용 맞춤 추천서와 대시보드가 성공적으로 준비되었습니다!</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleRestart}
              className="py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-2xl font-extrabold text-xs transition-all flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>새로운 어르신 상담하기</span>
            </button>
            <button
              onClick={handleDownloadFile}
              className="py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>보고서 파일 다운로드</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
