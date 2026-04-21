"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * Layout ratios vs. stage side length (baseline 720px design).
 * Stage width in CSS: `min(stageViewportFraction * 100vw, maxStagePx)` — share of the viewport before the pixel cap.
 */
const STAGE_REF = 720;
const ORBIT_R_RATIO = 272 / STAGE_REF;
const BUBBLE_SIZE_RATIO = 118 / STAGE_REF;
const BUBBLE_RING_RATIO = 6 / STAGE_REF;
const CENTER_SIZE_RATIO = 248 / STAGE_REF;
/** Center quote block, as fractions of stage (≈ 6.5rem / 14.5rem at 720) */
const CENTER_QUOTE_MIN_H_RATIO = 104 / STAGE_REF;
const CENTER_QUOTE_MAX_W_RATIO = 232 / STAGE_REF;

type BubbleLayout = {
  stage: number;
  cx: number;
  cy: number;
  orbitR: number;
  bubbleSize: number;
  ringPx: number;
  inner: number;
  centerSize: number;
  centerQuoteMinH: number;
  centerQuoteMaxW: number;
};

function getBubbleLayout(stagePx: number): BubbleLayout {
  const s = Math.max(1, stagePx);
  const orbitR = Math.round(ORBIT_R_RATIO * s);
  const bubbleSize = Math.round(BUBBLE_SIZE_RATIO * s);
  const ringPx = Math.max(3, Math.round(BUBBLE_RING_RATIO * s));
  const inner = Math.max(1, bubbleSize - 2 * ringPx);
  const centerSize = Math.round(CENTER_SIZE_RATIO * s);
  return {
    stage: s,
    cx: s / 2,
    cy: s / 2,
    orbitR,
    bubbleSize,
    ringPx,
    inner,
    centerSize,
    centerQuoteMinH: Math.round(CENTER_QUOTE_MIN_H_RATIO * s),
    centerQuoteMaxW: Math.round(CENTER_QUOTE_MAX_W_RATIO * s),
  };
}

function bubblePosition(angleDeg: number, L: BubbleLayout) {
  const rad = (angleDeg * Math.PI) / 180;
  const x = Math.round(L.cx + L.orbitR * Math.cos(rad) - L.bubbleSize / 2);
  const y = Math.round(L.cy + L.orbitR * Math.sin(rad) - L.bubbleSize / 2);
  return { x, y };
}

const BUBBLE_EASE = [0.34, 1.56, 0.64, 1] as const;
const STAGGER_MS = 250;
const CYCLE_MS = 2400;

const BUBBLE_COLORS = [
  "#e8ede9",
  "#f0ebe3",
  "#e8edf5",
  "#e9e7e4",
  "#ede8f0",
  "#ebe6ee",
] as const;

type BubbleDef = {
  id: string;
  angleDeg: number;
  imageSrc: string;
  labelEn: string;
  labelZh: string;
  quoteEn: string;
  quoteZh: string;
};

/** Six themes, even 60° steps from top (270°). */
const BUBBLES: BubbleDef[] = [
  {
    id: "badminton",
    angleDeg: 270,
    imageSrc: "/images/self/badminton.png",
    labelEn: "Badminton",
    labelZh: "羽毛球",
    quoteZh: "羽毛球是我成长中非常重要的一部分，它让我懂得坚持的意义和动力。",
    quoteEn:
      "Badminton has been a vital part of my growth—it taught me what persistence means and where drive comes from.",
  },
  {
    id: "cat",
    angleDeg: 330,
    imageSrc: "/images/self/cat.png",
    labelEn: "Cats",
    labelZh: "撸猫",
    quoteZh: "偶尔还喜欢去朋友家撸猫——虽然这只明显是生气了。",
    quoteEn:
      "I still love dropping by friends’ places to pet their cats—even when this one’s clearly not having it.",
  },
  {
    id: "travel",
    angleDeg: 30,
    imageSrc: "/images/self/traveling.png",
    labelEn: "Travel",
    labelZh: "旅行",
    quoteZh: "旅行让我感受不一样的文化。",
    quoteEn: "Travel lets me feel cultures that are unlike my own.",
  },
  {
    id: "museum",
    angleDeg: 90,
    imageSrc: "/images/self/museum.png",
    labelEn: "Museum",
    labelZh: "博物馆",
    quoteZh: "很喜欢博物馆里那些奇奇怪怪的文物。",
    quoteEn: "I love the wonderfully odd artifacts tucked inside museums.",
  },
  {
    id: "basketball",
    angleDeg: 150,
    imageSrc: "/images/self/basketball.png",
    labelEn: "Basketball",
    labelZh: "篮球",
    quoteZh: "篮球队的大家庭让我感受团队的凝聚力。",
    quoteEn:
      "The basketball team’s big family showed me what real teamwork feels like.",
  },
  {
    id: "cooking",
    angleDeg: 210,
    imageSrc: "/images/self/cooking.png",
    labelEn: "Cooking",
    labelZh: "烹饪",
    quoteZh: "下厨让人很放松，也很有成就感。",
    quoteEn:
      "Cooking slows me down in the best way—and finishing a dish feels earned.",
  },
];

