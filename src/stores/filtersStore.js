import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useFiltersStore = create(
  persist(
    (set) => ({
      selectedStatuses: ["pending", "waiting", "none", "correct", "wrong"],
      showOnlyFaves: false,
      setSelectedStatuses: (statuses) => set({ selectedStatuses: statuses }),
      setShowOnlyFaves: (show) => set({ showOnlyFaves: show }),
      resetFilters: () =>
        set({
          selectedStatuses: ["pending", "waiting", "none", "correct", "wrong"],
          showOnlyFaves: false,
        }),
    }),
    {
      name: "filters-storage", // key in localStorage
    }
  )
);