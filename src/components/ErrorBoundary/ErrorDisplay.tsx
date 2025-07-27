import styles from './ErrorDisplay.module.css';

interface ErrorDisplayProps {
  message: string;
  onClose: () => void;
}

const ErrorDisplay = ({ message, onClose }: ErrorDisplayProps) => {
  return (
    <div className={styles.errorOverlay}>
      <div className={styles.errorContainer}>
        <button
          onClick={onClose}
          className={styles.closeButton}
          aria-label="Закрыть"
        >
          &times;
        </button>
        <p className={styles.errorMessage}>{message}</p>
      </div>
    </div>
  );
};

export default ErrorDisplay;
