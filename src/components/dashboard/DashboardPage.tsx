import React from "react";
import SummaryCards from "../features/SummaryCard";
import BalanceTrend from "../features/BalanceTrend";
import SpendingBreakdown from "../features/SpendingBreakdown";
import RecentTransactions from "../features/RecentTransactions";
import { useAppSelector } from "../../hooks/redux";
import clsx from "clsx";

const DashboardPage: React.FC = () => {
  const darkMode = useAppSelector((s) => s.app.darkMode);
  const role = useAppSelector((s) => s.app.role);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between">
        <div>
          <h2
            className={clsx(
              "text-xl font-bold",
              darkMode ? "text-gray-100" : "text-gray-800",
            )}
          >
            Overview
          </h2>
          <p
            className={clsx(
              "text-sm mt-0.5",
              darkMode ? "text-gray-500" : "text-gray-400",
            )}
          >
            Jan – Jun 2024 · {role === "admin" ? "Full access" : "View only"}
          </p>
        </div>
      </div>

      <SummaryCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <BalanceTrend />
        </div>
        <SpendingBreakdown />
      </div>

      <RecentTransactions />
    </div>
  );
};

export default DashboardPage;
