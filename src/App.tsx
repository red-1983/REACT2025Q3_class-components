import { Component } from 'react';
import { Header, Main, Footer } from './components';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import SearchCards from './features/search/SearchCards';
import ListCards from './features/list_cards/ListCards';
import './App.css';

interface AppState {
  searchTerm: string;
}

class App extends Component<Record<string, never>, AppState> {
  constructor(props: Record<string, never>) {
    super(props);
    this.state = {
      searchTerm: '',
    };
  }

  handleSearch = (searchTerm: string) => {
    this.setState({ searchTerm });
  };

  throwError = () => {
    throw new Error('Тестовая ошибка для проверки Error Boundary');
  };

  render() {
    const { searchTerm } = this.state;

    return (
      <ErrorBoundary>
        <Header title="Rick and Morty API" />
        <Main>
          <SearchCards onSearch={this.handleSearch} />

          <div className="error_test">
            <button className="error_button" onClick={this.throwError}>
              Тестировать Error Boundary
            </button>
          </div>

          <ListCards searchTerm={searchTerm} />
        </Main>
        <Footer />
      </ErrorBoundary>
    );
  }
}

export default App;
