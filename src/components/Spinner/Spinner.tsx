import styles from './Spinner.module.css';

const Spinner = () => {
  return (
    <div className={styles.spinnerContainer} data-testid="spinner">
      <div className={styles.spinner}></div>
      <p>Загрузка...</p>
    </div>
  );
};

export default Spinner;
