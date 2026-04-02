export type TransactionType = "income" | "expense";

export type TransactionCategory =
  | "Salary"
  | "Freelance"
  | "Investment"
  | "Food & Dining"
  | "Transport"
  | "Shopping"
  | "Entertainment"
  | "Health"
  | "Utilities"
  | "Housing"
  | "Education"
  | "Travel"
  | "Other";

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: TransactionCategory;
  type: TransactionType;
  description: string;
  merchant: string;
}

export type Role = "admin" | "viewer";

export type SortField = "date" | "amount" | "category" | "merchant";
export type SortDirection = "asc" | "desc";
export type FilterType = "all" | "income" | "expense";

export interface FiltersState {
  search: string;
  type: FilterType;
  category: TransactionCategory | "all";
  sortField: SortField;
  sortDirection: SortDirection;
  dateRange: { from: string; to: string };
}

export interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  balance: number;
}

export interface CategoryData {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}
