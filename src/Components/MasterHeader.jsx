import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { MdChevronRight, MdDiamond, MdSearch } from "react-icons/md";

const ACCOUNTS_CHILDREN = [
  { key: "acc-add", label: "Add" },
  { key: "acc-modify", label: "Modify" },
  { key: "acc-delete", label: "Delete" },
  { sep: true },
  { key: "acc-list", label: "List" },
  { key: "acc-party-rates", label: "Party Rates", submenu: true },
  { sep: true },
  { key: "acc-merge", label: "A/c Merge" },
  { key: "acc-location", label: "Location" },
  { key: "acc-city", label: "City" },
  { key: "acc-staff-list", label: "Staff List" },
  { key: "acc-staff-category", label: "Staff Category" },
  { key: "acc-monthly-target", label: "Monthly Target" },
];

const MAINTAIN_SECTIONS = [
  {
    items: [
      { key: "accounts", label: "Accounts", submenu: true, children: ACCOUNTS_CHILDREN },
      { key: "sub-accounts", label: "Sub Accounts", submenu: true },
      { key: "ac-group", label: "A/c Group", submenu: true },
    ],
  },
  {
    items: [
      { key: "item", label: "Item", submenu: true },
      { key: "item-group-list", label: "Item Group List (v)" },
      { key: "item-group", label: "Item Group", submenu: true },
      { key: "stamp", label: "Stamp", submenu: true },
      { key: "dia-stone", label: "Dia/Stone Setup", submenu: true },
    ],
  },
  {
    items: [
      { key: "opening-stock", label: "Opening Stock", submenu: true },
      { key: "narration", label: "Narration" },
      { key: "user-passwords", label: "User Passwords", submenu: true },
      { key: "company-detail", label: "Company Detail", submenu: true },
      { key: "customer-db", label: "Customer Database", submenu: true },
      { key: "series-list", label: "Series List (x)" },
      { key: "sundry-list", label: "Sundry List" },
    ],
  },
];

const FEEDING_ITEMS = [
  { key: "catalogue", label: "Catalogue" },
  { key: "catalogue-group", label: "Catalogue Group" },
  { key: "e-catlog", label: "E Catlog" },
  { sep: true },
  { key: "daily-bhav", label: "Daily Bhav" },
  { key: "bank-reconciliation", label: "Bank Reconciliation" },
  { key: "cheque", label: "Cheque", submenu: true },
  { key: "icici-banking", label: "ICICI Banking", submenu: true },
  { key: "reminder", label: "Reminder" },
  { key: "box-tag-in", label: "Box Tag In" },
  { key: "box-tag-out", label: "Box Tag Out" },
  { key: "to-do-task", label: "TO Do Task" },
  { key: "work-book", label: "Work Book" },
  { key: "web-order-register", label: "Web Order Register" },
];

const REPORTS_ITEMS = [
  { key: "ledger", label: "Ledger", submenu: true },
  { key: "outstanding", label: "Outstanding", submenu: true },
  { key: "daily-books", label: "Daily Books", submenu: true },
  { sep: true },
  { key: "stock-status", label: "Stock Status", submenu: true },
  { key: "stock-summary", label: "Stock Summary", submenu: true },
  { sep: true },
  { key: "sale-registers", label: "Sale Registers", submenu: true },
  { key: "purchase-registers", label: "Purchase Registers", submenu: true },
  { sep: true },
  { key: "karigar", label: "Karigar", submenu: true },
  { key: "registers", label: "Registers", submenu: true },
  { key: "administrative", label: "Administrative", submenu: true },
  { sep: true },
  { key: "misc-reports", label: "Misc Reports", submenu: true },
  { key: "reprint-bills", label: "RePrint Bills", submenu: true },
];

const TAGGING_ITEMS = [
  { key: "tag-stock", label: "Tag Stock", submenu: true },
  { key: "item-wise-stock", label: "Item Wise Stock" },
  { key: "printing", label: "Printing" },
  { key: "query", label: "Query" },
  { key: "tag-calculator", label: "Tag Calculator" },
  { key: "tag-modification", label: "Tag Modification" },
  { key: "wt-search", label: "Wt Search" },
  { key: "arrival", label: "Arrival" },
  { key: "tag-extra-wt", label: "Tag Extra Wt" },
  { key: "issue", label: "Issue" },
  { key: "tag-summary", label: "Tag Summary" },
  { key: "physical-stock", label: "Physical Stock" },
  { key: "age-wise-stock", label: "Age Wise Stock" },
  { key: "tag-profit", label: "Tag Profit" },
  { key: "reorder-level", label: "Re Order Level" },
  { key: "history", label: "History" },
  { key: "day-close", label: "Day Close" },
  { key: "wt-wise-stock", label: "Wt Wise Stock" },
  { key: "wt-wise-sale", label: "Wt Wise Sale" },
  { key: "quality-wt-wise-stock", label: "Quality Wt Wise Stock" },
  { key: "quality-wt-wise-sale", label: "Quality Wt Wise Sale" },
  { key: "wt-range-stock", label: "Wt Range Stock" },
  { key: "supplier-age-wise-stock", label: "Supplier Age Wise Stock" },
  { key: "feed-rfid-no", label: "Feed Rfid No" },
];

