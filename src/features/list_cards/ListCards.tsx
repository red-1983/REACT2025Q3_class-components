import Card from './card/Card';
import Spinner from '../../components/Spinner/Spinner';
import Pagination from '../../components/Pagination/Pagination';
import styles from './ListCards.module.css';
import { useCharacterSelectionStore } from '../../stores/useCharacterSelectionStore';
import { useCharacters } from '../../hooks/useCharacters';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../const/queryKeys';
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
  const queryClient = useQueryClient();
  const { selectedCharacters, toggleCharacter, clearSelection } =
    useCharacterSelectionStore();

  const { data, error, isLoading } = useCharacters(currentPage, searchTerm);
  const handleRefresh = () => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.characters.list(currentPage, searchTerm),
    });
  };
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

  if (isLoading) {
    return <Spinner />;
  }
  if (error) {
    const errorMessage = error.message.includes('404')
      ? 'Персонажи не найдены. Попробуйте другой поисковый запрос.'
      : `Ошибка сети: ${error.message}`;
    return (
      <div className={styles.errorMessage}>
        <h3>Ошибка</h3>
        <p>{errorMessage}</p>
        <button onClick={handleRefresh} className={styles.retryButton}>
          Попробовать снова
        </button>
      </div>
    );
  }
  return (
    <div className={styles.resultsSection}>
      {!data || data.results.length === 0 ? (
        <div className={styles.noResults}>
          <p>Персонажи не найдены</p>
        </div>
      ) : (
        <>
          <div className={styles.resultsInfo}>
            <p>
              Найдено {data.info.count} персонажей
              {data.info.pages > 1 &&
                ` (страница ${currentPage} из ${data.info.pages})`}
            </p>
          </div>
          <div className={styles.listCards}>
            {data.results.map((character) => {
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
            totalPages={data.info.pages}
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
