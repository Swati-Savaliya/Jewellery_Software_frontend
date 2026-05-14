import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MdChevronRight } from "react-icons/md";

/** Maintain → Accounts cascading menu (matches legacy ERP layout from reference). */
const ACCOUNTS_FLYOUT_ITEMS = [
  { key: "acc-add", label: "Add", hotkey: "A" },
  { key: "acc-modify", label: "Modify", hotkey: "M" },
  { key: "acc-delete", label: "Delete", hotkey: "D" },
  { key: "__sep-a", type: "separator" },
  { key: "acc-list", label: "List", hotkey: "L" },
  { key: "acc-party-rates", label: "Party Rates", hotkey: "P", submenu: true },
  { key: "__sep-b", type: "separator" },
  { key: "acc-merge", label: "A/c Merge", hotkey: "G" },
  { key: "acc-location", label: "Location", hotkey: "O" },
  { key: "acc-city", label: "City", hotkey: "C" },
  { key: "acc-staff-list", label: "Staff List", hotkey: "i" },
  { key: "acc-staff-category", label: "Staff Category", hotkey: "e" },
  { key: "acc-monthly-target", label: "Monthly Target", hotkey: "T" },
];

/** Maintain menu — structure from legacy ERP, styling aligned with Jewellery ERP shell. */
const MENU_SECTIONS = [
  {
    items: [
      {
        key: "accounts",
        label: "Accounts",
        hotkey: "A",
        submenu: true,
        children: ACCOUNTS_FLYOUT_ITEMS,
      },
      { key: "sub-accounts", label: "Sub Accounts", hotkey: "b", submenu: true },
      { key: "ac-group", label: "A/c Group", hotkey: "p", submenu: true },
    ],
  },
  {
    items: [
      { key: "item", label: "Item", hotkey: "I", submenu: true },
      { key: "item-group-list", label: "Item Group List (v)", hotkey: "I", submenu: false },
      { key: "item-group", label: "Item Group", hotkey: "e", submenu: true },
      { key: "stamp", label: "Stamp", hotkey: "S", submenu: true },
      { key: "dia-stone", label: "Dia/Stone Setup", hotkey: "D", submenu: true },
    ],
  },
  {
    items: [
      { key: "opening-stock", label: "Opening Stock", hotkey: "O", submenu: true },
      { key: "narration", label: "Narration", hotkey: "N", submenu: false },
      { key: "user-passwords", label: "User Passwords", hotkey: "w", submenu: true },
      { key: "company-detail", label: "Company Detail", hotkey: "C", submenu: true },
      { key: "customer-db", label: "Customer Database", hotkey: "u", submenu: true },
      { key: "series-list", label: "Series List (x)", hotkey: "S", submenu: false },
      { key: "sundry-list", label: "Sundry List", hotkey: "S", submenu: false },
    ],
  },
];

const PANEL_MAX_W = 288;
const FLYOUT_MAX_W = 308;
const FLYOUT_OVERLAP = 6;

function findMenuItem(key) {
  for (const section of MENU_SECTIONS) {
    const it = section.items.find((i) => i.key === key);
    if (it) return it;
  }
  return null;
}

/** Rows that can receive highlight / click (excludes separators). */
function flyoutSelectableRows(children) {
  if (!children?.length) return [];
  return children.filter((c) => c.type !== "separator");
}

function hotkeyIndex(label, hotkey) {
  const h = hotkey.toLowerCase();
  const lower = label.toLowerCase();
  const i = lower.indexOf(h);
  return i >= 0 ? i : 0;
}

function MenuLabel({ label, hotkey, accent }) {
  const i = hotkeyIndex(label, hotkey);
  const ch = label[i] ?? hotkey;
  const deco = accent ? "decoration-[#8a6f2a]" : "decoration-[#70563F]/65";
  return (
    <span className="text-[13px] font-medium leading-[1.35] tracking-[-0.01em] text-inherit antialiased">
      {label.slice(0, i)}
      <span className={["underline decoration-[1.25px] underline-offset-[2px]", deco].join(" ")}>{ch}</span>
      {label.slice(i + 1)}
    </span>
  );
}

/**
 * @param {object} props
 * @param {boolean} props.open
 * @param {React.RefObject<HTMLElement | null>} props.anchorRef
 * @param {() => void} props.onClose
 * @param {string} props.highlightedKey
 * @param {(key: string) => void} props.onHighlight
 * @param {(key: string) => void} [props.onPick]
 * @param {() => void} [props.onMenuPointerEnter] — pointer entered portaled menu (cancel delayed close).
 * @param {() => void} [props.onMenuPointerLeave] — pointer left portaled menu (schedule close).
 */
