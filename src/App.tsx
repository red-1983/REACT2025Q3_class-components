import { useState, useCallback } from 'react';
import { Header, Main, Footer } from './components';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import SearchCards from './features/search/SearchCards';
import ListCards from './features/list_cards/ListCards';
import './App.css';

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const handleSearch = useCallback((searchTerm: string) => {
    setSearchTerm(searchTerm);
    setCurrentPage(1);
  }, []);
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const throwError = () => {
    throw new Error('Тестовая ошибка для проверки Error Boundary');
  };
  return (
    <ErrorBoundary>
      <Header title="Rick and Morty API" />
      <Main>
        <SearchCards onSearch={handleSearch} />

        <div className="error_test">
          <button onClick={throwError} className="error_test">
            Тестировать Error Boundary
          </button>
        </div>
        <ListCards
          searchTerm={searchTerm}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </Main>
      <Footer />
    </ErrorBoundary>
  );
};

export default App;
