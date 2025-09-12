import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Dexie from 'dexie';

// Create Dexie database
const db = new Dexie('AmazingRaceDB');
db.version(1).stores({
  submissions: '++id',
  queuedSubmissions: '++id',
});

const dexieStorage = {
  getItem: async (name) => {
    if (name === 'submissions') {
      return await db.submissions.toArray();
    }
    if (name === 'queuedSubmissions') {
      return await db.queuedSubmissions.toArray();
    }
    return null;
  },
  setItem: async (name, value) => {
    if (name === 'submissions') {
      await db.submissions.clear();
      await db.submissions.bulkAdd(value);
    }
    if (name === 'queuedSubmissions') {
      await db.queuedSubmissions.clear();
      await db.queuedSubmissions.bulkAdd(value);
    }
  },
  removeItem: async (name) => {
    if (name === 'submissions') {
      await db.submissions.clear();
    }
    if (name === 'queuedSubmissions') {
      await db.queuedSubmissions.clear();
    }
  },
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
      getStorage: () => dexieStorage,
    }
  )
);
