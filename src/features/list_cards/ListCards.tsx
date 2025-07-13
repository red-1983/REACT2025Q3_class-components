import { Component } from 'react';
import Card from './card/Card';
import Spinner from '../../components/Spinner/Spinner';
import styles from './ListCards.module.css';

interface Character {
  id: number;
  name: string;
  image: string;
  species: string;
  status: string;
}

interface ListCardsProps {
  searchTerm: string;
}

interface ListCardsState {
  characters: Character[];
  loading: boolean;
  error: string | null;
}

class ListCards extends Component<ListCardsProps, ListCardsState> {
  constructor(props: ListCardsProps) {
    super(props);
    this.state = {
      characters: [],
      loading: false,
      error: null,
    };
  }

  componentDidMount() {
    this.fetchCharacters(this.props.searchTerm);
  }

  componentDidUpdate(prevProps: ListCardsProps) {
    if (prevProps.searchTerm !== this.props.searchTerm) {
      this.fetchCharacters(this.props.searchTerm);
    }
  }

  fetchCharacters = async (searchTerm: string) => {
    this.setState({ loading: true, error: null });

    try {
      let url = 'https://rickandmortyapi.com/api/character';

      if (searchTerm.trim()) {
        url += `?name=${encodeURIComponent(searchTerm.trim())}`;
      }

      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();
        this.setState({
          characters: data.results || [],
          loading: false,
        });
      } else if (response.status === 404) {
        // API возвращает 404 когда нет результатов поиска
        this.setState({
          characters: [],
          loading: false,
          error: 'Персонажи не найдены. Попробуйте другой поисковый запрос.',
        });
      } else {
        this.setState({
          characters: [],
          loading: false,
          error: `Ошибка при загрузке данных: ${response.status} ${response.statusText}`,
        });
      }
    } catch (error) {
      this.setState({
        characters: [],
        loading: false,
        error: `Ошибка сети: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`,
      });
    }
  };

  render() {
    const { characters, loading, error } = this.state;

    if (loading) {
      return <Spinner />;
    }

    if (error) {
      return (
        <div className={styles.errorMessage}>
          <h3>Ошибка</h3>
          <p>{error}</p>
          <button
            onClick={() => this.fetchCharacters(this.props.searchTerm)}
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
        )}
      </div>
    );
  }
}

export default ListCards;
