"use client";

import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

const INK = "#00332E";

type Persona = {
  id: string;
  image: string;
  nameEn: string;
  nameZh?: string;
  metaEn: string;
  metaZh: string;
  traits: { en: string; zh: string }[];
};

const PERSONAS: Persona[] = [
  {
    id: "linda",
    image: "/images/marketing/persona-1.jpg",
    nameEn: "Linda Wang",
    metaEn: "35 Years Old | Elite Professional | Advertising Manager",
    metaZh: "35岁 精致白领 | 广告公司经理",
    traits: [
      {
        en: "Values the quality of home living.",
        zh: "重视居家生活品质。",
      },
      {
        en: "Possesses a unique and sophisticated fashion taste.",
        zh: "具有独特时尚品味。",
      },
    ],
  },
  {
    id: "ah-lin",
    image: "/images/marketing/persona-2.jpg",
    nameEn: "Ah Lin",
    nameZh: "阿林",
    metaEn: "28 Years Old | New Media Professional | Extended Home Hours",
    metaZh: "28岁 新媒体从业者 | 居家时间较长",
    traits: [
      {
        en: "Focuses on creating indoor ambiance and comfort.",
        zh: "注重室内的氛围感与舒适感。",
      },
    ],
  },
  {
    id: "chun-ming",
    image: "/images/marketing/persona-3.jpg",
    nameEn: "Chun Ming",
    nameZh: "春明",
    metaEn: "55 Years Old | Gardening & Art Enthusiast | Profound Artistic Background",
    metaZh: "55岁 园艺艺术爱好者 | 深厚艺术底蕴",
    traits: [
      {
        en: "High standards for the artistic sense of interior environments.",
        zh: "对室内环境艺术感要求高。",
      },
    ],
  },
];

export function LoeweUserPersonas() {
  const regionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(regionRef, { once: true, amount: 0.18 });

  return (
    <section className="relative overflow-hidden border-t border-black/10 bg-[#B2C2A2] px-6 py-16 md:px-12 md:py-24 lg:px-20">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.11]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundAttachment: "fixed",
          backgroundSize: "256px 256px",
        }}
      />

      <div ref={regionRef} className="relative z-[1] mx-auto max-w-6xl">
        <header className="mb-12 md:mb-16">
          <h2 className="mb-3 flex flex-col gap-1 text-2xl font-semibold tracking-tight text-black sm:flex-row sm:items-baseline sm:gap-3 md:text-3xl [font-family:var(--font-cormorant),serif]">
            <span>User Personas</span>
            <span className="text-lg font-normal text-black/45 md:text-xl">
              消费者画像
            </span>
          </h2>
        </header>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8 lg:gap-10">
          {PERSONAS.map((p, index) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 32 }}
              animate={
                inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }
              }
              transition={{
                duration: 0.58,
                delay: index * 0.16,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="group flex flex-col items-center text-center"
            >
              {/* Fixed-height avatar row so name + first body line align across columns */}
              <div className="relative mb-6 flex h-[168px] w-full flex-col items-center justify-start md:h-[184px]">
                <div
                  className="pointer-events-none absolute bottom-2 left-1/2 h-14 w-[min(100%,200px)] -translate-x-1/2 rounded-full bg-white/0 opacity-0 blur-2xl transition-opacity duration-500 group-hover:bg-white/35 group-hover:opacity-100"
                  aria-hidden
                />
                <div className="relative transition-transform duration-500 ease-out group-hover:scale-105">
                  <Image
                    src={p.image}
                    alt={p.nameEn}
                    width={176}
                    height={176}
                    className="h-36 w-36 rounded-full border border-[#00332E] object-cover shadow-sm md:h-40 md:w-40"
                    sizes="(max-width: 768px) 144px, 160px"
                  />
                </div>
              </div>

              <div className="w-full max-w-sm space-y-3 text-center">
                <div className="flex min-h-[7.5rem] flex-col items-center justify-start md:min-h-[8rem]">
                  <h3
                    className="text-2xl font-bold tracking-tight md:text-[1.75rem] md:leading-snug lg:text-3xl [font-family:var(--font-cormorant),serif]"
                    style={{ color: INK }}
                  >
                    {p.nameEn}
                    {p.nameZh ? (
                      <span
                        className="mt-1 block text-base font-normal text-black/55 md:text-lg"
                        style={{
                          fontFamily:
                            "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
                        }}
                      >
                        （{p.nameZh}）
                      </span>
                    ) : null}
                  </h3>
                </div>

                <p
                  className="text-sm font-semibold leading-relaxed text-black md:text-[15px]"
                  style={{ fontFamily: "var(--font-cormorant), serif" }}
                >
                  {p.metaEn}
                </p>
                <p
                  className="text-[13px] leading-relaxed text-black/70 md:text-sm"
                  style={{
                    fontFamily:
                      "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
                  }}
                >
                  {p.metaZh}
                </p>

                <ul className="space-y-3 pt-2 text-center">
                  {p.traits.map((t) => (
                    <li key={t.en}>
                      <p
                        className="text-sm font-semibold leading-relaxed md:text-[15px]"
                        style={{
                          fontFamily: "var(--font-cormorant), serif",
                          color: INK,
                        }}
                      >
                        {t.en}
                      </p>
                      <p
                        className="mt-1 text-[13px] leading-relaxed text-black/75 md:text-sm"
                        style={{
                          fontFamily:
                            "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
                        }}
                      >
                        {t.zh}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          ))}
        </div>

        <p
          className="mx-auto mt-14 max-w-2xl text-center text-[10px] leading-relaxed text-black/45 md:mt-16 md:text-[11px]"
          style={{ fontFamily: "var(--font-cormorant), serif" }}
        >
          Avatars source: Little Red Book @Cai Shi Chang
          <span
            className="mt-1 block text-black/40"
            style={{
              fontFamily:
                "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
            }}
          >
            头像均来源于小红书博主蔡视厂
          </span>
        </p>
      </div>
    </section>
  );
}
