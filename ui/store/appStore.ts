// useLandingPageStore.ts
import { create } from "zustand";
import { DashboardConfigType, TableDashboard } from "@/lib/types";

interface LandingPageState {
  razorpayLoaded: boolean;
  setRazorpayLoaded: (loaded: boolean) => void;
  year: number | null;
  setYear: (year: number) => void;
}

interface DashboardConfigType2 {
  dashboardConfig: DashboardConfigType | null;
  setDashboardConfig: (dashboardConfig: DashboardConfigType) => void;
}

interface TableManagerType {
  tables: TableDashboard[];
  setTables: (tables: TableDashboard[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  refreshing: boolean;
  setRefreshing: (refreshing: boolean) => void;
  deletedTableID: string[];
  setDeletedTableID: (id: string) => void;
}

export const useLandingPageStore = create<LandingPageState>((set) => ({
  razorpayLoaded: false,
  setRazorpayLoaded: (loaded) => set({ razorpayLoaded: loaded }),
  year: null,
  setYear: (year) => set({ year }),
}));

export const useDashboardConfig = create<DashboardConfigType2>((set) => ({
  dashboardConfig: null,
  setDashboardConfig: (dashboardConfig) => set({ dashboardConfig }),
}));

export const useTableManager = create<TableManagerType>((set) => ({
  tables: [],
  setTables: (tables) => {
    set({ tables });
  },
  loading: true,
  setLoading: (loading) => set({ loading }),
  refreshing: false,
  setRefreshing: (refreshing) => set({ refreshing }),
  deletedTableID: [],
  setDeletedTableID: (id) =>
    set((state) => ({
      deletedTableID: [...state.deletedTableID, id],
    })),
}));
