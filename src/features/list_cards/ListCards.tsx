import { Component } from 'react';
import Card from './card/Card';
import Spinner from '../../components/Spinner/Spinner';
import Pagination from '../../components/Pagination/Pagination';
import styles from './ListCards.module.css';

interface Character {
  id: number;
  name: string;
  image: string;
  species: string;
  status: string;
}

interface ApiResponse {
  results: Character[];
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
}

interface ListCardsProps {
  searchTerm: string;
  currentPage: number;
  onPageChange: (page: number) => void;
}

interface ListCardsState {
  characters: Character[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  totalCount: number;
}

class ListCards extends Component<ListCardsProps, ListCardsState> {
  constructor(props: ListCardsProps) {
    super(props);
    this.state = {
      characters: [],
      loading: false,
      error: null,
      totalPages: 1,
      totalCount: 0,
    };
  }

  componentDidMount() {
    this.fetchCharacters(this.props.searchTerm, this.props.currentPage);
  }

  componentDidUpdate(prevProps: ListCardsProps) {
    if (
      prevProps.searchTerm !== this.props.searchTerm ||
      prevProps.currentPage !== this.props.currentPage
    ) {
      this.fetchCharacters(this.props.searchTerm, this.props.currentPage);
    }
  }

  fetchCharacters = async (searchTerm: string, page: number = 1) => {
    this.setState({ loading: true, error: null });

    try {
      let url = `https://rickandmortyapi.com/api/character?page=${page}`;

      if (searchTerm.trim()) {
        url += `&name=${encodeURIComponent(searchTerm.trim())}`;
      }

      const response = await fetch(url);

      if (response.ok) {
        const data: ApiResponse = await response.json();
        this.setState({
          characters: data.results || [],
          loading: false,
          totalPages: data.info.pages,
          totalCount: data.info.count,
        });
      } else if (response.status === 404) {
        // API возвращает 404 когда нет результатов поиска
        this.setState({
          characters: [],
          loading: false,
          error: 'Персонажи не найдены. Попробуйте другой поисковый запрос.',
          totalPages: 1,
          totalCount: 0,
        });
      } else {
        this.setState({
          characters: [],
          loading: false,
          error: `Ошибка при загрузке данных: ${response.status} ${response.statusText}`,
          totalPages: 1,
          totalCount: 0,
        });
      }
    } catch (error) {
      this.setState({
        characters: [],
        loading: false,
        error: `Ошибка сети: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`,
        totalPages: 1,
        totalCount: 0,
      });
    }
  };

  handlePageChange = (page: number) => {
    this.props.onPageChange(page);
  };

  render() {
    const { characters, loading, error, totalPages, totalCount } = this.state;
    const { currentPage } = this.props;

    if (loading) {
      return <Spinner />;
    }

    if (error) {
      return (
        <div className={styles.errorMessage}>
          <h3>Ошибка</h3>
          <p>{error}</p>
          <button
            onClick={() =>
              this.fetchCharacters(
                this.props.searchTerm,
                this.props.currentPage
              )
            }
            className={styles.retryButton}
          >
            Попробовать снова
          </button>
        </div>
      );
    }

    return (
      <div className={styles.resultsSection}>
        {characters.length === 0 ? (
          <div className={styles.noResults}>
            <p>Персонажи не найдены</p>
          </div>
        ) : (
          <>
            <div className={styles.resultsInfo}>
              <p>
                Найдено {totalCount} персонажей
                {totalPages > 1 &&
                  ` (страница ${currentPage} из ${totalPages})`}
              </p>
            </div>
            <div className={styles.listCards}>
              {characters.map((character) => (
                <Card
                  key={character.id}
                  name={character.name}
                  url={character.image}
                  description={`${character.species} - ${character.status}`}
                />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={this.handlePageChange}
            />
          </>
        )}
      </div>
    );
  }
}

export default ListCards;