const DEFAULT_QUOTE_ZH = "Creative Maker · 让有趣传递下去";
const DEFAULT_QUOTE_EN =
  "Creative Maker — passing the spark of fun forward.";

const INTRO_DEFAULT_MS = 1800;

export type BubbleCircleProps = {
  /** Max stage edge in px after viewport scaling (default 720). */
  maxStagePx?: number;
  /** Stage uses `min(this * 100vw, maxStagePx)` for width (default 0.92 → 92% of viewport). */
  stageViewportFraction?: number;
};

export function BubbleCircle({
  maxStagePx = 720,
  stageViewportFraction = 0.92,
}: BubbleCircleProps) {
  const [orbitVisible, setOrbitVisible] = useState(false);
  const [bubblesReady, setBubblesReady] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [cycleIndex, setCycleIndex] = useState(0);
  const [cyclingStarted, setCyclingStarted] = useState(false);
  const [bubblePopDone, setBubblePopDone] = useState(false);
  const cycleRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [stagePx, setStagePx] = useState(STAGE_REF);

  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const measure = () => {
      const w = el.getBoundingClientRect().width;
      setStagePx(w > 0 ? w : STAGE_REF);
    };
    measure();
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 0;
      setStagePx(w > 0 ? w : STAGE_REF);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const t = requestAnimationFrame(() => setOrbitVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  useEffect(() => {
    if (!orbitVisible) return;
    const t = window.setTimeout(() => setBubblesReady(true), 420);
    return () => clearTimeout(t);
  }, [orbitVisible]);

  useEffect(() => {
    if (!bubblesReady) return;
    const t = window.setTimeout(() => setCyclingStarted(true), INTRO_DEFAULT_MS);
    return () => clearTimeout(t);
  }, [bubblesReady]);

  useEffect(() => {
    if (!bubblesReady) return;
    const n = BUBBLES.length;
    const t = window.setTimeout(
      () => setBubblePopDone(true),
      (n - 1) * STAGGER_MS + 520,
    );
    return () => clearTimeout(t);
  }, [bubblesReady]);

  const tickCycle = useCallback(() => {
    setCycleIndex((i) => (i + 1) % BUBBLES.length);
  }, []);

  useEffect(() => {
    if (hoverIndex !== null || !cyclingStarted) {
      if (cycleRef.current) {
        clearInterval(cycleRef.current);
        cycleRef.current = null;
      }
      return;
    }
    cycleRef.current = window.setInterval(tickCycle, CYCLE_MS);
    return () => {
      if (cycleRef.current) clearInterval(cycleRef.current);
    };
  }, [hoverIndex, cyclingStarted, tickCycle]);

  const showDefaultCenter =
    !bubblesReady || (hoverIndex === null && !cyclingStarted);

  const activeBubble =
    hoverIndex !== null
      ? BUBBLES[hoverIndex]!
      : !showDefaultCenter
        ? BUBBLES[cycleIndex]!
        : null;

  const L = getBubbleLayout(stagePx);
  const activeGlowPx = Math.max(5, Math.round(7 * (L.stage / STAGE_REF)));

  return (
    <div
      className="mx-auto flex w-full justify-center px-3 py-2 [font-family:var(--font-geist-sans),system-ui,sans-serif]"
      style={{
        maxWidth: `min(${stageViewportFraction * 100}vw, ${maxStagePx}px)`,
      }}
      aria-label="Interests orbit"
    >
      <div
        ref={stageRef}
        className="relative aspect-square w-full shrink-0"
      >
        {/* Orbit ring */}
        <motion.div
          className="pointer-events-none absolute rounded-full border border-dashed border-[#eee]"
          style={{
            width: L.orbitR * 2,
            height: L.orbitR * 2,
            left: L.cx - L.orbitR,
            top: L.cy - L.orbitR,
            borderWidth: 0.5,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: orbitVisible ? 0.85 : 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Center circle — quotes only, no name label */}
        <div
          className="absolute flex flex-col items-center justify-center rounded-full bg-white px-[min(6.5%,1.5rem)] text-center"
          style={{
            width: L.centerSize,
            height: L.centerSize,
            left: L.cx - L.centerSize / 2,
            top: L.cy - L.centerSize / 2,
            border: "0.5px solid #e0ddd9",
          }}
        >
          <div
            className="relative w-full px-0.5"
            style={{
              minHeight: L.centerQuoteMinH,
              maxWidth: L.centerQuoteMaxW,
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={showDefaultCenter ? "default" : activeBubble!.id}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 flex flex-col justify-center gap-2"
              >
                {!showDefaultCenter && activeBubble ? (
                  <>
                    <p
                      lang="zh-Hans"
                      className="text-[13px] leading-relaxed text-neutral-700 [font-family:var(--font-cormorant),serif] italic sm:text-[15px]"
                    >
                      {activeBubble.quoteZh}
                    </p>
                    <p
                      lang="en"
                      className="text-[12px] leading-relaxed text-neutral-500 [font-family:var(--font-cormorant),serif] italic sm:text-[14px]"
                    >
                      {activeBubble.quoteEn}
                    </p>
                  </>
                ) : (
                  <>
                    <p
                      className="text-[13px] leading-relaxed text-neutral-700 [font-family:var(--font-cormorant),serif] italic sm:text-[15px]"
                    >
                      {DEFAULT_QUOTE_ZH}
                    </p>
                    <p
                      lang="en"
                      className="text-[12px] leading-relaxed text-neutral-500 [font-family:var(--font-cormorant),serif] italic sm:text-[14px]"
                    >
                      {DEFAULT_QUOTE_EN}
                    </p>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bubbles — same inner photo diameter for every theme */}
        {BUBBLES.map((b, i) => {
          const { x, y } = bubblePosition(b.angleDeg, L);
          const isActive =
            bubblesReady &&
            (hoverIndex !== null ? hoverIndex === i : cyclingStarted && cycleIndex === i);
          return (
            <motion.button
              key={b.id}
              type="button"
              title={`${b.labelEn} / ${b.labelZh}`}
              className="absolute flex origin-center cursor-pointer flex-col items-center justify-center overflow-hidden rounded-full border border-black/[0.06] text-center outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2"
              style={{
                width: L.bubbleSize,
                height: L.bubbleSize,
                left: x,
                top: y,
                backgroundColor: BUBBLE_COLORS[i % BUBBLE_COLORS.length],
                padding: L.ringPx,
                boxShadow: isActive
                  ? `0 0 0 1px rgba(0,0,0,0.06), 0 0 0 ${activeGlowPx}px rgba(0,0,0,0.03)`
                  : "none",
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={
                bubblesReady
                  ? {
                      scale: isActive ? 1.06 : 1,
                      opacity: 1,
                    }
                  : { scale: 0, opacity: 0 }
              }
              whileHover={{
                scale: 1.5,
                zIndex: 40,
                transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
              }}
              transition={{
                scale: {
                  delay: bubblePopDone ? 0 : i * (STAGGER_MS / 1000),
                  duration: bubblePopDone ? 0.22 : 0.48,
                  ease: bubblePopDone ? [0.22, 1, 0.36, 1] : BUBBLE_EASE,
                },
                opacity: {
                  delay: bubblePopDone ? 0 : i * (STAGGER_MS / 1000),
                  duration: 0.35,
                  ease: [0.22, 1, 0.36, 1],
                },
              }}
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(null)}
              aria-label={`${b.labelEn} / ${b.labelZh}`}
            >
              <div
                className="relative shrink-0 overflow-hidden rounded-full bg-neutral-100"
                style={{ width: L.inner, height: L.inner }}
              >
                <Image
                  src={b.imageSrc}
                  alt={`${b.labelEn} — ${b.labelZh}`}
                  fill
                  sizes={`${Math.max(64, Math.round(L.inner))}px`}
                  className="object-cover object-center"
                  priority={false}
                />
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
