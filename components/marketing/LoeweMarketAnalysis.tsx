"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { LoeweGlobalCandleLineChart } from "@/components/marketing/LoeweGlobalCandleLineChart";

const MINT = "#B2C2A2";
const FOREST = "#5A946E";
const SKY = "#A3D1D1";
const TITLE_GREEN = "#00332E";

/** Approximates CSS ease-out-expo */
const EASE_OUT_EXPO: [number, number, number, number] = [0.19, 1, 0.22, 1];

const BAR_DURATION = 1.5;
const PIE_DURATION = 1.5;
const CHART_EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const BRANDS: { en: string; zh: string }[] = [
  { en: "BEAST", zh: "野兽派" },
  { en: "GOCAL", zh: "菓凯" },
  { en: "DIPTYQUE", zh: "蒂普提克" },
  { en: "JO MALONE", zh: "祖玛珑" },
  { en: "GUANXIA", zh: "观夏" },
  { en: "HOME FACIAL PRO", zh: "家园卫士" },
  { en: "HUIXIU", zh: "惠秀" },
  { en: "WANHUO", zh: "万火" },
  { en: "AYDRY & CO", zh: "艾琳" },
  { en: "LOEWE", zh: "罗意威" },
];

type CagrDatum = {
  year: number;
  value: number;
  forecast?: boolean;
  noteEn?: string;
  noteZh?: string;
};

const CAGR_DATA: CagrDatum[] = [
  { year: 2001, value: 3 },
  { year: 2002, value: 3 },
  { year: 2003, value: 3 },
  { year: 2004, value: 3 },
  { year: 2005, value: 13 },
  { year: 2006, value: 3 },
  { year: 2007, value: 9 },
  {
    year: 2008,
    value: -3,
    noteEn: "Financial Crisis",
    noteZh: "金融危机",
  },
  { year: 2009, value: 3 },
  { year: 2010, value: 3 },
  { year: 2011, value: 3 },
  { year: 2012, value: 3 },
  { year: 2013, value: 3 },
  { year: 2014, value: 3 },
  { year: 2015, value: 14 },
  { year: 2016, value: 3 },
  { year: 2017, value: 3 },
  { year: 2018, value: -1 },
  { year: 2019, value: 4 },
  { year: 2020, value: -2 },
  {
    year: 2021,
    value: 17,
    noteEn: "Peak Growth",
    noteZh: "增长巅峰",
  },
  { year: 2022, value: -1 },
  { year: 2023, value: 4 },
  { year: 2024, value: 3 },
  { year: 2025, value: 4 },
  { year: 2026, value: 3, forecast: true },
  { year: 2027, value: 2, forecast: true },
  { year: 2028, value: 2, forecast: true },
  { year: 2029, value: 7, forecast: true },
  { year: 2030, value: 3, forecast: true },
];

function polar(cx: number, cy: number, r: number, angleRad: number) {
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
}

function pieSlicePath(
  cx: number,
  cy: number,
  r: number,
  startAngleRad: number,
  sweepFrac: number,
) {
  const sweep = sweepFrac * 2 * Math.PI;
  const endAngle = startAngleRad + sweep;
  const p0 = polar(cx, cy, r, startAngleRad);
  const p1 = polar(cx, cy, r, endAngle);
  const largeArc = sweep > Math.PI ? 1 : 0;
  return `M ${cx} ${cy} L ${p0.x} ${p0.y} A ${r} ${r} 0 ${largeArc} 1 ${p1.x} ${p1.y} Z`;
}

function midExplodeVector(
  cx: number,
  cy: number,
  startAngleRad: number,
  sweepFrac: number,
  dist: number,
) {
  const mid = startAngleRad + sweepFrac * Math.PI;
  return {
    x: dist * Math.cos(mid),
    y: dist * Math.sin(mid),
  };
}


