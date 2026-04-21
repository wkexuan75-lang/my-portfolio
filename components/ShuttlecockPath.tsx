"use client";

import {
  motion,
  useAnimationControls,
  useMotionValueEvent,
  useScroll,
  useMotionValue,
  useTransform,
} from "framer-motion";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { ProjectCard, type ProjectCardData } from "./ProjectCard";

const NOSE_ROTATE_OFFSET_DEG = 90;

/** Initial SVG user space until first layout measure. */
const INITIAL_VB: { w: number; h: number } = { w: 100, h: 4000 };

/**
 * Dashed trail: pure black, thick stroke. `pathLength` on the same element overrides
 * `strokeDasharray` in Framer Motion — reveal uses a mask path with `pathLength` instead.
 */
const SHUTTLE_TRAIL_STROKE = "#000000";
const SHUTTLE_TRAIL_STROKE_WIDTH_PX = 5;
const SHUTTLE_TRAIL_DASH = "15 10";
/** Mask stroke must cover the dashed line width along curves (screen px). */
const SHUTTLE_TRAIL_MASK_STROKE_PX = 14;

type VbPt = { x: number; y: number };

function fallbackPathD(vbW: number, vbH: number): string {
  const mx = vbW * 0.5;
  const y0 = Math.min(120, vbH * 0.04);
  const y1 = vbH * 0.97;
  return `M ${mx} ${y0} L ${mx} ${y1}`;
}

