import { useState } from 'react';
import styles from './SearchCards.module.css';

interface SearchCardsProps {
  onSearch: (searchTerm: string) => void;
}

const SearchCards = ({ onSearch }: SearchCardsProps) => {
  const [inputValue, setInputValue] = useState(
    () => localStorage.getItem('searchTerm') || ''
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSearchClick = () => {
    const trimmedSearchTerm = inputValue.trim();
    localStorage.setItem('searchTerm', trimmedSearchTerm);
    onSearch(trimmedSearchTerm);
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
          value={inputValue}
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
