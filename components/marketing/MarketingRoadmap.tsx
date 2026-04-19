"use client";

import { motion, useInView } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

const MINT = "#B2C2A2";
const FOREST = "#5A946E";
const ACTIVE = "#FFFFFF";
const INACTIVE_TEXT = "#888888";
const INACTIVE_NODE = "rgba(90, 148, 110, 0.5)";
const LINE = "rgba(255, 255, 255, 0.3)";

const EASE_IN_OUT: [number, number, number, number] = [0.42, 0, 0.58, 1];
const FOCUS_DURATION = 0.8;

/** Slower than native `behavior: "smooth"` — tuned for luxury-page pacing */
const ROADMAP_SCROLL_MS = 1100;

function easeOutCubic(t: number) {
  const x = Math.min(1, Math.max(0, t));
  return 1 - (1 - x) ** 3;
}

type Stage = {
  titleEn: string;
  titleZh: string;
};

const STAGES: Stage[] = [
  { titleZh: "阶段一：花窗", titleEn: "THE GOSSAMER GRILLE" },
  { titleZh: "阶段二：晓径", titleEn: "THE DAWNLIT PATH" },
  { titleZh: "阶段三：赏景", titleEn: "THE VISTA UNVEILED" },
];

function NoiseOverlay() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.11]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundAttachment: "fixed",
        backgroundSize: "256px 256px",
      }}
      aria-hidden
    />
  );
}

/** Large lattice / 花窗 motif — right-side watermark */
function LatticeBackdrop() {
  return (
    <div
      className="pointer-events-none absolute bottom-0 right-0 top-0 w-[min(52%,420px)] opacity-[0.14]"
      aria-hidden
    >
      <svg
        viewBox="0 0 400 520"
        className="h-full w-full text-[#5A946E]"
        preserveAspectRatio="xMaxYMid meet"
      >
        <g fill="none" stroke="currentColor" strokeWidth="1.15" opacity="0.85">
          <rect x="48" y="40" width="304" height="304" rx="10" />
          <circle cx="200" cy="192" r="56" />
          <path d="M200 136v112M144 192h112" />
          <path d="M168 168c24-24 40-24 64 0s40 24 64 0M168 216c24 24 40 24 64 0s40-24 64 0" />
          <circle cx="200" cy="192" r="8" fill="currentColor" stroke="none" />
          <path
            d="M80 96c32-8 56-8 88 0M232 96c32-8 56-8 88 0M80 288c32 8 56 8 88 0M232 288c32 8 56 8 88 0"
            opacity="0.6"
          />
          <path
            d="M96 80c-8 32-8 56 0 88M304 80c8 32 8 56 0 88M96 304c-8-32-8-56 0-88M304 304c8-32 8-56 0-88"
            opacity="0.5"
          />
        </g>
        <g fill="currentColor" opacity="0.12">
          <circle cx="200" cy="420" r="72" />
          <circle cx="120" cy="460" r="28" />
          <circle cx="280" cy="460" r="28" />
        </g>
      </svg>
    </div>
  );
}

function RoadNode({
  active,
  index,
  onSelect,
}: {
  active: boolean;
  index: number;
  onSelect: () => void;
}) {
  return (
    <motion.button
      type="button"
      aria-label={`Stage ${index + 1}`}
      aria-pressed={active}
      onClick={onSelect}
      className="relative z-[2] flex h-11 w-11 shrink-0 items-center justify-center rounded-full outline-none ring-offset-2 ring-offset-[#B2C2A2] focus-visible:ring-2 focus-visible:ring-white/60 md:h-12 md:w-12"
      initial={false}
      animate={{
        scale: active ? 1.08 : 1,
        backgroundColor: active ? ACTIVE : INACTIVE_NODE,
        boxShadow: active
          ? "0 0 0 1px rgba(255,255,255,0.5), 0 8px 24px rgba(0,0,0,0.12)"
          : "0 0 0 1px rgba(136,136,136,0.35)",
      }}
      transition={{ duration: FOCUS_DURATION, ease: EASE_IN_OUT }}
    >
      <span
        className="font-[family-name:var(--font-cormorant),serif] text-sm font-semibold md:text-base"
        style={{ color: active ? FOREST : INACTIVE_TEXT }}
      >
        {index + 1}
      </span>
    </motion.button>
  );
}

function StageCopy({
  stage,
  active,
}: {
  stage: Stage;
  active: boolean;
}) {
  return (
    <motion.div
      className="mx-auto w-full max-w-md text-center lg:max-w-none"
      animate={{ opacity: active ? 1 : 0.5 }}
      transition={{ duration: FOCUS_DURATION, ease: EASE_IN_OUT }}
    >
      <motion.h3
        className="text-[15px] font-medium leading-snug tracking-wide md:text-base"
        style={{
          color: active ? ACTIVE : INACTIVE_TEXT,
          fontFamily: "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
        }}
        transition={{ duration: FOCUS_DURATION, ease: EASE_IN_OUT }}
      >
        <span className="block">{stage.titleZh}</span>
        <span
          className="mt-1 block text-[11px] uppercase tracking-[0.14em] md:text-xs"
          style={{ fontFamily: "var(--font-cormorant), serif" }}
        >
          {stage.titleEn}
        </span>
      </motion.h3>
    </motion.div>
  );
}

