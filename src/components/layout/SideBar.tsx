import React from "react";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Lightbulb,
  Moon,
  Sun,
  ShieldCheck,
  Eye,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  setActiveTab,
  toggleDarkMode,
  setRole,
} from "../../store/slices/appSlice";
import type { Role } from "../../types/interface";
import clsx from "clsx";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "transactions", label: "Transactions", icon: ArrowLeftRight },
  { id: "insights", label: "Insights", icon: Lightbulb },
] as const;

const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { activeTab, darkMode, role } = useAppSelector((s) => s.app);

  return (
    <aside
      className={clsx(
        "flex flex-col h-full w-64 shrink-0 border-r px-4 py-6 transition-colors duration-300",
        darkMode
          ? "bg-gray-950 border-gray-800 text-gray-100"
          : "bg-white border-gray-100 text-gray-800",
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 mb-10 px-2">
        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-md">
          <span className="text-white text-sm font-bold">F</span>
        </div>
        <div>
          <p className="font-bold text-base leading-none tracking-tight">
            FinView
          </p>
          <p
            className={clsx(
              "text-xs mt-0.5",
              darkMode ? "text-gray-400" : "text-gray-400",
            )}
          >
            Finance Dashboard
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => dispatch(setActiveTab(id))}
            className={clsx(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 w-full text-left",
              activeTab === id
                ? "bg-violet-500 text-white shadow-sm shadow-violet-200"
                : darkMode
                  ? "text-gray-400 hover:bg-gray-800 hover:text-gray-100"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-800",
            )}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </nav>

      {/* Controls */}
      <div className="mt-auto flex flex-col gap-3">
        {/* Role Switcher */}
        <div
          className={clsx(
            "rounded-xl p-3 border",
            darkMode
              ? "border-gray-800 bg-gray-900"
              : "border-gray-100 bg-gray-50",
          )}
        >
          <p
            className={clsx(
              "text-xs font-semibold mb-2 uppercase tracking-wider",
              darkMode ? "text-gray-500" : "text-gray-400",
            )}
          >
            Current Role
          </p>
          <div className="flex gap-1.5">
            {(["viewer", "admin"] as Role[]).map((r) => (
              <button
                key={r}
                onClick={() => dispatch(setRole(r))}
                className={clsx(
                  "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all",
                  role === r
                    ? r === "admin"
                      ? "bg-violet-500 text-white"
                      : "bg-indigo-500 text-white"
                    : darkMode
                      ? "bg-gray-800 text-gray-400 hover:bg-gray-700"
                      : "bg-white text-gray-500 hover:bg-gray-100",
                )}
              >
                {r === "admin" ? <ShieldCheck size={12} /> : <Eye size={12} />}
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Dark mode */}
        <button
          onClick={() => dispatch(toggleDarkMode())}
          className={clsx(
            "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all w-fit",
            darkMode
              ? "bg-gray-800 text-yellow-400 hover:bg-gray-700"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200",
          )}
        >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
