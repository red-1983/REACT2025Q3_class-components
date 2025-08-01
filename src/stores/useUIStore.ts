import { create } from 'zustand';
import { persist } from 'zustand/middleware';
interface UIstore {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}
export const useUIStore = create<UIstore>()(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
    }),
    { name: 'ui-theme-storage' }
  )
);
