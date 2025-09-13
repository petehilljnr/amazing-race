import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSubmissionsStore = create(
  persist(
    (set) => ({
      submissions: [],
      setSubmissions: (submissions) => set({ submissions }),
      clearSubmissions: () => set({ submissions: [] })
    }),
    {
      name: 'submissions-store', // Default storage (localStorage)
    }
  )
);