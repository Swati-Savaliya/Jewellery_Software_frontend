import { useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LeftSidebar from "../Components/LeftSidebar";
import MasterHeader from "../Components/MasterHeader";
import VoucherNavRail from "../Components/VoucherNavRail";
import DailyTransaction from "../Pages/DailyTransaction";

/** Master shell: `/main-master-panel` (Maintain default) or `/daily-transaction*` (Voucher + Daily Transaction). */
export default function MasterPanelLayout({ children = null, onLogout, onMasterExit, initialNavId = "maintain" }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [activeNavId, setActiveNavId] = useState(initialNavId);
  const voucherMode = activeNavId === "voucher";

  const onActiveNavChange = useCallback(
    (id) => {
      setActiveNavId(id);
      const onDailyRoute =
        pathname === "/daily-transaction" || pathname === "/daily-transactions";
      if (onDailyRoute && id !== "voucher") {
        navigate("/main-master-panel");
      }
    },
    [navigate, pathname],
  );

  return (
    <div className="flex min-h-dvh w-full max-w-none min-w-0 flex-col overflow-x-hidden pl-[250px]">
      {voucherMode ? <VoucherNavRail /> : <LeftSidebar onLogout={onLogout} />}
      <MasterHeader
        onExit={onMasterExit}
        activeNavId={activeNavId}
        onActiveNavChange={onActiveNavChange}
      />
      <main className="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden bg-[#f9f9f9] pt-16">
        <div className="flex h-full min-h-0 flex-1 flex-col">
          {activeNavId === "voucher" ? <DailyTransaction /> : children}
        </div>
      </main>
    </div>
  );
}
