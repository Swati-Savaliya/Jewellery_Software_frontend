import { useState } from "react";
import { ShortcutKeyCap, SingleLineFitText } from "./LeftSidebar";

const SIDEBAR_KEYS = [
  { id: "voucher", letter: "V", label: "Voucher", active: true },
  { id: "cash", letter: "C", label: "Cash" },
  { id: "stk-journal", letter: "S", label: "Stk. Journal" },
  { id: "tag", letter: "T", label: "Tag Generation" },
  { id: "quotation", letter: "Q", label: "Quotation" },
  { id: "credit-note", letter: "N", label: "Credit Note" },
  { id: "job-order", letter: "J", label: "Job Order" },
  { id: "expense", letter: "E", label: "EXPENSE" },
];

function scrollToDailyTransaction() {
  document.getElementById("voucher-daily-transaction-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/** Fixed 250px left rail on voucher screen — same slot as `LeftSidebar` so `MasterHeader` aligns at 250px. */
export default function VoucherNavRail() {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <aside
      className="fixed inset-y-0 left-0 z-50 flex h-screen w-[250px] flex-col overflow-hidden bg-white"
      aria-label="Voucher modules"
    >
      <div className="flex min-h-0 flex-1 flex-col border-r border-[#ECE4D9] px-5 py-6">
        <div className="mb-6 flex min-w-0 shrink-0 items-center gap-3" title="Jewellery ERP">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#ECE4D9]/55">
            <span className="text-xl font-bold text-[#70563F]">L</span>
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <SingleLineFitText className="font-semibold leading-tight text-[#000000]" minPx={11} maxPx={18}>
              Jewellery ERP
            </SingleLineFitText>
          </div>
        </div>

        <nav
          className="flex min-h-0 flex-1 flex-col overflow-y-auto"
          onMouseLeave={() => setHoveredId(null)}
        >
          {SIDEBAR_KEYS.map((item) => {
            const { id, letter, label, active } = item;
            const showAsSelected = active && (hoveredId === null || hoveredId === id);
            const idleRow = [
              "bg-white text-[#000000]",
              "hover:bg-[#E1C278] hover:text-[#000000]",
              "hover:shadow-[0_1px_2px_rgba(0,0,0,0.06)]",
            ].join(" ");
            const idleLabel = showAsSelected
              ? "text-[#000000]"
              : "text-[#000000] group-hover:text-[#000000]";

            return (
              <button
                key={id}
                type="button"
                title={label || letter}
                onMouseEnter={() => setHoveredId(id)}
                onClick={() => {
                  if (id === "voucher") {
                    scrollToDailyTransaction();
                  }
                }}
                className={[
                  "group flex min-w-0 w-full items-center gap-3 rounded-2xl px-4 py-2.5 text-left font-medium leading-tight",
                  "outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#70563F]/35",
                  "transition-colors duration-150",
                  showAsSelected
                    ? "border border-[#ECE4D9] bg-[#E1C278] text-[#000000] shadow-[0_1px_2px_rgba(0,0,0,0.08)]"
                    : idleRow,
                ].join(" ")}
              >
                <ShortcutKeyCap label={letter} emphasized={showAsSelected} />
                <SingleLineFitText className={idleLabel} minPx={8} maxPx={14}>
                  {label || "\u00a0"}
                </SingleLineFitText>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