const UTILITIES_ITEMS = [
  { key: "backup-restore", label: "Backup/Restore" },
  { key: "close-year-refresh", label: "Close Year/Refresh" },
  { key: "freeze-date", label: "Freeze Date" },
  { key: "day-close", label: "Day/Close" },
  { key: "hisab-final", label: "Hisab Final" },
  { key: "renumbering-vouchers", label: "Renumbering Vouchers" },
  { key: "change-year", label: "Change Year" },
  { key: "support", label: "Support" },
  { key: "mcx-rates", label: "Mcx Rates" },
  { key: "voucher-setup", label: "Voucher Setup" },
  { key: "int-calculator", label: "Int Calculator" },
  { key: "report-save", label: "Report Save" },
  { key: "report-verify", label: "Report Verify" },
  { key: "tally-export", label: "Tally Export" },
  { key: "web-export", label: "Web Export" },
  { key: "upgrade-from-web", label: "Upgrade From Web" },
  { key: "mail-requirment", label: "Mail Requirment" },
  { key: "licence-information", label: "Licence Information" },
  { key: "features", label: "Features" },
  { key: "login-list", label: "Login List" },
  { key: "mobile-transfer", label: "Mobile Transfer" },
  { key: "report-complaint", label: "Report Complaint" },
  { key: "mchine-list", label: "Mchine List" },
  { key: "cmp-upload", label: "Cmp Upload" },
  { key: "import-hindi-date", label: "Import Hindi Date" },
];

const NAV_ITEMS = [
  { id: "maintain", label: "Maintain", menuId: "maintain-primary-menu", defaultKey: "accounts", sections: MAINTAIN_SECTIONS },
  { id: "voucher", label: "Voucher" },
  { id: "feeding", label: "Feeding", menuId: "feeding-primary-menu", defaultKey: "catalogue", items: FEEDING_ITEMS },
  { id: "reports", label: "Reports", menuId: "reports-primary-menu", defaultKey: "ledger", items: REPORTS_ITEMS },
  { id: "tagging", label: "Taging", menuId: "tagging-primary-menu", defaultKey: "tag-stock", items: TAGGING_ITEMS },
  { id: "utilities", label: "Utilities", menuId: "utilities-primary-menu", defaultKey: "backup-restore", items: UTILITIES_ITEMS, noScroll: true },
  { id: "exit", label: "Exit", isExit: true },
];

const CENTER_NAV = NAV_ITEMS.filter((n) => !n.isExit);
const EXIT_ITEM = NAV_ITEMS.find((n) => n.isExit);

const MENU_ANCHORS = Object.fromEntries(
  NAV_ITEMS.filter((n) => n.items || n.sections).map((n) => [n.id, { current: null }]),
);

function findMaintainRow(key) {
  for (const section of MAINTAIN_SECTIONS) {
    const row = section.items.find((i) => i.key === key);
    if (row) return row;
  }
  return null;
}

function menuRowClass(selected) {
  return `flex w-full items-center justify-between gap-2 rounded-lg px-3 py-1.5 text-left text-[13px] font-medium outline-none transition-colors ${
    selected ? "border border-[#d8c9a8]/90 bg-[#E1C278]/40 text-[#2a2118]" : "border border-transparent text-[#1c1612] hover:bg-[#f6f0e9]"
  }`;
}

