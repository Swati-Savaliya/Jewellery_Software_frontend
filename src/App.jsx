import "./App.css";
import { useLocation, useNavigate } from "react-router-dom";
import ForgotPassword from "./Auth/ForgotPassword";
import Login from "./Auth/Login";
import Header from "./Components/Header";
import LeftSidebar from "./Components/LeftSidebar";
import MasterPanelLayout from "./Layouts/MasterPanelLayout";
import Dashboard from "./Pages/Dashboard";

export default function App() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  if (pathname === "/login") {
    return <Login />;
  }
  if (pathname === "/forgot-password") {
    return <ForgotPassword />;
  }

  const logout = () => navigate("/login");

  /** Main Master panel; Daily Transaction opens with Voucher rail + tab pre-selected. */
  const isMasterPanelRoute =
    pathname === "/master-panel" || pathname === "/main-master-panel";
  const isDailyTransactionRoute =
    pathname === "/daily-transaction" || pathname === "/daily-transactions";

  if (isDailyTransactionRoute) {
    return (
      <MasterPanelLayout
        key="shell-daily-tx"
        initialNavId="voucher"
        onLogout={logout}
        onMasterExit={() => navigate("/")}
      />
    );
  }

  if (isMasterPanelRoute) {
    return (
      <MasterPanelLayout
        key="shell-master"
        onLogout={logout}
        onMasterExit={() => navigate("/")}
      />
    );
  }

  return (
    <div className="flex min-h-dvh w-full max-w-none min-w-0 flex-col overflow-x-hidden pl-[250px]">
      <LeftSidebar onLogout={logout} />
      <Header onLogout={logout} />
      <main className="w-full min-w-0 flex-1 max-w-none">
        <Dashboard />
      </main>
    </div>
  );
}
