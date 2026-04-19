"use client";

import * as React from "react";
import { motion } from "framer-motion";

type CrackPath = {
  d: string;
  transform?: string;
};

type PathMeta = {
  delay: number;
  duration: number;
  strokeWidth: number;
};

function mulberry32(seed: number) {
  return function random() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function polylinePointsToPath(points: string) {
  const nums = points
    .trim()
    .split(/[\s,]+/)
    .map((v) => Number(v))
    .filter((n) => Number.isFinite(n));

  if (nums.length < 4) return "";

  let d = `M ${nums[0]} ${nums[1]}`;
  for (let i = 2; i + 1 < nums.length; i += 2) {
    d += ` L ${nums[i]} ${nums[i + 1]}`;
  }
  return d;
}

const VIEWBOX = {
  x: 0,
  y: 0,
  w: 1925.19,
  h: 770.84,
};

const SVG_CENTER = {
  x: VIEWBOX.w / 2,
  y: VIEWBOX.h / 2,
};

const CRACK_PATHS: CrackPath[] = [
  {
    d: "M0,540l63.26-96.77,43.42-98.41S121.15,284,124,304.29s95.52,31.84,95.52,31.84l43.42-110s23.16-40.53,23.16-28.95,66.57,2.9,66.57,2.9V249.3l52.11,19.61s40.52-65.93,46.31-60.14S572.7,237.72,572.7,237.72l66.58,8.68s31.84-8.68,46.31-17.37,69.47,37.63,66.58,39.88,40.52-126.71,49.2-129.61,86.84,0,86.84,0V269.56L960,284V431.65l52.68,57.89s66.57-52.1,81-46.31,66.58-17.37,66.58-17.37v-55s49.21-144.73,63.68-136S1316.61,339,1316.61,339l72.36,11.6,46.31-150.52L1470,46.68,1397.65,0l-60.78,110.36-78.16-43.42,5.79-43.42L1209.51,0",
    transform: "translate(2.69 3.89)",
  },
  {
    d: "M1920,368l-39-78.15s-37.63,60.79-57.89,72.36-86.84,28.95-101.31,37.63-52.11,17.37-52.11,17.37l-26,63.68s5.79,162.1,0,136S1554,596.64,1554,596.64V449l-46.31-8.68L1470,420.08l-23.16,34.73-28.94,107.1L1319.5,540l-92.63-44.67L1160.3,616.91l-60.79-43.42L1085,616.91,989.52,588,960,540l-73.24,48-33.28-48,66.57-140.19,6.91-20",
    transform: "translate(2.69 3.89)",
  },
  {
    d: "M0,579.28l25.63,23.15v92.63l83.94,23.16L144.31,643l66.57,28.94,17.37-52.16,17.37-127.3,110,47.56,46.31,19,20.26-34.73,57.9-104.2L532.18,540l37.63-18.62L642.17,559l55-141.72,72.36,37.49s31.84-92.6,31.84-72,97.12,62.43,97.12,62.43L813.08,653.66l85.41,51.08,40.16-42.57,31.92,42.57L1028,718.22l38.44-32.64,74.35,48.95,59.6-51.07L1224,704.74l42.42,29.79,19.16-19.15V672.81s25.54-19.15,46.82-8.51S1386.74,692,1386.74,692l20.13,10.64V619.74c66,12.64,38.31,14.77,66,12.64S1558,619.74,1558,619.74s-10.65,57.33,0,65.84,78.74,21.29,78.74,21.29l61.72-6.39,51.08-80.74s-2.13-70.37,0-89.52,51.08,6.38,78.75,0,76.61-42.57,76.61-42.57l-81.72-125.47L1785.72,377l-38.33-107s105.14-50.41,104.71-72.81,52.78,37.63,52.78,37.63",
    transform: "translate(2.69 3.89)",
  },
  {
    d: "M978.41,250.56,960,284l70-127.36h49.21l66.58,52.1L1219,116.88l39.74-49.94,78.16,43.42,98.41,89.73,66.58,23.15L1580,252.19s11.58-107.1,37.63-110,89.73,11.57,89.73,11.57L1690,284S1829,252.19,1852.1,197.19l-110-95.52L1802.89,0l89.82,78L1920,101.67V58.25",
    transform: "translate(2.69 3.89)",
  },
  {
    d: "M464,765.57s-35-52.7-14.73-47.35S548,649.86,548,649.86l-25.67-63L532.18,540l37.63-18.62L590,477.17l49-81.68-39.67-32.67,42-73,79.35,28.66,98,32.67L927,379.8,960,284l45.9-83.46,24.14-43.9,36.44-102.22h-23.85L898.49,94.19,853.48,0",
    transform: "translate(2.69 3.89)",
  },
  {
    d: "M927,379.8,818.69,351.15l17-81.15-83.49-1.09,49.2-129.61s-62.49-1.62-84.18-13.3-76.76-38.38-76.76-38.38L535.31,70.93,527,86H465.22s-116.8,11.68-128.48,5-28.37,3.34-28.37,3.34L246.63,70.93,204.92,142,143.18,50.91H111.47S93.12,151,86.44,152.7s-30,11.68-30,11.68l-13.35,20S7,231.12,0,231.12",
    transform: "translate(2.69 3.89)",
  },
  {
    d: "M1802.89,0l-60.78,101.67-33-14.13-48.95-36.63-53.2-37.86-61.72,102.16-43.35,108-14.5,66.58L1470,369.42l-23.16,85.39-78.3-26.75L1389,350.61,1316.61,339l-87,115.77-69.33-28.92-66.58,17.37s-4.78-81.54-13.36-102.12S960,284,960,284",
    transform: "translate(2.69 3.89)",
  },
  {
    d: "M825.14,619.74l-59.82-55L707.91,540l-53-13.89L623,604.68l-20,67.39L548,649.86,442.92,654.6H373.43L401.92,559l-46.31-19s47.77-145.45,42.78-160.2,84.87,3,84.87,3L572.7,237.72s17.45-59.89,17.67-69.87,50.06-80.23,50.06-80.23L668,0",
    transform: "translate(2.69 3.89)",
  },
  {
    d: "M404.82,268.91S293.55,457.21,261.1,454.81s-69.9-28.95-69.9-28.95-15,106.88-29.95,114.14-25,37.22-25,37.22L0,619.74",
    transform: "translate(2.69 3.89)",
  },
  {
    d: "M451.13,208.77l-46.31-49V91L286.14,197.19l-86.95-14.95L176,192.19,88.42,177.75l-32-13.37L0,112.65,18.84,0l92.63,50.91h31.71L189.43,0,250,27.36l-3.41,43.57L308.37,94.3,336.74,91S373.5,0,364.52,0",
    transform: "translate(2.69 3.89)",
  },
  {
    d: "M1234,112.72l-7.1-5.86Z",
    transform: "translate(2.69 3.89)",
  },
  {
    d: "M1234,112.72,1224,234.82s202-56.63,211.3-34.73",
    transform: "translate(2.69 3.89)",
  },
  {
    d: "M1095.71,169.55l41.84-39.6,20.9-9.15S1165,62,1150.61,50.91s-84.13,3.54-84.13,3.54V4.58",
    transform: "translate(2.69 3.89)",
  },
  {
    d: "M449.24,718.22s-87.7,25.26-93.63,16.31,17.82-79.93,17.82-79.93-31.63-.31-64.82-2.54c-35.33-2.38-72.44-6.92-75.13-15.56-3.44-11-7.37,40.38-13,79.49-2.92,20.43-6.29,37.51-10.27,40.59",
    transform: "translate(2.69 3.89)",
  },
  {
    d: "M451.13,203s18.66-38.32,41.07-42.66,70.86-9.4,94.72,0",
    transform: "translate(2.69 3.89)",
  },
  {
    d: "M1042.63,54.45S1026.53.32,1012.27,4.58C977.85,14.85,866.73,27.74,866.73,27.74L853.48,15.53C837.91,31.06,801.37,139.3,801.37,139.3",
    transform: "translate(2.69 3.89)",
  },
  {
    d: "M782.22,756.58s41.75-98.9,30.86-102.92",
    transform: "translate(2.69 3.89)",
  },
  {
    d: "M805.53,695.78S763.37,655.59,752.19,635s-73.72-102.71-73.72-102.71",
    transform: "translate(2.69 3.89)",
  },
  {
    d: "M1645.78,554.66s82.93,76.91,103.74,65.08l53.37,42.41S1783,747.59,1783,756.58s-84.54-56.1-84.54-56.1",
    transform: "translate(2.69 3.89)",
  },
  // Converted from <polyline> / <line> to keep everything as <motion.path>
  { d: polylinePointsToPath("1347.13 498.73 1371.25 431.95 1322.19 543.89 1311.91 665.98 1203.12 687.34 1162.99 620.79 1102.2 577.38 1162.99 429.75") },
  { d: polylinePointsToPath("401.08 383.68 308.85 320.8 240.53 293.71 193.89 429.75 163.94 543.89 144.99 543.89 65.95 447.12 23.77 386.67 68.67 339.93 61.93 293.71 2.69 273.89") },
  { d: polylinePointsToPath("1479.98 339.93 1562.45 363.04 1582.7 256.08 1692.69 287.92 1692.69 383.68 1752.21 534.11 1752.21 623.63 1805.58 666.04 1865.45 623.63 1922.69 591.85") },
  { d: polylinePointsToPath("710.6 543.89 768.56 478.16 772.22 458.67 699.86 421.18 723.37 322.36 754.86 272.8") },
  { d: polylinePointsToPath("453.82 3.89 493.24 39.49 473.53 82.32 467.91 89.84") },
  { d: polylinePointsToPath("1556.65 467.25 1562.45 363.04 1692.69 383.68 1562.45 363.04 1556.65 452.91") },
  { d: polylinePointsToPath("889.45 591.85 941.34 666.06 973.26 708.63 931.36 760.47") },
  { d: polylinePointsToPath("1069.17 689.47 1069.17 709.01 1045.32 760.47") },
  { d: polylinePointsToPath("1389.43 695.86 1409.56 706.5 1399.49 760.47") },
  { d: polylinePointsToPath("605.76 675.96 613.79 699.67 562.96 760.47") },
  { d: "M 1189.87 8.47 L 1153.3 54.8" },
  { d: "M 523.91 325.11 L 602.01 366.7" },
  { d: "M 1710.06 157.66 L 1744.8 105.56" },
  { d: "M 1467.01 75.71 L 1547.9 119.1" },
  { d: "M 1269.09 738.42 L 1269.09 769.46" },
];

export function CeramicsCracks({
  className,
  onTimelineComputed,
}: {
  className?: string;
  /** Fires once after path delays are computed; use to sequence hero image/text. */
  onTimelineComputed?: (info: { totalSeconds: number }) => void;
}) {
  const pathRefs = React.useRef<(SVGPathElement | null)[]>([]);
  const [ready, setReady] = React.useState(false);
  const [meta, setMeta] = React.useState<PathMeta[]>(() =>
    CRACK_PATHS.map(() => ({ delay: 0, duration: 1.8, strokeWidth: 0.8 })),
  );

  React.useLayoutEffect(() => {
    setReady(false);
    const distances = pathRefs.current.map((el) => {
      if (!el) return 0;
      const bbox = el.getBBox();
      const cx = bbox.x + bbox.width / 2;
      const cy = bbox.y + bbox.height / 2;
      return Math.hypot(cx - SVG_CENTER.x, cy - SVG_CENTER.y);
    });

    const maxDist = Math.max(1, ...distances);

    const nextMeta = distances.map((dist, i) => {
      const randDelay = mulberry32(i + 1)() * 0.2;
      const randDuration = mulberry32(i + 999)() * 0.5;
      const t = Math.min(1, dist / maxDist);
      const strokeWidth = 1.2 + (0.5 - 1.2) * t;

      return {
        delay: dist * 0.005 + randDelay,
        duration: 1.5 + randDuration,
        strokeWidth,
      };
    });

    setMeta(nextMeta);

    const totalSeconds = Math.max(
      ...nextMeta.map((m) => m.delay + m.duration),
      0,
    );
    onTimelineComputed?.({ totalSeconds });

    // Ensure Framer Motion reads the computed delays before starting.
    queueMicrotask(() => setReady(true));
  }, [onTimelineComputed]);

  return (
    <div className={className} aria-hidden="true">
      <svg
        viewBox={`${VIEWBOX.x} ${VIEWBOX.y} ${VIEWBOX.w} ${VIEWBOX.h}`}
        className="h-full w-full"
        preserveAspectRatio="xMidYMin meet"
      >
        <g>
          {CRACK_PATHS.map((p, i) => (
            <motion.path
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              ref={(el) => {
                pathRefs.current[i] = el;
              }}
              d={p.d}
              transform={p.transform}
              fill="none"
              stroke="#8FAAA2"
              strokeWidth={meta[i]?.strokeWidth ?? 0.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={ready ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
              transition={{
                duration: ready ? (meta[i]?.duration ?? 1.8) : 0,
                delay: ready ? (meta[i]?.delay ?? 0) : 0,
                ease: "easeInOut",
              }}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

