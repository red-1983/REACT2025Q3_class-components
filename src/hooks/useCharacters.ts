import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../const/queryKeys';
import { fetchCharacters } from '../api/charactersApi';

export const useCharacters = (page: number, searchTerm: string) => {
  return useQuery({
    queryKey: queryKeys.characters.list(page, searchTerm),
    queryFn: () => fetchCharacters(page, searchTerm),
    placeholderData: (previousData) => previousData,
  });
};
