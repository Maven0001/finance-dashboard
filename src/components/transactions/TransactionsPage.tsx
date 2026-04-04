import React, { useState } from "react";
import {
  Search,
  Plus,
  ChevronUp,
  ChevronDown,
  Filter,
  Edit2,
  Trash2,
  X,
  Download,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  setSearch,
  setTypeFilter,
  setCategoryFilter,
  setSortField,
  resetFilters,
  deleteTransaction,
} from "../../store/slices/transactionSlice";
import {
  filterAndSortTransactions,
  formatCurrency,
  formatDate,
} from "../../utils";
import type { Transaction, TransactionCategory } from "../../types/interface";
import { CATEGORY_COLORS } from "../../data/mockdata";
import TransactionModal from "../features/TransactionModal";
import clsx from "clsx";

const CATEGORIES: (TransactionCategory | "all")[] = [
  "all",
  "Salary",
  "Freelance",
  "Investment",
  "Food & Dining",
  "Transport",
  "Shopping",
  "Entertainment",
  "Health",
  "Utilities",
  "Housing",
  "Education",
  "Travel",
  "Other",
];

const TransactionsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const darkMode = useAppSelector((s) => s.app.darkMode);
  const role = useAppSelector((s) => s.app.role);
  const { items, filters } = useAppSelector((s) => s.transactions);
  const isAdmin = role === "admin";

  const [showModal, setShowModal] = useState(false);
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(
    null,
  );

  const filtered = filterAndSortTransactions(items, filters);

  const SortIcon = ({ field }: { field: string }) => {
    if (filters.sortField !== field)
      return <ChevronUp size={14} className="opacity-20" />;
    return filters.sortDirection === "asc" ? (
      <ChevronUp size={14} className="text-violet-500" />
    ) : (
      <ChevronDown size={14} className="text-violet-500" />
    );
  };

  const exportCSV = () => {
    const headers = [
      "Date",
      "Merchant",
      "Description",
      "Category",
      "Type",
      "Amount",
    ];
    const rows = filtered.map((t) => [
      t.date,
      t.merchant,
      t.description,
      t.category,
      t.type,
      t.amount,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
  };

  const baseInput = clsx(
    "px-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-colors",
    darkMode
      ? "bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-600"
      : "bg-white border-gray-200 text-gray-700 placeholder:text-gray-400",
  );

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2
            className={clsx(
              "text-xl font-bold",
              darkMode ? "text-gray-100" : "text-gray-800",
            )}
          >
            Transactions
          </h2>
          <p
            className={clsx(
              "text-sm mt-0.5",
              darkMode ? "text-gray-500" : "text-gray-400",
            )}
          >
            {filtered.length} of {items.length} transactions
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportCSV}
            className={clsx(
              "flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm border transition-all cursor-pointer",
              darkMode
                ? "border-gray-700 text-gray-400 hover:bg-gray-800"
                : "border-gray-200 text-gray-500 hover:bg-gray-50",
            )}
          >
            <Download size={15} />
            Export
          </button>
          {isAdmin && (
            <button
              onClick={() => {
                setEditTransaction(null);
                setShowModal(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-violet-500 hover:bg-violet-600 text-white text-sm font-medium transition-all"
            >
              <Plus size={15} />
              Add
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div
        className={clsx(
          "rounded-2xl border p-4 flex flex-wrap gap-3",
          darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100",
        )}
      >
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search
            size={15}
            className={clsx(
              "absolute left-3 top-1/2 -translate-y-1/2",
              darkMode ? "text-gray-500" : "text-gray-400",
            )}
          />
          <input
            type="text"
            placeholder="Search transactions..."
            value={filters.search}
            onChange={(e) => dispatch(setSearch(e.target.value))}
            className={clsx(baseInput, "pl-9 w-full")}
          />
        </div>

        {/* Type filter */}
        <select
          value={filters.type}
          onChange={(e) => dispatch(setTypeFilter(e.target.value as any))}
          className={baseInput}
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        {/* Category filter */}
        <select
          value={filters.category}
          onChange={(e) => dispatch(setCategoryFilter(e.target.value as any))}
          className={baseInput}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c === "all" ? "All Categories" : c}
            </option>
          ))}
        </select>

        {/* Reset */}
        <button
          onClick={() => dispatch(resetFilters())}
          className={clsx(
            "flex items-center gap-1 px-3 py-2 rounded-xl text-sm border transition-all",
            darkMode
              ? "border-gray-700 text-gray-500 hover:bg-gray-800 hover:text-gray-400"
              : "border-gray-200 text-gray-400 hover:bg-gray-50",
          )}
        >
          <X size={14} />
          Reset
        </button>
      </div>

      {/* Table */}
      <div
        className={clsx(
          "rounded-2xl border overflow-hidden",
          darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100",
        )}
      >
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <Filter
              size={32}
              className={darkMode ? "text-gray-700" : "text-gray-300"}
            />
            <p
              className={clsx(
                "text-sm font-medium",
                darkMode ? "text-gray-400" : "text-gray-500",
              )}
            >
              No transactions found
            </p>
            <button
              onClick={() => dispatch(resetFilters())}
              className="text-xs text-violet-500 hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr
                  className={clsx(
                    "border-b text-left",
                    darkMode ? "border-gray-800" : "border-gray-100",
                  )}
                >
                  {[
                    { label: "Date", field: "date" },
                    { label: "Merchant", field: "merchant" },
                    { label: "Category", field: "category" },
                    { label: "Type", field: null },
                    { label: "Amount", field: "amount" },
                    ...(isAdmin ? [{ label: "", field: null }] : []),
                  ].map(({ label, field }) => (
                    <th
                      key={label}
                      onClick={() =>
                        field && dispatch(setSortField(field as any))
                      }
                      className={clsx(
                        "px-4 py-3 text-xs font-semibold uppercase tracking-wider select-none",
                        darkMode ? "text-gray-500" : "text-gray-400",
                        field &&
                          "cursor-pointer hover:text-violet-500 transition-colors",
                      )}
                    >
                      <span className="flex items-center gap-1">
                        {label}
                        {field && <SortIcon field={field} />}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((t, i) => (
                  <tr
                    key={t.id}
                    className={clsx(
                      "border-b transition-colors",
                      i % 2 === 0
                        ? darkMode
                          ? "bg-transparent"
                          : "bg-white"
                        : darkMode
                          ? "bg-gray-950/30"
                          : "bg-gray-50/50",
                      darkMode
                        ? "border-gray-800/50 hover:bg-gray-800/40"
                        : "border-gray-100 hover:bg-violet-50/30",
                    )}
                  >
                    <td
                      className={clsx(
                        "px-4 py-3 text-sm",
                        darkMode ? "text-gray-400" : "text-gray-500",
                      )}
                    >
                      {formatDate(t.date)}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p
                          className={clsx(
                            "text-sm font-medium",
                            darkMode ? "text-gray-200" : "text-gray-700",
                          )}
                        >
                          {t.merchant}
                        </p>
                        <p
                          className={clsx(
                            "text-xs",
                            darkMode ? "text-gray-600" : "text-gray-400",
                          )}
                        >
                          {t.description}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-white"
                        style={{
                          background: CATEGORY_COLORS[t.category] || "#94a3b8",
                        }}
                      >
                        {t.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={clsx(
                          "text-xs font-medium px-2 py-1 rounded-lg",
                          t.type === "income"
                            ? darkMode
                              ? "bg-emerald-950 text-emerald-400"
                              : "bg-emerald-100 text-emerald-700"
                            : darkMode
                              ? "bg-rose-950 text-rose-400"
                              : "bg-rose-100 text-rose-700",
                        )}
                      >
                        {t.type}
                      </span>
                    </td>
                    <td
                      className={clsx(
                        "px-4 py-3 text-sm font-semibold",
                        t.type === "income"
                          ? "text-emerald-500"
                          : darkMode
                            ? "text-rose-400"
                            : "text-rose-500",
                      )}
                    >
                      {t.type === "income" ? "+" : "-"}
                      {formatCurrency(t.amount)}
                    </td>
                    {isAdmin && (
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setEditTransaction(t);
                              setShowModal(true);
                            }}
                            className={clsx(
                              "p-1.5 rounded-lg transition-colors",
                              darkMode
                                ? "hover:bg-gray-700 text-gray-500 hover:text-gray-300"
                                : "hover:bg-gray-100 text-gray-400 hover:text-gray-600",
                            )}
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => dispatch(deleteTransaction(t.id))}
                            className={clsx(
                              "p-1.5 rounded-lg transition-colors",
                              darkMode
                                ? "hover:bg-rose-950 text-gray-500 hover:text-rose-400"
                                : "hover:bg-rose-50 text-gray-400 hover:text-rose-500",
                            )}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <TransactionModal
          transaction={editTransaction}
          onClose={() => {
            setShowModal(false);
            setEditTransaction(null);
          }}
        />
      )}
    </div>
  );
};

export default TransactionsPage;
