import type {
  Transaction,
  MonthlyData,
  CategoryData,
} from "../types/interface";
import { CATEGORY_COLORS } from "../data/mockdata";

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getMonthlyData(transactions: Transaction[]): MonthlyData[] {
  const months: Record<string, { income: number; expenses: number }> = {};

  transactions.forEach((t) => {
    const month = t.date.substring(0, 7); // "2024-01"
    if (!months[month]) months[month] = { income: 0, expenses: 0 };
    if (t.type === "income") months[month].income += t.amount;
    else months[month].expenses += t.amount;
  });

  let runningBalance = 0;
  return Object.entries(months)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, data]) => {
      runningBalance += data.income - data.expenses;
      const date = new Date(month + "-01");
      return {
        month: date.toLocaleDateString("en-US", {
          month: "short",
          year: "2-digit",
        }),
        income: data.income,
        expenses: data.expenses,
        balance: runningBalance,
      };
    });
}

export function getCategoryBreakdown(
  transactions: Transaction[],
): CategoryData[] {
  const expenses = transactions.filter((t) => t.type === "expense");
  const total = expenses.reduce((sum, t) => sum + t.amount, 0);

  const categories: Record<string, number> = {};
  expenses.forEach((t) => {
    categories[t.category] = (categories[t.category] || 0) + t.amount;
  });

  return Object.entries(categories)
    .sort(([, a], [, b]) => b - a)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: total > 0 ? (amount / total) * 100 : 0,
      color: CATEGORY_COLORS[category] || "#94a3b8",
    }));
}

export function getTotals(transactions: Transaction[]) {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);
  return { income, expenses, balance: income - expenses };
}

export function filterAndSortTransactions(
  transactions: Transaction[],
  filters: {
    search: string;
    type: string;
    category: string;
    sortField: string;
    sortDirection: string;
    dateRange: { from: string; to: string };
  },
): Transaction[] {
  let result = [...transactions];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (t) =>
        t.description.toLowerCase().includes(q) ||
        t.merchant.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q),
    );
  }

  if (filters.type !== "all") {
    result = result.filter((t) => t.type === filters.type);
  }

  if (filters.category !== "all") {
    result = result.filter((t) => t.category === filters.category);
  }

  if (filters.dateRange.from) {
    result = result.filter((t) => t.date >= filters.dateRange.from);
  }
  if (filters.dateRange.to) {
    result = result.filter((t) => t.date <= filters.dateRange.to);
  }

  result.sort((a, b) => {
    let cmp = 0;
    if (filters.sortField === "date") cmp = a.date.localeCompare(b.date);
    else if (filters.sortField === "amount") cmp = a.amount - b.amount;
    else if (filters.sortField === "category")
      cmp = a.category.localeCompare(b.category);
    else if (filters.sortField === "merchant")
      cmp = a.merchant.localeCompare(b.merchant);
    return filters.sortDirection === "asc" ? cmp : -cmp;
  });

  return result;
}

export function generateId(): string {
  return (
    "t" + Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
  );
}
