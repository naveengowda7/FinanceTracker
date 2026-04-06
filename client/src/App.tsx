import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Insights from "./pages/Insights";
import { useAppSelector } from "./store/hooks";

function App() {
  const isDark = useAppSelector((s) => s.ui.isDark);
  return (
    <div
      className={isDark ? "theme-dark" : "theme-light"}
      style={{
        minHeight: "100vh",
        background: "var(--navy)",
        transition: "background 0.3s ease, color 0.3s ease",
      }}
    >
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/insights" element={<Insights />} />
            <Route
              path="*"
              element={
                <div
                  style={{
                    textAlign: "center",
                    padding: "4rem",
                    color: "var(--text-secondary)",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "Syne, sans-serif",
                      fontSize: 48,
                      fontWeight: 800,
                    }}
                  >
                    404
                  </p>
                  <p style={{ marginTop: 8 }}>Page not found</p>
                </div>
              }
            />
          </Routes>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;