export default function MaintainDropdown({
  open,
  anchorRef,
  onClose,
  highlightedKey,
  onHighlight,
  onPick,
  onMenuPointerEnter,
  onMenuPointerLeave,
}) {
  const wrapRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  /** Submenu flyout opens only after click on a row with `children` (e.g. Accounts → Sub Accounts). */
  const [openedSubmenuKey, setOpenedSubmenuKey] = useState(null);
  /** Which flyout row is hovered; cleared when moving across main menu rows. */
  const [flyoutHoveredKey, setFlyoutHoveredKey] = useState(null);

  const flyoutParentItem = openedSubmenuKey ? findMenuItem(openedSubmenuKey) : null;
  const flyoutChildren = flyoutParentItem?.children?.length ? flyoutParentItem.children : null;
  const flyoutSelectable = flyoutSelectableRows(flyoutChildren);
  const submenuSelKey =
    flyoutSelectable.length
      ? flyoutHoveredKey && flyoutSelectable.some((c) => c.key === flyoutHoveredKey)
        ? flyoutHoveredKey
        : flyoutSelectable[0].key
      : null;

  const updatePos = useCallback(() => {
    const el = anchorRef?.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const margin = 10;
    const mainW = Math.min(PANEL_MAX_W, window.innerWidth - margin * 2);
    const flyoutW = flyoutChildren ? Math.min(FLYOUT_MAX_W, Math.max(200, window.innerWidth - mainW - margin * 3)) : 0;
    const totalW = mainW + (flyoutChildren ? flyoutW - FLYOUT_OVERLAP : 0);
    let left = r.left;
    left = Math.min(left, window.innerWidth - totalW - margin);
    left = Math.max(margin, left);
    setPos({ top: r.bottom + 4, left });
  }, [anchorRef, flyoutChildren]);

  useLayoutEffect(() => {
    if (!open) return;
    updatePos();
    window.addEventListener("scroll", updatePos, true);
    window.addEventListener("resize", updatePos);
    return () => {
      window.removeEventListener("scroll", updatePos, true);
      window.removeEventListener("resize", updatePos);
    };
  }, [open, updatePos]);

  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e) {
      const t = e.target;
      if (!(t instanceof Node)) return;
      if (anchorRef?.current?.contains(t)) return;
      if (wrapRef.current?.contains(t)) return;
      onClose();
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, onClose, anchorRef]);

  if (!open) return null;

  const mainColWidth = "min(calc(100vw - 24px), 18rem)";
  const hasFlyout = Boolean(flyoutChildren?.length);

  const panel = (
    <div
      ref={wrapRef}
      style={{ position: "fixed", top: pos.top, left: pos.left, zIndex: 95 }}
      className="relative w-max max-w-[calc(100vw-16px)] font-sans antialiased"
      onPointerEnter={() => onMenuPointerEnter?.()}
      onPointerLeave={() => onMenuPointerLeave?.()}
    >
      <div
        id="maintain-primary-menu"
        role="menu"
        aria-label="Maintain"
        style={{ width: mainColWidth }}
        className={[
          "relative z-0 flex h-fit min-h-0 shrink-0 flex-col overflow-hidden border border-[#E4DACE] bg-gradient-to-b from-white via-[#fefdfb] to-[#faf7f2]",
          hasFlyout ? "rounded-l-xl rounded-r-none border-r-0" : "rounded-xl",
          "shadow-[0_12px_48px_-12px_rgba(48,36,26,0.16),0_4px_16px_-6px_rgba(48,36,26,0.08),inset_0_1px_0_rgba(255,255,255,0.95)]",
          "ring-1 ring-inset ring-white/90",
        ].join(" ")}
      >
        <div
          className="pointer-events-none h-px shrink-0 bg-gradient-to-r from-transparent via-[#c9a227]/55 to-transparent"
          aria-hidden
        />
        <div className="flex h-fit min-h-0 flex-col px-1 py-1">
          {MENU_SECTIONS.map((section, si) => (
            <div key={si}>
              {si > 0 ? (
                <div
                  className="mx-2 my-2 h-px shrink-0 bg-gradient-to-r from-transparent via-[#D8CDC0] to-transparent"
                  role="separator"
                  aria-hidden
                />
              ) : null}
              <ul className="flex flex-col gap-0.5 py-0.5">
                {section.items.map((row) => {
                  const sel = row.key === highlightedKey;
                  return (
                    <li key={row.key} role="none" className="list-none px-0.5" data-maintain-row={row.key}>
                      <button
                        type="button"
                        role="menuitem"
                        aria-haspopup={row.children?.length ? "menu" : undefined}
                        aria-expanded={row.children?.length ? openedSubmenuKey === row.key : undefined}
                        onMouseEnter={() => {
                          onHighlight(row.key);
                          setFlyoutHoveredKey(null);
                        }}
                        onClick={() => {
                          onHighlight(row.key);
                          setFlyoutHoveredKey(null);
                          if (row.children?.length) {
                            setOpenedSubmenuKey((prev) => (prev === row.key ? null : row.key));
                            return;
                          }
                          setOpenedSubmenuKey(null);
                          onPick?.(row.key);
                        }}
                        className={[
                          "group flex min-h-0 w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left outline-none",
                          "transition-[background-color,box-shadow,color,border-color,transform] duration-200 ease-[cubic-bezier(0.33,1,0.68,1)]",
                          "focus-visible:ring-2 focus-visible:ring-[#70563F]/28 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                          sel
                            ? "border border-[#d8c9a8]/90 bg-gradient-to-r from-[#fffdf9] via-[#fdf6e8] to-[#f8eed8] text-[#2a2118] shadow-[inset_0_1px_0_rgba(255,255,255,0.92)] ring-1 ring-[#d4af37]/20"
                            : [
                                "border border-transparent text-[#1c1612]",
                                "hover:border-[#E0D4C8]/95 hover:bg-[#f6f0e9] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]",
                                "active:scale-[0.99] active:bg-[#ebe3d8]",
                              ].join(" "),
                        ].join(" ")}
                      >
                        <MenuLabel label={row.label} hotkey={row.hotkey} accent={sel} />
                        {row.submenu ? (
                          <MdChevronRight
                            className={[
                              "h-[1.05rem] w-[1.05rem] shrink-0 text-[#6B5340]/65 transition-colors duration-200",
                              sel ? "text-[#7a5c28]" : "group-hover:text-[#5c4634]",
                            ].join(" ")}
                            aria-hidden
                          />
                        ) : (
                          <span className="inline-block h-[1.05rem] w-[1.05rem] shrink-0" aria-hidden />
                        )}
                      </button>
                    </li>
                );
              })}
            </ul>
          </div>
        ))}
        </div>
      </div>

      {flyoutChildren ? (
        <div
          role="menu"
          aria-label={flyoutParentItem?.label ? `${flyoutParentItem.label} submenu` : "Submenu"}
          style={{ marginLeft: -FLYOUT_OVERLAP }}
          className={[
            "absolute left-full top-0 z-[1] flex h-fit min-h-0 w-max min-w-[14.5rem] max-w-[min(calc(100vw-24px),24rem)] flex-col overflow-hidden rounded-r-xl rounded-l-lg border border-l-0 border-[#D8CDC0]",
            "bg-gradient-to-b from-[#fefdfb] via-[#faf6f0] to-[#f3ebe2]",
            "shadow-[0_12px_48px_-12px_rgba(48,36,26,0.16),0_4px_16px_-6px_rgba(48,36,26,0.08),inset_0_1px_0_rgba(255,255,255,0.9)]",
            "ring-1 ring-inset ring-white/85",
          ].join(" ")}
        >
          <div
            className="pointer-events-none h-px shrink-0 bg-gradient-to-r from-[#d4af37]/25 via-[#c9a227]/45 to-transparent"
            aria-hidden
          />
          <ul className="flex h-fit min-h-0 flex-col gap-0.5 py-1 pl-1 pr-1">
            {flyoutChildren.map((row) => {
              if (row.type === "separator") {
                return (
                  <li
                    key={row.key}
                    role="separator"
                    className="mx-2 my-1.5 h-px shrink-0 list-none bg-gradient-to-r from-transparent via-[#D2C6B8] to-transparent"
                  />
                );
              }
              const sel = row.key === submenuSelKey;
              return (
                <li key={row.key} role="none" className="list-none px-0.5">
                  <button
                    type="button"
                    role="menuitem"
                    onMouseEnter={() => setFlyoutHoveredKey(row.key)}
                    onClick={() => {
                      setFlyoutHoveredKey(row.key);
                      if (row.submenu) return;
                      onPick?.(row.key);
                    }}
                    className={[
                      "group flex min-h-0 w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left outline-none",
                      "transition-[background-color,box-shadow,color,border-color,transform] duration-200 ease-[cubic-bezier(0.33,1,0.68,1)]",
                      "focus-visible:ring-2 focus-visible:ring-[#70563F]/28 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fefdfb]",
                      sel
                        ? "border border-[#d8c9a8]/90 bg-gradient-to-r from-[#fffdf9] via-[#fdf6e8] to-[#f8eed8] text-[#2a2118] shadow-[inset_0_1px_0_rgba(255,255,255,0.92)] ring-1 ring-[#d4af37]/20"
                        : [
                            "border border-transparent text-[#1c1612]",
                            "hover:border-[#E0D4C8]/95 hover:bg-[#f6f0e9] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]",
                            "active:scale-[0.99] active:bg-[#ebe3d8]",
                          ].join(" "),
                    ].join(" ")}
                  >
                    <MenuLabel label={row.label} hotkey={row.hotkey} accent={sel} />
                    {row.submenu ? (
                      <MdChevronRight
                        className={[
                          "h-[1.05rem] w-[1.05rem] shrink-0 text-[#6B5340]/65 transition-colors duration-200",
                          sel ? "text-[#7a5c28]" : "group-hover:text-[#5c4634]",
                        ].join(" ")}
                        aria-hidden
                      />
                    ) : (
                      <span className="inline-block h-[1.05rem] w-[1.05rem] shrink-0" aria-hidden />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );

  return createPortal(panel, document.body);
}
