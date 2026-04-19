"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";

const LAYOUT_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const layoutTransition = {
  layout: { duration: 0.6, ease: LAYOUT_EASE },
} as const;

/** 首张 9 张 AIGC 静帧（当前素材无 a5，故未列入） */
export const ETHNIC_ACCORDION_ITEMS = [
  {
    id: "aigc-still-01",
    src: "/images/myths/a1.png",
    title_cn: "雪域祈福",
    title_en: "Highland Blessings",
  },
  {
    id: "aigc-still-02",
    src: "/images/myths/a2.png",
    title_cn: "草原盛会",
    title_en: "Steppe Gathering",
  },
  {
    id: "aigc-still-03",
    src: "/images/myths/a3.png",
    title_cn: "苗岭盛装",
    title_en: "Miao Hearth",
  },
  {
    id: "aigc-still-04",
    src: "/images/myths/a4.png",
    title_cn: "春联纳福",
    title_en: "Spring Couplets",
  },
  {
    id: "aigc-still-05",
    src: "/images/myths/a6.png",
    title_cn: "红包寄愿",
    title_en: "Red Packets",
  },
  {
    id: "aigc-still-06",
    src: "/images/myths/a7.png",
    title_cn: "团圆宴飨",
    title_en: "Reunion Feast",
  },
  {
    id: "aigc-still-07",
    src: "/images/myths/a8.png",
    title_cn: "舞乐迎新",
    title_en: "Dance & Lanterns",
  },
  {
    id: "aigc-still-08",
    src: "/images/myths/a9.png",
    title_cn: "焰火影绰",
    title_en: "Firelight Trails",
  },
  {
    id: "aigc-still-09",
    src: "/images/myths/a10.png",
    title_cn: "万家灯暖",
    title_en: "Homes Aglow",
  },
] as const;

function gridTracks(hovered: number | null): { cols: string; rows: string } {
  if (hovered === null) {
    return { cols: "1fr 1fr 1fr", rows: "1fr 1fr 1fr" };
  }
  const col = hovered % 3;
  const row = Math.floor(hovered / 3);
  const major = "2.35fr";
  const minor = "0.825fr";
  const cols = [0, 1, 2]
    .map((i) => (i === col ? major : minor))
    .join(" ");
  const rows = [0, 1, 2]
    .map((i) => (i === row ? major : minor))
    .join(" ");
  return { cols, rows };
}

export function EthnicAccordionGrid() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();

  const { cols, rows } = useMemo(
    () => gridTracks(hoveredIndex),
    [hoveredIndex],
  );

  const layoutTx = reduceMotion
    ? { layout: { duration: 0 } }
    : layoutTransition;

  const mediaTx = reduceMotion
    ? { duration: 0 }
    : { duration: 0.45, ease: LAYOUT_EASE };

  /** 默认九宫格全彩；悬停时仅当前格全彩，其余变淡、去色 */
  const filterFull = "grayscale(0)";
  const filterActive =
    "grayscale(0) brightness(1.1) contrast(1.05)";
  const filterMuted =
    "grayscale(1) brightness(0.88) contrast(0.92)";

  return (
    <motion.div
      layout
      className="mx-auto grid aspect-square w-full max-w-[800px] gap-[15px]"
      style={{
        gridTemplateColumns: cols,
        gridTemplateRows: rows,
      }}
      transition={layoutTx}
      onMouseLeave={() => setHoveredIndex(null)}
      role="list"
    >
      {ETHNIC_ACCORDION_ITEMS.map((item, i) => {
        const isActive = hoveredIndex === i;
        const anyHover = hoveredIndex !== null;

        return (
          <motion.div
            key={item.id}
            layout
            layoutId={item.id}
            role="listitem"
            transition={layoutTx}
            className="relative min-h-0 min-w-0 cursor-pointer overflow-hidden rounded-lg border border-white/10 bg-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md"
            onMouseEnter={() => setHoveredIndex(i)}
          >
            <motion.div
              className="absolute inset-0"
              initial={false}
              animate={{
                opacity: !anyHover
                  ? 1
                  : isActive
                    ? 1
                    : 0.42,
                filter: !anyHover
                  ? filterFull
                  : isActive
                    ? filterActive
                    : filterMuted,
              }}
              transition={mediaTx}
            >
              <Image
                src={item.src}
                alt=""
                fill
                sizes="(max-width: 768px) 30vw, 260px"
                quality={95}
                priority={i < 3}
                className="h-full w-full object-cover object-center [backface-visibility:hidden] [image-rendering:high-quality] [transform:translateZ(0)]"
              />
            </motion.div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent px-2 pb-2 pt-8 text-left sm:px-3 sm:pb-2.5">
              <p
                lang="zh-Hans"
                className="text-[10px] font-medium leading-tight text-white/95 drop-shadow-sm sm:text-[11px]"
              >
                {item.title_cn}
              </p>
              <p className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.12em] text-white/70 [font-family:var(--font-geist-sans),system-ui,sans-serif] sm:text-[10px]">
                {item.title_en}
              </p>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
