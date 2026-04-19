"use client";

import { motion, useInView } from "framer-motion";
import { useMemo, useRef, useState } from "react";

const FOREST = "#5A946E";
const MINT = "#B2C2A2";

const RAW: { year: number; value: number }[] = [
  { year: 2000, value: 4.56 },
  { year: 2001, value: 4.7 },
  { year: 2002, value: 4.84 },
  { year: 2003, value: 4.98 },
  { year: 2004, value: 5.13 },
  { year: 2005, value: 5.8 },
  { year: 2006, value: 5.97 },
  { year: 2007, value: 6.51 },
  { year: 2008, value: 6.32 },
  { year: 2009, value: 6.51 },
  { year: 2010, value: 6.71 },
  { year: 2011, value: 6.91 },
  { year: 2012, value: 7.12 },
  { year: 2013, value: 7.33 },
  { year: 2014, value: 7.55 },
  { year: 2015, value: 8.59 },
  { year: 2016, value: 8.85 },
  { year: 2017, value: 9.11 },
  { year: 2018, value: 9.09 },
  { year: 2019, value: 9.35 },
  { year: 2020, value: 9.2 },
  { year: 2021, value: 10.75 },
  { year: 2022, value: 10.6 },
  { year: 2023, value: 11.02 },
  { year: 2024, value: 11.35 },
  { year: 2025, value: 11.75 },
  { year: 2026, value: 12.15 },
  { year: 2027, value: 12.45 },
  { year: 2028, value: 12.71 },
  { year: 2029, value: 13.59 },
  { year: 2030, value: 14.01 },
];

const VB = { w: 920, h: 340 };
const PAD = { l: 58, r: 28, t: 36, b: 56 };

type Pt = { year: number; value: number; x: number; y: number; forecast: boolean };

function buildLayout(): {
  pts: Pt[];
  histPts: Pt[];
  fcPts: Pt[];
  yMin: number;
  yMax: number;
  baselineY: number;
} {
  const vals = RAW.map((d) => d.value);
  const yMin = Math.floor(Math.min(...vals) * 10) / 10 - 0.3;
  const yMax = Math.ceil(Math.max(...vals) * 10) / 10 + 0.2;
  const iw = VB.w - PAD.l - PAD.r;
  const ih = VB.h - PAD.t - PAD.b;
  const baselineY = PAD.t + ih;

  const pts: Pt[] = RAW.map((d) => {
    const x = PAD.l + ((d.year - 2000) / 30) * iw;
    const y = PAD.t + ih - ((d.value - yMin) / (yMax - yMin)) * ih;
    return {
      year: d.year,
      value: d.value,
      x,
      y,
      forecast: d.year >= 2026,
    };
  });

  const histPts = pts.filter((p) => p.year <= 2025);
  const i2025 = pts.findIndex((p) => p.year === 2025);
  const fcPts = i2025 >= 0 ? pts.slice(i2025) : pts.filter((p) => p.year >= 2025);

  return { pts, histPts, fcPts, yMin, yMax, baselineY };
}

function linePath(points: Pt[]): string {
  if (points.length === 0) return "";
  return points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(" ");
}

function areaPath(points: Pt[], baselineY: number): string {
  if (points.length === 0) return "";
  const line = linePath(points);
  const first = points[0];
  const last = points[points.length - 1];
  return `${line} L ${last.x.toFixed(2)} ${baselineY.toFixed(2)} L ${first.x.toFixed(2)} ${baselineY.toFixed(2)} Z`;
}