function BarBlock({
  labelEn,
  labelZh,
  value,
  maxTotal,
  color,
  showValue,
  active,
}: {
  labelEn: string;
  labelZh: string;
  value: number;
  maxTotal: number;
  color: string;
  showValue: number;
  active: boolean;
}) {
  const maxH = 180;
  const targetH = maxH * (value / maxTotal);
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-3">
      <span
        className="text-2xl font-medium tabular-nums sm:text-3xl [font-family:var(--font-cormorant),serif]"
        style={{ color: TITLE_GREEN }}
      >
        {showValue}
      </span>
      <div className="flex h-[180px] w-full max-w-[100px] items-end justify-center sm:max-w-[120px]">
        <motion.div
          className="w-full rounded-t-md"
          style={{
            backgroundColor: color,
            height: targetH,
            transformOrigin: "bottom",
          }}
          initial={false}
          animate={{ scaleY: active ? 1 : 0 }}
          transition={{
            duration: BAR_DURATION,
            ease: EASE_OUT_EXPO,
          }}
        />
      </div>
      <div className="text-center text-[11px] leading-snug text-black/80 sm:text-xs">
        <p className="font-medium [font-family:var(--font-cormorant),serif]">
          {labelEn}
        </p>
        <p
          className="mt-0.5 text-black/55"
          style={{
            fontFamily: "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
          }}
        >
          {labelZh}
        </p>
      </div>
    </div>
  );
}

function IntlDomesticBars({ active }: { active: boolean }) {
  const intl = 5;
  const dom = 15;
  const total = intl + dom;

  const intlMv = useMotionValue(0);
  const domMv = useMotionValue(0);
  const [intlShow, setIntlShow] = useState(0);
  const [domShow, setDomShow] = useState(0);

  useEffect(() => {
    if (!active) return;
    intlMv.set(0);
    domMv.set(0);
    const c1 = animate(intlMv, intl, {
      duration: BAR_DURATION,
      ease: EASE_OUT_EXPO,
    });
    const c2 = animate(domMv, dom, {
      duration: BAR_DURATION,
      ease: EASE_OUT_EXPO,
    });
    return () => {
      c1.stop();
      c2.stop();
    };
  }, [active, intl, dom, intlMv, domMv]);

  useMotionValueEvent(intlMv, "change", (v) => setIntlShow(Math.round(v)));
  useMotionValueEvent(domMv, "change", (v) => setDomShow(Math.round(v)));

  return (
    <div className="flex w-full max-w-md flex-row items-end justify-center gap-6 sm:gap-10 md:mx-auto">
      <BarBlock
        labelEn="International Brands"
        labelZh="国际品牌"
        value={intl}
        maxTotal={total}
        color={FOREST}
        showValue={intlShow}
        active={active}
      />
      <BarBlock
        labelEn="Domestic Brands"
        labelZh="国货品牌"
        value={dom}
        maxTotal={total}
        color={FOREST}
        showValue={domShow}
        active={active}
      />
    </div>
  );
}

