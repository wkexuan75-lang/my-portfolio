"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useState } from "react";

const COLUMN_SPRING = { type: "spring" as const, stiffness: 80, damping: 20 };

/** Coordinated “breathing” disclose for artifact unveil */
const ARTIFACT_EASE = {
  duration: 1,
  ease: [0.16, 1, 0.3, 1] as const,
};

const KILNS = [
  {
    key: "ru",
    label: "雨过天青·汝窑",
    artifact: "/images/ceramics/f1-1.png",
    detailEn:
      "Ru ware is celebrated for its sky-blue glaze, soft and luminous like jade. Few pieces survive; it epitomizes Song taste—quiet, restrained, like a breath of color after rain.",
    detailZh:
      "汝窑以天青釉著称，釉质莹润如玉。传世极少，被视为宋瓷审美之极致——含蓄、静谧，如雨后天青的一抹余韵。",
  },
  {
    key: "ge",
    label: "金丝铁线·哥窑",
    artifact: "/images/ceramics/f2-2.png",
    detailEn:
      "Ge crackle glazes show bold brown “iron” lines and fine golden threads—pattern born from imperfection, turned into ornament and beloved by Song literati.",
    detailZh:
      "哥窑釉面开片，大纹呈深褐如「铁线」，细纹浅黄若「金丝」，交织成自然肌理。缺陷化为装饰，是宋代文人审美的典型表达。",
  },
  {
    key: "ding",
    label: "白釉刻花·定窑",
    artifact: "/images/ceramics/f5-5.png",
    detailEn:
      "Ding ware led in white porcelain with crisp carved, combed, and stamped designs—elegant, practical, and refined for daily and display use.",
    detailZh:
      "定窑以白瓷见长，刻花、划花、印花工艺精湛，线条清晰流畅。器物多实用与陈设并重，素雅中见精巧。",
  },
  {
    key: "guan",
    label: "紫口铁足·官窑",
    artifact: "/images/ceramics/f3-3.png",
    detailEn:
      "Guan ware served the court: muted gray-green glazes, purplish mouths where the glaze thins, and iron-toned feet—solemn, balanced, unmistakably imperial.",
    detailZh:
      "官窑为宫廷烧造，釉色青灰含蓄。口沿釉薄泛紫、圈足露胎呈铁色，所谓「紫口铁足」，庄重典雅，为宋代宫廷用瓷代表。",
  },
  {
    key: "jun",
    label: "窑变万彩·钧窑",
    artifact: "/images/ceramics/f4-4.png",
    detailEn:
      "Jun flambé glazes shift with copper reds—no two pieces alike, blues and violets flowing like clouds. Fired one tone, they emerge in countless colors.",
    detailZh:
      "钧窑以铜红窑变闻名，一窑之中无相同之色，青中带紫、变幻如霞。釉色流动自然，被誉为「入窑一色，出窑万彩」。",
  },
] as const;

/** Half of previous full-viewport strip: (100svh - 4.75rem) / 2 */
const SECTION_HEIGHT = "calc(50svh - 2.375rem)";