/** Smooth curve through knots (Catmull–Rom → cubic Bézier), passes through all points */
function catmullRomToSvgPath(points: VbPt[]): string {
  if (points.length < 2) return "";
  const pStart = points[0]!;
  let d = `M ${pStart.x} ${pStart.y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = i === 0 ? points[0]! : points[i - 1]!;
    const p1 = points[i]!;
    const p2 = points[i + 1]!;
    const p3 = i + 2 < points.length ? points[i + 2]! : points[i + 1]!;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

/** Scroll position (0–1) for each card center; linear spacing so vertical gaps match. */
const CARD_DEPTH_TOP = 0.11;
const CARD_DEPTH_BOTTOM = 0.92;

function cardDepthAtIndex(index: number, total: number): number {
  if (total <= 1) return CARD_DEPTH_TOP;
  return (
    CARD_DEPTH_TOP +
    (index / (total - 1)) * (CARD_DEPTH_BOTTOM - CARD_DEPTH_TOP)
  );
}

const PROJECTS_BASE: Omit<ProjectCardData, "depth">[] = [
  {
    id: "yue-sport",
    index: "01",
    title: "Yue Sports",
    category: "PRODUCT / UX",
    description: `Mission: Campus sports connectivity through algorithmic matching
Content: Verified NetID community & low-friction matching for campus sports
Skills: Product Management / UX Design
Tools: Figma / Cursor`,
    side: "left",
    href: "/yuesport",
  },
  {
    id: "loewe-marketing",
    index: "02",
    title: "The Scented Realm",
    category: "BRAND / MARKETING",
    description: `Mission: Strategic art-direction and bilingual narrative for luxury home fragrance
Content: LOEWE Home Fragrance — SWOT & market analysis
Skills: Brand Strategy / Digital Marketing / Data Analysis
Tools: Adobe Creative Suite / Canva`,
    side: "right",
    href: "/marketing/loewe",
  },
  {
    id: "day-night",
    index: "03",
    title: "Day & Night",
    category: "ART / PHOTOGRAPHY",
    description: `Mission: Capturing the fragments of life and the rhythm of Seattle
Content: A visual journal of light, shadow, and urban moments
Skills: Art Direction / Photography
Tools: Lightroom / Canon System`,
    side: "left",
    href: "/daynight",
  },
  {
    id: "heritage",
    index: "04",
    title: "Echoes of Song",
    category: "WEB SITE DESIGN",
    description: `Mission: Global promotion of Intangible Cultural Heritage
Content: Digital heritage of the Five Great Wares (Ru, Guan, Ding, Ge, Jun)
Skills: Web Design / Interactive Storytelling
Tools: Figma / Axure RP / Dreamweaver`,
    side: "right",
    href: "/ceramics",
  },
  {
    id: "medicinal-journey",
    index: "05",
    title: "Healing Odyssey",
    category: "GAME DESIGN",
    description: `Mission: De-mystifying Traditional Chinese Medicine through gamified interaction
Content: An interactive TCM knowledge puzzle game for cultural education
Skills: Game Design / Interactive Storytelling
Tools: Animate / After Effects`,
    side: "left",
    href: "/game",
  },
  {
    id: "paw-go",
    index: "06",
    title: "PAW&GO",
    category: "VISUAL / BRANDING",
    description: `Mission: Innovative visual identity for a pet-friendly lifestyle brand
Content: Sustainable packaging & social-first branding for modern pet owners
Skills: Visual Design / Branding Design
Tools: Illustrator / Midjourney`,
    side: "right",
    href: "/brand",
  },
  {
    id: "aigc-video",
    index: "07",
    title: "AIGC Video Production",
    category: "GENERATIVE VIDEO",
    description: `Mission: Exploring the frontiers of AI-driven cinematic storytelling
Content: Generative video experiments and AI-assisted post-production workflows
Skills: Video Production / Prompt Engineering
Tools: Runway / Pika / Luma / Premiere Pro / Midjourney / Pixverse`,
    side: "left",
    href: "/aigc",
  },
];

const PROJECTS: ProjectCardData[] = PROJECTS_BASE.map((row, i) => ({
  ...row,
  depth: cardDepthAtIndex(i, PROJECTS_BASE.length),
}));

const CARD_DEPTHS = PROJECTS.map((p) => p.depth);

/** Scroll fraction where shuttle + dashed trail reach 100% (card 07 / last dot). */
const SHUTTLE_SCROLL_END = PROJECTS[PROJECTS.length - 1]!.depth;

/**
 * Build path in SVG **pixel user space** (viewBox matches svg.getBoundingClientRect size,
 * preserveAspectRatio="none") so resize keeps the stroke aligned with each card dot ref.
 * Path ends at the last project dot (card 07); no tail past it.
 */
function computePathFromDotRefs(
  svg: SVGSVGElement,
  dotElements: (HTMLSpanElement | null)[],
): { pathD: string; nodePts: VbPt[]; vbW: number; vbH: number } | null {
  const svgRect = svg.getBoundingClientRect();
  const vbW = svgRect.width;
  const vbH = svgRect.height;
  if (vbW < 8 || vbH < 8) return null;

  const toLocal = (el: HTMLElement): VbPt => {
    const r = el.getBoundingClientRect();
    return {
      x: r.left + r.width / 2 - svgRect.left,
      y: r.top + r.height / 2 - svgRect.top,
    };
  };

  const pairs: { depth: number; pt: VbPt }[] = [];
  for (let i = 0; i < dotElements.length; i++) {
    const el = dotElements[i];
    if (!el) continue;
    pairs.push({ depth: PROJECTS[i]!.depth, pt: toLocal(el) });
  }
  if (pairs.length === 0) return null;

  pairs.sort((a, b) => a.depth - b.depth);
  const anchorPts = pairs.map((p) => p.pt);

  const first = anchorPts[0]!;
  const start: VbPt = {
    x: vbW * 0.5,
    y: Math.max(4, first.y - Math.min(200, vbH * 0.06)),
  };

  const points: VbPt[] = [start, ...anchorPts];

  return {
    pathD: catmullRomToSvgPath(points),
    nodePts: anchorPts,
    vbW,
    vbH,
  };
}

function ShuttlecockSvg() {
  return (
    <svg
      width="140"
      height="140"
      viewBox="0 0 1024 1024"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M149.90336 585.58464L439.53152 875.2128l-15.0016 14.9504C343.04 970.6496 213.6064 1083.7504 77.49632 947.6096-55.9104 814.22336 50.04288 687.23712 130.08896 605.53216l4.87424-4.94592 14.94016-15.0016zM366.71488 874.8032l-216.3712-216.36096-7.94624 8.66304C52.10112 766.7712 37.09952 834.82624 113.69472 911.42144c76.04224 76.04224 146.04288 60.3648 242.87232-27.25888l6.10304-5.59104 4.0448-3.76832z"
        fill="#333333"
      />
      <path
        d="M439.53152 6.32832C726.8352 98.304 918.96832 288.48128 1015.87968 576.8192l2.90816 8.76544L439.53152 875.2128 149.90336 585.58464l281.6-563.57888 4.9152-9.69728 3.11296-5.98016z m32.78848 65.5872l-7.26016-2.70336L212.1728 575.4368l237.4656 237.4656 505.9584-252.96896-2.78528-7.3728C863.3344 318.42304 704.01024 159.08864 472.32 71.92576z"
        fill="#333333"
      />
      <path
        d="M755.48672 233.43104l36.1984 36.1984L312.832 748.50304l-36.20864-36.20864zM903.20896 375.73632l30.38208 41.216-551.28064 406.46656-30.38208-41.216zM608.16384 91.52512l41.216 30.38208-406.46656 551.28064-41.20576-30.38208z"
        fill="#333333"
      />
    </svg>
  );
}

export default function ShuttlecockPath() {
  const trailMaskDomId = `shuttle-trail-mask-${useId().replace(/:/g, "")}`;
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const traceSvgRef = useRef<SVGSVGElement>(null);
  /** One ref per project card dot (index matches PROJECTS order). */
  const dotRefs = useRef<(HTMLSpanElement | null)[]>(
    Array.from({ length: PROJECTS.length }, () => null),
  );
  const dotRefCallbacks = useMemo(
    () =>
      PROJECTS.map(
        (_, i) => (el: HTMLSpanElement | null) => {
          dotRefs.current[i] = el;
        },
      ),
    [],
  );
  /** Latest path user-space size (sync with viewBox) for shuttle screen projection. */
  const pathSpaceRef = useRef({ w: INITIAL_VB.w, h: INITIAL_VB.h });
  const [pathLen, setPathLen] = useState<number | null>(null);
  const shuttleX = useMotionValue(0);
  const shuttleY = useMotionValue(0);
  const prevProgress = useRef(0);
  const bounceControls = useAnimationControls();
  const [hideIntro, setHideIntro] = useState(false);
  const introDismissedRef = useRef(false);
  const [hasClicked, setHasClicked] = useState(false);
  const [angle, setAngle] = useState(0);
  const [svgVb, setSvgVb] = useState({ w: INITIAL_VB.w, h: INITIAL_VB.h });
  const [measuredNodePoints, setMeasuredNodePoints] = useState<VbPt[]>([]);
  const [pathD, setPathD] = useState(() =>
    fallbackPathD(INITIAL_VB.w, INITIAL_VB.h),
  );
  const [nodeVisible, setNodeVisible] = useState<boolean[]>(
    PROJECTS.map(() => false),
  );

  const [heroFullyPast, setHeroFullyPast] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  /** Map page scroll 0…SHUTTLE_SCROLL_END → path 0…1; hold at 1 past last card (per brief). */
  const clampedShuttleProgress = useTransform(
    scrollYProgress,
    [0, SHUTTLE_SCROLL_END],
    [0, 1],
    { clamp: true },
  );

  const updatePoint = useCallback(
    (t: number) => {
      const path = pathRef.current;
      if (!path) return;
      const len = path.getTotalLength();
      if (pathLen == null) setPathLen(len);
      const clamped = Math.min(1, Math.max(0, t));
      const l = clamped * len;
      const pt = path.getPointAtLength(l);

      const eps = Math.max(1, len * 0.002);
      const pt2 = path.getPointAtLength(Math.min(len, l + eps));
      const dx = pt2.x - pt.x;
      const dy = pt2.y - pt.y;
      setAngle((Math.atan2(dy, dx) * 180) / Math.PI);

      const svg = traceSvgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const { w: vbW, h: vbH } = pathSpaceRef.current;
      if (vbW < 1 || vbH < 1) return;
      shuttleX.set(rect.left + (pt.x / vbW) * rect.width);
      shuttleY.set(rect.top + (pt.y / vbH) * rect.height);
    },
    [pathLen],
  );

  useMotionValueEvent(clampedShuttleProgress, "change", (v) => {
    updatePoint(v);
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const prev = prevProgress.current;
    for (let i = 0; i < CARD_DEPTHS.length; i++) {
      const depth = CARD_DEPTHS[i];
      if (prev < depth && v >= depth) {
        setNodeVisible((cur) => {
          if (cur[i]) return cur;
          const next = [...cur];
          next[i] = true;
          return next;
        });

        void bounceControls.start({
          scale: [1, 0.9, 1.18, 1],
          rotate: [0, -6, 4, 0],
          transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
        });
        break;
      }
    }
    prevProgress.current = v;

    if (v > 0.02 && !introDismissedRef.current) {
      introDismissedRef.current = true;
      setHideIntro(true);
    }
  });

  useEffect(() => {
    updatePoint(clampedShuttleProgress.get());
  }, [clampedShuttleProgress, updatePoint, pathD]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const svg = traceSvgRef.current;
    if (!container || !svg) return;

    let raf = 0;
    const runMeasure = () => {
      const result = computePathFromDotRefs(svg, dotRefs.current);
      if (result) {
        pathSpaceRef.current = { w: result.vbW, h: result.vbH };
        setSvgVb({ w: result.vbW, h: result.vbH });
        setPathD(result.pathD);
        setMeasuredNodePoints(result.nodePts);
        setPathLen(null);
      } else {
        const r = svg.getBoundingClientRect();
        const w = Math.max(INITIAL_VB.w, r.width);
        const h = Math.max(INITIAL_VB.h, r.height);
        pathSpaceRef.current = { w, h };
        setSvgVb({ w, h });
        setPathD(fallbackPathD(w, h));
        setMeasuredNodePoints([]);
        setPathLen(null);
      }
    };

    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        requestAnimationFrame(runMeasure);
      });
    };

    schedule();

    const ro = new ResizeObserver(schedule);
    ro.observe(container);
    ro.observe(svg);

    const onWin = () => schedule();
    window.addEventListener("scroll", onWin, { passive: true });
    window.addEventListener("resize", onWin);
    window.addEventListener("shuttle-path-remeasure", onWin);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("scroll", onWin);
      window.removeEventListener("resize", onWin);
      window.removeEventListener("shuttle-path-remeasure", onWin);
    };
  }, [heroFullyPast]);

  useEffect(() => {
    const hero = document.getElementById("home-hero");
    if (!hero) return;

    const syncHeroPast = () => {
      const rect = hero.getBoundingClientRect();
      setHeroFullyPast(rect.bottom <= 1);
    };

    syncHeroPast();
    window.addEventListener("scroll", syncHeroPast, { passive: true });
    window.addEventListener("resize", syncHeroPast);
    return () => {
      window.removeEventListener("scroll", syncHeroPast);
      window.removeEventListener("resize", syncHeroPast);
    };
  }, []);

  const beginDescent = useCallback(() => {
    introDismissedRef.current = true;
    setHasClicked(true);
    setHideIntro(true);
    if (typeof window === "undefined") return;
    const y = window.scrollY + window.innerHeight * 1.15;
    window.scrollTo({ top: y, behavior: "smooth" });
  }, []);

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-x-hidden">
      <motion.div
        className="absolute inset-0 z-[2]"
        initial={false}
        animate={{ opacity: heroFullyPast ? 1 : 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ pointerEvents: heroFullyPast ? "auto" : "none" }}
        aria-hidden={!heroFullyPast}
      >
        <motion.div
          className="pointer-events-none absolute left-1/2 top-[50vh] z-[60] w-[min(92vw,26rem)] -translate-x-1/2"
          initial={false}
          animate={{
            opacity: hideIntro ? 0 : 1,
            y: hideIntro ? -10 : [0, -4, 0],
          }}
          transition={{
            opacity: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
            y: hideIntro
              ? { duration: 0.55 }
              : { duration: 1.15, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <p className="text-center text-sm font-medium tracking-tight text-black">
            Click to know more about me
          </p>
        </motion.div>

        <svg
          ref={traceSvgRef}
          className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
          viewBox={`0 0 ${svgVb.w} ${svgVb.h}`}
          preserveAspectRatio="none"
          aria-hidden
        >
          <defs>
            <mask
              id={trailMaskDomId}
              maskUnits="userSpaceOnUse"
              maskContentUnits="userSpaceOnUse"
            >
              <rect
                x={0}
                y={0}
                width={svgVb.w}
                height={svgVb.h}
                fill="black"
              />
              {/* Solid white stroke + pathLength = reveal along curve without touching dash pattern */}
              <motion.path
                d={pathD}
                fill="none"
                stroke="white"
                strokeWidth={SHUTTLE_TRAIL_MASK_STROKE_PX}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="nonScalingStroke"
                style={{ pathLength: clampedShuttleProgress }}
                aria-hidden
              />
            </mask>
          </defs>

          {/* Geometry for shuttle position sampling (invisible) */}
          <path
            ref={pathRef}
            d={pathD}
            fill="none"
            stroke="none"
            strokeWidth={0}
            aria-hidden
          />

          {/* Dashed trail: dash pattern here only; scroll trim via mask above */}
          <path
            d={pathD}
            fill="none"
            stroke={SHUTTLE_TRAIL_STROKE}
            strokeWidth={SHUTTLE_TRAIL_STROKE_WIDTH_PX}
            strokeDasharray={SHUTTLE_TRAIL_DASH}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="nonScalingStroke"
            mask={`url(#${trailMaskDomId})`}
            aria-hidden
          />

          {measuredNodePoints.map((p, i) => (
            <motion.g
              key={`${i}-${p.x.toFixed(3)}-${p.y.toFixed(3)}`}
              initial={false}
              animate={
                nodeVisible[i]
                  ? { opacity: 1, scale: [0.6, 1.35, 1] }
                  : { opacity: 0, scale: 0 }
              }
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              style={{
                transformOrigin: `${p.x}px ${p.y}px`,
              }}
            >
              <circle cx={p.x} cy={p.y} r={4} fill="#000000" />
            </motion.g>
          ))}
        </svg>

        {PROJECTS.map((item, i) => (
          <ProjectCard
            key={item.id}
            item={item}
            scrollYProgress={scrollYProgress}
            dotRef={dotRefCallbacks[i]}
          />
        ))}

        <motion.div
          className="fixed z-[50]"
          style={{
            left: shuttleX,
            top: shuttleY,
            x: "-50%",
            y: "-50%",
            opacity: 1,
            pointerEvents: "auto",
          }}
        >
          <button
            type="button"
            onClick={beginDescent}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                beginDescent();
              }
            }}
            className="cursor-pointer bg-transparent p-0 outline-none"
            aria-label="Scroll to explore"
          >
            <motion.div
              animate={bounceControls}
              style={{
                rotate: angle + NOSE_ROTATE_OFFSET_DEG,
                transformOrigin: "50% 50%",
              }}
            >
              <motion.div
                animate={hasClicked ? { y: 0 } : { y: [0, -6, 0] }}
                transition={
                  hasClicked
                    ? { duration: 0.2 }
                    : { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
                }
              >
                <ShuttlecockSvg />
              </motion.div>
            </motion.div>
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
