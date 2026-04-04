import React from "react";
import { useAppSelector } from "../../hooks/redux";
import { formatCurrency, formatDate } from "../../utils";
import { CATEGORY_COLORS } from "../../data/mockdata";
import clsx from "clsx";

const RecentTransactions: React.FC = () => {
  const darkMode = useAppSelector((s) => s.app.darkMode);
  const transactions = useAppSelector((s) => s.transactions.items);
  const recent = [...transactions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 6);

  return (
    <div
      className={clsx(
        "rounded-2xl border p-5 transition-colors duration-300",
        darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100",
      )}
    >
      <h3
        className={clsx(
          "font-bold text-base mb-4",
          darkMode ? "text-gray-100" : "text-gray-800",
        )}
      >
        Recent Transactions
      </h3>
      <div className="flex flex-col gap-3">
        {recent.map((t) => (
          <div key={t.id} className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white text-xs font-bold"
              style={{ background: CATEGORY_COLORS[t.category] || "#94a3b8" }}
            >
              {t.category.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={clsx(
                  "text-sm font-medium truncate",
                  darkMode ? "text-gray-200" : "text-gray-700",
                )}
              >
                {t.merchant}
              </p>
              <p
                className={clsx(
                  "text-xs",
                  darkMode ? "text-gray-500" : "text-gray-400",
                )}
              >
                {formatDate(t.date)} · {t.category}
              </p>
            </div>
            <span
              className={clsx(
                "text-sm font-semibold shrink-0",
                t.type === "income"
                  ? "text-emerald-500"
                  : darkMode
                    ? "text-rose-400"
                    : "text-rose-500",
              )}
            >
              {t.type === "income" ? "+" : "-"}
              {formatCurrency(t.amount)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;
