import styles from './Header.module.css';

interface HeaderProps {
  title?: string;
}

const Header = ({ title }: HeaderProps) => {
  return (
    <header className={styles.header}>
      <a href="https://rickandmortyapi.com/">
        <h1>{title}</h1>
      </a>
    </header>
  );
};

export default Header;
