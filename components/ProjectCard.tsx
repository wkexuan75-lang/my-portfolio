"use client";

import {
  motion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";

export type ProjectCardData = {
  id: string;
  index: string;
  title: string;
  /** Short discipline line, e.g. "Interactive Program" */
  category?: string;
  depth: number;
  description: string;
  side: "left" | "right";
  href: string;
};

const CARD_SHADOW_REST =
  "0 20px 50px rgba(0,0,0,0.05), 0 5px 15px rgba(0,0,0,0.02)";
const CARD_SHADOW_HOVER =
  "0 32px 72px rgba(0,0,0,0.1), 0 14px 32px rgba(0,0,0,0.06)";

export function ProjectCard({
  item,
  scrollYProgress,
}: {
  item: ProjectCardData;
  scrollYProgress: MotionValue<number>;
}) {
  const t = useTransform(scrollYProgress, (v) => {
    const start = Math.max(0, item.depth - 0.12);
    if (v <= start) return 0;
    if (v >= item.depth) return 1;
    return (v - start) / (item.depth - start);
  });

  const rawScale = useTransform(t, [0, 1], [0.82, 1]);
  const rawOpacity = useTransform(t, [0, 0.35, 1], [0, 0.9, 1]);
  const scale = useSpring(rawScale, { stiffness: 420, damping: 28, mass: 0.7 });
  const opacity = useSpring(rawOpacity, { stiffness: 380, damping: 32 });

  const cardSurfaceRef = useRef<HTMLDivElement>(null);
  /** Gap from path-facing card edge to viewport center (the dashed path), then dot sits at 1/5 of that gap. */
  const [dotMarginPx, setDotMarginPx] = useState(10);

  useLayoutEffect(() => {
    const el = cardSurfaceRef.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const cx = window.innerWidth / 2;
      if (item.side === "left") {
        const gap = Math.max(0, cx - rect.right);
        setDotMarginPx(Math.max(2, gap / 5));
      } else {
        const gap = Math.max(0, rect.left - cx);
        setDotMarginPx(Math.max(2, gap / 5));
      }
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update);
    };
  }, [item.side]);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new CustomEvent("shuttle-path-remeasure"));
  }, [dotMarginPx]);

  return (
    <motion.article
      className="pointer-events-auto absolute z-[5] w-[min(100%,min(92vw,28rem))] -translate-y-1/2 px-2 sm:w-[min(100%,32rem)]"
      style={{
        top: `${item.depth * 100}%`,
        left: item.side === "left" ? "10%" : "auto",
        right: item.side === "right" ? "10%" : "auto",
        scale,
        opacity,
      }}
    >
      <motion.div
        ref={cardSurfaceRef}
        className="relative rounded-2xl border border-gray-100 bg-white/80 p-8 backdrop-blur-md"
        style={{ boxShadow: CARD_SHADOW_REST }}
        whileHover={{
          y: -8,
          boxShadow: CARD_SHADOW_HOVER,
        }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Dot toward center path: left column → right of card; right column → left of card; margin = (edge→centerline gap) / 5 */}
        <span
          data-shuttle-path-anchor=""
          data-depth={String(item.depth)}
          className={
            item.side === "left"
              ? "pointer-events-none absolute left-full top-1/2 z-[2] size-2 -translate-y-1/2 rounded-full bg-neutral-800 shadow-sm ring-2 ring-white/90"
              : "pointer-events-none absolute right-full top-1/2 z-[2] size-2 -translate-y-1/2 rounded-full bg-neutral-800 shadow-sm ring-2 ring-white/90"
          }
          style={
            item.side === "left"
              ? { marginLeft: dotMarginPx }
              : { marginRight: dotMarginPx }
          }
          aria-hidden
        />
        <div className="space-y-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-black/50">
            {item.index}
            {item.category ? (
              <span className="text-black/35"> · {item.category}</span>
            ) : null}
          </p>
          <h3 className="text-xl font-medium tracking-tight text-black">
            {item.title}
          </h3>
          <p className="text-sm leading-relaxed text-black/75 sm:text-[15px]">
            {item.description}
          </p>
          <div className="pt-2">
            <Link
              href={item.href}
              className="group inline-flex items-center gap-2 rounded-full border border-black/15 bg-transparent px-4 py-2.5 text-sm font-medium text-black transition-colors hover:border-black/30 hover:bg-black/[0.03]"
            >
              Explore
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
}
