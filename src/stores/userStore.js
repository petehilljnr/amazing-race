import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      teamId: null,
      teamName: null,
      setUser: (user) => set({ user }),
      setTeamId: (teamId) => set({ teamId }),
      setTeamName: (teamName) => set({ teamName }),
      clearUser: () => set({ user: null, teamId: null, teamName: null }),
      isAuthenticated: () => !!useUserStore.getState().user,
    }),
    {
      name: 'user-store', // name of item in storage
      getStorage: () => localStorage,
    }
  )
);
