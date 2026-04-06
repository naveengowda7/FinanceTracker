import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchTransactions } from "../store/slices/transactionsSlice";
import { fetchSummary } from "../store/slices/summarySlice";
import { usePageTransition } from "../hooks/usePageTransition";
import StatCard from "../components/ui/StatCard";
import CreditCard from "../components/ui/CreditCard";
import TransactionRow from "../components/ui/TransactionRow";
import CashflowChart from "../components/charts/CashflowChart";
import CategoryDonut from "../components/charts/CategoryDonut";
import { Link } from "react-router-dom";
import { BiMoviePlay } from "react-icons/bi";
import { GiLoveSong } from "react-icons/gi";
import { FaArrowRight, FaCloudDownloadAlt } from "react-icons/fa";
import { IoIosColorPalette } from "react-icons/io";
import { IoCard } from "react-icons/io5";
import {
  FaArrowTrendDown,
  FaArrowTrendUp,
  FaArrowUpRightDots,
} from "react-icons/fa6";
import { PiEmptyBold, PiTargetBold } from "react-icons/pi";

const upcomingPayments = [
  { name: "Netflix", icon: <BiMoviePlay />, amount: 15.99, date: "Nov 20" },
  { name: "Spotify", icon: <GiLoveSong />, amount: 9.99, date: "Nov 22" },
  {
    name: "iCloud",
    icon: <FaCloudDownloadAlt />,
    amount: 2.99,
    date: "Nov 25",
  },
  {
    name: "Adobe CC",
    icon: <IoIosColorPalette />,
    amount: 54.99,
    date: "Dec 01",
  },
];

const Dashboard = () => {
  // const ref = usePageTransition();
  const dispatch = useAppDispatch();

  const { data: transactions, loading: txLoading } = useAppSelector(
    (s) => s.transactions,
  );
  const summary = useAppSelector((s) => s.summary);

  useEffect(() => {
    dispatch(fetchTransactions({}));
    dispatch(fetchSummary());
  }, [dispatch]);

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div /*ref={ref}*/ className="page-wrapper">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Balance"
          value={summary.totalBalance}
          color="var(--cyan)"
          icon={<IoCard />}
          change={12.4}
        />
        <StatCard
          label="Total Income"
          value={summary.totalIncome}
          color="var(--emerald)"
          icon={<FaArrowTrendUp />}
          change={7.9}
        />
        <StatCard
          label="Total Expenses"
          value={summary.totalExpenses}
          color="var(--red)"
          icon={<FaArrowTrendDown />}
          change={-3.6}
        />
        <StatCard
          label="Savings Rate"
          value={summary.savingsRate}
          prefix=""
          suffix="%"
          color="var(--amber)"
          icon={<PiTargetBold />}
          change={2.1}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
        <div className="glass-card p-5 xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontSize: 16,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                }}
              >
                Cashflow
              </h2>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--text-muted)",
                  marginTop: 2,
                }}
              >
                Income vs Expenses over time
              </p>
            </div>
          </div>

          {summary.loading ? (
            <div className="flex items-center justify-center h-48">
              <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
                Loading...
              </p>
            </div>
          ) : (
            <CashflowChart data={summary.cashflow} />
          )}
        </div>

        <div className="flex flex-col gap-4">
          <CreditCard balance={summary.totalBalance} />

          <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-3">
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-secondary)",
                  fontWeight: 500,
                }}
              >
                Budget Used
              </p>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--cyan)",
                  fontFamily: "Syne, sans-serif",
                }}
              >
                {summary.savingsRate}%
              </p>
            </div>

            <div
              className="w-full rounded-full"
              style={{ height: 6, background: "var(--navy-border)" }}
            >
              <div
                className="rounded-full transition-all duration-1000"
                style={{
                  height: "100%",
                  width: `${Math.min(100 - summary.savingsRate, 100)}%`,
                  background:
                    "linear-gradient(90deg, var(--cyan), var(--emerald))",
                }}
              />
            </div>

            <div className="flex items-center justify-between mt-2">
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                Spent ${summary.totalExpenses?.toLocaleString()}
              </span>
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                Saved ${summary.totalBalance?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="glass-card p-5">
          <h2
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: 16,
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: 4,
            }}
          >
            Spending Breakdown
          </h2>
          <p
            style={{
              fontSize: 12,
              color: "var(--text-muted)",
              marginBottom: 16,
            }}
          >
            By category this period
          </p>

          {summary.loading ? (
            <div className="flex items-center justify-center h-48">
              <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
                Loading...
              </p>
            </div>
          ) : (
            <CategoryDonut data={summary.categoryBreakdown} />
          )}
        </div>

        <div className="glass-card p-5 xl:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h2
              style={{
                fontFamily: "Syne, sans-serif",
                fontSize: 16,
                fontWeight: 700,
                color: "var(--text-primary)",
              }}
            >
              Recent Transactions
            </h2>
            <Link
              to="/transactions"
              style={{
                fontSize: 12,
                color: "var(--cyan)",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              See all <FaArrowRight />
            </Link>
          </div>

          {txLoading ? (
            <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
              Loading...
            </p>
          ) : recentTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 gap-2">
              <span style={{ fontSize: 32 }}><PiEmptyBold />
</span>
              <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
                No transactions yet
              </p>
            </div>
          ) : (
            <div>
              {recentTransactions.map((tx) => (
                <TransactionRow key={tx.id} transaction={tx} compact />
              ))}
            </div>
          )}
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2
              style={{
                fontFamily: "Syne, sans-serif",
                fontSize: 16,
                fontWeight: 700,
                color: "var(--text-primary)",
              }}
            >
              Upcoming Payments
            </h2>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
              {upcomingPayments.length} due
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {upcomingPayments.map((payment, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{
                  background: "var(--navy)",
                  border: "1px solid var(--navy-border)",
                }}
              >
                <span
                  className="flex items-center justify-center rounded-xl shrink-0"
                  style={{
                    width: 36,
                    height: 36,
                    background: "var(--navy-card)",
                    fontSize: 16,
                    border: "1px solid var(--navy-border)",
                  }}
                >
                  {payment.icon}
                </span>

                <div className="flex-1">
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: "var(--text-primary)",
                    }}
                  >
                    {payment.name}
                  </p>
                  <p
                    style={{
                      fontSize: 11,
                      color: "var(--text-muted)",
                      marginTop: 1,
                    }}
                  >
                    Due {payment.date}
                  </p>
                </div>

                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--red)",
                    fontFamily: "Syne, sans-serif",
                  }}
                >
                  -${payment.amount}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