const PATH_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function LoeweGlobalCandleLineChart() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const active = useInView(wrapRef, { once: true, amount: 0.22, margin: "-6% 0px" });
  const [hovered, setHovered] = useState<number | null>(null);

  const { pts, histPts, fcPts, yMin, yMax, baselineY } = useMemo(
    () => buildLayout(),
    [],
  );

  const histLine = linePath(histPts);
  const fcLine = linePath(fcPts);
  const histArea = areaPath(histPts, baselineY);
  const fcArea = areaPath(fcPts, baselineY);

  const xTicks = [2000, 2005, 2010, 2015, 2020, 2025, 2030];
  const yTicks = useMemo(() => {
    const step = 2;
    const out: number[] = [];
    for (let v = Math.ceil(yMin); v <= yMax; v += step) out.push(v);
    return out;
  }, [yMin, yMax]);

  const iw = VB.w - PAD.l - PAD.r;
  const ih = VB.h - PAD.t - PAD.b;

  return (
    <div ref={wrapRef} className="w-full">
      <header className="mb-8 max-w-4xl space-y-4 text-left md:mb-10">
        <p
          lang="en"
          className="text-sm font-normal leading-relaxed text-black md:text-[15px]"
          style={{ fontFamily: "var(--font-cormorant), serif" }}
        >
          From 2000 to 2030, the global candle market demonstrates a resilient
          upward trajectory. After surpassing the $10 billion milestone in 2021,
          the market is poised to reach $14 billion by the end of the decade.
          This consistent expansion underscores the steady growth and enduring
          stability of the global candle consumption market.
        </p>
        <p
          lang="zh-Hans"
          className="text-sm leading-relaxed text-black md:text-[15px]"
          style={{
            fontFamily: "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
          }}
        >
          从 2000 年到 2030 年，全球蜡烛市场展示了极具韧性的上升轨迹。在 2021
          年突破 100 亿美元大关后，市场有望在 2030 年底达到 140
          亿美元。这持续的扩张充分说明了全球蜡烛消费市场的稳定增长与持久韧性。
        </p>
      </header>

      <div className="relative mx-auto max-w-5xl overflow-visible">
        <svg
          viewBox={`0 0 ${VB.w} ${VB.h}`}
          className="h-auto w-full touch-none"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Global candle market size line chart 2000 to 2030"
        >
          <defs>
            <linearGradient id="gc-area-hist" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={FOREST} stopOpacity="0.2" />
              <stop offset="100%" stopColor={FOREST} stopOpacity="0" />
            </linearGradient>
            <linearGradient id="gc-area-fc" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
            <filter id="gc-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Y-axis label */}
          <text
            x={PAD.l - 6}
            y={PAD.t - 8}
            className="fill-black/70 text-[11px] [font-family:var(--font-cormorant),serif]"
            textAnchor="start"
          >
            Billion USD
          </text>
          <text
            x={PAD.l - 6}
            y={PAD.t + 6}
            className="fill-black/55 text-[10px]"
            style={{
              fontFamily:
                "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
            }}
            textAnchor="start"
          >
            十亿美元
          </text>

          {yTicks.map((v) => {
            const y = PAD.t + ih - ((v - yMin) / (yMax - yMin)) * ih;
            return (
              <g key={v}>
                <line
                  x1={PAD.l}
                  y1={y}
                  x2={VB.w - PAD.r}
                  y2={y}
                  stroke="rgba(0,51,46,0.08)"
                  strokeWidth={1}
                  strokeDasharray="4 4"
                />
                <text
                  x={PAD.l - 10}
                  y={y + 4}
                  className="fill-black/75 text-[10px] font-semibold [font-family:var(--font-cormorant),serif]"
                  textAnchor="end"
                >
                  {v}
                </text>
              </g>
            );
          })}

          {/* X-axis ticks every 5 years */}
          {xTicks.map((yr) => {
            const x = PAD.l + ((yr - 2000) / 30) * iw;
            return (
              <g key={yr}>
                <text
                  x={x}
                  y={VB.h - 18}
                  className="fill-black/80 text-[10px] font-semibold [font-family:var(--font-cormorant),serif]"
                  textAnchor="middle"
                >
                  {yr}
                </text>
              </g>
            );
          })}

          {/* Forecast band divider (2025 | 2026) */}
          <line
            x1={PAD.l + ((2025.5 - 2000) / 30) * iw}
            y1={PAD.t}
            x2={PAD.l + ((2025.5 - 2000) / 30) * iw}
            y2={baselineY}
            stroke="rgba(0,51,46,0.12)"
            strokeWidth={1}
            strokeDasharray="3 6"
          />

          {/* Areas */}
          <motion.path
            d={histArea}
            fill="url(#gc-area-hist)"
            initial={{ opacity: 0 }}
            animate={{ opacity: active ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          />
          <motion.path
            d={fcArea}
            fill="url(#gc-area-fc)"
            initial={{ opacity: 0 }}
            animate={{ opacity: active ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          />

          {/* Historical line */}
          <motion.path
            d={histLine}
            fill="none"
            stroke={FOREST}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={
              active
                ? { pathLength: 1, opacity: 1 }
                : { pathLength: 0, opacity: 0 }
            }
            transition={{ duration: 1.35, ease: PATH_EASE }}
          />

          {/* Forecast line (white, dashed) */}
          <motion.path
            d={fcLine}
            fill="none"
            stroke="rgba(255,255,255,0.95)"
            strokeWidth={2.25}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="6 5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={
              active
                ? { pathLength: 1, opacity: 1 }
                : { pathLength: 0, opacity: 0 }
            }
            transition={{ duration: 0.85, delay: 0.95, ease: PATH_EASE }}
          />

          {/* Crosshair */}
          {hovered !== null &&
            (() => {
              const p = pts[hovered];
              if (!p) return null;
              return (
                <line
                  x1={p.x}
                  y1={PAD.t}
                  x2={p.x}
                  y2={baselineY}
                  stroke="rgba(0,51,46,0.25)"
                  strokeWidth={1}
                  strokeDasharray="4 4"
                  pointerEvents="none"
                />
              );
            })()}

          {/* Hit targets + dots */}
          {pts.map((p, i) => {
            const isHover = hovered === i;
            const r = isHover ? 6.5 : 3;
            const isFc = p.forecast;
            return (
              <g key={p.year}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={14}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                />
                {isHover ? (
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={r + 3}
                    fill="none"
                    stroke={isFc ? "rgba(255,255,255,0.85)" : FOREST}
                    strokeWidth={2}
                    filter="url(#gc-glow)"
                    pointerEvents="none"
                  />
                ) : null}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={r}
                  fill={isHover ? (isFc ? "#B2C2A2" : MINT) : isFc ? "#ffffff" : FOREST}
                  stroke={isFc ? "rgba(255,255,255,0.95)" : FOREST}
                  strokeWidth={isHover ? 2.5 : 1}
                  className="pointer-events-none transition-[r] duration-200"
                  style={{
                    filter: isHover ? "drop-shadow(0 0 6px rgba(90,148,110,0.55))" : undefined,
                  }}
                />
              </g>
            );
          })}
        </svg>

        {/* HTML tooltip (bilingual) */}
        {hovered !== null && pts[hovered] && (
          <div
            className="pointer-events-none absolute z-20 min-w-[10rem] rounded-md border border-black/10 bg-[rgba(255,255,255,0.96)] px-3 py-2 text-left shadow-lg"
            style={{
              left: `${(pts[hovered].x / VB.w) * 100}%`,
              top: `${(pts[hovered].y / VB.h) * 100}%`,
              transform: "translate(-50%, calc(-100% - 14px))",
            }}
          >
            <p className="text-[11px] font-semibold text-black [font-family:var(--font-cormorant),serif]">
              Year: {pts[hovered].year}
            </p>
            <p
              className="text-[10px] text-black/65"
              style={{
                fontFamily:
                  "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
              }}
            >
              年份：{pts[hovered].year}
            </p>
            <p className="mt-1.5 text-[11px] font-semibold tabular-nums text-black [font-family:var(--font-cormorant),serif]">
              Value: ${pts[hovered].value.toFixed(2)} B
            </p>
            <p
              className="text-[10px] text-black/65"
              style={{
                fontFamily:
                  "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
              }}
            >
              数值：{pts[hovered].value.toFixed(2)} 十亿美元
            </p>
          </div>
        )}
      </div>

      <div
        className="mx-auto mt-6 flex w-full max-w-5xl flex-nowrap items-center justify-center gap-x-4 overflow-x-auto px-2 pb-0.5 text-[10px] text-black/50 [-webkit-overflow-scrolling:touch] md:gap-x-6 md:text-[11px]"
        role="note"
      >
        <span className="inline-flex shrink-0 items-baseline gap-1.5 whitespace-nowrap">
          <span className="[font-family:var(--font-cormorant),serif]">
            Size of the candle market worldwide from 2000 to 2030 (in billion
            U.S. dollars)
          </span>
          <span className="text-black/35">/</span>
          <span
            className="text-black/55"
            style={{
              fontFamily:
                "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
            }}
          >
            2000–2030 年全球蜡烛市场规模
          </span>
        </span>
        <span className="inline-flex shrink-0 items-center gap-1.5 [font-family:var(--font-cormorant),serif]">
          <span
            className="inline-block h-0.5 w-6 rounded-full"
            style={{ backgroundColor: FOREST }}
          />
          Historical / 历史
        </span>
        <span className="inline-flex shrink-0 items-center gap-1.5 [font-family:var(--font-cormorant),serif]">
          <span className="inline-block h-0.5 w-6 rounded-full border border-dashed border-white bg-transparent" />
          Forecast / 预测
        </span>
      </div>
    </div>
  );
}
