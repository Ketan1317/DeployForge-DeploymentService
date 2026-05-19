import React from 'react';
import type { ReactNode, ReactElement } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: string | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(): Partial<ErrorBoundaryState> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.setState({
      error,
      errorInfo: errorInfo.componentStack || null,
    });

    console.error('Error caught by ErrorBoundary:', error);
    console.error('Error Info:', errorInfo);
  }

  handleRetry = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactElement {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-[4vw] font-sans">
          <div className="w-full max-w-lg bg-[#0d0d12] border border-white/10 p-8 text-center space-y-6">
            <div className="text-5xl text-[#fd5200]">&#9888;&#65039;</div>
            <h2 className="text-xl font-black uppercase tracking-wider text-white">
              Oops! Something went wrong
            </h2>
            <p className="text-sm text-white/70 font-mono bg-white/[0.02] p-4 border border-white/5 truncate">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            {import.meta.env.DEV && this.state.errorInfo && (
              <details className="text-left text-xs bg-black p-4 border border-white/10 space-y-2 cursor-pointer">
                <summary className="font-bold uppercase tracking-wider text-white/50 hover:text-white transition-colors duration-150">
                  Error Details (Development Only)
                </summary>
                <pre className="overflow-x-auto whitespace-pre-wrap text-red-400 font-mono mt-2">
                  {this.state.errorInfo}
                </pre>
              </details>
            )}
            <button
              onClick={this.handleRetry}
              className="w-full bg-white text-black hover:bg-[#fd5200] hover:text-white px-6 py-3.5 text-xs font-black uppercase tracking-widest transition-all duration-300 active:scale-98 cursor-pointer"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children as ReactElement;
  }
}
