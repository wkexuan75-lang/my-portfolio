"use client";

import Image from "next/image";
import Link from "next/link";
import { type ReactNode } from "react";

import { LoeweCompetitorAnalysis } from "@/components/marketing/LoeweCompetitorAnalysis";
import { LoeweMarketAnalysis } from "@/components/marketing/LoeweMarketAnalysis";
import { LoeweUserPersonas } from "@/components/marketing/LoeweUserPersonas";
import { LoeweMarketingProposal } from "@/components/marketing/LoeweMarketingProposal";
import { MarketingRoadmap } from "@/components/marketing/MarketingRoadmap";
import { LoeweCreativeStageOne } from "@/components/marketing/LoeweCreativeStageOne";
import { LoeweCreativeStageTwo } from "@/components/marketing/LoeweCreativeStageTwo";
import { LoeweCreativeStageThree } from "@/components/marketing/LoeweCreativeStageThree";
import { LoeweMediaStrategySection } from "@/components/marketing/LoeweMediaStrategySection";

const SAGE = "#B2C2A2";

const cnHover =
  "text-gray-500 transition-colors duration-300 hover:text-[#1e4d3e]";

type Bullet = {
  titleEn: string;
  titleZh: string;
  en: string;
  zh: string;
};

const STRENGTHS: Bullet[] = [
  {
    titleEn: "Brand Influence",
    titleZh: "品牌影响力",
    en: "Long history with strong brand influence and a loyal consumer base.",
    zh: "历史悠久，品牌影响力深厚，并拥有稳定的消费群体。",
  },
  {
    titleEn: "Design Innovation",
    titleZh: "设计创新",
    en: "Unique design and innovation—distinctive packaging and fragrance formulas with a pure, natural tone.",
    zh: "以独特设计与创新著称；包装与香氛配方别具一格，气质纯净自然。",
  },
  {
    titleEn: "High-quality Ingredients",
    titleZh: "高质量原料",
    en: "High-quality materials for premium products and long-lasting fragrance.",
    zh: "甄选优质原料，打造高端产品与持久留香体验。",
  },
  {
    titleEn: "Diverse Product Categories",
    titleZh: "丰富多彩的品类",
    en: "Compared with peers, the home line offers more scents and wider coverage—diffusers, candles, and accessories.",
    zh: "相较同类奢侈品牌，家居香氛线香型更丰富、覆盖更广，涵盖扩香、蜡烛与配件等。",
  },
];

const WEAKNESSES: Bullet[] = [
  {
    titleEn: "High Pricing",
    titleZh: "高价格",
    en: "As a luxury brand, high price points may limit some consumers’ purchasing power.",
    zh: "奢侈定位下价格较高，可能限制部分消费者的购买意愿。",
  },
  {
    titleEn: "Market Segmentation",
    titleZh: "市场细分",
    en: "The fragrance market is crowded; segmentation could be sharper.",
    zh: "香氛市场竞争激烈，细分定位仍不够清晰。",
  },
  {
    titleEn: "Heritage vs. Innovation",
    titleZh: "品牌传承与创新的平衡",
    en: "Balancing heritage with constant innovation to engage younger audiences without diluting the brand.",
    zh: "在传承经典与持续创新之间取得平衡，以吸引年轻客群并避免品牌停滞。",
  },
  {
    titleEn: "Channel Dependency",
    titleZh: "渠道依赖性",
    en: "Reliance on certain channels may constrain expansion and flexibility.",
    zh: "对特定销售渠道依赖较强，或限制市场拓展与灵活性。",
  },
  {
    titleEn: "Scene Limitation",
    titleZh: "场景局限",
    en: "Fragrance is often tied to home/office contexts; diffusion and reach can feel limited.",
    zh: "香氛多集中于家与办公等场景，触达与扩散范围相对有限。",
  },
];

const OPPORTUNITIES: Bullet[] = [
  {
    titleEn: "Market Expansion",
    titleZh: "市场扩张",
    en: "Post-pandemic, more time at home lifts demand for décor and ambience.",
    zh: "疫情后居家时间增加，家居氛围与陈设需求上升。",
  },
  {
    titleEn: "Digital Marketing",
    titleZh: "数字化营销",
    en: "Social and e-commerce can extend reach and storytelling.",
    zh: "借助社交媒体与电商拓展品牌影响力与市场覆盖。",
  },
  {
    titleEn: "Sustainability",
    titleZh: "可持续发展",
    en: "Emphasizing sustainability attracts values-driven consumers.",
    zh: "强调环保与可持续，吸引具有社会责任感的消费者。",
  },
];