function NavDropdown({ open, anchorRef, menuId, label, items, activeKey, onActiveKey, onClose, noScroll }) {
  const menuWidth = 288;
  const menuRef = useRef(null);
  const [pos, setPos] = useState(null);
  const showArrow = items.some((r) => r.submenu);

  useLayoutEffect(() => {
    if (!open) return;
    const update = () => {
      const el = anchorRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const w = Math.min(menuWidth, window.innerWidth - 24);
      const top = r.bottom + 4;
      let left = r.left;

      if (left + w > window.innerWidth - 12) left = r.right - w;
      if (left < 12) left = Math.max(12, r.left);

      setPos({ top, left, maxHeight: Math.max(160, window.innerHeight - top - 12) });
    };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open, anchorRef]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    const onPointerDown = (e) => {
      const t = e.target;
      if (!(t instanceof Node)) return;
      if (anchorRef.current?.contains(t) || menuRef.current?.contains(t)) return;
      onClose();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open, onClose, anchorRef]);

  if (!open || !pos) return null;

  return createPortal(
    <div
      ref={menuRef}
      id={menuId}
      role="menu"
      aria-label={label}
      style={{
        position: "fixed",
        top: pos.top,
        left: pos.left,
        zIndex: 95,
        width: Math.min(menuWidth, window.innerWidth - 24),
        ...(noScroll ? {} : { maxHeight: pos.maxHeight }),
      }}
      className="overflow-hidden rounded-xl border border-[#E4DACE] bg-gradient-to-b from-white via-[#fefdfb] to-[#faf7f2] shadow-lg ring-1 ring-inset ring-white/90"
    >
      <div className="pointer-events-none h-px bg-gradient-to-r from-transparent via-[#c9a227]/55 to-transparent" aria-hidden />
      <ul
        className={`m-0 list-none p-1 ${noScroll ? "" : "overflow-y-auto"}`}
        style={noScroll ? undefined : { maxHeight: pos.maxHeight - 8 }}
      >
        {items.map((row, i) => {
          if (row.sep) {
            return (
              <li
                key={`sep-${i}`}
                className="mx-2 my-1.5 h-px bg-gradient-to-r from-transparent via-[#D8CDC0] to-transparent"
                role="separator"
              />
            );
          }
          const selected = row.key === activeKey;
          return (
            <li key={row.key} className="px-0.5">
              <button
                type="button"
                role="menuitem"
                className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-1.5 text-left text-[13px] font-medium outline-none transition-colors ${
                  selected
                    ? "border border-[#d8c9a8]/90 bg-[#E1C278]/40 text-[#2a2118]"
                    : "border border-transparent text-[#1c1612] hover:bg-[#f6f0e9]"
                }`}
                onMouseEnter={() => onActiveKey(row.key)}
                onClick={() => {
                  onActiveKey(row.key);
                  onClose();
                }}
              >
                <span>{row.label}</span>
                {showArrow ? (
                  row.submenu ? (
                    <MdChevronRight className="h-4 w-4 shrink-0 text-[#6B5340]/70" aria-hidden />
                  ) : (
                    <span className="inline-block h-4 w-4 shrink-0" aria-hidden />
                  )
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>
    </div>,
    document.body,
  );
}

function MaintainMenuDropdown({ anchorRef, menuId, activeKey, onActiveKey, onClose }) {
  const menuWidth = 288;
  const flyoutOverlap = 6;
  const wrapRef = useRef(null);
  const [pos, setPos] = useState(null);
  const [openedSubmenuKey, setOpenedSubmenuKey] = useState(null);
  const [flyoutHoverKey, setFlyoutHoverKey] = useState(null);

  const flyoutParent = openedSubmenuKey ? findMaintainRow(openedSubmenuKey) : null;
  const flyoutItems = flyoutParent?.children ?? null;
  const flyoutRows = flyoutItems?.filter((r) => !r.sep) ?? [];
  const flyoutActiveKey =
    flyoutRows.length > 0
      ? flyoutHoverKey && flyoutRows.some((r) => r.key === flyoutHoverKey)
        ? flyoutHoverKey
        : flyoutRows[0].key
      : null;

  useLayoutEffect(() => {
    const update = () => {
      const el = anchorRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const mainW = Math.min(menuWidth, window.innerWidth - 24);
      const flyoutW = flyoutItems ? 260 : 0;
      const totalW = mainW + (flyoutItems ? flyoutW - flyoutOverlap : 0);
      let left = r.left;
      const top = r.bottom + 4;
      if (left + totalW > window.innerWidth - 12) left = window.innerWidth - totalW - 12;
      if (left < 12) left = Math.max(12, r.left);
      setPos({ top, left, maxHeight: Math.max(160, window.innerHeight - top - 12) });
    };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [anchorRef, flyoutItems]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    const onPointerDown = (e) => {
      const t = e.target;
      if (!(t instanceof Node)) return;
      if (anchorRef.current?.contains(t) || wrapRef.current?.contains(t)) return;
      onClose();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [onClose, anchorRef]);

  if (!pos) return null;

  const hasFlyout = Boolean(flyoutItems?.length);

  return createPortal(
    <div ref={wrapRef} style={{ position: "fixed", top: pos.top, left: pos.left, zIndex: 95 }} className="relative w-max">
      <div
        id={menuId}
        role="menu"
        aria-label="Maintain"
        style={{ width: Math.min(menuWidth, window.innerWidth - 24) }}
        className={`overflow-hidden border border-[#E4DACE] bg-gradient-to-b from-white via-[#fefdfb] to-[#faf7f2] shadow-lg ring-1 ring-inset ring-white/90 ${
          hasFlyout ? "rounded-l-xl rounded-r-none border-r-0" : "rounded-xl"
        }`}
      >
        <div className="p-1">
          {MAINTAIN_SECTIONS.map((section, si) => (
            <div key={si}>
              {si > 0 ? <div className="mx-2 my-1.5 h-px bg-[#D8CDC0]" role="separator" /> : null}
              <ul className="m-0 list-none">
                {section.items.map((row) => {
                  const selected = row.key === activeKey;
                  return (
                    <li key={row.key} className="px-0.5">
                      <button
                        type="button"
                        role="menuitem"
                        aria-expanded={row.children?.length ? openedSubmenuKey === row.key : undefined}
                        className={menuRowClass(selected)}
                        onMouseEnter={() => {
                          onActiveKey(row.key);
                          setFlyoutHoverKey(null);
                        }}
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation();
                          onActiveKey(row.key);
                          setFlyoutHoverKey(null);
                          if (row.children?.length) {
                            setOpenedSubmenuKey(row.key);
                            return;
                          }
                          setOpenedSubmenuKey(null);
                          onClose();
                        }}
                      >
                        <span>{row.label}</span>
                        {row.submenu ? <MdChevronRight className="h-4 w-4 shrink-0 text-[#6B5340]/70" /> : <span className="h-4 w-4 shrink-0" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {flyoutItems ? (
        <div
          role="menu"
          aria-label={flyoutParent?.label ? `${flyoutParent.label} submenu` : "Submenu"}
          style={{ marginLeft: -flyoutOverlap }}
          className="absolute left-full top-0 z-10 w-64 overflow-hidden rounded-r-xl rounded-l-lg border border-l-0 border-[#D8CDC0] bg-gradient-to-b from-[#fefdfb] to-[#f3ebe2] shadow-lg"
        >
          <ul className="m-0 list-none p-1">
            {flyoutItems.map((row, i) => {
              if (row.sep) {
                return <li key={`fsep-${i}`} className="mx-2 my-1.5 h-px bg-[#D8CDC0]" role="separator" />;
              }
              const selected = row.key === flyoutActiveKey;
              return (
                <li key={row.key} className="px-0.5">
                  <button
                    type="button"
                    role="menuitem"
                    className={menuRowClass(selected)}
                    onPointerDown={(e) => e.stopPropagation()}
                    onMouseEnter={() => setFlyoutHoverKey(row.key)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setFlyoutHoverKey(row.key);
                      if (!row.submenu) onClose();
                    }}
                  >
                    <span>{row.label}</span>
                    {row.submenu ? <MdChevronRight className="h-4 w-4 shrink-0" /> : <span className="h-4 w-4 shrink-0" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>,
    document.body,
  );
}

export default function MasterHeader({ onExit, activeNavId, onActiveNavChange }) {
  const navigate = useNavigate();
  const searchId = useId();
  const [openMenu, setOpenMenu] = useState(null);
  const [activeKeys, setActiveKeys] = useState(() =>
    Object.fromEntries(NAV_ITEMS.filter((n) => n.defaultKey).map((n) => [n.id, n.defaultKey])),
  );

  const closeMenus = () => setOpenMenu(null);

  const handleExit = () => {
    closeMenus();
    if (typeof onExit === "function") onExit();
    else navigate("/");
  };

  return (
    <header className="fixed left-[250px] right-0 top-0 z-40 border-b border-[#ECE4D9] bg-[#F9F9F9] shadow-sm">
      <nav className="mx-auto flex h-16 max-w-[1920px] items-center gap-2 px-3 sm:px-5 lg:px-10">
        <div className="flex shrink-0 items-center gap-2.5 border-r border-[#ECE4D9] pr-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl border border-[#ECE4D9] bg-white">
            <MdDiamond className="h-6 w-6 text-[#D4AF37]" />
          </span>
          <div className="hidden sm:block">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#70563F]">Jewellery ERP</p>
            <p className="text-[11px] font-semibold uppercase text-black">
              Master <span className="text-[#70563F]">Panel</span>
            </p>
          </div>
        </div>

        <div className="flex flex-1 justify-center overflow-x-auto py-1">
          <div className="flex items-center gap-1 sm:gap-2">
            {CENTER_NAV.map(({ id, label, items, sections, menuId, defaultKey, noScroll }) => {
              const active = activeNavId === id;
              const open = openMenu === id;

              if (!items && !sections) {
                return (
                  <button
                    key={id}
                    type="button"
                    className={`shrink-0 rounded-lg border px-2.5 py-2 text-sm font-semibold ${
                      active ? "border-[#ECE4D9]/90 bg-[#E1C278]/55 text-black" : "border-transparent text-black hover:bg-[#ECE4D9]/35"
                    }`}
                    onClick={() => {
                      closeMenus();
                      onActiveNavChange(id);
                    }}
                  >
                    {label}
                  </button>
                );
              }

              const anchorRef = MENU_ANCHORS[id];

              return (
                <div key={id} className="relative shrink-0">
                  <button
                    type="button"
                    ref={(el) => {
                      anchorRef.current = el;
                    }}
                    aria-expanded={open}
                    aria-haspopup="menu"
                    aria-controls={open ? menuId : undefined}
                    className={`shrink-0 rounded-lg border px-2.5 py-2 text-sm font-semibold ${
                      active ? "border-[#ECE4D9]/90 bg-[#E1C278]/55 text-black" : "border-transparent text-black hover:bg-[#ECE4D9]/35"
                    }`}
                    onClick={() => {
                      setOpenMenu((cur) => (cur === id ? null : id));
                      onActiveNavChange(id);
                    }}
                  >
                    {label}
                  </button>
                  {sections && open ? (
                    <MaintainMenuDropdown
                      anchorRef={anchorRef}
                      menuId={menuId}
                      activeKey={activeKeys[id] ?? defaultKey}
                      onActiveKey={(key) => setActiveKeys((h) => ({ ...h, [id]: key }))}
                      onClose={closeMenus}
                    />
                  ) : null}
                  {items && open ? (
                    <NavDropdown
                      open
                      anchorRef={anchorRef}
                      menuId={menuId}
                      label={label}
                      items={items}
                      noScroll={noScroll}
                      activeKey={activeKeys[id] ?? defaultKey}
                      onActiveKey={(key) => setActiveKeys((h) => ({ ...h, [id]: key }))}
                      onClose={closeMenus}
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <div className="relative hidden min-w-0 sm:block sm:w-[min(280px,22vw)] lg:w-[min(360px,18vw)]">
            <MdSearch className="pointer-events-none absolute left-2.5 top-1/2 h-[1.125rem] w-[1.125rem] -translate-y-1/2 text-[#70563F]" aria-hidden />
            <input
              id={searchId}
              type="search"
              name="master-q"
              placeholder="Search master..."
              autoComplete="off"
              aria-label="Search master"
              className="h-10 w-full rounded-lg border border-[#ECE4D9] bg-white py-2 pl-9 pr-10 text-sm text-black shadow-[inset_0_1px_0_rgba(255,255,255,1)] outline-none placeholder:text-[#70563F]/65 hover:border-[#d4c4b0] focus:border-[#70563F] focus:ring-2 focus:ring-[#70563F]/10"
            />
            <span className="pointer-events-none absolute right-2 top-1/2 inline-flex -translate-y-1/2 items-center rounded-md border border-[#ECE4D9] bg-[#F9F9F9] px-1.5 py-0.5 shadow-sm">
              <MdDiamond className="h-4 w-4 text-[#D4AF37]" aria-hidden />
            </span>
          </div>
          {EXIT_ITEM ? (
            <>
              <span className="hidden h-10 w-px shrink-0 bg-[#ECE4D9] sm:block" aria-hidden />
              <button
                type="button"
                onClick={handleExit}
                className="min-w-[5.5rem] shrink-0 rounded-lg border border-[#ECE4D9]/90 bg-[#E1C278]/55 px-6 py-2 text-sm font-semibold tracking-tight text-black shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_1px_2px_rgba(74,56,41,0.06)] transition hover:border-[#d4c4b0] hover:bg-[#E1C278]/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#70563F]/35 sm:min-w-[6rem] sm:px-7"
              >
                {EXIT_ITEM.label}
              </button>
            </>
          ) : null}
        </div>
      </nav>
    </header>
  );
}
