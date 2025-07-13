import { Component } from 'react';
import styles from './SearchCards.module.css';

interface SearchCardsState {
  searchTerm: string;
}

interface SearchCardsProps {
  onSearch: (searchTerm: string) => void;
}

class SearchCards extends Component<SearchCardsProps, SearchCardsState> {
  constructor(props: SearchCardsProps) {
    super(props);

    const savedSearchTerm = localStorage.getItem('searchTerm') || '';

    this.state = {
      searchTerm: savedSearchTerm,
    };
  }

  componentDidMount() {
    // Если есть сохраненный поисковый запрос, выполняем поиск при загрузке
    if (this.state.searchTerm) {
      this.props.onSearch(this.state.searchTerm);
    } else {
      // Если поискового запроса нет, загружаем все элементы
      this.props.onSearch('');
    }
  }

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchTerm: event.target.value });
  };

  handleSearch = () => {
    // Удаляем пробелы в начале и конце
    const trimmedSearchTerm = this.state.searchTerm.trim();

    // Сохраняем поисковый запрос в localStorage
    localStorage.setItem('searchTerm', trimmedSearchTerm);

    // Выполняем поиск
    this.props.onSearch(trimmedSearchTerm);
  };

  handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      this.handleSearch();
    }
  };

  render() {
    const { searchTerm } = this.state;

    return (
      <div className={styles.searchSection}>
        <div className={styles.fieldSearch}>
          <label htmlFor="search-input" className="visually-hidden">
            Поиск персонажей
          </label>
          <input
            type="search"
            id="search-input"
            placeholder="Поиск персонажей..."
            title="Поиск персонажей"
            value={searchTerm}
            onChange={this.handleInputChange}
            onKeyPress={this.handleKeyPress}
            className={styles.searchInput}
          />
          <button onClick={this.handleSearch} className={styles.searchButton}>
            Поиск
          </button>
        </div>
      </div>
    );
  }
}

export default SearchCards;
