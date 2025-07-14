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
    this.setState({
      searchTerm,
      currentPage: 1,
    });
  };

  handlePageChange = (page: number) => {
    this.setState({ currentPage: page });
  };

  throwError = () => {
    throw new Error('Тестовая ошибка для проверки Error Boundary');
  };

  render() {
    const { searchTerm, currentPage } = this.state;

    return (
      <ErrorBoundary>
        <Header title="Rick and Morty API" />
        <Main>
          <SearchCards onSearch={this.handleSearch} />

          <div className="error_test">
            <button onClick={this.throwError} className="error_test">
              Тестировать Error Boundary
            </button>
          </div>
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
