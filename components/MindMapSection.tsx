"use client";

import type { WheelEventHandler } from "react";

import { MindMapSvgInteractive } from "@/components/mindmap/MindMapSvgInteractive";

/** Natural size from Figma export (viewBox 0 0 2148 1958). */
const MINDMAP_ASPECT = 2148 / 1958;

const DEFAULT_SRC = "/images/mindmap.svg";

type MindMapSectionProps = {
  /** Path to the mind map SVG in `public/` (Figma export). */
  src?: string;
  className?: string;
  /** When false, only the map viewport is shown (for parent sections that supply their own title). */
  showHeader?: boolean;
  classNameViewport?: string;
};

/**
 * Floating mind map: transparent chrome; card groups scale in isolation while
 * connector paths stay static (see MindMapSvgInteractive + partitionMindmapSegment).
 */
export function MindMapSection({
  src = DEFAULT_SRC,
  className = "",
  showHeader = true,
  classNameViewport = "",
}: MindMapSectionProps) {
  const stopWheelBubble: WheelEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();
  };

  return (
    <section
      className={[
        "rounded-none bg-transparent p-0 shadow-none ring-0",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label="Yue Sport mind map"
    >
      {showHeader ? (
        <div className="mb-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-500">
            Research
          </p>
          <h2 className="mt-1 text-xl font-light tracking-tight text-neutral-900 [font-family:var(--font-cormorant),serif] sm:text-2xl">
            Experience mind map
          </h2>
          <p className="mt-1 max-w-xl text-sm text-neutral-600">
            Hover cards to scale them; connector lines stay fixed.
          </p>
        </div>
      ) : null}

      <div
        className={[
          "relative isolate w-full overflow-visible overscroll-contain bg-transparent touch-pan-y shadow-none ring-0",
          classNameViewport,
        ]
          .filter(Boolean)
          .join(" ")}
        style={{ aspectRatio: `${MINDMAP_ASPECT}` }}
        onWheel={stopWheelBubble}
      >
        <MindMapSvgInteractive
          src={src}
          className="max-h-full min-h-0 w-full [isolation:isolate]"
        />
      </div>
    </section>
  );
}
