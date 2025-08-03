import styles from './Header.module.css';
import { NavLink } from 'react-router-dom';
import { useUIStore } from '../../stores/useUIStore';
interface HeaderProps {
  title?: string;
}

const Header = ({ title }: HeaderProps) => {
  const getNavLinkClass = ({ isActive }: { isActive: boolean }) => {
    return isActive ? `${styles.navLink} ${styles.active}` : styles.navLink;
  };
  const { theme, toggleTheme } = useUIStore();

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
      <button className={styles.button_theme} onClick={toggleTheme}>
        Тема: {theme === 'light' ? 'Светлая' : 'Темная'}
      </button>
    </header>
  );
};

export default Header;
