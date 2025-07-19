import { render, screen } from '@testing-library/react';
import ListCards from './ListCards';
import { describe, expect, it, vi, beforeEach } from 'vitest';

const mockApiResponse = {
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

describe('ListCards', () => {
  const mockOnPageChange = vi.fn();
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('shows loading state while fetching data', async () => {
    mockFetch.mockReturnValue(new Promise(() => {}));
    render(
      <ListCards
        searchTerm=""
        currentPage={1}
        onPageChange={mockOnPageChange}
      />
    );
    expect(screen.getByText('Загрузка...')).toBeInTheDocument();
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
      />
    );
    const characterHeadings = await screen.findAllByRole('heading', {
      level: 3,
    });
    expect(characterHeadings).toHaveLength(mockApiResponse.results.length);
    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText('Morty Smith')).toBeInTheDocument();
    expect(
      screen.getByText(`Найдено ${mockApiResponse.info.count} персонажей`)
    ).toBeInTheDocument();
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
      />
    );
    expect(await screen.findByText('Персонажи не найдены')).toBeInTheDocument();
  });
  it('displays an error message when the API call fails (code: 404)', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 404,
    });
    render(
      <ListCards
        searchTerm="unknown"
        currentPage={1}
        onPageChange={mockOnPageChange}
      />
    );
    const errorMessage = await screen.findByText(
      'Персонажи не найдены. Попробуйте другой поисковый запрос.'
    );
    expect(errorMessage).toBeInTheDocument();
  });
  it('should print an error message when an API call fails', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));
    render(
      <ListCards
        searchTerm="unknown"
        currentPage={1}
        onPageChange={mockOnPageChange}
      />
    );
    const errorMessage = await screen.findByText('Ошибка сети: Network error');
    expect(errorMessage).toBeInTheDocument();
  });
});