function PricePie({ active }: { active: boolean }) {
  const cx = 100;
  const cy = 100;
  const r = 78;
  const fracA = 0.714;
  const fracB = 0.286;
  const start = -Math.PI / 2;

  const pathA = pieSlicePath(cx, cy, r, start, fracA);
  const pathB = pieSlicePath(cx, cy, r, start + fracA * 2 * Math.PI, fracB);

  const explodeA = midExplodeVector(cx, cy, start, fracA, 10);
  const explodeB = midExplodeVector(
    cx,
    cy,
    start + fracA * 2 * Math.PI,
    fracB,
    10,
  );

  const [hover, setHover] = useState<"a" | "b" | null>(null);

  return (
    <div className="relative flex flex-col items-center">
      <svg
        viewBox="0 0 200 200"
        className="h-[220px] w-[220px] max-w-full sm:h-[260px] sm:w-[260px]"
        aria-hidden
      >
        <motion.g
          initial={false}
          animate={
            hover === "a"
              ? { x: explodeA.x, y: explodeA.y }
              : { x: 0, y: 0 }
          }
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          onMouseEnter={() => setHover("a")}
          onMouseLeave={() => setHover(null)}
          style={{ cursor: "default" }}
        >
          <motion.path
            d={pathA}
            fill={FOREST}
            stroke="rgba(0,0,0,0.06)"
            strokeWidth={0.5}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={
              active
                ? { pathLength: 1, opacity: 1 }
                : { pathLength: 0, opacity: 0 }
            }
            transition={{
              pathLength: {
                duration: PIE_DURATION,
                ease: CHART_EASE,
                delay: 0.05,
              },
              opacity: { duration: 0.35, delay: 0.05 },
            }}
          />
        </motion.g>
        <motion.g
          initial={false}
          animate={
            hover === "b"
              ? { x: explodeB.x, y: explodeB.y }
              : { x: 0, y: 0 }
          }
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          onMouseEnter={() => setHover("b")}
          onMouseLeave={() => setHover(null)}
        >
          <motion.path
            d={pathB}
            fill={SKY}
            stroke="rgba(0,0,0,0.06)"
            strokeWidth={0.5}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={
              active
                ? { pathLength: 1, opacity: 1 }
                : { pathLength: 0, opacity: 0 }
            }
            transition={{
              pathLength: {
                duration: PIE_DURATION,
                ease: CHART_EASE,
                delay: 0.2,
              },
              opacity: { duration: 0.35, delay: 0.2 },
            }}
          />
        </motion.g>
      </svg>

      {hover === "a" && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-[120%] rounded-md bg-[rgba(255,255,255,0.95)] px-3 py-2 text-center text-sm shadow-lg [font-family:var(--font-cormorant),serif]"
          style={{ color: TITLE_GREEN }}
        >
          <span className="font-semibold">71.4%</span>
          <p className="mt-0.5 text-[11px] font-normal text-black/60">
            Below 221 RMB / 221以下
          </p>
        </motion.div>
      )}
      {hover === "b" && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 translate-y-[20%] rounded-md bg-[rgba(255,255,255,0.95)] px-3 py-2 text-center text-sm shadow-lg [font-family:var(--font-cormorant),serif]"
          style={{ color: TITLE_GREEN }}
        >
          <span className="font-semibold">28.6%</span>
          <p className="mt-0.5 text-[11px] font-normal text-black/60">
            Above 221 RMB / 221及以上
          </p>
        </motion.div>
      )}
    </div>
  );
}

const CAGR_MAX_POS = 20;
const CAGR_MAX_NEG = 10;
const UPPER_PLOT_PX = 112;
const LOWER_PLOT_PX = 112;

