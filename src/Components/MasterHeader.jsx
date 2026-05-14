import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdDiamond, MdSearch } from "react-icons/md";
import MaintainDropdown from "./MaintainDropdown";

/** Top menu labels — placeholders until modules wire in (no route change). */
const NAV_ITEMS = [
  { id: "maintain", label: "Maintain" },
  { id: "voucher", label: "Voucher" },
  { id: "feeding", label: "Feeding" },
  { id: "reports", label: "Reports" },
  { id: "tagging", label: "Taging" },
  { id: "utilities", label: "Utilities" },
];

const navBase =
  [
    "group relative shrink-0 whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-semibold tracking-tight outline-none",
    "transition-[color,background-color,box-shadow,transform] duration-200 ease-out",
    "active:scale-[0.98]",
    "focus-visible:ring-2 focus-visible:ring-[#70563F]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F9F9F9]",
  ].join(" ");

function navItemClassName(isActive) {
  const underline = [
    "after:pointer-events-none after:absolute after:bottom-1 after:left-1/2 after:h-[2px] after:-translate-x-1/2 after:rounded-full",
    "after:bg-gradient-to-r after:from-[#d4af37] after:via-[#c9a227] after:to-[#b88920] after:transition-[width,opacity] after:duration-200",
  ].join(" ");

  if (isActive) {
    return [
      navBase,
      "border border-[#ECE4D9]/90 bg-[#E1C278]/55 text-[#000000] shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_1px_2px_rgba(0,0,0,0.06)]",
      underline,
      "after:w-[72%] after:opacity-100",
    ].join(" ");
  }
  return [
    navBase,
    "border border-transparent text-[#000000] hover:bg-[#ECE4D9]/35",
    underline,
    "after:w-0 after:opacity-0 hover:after:w-[72%] hover:after:opacity-100",
  ].join(" ");
}

const HOVER_CLOSE_MAINTAIN_MS = 280;

const exitBtnClass =
  [
    "shrink-0 rounded-lg border border-[#ECE4D9] bg-[#F9F9F9] px-5 py-2 text-sm font-semibold tracking-tight text-[#70563F]",
    "shadow-[0_1px_0_0_rgba(0,0,0,0.02)] transition-[color,background-color,border-color,transform,box-shadow] duration-200 ease-out",
    "hover:border-[#d4c4b0] hover:bg-white hover:text-[#000000] hover:shadow-[0_2px_8px_-2px_rgba(74,56,41,0.08)]",
    "focus-visible:ring-2 focus-visible:ring-[#70563F]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F9F9F9]",
    "active:scale-[0.98]",
  ].join(" ");

/**
 * Master bar — ERP tones (`#F9F9F9` / `#ECE4D9`) with selectable nav + refreshed polish.
 */