const THREATS: Bullet[] = [
  {
    titleEn: "Market Competition",
    titleZh: "市场竞争",
    en: "Increasing saturation and rivalry from luxury and niche brands.",
    zh: "市场趋于饱和，奢侈与小众品牌竞争加剧。",
  },
  {
    titleEn: "Evolving Consumer Preferences",
    titleZh: "消费者偏好变化",
    en: "Needs and tastes for fragrance vary widely and shift quickly.",
    zh: "消费者对香氛的需求与偏好差异大且变化快。",
  },
  {
    titleEn: "Consumer Mindset",
    titleZh: "消费观念",
    en: "Fragrance is not always seen as a ‘core’ luxury category—perceived necessity can be lower.",
    zh: "大众未必将香氛视为“传统”奢侈品门类，刚需感偏低。",
  },
  {
    titleEn: "Economic Fluctuations",
    titleZh: "经济波动",
    en: "Macroeconomic shifts can weigh on luxury performance overall.",
    zh: "全球经济波动可能影响奢侈品整体表现。",
  },
];

function BulletList({ items }: { items: Bullet[] }) {
  return (
    <ul className="space-y-4 text-sm leading-relaxed">
      {items.map((b) => (
        <li key={b.titleEn}>
          <p className="font-medium text-black">
            <span className="block sm:inline">{b.titleEn}</span>
            <span className="hidden text-black/35 sm:inline"> / </span>
            <span className={`mt-0.5 block sm:mt-0 sm:inline ${cnHover}`}>
              {b.titleZh}
            </span>
          </p>
          <p className="mt-1.5 text-black/85">{b.en}</p>
          <p className={`mt-1.5 ${cnHover}`}>{b.zh}</p>
        </li>
      ))}
    </ul>
  );
}

