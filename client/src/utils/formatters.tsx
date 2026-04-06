import {
  MdLocalDining,
  MdShoppingBag,
  MdDirectionsCar,
  MdMovieFilter,
  MdElectricBolt,
  MdHome,
  MdFavorite,
  MdSchool,
  MdAccountBalanceWallet,
  MdLaptop,
  MdTrendingUp,
  MdSwapHoriz,
  MdCategory,
} from "react-icons/md";
import type { ReactNode } from "react";

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatMonth = (monthStr: string): string => {
  const [year, month] = monthStr.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case "completed":
      return "var(--emerald)";
    case "received":
      return "var(--cyan)";
    case "pending":
      return "var(--amber)";
    case "failed":
      return "var(--red)";
    default:
      return "var(--text-secondary)";
  }
};

export const getCategoryIcon = (category: string): ReactNode => {
  const icons: Record<string, ReactNode> = {
    "Food & Dining": <MdLocalDining />,
    Shopping: <MdShoppingBag />,
    Transportation: <MdDirectionsCar />,
    Entertainment: <MdMovieFilter />,
    Utilities: <MdElectricBolt />,
    Housing: <MdHome />,
    Healthcare: <MdFavorite />,
    Education: <MdSchool />,
    Salary: <MdAccountBalanceWallet />,
    Freelance: <MdLaptop />,
    Investment: <MdTrendingUp />,
    Transfer: <MdSwapHoriz />,
    Other: <MdCategory />,
  };
  return icons[category] ?? <MdCategory />;
};

export const exportToCSV = (
  transactions: {
    id: string;
    date: string;
    description: string;
    category: string;
    type: string;
    amount: number;
    status: string;
    account: string;
    note: string;
  }[],
) => {
  const headers = [
    "ID",
    "Date",
    "Description",
    "Category",
    "Type",
    "Amount",
    "Status",
    "Account",
    "Note",
  ];

  const rows = transactions.map((t) => [
    t.id,
    new Date(t.date).toLocaleDateString("en-US"),
    `"${t.description}"`,
    t.category,
    t.type,
    t.amount.toFixed(2),
    t.status,
    t.account,
    `"${t.note}"`,
  ]);

  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `fintrack-transactions-${new Date()
    .toISOString()
    .slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};
