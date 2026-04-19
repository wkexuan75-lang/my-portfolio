"use client";

import {
  motion,
  useAnimationControls,
  useMotionValueEvent,
  useScroll,
  useMotionValue,
} from "framer-motion";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { ProjectCard, type ProjectCardData } from "./ProjectCard";

const VIEW_W = 100;
const VIEW_H = 5000;
const NOSE_ROTATE_OFFSET_DEG = 90;

type VbPt = { x: number; y: number };

/** Fallback before DOM-measured anchors exist */
const FALLBACK_PATH_D = `M 50 500 C 35 1350, 65 2150, 50 2500 C 35 3350, 65 4150, 50 5000`;

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

function measurePathFromCardAnchors(
  container: HTMLElement,
  svg: SVGSVGElement,
): { pathD: string; nodePts: VbPt[] } | null {
  const els = Array.from(
    container.querySelectorAll<HTMLElement>("[data-shuttle-path-anchor]"),
  );
  if (els.length === 0) return null;

  const sorted = els
    .map((el) => ({
      el,
      depth: Number(el.dataset.depth),
    }))
    .filter((x) => Number.isFinite(x.depth))
    .sort((a, b) => a.depth - b.depth);

  const svgRect = svg.getBoundingClientRect();
  if (svgRect.width < 8 || svgRect.height < 8) return null;

  const toVB = (cx: number, cy: number): VbPt => ({
    x: ((cx - svgRect.left) / svgRect.width) * VIEW_W,
    y: ((cy - svgRect.top) / svgRect.height) * VIEW_H,
  });

  const anchorPts: VbPt[] = sorted.map(({ el }) => {
    const r = el.getBoundingClientRect();
    return toVB(r.left + r.width / 2, r.top + r.height / 2);
  });

  anchorPts.sort((a, b) => a.y - b.y);

  const points: VbPt[] = [
    { x: 50, y: 500 },
    ...anchorPts,
    { x: 50, y: VIEW_H },
  ];

  return {
    pathD: catmullRomToSvgPath(points),
    nodePts: anchorPts,
  };
}

const PROJECTS: ProjectCardData[] = [
  {
    id: "yue-sport",
    index: "01",
    title: "Yue Sport",
    category: "Interactive Program",
    depth: 0.15,
    description:
      "UW Husky Edition — verified NetID community, low-friction matching, and live IMA energy for campus sports.",
    side: "left",
    href: "/yuesport",
  },
  {
    id: "day-night",
    index: "02",
    title: "Day & Night",
    category: "Website Dev",
    depth: 0.3,
    description:
      "A crafted web experience balancing clarity and atmosphere—structured storytelling with responsive, refined UI.",
    side: "right",
    href: "/daynight",
  },
  {
    id: "heritage",
    index: "03",
    title: "Heritage",
    category: "Song Dynasty Ceramics",
    depth: 0.45,
    description:
      "Echoes of Song — digital heritage of the Five Great Wares (Ru, Guan, Ding, Ge, Jun) for a global audience.",
    side: "left",
    href: "/ceramics",
  },
  {
    id: "medicinal-journey",
    index: "04",
    title: "Medicinal Journey",
    category: "Game Dev",
    depth: 0.6,
    description:
      "A TCM educational puzzle game with interactive diagnostics—learn patterns through play.",
    side: "right",
    href: "/game",
  },
  {
    id: "paw-go",
    index: "05",
    title: "Paw&GO",
    category: "Graphic / Brand Design",
    depth: 0.75,
    description:
      "Pet-friendly food truck identity—health, freedom, and bold visual language for the street.",
    side: "left",
    href: "/brand",
  },
  {
    id: "aigc-video",
    index: "06",
    title: "Mythos AI",
    category: "AIGC Video Production",
    depth: 0.9,
    description:
      "Generative video workflows exploring Chinese mythology and ritual through cinematic AIGC.",
    side: "right",
    href: "/aigc",
  },
  {
    id: "loewe-marketing",
    index: "07",
    title: "Marketing Strategy – LOEWE",
    category: "Brand Strategy",
    depth: 0.96,
    description:
      "LOEWE home fragrance — SWOT, bilingual narrative, and art-direction for The Scented Realm.",
    side: "left",
    href: "/marketing/loewe",
  },
];

const CARD_DEPTHS = PROJECTS.map((p) => p.depth);

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
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const traceSvgRef = useRef<SVGSVGElement>(null);
  const [pathLen, setPathLen] = useState<number | null>(null);
  const shuttleX = useMotionValue(0);
  const shuttleY = useMotionValue(0);
  const prevProgress = useRef(0);
  const bounceControls = useAnimationControls();
  const [hideIntro, setHideIntro] = useState(false);
  const introDismissedRef = useRef(false);
  const [hasClicked, setHasClicked] = useState(false);
  const [angle, setAngle] = useState(0);
  const [measuredNodePoints, setMeasuredNodePoints] = useState<VbPt[]>([]);
  const [pathD, setPathD] = useState(FALLBACK_PATH_D);
  const [nodeVisible, setNodeVisible] = useState<boolean[]>(
    PROJECTS.map(() => false),
  );

  const [heroFullyPast, setHeroFullyPast] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

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
      shuttleX.set(rect.left + (pt.x / VIEW_W) * rect.width);
      shuttleY.set(rect.top + (pt.y / VIEW_H) * rect.height);
    },
    [pathLen],
  );

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    updatePoint(v);

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
    updatePoint(scrollYProgress.get());
  }, [scrollYProgress, updatePoint, pathD]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const svg = traceSvgRef.current;
    if (!container || !svg) return;

    let raf = 0;
    const runMeasure = () => {
      const result = measurePathFromCardAnchors(container, svg);
      if (result) {
        setPathD(result.pathD);
        setMeasuredNodePoints(result.nodePts);
        setPathLen(null);
      } else {
        setPathD(FALLBACK_PATH_D);
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
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          preserveAspectRatio="xMidYMin meet"
          aria-hidden
        >
          <path
            ref={pathRef}
            d={pathD}
            fill="none"
            stroke="none"
            strokeWidth={0}
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
              <circle cx={p.x} cy={p.y} r={0.6} fill="#000000" />
            </motion.g>
          ))}
        </svg>

        {PROJECTS.map((item) => (
          <ProjectCard key={item.id} item={item} scrollYProgress={scrollYProgress} />
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
