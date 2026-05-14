import { useEffect, useMemo, useState } from "react";
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
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    boxShadow: "0 12px 32px rgba(15, 23, 42, 0.08)",
    fontSize: "12px",
    padding: "10px 12px",
  },
  labelStyle: { color: "#0f172a", fontWeight: 700, marginBottom: "4px" },
  itemStyle: { color: "#475569", paddingTop: "2px" },
  cursor: { stroke: "#cbd5e1", strokeWidth: 1, strokeDasharray: "4 4", fill: "rgba(248, 250, 252, 0.9)" },
};

function formatInr(n) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
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
        wrap: "border-l-[3px] border-l-amber-500 bg-white ring-1 ring-slate-200/90",
        valueClass: "text-slate-900",
        badgeClass: "bg-amber-50 text-amber-900 ring-1 ring-amber-200/70",
        iconTint: "text-amber-600",
      },
      {
        key: "18k",
        jewelleryKind: "Gold jewellery",
        jewelleryHint: "Light sets, kids, daily wear",
        label: "Gold 18K",
        sub: "Board · per g",
        value: live.gold18Rate,
        Icon: MdOutlineWorkspacePremium,
        wrap: "border-l-[3px] border-l-amber-400/90 bg-white ring-1 ring-slate-200/90",
        valueClass: "text-slate-900",
        badgeClass: "bg-slate-100 text-slate-800 ring-1 ring-slate-200/80",
        iconTint: "text-slate-600",
      },
      {
        key: "ag",
        jewelleryKind: "Silver jewellery",
        jewelleryHint: "Payal, kada, oxidised, 925",
        label: "Silver 925",
        sub: "Board · per g",
        value: live.silverRate,
        Icon: MdOutlineInventory2,
        wrap: "border-l-[3px] border-l-slate-400 bg-white ring-1 ring-slate-200/90",
        valueClass: "text-slate-900",
        badgeClass: "bg-slate-100 text-slate-700 ring-1 ring-slate-200/80",
        iconTint: "text-slate-500",
      },
      {
        key: "pt",
        jewelleryKind: "Platinum jewellery",
        jewelleryHint: "Bands, solitaire mounts, PT 950",
        label: "Platinum 950",
        sub: "Board · per g",
        value: live.platinumRate,
        Icon: MdOutlinePaid,
        wrap: "border-l-[3px] border-l-violet-500 bg-white ring-1 ring-slate-200/90",
        valueClass: "text-slate-900",
        badgeClass: "bg-violet-50 text-violet-900 ring-1 ring-violet-200/70",
        iconTint: "text-violet-600",
      },
    ],
    [live.goldRate, live.gold18Rate, live.silverRate, live.platinumRate],
  );

  const repairsHot = live.repairs >= 10;
  const stockHot = live.lowStock >= 14;
  const hallHot = live.hallmarkPending >= 8;

  return (
    <section className="box-border w-full min-w-0 max-w-none bg-slate-50/90 px-3 pb-12 pt-[6rem] sm:px-4 sm:pb-14 sm:pt-[90px] lg:px-6 lg:pb-16 xl:px-8">
      <div className="mx-auto w-full min-w-0 max-w-[1600px]">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-4 shadow-xl shadow-slate-300/25 ring-1 ring-slate-100 sm:p-6 lg:p-8">
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(125deg,rgba(251,191,36,0.07)_0%,transparent_38%,rgba(241,245,249,0.85)_55%,transparent_100%)]"
            aria-hidden
          />
          <div className="pointer-events-none absolute -right-32 top-0 h-80 w-80 rounded-full bg-amber-400/[0.06] blur-3xl" aria-hidden />
          <div className="pointer-events-none absolute -bottom-24 left-0 h-64 w-64 rounded-full bg-slate-400/[0.05] blur-3xl" aria-hidden />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-stretch lg:justify-between lg:gap-8">
            <div className="min-w-0 flex-1 lg:max-w-md xl:max-w-lg">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                <span className="font-semibold uppercase tracking-[0.14em] text-slate-600">Store pulse</span>
                <span className="hidden h-3 w-px bg-slate-200 sm:block" aria-hidden />
                <time className="font-medium tabular-nums text-slate-600">{headlineDate}</time>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200/90 bg-gradient-to-br from-white to-slate-50/80 p-4 shadow-sm sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Today&apos;s collection</p>
                    <p className="mt-1 text-3xl font-bold tabular-nums tracking-tight text-slate-900 sm:text-4xl">{formatInr(live.todaySales)}</p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                      <MdOutlineTrendingUp className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
                      Counter + ornament bills (demo)
                    </p>
                  </div>
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-amber-500/10 ring-1 ring-amber-500/20">
                    <MdOutlinePointOfSale className="h-6 w-6 text-amber-700" aria-hidden />
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-200/80 pt-4">
                  <div className="rounded-xl border border-slate-100 bg-white px-3 py-2.5 shadow-sm">
                    <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                      <MdOutlineBalance className="h-3.5 w-3.5" aria-hidden />
                      Gold out today
                    </p>
                    <p className="mt-0.5 text-lg font-bold tabular-nums text-slate-900 sm:text-xl">
                      {live.goldGramsToday.toLocaleString("en-IN", { maximumFractionDigits: 1 })} g
                    </p>
                    <p className="text-[10px] text-slate-500">22K eq. · estimate</p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-white px-3 py-2.5 shadow-sm">
                    <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                      <MdOutlinePercent className="h-3.5 w-3.5" aria-hidden />
                      Making (avg)
                    </p>
                    <p className="mt-0.5 text-lg font-bold tabular-nums text-slate-900 sm:text-xl">{live.makingChargePct}%</p>
                    <p className="text-[10px] text-slate-500">On tagged items</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="min-w-0 flex-1 lg:min-w-[280px]">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-800">Live board rates</h2>
                  <p className="mt-1 text-[11px] leading-snug text-slate-500">Gold, silver &amp; platinum jewellery counters — tag-wise board / gram.</p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-800">
                  <span className="relative flex h-1.5 w-1.5" aria-hidden>
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/80 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </span>
                  Live
                </span>
              </div>
              <div className="mb-2.5 flex flex-wrap gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-900 ring-1 ring-amber-200/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" aria-hidden />
                  Gold
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700 ring-1 ring-slate-200/90">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400" aria-hidden />
                  Silver
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-semibold text-violet-900 ring-1 ring-violet-200/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-500" aria-hidden />
                  Platinum
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                {boardRates.map((r) => {
                  const RIcon = r.Icon;
                  return (
                    <div
                      key={r.key}
                      className={["rounded-2xl border border-slate-100 p-3 shadow-sm sm:p-4", r.wrap].join(" ")}
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
                          <p className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-slate-500">{r.label}</p>
                          <p className="mt-2 text-xl font-bold tabular-nums sm:text-2xl">
                            <span className={r.valueClass}>₹{Number(r.value).toLocaleString("en-IN")}</span>
                          </p>
                          <p className="mt-0.5 text-[10px] text-slate-500">{r.sub}</p>
                          <p className="mt-1 text-[10px] leading-snug text-slate-500/90">{r.jewelleryHint}</p>
                        </div>
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-50 ring-1 ring-slate-200/80">
                          <RIcon className={["h-5 w-5", r.iconTint].join(" ")} aria-hidden />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex min-w-0 flex-col gap-3 lg:w-[min(100%,280px)] lg:shrink-0">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-800">Needs attention</h2>
              <ul className="flex flex-col gap-2.5">
                <li
                  className={[
                    "flex items-center justify-between gap-3 rounded-2xl border px-3.5 py-3 shadow-sm sm:px-4",
                    repairsHot
                      ? "border-amber-200 bg-amber-50/90 ring-1 ring-amber-200/70"
                      : "border-slate-200/90 bg-white ring-1 ring-slate-100",
                  ].join(" ")}
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-50 ring-1 ring-slate-200/80">
                      <MdOutlineStackedBarChart className="h-5 w-5 text-slate-600" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-900">Repair jobs</p>
                      <p className="text-[11px] text-slate-500">Workshop queue</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold tabular-nums text-slate-900">{live.repairs}</span>
                </li>
                <li
                  className={[
                    "flex items-center justify-between gap-3 rounded-2xl border px-3.5 py-3 shadow-sm sm:px-4",
                    stockHot
                      ? "border-rose-200 bg-rose-50 ring-1 ring-rose-200/60"
                      : "border-slate-200/90 bg-white ring-1 ring-slate-100",
                  ].join(" ")}
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-50 ring-1 ring-slate-200/80">
                      <MdOutlineNotificationsActive className="h-5 w-5 text-slate-600" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-900">Low stock SKUs</p>
                      <p className="text-[11px] text-slate-500">Below reorder</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold tabular-nums text-slate-900">{live.lowStock}</span>
                </li>
                <li
                  className={[
                    "flex items-center justify-between gap-3 rounded-2xl border px-3.5 py-3 shadow-sm sm:px-4",
                    hallHot
                      ? "border-violet-200 bg-violet-50 ring-1 ring-violet-200/60"
                      : "border-slate-200/90 bg-white ring-1 ring-slate-100",
                  ].join(" ")}
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-50 ring-1 ring-slate-200/80">
                      <MdOutlineVerified className="h-5 w-5 text-slate-600" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-900">Hallmark queue</p>
                      <p className="text-[11px] text-slate-500">HUID / portal</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold tabular-nums text-slate-900">{live.hallmarkPending}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:mt-8 lg:grid-cols-12 lg:gap-5">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm sm:p-5 lg:col-span-5">
            <h2 className="text-base font-semibold text-slate-900">Sales by category</h2>
            <p className="mt-0.5 text-sm text-slate-500">Last 7 days — gold, silver, diamond / platinum counters (₹)</p>
            <div className="mt-4 h-[260px] w-full min-w-0 rounded-xl border border-slate-100 bg-slate-50/50 p-1 sm:h-[300px] sm:p-2 lg:h-[320px]">
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
                  <CartesianGrid strokeDasharray="3 6" stroke="#e2e8f0" strokeOpacity={0.95} vertical={false} />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: "#475569", fontSize: 12, fontWeight: 600 }}
                    tickMargin={10}
                    axisLine={{ stroke: "#e2e8f0", strokeWidth: 1 }}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                    tick={{ fill: "#64748b", fontSize: 11 }}
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
                    wrapperStyle={{ fontSize: "12px", color: "#334155", paddingTop: "8px", fontWeight: 600 }}
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

          <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm sm:p-5 lg:col-span-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="text-base font-semibold text-slate-900">Metal mix (today)</h2>
                <p className="mt-0.5 text-sm text-slate-500">
                  Gold, silver &amp; premium jewellery share — last day (demo; split platinum in master when you wire data).
                </p>
              </div>
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-500/10 ring-1 ring-amber-500/25 sm:h-11 sm:w-11">
                <MdOutlineWorkspacePremium className="h-5 w-5 text-amber-700 sm:h-6 sm:w-6" aria-hidden />
              </div>
            </div>
            <div className="mt-4 h-[260px] w-full min-w-0 rounded-xl border border-slate-100 bg-slate-50/50 p-1 sm:h-[300px] sm:p-2 lg:h-[320px]">
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
                  <CartesianGrid strokeDasharray="3 6" stroke="#e2e8f0" strokeOpacity={0.95} vertical={false} />
                  <XAxis
                    dataKey="metal"
                    type="category"
                    tick={{ fill: "#334155", fontSize: 12, fontWeight: 700 }}
                    tickMargin={10}
                    axisLine={{ stroke: "#e2e8f0", strokeWidth: 1 }}
                    tickLine={false}
                  />
                  <YAxis
                    type="number"
                    domain={[0, 100]}
                    ticks={[0, 25, 50, 75, 100]}
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={42}
                  />
                  <Tooltip {...CHART_TOOLTIP} formatter={(value) => [`${value}%`, "Share"]} />
                  <Bar dataKey="value" name="Share" radius={[10, 10, 0, 0]} maxBarSize={64}>
                    <LabelList
                      dataKey="value"
                      position="top"
                      fill="#0f172a"
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
                      return <Cell key={entry.metal} fill={grad} stroke="#f8fafc" strokeWidth={1} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm sm:p-5 lg:col-span-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Ornament mix</h2>
              <p className="mt-0.5 text-sm text-slate-500">Category share (counter, demo %)</p>
            </div>
            <div className="h-[220px] w-full min-w-0 rounded-xl border border-slate-100 bg-slate-50/50 p-1 sm:h-[260px] sm:p-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 4, right: 4, bottom: 8, left: 4 }}>
                  <defs>
                    <filter id="pieSoftShadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#0f172a" floodOpacity="0.08" />
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
                    stroke="#f1f5f9"
                    strokeWidth={2}
                    cornerRadius={4}
                    style={{ filter: "url(#pieSoftShadow)" }}
                    label={({ percent }) => ((percent ?? 0) >= 0.06 ? `${((percent ?? 0) * 100).toFixed(0)}%` : "")}
                    labelLine={{ stroke: "#cbd5e1", strokeWidth: 1 }}
                  >
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} stroke="#ffffff" strokeWidth={1.5} />
                    ))}
                  </Pie>
                  <Tooltip {...CHART_TOOLTIP} formatter={(value, name) => [`${value}%`, name]} />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    iconType="circle"
                    iconSize={7}
                    wrapperStyle={{ fontSize: "11px", color: "#475569", fontWeight: 600, paddingTop: "4px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="border-t border-slate-200/90 pt-3">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Counter feed</h3>
              <ul className="mt-2 max-h-[140px] space-y-2 overflow-y-auto pr-1 text-sm">
                {feed.map((row) => (
                  <li
                    key={row.id}
                    className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1 rounded-lg border border-slate-100 bg-slate-50/80 px-2.5 py-2"
                  >
                    <span className="font-mono text-[11px] font-semibold text-slate-600">{row.bill}</span>
                    <span className="text-[11px] text-slate-400">{row.at}</span>
                    <span className="w-full text-[13px] leading-snug text-slate-800">{row.detail}</span>
                    <span className="ml-auto font-semibold tabular-nums text-slate-900">{formatInr(row.amount)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:mt-8 lg:grid-cols-12 lg:gap-5">
          <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm lg:col-span-8">
            <div className="border-b border-slate-200/90 bg-slate-50/80 px-4 py-3 sm:px-6 sm:py-4">
              <h2 className="text-base font-semibold text-slate-900">Top moving jewellery</h2>
              <p className="mt-0.5 text-sm text-slate-500">Fast sellers — weights &amp; values refresh on demo</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200/90 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-4 py-3 sm:px-6">SKU</th>
                    <th className="px-3 py-3">Item</th>
                    <th className="px-3 py-3">Metal</th>
                    <th className="px-3 py-3 text-right tabular-nums">Qty</th>
                    <th className="px-4 py-3 text-right tabular-nums sm:px-6">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {topItems.map((row) => (
                    <tr key={row.sku} className="bg-white transition-colors hover:bg-slate-50/90">
                      <td className="px-4 py-3 font-mono text-xs text-slate-500 sm:px-6">{row.sku}</td>
                      <td className="max-w-[14rem] truncate px-3 py-3 font-medium text-slate-900" title={row.name}>
                        {row.name}
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={[
                            "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
                            row.metal.includes("Gold")
                              ? "bg-amber-50 text-amber-900 ring-1 ring-amber-200/80"
                              : row.metal.includes("Silver")
                                ? "bg-slate-100 text-slate-700 ring-1 ring-slate-200/90"
                                : "bg-stone-100 text-stone-800 ring-1 ring-stone-200/80",
                          ].join(" ")}
                        >
                          {row.metal}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums font-medium text-slate-900">{row.qty}</td>
                      <td className="px-4 py-3 text-right tabular-nums font-semibold text-slate-900 sm:px-6">{formatInr(row.value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800/10 bg-gradient-to-br from-slate-900 to-slate-800 p-4 text-slate-100 shadow-lg shadow-slate-900/20 sm:p-6 lg:col-span-4">
            <h2 className="text-base font-semibold text-white">Shortcuts</h2>
            <p className="mt-1 text-sm text-slate-400">Hallmark, tagging, schemes</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-slate-200 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" aria-hidden />
                <strong className="font-semibold text-amber-200/95">HUID</strong> batch upload from hallmark portal
              </li>
              <li className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-slate-200 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" aria-hidden />
                Old gold exchange rate slab — master
              </li>
              <li className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-slate-200 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" aria-hidden />
                Gold saving scheme maturity list
              </li>
              <li className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-slate-200 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" aria-hidden />
                Print-mail &amp; barcode labels (F-keys)
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
