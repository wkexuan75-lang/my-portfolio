"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import {
  partitionMindmapSegment,
  type MindmapSegmentRun,
} from "./partitionMindmapSegment";
import { splitMindmapByRectNodes } from "./wrapMindmapRectNodes";

const NODE_HOVER_FILTER =
  "drop-shadow(0 0 15px rgba(126, 87, 194, 0.5))";

const nodeTransition = {
  type: "spring" as const,
  stiffness: 400,
  damping: 18,
};

function parseSvgLayout(attrs: string) {
  const viewBox = attrs.match(/viewBox="([^"]*)"/i)?.[1] ?? "0 0 2148 1958";
  const w = attrs.match(/\bwidth="(\d+)"/i)?.[1];
  const h = attrs.match(/\bheight="(\d+)"/i)?.[1];
  return {
    viewBox,
    width: w ? Number(w) : 2148,
    height: h ? Number(h) : 1958,
  };
}

type MindMapSvgInteractiveProps = {
  src?: string;
  className?: string;
};

function SegmentRuns({
  runs,
  segmentIndex,
}: {
  runs: MindmapSegmentRun[];
  segmentIndex: number;
}) {
  const firstCardJ = runs.findIndex((r) => r.kind === "card");

  return (
    <g data-mindmap-segment={segmentIndex}>
      {runs.map((run, j) => {
        if (run.kind === "wire") {
          return (
            <g
              key={`${segmentIndex}-${j}-wire`}
              className="mindmap-wires"
              pointerEvents="none"
              dangerouslySetInnerHTML={{ __html: run.html }}
            />
          );
        }

        return (
          <motion.g
            key={`${segmentIndex}-${j}-card`}
            id={j === firstCardJ ? `mindmap-node-${segmentIndex}` : undefined}
            className="mindmap-node"
            initial={false}
            whileHover={{
              scale: 1.15,
              filter: NODE_HOVER_FILTER,
              zIndex: 10,
            }}
            transition={nodeTransition}
            style={{
              transformOrigin: "center",
              transformBox: "fill-box",
            }}
          >
            <g
              className="mindmap-node-card"
              dangerouslySetInnerHTML={{ __html: run.html }}
            />
          </motion.g>
        );
      })}
    </g>
  );
}

/**
 * Mind map: each rect-led segment is partitioned into static wires vs card blocks.
 * Card blocks (rect or circle hubs + in-bounds label paths) scale on hover; wires stay put.
 */
export function MindMapSvgInteractive({
  src = "/images/mindmap.svg",
  className = "",
}: MindMapSvgInteractiveProps) {
  const [parts, setParts] = useState<ReturnType<
    typeof splitMindmapByRectNodes
  > | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(src);
        if (!res.ok) throw new Error(String(res.status));
        const text = await res.text();
        const parsed = splitMindmapByRectNodes(text);
        if (!parsed) throw new Error("Unexpected mind map SVG structure");
        if (!cancelled) setParts(parsed);
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Failed to load mind map");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [src]);

  const layout = useMemo(
    () => (parts ? parseSvgLayout(parts.svgAttrs) : null),
    [parts],
  );

  const segmentRunsList = useMemo(() => {
    if (!parts) return null;
    return parts.segments.map((seg) => partitionMindmapSegment(seg));
  }, [parts]);

  if (error) {
    return (
      <p className="absolute inset-0 flex items-center justify-center rounded-xl bg-red-950/40 p-4 text-center text-sm text-red-200/90">
        Mind map could not be loaded ({error}).
      </p>
    );
  }

  if (!parts || !layout || !segmentRunsList) {
    return (
      <div
        className="absolute inset-0 flex animate-pulse items-center justify-center rounded-2xl bg-neutral-200/40 text-sm text-neutral-500"
        aria-hidden
      >
        Loading map…
      </div>
    );
  }

  return (
    <motion.svg
      viewBox={layout.viewBox}
      width={layout.width}
      height={layout.height}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      className={[
        "mindmap-svg-root absolute inset-0 block h-full w-full max-w-none",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      initial={false}
    >
      {parts.prefix ? (
        <g dangerouslySetInnerHTML={{ __html: parts.prefix }} />
      ) : null}
      {segmentRunsList.map((runs, i) => (
        <SegmentRuns key={`seg-${i}`} runs={runs} segmentIndex={i} />
      ))}
      <g dangerouslySetInnerHTML={{ __html: parts.suffix }} />
    </motion.svg>
  );
}
