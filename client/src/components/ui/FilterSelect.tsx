export const FilterSelect = ({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    style={{
      background: "var(--navy)",
      border: "1px solid var(--navy-border)",
      borderRadius: 10,
      padding: "8px 12px",
      color: "var(--text-primary)",
      fontSize: 13,
      fontFamily: "DM Sans, sans-serif",
      outline: "none",
      cursor: "pointer",
      appearance: "none",
    }}
  >
    {options.map((o) => (
      <option key={o.value} value={o.value}>
        {o.label}
      </option>
    ))}
  </select>
);
