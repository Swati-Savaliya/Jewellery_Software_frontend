import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { MdChevronRight, MdDashboard, MdLogout } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";

function pathToActiveKey(pathname) {
  const seg = pathname.replace(/^\//, "").split("/")[0];
  if (!seg) return "dashboard";
  return seg;
}

/** One line, full text: shrink font from maxPx down to minPx until it fits (ResizeObserver). */
function SingleLineFitText({ children, className = "", minPx = 8, maxPx = 14, flexible = true }) {
  const ref = useRef(null);
  const text = typeof children === "string" ? children : String(children ?? "");

  const fit = useCallback(() => {
    const el = ref.current;
    if (!el || !text) return;
    if (el.clientWidth < 4) return;
    el.style.whiteSpace = "nowrap";
    el.style.fontSize = `${maxPx}px`;
    let size = maxPx;
    while (size > minPx && el.scrollWidth > el.clientWidth + 0.5) {
      size -= 0.5;
      el.style.fontSize = `${size}px`;
    }
  }, [text, minPx, maxPx]);

  useLayoutEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(fit));
    return () => cancelAnimationFrame(id);
  }, [fit]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [fit]);

  return (
    <span
      ref={ref}
      className={["block min-w-0 overflow-hidden", flexible ? "flex-1" : "", className].filter(Boolean).join(" ")}
    >
      {children}
    </span>
  );
}

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: MdDashboard, chevron: false },
  {
    key: "ledger-short",
    label: "Ledger Report",
    shortcutKey: "F1",
    chevron: true,
  },
  {
    key: "daily-balance",
    label: "Daily Balance",
    shortcutKey: "F2",
    chevron: true,
  },
  {
    key: "ledger-details",
    label: "Ledger Details",
    shortcutKey: "F3",
    chevron: true,
  },
  {
    key: "account-summary",
    label: "Account Summary",
    shortcutKey: "F4",
    chevron: false,
  },
  {
    key: "daily-transactions",
    label: "Daily Transactions",
    shortcutKey: "F5",
    chevron: false,
  },
  {
    key: "cash-book",
    label: "Cash Book",
    shortcutKey: "F6",
    chevron: false,
  },
  { key: "gold-book", label: "Gold Book", shortcutKey: "F7", chevron: false },
  { key: "silver-book", label: "Silver Book", shortcutKey: "F8", chevron: false },
  {
    key: "print-mail",
    label: "Print-Mail",
    shortcutKey: "Ctrl+P",
    chevron: false,
    navButtonClassName: ["mt-[210px]"],
  },
];

