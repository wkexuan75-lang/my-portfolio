"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

function LogoCenteredWithArrow({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="relative h-[min(42vw,300px)] w-[min(66.6667vw,520px)] shrink-0 sm:h-[min(38vw,340px)] sm:w-[min(66.6667vw,520px)] md:h-80 md:max-h-[min(50vh,420px)] md:w-[min(66.6667vw,560px)]">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain object-center"
          sizes="(max-width: 1024px) 67vw, 560px"
        />
      </div>
      {reduceMotion ? (
        <div className="mt-5 flex justify-center text-white/50" aria-hidden>
          <ChevronDown className="h-9 w-9" strokeWidth={1.35} />
        </div>
      ) : (
        <motion.div
          className="mt-5 flex justify-center text-white/50"
          aria-hidden
          animate={{ y: [0, 5, 0] }}
          transition={{
            duration: 1.8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <ChevronDown className="h-9 w-9" strokeWidth={1.35} />
        </motion.div>
      )}
    </div>
  );
}

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const view = { once: true, amount: 0.28 } as const;

const slideLeft = {
  hidden: { opacity: 0, x: -48 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.65, ease: EASE },
  },
} as const;

const slideRight = {
  hidden: { opacity: 0, x: 48 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.65, ease: EASE },
  },
} as const;

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE },
  },
} as const;

const PHASE3_QUADRANTS = [
  {
    label: "品牌特色 · Brand traits",
    zh: "爪印这一元素也反映了品牌的宠物友好的特征，也同时成为了 logo 中最为主要的元素。",
    en: "The paw print reflects the brand’s pet-friendly character and stands as the core motif of the logo.",
  },
  {
    label: "品牌名称 · Wordmark",
    zh: "品牌名称以弧形呈现与下侧呼应，使 logo 更具有整体感。",
    en: "The wordmark follows an arc that echoes the lower curves for a cohesive mark.",
  },
  {
    label: "品牌类型 · Dining cue",
    zh: "下部分用多条弧形来展现碗这一元素，体现餐厅元素。",
    en: "Multiple arcs at the base form a bowl shape, nodding to the dining side of the brand.",
  },
  {
    label: "餐车特点 · On the move",
    zh: "箭头与品牌名称中的 Go 相呼应，也体现了餐车说走就走、可随处售卖的特点。",
    en: 'The arrow pairs with "GO" in the name, capturing the food-truck spirit of selling anywhere, anytime.',
  },
] as const;

function QuadrantBlock({
  label,
  zh,
  en,
  align = "left",
}: {
  label: string;
  zh: string;
  en: string;
  align?: "left" | "right";
}) {
  return (
    <div className={align === "right" ? "text-right" : "text-left"}>
      <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
        {label}
      </p>
      <p
        lang="zh-Hans"
        className="mt-2 text-[0.9rem] leading-[1.85] text-white/90 md:text-[0.95rem]"
        style={{
          fontFamily: "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
        }}
      >
        {zh}
      </p>
      <p
        lang="en"
        className="mt-2 text-[0.82rem] leading-relaxed text-white/65 [font-family:var(--font-geist-sans),system-ui,sans-serif]"
      >
        {en}
      </p>
    </div>
  );
}

function Phase3QuadrantTexts() {
  return (
    <div className="space-y-10">
      {PHASE3_QUADRANTS.map((q) => (
        <QuadrantBlock key={q.label} {...q} align="left" />
      ))}
    </div>
  );
}

