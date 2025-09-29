import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useFavouritesStore = create(
  persist(
    (set, get) => ({
      faves: [],
      setFaves: (faves) => set({ faves }),
      clearFaves: () => set({ faves: [] }),
      addFave: (fave) => set({ faves: [...get().faves, fave] }),
      removeFave: (userId, taskId) =>
        set({
          faves: get().faves.filter(
            (f) => !(f.userId === userId && f.taskId === taskId)
          ),
        }),
    }),
    {
      name: 'favourites-store',
      getStorage: () => localStorage,
    }
  )
);
