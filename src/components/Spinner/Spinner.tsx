import { Component } from 'react';
import styles from './Spinner.module.css';

class Spinner extends Component {
  render() {
    return (
      <div className={styles.spinnerContainer}>
        <div className={styles.spinner}></div>
        <p>Загрузка...</p>
      </div>
    );
  }
}

export default Spinner;
