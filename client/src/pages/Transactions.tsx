import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchTransactions,
  deleteTransaction,
} from "../store/slices/transactionsSlice";
import { setFilter, resetFilters } from "../store/slices/filterSlice";
import { openModal } from "../store/slices/uiSlice";
import {
  FaArrowDown,
  FaArrowsAltV,
  FaArrowUp,
  FaSearchDollar,
} from "react-icons/fa";

import TransactionModal from "../components/ui/TransactionModal";
import { exportToCSV } from "../utils/formatters";
import { IoAddCircleSharp } from "react-icons/io5";
import { TransactionTableRow } from "../components/ui/TransactionTable";
import { FilterSelect } from "../components/ui/FilterSelect";

const CATEGORIES = [
  "All",
  "Food & Dining",
  "Shopping",
  "Transportation",
  "Entertainment",
  "Utilities",
  "Housing",
  "Healthcare",
  "Education",
  "Salary",
  "Freelance",
  "Investment",
  "Transfer",
  "Other",
];

type SortKey = "date" | "amount";
type SortDir = "asc" | "desc";

const Transactions = () => {
  const dispatch = useAppDispatch();

  const { data: transactions = [], loading } = useAppSelector(
    (s) => s.transactions,
  );
  const filters = useAppSelector((s) => s.filters);
  const role = useAppSelector((s) => s.role.current);

  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchTransactions({}));
  }, [dispatch]);

  const availableMonths = useMemo(() => {
    const months = new Set(transactions.map((t) => t.date.slice(0, 7)));
    return Array.from(months).sort();
  }, [transactions]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const handleDelete = async (id: string) => {
    await dispatch(deleteTransaction(id));
    setDeleteConfirm(null);
  };

  const filtered = transactions
    .filter((t) => {
      if (filters.type !== "all" && t.type !== filters.type) return false;
      if (filters.category !== "all" && t.category !== filters.category)
        return false;
      if (filters.status !== "all" && t.status !== filters.status) return false;
      if (filters.month && !t.date.startsWith(filters.month)) return false;
      if (
        filters.search &&
        !t.description.toLowerCase().includes(filters.search.toLowerCase()) &&
        !t.category.toLowerCase().includes(filters.search.toLowerCase()) &&
        !t.note.toLowerCase().includes(filters.search.toLowerCase())
      )
        return false;
      return true;
    })
    .sort((a, b) => {
      if (sortKey === "date") {
        const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
        return sortDir === "asc" ? diff : -diff;
      }
      return sortDir === "asc" ? a.amount - b.amount : b.amount - a.amount;
    });

  const SortIcon = ({ col }: { col: SortKey }) => (
    <span
      style={{
        color: sortKey === col ? "var(--cyan)" : "var(--text-muted)",
        fontSize: 10,
        marginLeft: 4,
      }}
    >
      {sortKey === col ? (
        sortDir === "asc" ? (
          <FaArrowUp />
        ) : (
          <FaArrowDown />
        )
      ) : (
        <FaArrowsAltV />
      )}
    </span>
  );

  return (
    <div /*ref={ref}*/ className="page-wrapper space-y-5">
      <TransactionModal />

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1
            className="text-[22px] font-bold text-var(--text-primary)"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            Transactions
          </h1>
          <p className="text-[12px] text-var(--text-muted) mt-0.5">
            {filtered.length} of {transactions.length} transactions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => exportToCSV(filtered)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all"
            style={{
              background: "var(--navy-card)",
              border: "1px solid var(--navy-border)",
              color: "var(--text-secondary)",
              cursor: "pointer",
              fontFamily: "DM Sans, sans-serif",
            }}
          >
            <FaArrowDown /> Export CSV
          </button>

          {role === "admin" && (
            <button
              onClick={() => dispatch(openModal(null))}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all"
              style={{
                background: "linear-gradient(135deg, var(--cyan), #0099CC)",
                border: "none",
                color: "#0A0F1E",
                cursor: "pointer",
                fontFamily: "Syne, sans-serif",
              }}
            >
              <IoAddCircleSharp />
              Add Transaction
            </button>
          )}
        </div>
      </div>

      <div className="glass-card p-4 flex flex-wrap gap-3 items-center">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl flex-1 min-w-45"
          style={{
            background: "var(--navy)",
            border: "1px solid var(--navy-border)",
          }}
        >
          <span style={{ color: "var(--text-muted)", fontSize: 13 }}>
            <FaSearchDollar />
          </span>
          <input
            type="text"
            placeholder="Search transactions..."
            value={filters.search}
            onChange={(e) =>
              dispatch(setFilter({ key: "search", value: e.target.value }))
            }
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--text-primary)",
              fontSize: 13,
              fontFamily: "DM Sans, sans-serif",
              width: "100%",
            }}
          />
        </div>

        <FilterSelect
          value={filters.type}
          onChange={(v) => dispatch(setFilter({ key: "type", value: v }))}
          options={[
            { value: "all", label: "All Types" },
            { value: "income", label: "Income" },
            { value: "expense", label: "Expense" },
          ]}
        />

        <FilterSelect
          value={filters.category}
          onChange={(v) => dispatch(setFilter({ key: "category", value: v }))}
          options={CATEGORIES.map((c) => ({
            value: c === "All" ? "all" : c,
            label: c,
          }))}
        />

        <FilterSelect
          value={filters.status}
          onChange={(v) => dispatch(setFilter({ key: "status", value: v }))}
          options={[
            { value: "all", label: "All Status" },
            { value: "completed", label: "Completed" },
            { value: "pending", label: "Pending" },
            { value: "received", label: "Received" },
            { value: "failed", label: "Failed" },
          ]}
        />

        {/* <input
          type="month"
          value={filters.month}
          onChange={(e) =>
            dispatch(setFilter({ key: "month", value: e.target.value }))
          }
          style={{
            background: "var(--navy)",
            border: "1px solid var(--navy-border)",
            borderRadius: 10,
            padding: "8px 12px",
            color: filters.month ? "var(--text-primary)" : "var(--text-muted)",
            fontSize: 13,
            fontFamily: "DM Sans, sans-serif",
            outline: "none",
            cursor: "pointer",
          }}
        /> */}

        <select
          value={filters.month}
          onChange={(e) =>
            dispatch(setFilter({ key: "month", value: e.target.value }))
          }
          style={{
            background: "var(--navy)",
            border: "1px solid var(--navy-border)",
            borderRadius: 10,
            padding: "8px 12px",
            color: filters.month ? "var(--text-primary)" : "var(--text-muted)",
            fontSize: 13,
            fontFamily: "DM Sans, sans-serif",
            outline: "none",
            cursor: "pointer",
            appearance: "none",
          }}
        >
          <option value={""}>All Months</option>
          {availableMonths.map((m) => {
            console.log(m);
            const [year, month] = m.split("-");
            const label = new Date(
              parseInt(year),
              parseInt(month) - 1,
            ).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            });
            return (
              <option key={m} value={m}>
                {label}
              </option>
            );
          })}
        </select>

        {(filters.type !== "all" ||
          filters.category !== "all" ||
          filters.status !== "all" ||
          filters.month ||
          filters.search) && (
          <button
            onClick={() => dispatch(resetFilters())}
            className="px-3 py-2 rounded-xl text-[12px] font-medium transition-colors"
            style={{
              background: "var(--red-muted)",
              border: "1px solid var(--red)30",
              color: "var(--red)",
              cursor: "pointer",
              fontFamily: "DM Sans, sans-serif",
            }}
          >
            X Reset
          </button>
        )}
      </div>
      <div className="relative flex items-center">
        <div
          className="flex gap-1 p-1 rounded-xl w-fit"
          style={{
            background: "var(--navy-card)",
            border: "1px solid var(--navy-border)",
          }}
        >
          {(["all", "income", "expense"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => dispatch(setFilter({ key: "type", value: tab }))}
              className="px-5 py-2 rounded-lg text-[13px] font-medium capitalize transition-all duration-200"
              style={{
                background:
                  filters.type === tab ? "var(--cyan-muted)" : "transparent",
                border: `1px solid ${
                  filters.type === tab ? "var(--cyan)40" : "transparent"
                }`,
                color:
                  filters.type === tab
                    ? "var(--cyan)"
                    : "var(--text-secondary)",
                cursor: "pointer",
                fontFamily: "DM Sans, sans-serif",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {!loading && filtered.length > 0 && (
          <p className="absolute left-1/2 -translate-x-1/2 text-[12px] text-(--text-muted)">
            Showing {filtered.length} transaction
            {filtered.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      <div className="glass-card overflow-hidden">
        <div
          className="grid items-center px-4 py-3"
          style={{
            gridTemplateColumns:
              role === "admin"
                ? "40px 1fr 140px 130px 110px 110px auto"
                : "40px 1fr 140px 130px 110px 110px",
            borderBottom: "1px solid var(--navy-border)",
            gap: "12px",
          }}
        >
          {[
            { label: "Icon", sortable: false },
            { label: "Description", sortable: false },
            { label: "Account", sortable: false },
            { label: "Date", sortable: true, key: "date" as SortKey },
            { label: "Amount", sortable: true, key: "amount" as SortKey },
            { label: "Status", sortable: false },
          ].map((col) => (
            <button
              key={col.label}
              onClick={() => col.sortable && col.key && handleSort(col.key)}
              style={{
                background: "none",
                border: "none",
                cursor: col.sortable ? "pointer" : "default",
                color: "var(--text-muted)",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                textAlign: "left",
                fontFamily: "DM Sans, sans-serif",
                padding: 0,
                display: "flex",
                alignItems: "center",
              }}
            >
              {col.label}
              {col.sortable && col.key && <SortIcon col={col.key} />}
            </button>
          ))}
          {role === "admin" && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "var(--text-muted)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Actions
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-[13px] text-var(--text-muted) animate-pulse">
              Loading transactions...
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <span style={{ fontSize: 40 }}>
              <FaSearchDollar />
            </span>
            <p
              className="text-[16px] font-semibold text-var(--text-secondary)"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              No transactions found
            </p>
            <p className="text-[13px] text-var(--text-muted)">
              Try adjusting your filters or search query
            </p>
            <button
              onClick={() => dispatch(resetFilters())}
              className="mt-2 px-4 py-2 rounded-xl text-[12px] font-medium"
              style={{
                background: "var(--cyan-muted)",
                border: "1px solid var(--cyan)30",
                color: "var(--cyan)",
                cursor: "pointer",
                fontFamily: "DM Sans, sans-serif",
              }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          filtered.map((tx) => (
            <TransactionTableRow
              key={tx.id}
              tx={tx}
              isAdmin={role === "admin"}
              onEdit={() => dispatch(openModal(tx.id))}
              onDelete={() => setDeleteConfirm(tx.id)}
              deleteConfirm={deleteConfirm}
              onConfirmDelete={handleDelete}
              onCancelDelete={() => setDeleteConfirm(null)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Transactions;
