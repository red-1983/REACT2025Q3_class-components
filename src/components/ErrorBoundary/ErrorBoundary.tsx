import { Component, ErrorInfo, ReactNode } from 'react';
import styles from './ErrorBoundary.module.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary поймал ошибку:', error, errorInfo);
  }
  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };
  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.errorBoundary}>
          <h2>Что-то пошло не так!</h2>
          <p>Произошла ошибка в приложении.</p>
          <details>
            <summary>Детали ошибки</summary>
            <pre>{this.state.error?.stack}</pre>
          </details>
          <button onClick={this.handleRetry} className={styles.retryButton}>
            Попробовать снова
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
