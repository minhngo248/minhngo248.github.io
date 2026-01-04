import { Component } from 'react';
import { Link } from 'react-router-dom';

/**
 * Error boundary component to catch and handle React errors gracefully
 * Particularly useful for markdown rendering errors and other component failures
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-8 my-8 max-w-lg mx-auto">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-red-400 mb-3 text-center">
            {this.props.title || 'Something went wrong'}
          </h2>
          <p className="text-slate-300 mb-6 leading-relaxed text-center">
            {this.props.message || 'An unexpected error occurred while rendering this content. Please try refreshing the page or go back to the blog listing.'}
          </p>
          
          {/* Show error details in development */}
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mb-6 bg-slate-900 p-4 rounded-lg border border-slate-700">
              <summary className="text-slate-400 cursor-pointer mb-2 font-medium">
                Error Details (Development)
              </summary>
              <pre className="text-xs text-red-300 overflow-auto">
                {this.state.error.toString()}
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg font-semibold transition-colors text-center"
            >
              Refresh Page
            </button>
            {this.props.showBackToBlogs !== false && (
              <Link 
                to="/blog" 
                className="bg-slate-600 hover:bg-slate-500 px-4 py-2 rounded-lg font-semibold transition-colors text-center"
              >
                Back to Blog
              </Link>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;