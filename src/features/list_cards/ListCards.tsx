import Card from './card/Card';
import Spinner from '../../components/Spinner/Spinner';
import Pagination from '../../components/Pagination/Pagination';
import styles from './ListCards.module.css';
import { useCallback, useEffect, useState } from 'react';
import { useCharacterSelectionStore } from '../../stores/useCharacterSelectionStore';

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
  onCharacterClick: (id: number) => void;
}

const ListCards = ({
  searchTerm,
  currentPage,
  onCharacterClick,
  onPageChange,
}: ListCardsProps) => {
  const { selectedCharacters, toggleCharacter, clearSelection } =
    useCharacterSelectionStore();

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

  const handleSaveCsv = () => {
    if (selectedCharacters.length === 0) return;

    const escapeCsvField = (field: string | number) => {
      const str = String(field);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const headers = ['Name', 'Description', 'Details URL'];
    const rows = selectedCharacters.map((elem) => {
      const description = `${elem.species} - ${elem.status}`;
      const detailsUrl = `https://rickandmortyapi.com/api/character/${elem.id}`;
      return [
        escapeCsvField(elem.name),
        escapeCsvField(description),
        escapeCsvField(detailsUrl),
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([`\uFEFF${csvContent}`], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${selectedCharacters.length}_items.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
            {characters.map((character) => {
              const isSelected = selectedCharacters.some(
                (c) => c.id === character.id
              );
              return (
                <Card
                  key={character.id}
                  name={character.name}
                  url={character.image}
                  description={`${character.species} - ${character.status}`}
                  onClick={() => onCharacterClick(character.id)}
                  isChecked={isSelected}
                  onToggle={() => toggleCharacter(character)}
                />
              );
            })}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </>
      )}
      {selectedCharacters.length > 0 && (
        <div className={styles.selectedCharactersCount}>
          <p>{`Количество выбранных персонажей: ${selectedCharacters.length}`}</p>
          <div className={styles.buttonContainer}>
            <button onClick={clearSelection}>Отменить выбор всех</button>
            <button onClick={handleSaveCsv}>Сохранить список</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListCards;
