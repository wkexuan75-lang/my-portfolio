"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const MINT = "#B2C2A2";
const INK = "#00332E";
const FOREST = "#5A946E";

const noiseStyle = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
  backgroundAttachment: "fixed" as const,
  backgroundSize: "256px 256px",
};

function NoiseOverlay() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.11]"
      style={noiseStyle}
      aria-hidden
    />
  );
}

function CardIcon({ kind }: { kind: "channel" | "strategy" | "schedule" }) {
  if (kind === "channel") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#5A946E]" fill="none">
        <rect x="3.5" y="5.5" width="17" height="13" rx="2.2" stroke="currentColor" strokeWidth="1.3" />
        <path d="M7 9.5h10M7 12h6.5M7 14.5h8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    );
  }
  if (kind === "strategy") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#5A946E]" fill="none">
        <path d="M12 20.5s6-3.7 6-9.2V5.5L12 3.5 6 5.5v5.8c0 5.5 6 9.2 6 9.2Z" stroke="currentColor" strokeWidth="1.3" />
        <circle cx="12" cy="10.5" r="2.3" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#5A946E]" fill="none">
      <rect x="4.5" y="5.5" width="15" height="14" rx="2.1" stroke="currentColor" strokeWidth="1.3" />
      <path d="M8 3.8v3.1M16 3.8v3.1M8 10.2h8M8 13.6h4.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

type StrategyCard = {
  key: string;
  icon: "channel" | "strategy" | "schedule";
  titleEn: string;
  titleZh: string;
  points: { en: string; zh: string }[];
};

const STRATEGY_CARDS: StrategyCard[] = [
  {
    key: "channel",
    icon: "channel",
    titleEn: "Channel Selection",
    titleZh: "媒介选择",
    points: [
      {
        en: "Social Media / Network Media: Use platforms like Xiaohongshu and Weibo with strong fashion vibes to increase brand awareness.",
        zh: "Social Media / 网络媒体：通过小红书、微博等时尚氛围感强的社交媒体平台进行传播，提高知名度。",
      },
      {
        en: "Shopping Platforms: Splash screen ads and precision targeting.",
        zh: "Shopping Platforms / 购物平台：开屏广告与精准投放。",
      },
    ],
  },
  {
    key: "approach",
    icon: "strategy",
    titleEn: "Strategic Approach",
    titleZh: "媒介策略",
    points: [
      {
        en: "Regional Focus: Concentrated advertising in key geographical areas.",
        zh: "Regional Focus / 重点区域集中投放：重点区域集中投放。",
      },
      {
        en: "Multi-Media Synergy: A powerful combination of diverse media channels.",
        zh: "Multi-Media Synergy / 多媒体混合搭配：多种媒体混合搭配，形成传播有力组合拳。",
      },
    ],
  },
  {
    key: "timing",
    icon: "schedule",
    titleEn: "Scheduling Logic",
    titleZh: "排期逻辑",
    points: [
      {
        en: "Peak Periods: Strategic deployment during public holidays and vacation seasons to maximize offline event impact.",
        zh: "Peak Periods / 人流高峰期：法定节假日及寒暑假，苏州园林人流高峰期，更易促进线下活动开展。",
      },
    ],
  },
];

type Phase = {
  key: string;
  labelEn: string;
  labelZh: string;
  span: string;
};

const PHASES: Phase[] = [
  {
    key: "warmup",
    labelEn: "Warm-up Phase",
    labelZh: "预热期",
    span: "1-2 Weeks",
  },
  {
    key: "growth",
    labelEn: "Growth Phase",
    labelZh: "增长期",
    span: "1-2 Weeks",
  },
  {
    key: "peak",
    labelEn: "Peak Phase",
    labelZh: "爆发期",
    span: "1 Week",
  },
  {
    key: "tail",
    labelEn: "Long-tail Phase",
    labelZh: "长尾期",
    span: "2-4 Weeks",
  },
];

const PHASE_COLORS: Record<string, string> = {
  warmup: "rgba(90,148,110,0.9)",
  growth: "rgba(92,173,168,0.96)",
  peak: "rgba(122,147,137,0.96)",
  tail: "rgba(142,147,120,0.92)",
};

type TaskBar = {
  key: string;
  phase: keyof typeof PHASE_COLORS;
  en: string;
  zh: string;
  start: number;
  width: number;
  row: number;
  pulse?: boolean;
};

const TASK_BARS: TaskBar[] = [
  {
    key: "topic",
    phase: "warmup",
    en: "Topic Launch",
    zh: "话题发布",
    start: 0,
    width: 18,
    row: 0,
  },
  {
    key: "teaser",
    phase: "warmup",
    en: "Teaser Video Release",
    zh: "预热视频发布",
    start: 0,
    width: 20,
    row: 1,
  },
  {
    key: "h5",
    phase: "warmup",
    en: "Interactive H5",
    zh: "H5互动",
    start: 0,
    width: 36,
    row: 2,
  },
  {
    key: "launch",
    phase: "growth",
    en: "New Product Launch & Promo",
    zh: "新品发布及宣传",
    start: 20,
    width: 58,
    row: 3,
  },
  {
    key: "kol",
    phase: "growth",
    en: "KOL & Hashtag Campaign",
    zh: "KOL推广/话题推广",
    start: 28,
    width: 48,
    row: 4,
    pulse: true,
  },
  {
    key: "offline",
    phase: "peak",
    en: '"The Scented Realm" Offline Event',
    zh: "“香隐逸境”线下活动",
    start: 38,
    width: 38,
    row: 5,
  },
  {
    key: "draw",
    phase: "tail",
    en: "Museum Tickets & Sample Draw",
    zh: "苏州博物馆门票/香水小样抽奖",
    start: 64,
    width: 36,
    row: 6,
  },
];

