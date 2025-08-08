import type { ApiResponse } from '../features/list_cards/ListCards';

const API_BASE_URL = 'https://rickandmortyapi.com/api/character';
export const fetchCharacters = async (
  page: number,
  searchTerm: string
): Promise<ApiResponse> => {
  const params = new URLSearchParams({ page: String(page) });
  if (searchTerm.trim()) {
    params.append('name', searchTerm.trim());
  }
  const response = await fetch(`${API_BASE_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(
      `Network response was not ok: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
};
