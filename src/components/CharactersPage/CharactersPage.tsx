import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SearchCards from '../../features/search/SearchCards';
import ListCards from '../../features/list_cards/ListCards';
import CharacterDetail from '../CharacterDetail/CharacterDetail';
import styles from './CharactersPage.module.css';
import ErrorDisplay from '../ErrorBoundary/ErrorDisplay';
const CharactersPage = () => {
  const navigate = useNavigate();
  const { page, characterId } = useParams<{
    page?: string;
    characterId?: string;
  }>();

  const [searchTerm, setSearchTerm] = useState(
    () => localStorage.getItem('searchTerm') || ''
  );
  const [testError, setTestError] = useState<string | null>(null);
  const currentPage = page ? parseInt(page, 10) : 1;
  const detailId = characterId ? parseInt(characterId, 10) : null;

  const handleSearch = useCallback(
    (newSearchTerm: string) => {
      setSearchTerm(newSearchTerm);
      navigate('/1');
    },
    [navigate]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (detailId) {
        navigate(`/${newPage}/${detailId}`);
      } else {
        navigate(`/${newPage}`);
      }
    },
    [navigate, detailId]
  );

  const handleCharacterClick = useCallback(
    (id: number) => {
      navigate(`/${currentPage}/${id}`);
    },
    [navigate, currentPage]
  );

  const handleDetailClose = useCallback(() => {
    navigate(`/${currentPage}`);
  }, [navigate, currentPage]);
  const handleTriggerTestError = () => {
    setTestError('Это тестовая ошибка для проверки UI.');
  };

  const handleCloseTestError = () => {
    setTestError(null);
  };
  return (
    <div>
      <SearchCards onSearch={handleSearch} />
      <div className={styles.testErrorContainer}>
        <button
          onClick={handleTriggerTestError}
          className={styles.testErrorButton}
        >
          Тестировать UI Ошибок
        </button>
      </div>
      <div className={styles.container}>
        <div className={styles.listSection}>
          <ListCards
            searchTerm={searchTerm}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            onCharacterClick={handleCharacterClick}
          />
        </div>
        {detailId && (
          <CharacterDetail characterId={detailId} onClose={handleDetailClose} />
        )}
      </div>
      {testError && (
        <ErrorDisplay message={testError} onClose={handleCloseTestError} />
      )}
    </div>
  );
};

export default CharactersPage;
