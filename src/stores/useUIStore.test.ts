import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { act } from '@testing-library/react';
import { useUIStore } from './useUIStore';

const initialState = useUIStore.getState();

describe('useUIStore', () => {
  beforeEach(() => {
    act(() => {
      useUIStore.setState(initialState, true);
    });
    localStorage.clear();
  });
  afterEach(() => {
    localStorage.clear();
  });
  it('must have a correct initial state (theme "light")', () => {
    const { theme } = useUIStore.getState();
    expect(theme).toBe('light');
  });
  it('should switch theme from "light" to "dark"', () => {
    expect(useUIStore.getState().theme).toBe('light');
    act(() => {
      useUIStore.getState().toggleTheme();
    });
    expect(useUIStore.getState().theme).toBe('dark');
  });
  it('should switch theme from "dark" back to "light"', () => {
    act(() => {
      useUIStore.setState({ theme: 'dark' });
    });
    expect(useUIStore.getState().theme).toBe('dark');
    act(() => {
      useUIStore.getState().toggleTheme();
    });
    expect(useUIStore.getState().theme).toBe('light');
  });
  it('should save the modified theme in localStorage', () => {
    act(() => {
      useUIStore.getState().toggleTheme();
    });
    const storedItem = localStorage.getItem('ui-theme-storage');
    expect(storedItem).not.toBeNull();
    if (storedItem) {
      const parsedState = JSON.parse(storedItem);
      expect(parsedState.state.theme).toBe('dark');
    }
  });
});
