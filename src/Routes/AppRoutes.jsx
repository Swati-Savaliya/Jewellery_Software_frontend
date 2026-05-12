import { Navigate, Route, Routes } from "react-router-dom";
import ForgotPassword from "../Auth/ForgotPassword";
import Login from "../Auth/Login";
import Header from "../Components/Header";
import LeftSidebar from "../Components/LeftSidebar";
import Dashboard from "../Pages/Dashboard";

function MainShell({ children }) {
  return (
    <div className="min-h-screen min-w-0 pl-[250px]">
      <LeftSidebar />
      <Header />
      {children}
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/dashboard" element={<MainShell><Dashboard /></MainShell>} />
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}
