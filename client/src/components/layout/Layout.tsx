import { useAppSelector } from "../../store/hooks";
import Sidebar from "./Sidebar";
import Header from "./Header";
import BottomNav from "./BottomNav";
import { useLocation } from "react-router-dom";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/transactions": "Transactions",
  "/insights": "Insights",
};

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const sidebarOpen = useAppSelector((s) => s.ui.sidebarOpen);
  const location = useLocation();
  const title = pageTitles[location.pathname] || "FinTrack";

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "var(--navy)" }}
    >
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div
        className="flex flex-col flex-1 overflow-hidden"
        style={{
          marginLeft: 0,
          transition: "margin-left 0.35s ease",
        }}
      >
        <div
          className="hidden md:flex flex-col flex-1 overflow-hidden h-screen"
          style={{
            marginLeft: sidebarOpen ? 250 : 72,
            transition: "margin-left 0.35s ease",
          }}
        >
          <Header title={title} />
          <main className="flex-1 overflow-y-auto" style={{ paddingTop: 72 }}>
            <div className="p-6">{children}</div>
          </main>
        </div>

        <div className="flex md:hidden flex-col flex-1 overflow-hidden h-screen">
          <div
            className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4"
            style={{
              height: 60,
              background: "rgba(10, 15, 30, 0.95)",
              borderBottom: "1px solid var(--navy-border)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div className="flex items-center gap-2">
              <div
                className="flex items-center justify-center rounded-xl"
                style={{
                  width: 32,
                  height: 32,
                  background: "linear-gradient(135deg, var(--cyan), #0099CC)",
                  fontSize: 14,
                  fontWeight: 800,
                  color: "#0A0F1E",
                  fontFamily: "Syne, sans-serif",
                }}
              >
                F
              </div>
              <span
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontWeight: 700,
                  fontSize: 16,
                  color: "var(--text-primary)",
                }}
              >
                FinTrack
              </span>
            </div>

            <h1
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 700,
                fontSize: 16,
                color: "var(--text-primary)",
              }}
            >
              {title}
            </h1>

            <div style={{ width: 60 }} />
          </div>

          <main
            className="flex-1 overflow-y-auto"
            style={{ paddingTop: 60, paddingBottom: 80 }}
          >
            <div className="p-4">{children}</div>
          </main>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Layout;
