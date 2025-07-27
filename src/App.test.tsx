import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import App from './App';

vi.mock('./components', () => ({
  Header: ({ title }: { title: string }) => (
    <header data-testid="header">{title}</header>
  ),
  Main: ({ children }: { children: React.ReactNode }) => (
    <main data-testid="main">{children}</main>
  ),
  Footer: () => <footer data-testid="footer">Footer</footer>,
  CharactersPage: () => (
    <div data-testid="characters-page">
      <div data-testid="search-cards">
        <button>Search</button>
      </div>
      <div data-testid="list-cards">
        <div data-testid="search-term"></div>
        <div data-testid="current-page">1</div>
        <button>Next Page</button>
      </div>
      <button>Тестировать Error Boundary</button>
    </div>
  ),
  NotFound: () => <div data-testid="not-found">Not Found</div>,
  About: () => <div data-testid="about">About</div>,
}));

vi.mock('./components/ErrorBoundary/ErrorBoundary', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="error-boundary">{children}</div>
  ),
}));

vi.mock('./features/search/SearchCards', () => ({
  default: ({ onSearch }: { onSearch: (term: string) => void }) => {
    return (
      <div data-testid="search-cards">
        <button onClick={() => onSearch('test search')}>Search</button>
      </div>
    );
  },
}));

vi.mock('./features/list_cards/ListCards', () => ({
  default: ({
    searchTerm,
    currentPage,
    onPageChange,
  }: {
    searchTerm: string;
    currentPage: number;
    onPageChange: (page: number) => void;
  }) => {
    return (
      <div data-testid="list-cards">
        <div data-testid="search-term">{searchTerm}</div>
        <div data-testid="current-page">{currentPage}</div>
        <button onClick={() => onPageChange(2)}>Next Page</button>
      </div>
    );
  },
}));

describe('App Component Integration Tests', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe('Initial Render', () => {
    it('should render all main components on mount', () => {
      render(<App />);

      expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('main')).toBeInTheDocument();
      expect(screen.getByTestId('search-cards')).toBeInTheDocument();
      expect(screen.getByTestId('list-cards')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('should initialize with empty search term and page 1', () => {
      render(<App />);

      expect(screen.getByTestId('search-term')).toHaveTextContent('');
      expect(screen.getByTestId('current-page')).toHaveTextContent('1');
    });

    it('should display correct header title', () => {
      render(<App />);

      expect(screen.getByTestId('header')).toHaveTextContent(
        'Rick and Morty API'
      );
    });
  });

  describe('Search Functionality', () => {
    it('should update search term when search is performed', () => {
      render(<App />);

      const searchButton = screen.getByRole('button', { name: /search/i });
      fireEvent.click(searchButton);

      expect(screen.getByTestId('search-term')).toHaveTextContent(
        'test search'
      );
    });

    it('should reset page to 1 when new search is performed', () => {
      render(<App />);

      const nextPageButton = screen.getByRole('button', { name: /next page/i });
      fireEvent.click(nextPageButton);
      expect(screen.getByTestId('current-page')).toHaveTextContent('2');

      const searchButton = screen.getByRole('button', { name: /search/i });
      fireEvent.click(searchButton);

      expect(screen.getByTestId('current-page')).toHaveTextContent('1');
    });
  });

  describe('Pagination Functionality', () => {
    it('should update current page when page change is triggered', () => {
      render(<App />);

      const nextPageButton = screen.getByRole('button', { name: /next page/i });
      fireEvent.click(nextPageButton);

      expect(screen.getByTestId('current-page')).toHaveTextContent('2');
    });

    it('should maintain search term when page changes', () => {
      render(<App />);

      const searchButton = screen.getByRole('button', { name: /search/i });
      fireEvent.click(searchButton);
      expect(screen.getByTestId('search-term')).toHaveTextContent(
        'test search'
      );

      const nextPageButton = screen.getByRole('button', { name: /next page/i });
      fireEvent.click(nextPageButton);

      expect(screen.getByTestId('search-term')).toHaveTextContent(
        'test search'
      );
      expect(screen.getByTestId('current-page')).toHaveTextContent('2');
    });
  });

  describe('Error Boundary Testing', () => {
    it('should render error boundary test button', () => {
      render(<App />);

      const errorButton = screen.getByRole('button', {
        name: /тестировать error boundary/i,
      });
      expect(errorButton).toBeInTheDocument();
    });
  });

  describe('State Management', () => {
    it('should manage component state correctly', () => {
      render(<App />);

      expect(screen.getByTestId('search-term')).toHaveTextContent('');
      expect(screen.getByTestId('current-page')).toHaveTextContent('1');

      const searchButton = screen.getByRole('button', { name: /search/i });
      fireEvent.click(searchButton);

      expect(screen.getByTestId('search-term')).toHaveTextContent(
        'test search'
      );
      expect(screen.getByTestId('current-page')).toHaveTextContent('1');

      const nextPageButton = screen.getByRole('button', { name: /next page/i });
      fireEvent.click(nextPageButton);

      expect(screen.getByTestId('search-term')).toHaveTextContent(
        'test search'
      );
      expect(screen.getByTestId('current-page')).toHaveTextContent('2');
    });
  });
});
