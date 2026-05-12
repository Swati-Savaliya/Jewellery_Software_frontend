import {
  MdLogout,
  MdOutlineBarChart,
  MdOutlineHandyman,
  MdOutlineHomeRepairService,
  MdOutlineLabel,
  MdOutlineReceiptLong,
  MdOutlineSetMeal,
} from "react-icons/md";

/** Ordered quick-access tiles: general modules first, Exit last. */
const MENU_CARDS = [
  { key: "maintain", label: "Maintain", icon: MdOutlineHomeRepairService },
  { key: "voucher", label: "Voucher", icon: MdOutlineReceiptLong },
  { key: "feeding", label: "Feeding", icon: MdOutlineSetMeal },
  { key: "reports", label: "Reports", icon: MdOutlineBarChart },
  { key: "taging", label: "Tagging", icon: MdOutlineLabel },
  { key: "utilities", label: "Utilities", icon: MdOutlineHandyman },
  { key: "exit", label: "Exit", icon: MdLogout },
];

export default function Dashboard() {
  return (
    <section className="w-full min-w-0 px-4 pb-8 pt-[6rem] sm:px-4 sm:pt-[90px] lg:px-2">
      <div className="w-full min-w-0 border border-[#D4C9BE] bg-[#EDE8E2] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] sm:p-1.5">
        <div className="grid w-full min-w-0 grid-cols-7 gap-1 sm:gap-1.5 md:gap-2">
          {MENU_CARDS.map((item) => {
            const Icon = item.icon;
            const tone = "tone" in item ? item.tone : "default";
            const isDanger = tone === "danger";

            return (
              <button
                key={item.key}
                type="button"
                className={[
                  "group relative flex min-h-[2.25rem] w-full min-w-0 flex-col items-center justify-center overflow-hidden border border-[#E5DDD3] bg-white p-1 sm:min-h-[4.75rem] sm:p-1.5 md:min-h-[5rem] md:p-2",
                  "shadow-[0_1px_3px_rgba(112,86,63,0.08)]",
                  "transition-[transform,box-shadow,border-color,background-color] duration-200 ease-out",
                  "hover:-translate-y-0.5 hover:border-[#D9B56A]/70 hover:bg-[#FFFCF8] hover:shadow-[0_8px_20px_rgba(112,86,63,0.1)]",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                  isDanger
                    ? "hover:border-red-200 focus-visible:ring-red-400/40 focus-visible:ring-offset-white"
                    : "focus-visible:ring-[#70563F]/35 focus-visible:ring-offset-white",
                ].join(" ")}
              >
                <div
                  className={[
                    "relative mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center transition-transform duration-200 group-hover:scale-[1.03] sm:h-8 sm:w-8",
                    isDanger
                      ? "bg-[#ECE4D9] ring-1 ring-[#D9CFC4]"
                      : "bg-[#ECE4D9] ring-1 ring-[#DDD3C8]",
                  ].join(" ")}
                >
                  <Icon
                    className={`relative h-4 w-4 sm:h-[1.125rem] sm:w-[1.125rem] ${isDanger ? "text-red-800" : "text-[#70563F]"}`}
                    aria-hidden
                  />
                </div>
                <span
                  className={[
                    "relative max-w-full truncate px-0.5 text-center text-[10px] font-semibold leading-tight sm:text-[13px] sm:leading-snug md:text-sm",
                    isDanger ? "text-red-950" : "text-[#000000]",
                  ].join(" ")}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
