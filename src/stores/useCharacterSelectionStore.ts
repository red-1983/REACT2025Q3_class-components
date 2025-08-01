import { create } from 'zustand';
import { Character } from '../features/list_cards/ListCards';

interface CharacterSelectionState {
  selectedCharacters: Character[];
  toggleCharacter: (character: Character) => void;
  clearSelection: () => void;
}

export const useCharacterSelectionStore = create<CharacterSelectionState>(
  (set) => ({
    selectedCharacters: [],
    toggleCharacter: (character) =>
      set((state) => {
        const isSelected = state.selectedCharacters.some(
          (elem) => elem.id === character.id
        );
        if (isSelected) {
          return {
            selectedCharacters: state.selectedCharacters.filter(
              (elem) => elem.id !== character.id
            ),
          };
        } else {
          return {
            selectedCharacters: [...state.selectedCharacters, character],
          };
        }
      }),
    clearSelection: () => set({ selectedCharacters: [] }),
  })
);