export function LoeweMediaStrategySection() {
  const ganttRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ganttRef, { once: true, amount: 0.26 });

  return (
    <section
      className="relative overflow-hidden border-t border-black/10 py-20 md:py-28"
      style={{ backgroundColor: MINT }}
    >
      <NoiseOverlay />

      <div className="relative z-[1] mx-auto max-w-7xl px-6 md:px-12 lg:px-20">
        <header className="mb-12 md:mb-16">
          <h2 className="mb-3 flex flex-col gap-2 text-2xl font-semibold tracking-tight text-black sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-3 md:text-3xl">
            <span style={{ fontFamily: "var(--font-cormorant), serif" }}>
              Media Strategy & Proposal
            </span>
            <span className="hidden text-black/25 sm:inline">/</span>
            <span
              className="text-[1.3rem] font-normal md:text-2xl"
              style={{
                fontFamily:
                  "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
              }}
            >
              媒介策略与提案
            </span>
          </h2>
        </header>

        <div className="mb-14 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {STRATEGY_CARDS.map((card) => (
            <article
              key={card.key}
              className="rounded-2xl border border-white/35 bg-white/44 p-5 backdrop-blur-[5px] md:p-6"
            >
              <div className="mb-4 flex items-center gap-2.5">
                <CardIcon kind={card.icon} />
                <h3 className="text-[1.02rem] font-semibold leading-snug text-[#00332E] md:text-[1.08rem]">
                  <span
                    className="block sm:inline"
                    style={{ fontFamily: "var(--font-cormorant), serif" }}
                  >
                    {card.titleEn}
                  </span>
                  <span className="mx-0 block text-[#00332E]/45 sm:mx-1.5 sm:inline">
                    /
                  </span>
                  <span
                    className="mt-0.5 block font-normal sm:mt-0 sm:inline"
                    style={{
                      fontFamily:
                        "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
                    }}
                  >
                    {card.titleZh}
                  </span>
                </h3>
              </div>

              <ul className="space-y-4">
                {card.points.map((point) => (
                  <li key={point.en} className="space-y-1.5">
                    <p
                      className="text-[0.9rem] leading-[1.8] text-[#00332E] md:text-[0.94rem]"
                      style={{ fontFamily: "var(--font-cormorant), serif" }}
                    >
                      {point.en}
                    </p>
                    <p
                      className="text-[0.88rem] leading-[1.8] text-[#00332E] md:text-[0.92rem]"
                      style={{
                        fontFamily:
                          "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
                      }}
                    >
                      {point.zh}
                    </p>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div ref={ganttRef}>
          <header className="mb-6">
            <h3 className="text-xl font-semibold text-[#00332E] md:text-2xl">
              <span style={{ fontFamily: "var(--font-cormorant), serif" }}>
                Media Schedule
              </span>
              <span className="mx-2 text-[#00332E]/35">/</span>
              <span
                className="font-normal"
                style={{
                  fontFamily:
                    "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
                }}
              >
                媒介排期表
              </span>
            </h3>
          </header>

          <div className="overflow-x-auto pb-2">
            <div className="min-w-[920px] rounded-2xl border border-white/30 bg-white/32 p-6 md:p-8">
              <div className="mb-7 grid grid-cols-4 gap-4">
                {PHASES.map((phase) => (
                  <div key={phase.key}>
                    <p
                      className="text-[11px] uppercase tracking-[0.16em] text-[#00332E]/80"
                      style={{ fontFamily: "var(--font-cormorant), serif" }}
                    >
                      {phase.labelEn}
                    </p>
                    <p
                      className="mt-1 text-[13px] text-[#00332E]/85"
                      style={{
                        fontFamily:
                          "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
                      }}
                    >
                      {phase.labelZh}
                    </p>
                    <p
                      className="mt-1 text-[11px] tracking-[0.08em] text-[#00332E]/58"
                      style={{ fontFamily: "var(--font-cormorant), serif" }}
                    >
                      {phase.span}
                    </p>
                  </div>
                ))}
              </div>

              <div className="relative h-[370px]">
                <div className="absolute left-0 right-0 top-4 h-px bg-[#00332E]/18" />
                {[25, 50, 75].map((cut) => (
                  <div
                    key={`phase-cut-${cut}`}
                    className="absolute top-1 h-6 w-[3px] -translate-x-1/2 rounded-sm bg-[#00332E]/55"
                    style={{ left: `${cut}%` }}
                    aria-hidden
                  />
                ))}

                {TASK_BARS.map((task, idx) => (
                  <motion.div
                    key={task.key}
                    className="absolute flex h-9 items-center rounded-sm px-3"
                    style={{
                      left: `${task.start}%`,
                      top: `${34 + task.row * 42}px`,
                      backgroundColor: PHASE_COLORS[task.phase],
                    }}
                    initial={{ width: 0, opacity: 0.8 }}
                    animate={
                      inView ? { width: `${task.width}%`, opacity: 1 } : { width: 0, opacity: 0.8 }
                    }
                    transition={{
                      duration: 0.85,
                      ease: [0.22, 1, 0.36, 1],
                      delay: idx * 0.1,
                    }}
                  >
                    {task.pulse ? (
                      <span className="mr-2 h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                    ) : null}
                    <span
                      className="whitespace-nowrap text-[12px] text-white/95"
                      style={{
                        fontFamily:
                          "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
                      }}
                    >
                      {task.en} / {task.zh}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <p
            className="mt-3 text-right text-[10px] leading-relaxed text-[#00332E]/55"
            style={{ fontFamily: "var(--font-cormorant), serif" }}
          >
            Image/Strategy Reference: Internal Proposal / 内容参考来源：媒介提案草案。
          </p>
        </div>
      </div>
    </section>
  );
}

