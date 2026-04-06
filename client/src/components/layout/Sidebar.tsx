import { NavLink, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { toggleSidebar } from "../../store/slices/uiSlice";
import { useEffect } from "react";
import gsap from "gsap";

const navItems = [
  { path: "/", label: "Dashboard", icon: "⊞" },
  {
    path: "/transactions",
    label: "Transactions",
    icon: "↕",
  },
  {
    path: "/insights",
    label: "Insights",
    icon: "◎",
  },
];

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);
  const location = useLocation();
  const isDark = useAppSelector((s) => s.ui.isDark);

  useEffect(() => {
    gsap.to(".sidebar", {
      width: sidebarOpen ? 240 : 72,
      duration: 0.35,
      ease: "power2.inOut",
    });
    gsap.to(".sidebar-label", {
      opacity: sidebarOpen ? 1 : 0,
      x: sidebarOpen ? 0 : -8,
      duration: 0.2,
      ease: "power2.out",
    });
  }, [sidebarOpen]);

  return (
    <aside
      className="sidebar flex flex-col h-full fixed left-0 top-0 z-40"
      style={{
        width: 240,
        background: isDark ? "var(--navy-card)" : "#FFFFFF",
        borderRight: "1px solid var(--navy-border)",
        overflow: "hidden",
        boxShadow: isDark ? "none" : "2px 0 16px rgba(10, 20, 60, 0.08)",
      }}
    >
      <div
        className="flex items-center gap-3 px-5 py-6"
        style={{ borderBottom: "1px solid var(--navy-border)", minHeight: 72 }}
      >
        <div
          className="flex items-center justify-center rounded-xl shrink-0"
          style={{
            width: 36,
            height: 36,
            background: "linear-gradient(135deg, var(--cyan), #0099CC)",
            fontSize: 16,
            fontWeight: 800,
            color: "#0A0F1E",
            fontFamily: "Syne, sans-serif",
          }}
        >
          F
        </div>
        <span
          className="sidebar-label"
          style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 700,
            fontSize: 18,
            color: "var(--text-primary)",
            whiteSpace: "nowrap",
          }}
        >
          Finance Track
        </span>
      </div>
      <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
        <p
          className="sidebar-label px-2 mb-2"
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: "var(--text-muted)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          Menu
        </p>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200"
              style={{
                background: isActive ? "var(--cyan-muted)" : "transparent",
                border: `1px solid ${isActive ? "var(--cyan)" + "30" : "transparent"}`,
                color: isActive ? "var(--cyan)" : "var(--text-secondary)",
                textDecoration: "none",
                fontFamily: "DM Sans, sans-serif",
                fontWeight: isActive ? 500 : 400,
                fontSize: 14,
              }}
            >
              <span
                className="flex shrink-0 items-center justify-center"
                style={{ width: 20, height: 20, fontSize: 16 }}
              >
                {item.icon}
              </span>
              <span className="sidebar-label" style={{ whiteSpace: "nowrap" }}>
                {item.label}
              </span>

              {isActive && (
                <span
                  className="sidebar-label ml-auto w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: "var(--cyan)" }}
                />
              )}
            </NavLink>
          );
        })}
      </nav>
      <div
        className="px-3 py-4"
        style={{ borderTop: "1px solid var(--navy-border" }}
      >
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full transition-all duration-200"
          style={{
            background: "transparent",
            border: "1px solid var(--navy-border)",
            color: "var(--text-secondary)",
            cursor: "pointer",
            fontFamily: "DM Sans, sans-serif",
            fontSize: 14,
          }}
        >
          <span style={{ fontSize: 16, flexShrink: 0 }}>
            {sidebarOpen ? "←" : "→"}
          </span>
          <span className="sidebar-label" style={{ whiteSpace: "nowrap" }}>
            Collapse
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
