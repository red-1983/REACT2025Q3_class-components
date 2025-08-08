import { render, screen, waitFor } from '@testing-library/react';
import ListCards, { ApiResponse } from './ListCards';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('./card/Card', () => ({
  default: ({ name }: { name: string }) => (
    <h3 data-testid="card-name">{name}</h3>
  ),
}));

vi.mock('@/components/Spinner/Spinner', () => ({
  default: () => <div data-testid="spinner">Загрузка...</div>,
}));

const mockApiResponse: ApiResponse = {
  info: {
    count: 2,
    pages: 1,
    next: null,
    prev: null,
  },
  results: [
    {
      id: 1,
      name: 'Rick Sanchez',
      image: 'url1',
      species: 'Human',
      status: 'Alive',
    },
    {
      id: 2,
      name: 'Morty Smith',
      image: 'url2',
      species: 'Human',
      status: 'Alive',
    },
  ],
};

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('ListCards', () => {
  const mockOnPageChange = vi.fn();
  const mockOnCharacterClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockClear();
  });

  it('shows loading state while fetching data', async () => {
    mockFetch.mockImplementation(() => new Promise(() => {}));
    render(
      <ListCards
        searchTerm=""
        currentPage={1}
        onPageChange={mockOnPageChange}
        onCharacterClick={mockOnCharacterClick}
      />,
      { wrapper: TestWrapper }
    );
    expect(await screen.findByTestId('spinner')).toBeInTheDocument();
  });

  it('renders correct number of items when data is provided', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    });
    render(
      <ListCards
        searchTerm=""
        currentPage={1}
        onPageChange={mockOnPageChange}
        onCharacterClick={mockOnCharacterClick}
      />,
      { wrapper: TestWrapper }
    );

    await waitFor(() => {
      expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(
        mockApiResponse.results.length
      );
    });

    expect(await screen.findByText('Rick Sanchez')).toBeInTheDocument();
    expect(await screen.findByText('Morty Smith')).toBeInTheDocument();
    expect(await screen.findByText(/Найдено 2 персонажей/)).toBeInTheDocument();
  });

  it('displays "no results" message when data array is empty', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          info: { count: 0, pages: 1, next: null, prev: null },
          results: [],
        }),
    });

    render(
      <ListCards
        searchTerm="something"
        currentPage={1}
        onPageChange={mockOnPageChange}
        onCharacterClick={mockOnCharacterClick}
      />,
      { wrapper: TestWrapper }
    );

    expect(await screen.findByText('Персонажи не найдены')).toBeInTheDocument();
  });

  it('displays an error message when the API call fails (code: 404)', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    render(
      <ListCards
        searchTerm="unknown"
        currentPage={1}
        onPageChange={mockOnPageChange}
        onCharacterClick={mockOnCharacterClick}
      />,
      { wrapper: TestWrapper }
    );

    expect(
      await screen.findByText(
        'Персонажи не найдены. Попробуйте другой поисковый запрос.'
      )
    ).toBeInTheDocument();
  });

  it('should print an error message when an API call fails', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));
    render(
      <ListCards
        searchTerm="unknown"
        currentPage={1}
        onPageChange={mockOnPageChange}
        onCharacterClick={mockOnCharacterClick}
      />,
      { wrapper: TestWrapper }
    );

    expect(
      await screen.findByText('Ошибка сети: Network error')
    ).toBeInTheDocument();
  });
});
