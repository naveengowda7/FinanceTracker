import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface CategoryDonutProps {
  data: { category: string; amount: number }[];
}

const COLORS = [
  "#00D4FF",
  "#00E5A0",
  "#FF4D6D",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#10B981",
];

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="glass-card p-3">
      <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>
        {payload[0].name}
      </p>
      <p
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: "var(--text-primary)",
          marginTop: 2,
        }}
      >
        ${payload[0].value.toLocaleString()}
      </p>
    </div>
  );
};

const CategoryDonut = ({ data }: CategoryDonutProps) => {
  if (!data.length)
    return (
      <div
        className="flex items-center justify-center h-48"
        style={{ color: "var(--text-muted)" }}
      >
        No data yet
      </div>
    );

  const topCategories = data.slice(0, 6);

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={topCategories}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={3}
          dataKey="amount"
          nameKey="category"
          animationBegin={200}
          animationDuration={1000}
        >
          {topCategories.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
              opacity={0.9}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: 11, color: "#8896B3" }}
          formatter={(value) =>
            value.length > 12 ? value.slice(0, 12) + "…" : value
          }
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CategoryDonut;
