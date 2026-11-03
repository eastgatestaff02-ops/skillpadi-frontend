import { Component } from 'react';
import { AlertCircle } from 'lucide-react';

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error('SkillPadi stopped because of an error', error);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="flex min-h-screen items-center justify-center bg-cream px-4">
        <div className="w-full max-w-sm rounded-xl border border-navy-50 bg-white p-6 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-danger-50">
            <AlertCircle size={28} className="text-danger-500" />
          </span>
          <h1 className="mt-4 text-h2 font-bold text-navy-500">Something went wrong</h1>
          <p className="mt-1 text-body2 text-navy-500/70">
            An unexpected error stopped this page. Starting again usually fixes it.
          </p>
          <button
            type="button"
            onClick={() => window.location.assign('/')}
            className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-lg bg-ochre-500 text-body1 font-medium text-navy-500 transition-colors hover:bg-ochre-600 active:bg-ochre-700"
          >
            Back to the start
          </button>
        </div>
      </div>
    );
  }
}