function ShortcutKeyCap({ label, emphasized, className = "" }) {
  const isChord = String(label).includes("+") || String(label).length > 4;
  return (
    <span
      className={[
        "flex shrink-0 select-none items-center justify-center rounded-lg border bg-gradient-to-b text-[#70563F]",
        isChord
          ? "h-9 min-w-[4rem] px-2 text-xs font-semibold leading-tight tracking-tight"
          : "h-8 min-w-[2.25rem] px-1.5 text-xs font-bold leading-none tracking-tight",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_1px_rgba(0,0,0,0.08)]",
        "transition-[border-color,background-color,color,box-shadow] duration-150",
        emphasized
          ? "border-[#70563F]/45 from-[#FFF6DC] to-[#E8CF7A] text-[#000000] shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_1px_2px_rgba(0,0,0,0.1)]"
          : "border-[#D4C9BE] from-[#FFFCF6] to-[#EDE4D9] group-hover:border-[#70563F]/35 group-hover:text-[#000000]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-hidden
    >
      {label}
    </span>
  );
}

export default function LeftSidebar({ onLogout, brand = "Jewellery ERP" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const activeKey = pathToActiveKey(location.pathname);
  const [hoveredKey, setHoveredKey] = useState(null);

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex h-screen w-[250px] flex-col overflow-hidden bg-white">
      <div className="flex min-h-0 flex-1 flex-col border-r border-[#ECE4D9] px-5 py-6">
        <div className="mb-6 flex min-w-0 shrink-0 items-center gap-3" title={brand}>
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#ECE4D9]/55">
            <span className="text-xl font-bold text-[#70563F]">L</span>
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <SingleLineFitText
              className="font-semibold leading-tight text-[#000000]"
              minPx={11}
              maxPx={18}
            >
              {brand}
            </SingleLineFitText>
          </div>
        </div>

        <nav
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
          onMouseLeave={() => setHoveredKey(null)}
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.key === activeKey;
            const isPrintMail = item.key === "print-mail";
            const showAsSelected =
              isActive &&
              (hoveredKey === null || hoveredKey === item.key);

            const extraNavClass = Array.isArray(item.navButtonClassName)
              ? item.navButtonClassName.join(" ")
              : item.navButtonClassName;

            const idleRow =
              isPrintMail
                ? [
                    "border border-[#e8e4e1] bg-[#f9f7f4] text-[#5d4d44]",
                    "hover:border-[#ddd8d3] hover:bg-[#f0ebe6] hover:text-[#000000]",
                  ].join(" ")
                : [
                    "bg-white text-[#000000]",
                    "hover:bg-[#E1C278] hover:text-[#000000]",
                    "hover:shadow-[0_1px_2px_rgba(0,0,0,0.06)]",
                  ].join(" ");

            const idleLabelIcon = showAsSelected
              ? "text-[#000000]"
              : isPrintMail
                ? "text-[#5d4d44] group-hover:text-[#000000]"
                : "text-[#000000] group-hover:text-[#000000]";

            return (
              <button
                key={item.key}
                type="button"
                onMouseEnter={() => setHoveredKey(item.key)}
                onClick={() => navigate(`/${item.key}`)}
                title={item.label}
                className={[
                  "group flex min-w-0 w-full items-center gap-3 rounded-2xl px-4 py-2.5 text-left font-medium leading-tight",
                  "outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#70563F]/35",
                  "transition-colors duration-150",
                  extraNavClass,
                  showAsSelected
                    ? "border border-[#ECE4D9] bg-[#E1C278] text-[#000000] shadow-[0_1px_2px_rgba(0,0,0,0.08)]"
                    : idleRow,
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {item.shortcutKey ? (
                  <ShortcutKeyCap label={item.shortcutKey} emphasized={showAsSelected} />
                ) : (
                  <Icon
                    className={[
                      "h-5 w-5 shrink-0 transition-colors sm:h-6 sm:w-6",
                      idleLabelIcon,
                    ].join(" ")}
                  />
                )}
                <SingleLineFitText className={idleLabelIcon} minPx={8} maxPx={14}>
                  {item.label}
                </SingleLineFitText>
                {item.chevron ? (
                  <MdChevronRight
                    className={[
                      "h-5 w-5 shrink-0 transition-colors sm:h-6 sm:w-6",
                      showAsSelected
                        ? "text-[#000000]"
                        : isPrintMail
                          ? "text-[#5d4d44]/90 group-hover:text-[#000000]"
                          : "text-[#000000]/70 group-hover:text-[#000000]",
                    ].join(" ")}
                  />
                ) : null}
              </button>
            );
          })}
        </nav>

        <div className="shrink-0">
          <div className="h-px w-full bg-[#ECE4D9]" />
          <button
            type="button"
            onClick={() => onLogout?.()}
            className={[
              "group mt-4 flex min-w-0 w-full items-center gap-3 rounded-2xl px-4 py-2.5 text-left font-semibold leading-tight",
              "border border-[#ECE4D9] bg-[#ECE4D9]/35 text-[#70563F]",
              "transition-colors duration-150",
              "hover:bg-[#ECE4D9]/55 hover:text-[#000000]",
              "outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#70563F]/35",
            ].join(" ")}
          >
            <MdLogout className="h-6 w-6 text-[#70563F] transition-colors group-hover:text-[#000000]" />
            <SingleLineFitText
              className="text-[#70563F] group-hover:text-[#000000]"
              flexible={false}
              minPx={8}
              maxPx={14}
            >
              Logout
            </SingleLineFitText>
          </button>
        </div>
      </div>
    </aside>
  );
}
