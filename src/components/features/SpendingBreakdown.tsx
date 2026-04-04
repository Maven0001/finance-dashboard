import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useAppSelector } from "../../hooks/redux";
import { getCategoryBreakdown, formatCurrency } from "../../utils";
import clsx from "clsx";

const SpendingBreakdown: React.FC = () => {
  const darkMode = useAppSelector((s) => s.app.darkMode);
  const transactions = useAppSelector((s) => s.transactions.items);
  const data = getCategoryBreakdown(transactions).slice(0, 7);

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div
        className={clsx(
          "p-3 rounded-xl shadow-lg border text-xs",
          darkMode
            ? "bg-gray-900 border-gray-700 text-gray-200"
            : "bg-white border-gray-200 text-gray-700",
        )}
      >
        <p className="font-semibold">{d.category}</p>
        <p className="mt-1">
          {formatCurrency(d.amount)}{" "}
          <span className="text-gray-400">({d.percentage.toFixed(1)}%)</span>
        </p>
      </div>
    );
  };

  return (
    <div
      className={clsx(
        "rounded-2xl border p-5 transition-colors duration-300",
        darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100",
      )}
    >
      <div className="mb-5">
        <h3
          className={clsx(
            "font-bold text-base",
            darkMode ? "text-gray-100" : "text-gray-800",
          )}
        >
          Spending Breakdown
        </h3>
        <p
          className={clsx(
            "text-xs mt-0.5",
            darkMode ? "text-gray-500" : "text-gray-400",
          )}
        >
          By category
        </p>
      </div>
      <div className="flex items-center gap-4">
        <ResponsiveContainer width={160} height={160}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={74}
              paddingAngle={2}
              dataKey="amount"
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          {data.map((item) => (
            <div
              key={item.category}
              className="flex items-center gap-2 min-w-0"
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ background: item.color }}
              />
              <span
                className={clsx(
                  "text-xs truncate flex-1",
                  darkMode ? "text-gray-400" : "text-gray-600",
                )}
              >
                {item.category}
              </span>
              <span
                className={clsx(
                  "text-xs font-semibold shrink-0",
                  darkMode ? "text-gray-300" : "text-gray-700",
                )}
              >
                {item.percentage.toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpendingBreakdown;
