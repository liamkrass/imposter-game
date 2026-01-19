import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("Uncaught Error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gray-900 text-red-500 p-8 flex flex-col items-center justify-center text-center">
                    <h1 className="text-4xl font-bold mb-4">Something went wrong.</h1>
                    <div className="bg-black/50 p-4 rounded-xl border border-red-500/30 max-w-2xl overflow-auto text-left">
                        <p className="font-mono text-lg font-bold mb-2">{this.state.error && this.state.error.toString()}</p>
                        <pre className="font-mono text-xs text-gray-400 whitespace-pre-wrap">
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </pre>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-8 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
