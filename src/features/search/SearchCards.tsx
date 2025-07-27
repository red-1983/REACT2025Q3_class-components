import { useState, useEffect } from 'react';
import styles from './SearchCards.module.css';

interface SearchCardsProps {
  onSearch: (searchTerm: string) => void;
}

const SearchCards = ({ onSearch }: SearchCardsProps) => {
  const [searchTerm, setSearchTerm] = useState(
    () => localStorage.getItem('searchTerm') || ''
  );
  useEffect(() => {
    onSearch(searchTerm.trim());
  }, [onSearch, searchTerm]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchClick = () => {
    const trimmedSearchTerm = searchTerm.trim();

    localStorage.setItem('searchTerm', trimmedSearchTerm);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearchClick();
    }
  };
  return (
    <div className={styles.searchSection}>
      <div className={styles.fieldSearch}>
        <label htmlFor="search-input" className={styles.visuallyHidden}>
          Поиск персонажей
        </label>
        <input
          type="search"
          id="search-input"
          placeholder="Поиск персонажей..."
          title="Поиск персонажей"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className={styles.searchInput}
        />
        <button onClick={handleSearchClick} className={styles.searchButton}>
          Поиск
        </button>
      </div>
    </div>
  );
};

export default SearchCards;
