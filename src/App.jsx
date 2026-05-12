import "./App.css";
import { useLocation, useNavigate } from "react-router-dom";
import ForgotPassword from "./Auth/ForgotPassword";
import Login from "./Auth/Login";
import Header from "./Components/Header";
import LeftSidebar from "./Components/LeftSidebar";
import Dashboard from "./Pages/Dashboard";
import MasterPenal from "./Pages/MasterPenal";

export default function App() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  if (pathname === "/login") {
    return <Login />;
  }
  if (pathname === "/forgot-password") {
    return <ForgotPassword />;
  }
  if (pathname === "/master-panel") {
      return <MasterPenal />;
    }

  const logout = () => navigate("/login");

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
