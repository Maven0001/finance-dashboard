import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Award,
  AlertCircle,
  Target,
} from "lucide-react";
import { useAppSelector } from "../../hooks/redux";
import {
  getCategoryBreakdown,
  getMonthlyData,
  formatCurrency,
  getTotals,
} from "../../utils";
import { CATEGORY_COLORS } from "../../data/mockdata";
import clsx from "clsx";

const InsightsPage: React.FC = () => {
  const darkMode = useAppSelector((s) => s.app.darkMode);
  const transactions = useAppSelector((s) => s.transactions.items);

  const categoryData = getCategoryBreakdown(transactions);
  const monthlyData = getMonthlyData(transactions);
  const { income, expenses } = getTotals(transactions);
  const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;

  const topCategory = categoryData[0];

  // Month-over-month comparison (last 2 months)
  const lastTwo = monthlyData.slice(-2);
  const prevExpenses = lastTwo[0]?.expenses || 0;
  const currExpenses = lastTwo[1]?.expenses || 0;
  const expenseChange =
    prevExpenses > 0 ? ((currExpenses - prevExpenses) / prevExpenses) * 100 : 0;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div
        className={clsx(
          "p-3 rounded-xl shadow-lg border text-xs",
          darkMode
            ? "bg-gray-900 border-gray-700 text-gray-200"
            : "bg-white border-gray-200 text-gray-700",
        )}
      >
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((p: any) => (
          <div key={p.dataKey} className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: p.color }}
            />
            <span>{p.name}:</span>
            <span className="font-semibold">{formatCurrency(p.value)}</span>
          </div>
        ))}
      </div>
    );
  };

  const insightCards = [
    {
      icon: Award,
      title: "Top Spending Category",
      value: topCategory?.category || "N/A",
      sub: topCategory
        ? `${formatCurrency(topCategory.amount)} total (${topCategory.percentage.toFixed(0)}% of expenses)`
        : "",
      color: "violet",
    },
    {
      icon: Target,
      title: "Savings Rate",
      value: `${savingsRate.toFixed(1)}%`,
      sub:
        savingsRate >= 20 ? "✓ Healthy savings rate" : "Aim for 20%+ savings",
      color: savingsRate >= 20 ? "emerald" : "amber",
    },
    {
      icon: expenseChange >= 0 ? TrendingUp : TrendingDown,
      title: "Month-over-Month Expenses",
      value: `${expenseChange >= 0 ? "+" : ""}${expenseChange.toFixed(1)}%`,
      sub: `${lastTwo[0]?.month || "-"} → ${lastTwo[1]?.month || "-"}`,
      color: expenseChange <= 0 ? "emerald" : "rose",
    },
    {
      icon: AlertCircle,
      title: "Expense/Income Ratio",
      value: `${income > 0 ? ((expenses / income) * 100).toFixed(0) : 0}%`,
      sub:
        expenses < income
          ? "Spending within income ✓"
          : "Overspending detected",
      color: expenses < income ? "emerald" : "rose",
    },
  ];

  const colorMap: Record<string, { bg: string; icon: string; text: string }> = {
    violet: {
      bg: darkMode
        ? "bg-violet-950/30 border-violet-800/30"
        : "bg-violet-50 border-violet-100",
      icon: "bg-violet-500",
      text: darkMode ? "text-violet-300" : "text-violet-700",
    },
    emerald: {
      bg: darkMode
        ? "bg-emerald-950/30 border-emerald-800/30"
        : "bg-emerald-50 border-emerald-100",
      icon: "bg-emerald-500",
      text: darkMode ? "text-emerald-300" : "text-emerald-700",
    },
    rose: {
      bg: darkMode
        ? "bg-rose-950/30 border-rose-800/30"
        : "bg-rose-50 border-rose-100",
      icon: "bg-rose-500",
      text: darkMode ? "text-rose-300" : "text-rose-700",
    },
    amber: {
      bg: darkMode
        ? "bg-amber-950/30 border-amber-800/30"
        : "bg-amber-50 border-amber-100",
      icon: "bg-amber-500",
      text: darkMode ? "text-amber-300" : "text-amber-700",
    },
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2
          className={clsx(
            "text-xl font-bold",
            darkMode ? "text-gray-100" : "text-gray-800",
          )}
        >
          Insights
        </h2>
        <p
          className={clsx(
            "text-sm mt-0.5",
            darkMode ? "text-gray-500" : "text-gray-400",
          )}
        >
          Smart observations from your financial data
        </p>
      </div>

      {/* Insight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {insightCards.map((card) => {
          const Icon = card.icon;
          const colors = colorMap[card.color];
          return (
            <div
              key={card.title}
              className={clsx("rounded-2xl border p-5", colors.bg)}
            >
              <div className="flex items-start gap-3">
                <div
                  className={clsx(
                    "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
                    colors.icon,
                  )}
                >
                  <Icon size={17} className="text-white" />
                </div>
                <div>
                  <p
                    className={clsx(
                      "text-xs font-medium",
                      darkMode ? "text-gray-400" : "text-gray-500",
                    )}
                  >
                    {card.title}
                  </p>
                  <p className={clsx("text-2xl font-bold mt-0.5", colors.text)}>
                    {card.value}
                  </p>
                  <p
                    className={clsx(
                      "text-xs mt-1",
                      darkMode ? "text-gray-500" : "text-gray-400",
                    )}
                  >
                    {card.sub}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Monthly Comparison Bar Chart */}
      <div
        className={clsx(
          "rounded-2xl border p-5",
          darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100",
        )}
      >
        <h3
          className={clsx(
            "font-bold text-base mb-1",
            darkMode ? "text-gray-100" : "text-gray-800",
          )}
        >
          Monthly Comparison
        </h3>
        <p
          className={clsx(
            "text-xs mb-5",
            darkMode ? "text-gray-500" : "text-gray-400",
          )}
        >
          Income vs expenses by month
        </p>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart
            data={monthlyData}
            margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
            barSize={18}
            barGap={4}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={darkMode ? "#1f2937" : "#f3f4f6"}
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: darkMode ? "#6b7280" : "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: darkMode ? "#6b7280" : "#9ca3af" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="income"
              name="Income"
              fill="#10b981"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="expenses"
              name="Expenses"
              fill="#f43f5e"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category Breakdown Bars */}
      <div
        className={clsx(
          "rounded-2xl border p-5",
          darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100",
        )}
      >
        <h3
          className={clsx(
            "font-bold text-base mb-1",
            darkMode ? "text-gray-100" : "text-gray-800",
          )}
        >
          Expense Breakdown
        </h3>
        <p
          className={clsx(
            "text-xs mb-5",
            darkMode ? "text-gray-500" : "text-gray-400",
          )}
        >
          Where your money goes
        </p>
        <div className="flex flex-col gap-3">
          {categoryData.slice(0, 8).map((item) => (
            <div key={item.category}>
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={clsx(
                    "text-sm font-medium",
                    darkMode ? "text-gray-300" : "text-gray-700",
                  )}
                >
                  {item.category}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={clsx(
                      "text-xs",
                      darkMode ? "text-gray-500" : "text-gray-400",
                    )}
                  >
                    {formatCurrency(item.amount)}
                  </span>
                  <span
                    className={clsx(
                      "text-xs font-semibold w-10 text-right",
                      darkMode ? "text-gray-300" : "text-gray-700",
                    )}
                  >
                    {item.percentage.toFixed(2)}%
                  </span>
                </div>
              </div>
              <div
                className={clsx(
                  "h-2 rounded-full overflow-hidden",
                  darkMode ? "bg-gray-800" : "bg-gray-100",
                )}
              >
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${item.percentage}%`,
                    background: item.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InsightsPage;
