import { NavLink, useLocation } from "react-router-dom"

const navItems = [
  { path: "/", label: "Dashboard", icon: "⊞" },
  { path: "/transactions", label: "Transactions", icon: "↕" },
  { path: "/insights", label: "Insights", icon: "◎" },
]

const BottomNav = () => {
  const location = useLocation()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden"
      style={{
        background: "rgba(13, 20, 38, 0.95)",
        borderTop: "1px solid var(--navy-border)",
        backdropFilter: "blur(12px)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {navItems.map((item) => {
        const isActive = location.pathname === item.path

        return (
          <NavLink
            key={item.path}
            to={item.path}
            className="flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-all duration-200"
            style={{
              textDecoration: "none",
              color: isActive ? "var(--cyan)" : "var(--text-muted)",
            }}
          >
            <span style={{ fontSize: 20, lineHeight: 1 }}>{item.icon}</span>
            <span
              style={{
                fontSize: 10,
                fontWeight: isActive ? 600 : 400,
                fontFamily: "DM Sans, sans-serif",
                letterSpacing: "0.03em",
              }}
            >
              {item.label}
            </span>

            {isActive && (
              <span
                className="absolute top-1 w-1 h-1 rounded-full"
                style={{ background: "var(--cyan)" }}
              />
            )}
          </NavLink>
        )
      })}
    </nav>
  )
}

export default BottomNav