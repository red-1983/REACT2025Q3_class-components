import { Component } from 'react';
import styles from './Header.module.css';

interface HeaderProps {
  title?: string;
}

class Header extends Component<HeaderProps> {
  render() {
    const { title } = this.props;

    return (
      <header className={styles.header}>
        <a href="https://rickandmortyapi.com/">
          <h1>{title}</h1>
        </a>
      </header>
    );
  }
}

export default Header;
