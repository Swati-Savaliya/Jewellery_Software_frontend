import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const BG = "#F5F1E4";
const RULE = "#a0a0a0";
const VALUE_BLUE = "#0b5ed7";
const CASH_MAROON = "#7b1111";
const HEADER_BROWN = "#70563F";
const LABEL_PALE_GREEN = "#f0f9f0";
const TYPE_BORDER_IDLE = "#d4d4d4";
const TYPE_FOCUS_RING = "#add8e6";
const TYPE_VALUE_TEXT = "#1f2937";

/** Left / right keys per row — numbering matches ERP (1,2 then 3,4 …). */
const TX_PAIRS = [
  { left: { key: "receipt", display: "1. Receipt" }, right: { key: "payment", display: "2. Payment" } },
  { left: { key: "sale", display: "3. Sale" }, right: { key: "purchase", display: "4. Purchase" } },
  { left: { key: "saleReturn", display: "5. Sale return" }, right: { key: "purReturn", display: "6. Pur. return" } },
  { left: { key: "journal", display: "7. Journal" }, right: { key: "contra", display: "8. Contra" } },
  { left: { key: "issue", display: "9. Issue" }, right: { key: "receive", display: "0. Receive" } },
  { left: { key: "orderPlus", display: "+ Order" }, right: { key: "repairMinus", display: "- Repair" } },
];

/** Shown in footer; `key` is the physical key, `hint` matches keyboard handler behaviour. */
const FOOTER_SHORTCUTS = [
  { id: "tab", key: "Tab", hint: "CHANGE DATE" },
  { id: "pgup", key: "PgUp", hint: "PREV. DATE" },
  { id: "pgdn", key: "PgDn", hint: "NEXT DATE" },
];

const INITIAL_AMOUNTS = {
  receipt: "0",
  sale: "33982742",
  saleReturn: "0",
  journal: "0",
  issue: "0",
  orderPlus: "0",
  payment: "0",
  purchase: "0",
  purReturn: "0",
  contra: "0",
  receive: "41971",
  repairMinus: "0",
};

/** DD/MM/YYYY + weekday from YYYY-MM-DD */
function formatDateLine(iso) {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return { dmy: "—", weekday: "" };
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  const wd = dt.toLocaleDateString("en-IN", { weekday: "long" });
  const dmy = `${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")}/${y}`;
  return { dmy, weekday: wd };
}

function shiftIsoDate(iso, deltaDays) {
  if (!iso) return iso;
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + deltaDays);
  const yy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

function TxTypeBox({ fieldKey, display, amounts, setVal, focusedKey, setFocusedKey, assignInputRef }) {
  const focused = focusedKey === fieldKey;

  return (
    <div
      className="min-w-0 flex-1 overflow-hidden rounded-xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
      style={{
        borderWidth: focused ? 2 : 1,
        borderStyle: "solid",
        borderColor: focused ? TYPE_FOCUS_RING : TYPE_BORDER_IDLE,
      }}
    >
      <div className="flex min-h-[2.75rem] items-stretch">
        <div
          className="flex w-[40%] shrink-0 items-center px-2.5 text-sm font-semibold leading-tight sm:px-3"
          style={{
            backgroundColor: LABEL_PALE_GREEN,
            borderRight: `1px solid ${TYPE_BORDER_IDLE}`,
            color: "#1f2937",
          }}
        >
          {display}
        </div>
        <input
          ref={(el) => assignInputRef(fieldKey, el)}
          type="text"
          inputMode="numeric"
          data-dt-amount
          value={amounts[fieldKey]}
          onChange={(e) => setVal(fieldKey, e.target.value)}
          onFocus={() => setFocusedKey(fieldKey)}
          className="min-w-0 w-[60%] border-0 bg-white px-2 py-2 text-right text-sm font-semibold tabular-nums outline-none focus:ring-0 sm:px-3"
          style={{ color: TYPE_VALUE_TEXT }}
        />
      </div>
    </div>
  );
}

function TxTypesRow({ pair, amounts, setVal, focusedKey, setFocusedKey, assignInputRef }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-x-4">
      <TxTypeBox
        fieldKey={pair.left.key}
        display={pair.left.display}
        amounts={amounts}
        setVal={setVal}
        focusedKey={focusedKey}
        setFocusedKey={setFocusedKey}
        assignInputRef={assignInputRef}
      />
      <TxTypeBox
        fieldKey={pair.right.key}
        display={pair.right.display}
        amounts={amounts}
        setVal={setVal}
        focusedKey={focusedKey}
        setFocusedKey={setFocusedKey}
        assignInputRef={assignInputRef}
      />
    </div>
  );
}

