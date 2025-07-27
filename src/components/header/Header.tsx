import styles from './Header.module.css';
import { NavLink } from 'react-router-dom';
interface HeaderProps {
  title?: string;
}

const Header = ({ title }: HeaderProps) => {
  const getNavLinkClass = ({ isActive }: { isActive: boolean }) => {
    return isActive ? `${styles.navLink} ${styles.active}` : styles.navLink;
  };
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <a href="https://rickandmortyapi.com/">
          <h1>{title}</h1>
        </a>
      </div>
      <nav className={styles.nav}>
        <NavLink to="/" className={getNavLinkClass} end>
          Главная
        </NavLink>
        <NavLink to="/about" className={getNavLinkClass}>
          О приложении
        </NavLink>
      </nav>
    </header>
  );
};

export default Header;
