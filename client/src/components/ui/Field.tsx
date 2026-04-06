export const Field = ({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) => {
  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "var(--navy)",
    border: `1px solid ${error ? "var(--red) " : "var(--navy-border)"}`,
    borderRadius: 10,
    padding: "9px 12px",
    color: "var(--text-primary)",
    fontSize: 13,
    outline: "none",
    fontFamily: "DM Sans, sans-serif",
    appearance: "none" as const,
  };
  return (
    <div className="flex flex-col gap-1.5">
      <label
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: "var(--text-secondary)",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </label>
      {(() => {
        const child = children as React.ReactElement<any>;
        return <child.type {...child.props} style={inputStyle} />;
      })()}
      {error && <p style={{ fontSize: 11, color: "var(--red)" }}>{error}</p>}
    </div>
  );
};
