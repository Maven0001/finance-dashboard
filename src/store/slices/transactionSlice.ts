import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  Transaction,
  FiltersState,
  TransactionCategory,
} from "../../types/interface";
import { mockTransactions } from "../../data/mockdata";

interface TransactionsState {
  items: Transaction[];
  filters: FiltersState;
}

const initialState: TransactionsState = {
  items: mockTransactions,
  filters: {
    search: "",
    type: "all",
    category: "all",
    sortField: "date",
    sortDirection: "desc",
    dateRange: { from: "", to: "" },
  },
};

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.items.unshift(action.payload);
    },
    updateTransaction: (state, action: PayloadAction<Transaction>) => {
      const idx = state.items.findIndex((t) => t.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
    },
    deleteTransaction: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((t) => t.id !== action.payload);
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
    },
    setTypeFilter: (state, action: PayloadAction<FiltersState["type"]>) => {
      state.filters.type = action.payload;
    },
    setCategoryFilter: (
      state,
      action: PayloadAction<TransactionCategory | "all">,
    ) => {
      state.filters.category = action.payload;
    },
    setSortField: (state, action: PayloadAction<FiltersState["sortField"]>) => {
      if (state.filters.sortField === action.payload) {
        state.filters.sortDirection =
          state.filters.sortDirection === "asc" ? "desc" : "asc";
      } else {
        state.filters.sortField = action.payload;
        state.filters.sortDirection = "desc";
      }
    },
    setDateRange: (
      state,
      action: PayloadAction<{ from: string; to: string }>,
    ) => {
      state.filters.dateRange = action.payload;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
});

export const {
  addTransaction,
  updateTransaction,
  deleteTransaction,
  setSearch,
  setTypeFilter,
  setCategoryFilter,
  setSortField,
  setDateRange,
  resetFilters,
} = transactionsSlice.actions;

export default transactionsSlice.reducer;
