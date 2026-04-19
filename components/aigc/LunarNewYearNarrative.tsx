"use client";

import { EthnicAccordionGrid } from "@/components/aigc/EthnicAccordionGrid";

const PAGE_GUTTER = "px-[clamp(15px,2.8vw,30px)]";

function SectionTitle({
  id,
  zh,
  en,
  align = "left",
}: {
  id: string;
  zh: string;
  en: string;
  align?: "left" | "center";
}) {
  const alignCls = align === "center" ? "text-center" : "text-left";
  return (
    <div className={`mb-6 md:mb-8 ${alignCls}`}>
      <h2
        id={id}
        lang="zh-Hans"
        className="text-xl font-semibold tracking-wide text-white md:text-2xl"
      >
        {zh}
      </h2>
      <p className="mt-1 text-sm font-medium uppercase tracking-[0.18em] text-white/45 md:text-[0.85rem]">
        {en}
      </p>
    </div>
  );
}

export function LunarNewYearNarrative() {
  return (
    <div
      className={`border-t border-white/10 bg-black ${PAGE_GUTTER} py-12 sm:py-14 md:py-16`}
    >
      <div className="mx-auto max-w-[1100px] space-y-14 md:space-y-20 lg:max-w-[1200px]">
        {/* 项目定位 */}
        <section aria-labelledby="lunar-positioning">
          <SectionTitle
            id="lunar-positioning"
            zh="项目定位"
            en="Project Positioning"
          />
          <div className="space-y-6 text-[0.95rem] leading-[1.85] md:text-base md:leading-[1.9]">
            <p lang="zh-Hans" className="text-white/88">
              本项目是专为阿里巴巴「新春音浪」AIGC
              大赛倾力打造的贺岁宣传片。通过深度整合 Midjourney、Pika、Runway、PixVerse
              等前沿 AIGC
              工具，探索人工智能在多元文化叙事中的表达边界。
            </p>
            <p
              lang="en"
              className="border-t border-white/10 pt-6 text-white/65 [font-family:var(--font-geist-sans),system-ui,sans-serif]"
            >
              Specially crafted for Alibaba&apos;s &quot;Lunar New Year
              Echoes&quot; AIGC Competition, this festive campaign explores the
              boundaries of cultural storytelling by deeply integrating
              cutting-edge AI tools like Midjourney, Pika, PixVerse, and
              Runway.
            </p>
          </div>
        </section>

        {/* 数字补完与环保愿景 */}
        <section aria-labelledby="lunar-concept">
          <SectionTitle
            id="lunar-concept"
            zh="数字补完与环保愿景"
            en="The Core Concept: Digital Fulfillment & Eco-Vision"
          />
          <div className="space-y-6 text-[0.95rem] leading-[1.85] md:text-base md:leading-[1.9]">
            <p lang="zh-Hans" className="text-white/88">
              以数字之光，补现实之憾。针对国内一线城市严禁烟花燃放的政策，我利用
              AIGC
              技术在虚拟空间中复现了北京、上海、深圳地标上空的绚烂烟火。这不仅在视觉上重塑了传统年味，更以一种零碳排放、可持续的方式，实现了科技对传统习俗的温柔守护，兼具美学价值与环保意义。
            </p>
            <p
              lang="en"
              className="border-t border-white/10 pt-6 text-white/65 [font-family:var(--font-geist-sans),system-ui,sans-serif]"
            >
              Mending reality with digital light. In response to strict
              firework bans in Tier-1 cities, I utilized AIGC to recreate
              brilliant pyrotechnics over the landmarks of Beijing, Shanghai,
              and Shenzhen. This not only restores the visual essence of the
              Lunar New Year but also preserves cultural heritage in a
              zero-carbon, sustainable manner—bridging the gap between
              technological aesthetics and eco-consciousness.
            </p>
          </div>
        </section>

        {/* 民族共庆与文化符号 — 文案居中，下方居中九宫格 */}
        <section aria-labelledby="lunar-ethnic" className="text-center">
          <SectionTitle
            id="lunar-ethnic"
            zh="民族共庆与文化符号"
            en="Ethnic Diversity & Cultural Symbols"
            align="center"
          />
          <div className="mx-auto max-w-3xl space-y-6 text-[0.95rem] leading-[1.85] md:text-base md:leading-[1.9]">
            <p lang="zh-Hans" className="text-white/88">
              影片全方位涵盖了包括藏族、蒙古族、苗族在内的多民族欢聚情景，并细致刻画了对联、红包、年夜饭等文化符号，旨在向世界传递中国春节独有的情感温度。
            </p>
            <p
              lang="en"
              className="border-t border-white/10 pt-6 text-white/65 [font-family:var(--font-geist-sans),system-ui,sans-serif]"
            >
              The film captures a diverse tapestry of celebrations across
              ethnic groups including Tibetan, Mongolian, and Miao peoples. By
              meticulously portraying symbols like spring couplets, red
              envelopes, and reunion dinners, it communicates the unique
              emotional warmth of Chinese heritage to a global audience.
            </p>
          </div>

          <div className="mx-auto mt-10 w-full md:mt-12">
            <div className="rounded-xl border border-white/10 bg-neutral-950/40 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] sm:p-4">
              <EthnicAccordionGrid />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
