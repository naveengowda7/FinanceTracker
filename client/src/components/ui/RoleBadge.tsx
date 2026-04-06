import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setRole } from "../../store/slices/roleSlice";

const RoleBadge = () => {
  const dispatch = useAppDispatch();
  const role = useAppSelector((state) => state.role.current);

  const handleToggle = () => {
    dispatch(setRole(role === "admin" ? "viewer" : "admin"));
  };

  return (
    <div className="flex items-center gap-3">
      <span style={{ color: "var(--text-secondary)", fontSize: "12px" }}>
        Role
      </span>
      <button
        onClick={handleToggle}
        className="flex items-center gap-2 px-3 py-1.6 rounded-full transition-all duration-300"
        style={{
          background:
            role === "admin" ? "var(--cyan-muted)" : "var(--navy-border)",
          border: `1px solid ${role === "admin" ? "var(--cyan)" : "var(--navy-border)"}`,
          fontSize: "13px",
          fontWeight: 500,
          color: role === "admin" ? "var(--cyan)" : "var(--text-secondary)",
          cursor: "pointer",
          fontFamily: "DM Sans, sans-serif",
        }}
      >
        <span
          className="w-2 h-2 rounded-full"
          style={{
            background: role === "admin" ? "var(--cyan)" : "var(--text-muted)",
          }}
        />
        {role === "admin" ? "Admin" : "Viewer"}
      </button>
    </div>
  );
};

export default RoleBadge;
