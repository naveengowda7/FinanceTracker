import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatMonth } from "../../utils/formatters";

interface MonthlyBarChartProps {
  data: { month: string; income: number; expenses: number }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="glass-card p-3" style={{ minWidth: 160 }}>
      <p
        style={{
          fontSize: 11,
          color: "var(--text-muted)",
          marginBottom: 6,
        }}
      >
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
      <div
        className="mt-2 pt-2"
        style={{ borderTop: "1px solid var(--navy-border)" }}
      >
        <div className="flex items-center justify-between">
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Net</span>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color:
                payload[0]?.value - payload[1]?.value >= 0
                  ? "var(--emerald)"
                  : "var(--red)",
              fontFamily: "Syne, sans-serif",
            }}
          >
            ${(payload[0]?.value - payload[1]?.value).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

const MonthlyBarChart = ({ data }: MonthlyBarChartProps) => {
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
    <ResponsiveContainer width="100%" height={240}>
      <BarChart
        data={data}
        margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
        barCategoryGap="30%"
        barGap={4}
      >
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
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "#1E2A4520" }} />
        <Legend
          wrapperStyle={{ fontSize: 12, color: "#8896B3", paddingTop: 12 }}
        />
        <Bar
          dataKey="income"
          fill="#00E5A0"
          radius={[4, 4, 0, 0]}
          animationDuration={1000}
          animationBegin={200}
        />
        <Bar
          dataKey="expenses"
          fill="#FF4D6D"
          radius={[4, 4, 0, 0]}
          animationDuration={1000}
          animationBegin={400}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MonthlyBarChart;
