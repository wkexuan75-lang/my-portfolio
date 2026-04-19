"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";

/** Matches LoeweMarketAnalysis / LoeweUserPersonas mint field */
const MINT = "#B2C2A2";
const FOREST = "#5A946E";
const INK = "#00332E";

function NoiseOverlay() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.11]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundAttachment: "fixed",
        backgroundSize: "256px 256px",
      }}
      aria-hidden
    />
  );
}

/** Static narrow arrow — no animation; left-aligned with body text. */
function FlowArrow() {
  return (
    <div className="flex translate-x-[10px] justify-start py-1" aria-hidden>
      <svg width="20" height="28" viewBox="0 0 20 28" className="shrink-0">
        <path
          d="M10 2v18M4 16l6 8 6-8"
          fill="none"
          stroke={INK}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

const enClass =
  "font-[family-name:var(--font-serif)] text-[0.95rem] leading-relaxed text-[#1a1a1a] md:text-base";
const zhClass =
  "font-[family-name:var(--font-song)] text-[0.9rem] leading-relaxed text-[#2a2a2a] md:text-[0.95rem]";

function FlowNode({
  children,
  stepIndex,
  isInView,
  className,
}: {
  children: ReactNode;
  stepIndex: number;
  isInView: boolean;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 12 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
      transition={{
        duration: 0.45,
        delay: stepIndex * 0.11,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

function CapsuleBlock({
  titleEn,
  titleZh,
  bodyEn,
  bodyZh,
  keywordsMode,
  stepIndex,
  isInView,
}: {
  titleEn: string;
  titleZh: string;
  bodyEn: string;
  bodyZh: string;
  keywordsMode?: boolean;
  stepIndex: number;
  isInView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      transition={{
        duration: 0.45,
        delay: 0.55 + stepIndex * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="space-y-2"
    >
      <div
        className="rounded-full px-5 py-2.5 text-center text-white shadow-sm"
        style={{ backgroundColor: FOREST }}
      >
        <span className="block font-[family-name:var(--font-serif)] text-sm font-semibold tracking-wide md:text-base">
          {titleEn}
        </span>
        <span className="mt-0.5 block font-[family-name:var(--font-song)] text-xs font-medium opacity-95 md:text-sm">
          {titleZh}
        </span>
      </div>
      <p
        className={`${enClass} ${keywordsMode ? "tracking-[0.06em]" : ""}`}
      >
        {bodyEn}
      </p>
      <p
        className={`${zhClass} ${keywordsMode ? "tracking-[0.12em]" : ""}`}
      >
        {bodyZh}
      </p>
    </motion.div>
  );
}

export function LoeweMarketingProposal() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-12% 0px" });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-16 md:py-24"
      style={{ backgroundColor: MINT }}
    >
      <NoiseOverlay />

      <div className="relative z-[1] mx-auto max-w-7xl px-6 md:px-12 lg:px-20">
        <header className="mb-12 md:mb-16">
          <h2 className="mb-3 flex flex-col gap-1 text-2xl font-semibold tracking-tight text-black sm:flex-row sm:items-baseline sm:gap-3 md:text-3xl [font-family:var(--font-cormorant),serif]">
            <span>Marketing Proposal</span>
            <span className="text-lg font-normal text-black/45 md:text-xl">
              营销提案
            </span>
          </h2>
        </header>

        {/*
          lg: Path A | Path B | Brand pillars (pillars row-span-2)
          Row 2: summary spans cols 1–2 only (under paths), pillars stay right
          md: A | B, then summary full width, then pillars full width
        */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-x-8 md:gap-y-10 lg:grid-cols-3 lg:items-start lg:gap-x-6 lg:gap-y-8 xl:gap-x-10">
          <div className="min-w-0 lg:col-start-1 lg:row-start-1">
            <p className="mb-3 font-[family-name:var(--font-song)] text-xs font-medium tracking-wide text-[#00332E]/65">
              路径 A
            </p>
            <FlowNode stepIndex={0} isInView={isInView}>
              <p className={enClass}>SWOT Analysis</p>
              <p className={zhClass}>SWOT分析</p>
            </FlowNode>
            <FlowArrow />
            <FlowNode stepIndex={1} isInView={isInView}>
              <p className={enClass}>Limited Usage Scenarios</p>
              <p className={zhClass}>使用场景受限</p>
            </FlowNode>
            <FlowArrow />
            <FlowNode stepIndex={2} isInView={isInView}>
              <p className={`${enClass} font-medium`}>
                Action: Create immersive scenario experiences and enhance
                interactive attributes.
              </p>
              <p className={zhClass}>创造场景体验，增强互动属性。</p>
            </FlowNode>
          </div>

          <div className="min-w-0 lg:col-start-2 lg:row-start-1">
            <p className="mb-3 font-[family-name:var(--font-song)] text-xs font-medium tracking-wide text-[#00332E]/65">
              路径 B
            </p>
            <FlowNode stepIndex={3} isInView={isInView}>
              <p className={enClass}>Consumer Psychology</p>
              <p className={zhClass}>消费者心理</p>
            </FlowNode>
            <FlowArrow />
            <FlowNode stepIndex={4} isInView={isInView}>
              <p className={enClass}>
                Understated fashion &amp; utilitarian features.
              </p>
              <p className={zhClass}>香薰时尚与实用特征不突出</p>
            </FlowNode>
            <FlowArrow />
            <FlowNode stepIndex={5} isInView={isInView}>
              <p className={`${enClass} font-medium`}>
                Action: Emphasize versatile compatibility.
              </p>
              <p className={zhClass}>突出兼容属性。</p>
            </FlowNode>
          </div>

          <FlowNode
            stepIndex={6}
            isInView={isInView}
            className="border-t border-[#00332E]/10 pt-8 md:col-span-2 md:pt-10 lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:pt-8"
          >
            <p className={`${enClass} text-[0.9rem] md:text-[0.95rem]`}>
              Merging Chinese garden aesthetics to break spatial boundaries,
              adding natural aesthetic elements to increase engagement and
              provide a profound brand experience.
            </p>
            <p className={`${zhClass} mt-3`}>
              与融合中式园林艺术构造之美，打破空间界限，增加自然舒适美学元素，提高顾客参与度，给予顾客全新深度体验。
            </p>
          </FlowNode>

          <div className="flex min-w-0 flex-col gap-8 md:col-span-2 lg:col-span-1 lg:col-start-3 lg:row-start-1 lg:row-span-2 lg:pl-1">
            <CapsuleBlock
              titleEn="Brand Mission"
              titleZh="品牌使命"
              bodyEn="Expressing natural beauty through immersive experiences."
              bodyZh="展现体验表达自然美"
              stepIndex={0}
              isInView={isInView}
            />
            <CapsuleBlock
              titleEn="Product Positioning"
              titleZh="产品定位"
              bodyEn="Blending Chinese garden aesthetics to break boundaries, bringing the outdoors in."
              bodyZh="与融合中式园林艺术构造之美，打破空间界限，将园林带入室内。"
              stepIndex={1}
              isInView={isInView}
            />
            <CapsuleBlock
              titleEn="Keywords"
              titleZh="核心关键词"
              bodyEn="Construction Art | Natural Experience | Eco-Aesthetics | Home DIY"
              bodyZh="构造艺术 | 自然体验 | 环保美观 | 居家DIY"
              keywordsMode
              stepIndex={2}
              isInView={isInView}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
