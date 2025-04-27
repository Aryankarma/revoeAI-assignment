export interface TableDashboard {
  id: string;
  name: string;
  googleSheetUrl: string;
  columnCount: number;
  updatedAt: string;
}

export interface Table {
  id: string;
  name: string;
  description: string;
  googleSheetUrl: string;
  columns: Column[];
  rows: Row[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface TableDetails {
  id: string;
  name: string;
  googleSheetUrl: string;
  column: Column[];
  row: Row[];
  updatedAt: string;
}

export interface TableData {
  rows: Record<string, any>[];
  lastUpdated: string;
}

export interface SheetData {
  values: string[][];
}

export interface Column {
  name: string;
  type: string;
}

export type Row = Record<string, string>;

export type DashboardConfigType = {
  success: boolean;
  isPro: boolean;
  userData: {
    name: string;
    email: string;
    currentPlan: string;
  };
};