export function BrandLogoEvolution() {
  return (
    <div className="border-t border-white/10 bg-black text-white">
      {/* Section title */}
      <div className="mx-auto max-w-6xl px-6 pb-4 pt-16 text-center md:px-10 md:pt-20">
        <h2
          lang="zh-Hans"
          className="text-2xl font-semibold tracking-wide text-white md:text-3xl"
          style={{
            fontFamily: "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
          }}
        >
          品牌视觉
        </h2>
        <p className="mt-2 text-sm font-medium uppercase tracking-[0.2em] text-white/55 md:text-base">
          The Evolution of Logo
        </p>
      </div>

      {/* Phase 1 — 左文 + 画面居中图：大屏三列 1fr | auto | 1fr，logo 水平居中；窄屏上图下文 */}
      <section
        className="w-full py-14 md:py-16"
        aria-labelledby="phase-1-heading"
      >
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-6 md:gap-12 md:px-10 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-x-2 lg:gap-y-0">
          <motion.div
            className="order-2 flex max-w-xl flex-col justify-center justify-self-start lg:order-1 lg:max-w-md lg:justify-self-end xl:max-w-lg"
            initial="hidden"
            whileInView="visible"
            viewport={view}
            variants={slideLeft}
          >
            <h3
              id="phase-1-heading"
              lang="zh-Hans"
              className="text-lg font-semibold text-white md:text-xl"
              style={{
                fontFamily: "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
              }}
            >
              版本1 人宠共处的初心{" "}
              <span className="block text-sm font-normal text-white/65 [font-family:var(--font-cormorant),serif] md:inline md:text-base">
                (Draft 1: The Initial Spark)
              </span>
            </h3>
            <p
              lang="zh-Hans"
              className="mt-4 text-[0.95rem] leading-[1.9] text-white/85 md:text-base"
              style={{
                fontFamily: "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
              }}
            >
              由于品牌定位于面向年轻群体的宠物友好型餐厅，最初我们希望将宠物形象与食物直接关联。因此，初版
              Logo 采用了“小兔子顶碗”的造型，生动地传递了餐厅与宠物和谐共处的主题。
            </p>
            <p
              lang="en"
              className="mt-4 border-t border-white/10 pt-4 text-[0.92rem] leading-relaxed text-white [font-family:var(--font-geist-sans),system-ui,sans-serif] md:text-[0.95rem]"
            >
              With our primary positioning as a pet-friendly restaurant for the
              younger generation, we initially aimed to link pet imagery directly
              with food. Consequently, our first-generation logo featured a
              &quot;Bunny Balancing a Bowl,&quot; vividly conveying the theme of
              harmony between pets and the culinary experience.
            </p>
          </motion.div>

          <motion.div
            className="order-1 flex min-h-[min(44vh,360px)] w-full flex-col items-center justify-center justify-self-center lg:order-2 lg:col-start-2 lg:min-h-[min(52vh,560px)] lg:w-auto"
            initial="hidden"
            whileInView="visible"
            viewport={view}
            variants={fadeUp}
          >
            <LogoCenteredWithArrow
              src="/images/graphics/logo-1.1.png"
              alt="PAW & GO Phase 1 logo — bunny and bowl"
            />
          </motion.div>
        </div>
      </section>

      {/* Phase 2 — 左留白 + 居中 logo-2 + 右侧文案（与 Phase 1 镜像）；窄屏上图下文 */}
      <section
        className="w-full border-t border-white/10 py-14 md:py-16"
        aria-labelledby="phase-2-heading"
      >
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-6 md:gap-12 md:px-10 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-x-2 lg:gap-y-0">
          <motion.div
            className="order-1 flex min-h-[min(44vh,360px)] w-full flex-col items-center justify-center justify-self-center lg:order-none lg:col-start-2 lg:min-h-[min(52vh,560px)] lg:w-auto"
            initial="hidden"
            whileInView="visible"
            viewport={view}
            variants={fadeUp}
          >
            <LogoCenteredWithArrow
              src="/images/graphics/logo-2.png"
              alt="PAW & GO Phase 2 logo — paw print arrow"
            />
          </motion.div>

          <motion.div
            className="order-2 flex max-w-xl flex-col justify-center justify-self-start lg:order-none lg:col-start-3 lg:max-w-md lg:justify-self-start xl:max-w-lg"
            initial="hidden"
            whileInView="visible"
            viewport={view}
            variants={slideRight}
          >
            <h3
              id="phase-2-heading"
              lang="zh-Hans"
              className="text-lg font-semibold text-white md:text-xl"
              style={{
                fontFamily: "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
              }}
            >
              版本2：户外餐车的灵感{" "}
              <span className="block text-sm font-normal text-white/65 [font-family:var(--font-cormorant),serif] md:inline md:text-base">
                (Draft 2: Outdoor Food Truck Inspiration)
              </span>
            </h3>
            <p
              lang="zh-Hans"
              className="mt-4 text-[0.95rem] leading-[1.9] text-white/85 md:text-base"
              style={{
                fontFamily: "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
              }}
            >
              随着品牌定位的不断细化，我们引入了“户外餐车”的概念。以此为基调，我们确定了兼具宠物与户外元素的名称
              “PAW&GO”，并提取了“爪印”与“箭头”作为 Logo
              的核心视觉符号，象征着随性、自由的出行与探索。
            </p>
            <p
              lang="en"
              className="mt-4 border-t border-white/10 pt-4 text-[0.92rem] leading-relaxed text-white/70 [font-family:var(--font-geist-sans),system-ui,sans-serif] md:text-[0.95rem]"
            >
              As we refined the brand, the &quot;Outdoor Food Truck&quot; concept
              was introduced. Based on this, we established the brand name
              &quot;PAW&amp;GO,&quot; merging pet and outdoor elements. We
              selected the &quot;Paw Print&quot; and &quot;Arrow&quot; as core
              visual symbols, representing spontaneous exploration and the
              freedom of being on the move.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Phase 3 — 中央 icon-2，四角双语说明（桌面环绕；窄屏先图后文） */}
      <section
        className="border-t border-white/10 px-6 py-16 md:px-10 md:py-20"
      >
        <div className="mx-auto max-w-5xl">
          {/* 窄屏：先中央图标，再四段说明 */}
          <motion.div
            className="lg:hidden"
            initial="hidden"
            whileInView="visible"
            viewport={view}
            variants={fadeUp}
          >
            <div className="-translate-y-[5px] mb-4 text-center">
              <p
                lang="zh-Hans"
                className="text-sm font-semibold tracking-wide text-white/90 md:text-base"
                style={{
                  fontFamily: "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
                }}
              >
                最终版
              </p>
              <p
                lang="en"
                className="mt-1 text-sm font-normal text-white/65 [font-family:var(--font-cormorant),serif]"
              >
                (Final)
              </p>
            </div>
            <div className="relative mx-auto mb-10 aspect-square w-[min(78vw,300px)]">
              <Image
                src="/images/graphics/icon-2.png"
                alt="PAW & GO final mark — paw arrow and bowl arcs"
                fill
                className="object-contain object-center"
                sizes="78vw"
              />
            </div>
            <Phase3QuadrantTexts />
          </motion.div>

          {/* 桌面：四角 + 中央叠放 */}
          <motion.div
            className="relative mx-auto hidden min-h-[480px] w-full max-w-4xl md:min-h-[520px] lg:block xl:min-h-[560px]"
            initial="hidden"
            whileInView="visible"
            viewport={view}
            variants={fadeUp}
          >
            <div className="absolute inset-0 grid grid-cols-[1fr_minmax(200px,1fr)_1fr] grid-rows-[auto_1fr_auto] gap-x-6 gap-y-4 px-1 pt-2 xl:gap-x-10">
              <div className="col-start-1 row-start-1 max-w-[min(100%,18rem)] justify-self-start">
                <QuadrantBlock {...PHASE3_QUADRANTS[0]} align="left" />
              </div>
              <div className="col-start-3 row-start-1 max-w-[min(100%,18rem)] justify-self-end">
                <QuadrantBlock {...PHASE3_QUADRANTS[1]} align="right" />
              </div>
              <div className="col-start-1 row-start-3 max-w-[min(100%,18rem)] justify-self-start self-end">
                <QuadrantBlock {...PHASE3_QUADRANTS[2]} align="left" />
              </div>
              <div className="col-start-3 row-start-3 max-w-[min(100%,18rem)] justify-self-end self-end">
                <QuadrantBlock {...PHASE3_QUADRANTS[3]} align="right" />
              </div>
            </div>
            <div className="absolute left-1/2 top-1/2 z-10 flex w-[min(38vw,280px)] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3 xl:w-[min(34vw,320px)]">
              <div className="-translate-y-[5px] text-center">
                <p
                  lang="zh-Hans"
                  className="text-sm font-semibold tracking-wide text-white/90 md:text-base"
                  style={{
                    fontFamily: "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
                  }}
                >
                  最终版
                </p>
                <p
                  lang="en"
                  className="mt-1 text-sm font-normal text-white/65 [font-family:var(--font-cormorant),serif]"
                >
                  (Final)
                </p>
              </div>
              <div className="relative aspect-square w-full">
                <Image
                  src="/images/graphics/icon-2.png"
                  alt="PAW & GO final mark — paw arrow and bowl arcs"
                  fill
                  className="object-contain object-center"
                  sizes="320px"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
