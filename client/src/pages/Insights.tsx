import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchTransactions } from "../store/slices/transactionsSlice";
import { fetchSummary } from "../store/slices/summarySlice";
import { usePageTransition } from "../hooks/usePageTransition";
import InsightCard from "../components/ui/InsightCard";
import MonthlyBarChart from "../components/charts/MonthlyBarChart";
import { formatCurrency } from "../utils/formatters";
import { GrTrophy } from "react-icons/gr";
import {
  FaArrowTrendDown,
  FaArrowTrendUp,
  FaMoneyBillTrendUp,
} from "react-icons/fa6";
import { FaCalendarDay } from "react-icons/fa";
import { GiSuitcase, GiThunderBlade } from "react-icons/gi";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Insights = () => {
  // const ref = usePageTransition();
  const dispatch = useAppDispatch();

  const { data: transactions = [] } = useAppSelector((s) => s.transactions);
  const summary = useAppSelector((s) => s.summary);

  useEffect(() => {
    dispatch(fetchTransactions({}));
    dispatch(fetchSummary());
  }, [dispatch]);

  const insights = useMemo(() => {
    if (!transactions.length) return null;

    const expenses = transactions.filter((t) => t.type === "expense");
    const income = transactions.filter((t) => t.type === "income");

    const catTotals: Record<string, number> = {};
    expenses.forEach((t) => {
      catTotals[t.category] = (catTotals[t.category] || 0) + t.amount;
    });
    const topCategory = Object.entries(catTotals).sort(
      ([, a], [, b]) => b - a,
    )[0];

    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${String(
      now.getMonth() + 1,
    ).padStart(2, "0")}`;
    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1);
    const lastMonth = `${lastMonthDate.getFullYear()}-${String(
      lastMonthDate.getMonth() + 1,
    ).padStart(2, "0")}`;

    const thisMonthExp = expenses
      .filter((t) => t.date.startsWith(thisMonth))
      .reduce((s, t) => s + t.amount, 0);

    const lastMonthExp = expenses
      .filter((t) => t.date.startsWith(lastMonth))
      .reduce((s, t) => s + t.amount, 0);

    const momChange =
      lastMonthExp > 0
        ? Math.round(((thisMonthExp - lastMonthExp) / lastMonthExp) * 100)
        : 0;

    const avgExpense =
      expenses.length > 0
        ? expenses.reduce((s, t) => s + t.amount, 0) / expenses.length
        : 0;

    const dayTotals: Record<number, number> = {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
    };
    expenses.forEach((t) => {
      const day = new Date(t.date).getDay();
      dayTotals[day] += t.amount;
    });

    const busiestDay = Object.entries(dayTotals).sort(
      ([, a], [, b]) => b - a,
    )[0];

    const biggestExpense = expenses.sort((a, b) => b.amount - a.amount)[0];

    const incomeSources = new Set(income.map((t) => t.category)).size;

    return {
      topCategory,
      momChange,
      thisMonthExp,
      lastMonthExp,
      avgExpense,
      dayTotals,
      busiestDay,
      biggestExpense,
      incomeSources,
      catTotals,
    };
  }, [transactions]);

  const topCategories = useMemo(() => {
    if (!insights?.catTotals) return [];
    const total = Object.values(insights.catTotals).reduce((s, v) => s + v, 0);
    return Object.entries(insights.catTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([cat, amount]) => ({
        category: cat,
        amount,
        pct: Math.round((amount / total) * 100),
      }));
  }, [insights]);

  const CATEGORY_COLORS = [
    "var(--cyan)",
    "var(--emerald)",
    "var(--amber)",
    "var(--red)",
    "#8B5CF6",
  ];

  if (!insights) {
    return (
      <div
        // ref={ref}
        className="page-wrapper flex items-center justify-center h-64"
      >
        <p
          className="text-[13px] animate-pulse"
          style={{ color: "var(--text-muted)" }}
        >
          Loading insights...
        </p>
      </div>
    );
  }

  return (
    <div /*ref={ref}*/ className="page-wrapper space-y-6">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <InsightCard
          icon={<GrTrophy />}
          label="Top Spending Category"
          value={insights.topCategory?.[0] ?? "—"}
          sub={`${formatCurrency(
            insights.topCategory?.[1] ?? 0,
          )} total spent in this category`}
          color="var(--cyan)"
          delay={0}
        />
        <InsightCard
          icon={
            insights.momChange >= 0 ? <FaArrowTrendUp /> : <FaArrowTrendDown />
          }
          label="Month over Month"
          value={`${insights.momChange >= 0 ? "+" : ""}${insights.momChange}%`}
          sub={`Expenses ${
            insights.momChange >= 0 ? "up" : "down"
          } vs last month — ${formatCurrency(
            insights.lastMonthExp,
          )} → ${formatCurrency(insights.thisMonthExp)}`}
          color={insights.momChange >= 0 ? "var(--red)" : "var(--emerald)"}
          delay={0.1}
        />
        <InsightCard
          icon={<FaCalendarDay />}
          label="Busiest Spend Day"
          value={DAYS[Number(insights.busiestDay?.[0])] ?? "—"}
          sub={`${formatCurrency(insights.busiestDay?.[1] ?? 0)} spent on ${
            DAYS[Number(insights.busiestDay?.[0])]
          }s on average`}
          color="var(--amber)"
          delay={0.2}
        />
        <InsightCard
          icon={<FaMoneyBillTrendUp />}
          label="Avg Expense"
          value={formatCurrency(insights.avgExpense)}
          sub={`Biggest single expense — ${
            insights.biggestExpense?.description ?? "—"
          } at ${formatCurrency(insights.biggestExpense?.amount ?? 0)}`}
          color="var(--red)"
          delay={0.3}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="glass-card p-5 xl:col-span-2 flex flex-col gap-4">
          <div>
            <h2
              className="text-[16px] font-bold text-var(--text-primary)"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              Monthly Comparison
            </h2>
            <p className="text-[12px] text-var(--text-muted) mt-0.5">
              Income vs expenses — side by side per month
            </p>
          </div>
          <MonthlyBarChart data={summary.cashflow ?? []} />
        </div>

        <div className="glass-card p-5 flex flex-col gap-4">
          <div>
            <h2
              className="text-[16px] font-bold text-var(--text-primary)"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              Top Categories
            </h2>
            <p className="text-[12px] text-var(--text-muted) mt-0.5">
              Where your money is going
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {topCategories.map((item, i) => (
              <div key={item.category} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span
                    className="text-[13px] font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {item.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[11px]"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {item.pct}%
                    </span>
                    <span
                      className="text-[12px] font-semibold"
                      style={{
                        color: CATEGORY_COLORS[i],
                        fontFamily: "Syne, sans-serif",
                      }}
                    >
                      {formatCurrency(item.amount)}
                    </span>
                  </div>
                </div>

                <div
                  className="w-full rounded-full overflow-hidden"
                  style={{
                    height: 5,
                    background: "var(--navy-border)",
                  }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${item.pct}%`,
                      background: CATEGORY_COLORS[i],
                      transition: "width 1s ease",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card p-5">
        <div className="mb-5">
          <h2
            className="text-[16px] font-bold text-var(--text-primary)"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            Spending by Day of Week
          </h2>
          <p className="text-[12px] text-var(--text-muted) mt-0.5">
            Which days you spend the most
          </p>
        </div>

        <div className="grid grid-cols-7 gap-3">
          {DAYS.map((day, i) => {
            const amount = insights.dayTotals[i] ?? 0;
            const max = Math.max(...Object.values(insights.dayTotals));
            const intensity = max > 0 ? amount / max : 0;
            const isBusiest = i === Number(insights.busiestDay?.[0]);

            return (
              <div key={day} className="flex flex-col items-center gap-2">
                <span
                  className="text-[11px] font-medium"
                  style={{
                    color: isBusiest ? "var(--cyan)" : "var(--text-muted)",
                  }}
                >
                  {day}
                </span>

                <div
                  className="w-full rounded-xl flex flex-col justify-end overflow-hidden"
                  style={{
                    height: 80,
                    background: "var(--navy)",
                    border: `1px solid ${
                      isBusiest ? "var(--cyan)40" : "var(--navy-border)"
                    }`,
                  }}
                >
                  <div
                    style={{
                      height: `${Math.max(intensity * 100, 4)}%`,
                      background: isBusiest
                        ? "linear-gradient(180deg, var(--cyan), #0099CC)"
                        : `rgba(0, 212, 255, ${0.15 + intensity * 0.4})`,
                      transition: "height 1s ease",
                      borderRadius: "8px 8px 0 0",
                    }}
                  />
                </div>

                <span
                  className="text-[10px]"
                  style={{
                    color: isBusiest ? "var(--cyan)" : "var(--text-muted)",
                    fontFamily: "Syne, sans-serif",
                    fontWeight: isBusiest ? 700 : 400,
                  }}
                >
                  $
                  {amount >= 1000
                    ? `${(amount / 1000).toFixed(1)}k`
                    : amount.toFixed(0)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          {
            label: "Total Transactions",
            value: String(transactions.length),
            icon: "📊",
            color: "var(--cyan)",
          },
          {
            label: "Income Sources",
            value: String(insights.incomeSources),
            icon: <GiSuitcase />,
            color: "var(--emerald)",
          },
          {
            label: "Biggest Expense",
            value: formatCurrency(insights.biggestExpense?.amount ?? 0),
            icon: <GiThunderBlade />,
            color: "var(--red)",
          },
          {
            label: "This Month Spend",
            value: formatCurrency(insights.thisMonthExp),
            icon: <FaCalendarDay />,
            color: "var(--amber)",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="glass-card p-4 flex items-center gap-3"
          >
            <div
              className="flex items-center justify-center rounded-xl shrink-0"
              style={{
                width: 40,
                height: 40,
                background: `${stat.color}15`,
                border: `1px solid ${stat.color}30`,
                fontSize: 18,
              }}
            >
              {stat.icon}
            </div>
            <div>
              <p
                style={{
                  fontSize: 10,
                  color: "var(--text-muted)",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {stat.label}
              </p>
              <p
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontSize: 18,
                  fontWeight: 700,
                  color: stat.color,
                  marginTop: 2,
                }}
              >
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Insights;