function CagrBar({
  datum,
  index,
  active,
}: {
  datum: CagrDatum;
  index: number;
  active: boolean;
}) {
  const mv = useMotionValue(0);
  const [label, setLabel] = useState(0);
  const positive = datum.value >= 0;
  const mag = Math.abs(datum.value);
  const upperColPct = positive
    ? Math.min(96, (mag / CAGR_MAX_POS) * 86 + (mag > 0 ? 6 : 0))
    : 0;
  const lowerColPct = !positive
    ? Math.min(92, (mag / CAGR_MAX_NEG) * 62 + (mag > 0 ? 8 : 0))
    : 0;

  useEffect(() => {
    if (!active) return;
    mv.set(0);
    const control = animate(mv, datum.value, {
      duration: 0.7,
      delay: index * 0.04,
      ease: EASE_OUT_EXPO,
    });
    return () => control.stop();
  }, [active, datum.value, index, mv]);

  useMotionValueEvent(mv, "change", (value) => {
    setLabel(Number(value.toFixed(0)));
  });

  const barTone = datum.forecast
    ? "border border-[#00332E] bg-white"
    : "bg-[#5A946E]";

  return (
    <div className="group relative flex w-7 shrink-0 flex-col items-stretch sm:w-8">
      {datum.noteEn ? (
        <div className="pointer-events-none absolute -top-1 left-1/2 z-20 hidden w-[5.5rem] -translate-x-1/2 -translate-y-full rounded-md bg-[rgba(255,255,255,0.96)] px-2 py-1 text-center text-[9px] leading-tight text-[#00332E] shadow-md group-hover:block sm:text-[10px]">
          <p className="[font-family:var(--font-cormorant),serif]">{datum.noteEn}</p>
          <p
            className="text-black/60"
            style={{
              fontFamily:
                "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
            }}
          >
            {datum.noteZh}
          </p>
        </div>
      ) : null}

      <div
        className="relative w-full border-b-2 border-[#00332E]/85"
        style={{ height: UPPER_PLOT_PX }}
      >
        <div className="pointer-events-none absolute inset-x-0 top-[8%] border-t border-dashed border-[#00332E]/14" />
        <div className="pointer-events-none absolute inset-x-0 top-[26%] border-t border-dashed border-[#00332E]/12" />
        {positive ? (
          <div className="absolute inset-x-0 bottom-0 top-0 flex items-end justify-center px-px">
            <div
              className="flex w-full max-w-[18px] flex-col items-center justify-end gap-0.5 sm:max-w-[20px]"
              style={{
                height: `${upperColPct}%`,
                minHeight: mag > 0 ? 10 : 0,
              }}
            >
              <motion.span
                className="text-[9px] font-bold tabular-nums leading-none text-[#00332E] [font-family:var(--font-cormorant),serif] sm:text-[10px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: active ? 1 : 0 }}
                transition={{ duration: 0.3, delay: index * 0.04 + 0.32 }}
              >
                {label}%
              </motion.span>
              <motion.div
                className={`w-full min-h-[3px] flex-1 rounded-t-[3px] ${barTone}`}
                initial={false}
                animate={{ scaleY: active ? 1 : 0 }}
                whileHover={{ scale: 1.05 }}
                transition={{
                  duration: 0.75,
                  delay: index * 0.04,
                  ease: EASE_OUT_EXPO,
                }}
                style={{ transformOrigin: "bottom" }}
              />
            </div>
          </div>
        ) : null}
      </div>

      <div className="relative w-full" style={{ height: LOWER_PLOT_PX }}>
        <div className="pointer-events-none absolute inset-x-0 bottom-[10%] border-t border-dashed border-[#00332E]/12" />
        {!positive ? (
          <div className="absolute inset-x-0 bottom-0 top-0 flex items-start justify-center px-px pt-0">
            <div
              className="flex w-full max-w-[18px] flex-col items-center justify-start gap-0.5 sm:max-w-[20px]"
              style={{
                height: `${lowerColPct}%`,
                minHeight: mag > 0 ? 10 : 0,
              }}
            >
              <motion.div
                className={`w-full min-h-[3px] flex-1 rounded-b-[3px] ${barTone}`}
                initial={false}
                animate={{ scaleY: active ? 1 : 0 }}
                whileHover={{ scale: 1.05 }}
                transition={{
                  duration: 0.75,
                  delay: index * 0.04,
                  ease: EASE_OUT_EXPO,
                }}
                style={{ transformOrigin: "top" }}
              />
              <motion.span
                className="text-[9px] font-bold tabular-nums leading-none text-[#00332E] [font-family:var(--font-cormorant),serif] sm:text-[10px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: active ? 1 : 0 }}
                transition={{ duration: 0.3, delay: index * 0.04 + 0.32 }}
              >
                {label}%
              </motion.span>
            </div>
          </div>
        ) : null}
      </div>

      <p className="mt-1 text-center text-[9px] font-bold tabular-nums text-black/85 [font-family:var(--font-cormorant),serif] sm:text-[10px]">
        {String(datum.year).slice(-2)}
      </p>
    </div>
  );
}

