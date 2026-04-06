import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatMonth } from "../../utils/formatters";

interface CashflowChartProps {
  data: { month: string; income: number; expenses: number }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="glass-card p-3" style={{ minWidth: 160 }}>
      <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6 }}>
        {formatMonth(label)}
      </p>
      {payload.map((entry: any) => (
        <div
          key={entry.name}
          className="flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: entry.color }}
            />
            <span
              style={{
                fontSize: 12,
                color: "var(--text-secondary)",
                textTransform: "capitalize",
              }}
            >
              {entry.name}
            </span>
          </div>
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "var(--text-primary)",
            }}
          >
            ${entry.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

const CashflowChart = ({ data }: CashflowChartProps) => {
  if (!data.length)
    return (
      <div
        className="flex items-center justify-center h-48"
        style={{ color: "var(--text-muted)" }}
      >
        No data yet
      </div>
    );

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart
        data={data}
        margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
      >
        <defs>
          <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00E5A0" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#00E5A0" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FF4D6D" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#FF4D6D" stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#1E2A45"
          vertical={false}
        />

        <XAxis
          dataKey="month"
          tickFormatter={formatMonth}
          tick={{ fontSize: 11, fill: "#8896B3" }}
          axisLine={false}
          tickLine={false}
        />

        <YAxis
          tick={{ fontSize: 11, fill: "#8896B3" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) =>
            `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`
          }
        />

        <Tooltip content={<CustomTooltip />} />

        <Legend
          wrapperStyle={{ fontSize: 12, color: "#8896B3", paddingTop: 12 }}
        />

        <Area
          type="monotone"
          dataKey="income"
          stroke="#00E5A0"
          strokeWidth={2}
          fill="url(#incomeGrad)"
          dot={false}
          activeDot={{ r: 4, fill: "#00E5A0" }}
        />
        <Area
          type="monotone"
          dataKey="expenses"
          stroke="#FF4D6D"
          strokeWidth={2}
          fill="url(#expenseGrad)"
          dot={false}
          activeDot={{ r: 4, fill: "#FF4D6D" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default CashflowChart;
