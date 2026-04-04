import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useAppSelector } from "../../hooks/redux";
import { getMonthlyData, formatCurrency } from "../../utils";
import clsx from "clsx";

const BalanceTrend: React.FC = () => {
  const darkMode = useAppSelector((s) => s.app.darkMode);
  const transactions = useAppSelector((s) => s.transactions.items);
  const data = getMonthlyData(transactions);

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
        <p className="font-semibold mb-2">{label}</p>
        {payload.map((p: any) => (
          <div key={p.dataKey} className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: p.color }}
            />
            <span className="capitalize">{p.dataKey}:</span>
            <span className="font-semibold">{formatCurrency(p.value)}</span>
          </div>
        ))}
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
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3
            className={clsx(
              "font-bold text-base",
              darkMode ? "text-gray-100" : "text-gray-800",
            )}
          >
            Balance Trend
          </h3>
          <p
            className={clsx(
              "text-xs mt-0.5",
              darkMode ? "text-gray-500" : "text-gray-400",
            )}
          >
            Income vs Expenses over time
          </p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart
          data={data}
          margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
            </linearGradient>
          </defs>
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
          <Legend
            wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
            formatter={(v) => (
              <span style={{ color: darkMode ? "#9ca3af" : "#6b7280" }}>
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </span>
            )}
          />
          <Area
            type="monotone"
            dataKey="income"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#incomeGrad)"
            dot={false}
            activeDot={{ r: 4, fill: "#10b981" }}
          />
          <Area
            type="monotone"
            dataKey="expenses"
            stroke="#f43f5e"
            strokeWidth={2}
            fill="url(#expenseGrad)"
            dot={false}
            activeDot={{ r: 4, fill: "#f43f5e" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BalanceTrend;