function GlobalCagrChart({ active }: { active: boolean }) {
  const axisH = UPPER_PLOT_PX + LOWER_PLOT_PX;

  return (
    <div>
      <div className="relative pb-11">
        <div className="overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch]">
          <div className="flex min-w-min items-stretch gap-2 pr-1">
            <div
              className="sticky left-0 z-[1] flex w-9 shrink-0 flex-col justify-between border-r border-black/10 bg-[#B2C2A2]/95 py-1 pr-2 text-[9px] font-bold leading-tight text-black/80 md:w-10 md:text-[10px]"
              style={{ height: axisH }}
            >
              <span className="text-right">20%</span>
              <span className="text-right">10%</span>
              <span className="text-right text-black">0%</span>
              <span className="text-right">-10%</span>
            </div>
            <div className="flex min-w-max items-stretch gap-1.5 pb-0.5">
              {CAGR_DATA.map((datum, index) => (
                <CagrBar
                  key={datum.year}
                  datum={datum}
                  index={index}
                  active={active}
                />
              ))}
            </div>
          </div>
        </div>

        <p className="pointer-events-none absolute bottom-0 right-1 z-[2] max-w-[13rem] text-right text-[8px] leading-snug text-black/55 md:max-w-[15rem] md:text-[9px]">
          <span className="block font-semibold [font-family:var(--font-cormorant),serif]">
            Right · Scroll to explore the market pulse over three decades.
          </span>
          <span
            className="mt-0.5 block font-semibold text-black/60"
            style={{
              fontFamily:
                "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
            }}
          >
            向右滑动以探索横跨三十年的市场脉动
          </span>
        </p>
      </div>

      <div className="mx-auto mt-3 max-w-3xl px-2 text-center md:mt-4">
        <h3 className="text-sm font-semibold tracking-tight text-black md:text-base [font-family:var(--font-cormorant),serif]">
          CAGR of the Global Candle Market (2001-2030)
        </h3>
        <p
          className="mt-1 text-xs text-black/60 md:text-[13px]"
          style={{
            fontFamily:
              "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
          }}
        >
          全球蜡烛市场年度复合增长率 (2001-2030)
        </p>
      </div>
    </div>
  );
}

function GlobalSummary({ active }: { active: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22, filter: "blur(10px)" }}
      animate={
        active
          ? { opacity: 1, y: 0, filter: "blur(0px)" }
          : { opacity: 0, y: 22, filter: "blur(10px)" }
      }
      transition={{ duration: 0.85, ease: "easeOut" }}
      className="mb-10 md:mb-12"
    >
      <p className="mb-6 flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-xs font-semibold tracking-tight text-black md:mb-7 md:text-[13px] [font-family:var(--font-cormorant),serif]">
        <span>Global Market Analysis</span>
        <span className="font-semibold text-black/45">/</span>
        <span
          className="font-semibold text-black/80"
          style={{
            fontFamily:
              "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
          }}
        >
          全球市场趋势
        </span>
      </p>
      <div className="max-w-4xl space-y-4 text-left">
        <p
          lang="en"
          className="text-sm font-normal leading-relaxed text-black md:text-[15px]"
          style={{ fontFamily: "var(--font-cormorant), serif" }}
        >
          In the year 2021, the CAGR (Compound Annual Growth Rate) of the global
          candle market reached its zenith, peaking at approximately 17%. Looking
          ahead, the market is projected to maintain a steady upward trajectory,
          with an expected CAGR of about 3% through 2030. Presently, scented
          candles continue to command a distinct and resilient demand among
          global consumers.
        </p>
        <p
          lang="zh-Hans"
          className="text-sm leading-relaxed text-black md:text-[15px]"
          style={{
            fontFamily: "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
          }}
        >
          在 2021 年，全球蜡烛市场的年度复合增长率（CAGR）达到了巅峰，增长了约
          17%。在接下来的几年中，该市场预计将进一步增长，到 2030 年复合增长率将保持在
          3%左右。当下，香薰蜡烛在全球范围内依然拥有明确且稳定的用户需求。
        </p>
      </div>
    </motion.div>
  );
}