function Quadrant({
  titleEn,
  titleZh,
  children,
}: {
  titleEn: string;
  titleZh: string;
  children: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden border border-dashed border-black/25 bg-[#c4d0b6]/90 transition-colors duration-300 ease-out hover:bg-white">
      <div className="relative z-[1] p-6 sm:p-8">
        <h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-black md:text-base">
          <span className="block sm:inline">{titleEn}</span>
          <span className="hidden text-black/35 sm:inline"> · </span>
          <span
            className={`mt-1 block text-[15px] font-normal normal-case tracking-normal sm:mt-0 sm:inline md:text-base ${cnHover}`}
          >
            {titleZh}
          </span>
        </h3>
        {children}
      </div>
    </div>
  );
}

export function LoeweMarketingPageClient() {
  return (
    <div className="min-h-screen bg-[#B2C2A2] text-black">
      <header className="sticky top-0 z-50 border-b border-black/10 bg-[#B2C2A2]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-none items-center justify-between px-4 py-4 sm:px-6 md:px-10">
          <Link
            href="/"
            className="text-sm font-medium text-black/55 transition-colors hover:text-black"
          >
            ← Back
          </Link>
          <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-black/40">
            LOEWE
          </span>
        </div>
      </header>

      {/* Hero */}
      <section
        className="relative min-h-[min(100dvh,920px)] overflow-hidden pb-14 pt-6 md:pb-20 md:pt-7"
        style={{ backgroundColor: SAGE }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-[1] flex flex-col gap-4 md:gap-5 lg:gap-6">
          {/* Top bar — logo + series */}
          <div className="flex flex-col justify-between gap-4 px-4 sm:px-6 md:flex-row md:items-start md:gap-8 md:px-10">
            <div className="inline-block w-fit shrink-0">
              <Image
                src="/images/marketing/logo.png"
                alt="LOEWE"
                width={360}
                height={120}
                className="h-auto w-[min(72vw,280px)] object-contain object-left md:w-[min(320px,38vw)]"
                priority
              />
            </div>
            <div className="text-left md:pt-1 md:text-right">
              <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-black md:text-xs">
                ART COLLECTION
              </p>
              <p className={`mt-1.5 text-xs text-black/45 ${cnHover}`}>艺术系列</p>
            </div>
          </div>

          {/* White card + tagline + icon — pulled up toward logo; icon bleeds further right */}
          <div className="-mt-2 flex -translate-y-[30px] flex-col items-stretch gap-8 md:-mt-5 md:flex-row md:items-center md:gap-6 lg:-mt-6 lg:gap-8">
            {/* Left: white card flush left; tagline sits BELOW and right-aligned to card */}
            <div className="w-full shrink-0 md:max-w-[min(100%,28rem)] md:flex-1 lg:max-w-xl">
              <div className="rounded-sm rounded-r-[1.75rem] bg-white py-10 pl-8 pr-10 shadow-[0_32px_80px_rgba(0,0,0,0.16),0_12px_28px_rgba(0,0,0,0.08)] md:rounded-r-[2rem] md:py-12 md:pl-10 md:pr-12 lg:pl-12 lg:pr-14">
                <p className="text-left text-2xl font-light tracking-wide text-black md:text-3xl [font-family:var(--font-cormorant),serif]">
                  The Scented Realm
                </p>
                <p
                  className="mt-5 text-left text-2xl font-normal text-black md:text-[1.85rem] md:leading-snug"
                  style={{
                    fontFamily:
                      "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
                  }}
                >
                  香隐逸境
                </p>
              </div>

              <div className="mt-5 w-full pr-6 text-right md:pr-10 lg:pr-14">
                <p className="text-sm font-light leading-snug text-black md:text-base">
                  A New Interpretation of Traditional Constructive Aesthetics
                </p>
                <p className={`mt-1.5 text-sm leading-relaxed md:text-base ${cnHover}`}>
                  —全新诠释传统构造美学
                </p>
              </div>
            </div>

            {/* Right: icon — nudged right so ~20–40px bleeds past viewport (section clips) */}
            <div className="flex min-w-0 flex-1 flex-col items-stretch px-0 sm:px-2 md:items-center md:justify-end md:pr-0">
              <div className="mx-auto flex w-full max-w-[min(92vw,520px)] shrink-0 translate-x-[clamp(60px,8vw,128px)] justify-center md:mx-0 md:max-w-[min(560px,46vw)] lg:max-w-[min(640px,42vw)]">
                <Image
                  src="/images/marketing/icon.png"
                  alt=""
                  width={800}
                  height={800}
                  className="h-auto w-full object-contain opacity-95"
                  priority
                  sizes="(max-width: 768px) 92vw, (max-width: 1280px) 46vw, 640px"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SWOT — pulled up with hero block; quadrant hover = white lift at bottom */}
      <section className="-translate-y-[30px] border-t border-black/10 px-6 py-16 md:px-12 md:py-24 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 md:mb-14">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-black/70">
              <span className="text-black">Preliminary Analysis</span>
              <span className="text-black/35"> / </span>
              <span className={`${cnHover} normal-case`}>前期分析</span>
            </p>
            <h2 className="mt-4 flex flex-col gap-1 text-2xl font-semibold tracking-tight text-black sm:flex-row sm:items-baseline sm:gap-3 md:text-3xl [font-family:var(--font-cormorant),serif]">
              <span>SWOT Analysis</span>
              <span className={`text-lg font-normal text-black/45 md:text-xl ${cnHover}`}>
                SWOT分析
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-dashed border-black/30 bg-black/20 md:grid-cols-2">
            <Quadrant titleEn="STRENGTHS" titleZh="优势">
              <BulletList items={STRENGTHS} />
            </Quadrant>
            <Quadrant titleEn="WEAKNESSES" titleZh="劣势">
              <BulletList items={WEAKNESSES} />
            </Quadrant>
            <Quadrant titleEn="OPPORTUNITIES" titleZh="机会">
              <BulletList items={OPPORTUNITIES} />
            </Quadrant>
            <Quadrant titleEn="THREATS" titleZh="威胁">
              <BulletList items={THREATS} />
            </Quadrant>
          </div>
        </div>
      </section>

      {/* Product analysis — bilingual left / p3 right */}
      <section className="border-t border-black/10 bg-[#B2C2A2] px-6 py-16 md:px-12 md:py-24 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 md:mb-12">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-black/70">
              <span className="text-black">Preliminary Analysis</span>
              <span className="text-black/35"> / </span>
              <span className={`${cnHover} normal-case`}>前期分析</span>
            </p>
            <h2 className="mt-4 flex flex-col gap-1 text-2xl font-semibold tracking-tight text-black sm:flex-row sm:items-baseline sm:gap-3 md:text-3xl [font-family:var(--font-cormorant),serif]">
              <span>Product Analysis</span>
              <span className={`text-lg font-normal text-black/45 md:text-xl ${cnHover}`}>
                产品分析
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-10 lg:gap-14">
            <div className="border border-[#5c3d7a] bg-[#c4d0b6]/40 p-6 md:p-8">
              <div className="space-y-8 text-left">
                <div className="space-y-2">
                  <p
                    lang="en"
                    className="text-sm font-normal leading-relaxed text-black md:text-[15px]"
                  >
                    <span className="font-semibold">Scent: </span>
                    Loewe&apos;s home fragrance lines are often{" "}
                    <strong>plant-inspired</strong>, built around{" "}
                    <strong>pure</strong>, <strong>natural notes</strong>—
                    <strong>orange blossom</strong>, <strong>basil</strong>,{" "}
                    <strong>rosemary</strong>, <strong>juniper</strong>
                    —creating a pleasant, relaxing atmosphere.
                  </p>
                  <p
                    lang="zh-Hans"
                    className={`text-sm leading-relaxed text-black/90 md:text-[15px] ${cnHover}`}
                  >
                    <span className="font-semibold">香调：</span>
                    罗意威香薰系列的香味常以
                    <strong>植物为灵感源泉</strong>
                    ，主打
                    <strong>纯粹、自然的气息</strong>
                    ，如
                    <strong>橙花、罗勒、迷迭香、杜松</strong>
                    等，构建出令人愉悦、放松的氛围。
                  </p>
                </div>

                <div className="space-y-2">
                  <p
                    lang="en"
                    className="text-sm font-normal leading-relaxed text-black md:text-[15px]"
                  >
                    <span className="font-semibold">Bottle: </span>
                    Bottles typically use{" "}
                    <strong>high-quality glass or ceramic</strong>, with a
                    refined hand-feel. They combine{" "}
                    <strong>sculptural, aesthetic design</strong>, often in{" "}
                    <strong>minimal geometric forms</strong>, expressing a fusion
                    of <strong>nature and modern design</strong>—fresh,
                    natural beauty aligned with urban life.
                  </p>
                  <p
                    lang="zh-Hans"
                    className={`text-sm leading-relaxed text-black/90 md:text-[15px] ${cnHover}`}
                  >
                    <span className="font-semibold">瓶身：</span>
                    罗意威香薰系列瓶身通常采用
                    <strong>优质玻璃或陶瓷材质</strong>
                    ，手感细腻，还结合了
                    <strong>雕塑般的美学设计</strong>
                    ，瓶身常以
                    <strong>极简的几何形态</strong>
                    呈现，传递
                    <strong>自然与现代设计</strong>
                    的融合理念，传递出一种清新自然与都市生活相结合的美感。
                  </p>
                </div>

                <div className="space-y-2">
                  <p
                    lang="en"
                    className="text-sm font-normal leading-relaxed text-black md:text-[15px]"
                  >
                    <span className="font-semibold">Packaging: </span>
                    Packaging reflects the brand&apos;s craft standards: the
                    botanical source of each scent leads the visual story,
                    paired with vivid color. Design emphasizes sustainability—
                    contemporary, fashionable, and aligned with today&apos;s
                    consumers.
                  </p>
                  <p
                    lang="zh-Hans"
                    className={`text-sm leading-relaxed text-black/90 md:text-[15px] ${cnHover}`}
                  >
                    <span className="font-semibold">外包装：</span>
                    罗意威香薰系列的包装秉承了品牌精湛的工艺标准。外包装以香调植物本体为主，搭配鲜明颜色，包装设计注重环保性与可持续性，既时尚又符合当代消费趋势。
                  </p>
                </div>
              </div>
            </div>

            <div className="flex w-full justify-center md:justify-end">
              <Image
                src="/images/marketing/p3.jpg"
                alt="LOEWE home fragrance candles grid"
                width={1080}
                height={1080}
                className="h-auto w-full max-w-full rounded-sm object-contain md:max-w-[min(100%,520px)] lg:max-w-[min(100%,600px)]"
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 600px"
              />
            </div>
          </div>
        </div>
      </section>

      <LoeweCompetitorAnalysis />

      <LoeweMarketAnalysis />

      <LoeweUserPersonas />

      <LoeweMarketingProposal />

      <MarketingRoadmap roadmapId="marketing-roadmap-1" />

      <LoeweCreativeStageOne />

      <MarketingRoadmap
        roadmapId="marketing-roadmap-2"
        defaultFocusIndex={1}
        showHeading={false}
      />

      <LoeweCreativeStageTwo />

      <MarketingRoadmap
        roadmapId="marketing-roadmap-3"
        defaultFocusIndex={2}
        showHeading={false}
      />

      <LoeweCreativeStageThree />

      <LoeweMediaStrategySection />
    </div>
  );
}
