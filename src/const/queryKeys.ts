export const queryKeys = {
  characters: {
    all: ['characters'] as const,
    lists: () => [...queryKeys.characters.all, 'list'] as const,
    list: (page: number, searchTerm: string) =>
      [...queryKeys.characters.lists(), { page, searchTerm }] as const,
    details: () => [...queryKeys.characters.all, 'details'] as const,
    detail: (id: number) => [...queryKeys.characters.details(), id] as const,
  },
};
