import { Component } from 'react';
import { Header, Main, Footer } from './components';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import SearchCards from './features/search/SearchCards';
import ListCards from './features/list_cards/ListCards';
import './App.css';

interface AppState {
  searchTerm: string;
  currentPage: number;
}

class App extends Component<Record<string, never>, AppState> {
  constructor(props: Record<string, never>) {
    super(props);
    this.state = {
      searchTerm: '',
      currentPage: 1,
    };
  }

  handleSearch = (searchTerm: string) => {
    // При новом поиске сбрасываем на первую страницу
    this.setState({
      searchTerm,
      currentPage: 1,
    });
  };

  handlePageChange = (page: number) => {
    this.setState({ currentPage: page });
  };

  // Функция для тестирования Error Boundary
  throwError = () => {
    throw new Error('Тестовая ошибка для проверки Error Boundary');
  };

  render() {
    const { searchTerm, currentPage } = this.state;

    return (
      <ErrorBoundary>
        <Header title="Rick and Morty Characters" />
        <Main>
          {/* Верхняя секция с поиском */}
          <SearchCards onSearch={this.handleSearch} />

          {/* Кнопка для тестирования ошибок */}
          <div
            style={{
              textAlign: 'center',
              padding: '10px',
              borderBottom: '1px solid #e0e0e0',
              marginBottom: '20px',
            }}
          >
            <button
              onClick={this.throwError}
              style={{
                backgroundColor: '#ff4444',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Тестировать Error Boundary
            </button>
          </div>

          {/* Нижняя секция с результатами */}
          <ListCards
            searchTerm={searchTerm}
            currentPage={currentPage}
            onPageChange={this.handlePageChange}
          />
        </Main>
        <Footer />
      </ErrorBoundary>
    );
  }
}

export default App;
