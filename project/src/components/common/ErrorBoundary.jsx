import { Component } from 'react';
import Button from './Button';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6 text-center dark:bg-navy-950">
          <div className="max-w-md">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40">
              <span className="text-2xl">!</span>
            </div>
            <h1 className="text-xl font-bold text-navy-900 dark:text-gray-100">Something went wrong</h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              An unexpected error occurred. You can try reloading the page.
            </p>
            <div className="mt-6 flex justify-center gap-2">
              <Button onClick={() => window.location.reload()}>Reload page</Button>
              <Button variant="secondary" onClick={this.handleReset}>Try again</Button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
