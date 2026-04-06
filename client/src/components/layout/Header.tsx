import { CiLight } from "react-icons/ci";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { toggleDarkMode } from "../../store/slices/uiSlice";
import RoleBadge from "../ui/RoleBadge";
import { MdDarkMode } from "react-icons/md";
import { IoNotificationsOutline } from "react-icons/io5";
import { FaSearchDollar } from "react-icons/fa";

interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => {
  const dispatch = useAppDispatch();
  const sidebarOpen = useAppSelector((s) => s.ui.sidebarOpen);
  const isDark = useAppSelector((s) => s.ui.isDark);

  return (
    <header
      className="fixed top-0 right-0 z-30 flex items-center justify-between px-6"
      style={{
        left: sidebarOpen ? 240 : 72,
        height: 72,
        background: isDark
          ? "rgba(8, 13, 26, 0.9)"
          : "rgba(255, 255, 255, 0.85)",
        borderBottom: "1px solid var(--navy-border)",
        backdropFilter: "blur(12px)",
        transition: "left 0.35s ease",
      }}
    >
      <h1
        style={{
          fontFamily: "Syne, sans-serif",
          fontWeight: 700,
          fontSize: 22,
          color: "var(--text-primary)",
        }}
      >
        {title}
      </h1>

      <div className="flex items-center gap-3">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl"
          style={{
            background: "var(--navy-card)",
            border: "1px solid var(--navy-border)",
            width: 200,
          }}
        >
          <span style={{ color: "var(--text-muted)", fontSize: 14 }}>
            <FaSearchDollar />
          </span>
          <input
            type="text"
            placeholder="Search..."
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--text-primary)",
              fontSize: 13,
              fontFamily: "DM Sans, sans-serif",
              width: "100%",
            }}
          />
        </div>

        <RoleBadge />

        <button
          onClick={() => dispatch(toggleDarkMode())}
          className="flex items-center justify-center rounded-xl transition-all duration-200"
          style={{
            width: 38,
            height: 38,
            background: "var(--navy-card)",
            border: "1px solid var(--navy-border)",
            cursor: "pointer",
            fontSize: 16,
          }}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? <MdDarkMode /> : <CiLight />}
        </button>

        <button
          className="flex items-center justify-center rounded-xl"
          style={{
            width: 38,
            height: 38,
            background: "var(--navy-card)",
            border: "1px solid var(--navy-border)",
            cursor: "pointer",
            fontSize: 16,
            position: "relative",
          }}
        >
          <IoNotificationsOutline />

          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ background: "var(--red)" }}
          />
        </button>

        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
          style={{
            background: "var(--navy-card)",
            border: "1px solid var(--navy-border)",
            cursor: "pointer",
          }}
        >
          <div
            className="flex items-center justify-center rounded-full flex-shrink-0"
            style={{
              width: 28,
              height: 28,
              background:
                "linear-gradient(135deg, var(--cyan), var(--emerald))",
              fontSize: 12,
              fontWeight: 700,
              color: "#0A0F1E",
              fontFamily: "Syne, sans-serif",
            }}
          >
            A
          </div>
          <div className="hidden sm:block">
            <p
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: "var(--text-primary)",
                lineHeight: 1,
              }}
            >
              Alex Dev
            </p>
            <p
              style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}
            >
              User
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
