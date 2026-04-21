import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ErrorMessage } from './feedback/ErrorMessage';

type ErrorBoundaryProps = {
  children: ReactNode;
  fallbackText?: string;
  resetKey?: string | number | null;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught render error:', error, errorInfo);
  }

  componentDidUpdate(previousProps: ErrorBoundaryProps) {
    if (previousProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="message-fallback">
          <ErrorMessage
            actionLabel="Повторить"
            onAction={this.handleReset}
            text={this.props.fallbackText ?? 'Не удалось отрисовать сообщения. Попробуйте еще раз.'}
          />
        </div>
      );
    }

    return this.props.children;
  }
}
