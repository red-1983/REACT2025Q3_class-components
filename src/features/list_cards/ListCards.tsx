import Card from './card/Card';
import Spinner from '../../components/Spinner/Spinner';
import Pagination from '../../components/Pagination/Pagination';
import styles from './ListCards.module.css';
import { useCallback, useEffect, useState } from 'react';

export interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  image: string;
}
export interface ApiResponse {
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

const ListCards = ({
  searchTerm,
  currentPage,
  onPageChange,
}: ListCardsProps) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const fetchCharacters = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const baseUrl = 'https://rickandmortyapi.com/api/character';
      const params = new URLSearchParams({
        page: currentPage.toString(),
      });
      const trimmedSearchTerm = searchTerm.trim();

      if (searchTerm.trim()) {
        params.append('name', trimmedSearchTerm);
      }

      const response = await fetch(`${baseUrl}?${params.toString()}`);
      if (response.ok) {
        const data: ApiResponse = await response.json();
        setCharacters(data.results || []);
        setTotalPages(data.info.pages);
        setTotalCount(data.info.count);
      } else if (response.status === 404) {
        setCharacters([]);
        setError('Персонажи не найдены. Попробуйте другой поисковый запрос.');
        setTotalPages(1);
        setTotalCount(0);
      } else {
        setCharacters([]);
        setError(
          `Ошибка при загрузке данных: ${response.status} ${response.statusText}`
        );
        setTotalPages(1);
        setTotalCount(0);
      }
    } catch (error) {
      setCharacters([]);
      setError(
        `Ошибка сети: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`
      );
      setTotalPages(1);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm]);

  useEffect(() => {
    fetchCharacters();
  }, [fetchCharacters]);
  if (loading) {
    return <Spinner />;
  }
  if (error) {
    return (
      <div className={styles.errorMessage}>
        <h3>Ошибка</h3>
        <p>{error}</p>
        <button onClick={fetchCharacters} className={styles.retryButton}>
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
              {totalPages > 1 && ` (страница ${currentPage} из ${totalPages})`}
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
            onPageChange={onPageChange}
          />
        </>
      )}
    </div>
  );
};

export default ListCards;
