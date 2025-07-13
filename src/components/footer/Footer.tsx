import { Component } from 'react';
import styles from './Footer.module.css';
class Footer extends Component {
  render() {
    return (
      <footer className={styles.footer}>
        <p>&#169; 2025 Rolling Scopes School </p>
      </footer>
    );
  }
}

export default Footer;
