import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { get, set, del } from 'idb-keyval';

const idbStorage = {
  getItem: async (name) => await get(name),
  setItem: async (name, value) => await set(name, value),
  removeItem: async (name) => await del(name),
};

export const useSubmissionsStore = create(
  persist(
    (set) => ({
      submissions: [],
      setSubmissions: (submissions) => set({ submissions }),
      clearSubmissions: () => set({ submissions: [] }),
      queuedSubmissions: [],
      setQueuedSubmissions: (queuedSubmissions) => set({ queuedSubmissions }),
      clearQueuedSubmissions: () => set({ queuedSubmissions: [] }),
    }),
    {
      name: 'submissions-store',
      getStorage: () => idbStorage,
    }
  )
);
