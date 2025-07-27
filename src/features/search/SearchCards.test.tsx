import { render, screen } from '@testing-library/react';
import SearchCards from './SearchCards';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';

describe('SearchCards', () => {
  const mockOnSearch = vi.fn<(serchTerm: string) => void>();

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });
  it('should render the search input and search button', () => {
    render(<SearchCards onSearch={mockOnSearch} />);
    expect(
      screen.getByPlaceholderText('Поиск персонажей...')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /поиск/i })).toBeInTheDocument();
  });
  it('should call onSearch with the correct term when user searches', async () => {
    const user = userEvent.setup();
    render(<SearchCards onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText('Поиск персонажей...');
    const searchButton = screen.getByRole('button', { name: 'Поиск' });
    await user.type(input, 'Rick');
    await user.click(searchButton);
    expect(mockOnSearch).toHaveBeenCalledWith('Rick');
  });
  it('should show an empty input when no saved term exists', () => {
    render(<SearchCards onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText(
      'Поиск персонажей...'
    ) as HTMLInputElement;
    expect(input.value).toBe('');
  });
  it('should display previously saved search term from localStorage on mount', () => {
    const savedSearchTerm = 'Rick';
    localStorage.setItem('searchTerm', savedSearchTerm);
    render(<SearchCards onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText(
      'Поиск персонажей...'
    ) as HTMLInputElement;
    expect(input.value).toBe(savedSearchTerm);
  });
  it('should update input value when user types', async () => {
    const user = userEvent.setup();
    render(<SearchCards onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText(
      'Поиск персонажей...'
    ) as HTMLInputElement;
    await user.type(input, 'Rick');
    expect(input.value).toBe('Rick');
  });
  it('should save search term to localStorage when search button is clicked', async () => {
    const user = userEvent.setup();
    render(<SearchCards onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText(
      'Поиск персонажей...'
    ) as HTMLInputElement;
    const searchButton = screen.getByRole('button', { name: 'Поиск' });
    await user.type(input, 'Rick');
    await user.click(searchButton);
    expect(localStorage.getItem('searchTerm')).toBe('Rick');
  });
  it('should remove spaces from search query before saving', async () => {
    const user = userEvent.setup();
    render(<SearchCards onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText(
      'Поиск персонажей...'
    ) as HTMLInputElement;
    const searchButton = screen.getByRole('button', { name: 'Поиск' });
    await user.type(input, '  Rick ');
    await user.click(searchButton);
    expect(localStorage.getItem('searchTerm')).toBe('Rick');
  });
  it('should trigger search callback with correct parameters', async () => {
    const user = userEvent.setup();
    render(<SearchCards onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText('Поиск персонажей...');
    const searchButton = screen.getByRole('button', { name: 'Поиск' });
    await user.type(input, 'Rick');
    await user.click(searchButton);
    expect(mockOnSearch).toHaveBeenCalledWith('Rick');
    expect(localStorage.getItem('searchTerm')).toBe('Rick');
  });
  it('should overwrite existing localStorage value when a new search is performed', async () => {
    localStorage.setItem('searchTerm', 'Rick');
    const user = userEvent.setup();
    render(<SearchCards onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText(
      'Поиск персонажей...'
    ) as HTMLInputElement;
    const searchButton = screen.getByRole('button', { name: 'Поиск' });
    expect(input.value).toBe('Rick');
    await user.clear(input);
    await user.type(input, 'Morty');
    await user.click(searchButton);
    expect(localStorage.getItem('searchTerm')).toBe('Morty');
  });
  it('should trigger search when Enter key is pressed', async () => {
    const user = userEvent.setup();
    render(<SearchCards onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText(
      'Поиск персонажей...'
    ) as HTMLInputElement;
    await user.type(input, 'Morty');
    await user.keyboard('{Enter}');
    expect(mockOnSearch).toHaveBeenCalledWith('Morty');
    expect(localStorage.getItem('searchTerm')).toBe('Morty');
  });
});