export default function DailyTransaction() {
  const panelRef = useRef(null);
  const dateInputRef = useRef(null);
  const dateButtonRef = useRef(null);
  const valueRefs = useRef({});

  const [txDate, setTxDate] = useState(() => {
    const t = new Date();
    return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
  });
  const [openingCash, setOpeningCash] = useState("830529");
  const [closingCash, setClosingCash] = useState("830529");
  const [amounts, setAmounts] = useState(() => ({ ...INITIAL_AMOUNTS }));
  const [focusedKey, setFocusedKey] = useState("receipt");

  const { dmy, weekday } = useMemo(() => formatDateLine(txDate), [txDate]);

  const setVal = useCallback((key, raw) => {
    setAmounts((prev) => ({ ...prev, [key]: raw.replace(/[^\d.-]/g, "") }));
  }, []);

  const focusValue = useCallback((key) => {
    setFocusedKey(key);
    const el = valueRefs.current[key];
    if (el) {
      el.focus();
      el.select?.();
    }
  }, []);

  const assignInputRef = useCallback((key, el) => {
    if (el) valueRefs.current[key] = el;
    else delete valueRefs.current[key];
  }, []);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.altKey || e.ctrlKey || e.metaKey) return;

      const tag = e.target?.tagName;
      const typing = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || e.target?.isContentEditable;
      const inAmount = tag === "INPUT" && e.target?.dataset?.dtAmount != null;

      if (e.key === "PageUp") {
        if (!inAmount) {
          e.preventDefault();
          setTxDate((d) => shiftIsoDate(d, -1));
        }
        return;
      }
      if (e.key === "PageDown") {
        if (!inAmount) {
          e.preventDefault();
          setTxDate((d) => shiftIsoDate(d, 1));
        }
        return;
      }

      if (e.key === "Tab" && !typing && document.activeElement !== dateButtonRef.current) {
        e.preventDefault();
        dateButtonRef.current?.focus();
        return;
      }

      if (typing && inAmount) return;
      if (typing) return;

      const mapDigit = {
        "1": "receipt",
        "2": "payment",
        "3": "sale",
        "4": "purchase",
        "5": "saleReturn",
        "6": "purReturn",
        "7": "journal",
        "8": "contra",
        "9": "issue",
        "0": "receive",
      };
      if (mapDigit[e.key]) {
        e.preventDefault();
        focusValue(mapDigit[e.key]);
        return;
      }
      if (e.key === "-" || e.key === "_") {
        e.preventDefault();
        focusValue("repairMinus");
        return;
      }
      if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        focusValue("orderPlus");
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [focusValue]);

  const cashRowClass =
    "mt-3 flex min-w-0 items-stretch overflow-hidden rounded-xl border bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]";
  const cashLabelClass =
    "flex shrink-0 items-center px-3 py-2.5 text-sm font-bold sm:w-[min(40%,12rem)] sm:max-w-[12rem]";
  const cashInputClass = "min-w-0 flex-1 border-0 py-2.5 pr-3 text-right text-sm font-bold tabular-nums outline-none";

  return (
    <div
      id="voucher-daily-transaction-panel"
      ref={panelRef}
      className="flex min-h-0 flex-1 flex-col overflow-y-auto px-3 py-4 sm:px-5"
      style={{ backgroundColor: BG }}
    >
      <div className="mx-auto w-full max-w-3xl flex-1 sm:max-w-4xl">
        <header className="border-b pb-4 text-center" style={{ borderColor: RULE }}>
          <h1 className="mx-auto flex max-w-full flex-col items-center gap-1.5 text-[0.95rem] font-bold leading-snug text-black sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-2 sm:gap-y-0 sm:text-lg">
            <span className="whitespace-nowrap">Daily Transaction As On</span>
            <span className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 sm:gap-x-2.5">
              <button
                ref={dateButtonRef}
                type="button"
                id="daily-transaction-date-trigger"
                aria-label={`Change transaction date, currently ${dmy}`}
                aria-controls="daily-transaction-date-input"
                className={[
                  "rounded-md border border-transparent bg-transparent px-0.5 py-0 font-bold tabular-nums",
                  "underline decoration-2 underline-offset-[3px] decoration-transparent outline-none transition-colors",
                  "hover:decoration-blue-600 focus-visible:border focus-visible:border-[#add8e6] focus-visible:ring-2 focus-visible:ring-[#70563F]/25",
                ].join(" ")}
                style={{ color: VALUE_BLUE }}
                onClick={() => dateInputRef.current?.showPicker?.() ?? dateInputRef.current?.focus()}
              >
                <time dateTime={txDate}>{dmy}</time>
              </button>
              <span className="font-semibold text-neutral-900 sm:font-bold">{weekday}</span>
            </span>
          </h1>
          <input
            ref={dateInputRef}
            id="daily-transaction-date-input"
            type="date"
            value={txDate}
            onChange={(e) => setTxDate(e.target.value)}
            className="sr-only"
            tabIndex={-1}
            aria-label="Transaction date"
          />
        </header>

        <div className={cashRowClass} style={{ borderColor: TYPE_BORDER_IDLE, borderWidth: 1 }}>
          <div
            className={cashLabelClass}
            style={{
              backgroundColor: LABEL_PALE_GREEN,
              borderRight: `1px solid ${TYPE_BORDER_IDLE}`,
              color: "#1f2937",
            }}
          >
            Opening Cash
          </div>
          <input
            type="text"
            inputMode="numeric"
            value={openingCash}
            onChange={(e) => setOpeningCash(e.target.value.replace(/[^\d]/g, ""))}
            className={cashInputClass}
            style={{ color: CASH_MAROON }}
          />
        </div>

        <section className="mt-5 border-b pb-4" style={{ borderColor: RULE }}>
          <h2
            className="mb-3 text-left text-xs font-bold uppercase tracking-[0.12em] sm:text-sm"
            style={{ color: HEADER_BROWN }}
          >
            Transaction Types
          </h2>
          <div className="flex flex-col gap-2 sm:gap-2.5">
            {TX_PAIRS.map((pair) => (
              <TxTypesRow
                key={pair.left.key}
                pair={pair}
                amounts={amounts}
                setVal={setVal}
                focusedKey={focusedKey}
                setFocusedKey={setFocusedKey}
                assignInputRef={assignInputRef}
              />
            ))}
          </div>
        </section>

        <div className="mt-3 flex justify-end border-b pb-4" style={{ borderColor: RULE }}>
          <div className={`${cashRowClass} w-full max-w-lg`} style={{ borderColor: TYPE_BORDER_IDLE, borderWidth: 1 }}>
            <div
              className={cashLabelClass}
              style={{
                backgroundColor: LABEL_PALE_GREEN,
                borderRight: `1px solid ${TYPE_BORDER_IDLE}`,
                color: "#1f2937",
              }}
            >
              Closing Cash
            </div>
            <input
              type="text"
              inputMode="numeric"
              value={closingCash}
              onChange={(e) => setClosingCash(e.target.value.replace(/[^\d]/g, ""))}
              className={cashInputClass}
              style={{ color: CASH_MAROON }}
            />
          </div>
        </div>

        <footer
          className="mt-6 pb-1"
          aria-label="Keyboard shortcuts for date navigation"
        >
          <div
            className="rounded-xl border bg-white px-3 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:px-4 sm:py-3.5"
            style={{ borderColor: TYPE_BORDER_IDLE }}
          >
            <div
              role="list"
              className="grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-x-8 sm:gap-y-0"
            >
              {FOOTER_SHORTCUTS.map((row) => (
                <div
                  key={row.id}
                  role="listitem"
                  className="flex min-w-0 items-center justify-center gap-3 sm:min-h-12 sm:gap-3.5 sm:px-3 sm:py-1"
                >
                  <kbd
                    className="inline-flex h-8 min-w-[3.5rem] shrink-0 items-center justify-center rounded-md border bg-[#f8f8f6] px-2 font-mono text-[0.75rem] font-bold leading-none text-neutral-800 shadow-[inset_0_-1px_0_rgba(0,0,0,0.05)] sm:h-9 sm:min-w-[3.75rem] sm:px-2.5 sm:text-sm"
                    style={{ borderColor: TYPE_BORDER_IDLE }}
                  >
                    {row.key}
                  </kbd>
                  <span className="min-w-0 text-left text-xs font-semibold uppercase leading-tight tracking-wide text-neutral-600 sm:text-sm">
                    {row.hint}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