export type MarketingRoadmapProps = {
  /** 0 = 阶段一，1 = 阶段二，2 = 阶段三 */
  defaultFocusIndex?: number;
  /** 设为 false 时只渲染进度条区域（用于页面下方重复展示） */
  showHeading?: boolean;
  /** 当前流程图 section id，用于跨流程图跳转 */
  roadmapId?: string;
  /** 三个流程图目标锚点（索引 0/1/2 对应阶段 1/2/3） */
  roadmapAnchorIds?: [string, string, string];
};

const DEFAULT_ROADMAP_ANCHORS: [string, string, string] = [
  "marketing-roadmap-1",
  "marketing-roadmap-2",
  "marketing-roadmap-3",
];

export function MarketingRoadmap({
  defaultFocusIndex = 0,
  showHeading = true,
  roadmapId,
  roadmapAnchorIds = DEFAULT_ROADMAP_ANCHORS,
}: MarketingRoadmapProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.35, margin: "-8% 0px" });
  const defaultFocus = Math.min(2, Math.max(0, defaultFocusIndex));
  const [focus, setFocus] = useState(defaultFocus);
  const [armed, setArmed] = useState(false);
  const scrollRafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!inView) {
      setArmed(false);
      setFocus(defaultFocus);
      return;
    }
    const t = window.setTimeout(() => setArmed(true), 80);
    return () => clearTimeout(t);
  }, [inView, defaultFocus]);

  useEffect(() => {
    return () => {
      if (scrollRafRef.current != null) {
        window.cancelAnimationFrame(scrollRafRef.current);
      }
    };
  }, []);

  const effectiveFocus = inView && armed ? focus : -1;

  const select = useCallback((i: number) => {
    setFocus(i);
    setArmed(true);

    const targetId = roadmapAnchorIds[i];
    if (!targetId || typeof window === "undefined") return;
    const target = document.getElementById(targetId);
    if (!target) return;

    const top = target.getBoundingClientRect().top + window.scrollY - 24;
    const startY = window.scrollY;
    const delta = top - startY;
    if (Math.abs(delta) < 2) return;

    if (scrollRafRef.current != null) {
      window.cancelAnimationFrame(scrollRafRef.current);
    }

    const t0 = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / ROADMAP_SCROLL_MS);
      const eased = easeOutCubic(t);
      window.scrollTo(0, startY + delta * eased);
      if (t < 1) {
        scrollRafRef.current = window.requestAnimationFrame(step);
      } else {
        scrollRafRef.current = null;
      }
    };
    scrollRafRef.current = window.requestAnimationFrame(step);
  }, [roadmapAnchorIds]);

  return (
    <section
      ref={ref}
      id={roadmapId}
      className="relative overflow-hidden border-t border-black/10 py-16 md:py-24"
      style={{ backgroundColor: MINT }}
      aria-label={showHeading ? undefined : "营销阶段进度：当前高亮阶段二"}
    >
      <NoiseOverlay />
      <LatticeBackdrop />

      <div className="relative z-[1] mx-auto max-w-7xl px-6 md:px-12 lg:px-20">
        {showHeading ? (
          <header className="mb-12 md:mb-16">
            <h2 className="mb-3 flex flex-col gap-1 text-2xl font-semibold tracking-tight text-black sm:flex-row sm:items-baseline sm:gap-3 md:text-3xl [font-family:var(--font-cormorant),serif]">
              <span>Marketing Stages</span>
              <span className="text-lg font-normal text-black/45 md:text-xl">
                营销阶段
              </span>
            </h2>
          </header>
        ) : null}

        {/* Desktop / tablet: horizontal track */}
        <div className="hidden md:block">
          <div className="mb-10 flex w-full items-center px-2 lg:px-4">
            <div
              className="h-px flex-1"
              style={{ backgroundColor: LINE }}
            />
            {STAGES.map((_, i) => (
              <div key={i} className="contents">
                <RoadNode
                  active={effectiveFocus === i}
                  index={i}
                  onSelect={() => select(i)}
                />
                <div
                  className="h-px flex-1"
                  style={{ backgroundColor: LINE }}
                />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-6 px-2 lg:gap-8 lg:px-4">
            {STAGES.map((stage, i) => (
              <StageCopy
                key={stage.titleZh}
                stage={stage}
                active={effectiveFocus === i}
              />
            ))}
          </div>
        </div>

        {/* Mobile: vertical */}
        <div className="flex flex-col gap-8 md:hidden">
          {STAGES.map((stage, i) => (
            <div key={stage.titleZh} className="flex gap-4">
              <div className="flex w-11 shrink-0 flex-col items-center">
                {i > 0 ? (
                  <div
                    className="min-h-6 w-px flex-1"
                    style={{ backgroundColor: LINE }}
                  />
                ) : (
                  <div className="min-h-2" />
                )}
                <RoadNode
                  active={effectiveFocus === i}
                  index={i}
                  onSelect={() => select(i)}
                />
                {i < STAGES.length - 1 ? (
                  <div
                    className="min-h-6 w-px flex-1"
                    style={{ backgroundColor: LINE }}
                  />
                ) : (
                  <div className="min-h-2" />
                )}
              </div>
              <div className="min-w-0 flex-1 pt-1">
                <StageCopy stage={stage} active={effectiveFocus === i} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
