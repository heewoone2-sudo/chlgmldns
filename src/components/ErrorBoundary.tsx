import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCw, RefreshCw, BookOpen } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorCount: 0
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorCount: 1 };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught render error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState(prev => ({
      hasError: false,
      error: null,
      errorCount: prev.errorCount + 1
    }));
  };

  private handleResetData = () => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage?.removeItem('ppakong_completed');
      }
    } catch (e) {
      console.warn('LocalStorage clear error suppressed:', e);
    }
    this.setState({
      hasError: false,
      error: null,
      errorCount: 0
    });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
          <div className="max-w-md w-full bg-slate-900 border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/40 shadow-inner">
              <AlertTriangle className="w-7 h-7" />
            </div>
            
            <h2 className="text-xl font-black text-white">
              스터디 노트를 불러오는 중입니다
            </h2>
            
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              화면 전환 중 일시적인 지연이 발생했습니다.<br/>
              아래 <strong>[화면 다시 불러오기]</strong> 버튼을 누르면 정상적으로 학습을 계속할 수 있습니다!
            </p>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                onClick={this.handleRetry}
                className="flex-1 py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              >
                <RotateCw className="w-4 h-4 stroke-[2.5]" />
                화면 다시 불러오기
              </button>

              <button
                onClick={this.handleResetData}
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs sm:text-sm transition flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700"
                title="체크 기록 초기화"
              >
                <RefreshCw className="w-4 h-4 text-slate-400" />
                기록 초기화
              </button>
            </div>

            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>중2 역사 빡공시대 21~34강 스터디 가이드</span>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
