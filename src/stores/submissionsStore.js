import { create } from 'zustand';

export const useSubmissionsStore = create((set) => ({
  submissions: [],
  setSubmissions: (submissions) => set({ submissions }),
  clearSubmissions: () => set({ submissions: [] }),
}));