export function CeramicsPushWindowHero() {
  const [hovered, setHovered] = useState<number | null>(null);

  const onLeaveStrip = useCallback(() => setHovered(null), []);

  return (
    <section
      className="relative w-full overflow-hidden bg-[#121716]"
      style={{ height: SECTION_HEIGHT }}
      aria-label="Song dynasty five great kilns"
    >
      <div
        className="flex h-full w-full flex-row"
        onMouseLeave={onLeaveStrip}
      >
        {KILNS.map((k, i) => {
          const isActive = hovered === i;
          const flexGrow = hovered === null ? 1 : isActive ? 4 : 0.25;

          return (
            <motion.div
              key={k.key}
              className="relative flex min-h-0 min-w-0 cursor-pointer flex-row overflow-hidden border-l border-[#F4F1EA]/10 first:border-l-0"
              initial={false}
              animate={{ flexGrow, flexShrink: 1, flexBasis: 0 }}
              transition={COLUMN_SPRING}
              onMouseEnter={() => setHovered(i)}
              onClick={() => setHovered((h) => (h === i ? null : i))}
              onFocus={() => setHovered(i)}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) setHovered(null);
              }}
              tabIndex={0}
              role="button"
              aria-pressed={isActive}
              aria-label={`${k.label}，悬停或点击展开`}
            >
              {/* Left: per-kiln copy — only when column is active (hover / expanded) */}
              <motion.aside
                className="flex shrink-0 flex-col justify-center overflow-hidden"
                initial={false}
                animate={{
                  width: isActive ? "clamp(12.5rem, 38%, 21rem)" : 0,
                  opacity: isActive ? 1 : 0,
                }}
                transition={ARTIFACT_EASE}
                aria-hidden={!isActive}
              >
                <div className="flex flex-col gap-3 py-2 pl-5 pr-0 text-left sm:gap-3.5 sm:py-2.5 sm:pl-6 sm:pr-0">
                  <p
                    lang="en"
                    className="font-[system-ui,-apple-system,sans-serif] text-[15px] leading-snug tracking-[0.02em] text-[#F0EBE3]/95 sm:text-base"
                  >
                    {k.detailEn}
                  </p>
                  <p
                    lang="zh-Hans"
                    className="border-t border-[#F4F1EA]/15 pt-3 font-serif text-[15px] leading-relaxed tracking-wide text-[#E8E4DC]/95 sm:pt-3.5 sm:text-[17px] sm:leading-relaxed"
                  >
                    {k.detailZh}
                  </p>
                </div>
              </motion.aside>

              {/* Right: artifact — idle = right-cropped glimpse; active = full piece */}
              <div className="relative min-h-0 min-w-0 flex-1 overflow-hidden">
                {/* Glimpse (half / right-anchored) */}
                <motion.div
                  className="pointer-events-none absolute inset-0 z-0"
                  initial={false}
                  animate={{ opacity: isActive ? 0 : 1 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  <motion.div
                    className="absolute top-1/2 right-0 h-[148%] w-[min(320%,520px)] max-w-none -translate-y-1/2 sm:h-[158%] sm:w-[min(340%,600px)]"
                    initial={false}
                    animate={{
                      opacity: 0.42,
                      scale: 1.14,
                      x: "6%",
                    }}
                    transition={ARTIFACT_EASE}
                    style={{ willChange: "opacity, transform" }}
                  >
                    <Image
                      src={k.artifact}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 45vw, 600px"
                      className="object-cover object-right"
                      priority={i < 2}
                    />
                  </motion.div>
                </motion.div>

                {/* Full artifact on hover */}
                <motion.div
                  className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-start py-2 pl-0 pr-2 sm:py-3 sm:pr-3"
                  initial={false}
                  animate={{ opacity: isActive ? 1 : 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <motion.div
                    className="relative h-full min-h-0 w-full max-h-full -translate-x-1.5 sm:-translate-x-2.5"
                    initial={false}
                    animate={{
                      scale: isActive ? 1 : 0.98,
                      boxShadow: isActive
                        ? "0 20px 48px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(244, 241, 234, 0.06)"
                        : "0 0 0 rgba(0,0,0,0)",
                    }}
                    transition={ARTIFACT_EASE}
                    style={{ willChange: "opacity, transform" }}
                  >
                    <Image
                      src={k.artifact}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 70vw, 560px"
                      className="object-contain object-left"
                      priority={i < 2}
                    />
                  </motion.div>
                </motion.div>
              </div>

              {/* Vertical label — far right */}
              <div className="relative z-10 flex h-full shrink-0 items-center justify-end pr-2 sm:pr-4 md:pr-5">
                <motion.span
                  className="font-serif text-lg text-[#F4F1EA] sm:text-xl md:text-2xl"
                  style={{ writingMode: "vertical-rl" }}
                  initial={false}
                  animate={{ opacity: isActive ? 0.38 : 0.72 }}
                  transition={ARTIFACT_EASE}
                >
                  {k.label}
                </motion.span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
