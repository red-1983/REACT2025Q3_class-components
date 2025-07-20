import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ListCards from './ListCards';
import type { ApiResponse } from './ListCards';

vi.mock('./card/Card', () => ({
  default: ({ name, description }: { name: string; description: string }) => (
    <div data-testid="card">
      <div data-testid="card-name">{name}</div>
      <div data-testid="card-description">{description}</div>
    </div>
  ),
}));

vi.mock('../../components/Spinner/Spinner', () => ({
  default: () => <div data-testid="spinner">Loading...</div>,
}));

vi.mock('../../components/Pagination/Pagination', () => ({
  default: ({
    currentPage,
    totalPages,
    onPageChange,
  }: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  }) => (
    <div data-testid="pagination">
      <span data-testid="current-page">{currentPage}</span>
      <span data-testid="total-pages">{totalPages}</span>
      <button onClick={() => onPageChange(currentPage + 1)}>Next</button>
    </div>
  ),
}));

describe('ListCards API Integration Tests', () => {
  const mockOnPageChange = vi.fn();
  const mockFetch = vi.fn();

  beforeEach(() => {
    globalThis.fetch = mockFetch;
    mockOnPageChange.mockClear();
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const mockApiResponse: ApiResponse = {
    results: [
      {
        id: 1,
        name: 'Rick Sanchez',
        image: 'https://example.com/rick.jpg',
        species: 'Human',
        status: 'Alive',
      },
      {
        id: 2,
        name: 'Morty Smith',
        image: 'https://example.com/morty.jpg',
        species: 'Human',
        status: 'Alive',
      },
    ],
    info: {
      count: 826,
      pages: 42,
      next: 'https://rickandmortyapi.com/api/character/?page=2',
      prev: null,
    },
  };

  describe('API calls with correct parameters', () => {
    it('should call API with correct URL on initial mount', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      });

      render(
        <ListCards
          searchTerm=""
          currentPage={1}
          onPageChange={mockOnPageChange}
        />
      );

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          'https://rickandmortyapi.com/api/character?page=1'
        );
      });
    });

    it('should call API with search term when provided', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      });

      render(
        <ListCards
          searchTerm="rick"
          currentPage={1}
          onPageChange={mockOnPageChange}
        />
      );

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          'https://rickandmortyapi.com/api/character?page=1&name=rick'
        );
      });
    });

    it('should call API with correct page parameter', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      });

      render(
        <ListCards
          searchTerm=""
          currentPage={3}
          onPageChange={mockOnPageChange}
        />
      );

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          'https://rickandmortyapi.com/api/character?page=3'
        );
      });
    });
  });

  describe('Successful API responses', () => {
    it('should handle successful API response and display characters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      });

      render(
        <ListCards
          searchTerm=""
          currentPage={1}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByTestId('spinner')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getAllByTestId('card-name')).toHaveLength(2);
      });

      expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
      expect(screen.getByText('Morty Smith')).toBeInTheDocument();
      expect(screen.getAllByTestId('card')).toHaveLength(2);
    });

    it('should update component state based on API response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      });

      render(
        <ListCards
          searchTerm=""
          currentPage={1}
          onPageChange={mockOnPageChange}
        />
      );

      await waitFor(() => {
        expect(screen.getByTestId('pagination')).toBeInTheDocument();
      });

      expect(screen.getByTestId('current-page')).toHaveTextContent('1');
      expect(screen.getByTestId('total-pages')).toHaveTextContent('42');
    });
  });

  describe('API error responses', () => {
    it('should handle 404 error (no search results)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      render(
        <ListCards
          searchTerm="nonexistent"
          currentPage={1}
          onPageChange={mockOnPageChange}
        />
      );

      await waitFor(() => {
        expect(
          screen.getByText(
            'Персонажи не найдены. Попробуйте другой поисковый запрос.'
          )
        ).toBeInTheDocument();
      });
    });
    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network Error'));

      render(
        <ListCards
          searchTerm=""
          currentPage={1}
          onPageChange={mockOnPageChange}
        />
      );

      await waitFor(() => {
        expect(
          screen.getByText('Ошибка сети: Network Error')
        ).toBeInTheDocument();
      });
    });

    it('should handle unknown errors', async () => {
      mockFetch.mockRejectedValueOnce('Unknown error');

      render(
        <ListCards
          searchTerm=""
          currentPage={1}
          onPageChange={mockOnPageChange}
        />
      );

      await waitFor(() => {
        expect(
          screen.getByText('Ошибка сети: Неизвестная ошибка')
        ).toBeInTheDocument();
      });
    });
  });

  describe('Loading states', () => {
    it('should show loading spinner during API call', async () => {
      let resolvePromise: ((value: unknown) => void) | undefined;
      const pendingPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      mockFetch.mockReturnValueOnce(pendingPromise);

      render(
        <ListCards
          searchTerm=""
          currentPage={1}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByTestId('spinner')).toBeInTheDocument();

      if (resolvePromise) {
        resolvePromise({
          ok: true,
          json: () => Promise.resolve(mockApiResponse),
        });
      }

      await waitFor(() => {
        expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
      });
    });
  });

  describe('Component updates', () => {
    it('should make new API call when searchTerm changes', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      });

      const { rerender } = render(
        <ListCards
          searchTerm=""
          currentPage={1}
          onPageChange={mockOnPageChange}
        />
      );

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(1);
      });

      rerender(
        <ListCards
          searchTerm="rick"
          currentPage={1}
          onPageChange={mockOnPageChange}
        />
      );

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(2);
        expect(mockFetch).toHaveBeenLastCalledWith(
          'https://rickandmortyapi.com/api/character?page=1&name=rick'
        );
      });
    });
  });
});
