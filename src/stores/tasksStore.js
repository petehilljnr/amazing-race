import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useTasksStore = create(
  persist(
    (set) => ({
      tasks: [],
      setTasks: (tasks) => set({ tasks }),
      clearTasks: () => set({ tasks: [] }),
    }),
    {
      name: 'tasks-store',
      getStorage: () => localStorage,
    }
  )
);
