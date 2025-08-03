import { describe, expect, it, beforeEach } from 'vitest';
import { act } from '@testing-library/react';
import { useCharacterSelectionStore } from './useCharacterSelectionStore';
import { Character } from '../features/list_cards/ListCards';

const initialState = useCharacterSelectionStore.getState();
describe('useCharacterSelectionStore', () => {
  beforeEach(() => {
    useCharacterSelectionStore.setState(initialState);
  });
  it('must have a valid initial state (empty array', () => {
    const { selectedCharacters } = useCharacterSelectionStore.getState();
    expect(selectedCharacters).toEqual([]);
  });
  it('must add character if not selected', () => {
    const character: Character = { id: 1, name: 'Rick Sanchez' } as Character;
    act(() => {
      useCharacterSelectionStore.getState().toggleCharacter(character);
    });
    const { selectedCharacters } = useCharacterSelectionStore.getState();
    expect(selectedCharacters).toHaveLength(1);
    expect(selectedCharacters[0]).toEqual(character);
  });
  it('should delete the character if it was already selected', () => {
    const character: Character = { id: 1, name: 'Rick Sanchez' } as Character;
    act(() => {
      useCharacterSelectionStore.getState().toggleCharacter(character);
    });
    expect(
      useCharacterSelectionStore.getState().selectedCharacters
    ).toHaveLength(1);
    act(() => {
      useCharacterSelectionStore.getState().toggleCharacter(character);
    });
    expect(
      useCharacterSelectionStore.getState().selectedCharacters
    ).toHaveLength(0);
  });
  it('should clear the entire list of selected characters', () => {
    const character1: Character = { id: 1, name: 'Rick' } as Character;
    const character2: Character = { id: 2, name: 'Morty' } as Character;
    act(() => {
      useCharacterSelectionStore.getState().toggleCharacter(character1);
      useCharacterSelectionStore.getState().toggleCharacter(character2);
    });
    expect(
      useCharacterSelectionStore.getState().selectedCharacters
    ).toHaveLength(2);
    act(() => {
      useCharacterSelectionStore.getState().clearSelection();
    });
    expect(useCharacterSelectionStore.getState().selectedCharacters).toEqual(
      []
    );
  });
});
