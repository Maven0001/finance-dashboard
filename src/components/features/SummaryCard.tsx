import React from "react";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useAppSelector } from "../../hooks/redux";
import { getTotals, formatCurrency } from "../../utils";
import clsx from "clsx";

const SummaryCards: React.FC = () => {
  const darkMode = useAppSelector((s) => s.app.darkMode);
  const transactions = useAppSelector((s) => s.transactions.items);
  const { income, expenses, balance } = getTotals(transactions);

  const cards = [
    {
      title: "Total Balance",
      value: formatCurrency(balance),
      icon: Wallet,
      gradient: "from-violet-500 to-indigo-600",
      bg: darkMode
        ? "bg-violet-950/40 border-violet-800/40"
        : "bg-violet-50 border-violet-100",
      text: darkMode ? "text-violet-300" : "text-violet-700",
      iconBg: "bg-violet-500",
      trend: "+12.5%",
      trendPositive: true,
    },
    {
      title: "Total Income",
      value: formatCurrency(income),
      icon: TrendingUp,
      gradient: "from-emerald-500 to-teal-600",
      bg: darkMode
        ? "bg-emerald-950/40 border-emerald-800/40"
        : "bg-emerald-50 border-emerald-100",
      text: darkMode ? "text-emerald-300" : "text-emerald-700",
      iconBg: "bg-emerald-500",
      trend: "+8.2%",
      trendPositive: true,
    },
    {
      title: "Total Expenses",
      value: formatCurrency(expenses),
      icon: TrendingDown,
      gradient: "from-rose-500 to-pink-600",
      bg: darkMode
        ? "bg-rose-950/40 border-rose-800/40"
        : "bg-rose-50 border-rose-100",
      text: darkMode ? "text-rose-300" : "text-rose-700",
      iconBg: "bg-rose-500",
      trend: "-3.1%",
      trendPositive: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={clsx(
              "rounded-2xl border p-5 transition-all duration-300 hover:scale-[1.01]",
              card.bg,
            )}
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={clsx(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  card.iconBg,
                )}
              >
                <Icon size={18} className="text-white" />
              </div>
              <span
                className={clsx(
                  "flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full",
                  card.trendPositive
                    ? darkMode
                      ? "bg-emerald-950 text-emerald-400"
                      : "bg-emerald-100 text-emerald-700"
                    : darkMode
                      ? "bg-rose-950 text-rose-400"
                      : "bg-rose-100 text-rose-700",
                )}
              >
                {card.trendPositive ? (
                  <ArrowUpRight size={12} />
                ) : (
                  <ArrowDownRight size={12} />
                )}
                {card.trend}
              </span>
            </div>
            <p
              className={clsx(
                "text-sm font-medium mb-1",
                darkMode ? "text-gray-400" : "text-gray-500",
              )}
            >
              {card.title}
            </p>
            <p className={clsx("text-2xl font-bold tracking-tight", card.text)}>
              {card.value}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default SummaryCards;
