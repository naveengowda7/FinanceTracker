import { MdAutoDelete } from "react-icons/md";
import type { Transaction } from "../../store/slices/transactionsSlice";
import {
  formatCurrency,
  formatDate,
  getCategoryIcon,
  getStatusColor,
} from "../../utils/formatters";
import { FaEdit } from "react-icons/fa";

export const TransactionTableRow = ({
  tx,
  isAdmin,
  onEdit,
  onDelete,
  deleteConfirm,
  onConfirmDelete,
  onCancelDelete,
}: {
  tx: Transaction;
  isAdmin: boolean;
  onEdit: () => void;
  onDelete: () => void;
  deleteConfirm: string | null;
  onConfirmDelete: (id: string) => void;
  onCancelDelete: () => void;
}) => {
  const isIncome = tx.type === "income";
  const isDeleting = deleteConfirm === tx.id;

  return (
    <div
      className="grid items-center px-4 py-3 transition-colors duration-150"
      style={{
        gridTemplateColumns: isAdmin
          ? "40px 1fr 140px 130px 110px 110px auto"
          : "40px 1fr 140px 130px 110px 110px",
        borderBottom: "1px solid var(--navy-border)",
        gap: "12px",
        background: isDeleting ? "var(--red-muted)" : "transparent",
      }}
    >
      <div
        className="w-9 h-9 flex items-center justify-center rounded-xl shrink-0"
        style={{
          background: isIncome ? "var(--emerald-muted)" : "var(--red-muted)",
          border: `1px solid ${isIncome ? "var(--emerald)" : "var(--red)"}20`,
          fontSize: 15,
        }}
      >
        {getCategoryIcon(tx.category)}
      </div>

      <div className="min-w-0">
        <p className="text-[13px] font-medium text-var(--text-primary) truncate">
          {tx.description}
        </p>
        <p className="text-[11px] text-var(--text-muted) mt-0.5 truncate">
          {tx.category}
        </p>
      </div>

      <p className="text-[12px] text-var(--text-secondary) truncate">
        {tx.account}
      </p>

      <p className="text-[12px] text-var(--text-secondary)">
        {formatDate(tx.date)}
      </p>

      <p
        className="text-[13px] font-semibold"
        style={{
          color: isIncome ? "var(--emerald)" : "var(--red)",
          fontFamily: "Syne, sans-serif",
        }}
      >
        {isIncome ? "+" : "-"}
        {formatCurrency(tx.amount)}
      </p>

      <span
        className="px-2 py-0.5 rounded-full text-[10px] font-semibold w-fit capitalize"
        style={{
          color: getStatusColor(tx.status),
          background: `${getStatusColor(tx.status)}15`,
          border: `1px solid ${getStatusColor(tx.status)}30`,
          letterSpacing: "0.05em",
        }}
      >
        {tx.status}
      </span>

      {isAdmin && (
        <div className="flex items-center gap-2">
          {isDeleting ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onConfirmDelete(tx.id)}
                className="px-2 py-1 rounded-lg text-[11px] font-semibold"
                style={{
                  background: "var(--red)",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                  fontFamily: "DM Sans, sans-serif",
                }}
              >
                Confirm
              </button>
              <button
                onClick={onCancelDelete}
                className="px-2 py-1 rounded-lg text-[11px]"
                style={{
                  background: "var(--navy-border)",
                  border: "none",
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                  fontFamily: "DM Sans, sans-serif",
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={onEdit}
                className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
                style={{
                  background: "var(--cyan-muted)",
                  border: "1px solid var(--cyan)30",
                  color: "var(--cyan)",
                  cursor: "pointer",
                  fontSize: 13,
                }}
                title="Edit"
              >
                <FaEdit />
              </button>
              <button
                onClick={onDelete}
                className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
                style={{
                  background: "var(--red-muted)",
                  border: "1px solid var(--red)30",
                  color: "var(--red)",
                  cursor: "pointer",
                  fontSize: 13,
                }}
                title="Delete"
              >
                <MdAutoDelete />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};
