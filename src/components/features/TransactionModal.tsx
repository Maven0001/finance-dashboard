import React, { useState } from "react";
import { X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  addTransaction,
  updateTransaction,
} from "../../store/slices/transactionSlice";
import type {
  Transaction,
  TransactionCategory,
  TransactionType,
} from "../../types/interface";
import { generateId } from "../../utils";
import clsx from "clsx";

const CATEGORIES: TransactionCategory[] = [
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

interface Props {
  transaction?: Transaction | null;
  onClose: () => void;
}

const TransactionModal: React.FC<Props> = ({ transaction, onClose }) => {
  const dispatch = useAppDispatch();
  const darkMode = useAppSelector((s) => s.app.darkMode);

  const [form, setForm] = useState({
    date: transaction?.date || new Date().toISOString().split("T")[0],
    amount: transaction?.amount?.toString() || "",
    category: transaction?.category || ("Food & Dining" as TransactionCategory),
    type: transaction?.type || ("expense" as TransactionType),
    description: transaction?.description || "",
    merchant: transaction?.merchant || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
      e.amount = "Enter a valid amount";
    if (!form.merchant.trim()) e.merchant = "Merchant is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.date) e.date = "Date is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const payload: Transaction = {
      id: transaction?.id || generateId(),
      date: form.date,
      amount: Number(form.amount),
      category: form.category,
      type: form.type,
      description: form.description,
      merchant: form.merchant,
    };
    if (transaction) {
      dispatch(updateTransaction(payload));
    } else {
      dispatch(addTransaction(payload));
    }
    onClose();
  };

  const inputClass = clsx(
    "w-full px-3 py-2 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/30",
    darkMode
      ? "bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-600"
      : "bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400",
  );

  const labelClass = clsx(
    "text-xs font-medium mb-1.5 block",
    darkMode ? "text-gray-400" : "text-gray-500",
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={clsx(
          "relative w-full max-w-md rounded-2xl shadow-2xl p-6 z-10",
          darkMode
            ? "bg-gray-900 border border-gray-800"
            : "bg-white border border-gray-100",
        )}
      >
        <div className="flex items-center justify-between mb-6">
          <h2
            className={clsx(
              "text-lg font-bold",
              darkMode ? "text-gray-100" : "text-gray-800",
            )}
          >
            {transaction ? "Edit Transaction" : "Add Transaction"}
          </h2>
          <button
            onClick={onClose}
            className={clsx(
              "p-1.5 rounded-lg",
              darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100",
            )}
          >
            <X
              size={18}
              className={darkMode ? "text-gray-400" : "text-gray-500"}
            />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {/* Type */}
          <div>
            <label className={labelClass}>Type</label>
            <div className="flex gap-2">
              {(["income", "expense"] as TransactionType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setForm({ ...form, type: t })}
                  className={clsx(
                    "flex-1 py-2 rounded-xl text-sm font-medium border transition-all",
                    form.type === t
                      ? t === "income"
                        ? "bg-emerald-500 text-white border-emerald-500"
                        : "bg-rose-500 text-white border-rose-500"
                      : darkMode
                        ? "bg-gray-800 border-gray-700 text-gray-400"
                        : "bg-gray-50 border-gray-200 text-gray-500",
                  )}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className={labelClass}>Amount ($)</label>
            <input
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder="0.00"
              className={inputClass}
            />
            {errors.amount && (
              <p className="text-rose-500 text-xs mt-1">{errors.amount}</p>
            )}
          </div>

          {/* Merchant */}
          <div>
            <label className={labelClass}>Merchant</label>
            <input
              type="text"
              value={form.merchant}
              onChange={(e) => setForm({ ...form, merchant: e.target.value })}
              placeholder="e.g. Amazon"
              className={inputClass}
            />
            {errors.merchant && (
              <p className="text-rose-500 text-xs mt-1">{errors.merchant}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>Description</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Short description"
              className={inputClass}
            />
            {errors.description && (
              <p className="text-rose-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className={labelClass}>Category</label>
            <select
              value={form.category}
              onChange={(e) =>
                setForm({
                  ...form,
                  category: e.target.value as TransactionCategory,
                })
              }
              className={inputClass}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className={labelClass}>Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className={inputClass}
            />
            {errors.date && (
              <p className="text-rose-500 text-xs mt-1">{errors.date}</p>
            )}
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={onClose}
            className={clsx(
              "flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all",
              darkMode
                ? "border-gray-700 text-gray-400 hover:bg-gray-800"
                : "border-gray-200 text-gray-500 hover:bg-gray-50",
            )}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-2.5 rounded-xl bg-violet-500 hover:bg-violet-600 text-white text-sm font-medium transition-all"
          >
            {transaction ? "Save Changes" : "Add Transaction"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;