export default function MasterHeader({ onExit, activeNavId, onActiveNavChange }) {
  const navigate = useNavigate();
  const searchId = useId();
  const maintainAnchorRef = useRef(null);
  const [maintainOpen, setMaintainOpen] = useState(false);
  const [maintainHighlight, setMaintainHighlight] = useState("accounts");
  const maintainHoverTimers = useRef({ close: null });

  const clearMaintainHoverTimers = useCallback(() => {
    const { close } = maintainHoverTimers.current;
    if (close != null) window.clearTimeout(close);
    maintainHoverTimers.current = { close: null };
  }, []);

  /** Leave Maintain control (portaled menu cancels this on enter). */
  const armCloseMaintainMenu = useCallback(() => {
    const t = maintainHoverTimers.current;
    if (t.close != null) window.clearTimeout(t.close);
    t.close = window.setTimeout(() => {
      maintainHoverTimers.current.close = null;
      setMaintainOpen(false);
    }, HOVER_CLOSE_MAINTAIN_MS);
  }, []);

  /** Pointer entered portaled menu — cancel pending close (gap between button and menu). */
  const cancelCloseMaintainMenu = useCallback(() => {
    const t = maintainHoverTimers.current;
    if (t.close != null) {
      window.clearTimeout(t.close);
      t.close = null;
    }
  }, []);

  useEffect(() => () => clearMaintainHoverTimers(), [clearMaintainHoverTimers]);

  const handleExit = () => {
    clearMaintainHoverTimers();
    if (typeof onExit === "function") {
      onExit();
      return;
    }
    navigate("/");
  };

  return (
    <header
      className="fixed left-[250px] right-0 top-0 z-40 border-b border-[#ECE4D9] bg-[#F9F9F9] shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_2px_12px_-4px_rgba(74,56,41,0.06)]"
      role="banner"
    >
      <nav
        className="relative mx-auto flex h-16 min-h-16 max-w-[1920px] items-center gap-2 px-3 sm:gap-4 sm:px-5 lg:px-10"
        aria-label="Master menu"
      >
        {/* Left: mark + title stack (reference: diamond, JEWELLERY ERP, Master PANEL) */}
        <div className="flex min-w-0 shrink-0 items-center gap-2.5 border-r border-[#ECE4D9] pr-2.5 sm:gap-3 sm:pr-5">
          <span
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#ECE4D9] bg-white shadow-[inset_0_1px_0_rgba(255,255,255,1),0_1px_3px_rgba(74,56,41,0.06)] transition-transform duration-200 ease-out hover:scale-[1.03]"
            aria-hidden
          >
            <MdDiamond className="h-[1.45rem] w-[1.45rem] text-[#D4AF37]" aria-hidden />
          </span>
          <div className="hidden min-w-0 sm:block">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#70563F]">Jewellery ERP</p>
            <p className="mt-0.5 truncate text-[11px] font-semibold uppercase leading-tight tracking-wide text-[#000000]">
              Master <span className="text-[#70563F]">Panel</span>
            </p>
          </div>
        </div>

        {/* Center: primary tabs (reference layout — same on voucher and master) */}
        <div className="flex min-h-0 min-w-0 flex-1 justify-center overflow-hidden px-1">
          <div
            className="flex max-w-full flex-nowrap items-center justify-center gap-x-1 overflow-x-auto py-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-x-2 md:gap-x-2.5 [&::-webkit-scrollbar]:hidden"
          >
            {NAV_ITEMS.map(({ id, label }) => {
              const active = activeNavId === id;
              if (id === "maintain") {
                return (
                  <div
                    key={id}
                    className="relative shrink-0"
                    ref={maintainAnchorRef}
                    onPointerLeave={() => {
                      if (maintainOpen) armCloseMaintainMenu();
                    }}
                  >
                    <button
                      type="button"
                      aria-current={active ? "true" : undefined}
                      aria-haspopup="menu"
                      aria-controls={maintainOpen ? "maintain-primary-menu" : undefined}
                      aria-expanded={maintainOpen}
                      onClick={() => {
                        onActiveNavChange("maintain");
                        clearMaintainHoverTimers();
                        setMaintainOpen((o) => {
                          const next = !o;
                          if (next) setMaintainHighlight("accounts");
                          return next;
                        });
                      }}
                      className={navItemClassName(active)}
                      title="Maintain"
                    >
                      {label}
                    </button>
                    {maintainOpen ? (
                    <MaintainDropdown
                      open
                      anchorRef={maintainAnchorRef}
                      highlightedKey={maintainHighlight}
                      onHighlight={setMaintainHighlight}
                      onClose={() => {
                        clearMaintainHoverTimers();
                        setMaintainOpen(false);
                      }}
                      onPick={() => {
                        clearMaintainHoverTimers();
                        setMaintainOpen(false);
                      }}
                      onMenuPointerEnter={cancelCloseMaintainMenu}
                      onMenuPointerLeave={armCloseMaintainMenu}
                    />
                    ) : null}
                  </div>
                );
              }
              return (
                <button
                  key={id}
                  type="button"
                  aria-current={active ? "true" : undefined}
                  onClick={() => {
                    clearMaintainHoverTimers();
                    setMaintainOpen(false);
                    onActiveNavChange(id);
                  }}
                  className={navItemClassName(active)}
                  title={label}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: search + Exit */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="hidden min-w-0 sm:block">
            <div className="relative w-[min(200px,20vw)] lg:w-[min(260px,16vw)]">
              <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[#70563F]">
                <MdSearch className="h-[1.125rem] w-[1.125rem]" aria-hidden />
              </span>
              <input
                id={searchId}
                type="search"
                name="master-q"
                placeholder="Search master..."
                autoComplete="off"
                aria-label="Search master"
                className="h-10 w-full rounded-lg border border-[#ECE4D9] bg-white py-2 pl-9 pr-9 text-sm text-[#000000] shadow-[inset_0_1px_0_rgba(255,255,255,1)] outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-[#70563F]/65 hover:border-[#d4c4b0] focus:border-[#70563F] focus:shadow-[0_0_0_3px_rgba(112,86,63,0.08),inset_0_1px_0_rgba(255,255,255,1)] focus:ring-0"
              />
              <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded-md border border-[#ECE4D9] bg-[#F9F9F9] px-2 py-0.5 shadow-sm">
                <MdDiamond className="h-4 w-4 text-[#D4AF37]" aria-hidden />
              </span>
            </div>
          </div>

          <span className="hidden h-10 w-px shrink-0 bg-[#ECE4D9] sm:block" aria-hidden />

          <button type="button" onClick={handleExit} className={exitBtnClass}>
            Exit
          </button>
        </div>
      </nav>
    </header>
  );
}
