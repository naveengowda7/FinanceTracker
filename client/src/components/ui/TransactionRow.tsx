import { type Transaction } from "../../store/slices/transactionsSlice";
import {
  formatCurrency,
  formatDate,
  getCategoryIcon,
  getStatusColor,
} from "../../utils/formatters";

interface TransactionRowProps {
  transaction: Transaction;
  compact?: boolean;
}

const TransactionRow = ({
  transaction,
  compact = false,
}: TransactionRowProps) => {
  const isIncome = transaction.type === "income";

  return (
    <div
      className="flex items-center gap-3 py-3 transition-colors duration-150"
      style={{
        borderBottom: "1px solid var(--navy-border)",
        cursor: "default",
      }}
    >
      <div
        className="flex items-center justify-center rounded-xl shrink-0"
        style={{
          width: 38,
          height: 38,
          background: isIncome ? "var(--emerald-muted)" : "var(--red-muted)",
          fontSize: 16,
          border: `1px solid ${isIncome ? "var(--emerald)" : "var(--red)"}20`,
        }}
      >
        {getCategoryIcon(transaction.category)}
      </div>

      <div className="flex-1 min-w-0">
        <p
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "var(--text-primary)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {transaction.description}
        </p>
        {!compact && (
          <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
            {transaction.category}
          </p>
        )}
      </div>

      {!compact && (
        <p style={{ fontSize: 11, color: "var(--text-muted)", flexShrink: 0 }}>
          {formatDate(transaction.date)}
        </p>
      )}

      <p
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: isIncome ? "var(--emerald)" : "var(--red)",
          flexShrink: 0,
          fontFamily: "Syne, sans-serif",
        }}
      >
        {isIncome ? "+" : "-"}
        {formatCurrency(transaction.amount)}
      </p>

      <span
        className="px-2 py-0.5 rounded-full shrink-0"
        style={{
          fontSize: 10,
          fontWeight: 600,
          color: getStatusColor(transaction.status),
          background: `${getStatusColor(transaction.status)}15`,
          border: `1px solid ${getStatusColor(transaction.status)}30`,
          textTransform: "capitalize",
          letterSpacing: "0.05em",
        }}
      >
        {transaction.status}
      </span>
    </div>
  );
};

export default TransactionRow;
