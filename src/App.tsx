import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { useAppSelector } from "./hooks/redux";
import Sidebar from "./components/layout/SideBar";
import DashboardPage from "./components/dashboard/DashboardPage";
import TransactionsPage from "./components/transactions/TransactionsPage";
import InsightsPage from "./components/insights/InsightsPage";
import clsx from "clsx";
import "./App.css";

const App: React.FC = () => {
  const { darkMode, activeTab } = useAppSelector((s) => s.app);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderPage = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardPage />;
      case "transactions":
        return <TransactionsPage />;
      case "insights":
        return <InsightsPage />;
    }
  };

  return (
    <div
      className={clsx(
        "flex h-screen overflow-hidden font-sans transition-colors duration-300",
        darkMode ? "bg-gray-950 text-gray-100" : "bg-gray-50 text-gray-800",
      )}
    >
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative z-50 w-64">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div
          className={clsx(
            "md:hidden flex items-center gap-3 px-4 py-3 border-b",
            darkMode
              ? "bg-gray-950 border-gray-800"
              : "bg-white border-gray-100",
          )}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className={clsx(
              "p-2 rounded-lg",
              darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100",
            )}
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">F</span>
            </div>
            <span className="font-bold text-sm">FinView</span>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default App;