export function LoeweMarketAnalysis() {
  const barRegionRef = useRef<HTMLDivElement>(null);
  const chartRowRef = useRef<HTMLDivElement>(null);
  const cagrRegionRef = useRef<HTMLDivElement>(null);
  /** Fires when the bar chart block (title + bars) is meaningfully on screen */
  const barsInView = useInView(barRegionRef, {
    once: true,
    amount: 0.45,
    margin: "0px 0px -12% 0px",
  });
  const rowInView = useInView(chartRowRef, {
    once: true,
    amount: 0.22,
    margin: "-6% 0px",
  });
  const cagrInView = useInView(cagrRegionRef, {
    once: true,
    amount: 0.2,
    margin: "-8% 0px",
  });

  return (
    <section
      className="border-t border-black/10 px-6 py-16 md:px-12 md:py-24 lg:px-20"
      style={{ backgroundColor: MINT }}
    >
      <div className="mx-auto max-w-6xl">
        {/* Title & context */}
        <header className="mb-12 md:mb-16">
          <h2 className="mb-3 flex flex-col gap-1 text-2xl font-semibold tracking-tight text-black sm:flex-row sm:items-baseline sm:gap-3 md:text-3xl [font-family:var(--font-cormorant),serif]">
            <span>Market Analysis</span>
            <span className="text-lg font-normal text-black/45 md:text-xl">
              市场分析
            </span>
          </h2>
          <p className="mb-6 flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-xs font-semibold tracking-tight text-black md:mb-7 md:text-[13px] [font-family:var(--font-cormorant),serif]">
            <span>Chinese Market Analysis</span>
            <span className="font-semibold text-black/45">/</span>
            <span
              className="font-semibold text-black/80"
              style={{
                fontFamily:
                  "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
              }}
            >
              中国市场分析
            </span>
          </p>
          <div className="max-w-4xl space-y-4 text-left">
            <p
              lang="en"
              className="text-[15px] font-normal leading-relaxed text-black md:text-[16px]"
              style={{ fontFamily: "var(--font-cormorant), serif" }}
            >
              Currently, the online fragrance market has low concentration.
              Unlike the perfume market dominated by international brands, the
              top 20 fragrance brands in terms of sales are predominantly
              domestic. In terms of pricing, as of April, products priced below
              221 RMB accounted for 71.4% of transaction volume on Tmall.
              Premium fragrances (221 RMB and above) occupy only 1/5 of the
              market share, indicating that most consumers still prefer mid-to-low
              price segments.
            </p>
            <p
              lang="zh-Hans"
              className="text-[15px] leading-relaxed text-black/88 md:text-[16px]"
              style={{
                fontFamily: "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
              }}
            >
              当下线上香氛市场集中度低，不同于国际品牌主导的香水市场，销售排名前20的香氛品牌仍以国货为主。从香薰的价格来看，截至4月份，在天猫平台上价格在221元以下这一区间的产品交易额主要占比71.4%；而高端价位香薰即221及以上仅占市场份额的1/5，多数消费者仍倾向购买中低价位香薰。
            </p>
          </div>
        </header>

        {/* Three columns */}
        <div
          ref={chartRowRef}
          className="grid grid-cols-1 gap-14 lg:grid-cols-3 lg:gap-10 xl:gap-12"
        >
          {/* Left: bars — inView scoped so growth + counters run when this region is visible */}
          <div ref={barRegionRef} className="flex min-w-0 flex-col">
            <h3 className="mb-8 text-center text-sm font-semibold leading-snug text-black md:text-base">
              <span className="block [font-family:var(--font-cormorant),serif]">
                MAT2022 Tmall Fragrance TOP 20 Brands - Int&apos;l vs. Domestic
                Share{" "}
                <span className="font-normal text-black/35">/</span>{" "}
                <span
                  className="font-normal text-black/80"
                  style={{
                    fontFamily:
                      "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
                  }}
                >
                  MAT2022 天猫香薰品类TOP20品牌-国际&amp;国货品牌销售额占比
                </span>
              </span>
            </h3>
            <IntlDomesticBars active={barsInView} />
          </div>

          {/* Middle: brand list */}
          <div className="flex min-w-0 flex-col border-y border-black/10 py-10 lg:border-y-0 lg:border-x lg:px-6 lg:py-0 xl:px-8">
            <h3 className="mb-8 text-center text-sm font-semibold text-black md:text-base [font-family:var(--font-cormorant),serif]">
              Sales Ranking
              <span
                className="mt-2 block text-xs font-normal text-black/55 md:text-sm"
                style={{
                  fontFamily:
                    "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
                }}
              >
                销售额排名
              </span>
            </h3>
            <ul className="mx-auto flex w-full max-w-sm flex-col gap-2 text-center">
              {BRANDS.map((b, i) => {
                const maxPx = 22;
                const minPx = 13;
                const step = (maxPx - minPx) / (BRANDS.length - 1 || 1);
                const size = maxPx - step * i;
                return (
                  <motion.li
                    key={b.en}
                    initial={{ opacity: 0, y: -10 }}
                    animate={
                      rowInView
                        ? { opacity: 1, y: 0 }
                        : { opacity: 0, y: -10 }
                    }
                    transition={{
                      delay: i * 0.1,
                      duration: 0.55,
                      ease: "easeOut",
                    }}
                    className="leading-tight"
                    style={{
                      fontSize: `${size}px`,
                      fontFamily: "var(--font-cormorant), serif",
                      color: TITLE_GREEN,
                    }}
                  >
                    <span className="font-semibold tracking-tight">{b.en}</span>
                    <span
                      className="mt-0.5 block text-[0.85em] font-normal text-black/55"
                      style={{
                        fontFamily:
                          "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
                      }}
                    >
                      {b.zh}
                    </span>
                  </motion.li>
                );
              })}
            </ul>
          </div>

          {/* Right: pie */}
          <div className="flex min-w-0 flex-col items-center">
            <h3 className="mb-8 text-center text-sm font-semibold leading-snug text-black md:text-base [font-family:var(--font-cormorant),serif]">
              <span className="block">Market Share by Price Segment</span>
              <span
                className="mt-2 block text-xs font-normal text-black/55 md:text-sm"
                style={{
                  fontFamily:
                    "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
                }}
              >
                香薰价格段市场销售占比
              </span>
            </h3>
            <PricePie active={rowInView} />
            <ul className="mt-6 w-full max-w-xs space-y-2 text-left text-xs sm:text-sm">
              <li className="flex items-center gap-2 [font-family:var(--font-cormorant),serif]">
                <span
                  className="inline-block size-2.5 shrink-0 rounded-sm"
                  style={{ backgroundColor: FOREST }}
                />
                <span>
                  Below 221 RMB / <span className="text-black/60">221以下</span>{" "}
                  <span className="font-semibold text-black">71.4%</span>
                </span>
              </li>
              <li className="flex items-center gap-2 [font-family:var(--font-cormorant),serif]">
                <span
                  className="inline-block size-2.5 shrink-0 rounded-sm"
                  style={{ backgroundColor: SKY }}
                />
                <span>
                  Above 221 RMB /{" "}
                  <span className="text-black/60">221及以上</span>{" "}
                  <span className="font-semibold text-black">28.6%</span>
                </span>
              </li>
            </ul>
            <p
              className="mt-8 text-center text-[11px] text-black/50 md:text-xs [font-family:var(--font-cormorant),serif]"
            >
              Data Source: Whale Intelligence
              <span
                className="mt-1 block text-black/45"
                style={{
                  fontFamily:
                    "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
                }}
              >
                数据源于鲸参谋
              </span>
            </p>
          </div>
        </div>

        <div
          ref={cagrRegionRef}
          className="mt-16 border-t border-black/10 pt-16 md:mt-20 md:pt-20"
        >
          <GlobalSummary active={cagrInView} />
          <GlobalCagrChart active={cagrInView} />
        </div>

        <div className="mt-16 border-t border-black/10 pt-16 md:mt-20 md:pt-20">
          <LoeweGlobalCandleLineChart />
        </div>
      </div>
    </section>
  );
}
