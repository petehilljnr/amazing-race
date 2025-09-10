import { create } from 'zustand';

export const useUserStore = create((set) => ({
  user: null,
  teamId: null,
  teamName: null,
  setUser: (user) => set({ user }),
  setTeamId: (teamId) => set({ teamId }),
  setTeamName: (teamName) => set({ teamName }),
  clearUser: () => set({ user: null, teamId: null, teamName: null }),
  isAuthenticated: () => !!useUserStore.getState().user,
}));
