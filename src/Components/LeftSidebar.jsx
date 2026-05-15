import { MdDashboard, MdLogout, MdManageAccounts } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";

function pathToActiveKey(pathname) {
  const seg = pathname.replace(/^\//, "").split("/")[0];
  if (!seg) return "dashboard";
  if (seg === "daily-transaction") return "daily-transactions";
  return seg;
}

export function SingleLineFitText({ children, className = "" }) {
  return <span className={`block min-w-0 flex-1 truncate ${className}`}>{children}</span>;
}

export function ShortcutKeyCap({ label, emphasized }) {
  return (
    <span
      className={[
        "flex h-8 shrink-0 items-center justify-center rounded-lg border px-1.5 text-xs font-bold",
        emphasized ? "border-[#ECE4D9] bg-[#E1C278] text-black" : "border-[#D4C9BE] bg-[#FFFCF6] text-[#70563F]",
      ].join(" ")}
      style={{ minWidth: String(label).length > 3 ? "4rem" : "2.25rem" }}
      aria-hidden
    >
      {label}
    </span>
  );
}

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: MdDashboard },
  { key: "main-master-panel", label: "Main Master Penal", icon: MdManageAccounts },
  { key: "ledger-short", label: "Ledger Report", shortcutKey: "F1" },
  { key: "daily-balance", label: "Daily Balance", shortcutKey: "F2" },
  { key: "ledger-details", label: "Ledger Details", shortcutKey: "F3" },
  { key: "account-summary", label: "Account Summary", shortcutKey: "F4" },
  { key: "daily-transactions", label: "Daily Transactions", shortcutKey: "F5" },
  { key: "cash-book", label: "Cash Book", shortcutKey: "F6" },
  { key: "gold-book", label: "Gold Book", shortcutKey: "F7" },
  { key: "silver-book", label: "Silver Book", shortcutKey: "F8" },
  { key: "print-mail", label: "Print-Mail", shortcutKey: "Ctrl+P", className: "mt-[150px]" },
];

const navBtn = (active) =>
  [
    "flex w-full min-w-0 items-center gap-3 rounded-2xl px-4 py-2.5 text-left text-sm font-medium transition-colors",
    active
      ? "border border-[#ECE4D9] bg-[#E1C278] text-black shadow-sm"
      : "border border-transparent bg-white text-black hover:bg-[#E1C278]",
  ].join(" ");

export default function LeftSidebar({ onLogout, brand = "Jewellery ERP" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const activeKey = pathToActiveKey(location.pathname);

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex h-screen w-[250px] flex-col bg-white">
      <div className="flex min-h-0 flex-1 flex-col border-r border-[#ECE4D9] px-5 py-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#ECE4D9]/55">
            <span className="text-xl font-bold text-[#70563F]">L</span>
          </div>
          <SingleLineFitText className="font-semibold text-black">{brand}</SingleLineFitText>
        </div>

        <nav className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active = item.key === activeKey;
            const Icon = item.icon;

            return (
              <button
                key={item.key}
                type="button"
                title={item.label}
                className={[navBtn(active), item.className].filter(Boolean).join(" ")}
                onClick={() => navigate(`/${item.key}`)}
              >
                {item.shortcutKey ? (
                  <ShortcutKeyCap label={item.shortcutKey} emphasized={active} />
                ) : (
                  <Icon className="h-5 w-5 shrink-0" />
                )}
                <SingleLineFitText>{item.label}</SingleLineFitText>
              </button>
            );
          })}
        </nav>

        <div className="mt-4 border-t border-[#ECE4D9] pt-4">
          <button
            type="button"
            onClick={() => onLogout?.()}
            className="flex w-full items-center gap-3 rounded-2xl border border-[#ECE4D9] bg-[#ECE4D9]/35 px-4 py-2.5 text-sm font-semibold text-[#70563F] hover:bg-[#ECE4D9]/55 hover:text-black"
          >
            <MdLogout className="h-6 w-6 shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
