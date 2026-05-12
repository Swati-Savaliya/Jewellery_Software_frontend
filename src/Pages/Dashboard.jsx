import { useEffect, useId, useMemo, useState } from "react";
import {
  MdOutlineBalance,
  MdOutlineInventory2,
  MdOutlineNotificationsActive,
  MdOutlinePaid,
  MdOutlinePercent,
  MdOutlinePointOfSale,
  MdOutlineStackedBarChart,
  MdOutlineTrendingUp,
  MdOutlineVerified,
  MdOutlineWorkspacePremium,
} from "react-icons/md";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const CHART_TOOLTIP = {
  contentStyle: {
    backgroundColor: "#fffefb",
    border: "1px solid #D4C9BE",
    borderRadius: "12px",
    boxShadow: "0 10px 28px rgba(74, 56, 41, 0.12)",
    fontSize: "12px",
    padding: "10px 12px",
  },
  labelStyle: { color: "#2d2419", fontWeight: 700, marginBottom: "4px" },
  itemStyle: { color: "#5c4a3a", paddingTop: "2px" },
  cursor: { stroke: "#c9b8a8", strokeWidth: 1, strokeDasharray: "4 4", fill: "rgba(255, 254, 251, 0.45)" },
};

function formatInr(n) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

/** Faceted gem silhouette for headers (unique gradient id per instance). */
function JewelDiamondMark({ className = "h-8 w-8 shrink-0" }) {
  const uid = useId().replace(/:/g, "");
  const gradId = `jewel-grad-${uid}`;
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M20 5 35 16 28 33 12 33 5 16Z"
        stroke="#b88920"
        strokeWidth="1.1"
        fill={`url(#${gradId})`}
        fillOpacity={0.45}
      />
      <path d="M20 5 35 16 20 17.5 5 16Z" fill="#fffef8" fillOpacity={0.92} stroke="#d4af37" strokeWidth="0.65" />
      <path d="M5 16 20 17.5 12 33Z" fill="#c9a227" fillOpacity={0.22} stroke="#a67c00" strokeWidth="0.45" />
      <path d="M35 16 20 17.5 28 33Z" fill="#70563F" fillOpacity={0.12} stroke="#8a6918" strokeWidth="0.45" />
      <path d="M12 33 20 17.5 28 33Z" fill="#f5ead8" fillOpacity={0.55} stroke="#c9a227" strokeWidth="0.4" />
      <defs>
        <linearGradient id={gradId} x1="5" y1="5" x2="35" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fffdf5" />
          <stop offset="0.55" stopColor="#f0e0b8" />
          <stop offset="1" stopColor="#c9a227" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/** Small CSS rhombus accents — gold / silver / platinum jewellery tones. */
function DiamondRhombusCluster({ className = "" }) {
  return (
    <div className={["flex flex-col items-center gap-2.5", className].filter(Boolean).join(" ")} aria-hidden>
      <span className="h-11 w-11 rotate-45 rounded-lg border border-[#d4af37]/50 bg-gradient-to-br from-white via-[#fff8e6] to-[#e8c96a]/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_10px_28px_rgba(201,162,39,0.2)]" />
      <span className="h-6 w-6 rotate-45 rounded-md border border-slate-300/80 bg-gradient-to-br from-slate-50 to-slate-300/50 shadow-sm" />
      <span className="h-4 w-4 rotate-45 rounded-sm border border-[#a59fe0]/70 bg-gradient-to-br from-[#f4f2ff] to-[#c9c2f0]/80" />
    </div>
  );
}

const INITIAL_TREND = [
  { day: "Mon", gold: 118000, silver: 24000, diamond: 62000 },
  { day: "Tue", gold: 132000, silver: 31000, diamond: 54000 },
  { day: "Wed", gold: 101000, silver: 28000, diamond: 71000 },
  { day: "Thu", gold: 156000, silver: 19000, diamond: 48000 },
  { day: "Fri", gold: 189000, silver: 42000, diamond: 92000 },
  { day: "Sat", gold: 224000, silver: 51000, diamond: 88000 },
  { day: "Sun", gold: 198000, silver: 36000, diamond: 76000 },
];

const TOP_ITEMS_SEED = [
  { sku: "RG-22K-0142", name: "Antique bridal ring set", metal: "Gold 22K", qty: 3, value: 186000 },
  { sku: "NK-18K-2081", name: "Temple necklace (short)", metal: "Gold 18K", qty: 2, value: 142500 },
  { sku: "BR-925-0099", name: "Oxidised kada pair", metal: "Silver 925", qty: 8, value: 22400 },
  { sku: "ER-DM-3310", name: "Solitaire studs 0.5 ct", metal: "Diamond", qty: 4, value: 268000 },
];

const PIE_SEED = [
  { name: "Rings", value: 32, fill: "#b88920" },
  { name: "Chains", value: 24, fill: "#c9a227" },
  { name: "Necklaces", value: 18, fill: "#8b6914" },
  { name: "Bangles", value: 15, fill: "#70563F" },
  { name: "Others", value: 11, fill: "#a89b8e" },
];

const FEED_SEED = [
  { id: "1", bill: "INV-240891", detail: "Gold kada 22K · 42.5 g", amount: 286400, at: "10:42" },
  { id: "2", bill: "INV-240890", detail: "Diamond nose pin · PT 950", amount: 62400, at: "10:38" },
  { id: "3", bill: "RC-11802", detail: "Chain repair · rhodium", amount: 1200, at: "10:21" },
  { id: "4", bill: "INV-240889", detail: "Silver anklet pair 925", amount: 8400, at: "10:05" },
  { id: "5", bill: "INV-240888", detail: "Antique pendant 22K", amount: 97800, at: "09:51" },
];

const BILL_PREFIXES = ["INV", "INV", "INV", "RC", "EST", "ADV"];

export default function Dashboard() {
  const [trend, setTrend] = useState(() => INITIAL_TREND.map((r) => ({ ...r })));
  const [live, setLive] = useState({
    todaySales: 428600,
    repairs: 7,
    lowStock: 12,
    goldRate: 6820,
    silverRate: 92,
    platinumRate: 3480,
    gold18Rate: 5560,
    hallmarkPending: 4,
    goldGramsToday: 186.4,
    makingChargePct: 12.5,
  });
  const [topItems, setTopItems] = useState(() => TOP_ITEMS_SEED.map((r) => ({ ...r })));
  const [pieData, setPieData] = useState(() => PIE_SEED.map((r) => ({ ...r })));
  const [feed, setFeed] = useState(() => [...FEED_SEED]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setTrend((rows) =>
        rows.map((row, i) => {
          if (i !== rows.length - 1) return row;
          const jitter = (v) => Math.max(0, v + Math.round((Math.random() - 0.48) * 12000));
          return {
            day: row.day,
            gold: jitter(row.gold),
            silver: jitter(row.silver),
            diamond: jitter(row.diamond),
          };
        }),
      );
      setLive((s) => ({
        todaySales: Math.max(0, s.todaySales + Math.round((Math.random() - 0.5) * 8000)),
        repairs: Math.max(0, Math.min(24, s.repairs + (Math.random() > 0.72 ? 1 : 0) - (Math.random() > 0.88 ? 1 : 0))),
        lowStock: Math.max(0, s.lowStock + (Math.random() > 0.82 ? -1 : 0) + (Math.random() > 0.9 ? 1 : 0)),
        goldRate: Math.max(6000, s.goldRate + Math.round((Math.random() - 0.5) * 40)),
        silverRate: Math.max(70, s.silverRate + Math.round((Math.random() - 0.5) * 6)),
        platinumRate: Math.max(2800, s.platinumRate + Math.round((Math.random() - 0.5) * 80)),
        gold18Rate: Math.max(4800, s.gold18Rate + Math.round((Math.random() - 0.5) * 35)),
        hallmarkPending: Math.max(0, Math.min(30, s.hallmarkPending + (Math.random() > 0.75 ? 1 : 0) - (Math.random() > 0.8 ? 1 : 0))),
        goldGramsToday: Math.max(0, Math.round((s.goldGramsToday + (Math.random() - 0.45) * 8) * 10) / 10),
        makingChargePct: Math.max(8, Math.min(22, Math.round((s.makingChargePct + (Math.random() - 0.5) * 1.2) * 10) / 10)),
      }));
      setTopItems((rows) =>
        rows.map((r) => ({
          ...r,
          qty: Math.max(1, r.qty + (Math.random() > 0.85 ? 1 : 0) - (Math.random() > 0.9 ? 1 : 0)),
          value: Math.max(5000, r.value + Math.round((Math.random() - 0.5) * 4000)),
        })),
      );
      setPieData((rows) => {
        const next = rows.map((r) => ({
          ...r,
          value: Math.max(4, r.value + Math.round((Math.random() - 0.5) * 4)),
        }));
        const sum = next.reduce((a, b) => a + b.value, 0) || 1;
        return next.map((r) => ({ ...r, value: Math.round((r.value / sum) * 100) }));
      });
      setFeed((rows) => {
        const n = 240800 + Math.floor(Math.random() * 900);
        const prefix = BILL_PREFIXES[Math.floor(Math.random() * BILL_PREFIXES.length)];
        const samples = [
          { detail: "Mangalsutra 22K · 38.2 g", amount: 312000 + Math.round(Math.random() * 20000) },
          { detail: "Kids earring pair · 18K", amount: 28000 + Math.round(Math.random() * 4000) },
          { detail: "Platinum band · couple set", amount: 89000 + Math.round(Math.random() * 8000) },
          { detail: "Silver payal · oxidised", amount: 6400 + Math.round(Math.random() * 600) },
        ];
        const pick = samples[Math.floor(Math.random() * samples.length)];
        const now = new Date();
        const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
        const head = {
          id: `${now.getTime()}`,
          bill: `${prefix}-${n}`,
          detail: pick.detail,
          amount: pick.amount,
          at: time,
        };
        return [head, ...rows.slice(0, 6)];
      });
    }, 6000);
    return () => window.clearInterval(id);
  }, []);

  const metalMix = useMemo(() => {
    const last = trend[trend.length - 1];
    const t = last.gold + last.silver + last.diamond || 1;
    return [
      { metal: "Gold", value: Math.round((last.gold / t) * 100), fill: "#b88920" },
      { metal: "Silver", value: Math.round((last.silver / t) * 100), fill: "#7c8aa0" },
      { metal: "Diamond", value: Math.round((last.diamond / t) * 100), fill: "#70563F" },
    ];
  }, [trend]);

  const headlineDate = useMemo(
    () =>
      new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    [],
  );

  const boardRates = useMemo(
    () => [
      {
        key: "22k",
        jewelleryKind: "Gold jewellery",
        jewelleryHint: "Necklace, chain, kada, rings",
        label: "Gold 22K",
        sub: "Board · per g",
        value: live.goldRate,
        Icon: MdOutlineWorkspacePremium,
        wrap: "bg-gradient-to-br from-[#fff9eb] via-[#fff4dc] to-[#f0e0b8] ring-[#d4af37]/45",
        valueClass: "text-[#4a3410]",
        badgeClass: "bg-[#fff3d6] text-[#6b4a0a] ring-1 ring-[#e8cf7a]/80",
        iconTint: "text-[#9a7618]",
      },
      {
        key: "18k",
        jewelleryKind: "Gold jewellery",
        jewelleryHint: "Light sets, kids, daily wear",
        label: "Gold 18K",
        sub: "Board · per g",
        value: live.gold18Rate,
        Icon: MdOutlineWorkspacePremium,
        wrap: "bg-gradient-to-br from-[#fffefb] to-[#efe8df] ring-[#d4c4b0]/90",
        valueClass: "text-[#1a1510]",
        badgeClass: "bg-[#faf4eb] text-[#5c4a38] ring-1 ring-[#e0d4c8]",
        iconTint: "text-[#7a6552]",
      },
      {
        key: "ag",
        jewelleryKind: "Silver jewellery",
        jewelleryHint: "Payal, kada, oxidised, 925",
        label: "Silver 925",
        sub: "Board · per g",
        value: live.silverRate,
        Icon: MdOutlineInventory2,
        wrap: "bg-gradient-to-br from-slate-50 via-slate-50/90 to-slate-200/40 ring-slate-300/95",
        valueClass: "text-slate-800",
        badgeClass: "bg-slate-100 text-slate-700 ring-1 ring-slate-300/80",
        iconTint: "text-slate-600",
      },
      {
        key: "pt",
        jewelleryKind: "Platinum jewellery",
        jewelleryHint: "Bands, solitaire mounts, PT 950",
        label: "Platinum 950",
        sub: "Board · per g",
        value: live.platinumRate,
        Icon: MdOutlinePaid,
        wrap: "bg-gradient-to-br from-[#f5f2ff] via-[#ebe6ff] to-[#d8d0f5]/60 ring-[#a59fe0]/50",
        valueClass: "text-[#3d3566]",
        badgeClass: "bg-[#ede9ff] text-[#3d2d66] ring-1 ring-[#c4b5fd]/70",
        iconTint: "text-[#5c5280]",
      },
    ],
    [live.goldRate, live.gold18Rate, live.silverRate, live.platinumRate],
  );

  const repairsHot = live.repairs >= 10;
  const stockHot = live.lowStock >= 14;
  const hallHot = live.hallmarkPending >= 8;

  return (
    <section className="box-border w-full min-w-0 max-w-none bg-[#f7f3ee] px-3 pb-12 pt-[6rem] sm:px-4 sm:pb-14 sm:pt-[90px] lg:px-6 lg:pb-16 xl:px-8">
      <div className="mx-auto w-full min-w-0 max-w-[1600px]">
        <div
          className="relative overflow-hidden rounded-3xl border border-[#cfc3b6]/90 bg-gradient-to-br from-[#fffefb] via-[#faf6f0] to-[#f0e8df] p-4 shadow-[0_1px_0_rgba(255,255,255,0.95)_inset,0_24px_60px_-28px_rgba(74,56,41,0.22)] sm:p-6 lg:p-8"
        >
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#c9a227]/[0.07] blur-3xl"
            aria-hidden
          />
          <div className="pointer-events-none absolute -bottom-20 left-1/3 h-56 w-56 rounded-full bg-[#70563F]/[0.06] blur-3xl" aria-hidden />
          <div
            className="pointer-events-none absolute right-4 top-10 z-0 hidden opacity-[0.92] sm:block md:right-8 md:top-14 lg:right-10"
            aria-hidden
          >
            <DiamondRhombusCluster />
          </div>

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-stretch lg:justify-between lg:gap-8">
            <div className="min-w-0 flex-1 lg:max-w-md xl:max-w-lg">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#70563F]">
                <span className="font-semibold uppercase tracking-[0.16em] text-[#70563F]/90">Store pulse</span>
                <span className="hidden h-3 w-px bg-[#D4C9BE] sm:block" aria-hidden />
                <time className="font-medium tabular-nums">{headlineDate}</time>
              </div>

              <div className="mt-4 rounded-2xl border border-[#e8dfd6]/90 bg-white/75 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,1)] backdrop-blur-sm sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[#70563F]">Today&apos;s collection</p>
                    <p className="mt-1 text-3xl font-bold tabular-nums tracking-tight text-[#1a1510] sm:text-4xl">{formatInr(live.todaySales)}</p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-[#70563F]">
                      <MdOutlineTrendingUp className="h-4 w-4 shrink-0 text-emerald-600/90" aria-hidden />
                      Counter + ornament bills (demo)
                    </p>
                  </div>
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#fff6dc] to-[#f0e4c4] ring-1 ring-[#e8cf7a]/60">
                    <MdOutlinePointOfSale className="h-6 w-6 text-[#8a6918]" aria-hidden />
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[#ece4d9] pt-4">
                  <div className="rounded-xl bg-[#faf7f2] px-3 py-2.5 ring-1 ring-[#e8dfd6]/80">
                    <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-[#70563F]">
                      <MdOutlineBalance className="h-3.5 w-3.5" aria-hidden />
                      Gold out today
                    </p>
                    <p className="mt-0.5 text-lg font-bold tabular-nums text-[#1a1510] sm:text-xl">
                      {live.goldGramsToday.toLocaleString("en-IN", { maximumFractionDigits: 1 })} g
                    </p>
                    <p className="text-[10px] text-[#70563F]/85">22K eq. · estimate</p>
                  </div>
                  <div className="rounded-xl bg-[#faf7f2] px-3 py-2.5 ring-1 ring-[#e8dfd6]/80">
                    <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-[#70563F]">
                      <MdOutlinePercent className="h-3.5 w-3.5" aria-hidden />
                      Making (avg)
                    </p>
                    <p className="mt-0.5 text-lg font-bold tabular-nums text-[#1a1510] sm:text-xl">{live.makingChargePct}%</p>
                    <p className="text-[10px] text-[#70563F]/85">On tagged items</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="min-w-0 flex-1 lg:min-w-[280px]">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-[#4a3829]">Live board rates</h2>
                  <p className="mt-1 text-[11px] leading-snug text-[#70563F]">Gold, silver &amp; platinum jewellery counters — tag-wise board / gram.</p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-800">
                  <span className="relative flex h-1.5 w-1.5" aria-hidden>
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/80 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </span>
                  Live
                </span>
              </div>
              <div className="mb-2.5 flex flex-wrap gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#fff6dc] px-2 py-0.5 text-[10px] font-semibold text-[#6b4a0a] ring-1 ring-[#e8cf7a]/75">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#c9a227]" aria-hidden />
                  Gold
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700 ring-1 ring-slate-300/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400" aria-hidden />
                  Silver
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#ede9ff] px-2 py-0.5 text-[10px] font-semibold text-[#3d2d66] ring-1 ring-[#c4b5fd]/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#7c6fbd]" aria-hidden />
                  Platinum
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                {boardRates.map((r) => {
                  const RIcon = r.Icon;
                  return (
                    <div
                      key={r.key}
                      className={[
                        "rounded-2xl border border-white/60 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] ring-1 sm:p-4",
                        r.wrap,
                      ].join(" ")}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <span
                            className={[
                              "inline-flex max-w-full rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide",
                              r.badgeClass,
                            ].join(" ")}
                          >
                            {r.jewelleryKind}
                          </span>
                          <p className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-[#70563F]/90">{r.label}</p>
                          <p className="mt-2 text-xl font-bold tabular-nums sm:text-2xl">
                            <span className={r.valueClass}>₹{Number(r.value).toLocaleString("en-IN")}</span>
                          </p>
                          <p className="mt-0.5 text-[10px] text-[#70563F]/80">{r.sub}</p>
                          <p className="mt-1 text-[10px] leading-snug text-[#70563F]/75">{r.jewelleryHint}</p>
                        </div>
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/70 ring-1 ring-white/80">
                          <RIcon className={["h-5 w-5", r.iconTint].join(" ")} aria-hidden />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex min-w-0 flex-col gap-3 lg:w-[min(100%,280px)] lg:shrink-0">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-[#4a3829]">Needs attention</h2>
              <ul className="flex flex-col gap-2.5">
                <li
                  className={[
                    "flex items-center justify-between gap-3 rounded-2xl border px-3.5 py-3 shadow-sm sm:px-4",
                    repairsHot
                      ? "border-amber-200/90 bg-amber-50/90 ring-1 ring-amber-200/60"
                      : "border-[#e8dfd6]/90 bg-white/80 ring-1 ring-[#ebe4dc]",
                  ].join(" ")}
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/90 ring-1 ring-[#e8dfd6]">
                      <MdOutlineStackedBarChart className="h-5 w-5 text-[#70563F]" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#1a1510]">Repair jobs</p>
                      <p className="text-[11px] text-[#70563F]">Workshop queue</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold tabular-nums text-[#1a1510]">{live.repairs}</span>
                </li>
                <li
                  className={[
                    "flex items-center justify-between gap-3 rounded-2xl border px-3.5 py-3 shadow-sm sm:px-4",
                    stockHot
                      ? "border-rose-200/90 bg-rose-50/85 ring-1 ring-rose-200/50"
                      : "border-[#e8dfd6]/90 bg-white/80 ring-1 ring-[#ebe4dc]",
                  ].join(" ")}
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/90 ring-1 ring-[#e8dfd6]">
                      <MdOutlineNotificationsActive className="h-5 w-5 text-[#70563F]" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#1a1510]">Low stock SKUs</p>
                      <p className="text-[11px] text-[#70563F]">Below reorder</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold tabular-nums text-[#1a1510]">{live.lowStock}</span>
                </li>
                <li
                  className={[
                    "flex items-center justify-between gap-3 rounded-2xl border px-3.5 py-3 shadow-sm sm:px-4",
                    hallHot
                      ? "border-violet-200/90 bg-violet-50/80 ring-1 ring-violet-200/55"
                      : "border-[#e8dfd6]/90 bg-white/80 ring-1 ring-[#ebe4dc]",
                  ].join(" ")}
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/90 ring-1 ring-[#e8dfd6]">
                      <MdOutlineVerified className="h-5 w-5 text-[#70563F]" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#1a1510]">Hallmark queue</p>
                      <p className="text-[11px] text-[#70563F]">HUID / portal</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold tabular-nums text-[#1a1510]">{live.hallmarkPending}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-2 sm:mt-8 sm:gap-3" aria-hidden>
          {[6, 10, 14, 10, 6].map((s, i) => (
            <span
              key={i}
              className="rotate-45 rounded-[2px] border border-[#cfc3b6]/50 bg-gradient-to-br from-white/90 to-[#f4ebe0]/80 shadow-sm"
              style={{ width: s, height: s }}
            />
          ))}
        </div>

        <div className="mt-6 grid gap-4 lg:mt-8 lg:grid-cols-12 lg:gap-5">
          <div className="rounded-2xl border border-[#D4C9BE]/90 bg-gradient-to-b from-white to-[#faf7f2] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_10px_36px_-14px_rgba(112,86,63,0.1)] sm:p-5 lg:col-span-5">
            <h2 className="text-base font-semibold text-[#0f0d0b]">Sales by category</h2>
            <p className="mt-0.5 text-sm text-[#70563F]">Last 7 days — gold, silver, diamond / platinum counters (₹)</p>
            <div className="mt-4 h-[260px] w-full min-w-0 rounded-2xl border border-[#ebe4dc]/90 bg-white/40 p-1 sm:h-[300px] sm:p-2 lg:h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trend} margin={{ top: 16, right: 10, left: 2, bottom: 4 }}>
                  <defs>
                    <linearGradient id="fillGold" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#d4af37" stopOpacity={0.42} />
                      <stop offset="45%" stopColor="#c9a227" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#c9a227" stopOpacity={0.03} />
                    </linearGradient>
                    <linearGradient id="fillSilver" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#94a3b8" stopOpacity={0.38} />
                      <stop offset="50%" stopColor="#7c8aa0" stopOpacity={0.18} />
                      <stop offset="100%" stopColor="#64748b" stopOpacity={0.03} />
                    </linearGradient>
                    <linearGradient id="fillDiamond" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b7355" stopOpacity={0.36} />
                      <stop offset="50%" stopColor="#70563F" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#5c4a3d" stopOpacity={0.04} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 6" stroke="#e5dcd4" strokeOpacity={0.95} vertical={false} />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: "#5c4a3a", fontSize: 12, fontWeight: 600 }}
                    tickMargin={10}
                    axisLine={{ stroke: "#D4C9BE", strokeWidth: 1 }}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                    tick={{ fill: "#70563F", fontSize: 11 }}
                    tickCount={5}
                    domain={[0, "auto"]}
                    axisLine={false}
                    tickLine={false}
                    width={48}
                  />
                  <Tooltip
                    {...CHART_TOOLTIP}
                    labelFormatter={(label) => `Day · ${label}`}
                    formatter={(value) => formatInr(Number(value))}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: "12px", color: "#4a3829", paddingTop: "8px", fontWeight: 600 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="gold"
                    name="Gold"
                    stroke="#a67c00"
                    strokeWidth={2.25}
                    fill="url(#fillGold)"
                    activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff", fill: "#b88920" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="silver"
                    name="Silver"
                    stroke="#5c6b7e"
                    strokeWidth={2.25}
                    fill="url(#fillSilver)"
                    activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff", fill: "#64748b" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="diamond"
                    name="Diamond / PT"
                    stroke="#5c4038"
                    strokeWidth={2.25}
                    fill="url(#fillDiamond)"
                    activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff", fill: "#70563F" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-[#D4C9BE]/90 bg-gradient-to-b from-white to-[#faf7f2] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_10px_36px_-14px_rgba(112,86,63,0.1)] sm:p-5 lg:col-span-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="text-base font-semibold text-[#0f0d0b]">Metal mix (today)</h2>
                <p className="mt-0.5 text-sm text-[#70563F]">
                  Gold, silver &amp; premium jewellery share — last day (demo; split platinum in master when you wire data).
                </p>
              </div>
              <JewelDiamondMark className="h-9 w-9 shrink-0 sm:h-10 sm:w-10" />
            </div>
            <div className="mt-4 h-[260px] w-full min-w-0 rounded-2xl border border-[#ebe4dc]/90 bg-white/40 p-1 sm:h-[300px] sm:p-2 lg:h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metalMix} margin={{ top: 20, right: 8, left: 4, bottom: 8 }} barCategoryGap="18%">
                  <defs>
                    <linearGradient id="barFillGold" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#e8c86a" />
                      <stop offset="100%" stopColor="#b88920" />
                    </linearGradient>
                    <linearGradient id="barFillSilver" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#cbd5e1" />
                      <stop offset="100%" stopColor="#64748b" />
                    </linearGradient>
                    <linearGradient id="barFillDiamond" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#9a8578" />
                      <stop offset="100%" stopColor="#5c4038" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 6" stroke="#e5dcd4" strokeOpacity={0.95} vertical={false} />
                  <XAxis
                    dataKey="metal"
                    type="category"
                    tick={{ fill: "#3d3028", fontSize: 12, fontWeight: 700 }}
                    tickMargin={10}
                    axisLine={{ stroke: "#D4C9BE", strokeWidth: 1 }}
                    tickLine={false}
                  />
                  <YAxis
                    type="number"
                    domain={[0, 100]}
                    ticks={[0, 25, 50, 75, 100]}
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fill: "#70563F", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={42}
                  />
                  <Tooltip {...CHART_TOOLTIP} formatter={(value) => [`${value}%`, "Share"]} />
                  <Bar dataKey="value" name="Share" radius={[10, 10, 0, 0]} maxBarSize={64}>
                    <LabelList
                      dataKey="value"
                      position="top"
                      fill="#2d2419"
                      fontSize={12}
                      fontWeight={700}
                      formatter={(v) => `${v}%`}
                    />
                    {metalMix.map((entry) => {
                      const grad =
                        entry.metal === "Gold"
                          ? "url(#barFillGold)"
                          : entry.metal === "Silver"
                            ? "url(#barFillSilver)"
                            : "url(#barFillDiamond)";
                      return <Cell key={entry.metal} fill={grad} stroke="#fffdfb" strokeWidth={1} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-[#D4C9BE]/90 bg-gradient-to-b from-white to-[#faf7f2] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_10px_36px_-14px_rgba(112,86,63,0.1)] sm:p-5 lg:col-span-4">
            <div>
              <h2 className="text-base font-semibold text-[#0f0d0b]">Ornament mix</h2>
              <p className="mt-0.5 text-sm text-[#70563F]">Category share (counter, demo %)</p>
            </div>
            <div className="h-[220px] w-full min-w-0 rounded-2xl border border-[#ebe4dc]/90 bg-white/40 p-1 sm:h-[260px] sm:p-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 4, right: 4, bottom: 8, left: 4 }}>
                  <defs>
                    <filter id="pieSoftShadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#4a3829" floodOpacity="0.12" />
                    </filter>
                  </defs>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="46%"
                    innerRadius="52%"
                    outerRadius="78%"
                    paddingAngle={2.8}
                    stroke="#faf7f2"
                    strokeWidth={2}
                    cornerRadius={4}
                    style={{ filter: "url(#pieSoftShadow)" }}
                    label={({ percent }) => ((percent ?? 0) >= 0.06 ? `${((percent ?? 0) * 100).toFixed(0)}%` : "")}
                    labelLine={{ stroke: "#c4b5a8", strokeWidth: 1 }}
                  >
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} stroke="#fffefb" strokeWidth={1.5} />
                    ))}
                  </Pie>
                  <Tooltip {...CHART_TOOLTIP} formatter={(value, name) => [`${value}%`, name]} />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    iconType="circle"
                    iconSize={7}
                    wrapperStyle={{ fontSize: "11px", color: "#5c4a3a", fontWeight: 600, paddingTop: "4px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="border-t border-[#ECE4D9] pt-3">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-[#70563F]">Counter feed</h3>
              <ul className="mt-2 max-h-[140px] space-y-2 overflow-y-auto pr-1 text-sm">
                {feed.map((row) => (
                  <li
                    key={row.id}
                    className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1 rounded-lg bg-white/70 px-2.5 py-2 ring-1 ring-[#ebe4dc]"
                  >
                    <span className="font-mono text-[11px] font-semibold text-[#70563F]">{row.bill}</span>
                    <span className="text-[11px] text-[#70563F]/80">{row.at}</span>
                    <span className="w-full text-[13px] leading-snug text-[#1a1510]">{row.detail}</span>
                    <span className="ml-auto font-semibold tabular-nums text-[#5c432f]">{formatInr(row.amount)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:mt-8 lg:grid-cols-12 lg:gap-5">
          <div className="overflow-hidden rounded-2xl border border-[#D4C9BE]/90 bg-gradient-to-b from-white to-[#faf7f2] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_10px_36px_-14px_rgba(112,86,63,0.1)] lg:col-span-8">
            <div className="border-b border-[#ECE4D9] bg-[#FFFCF8]/80 px-4 py-3 sm:px-6 sm:py-4">
              <h2 className="text-base font-semibold text-[#0f0d0b]">Top moving jewellery</h2>
              <p className="mt-0.5 text-sm text-[#70563F]">Fast sellers — weights &amp; values refresh on demo</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[#ECE4D9] bg-[#F9F9F9]/90 text-xs font-semibold uppercase tracking-wide text-[#70563F]">
                    <th className="px-4 py-3 sm:px-6">SKU</th>
                    <th className="px-3 py-3">Item</th>
                    <th className="px-3 py-3">Metal</th>
                    <th className="px-3 py-3 text-right tabular-nums">Qty</th>
                    <th className="px-4 py-3 text-right tabular-nums sm:px-6">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ECE4D9]">
                  {topItems.map((row) => (
                    <tr key={row.sku} className="bg-white/60 transition-colors hover:bg-[#fffdf8]">
                      <td className="px-4 py-3 font-mono text-xs text-[#70563F] sm:px-6">{row.sku}</td>
                      <td className="max-w-[14rem] truncate px-3 py-3 font-medium text-[#1a1510]" title={row.name}>
                        {row.name}
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={[
                            "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
                            row.metal.includes("Gold")
                              ? "bg-[#fff6dc] text-[#7a5a12] ring-1 ring-[#e8cf7a]/80"
                              : row.metal.includes("Silver")
                                ? "bg-slate-100 text-slate-700 ring-1 ring-slate-200"
                                : "bg-[#f3ebe8] text-[#5c4038] ring-1 ring-[#e8dfd6]",
                          ].join(" ")}
                        >
                          {row.metal}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums font-medium text-[#1a1510]">{row.qty}</td>
                      <td className="px-4 py-3 text-right tabular-nums font-semibold text-[#1a1510] sm:px-6">{formatInr(row.value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl border border-[#D4C9BE]/90 bg-[#EDE8E2]/50 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] sm:p-6 lg:col-span-4">
            <h2 className="text-base font-semibold text-[#0f0d0b]">Shortcuts</h2>
            <p className="mt-1 text-sm text-[#70563F]">Hallmark, tagging, schemes</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-center gap-2 rounded-lg bg-white/70 px-3 py-2.5 text-[#1a1510] ring-1 ring-[#e8e1da]">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#c9a227]" aria-hidden />
                <strong className="font-semibold text-[#70563F]">HUID</strong> batch upload from hallmark portal
              </li>
              <li className="flex items-center gap-2 rounded-lg bg-white/70 px-3 py-2.5 text-[#1a1510] ring-1 ring-[#e8e1da]">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#70563F]/50" aria-hidden />
                Old gold exchange rate slab — master
              </li>
              <li className="flex items-center gap-2 rounded-lg bg-white/70 px-3 py-2.5 text-[#1a1510] ring-1 ring-[#e8e1da]">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#70563F]/50" aria-hidden />
                Gold saving scheme maturity list
              </li>
              <li className="flex items-center gap-2 rounded-lg bg-white/70 px-3 py-2.5 text-[#1a1510] ring-1 ring-[#e8e1da]">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#70563F]/50" aria-hidden />
                Print-mail &amp; barcode labels (F-keys)
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
