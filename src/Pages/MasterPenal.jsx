import { useCallback, useEffect, useState } from "react";
import {
  MdBackup,
  MdContentCopy,
  MdDeleteForever,
  MdExitToApp,
  MdManageAccounts,
  MdSystemUpdateAlt,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";

const MENU_ITEMS = [
  { key: "select-company", acc: "s", Icon: MdManageAccounts, first: "S", rest: "elect Company" },
  { key: "web-upgrade", acc: "w", Icon: MdSystemUpdateAlt, first: "W", rest: "eb Upgrade" },
  { key: "copy-company", acc: "c", Icon: MdContentCopy, first: "C", rest: "opy Company" },
  { key: "backup-restore", acc: "b", Icon: MdBackup, first: "B", rest: "ackup/Restore" },
  { key: "delete-company", acc: "d", Icon: MdDeleteForever, first: "D", rest: "elete Company" },
  { key: "exit-windows", acc: "e", Icon: MdExitToApp, first: "E", rest: "xit to Windows", exit: true },
];

const u = "underline decoration-[#70563F] decoration-2 underline-offset-[3px]";

export default function MasterPenal({ onItemAction }) {
  const navigate = useNavigate();
  const [selectedKey, setSelectedKey] = useState("select-company");

  const act = useCallback(
    (key) => {
      setSelectedKey(key);
      if (key === "exit-windows") {
        navigate("/login");
        return;
      }
      onItemAction?.(key);
    },
    [navigate, onItemAction],
  );

  useEffect(() => {
    function onKeyDown(e) {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const t = e.target;
      if (t?.tagName === "INPUT" || t?.tagName === "TEXTAREA" || t?.isContentEditable) return;
      const item = MENU_ITEMS.find((i) => i.acc === e.key.toLowerCase());
      if (!item) return;
      e.preventDefault();
      act(item.key);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [act]);

  return (
    <div className="relative min-h-dvh w-full overflow-x-hidden text-[#1a1510]">
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(165deg,#fdfbf7_0%,#ede8e2_42%,#e0d6cc_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[min(72vh,640px)] w-[min(140vw,1200px)] -translate-x-1/2 bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,rgba(232,207,122,0.28),transparent_72%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_100%,rgba(112,86,63,0.06),transparent_45%)]"
        aria-hidden
      />

      <main className="relative z-[1] flex min-h-dvh flex-col px-5 pb-16 pt-12 sm:px-10 sm:pb-20 sm:pt-14 md:pt-16">
        <div className="mx-auto w-full max-w-[58rem]">
          <header className="mb-10 text-center sm:mb-14">
            <div className="flex justify-center">
              <p className="inline-flex items-center justify-center rounded-full border border-[#b8922e]/65 bg-gradient-to-b from-[#fffef8] via-[#fdf3d0] to-[#e8cf88] px-7 py-2.5 text-sm font-extrabold uppercase tracking-[0.2em] text-[#3d2a18] shadow-[inset_0_1px_0_rgba(255,255,255,0.95),inset_0_-1px_0_rgba(112,86,63,0.08),0_6px_20px_rgba(112,86,63,0.15)] sm:px-9 sm:py-3 sm:text-base sm:tracking-[0.22em] [text-shadow:0_1px_0_rgba(255,255,255,0.55)]">
                Jewellery ERP
              </p>
            </div>
            <h1 className="mt-2 text-[1.65rem] font-semibold leading-tight tracking-tight text-[#0f0d0b] sm:text-4xl sm:leading-tight">
              Master Panel
            </h1>
            <div
              className="mx-auto mt-6 h-px max-w-xs bg-gradient-to-r from-transparent via-[#c9a227]/55 to-transparent"
              aria-hidden
            />
          </header>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-9 lg:grid-cols-3 lg:gap-10">
            {MENU_ITEMS.map((item) => {
              const Icon = item.Icon;
              const sel = item.key === selectedKey;
              const ex = item.exit;

              return (
                <button
                  key={item.key}
                  type="button"
                  accessKey={item.acc}
                  onClick={() => act(item.key)}
                  className={[
                    "group relative z-0 flex flex-col items-center overflow-hidden rounded-3xl border text-center outline-none",
                    "px-6 py-8 sm:px-8 sm:py-10",
                    "duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:transition-[transform,box-shadow,border-color,background-color]",
                    "shadow-[inset_0_1px_0_rgba(255,255,255,0.96),inset_0_-1px_0_rgba(112,86,63,0.035),0_1px_3px_rgba(112,86,63,0.04),0_14px_40px_-12px_rgba(112,86,63,0.12)]",
                    "hover:z-[1] hover:-translate-y-1.5 hover:border-[#c9a54a]/75 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.99),0_22px_52px_-14px_rgba(112,86,63,0.2)]",
                    "active:translate-y-0 active:scale-[0.98] active:duration-150 active:shadow-[inset_0_4px_14px_rgba(112,86,63,0.08)]",
                    "focus-visible:ring-2 focus-visible:ring-[#70563F]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[#ebe5de]",
                    sel
                      ? "z-[1] border-[#b88920]/95 bg-gradient-to-b from-[#fffdf8] via-[#fffcfa] to-[#f3ebe0] shadow-[inset_0_0_0_1px_rgba(240,214,140,0.55),inset_0_1px_0_rgba(255,255,255,1),0_16px_48px_-12px_rgba(112,86,63,0.18)] before:pointer-events-none before:absolute before:left-0 before:top-[16%] before:bottom-[16%] before:w-1 before:rounded-r-lg before:bg-gradient-to-b before:from-[#fce99b] before:via-[#e0b84a] before:to-[#9a7010] before:content-[''] before:shadow-[4px_0_14px_rgba(184,146,46,0.4)]"
                      : [
                          "border-[#e8e1d9] bg-gradient-to-br from-white via-[#fffefb] to-[#f2ebe3]",
                          "hover:from-white hover:via-[#fffdf9] hover:to-[#f8f2ea]",
                          ex ? "border-red-200/45 hover:border-red-300/85" : "",
                        ].join(" "),
                    ex && !sel
                      ? "shadow-[inset_0_1px_0_rgba(255,255,255,0.94),0_1px_3px_rgba(180,60,60,0.05),0_14px_40px_-12px_rgba(112,86,63,0.11)]"
                      : "",
                  ].join(" ")}
                >
                  <div
                    className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-90"
                    aria-hidden
                  />
                  <div
                    className="pointer-events-none absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-[#70563F]/[0.07] to-transparent"
                    aria-hidden
                  />
                  <div
                    className={[
                      "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100",
                      "bg-[linear-gradient(115deg,rgba(255,252,248,0.5)_0%,transparent_40%,rgba(232,207,122,0.09)_100%)]",
                    ].join(" ")}
                    aria-hidden
                  />
                  <div
                    className={[
                      "relative mb-5 grid h-[6.85rem] w-[6.85rem] shrink-0 place-items-center rounded-2xl border border-white/80",
                      "bg-[linear-gradient(175deg,#ffffff_0%,#efe7df_100%)]",
                      "shadow-[inset_0_3px_10px_rgba(255,255,255,0.92),inset_0_-5px_14px_rgba(112,86,63,0.055),0_10px_26px_-8px_rgba(112,86,63,0.13)]",
                      "ring-1 ring-inset ring-[#d4c9c0]/70",
                      "transition-[transform,box-shadow,ring-color] duration-300 ease-out group-hover:scale-[1.055] group-hover:ring-[#c9a96a]/45",
                      sel && !ex ? "ring-2 ring-[#d4a84a]/55" : "",
                      sel && ex ? "ring-2 ring-red-300/50" : "",
                      ex
                        ? "border-red-100/95 bg-[linear-gradient(175deg,#fffcfc_0%,#f2dede_100%)] ring-red-200/35"
                        : "",
                    ].join(" ")}
                  >
                    <Icon
                      className={`relative h-[3.45rem] w-[3.45rem] sm:h-[3.7rem] sm:w-[3.7rem] transition-transform duration-300 group-hover:scale-[1.03] ${ex ? "text-red-800 drop-shadow-[0_1px_0_rgba(255,255,255,0.6)]" : "text-[#654a36] drop-shadow-[0_1px_0_rgba(255,255,255,0.5)]"}`}
                      aria-hidden
                    />
                  </div>
                  <span
                    className={`relative max-w-[13rem] text-[0.95rem] font-bold leading-snug tracking-tight transition-colors duration-200 group-hover:text-[#0a0908] sm:text-lg sm:tracking-wide ${ex ? "text-red-950 group-hover:text-red-950" : "text-[#1a1612]"}`}
                  >
                    <span className={ex ? `${u} decoration-red-800` : u}>{item.first}</span>
                    {item.rest}
                  </span>
                  <span
                    className={[
                      "relative mt-4 inline-flex min-h-[1.75rem] min-w-[2.35rem] items-center justify-center rounded-full border px-3.5 text-[10px] font-bold uppercase tracking-[0.18em] tabular-nums",
                      "shadow-[inset_0_1px_0_rgba(255,255,255,0.94),0_2px_5px_rgba(112,86,63,0.06)]",
                      "border-[#d5cbc0] bg-gradient-to-b from-[#fffffe] to-[#e9e0d6] text-[#4a392c]",
                      "transition-[border-color,background-color,box-shadow] duration-200 group-hover:border-[#c4a24d]/55 group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,1),0_3px_8px_rgba(112,86,63,0.08)]",
                      sel
                        ? "border-[#c9a227]/55 bg-gradient-to-b from-[#fffef6] to-[#f2e2b8] text-[#352818] shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_0_0_1px_rgba(201,162,39,0.2)]"
                        : "",
                    ].join(" ")}
                  >
                    {item.acc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
