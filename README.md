# FinView — Finance Dashboard

A clean, interactive finance dashboard built with React, TypeScript, Redux Toolkit, and Tailwind CSS.

---

## ✨ Features

### Dashboard Overview

- **Summary Cards** — Total Balance, Income, and Expenses with trend indicators
- **Balance Trend Chart** — Area chart comparing income vs expenses over 6 months
- **Spending Breakdown** — Donut chart with top categories and legend
- **Recent Transactions** — Latest 6 transactions at a glance

### Transactions

- Full sortable table: date, merchant, category, type, amount
- **Search** — by merchant, description, or category
- **Filter** — by type (income/expense) and category
- **Sort** — click any column header to toggle asc/desc
- **Export to CSV** — download filtered transactions
- **Add/Edit/Delete** — available in Admin role only

### Insights

- Top spending category
- Savings rate with health indicator
- Month-over-month expense change
- Expense/income ratio
- Monthly comparison bar chart
- Per-category progress bars

### Role-Based UI

Switch roles via the sidebar toggle:
| Feature | Viewer | Admin |
|---|---|---|
| View dashboard | ✅ | ✅ |
| View transactions | ✅ | ✅ |
| View insights | ✅ | ✅ |
| Add transaction | ❌ | ✅ |
| Edit transaction | ❌ | ✅ |
| Delete transaction | ❌ | ✅ |

### UX Extras

- **Dark mode** toggle (persists via Redux)
- **Responsive layout** — sidebar collapses to hamburger menu on mobile
- **Empty state** — shown when filters return no results
- **Form validation** — all fields validated before saving
- **CSV export** — exports currently filtered view

---

## 🛠 Tech Stack

| Tool          | Purpose                 |
| ------------- | ----------------------- |
| React 18      | UI framework            |
| TypeScript    | Type safety             |
| Redux Toolkit | Global state management |
| Tailwind CSS  | Utility-first styling   |
| Recharts      | Charts (area, bar, pie) |
| Vite          | Build tool & dev server |
| lucide-react  | Icon library            |
| clsx          | Conditional class names |
| DM Sans       | Typography              |

---

## 🎨 Design Decisions

- **DM Sans** font — clean and modern without being generic
- **Violet accent** color — consistent visual identity throughout
- **Color-coded categories** — each spending category has a unique color used across all views
- **Rounded cards** with subtle borders — soft, approachable feel in both light and dark mode
- **Minimal chrome** — no unnecessary decorative elements, content-first layout
- **Hover states & transitions** — subtle feedback on all interactive elements

---

## 📊 Mock Data

The app ships with 62 realistic transactions spread across January–June 2024, covering:

- Regular salary income
- Freelance projects of varying sizes
- Investment returns
- Recurring expenses (rent, utilities, gym)
- Variable spending (dining, shopping, travel)

This gives charts and insights meaningful variance to display.
