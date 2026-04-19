"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const MINT = "#B2C2A2";
const INK = "#00332E";
/** Unified deep green for campaign matrix (01–03) */
const CAMPAIGN_GREEN = INK;

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

/** Soft vertical strip suggesting a gallery canvas / oil-painting frame edge */
function GalleryLeftEdge() {
  return (
    <div
      className="pointer-events-none absolute bottom-0 left-0 top-0 z-[0] w-[min(18px,4vw)] md:w-6 lg:w-8"
      aria-hidden
    >
      <div
        className="h-full w-full opacity-90"
        style={{
          background:
            "linear-gradient(90deg, rgba(212,208,196,0.55) 0%, rgba(178,194,162,0.35) 38%, rgba(178,194,162,0) 100%)",
        }}
      />
      <div
        className="absolute inset-y-8 left-1 w-px bg-black/[0.06]"
        style={{ boxShadow: "1px 0 0 rgba(255,255,255,0.35)" }}
      />
    </div>
  );
}

type LineRow = {
  leadEn?: string;
  leadZh?: string;
  bodyEn: string;
  bodyZh: string;
};

type CampaignItem = {
  num: string;
  titleEn: string;
  titleZh: string;
  lines: LineRow[];
};

const CAMPAIGNS: CampaignItem[] = [
  {
    num: "01",
    titleEn: "Immersive Flash Promo",
    titleZh: "主题快闪宣传",
    lines: [
      {
        leadEn: "Theme: ",
        leadZh: "主题：",
        bodyEn: '"The Scented Realm · LOEWE Garden Elegance"',
        bodyZh: "「香隐逸境 · LOEWE园林雅韵」",
      },
      {
        leadEn: "Social Media: ",
        bodyEn: "Weibo hashtag campaign & UGC secondary dissemination.",
        bodyZh: "微博话题讨论与用户生成内容二次传播。",
      },
      {
        leadEn: "Incentives: ",
        leadZh: "抽奖互动：",
        bodyEn: "Lucky draws for Suzhou Museum tickets and fragrance samples.",
        bodyZh: "苏州博物馆门票及香水小样。",
      },
    ],
  },
  {
    num: "02",
    titleEn: "Interactive H5: Digital Lattice Heritage",
    titleZh: "交互式H5：园林纹样介绍",
    lines: [
      {
        bodyEn: "A digital reimagining of traditional Suzhou garden lattice patterns.",
        bodyZh: "以数字化的方式重现苏州园林的传统纹样。",
      },
    ],
  },
  {
    num: "03",
    titleEn: "Step-by-Step Scenery: Concept Video",
    titleZh: "一步易景：概念视频呈现",
    lines: [
      {
        bodyEn: "Cinematic visual journey exploring the fluid beauty of gardens.",
        bodyZh: "通过影视镜头探索园林流动的空间美学。",
      },
    ],
  },
  {
    num: "04",
    titleEn: "Influencer Marketing",
    titleZh: "小红书 KOL 推广",
    lines: [
      {
        bodyEn:
          "Targeted collaborations with niche lifestyle and art influencers.",
        bodyZh: "针对性选择生活方式与艺术类KOL进行深度推广。",
      },
    ],
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 6 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] },
  },
};

type NarrativeCard = {
  titleEn: string;
  titleZh: string;
  bodyEn: string;
  bodyZh: string;
};

const NARRATIVE_CARDS: NarrativeCard[] = [
  {
    titleEn: "Scene I: Study with Me",
    titleZh: "场景一：沉浸式学习",
    bodyEn:
      "Contextual Harmony: The fragrance aligns with a warm, focused learning environment. By creating an authentic, tranquil atmosphere, it naturally piques the audience's interest.",
    bodyZh:
      "情境相契合：香薰产品与温馨、放松的学习环境相契合。通过在视频中营造确切的静谧场景，吸引观众对产品的直观兴趣。",
  },
  {
    titleEn: "Scene II: Solo Living Vlog",
    titleZh: "场景二：独居愈疗",
    bodyEn:
      'Healing & Relaxation: Showcasing candles in personal spaces emphasizes their soothing properties, highlighting the role of scent in creating a home "sanctuary."',
    bodyZh:
      "疗愈与松弛：在独居生活展示中体现香薰的疗愈感。通过展示个人化空间，突出香薰作为营造居家“避风港”核心元素的作用。",
  },
];

const XHS_IMAGES = [
  "/images/marketing/xhs1.png",
  "/images/marketing/xhs2.png",
  "/images/marketing/xhs3.png",
  "/images/marketing/xhs4.png",
  "/images/marketing/xhs5.jpg",
  "/images/marketing/xhs6.jpg",
];

export function LoeweCreativeStageTwo() {
  const listRef = useRef<HTMLDivElement>(null);
  const listInView = useInView(listRef, { once: true, amount: 0.12 });

  return (
    <section
      className="relative overflow-hidden border-t border-black/10 py-20 md:py-28"
      style={{ backgroundColor: MINT }}
    >
      <NoiseOverlay />
      <GalleryLeftEdge />

      <div className="relative z-[1] mx-auto max-w-7xl pl-6 pr-4 md:pl-12 md:pr-8 lg:pl-20 lg:pr-5 xl:pr-6">
        <header className="mb-12 md:mb-16 lg:mb-20">
          <p
            className="mb-4 text-xs font-medium uppercase tracking-[0.22em] text-black/50 md:mb-5"
            style={{ fontFamily: "var(--font-cormorant), serif" }}
          >
            创意执行：阶段二
          </p>
          <h2 className="mb-6 flex flex-col gap-2 text-2xl font-semibold tracking-[0.06em] text-black sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-3 md:text-3xl">
            <span
              className="uppercase"
              style={{ fontFamily: "var(--font-cormorant), serif" }}
            >
              PHASE II: THE DAWNLIT PATH
            </span>
            <span className="hidden text-black/25 sm:inline">/</span>
            <span
              className="text-[1.35rem] font-normal tracking-normal md:text-2xl"
              style={{
                fontFamily:
                  "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
              }}
            >
              阶段二：晓径
            </span>
          </h2>
          <h3
            className="max-w-3xl text-lg font-semibold leading-snug text-black md:text-xl"
            style={{ fontFamily: "var(--font-cormorant), serif" }}
          >
            <span className="block sm:inline">
              Online Campaigns: Digital Immersion
            </span>
            <span className="mx-0 block text-black/35 sm:mx-2 sm:inline">
              /
            </span>
            <span
              className="mt-1 block font-normal sm:mt-0 sm:inline"
              style={{
                fontFamily:
                  "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
              }}
            >
              线上活动：数字化沉浸
            </span>
          </h3>
        </header>

        {/* Right column ~1.8× prior width; row height follows left copy; video vertically centered */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_3.6fr] lg:items-stretch lg:gap-14 xl:gap-20">
          {/* Left: interactive matrix (nudged up 10px vs grid) */}
          <motion.div
            ref={listRef}
            className="min-w-0 -translate-y-[10px] lg:min-h-0"
            variants={containerVariants}
            initial="hidden"
            animate={listInView ? "show" : "hidden"}
          >
            {CAMPAIGNS.map((campaign, idx) => (
              <motion.article
                key={campaign.num}
                variants={itemVariants}
                className={
                  idx < CAMPAIGNS.length - 1 ? "border-b pb-10 md:pb-12" : ""
                }
                style={
                  idx < CAMPAIGNS.length - 1
                    ? { borderColor: `${CAMPAIGN_GREEN}14` }
                    : undefined
                }
              >
                <div className="flex gap-4 md:gap-6">
                  <span
                    className="mt-0.5 shrink-0 font-[family-name:var(--font-cormorant),serif] text-sm tabular-nums tracking-tight md:text-base"
                    style={{ color: CAMPAIGN_GREEN }}
                    aria-hidden
                  >
                    {campaign.num}
                  </span>
                  <div className="min-w-0 flex-1 space-y-4">
                    <h4 className="text-base font-semibold leading-snug tracking-tight md:text-[1.05rem]">
                      <span
                        className="block sm:inline"
                        style={{
                          color: CAMPAIGN_GREEN,
                          fontFamily: "var(--font-cormorant), serif",
                        }}
                      >
                        {campaign.titleEn}
                      </span>
                      <span
                        className="mx-0 block sm:mx-2 sm:inline"
                        style={{ color: CAMPAIGN_GREEN }}
                      >
                        /
                      </span>
                      <span
                        className="mt-1 block font-normal sm:mt-0 sm:inline"
                        style={{
                          color: CAMPAIGN_GREEN,
                          fontFamily:
                            "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
                        }}
                      >
                        {campaign.titleZh}
                      </span>
                    </h4>
                    <ul className="space-y-3">
                      {campaign.lines.map((line) => (
                        <li
                          key={`${campaign.num}-${line.bodyEn.slice(0, 24)}`}
                          className="space-y-1.5"
                        >
                          <p
                            className="text-[0.9rem] leading-relaxed md:text-[0.95rem]"
                            style={{
                              color: CAMPAIGN_GREEN,
                              fontFamily: "var(--font-cormorant), serif",
                            }}
                          >
                            {line.leadEn
                              ? `${line.leadEn}${line.bodyEn}`
                              : line.bodyEn}
                          </p>
                          <p
                            className="text-[0.88rem] leading-relaxed md:text-[0.92rem]"
                            style={{
                              color: CAMPAIGN_GREEN,
                              fontFamily:
                                "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
                            }}
                          >
                            {line.leadZh
                              ? `${line.leadZh}${line.bodyZh}`
                              : line.bodyZh}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>

          {/* Right: video intrinsic aspect (scale only, no crop); vertically centered vs text column */}
          <div className="flex min-w-0 -translate-y-[60px] flex-col items-stretch justify-center lg:h-full lg:min-h-0">
            <div
              className="relative w-full overflow-hidden rounded-[8px] shadow-[0_20px_56px_-18px_rgba(0,51,46,0.22)]"
            >
              <video
                className="block h-auto w-full max-w-full"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                aria-label="Concept video — garden atmosphere"
              >
                <source src="/video/v1.MP4" type="video/mp4" />
              </video>
              <p
                className="pointer-events-none absolute bottom-1.5 right-2 z-[1] text-[10px] font-extralight leading-tight tracking-wide text-white/90 [text-shadow:0_1px_3px_rgba(0,0,0,0.55)]"
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                }}
              >
                Reference: @HZK via Little Red Book.
              </p>
            </div>
          </div>
        </div>

        {/* KOL block: keep unified mint background like the whole section */}
        <div className="mt-10">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.15fr_2.85fr] lg:gap-8 xl:gap-10">
          <div className="space-y-5">
            {NARRATIVE_CARDS.map((card) => (
              <article
                key={card.titleEn}
                className="rounded-2xl border border-white/30 bg-white/60 p-5 shadow-[0_14px_40px_-22px_rgba(0,51,46,0.26)] backdrop-blur-[12px] md:p-6"
              >
                <h4 className="mb-3 text-[1.02rem] leading-snug text-[#143d34] md:text-[1.08rem]">
                  <span
                    className="block sm:inline"
                    style={{ fontFamily: "var(--font-cormorant), serif" }}
                  >
                    {card.titleEn}
                  </span>
                  <span className="mx-0 block text-[#143d34]/50 sm:mx-2 sm:inline">
                    /
                  </span>
                  <span
                    className="mt-1 block sm:mt-0 sm:inline"
                    style={{
                      fontFamily:
                        "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
                    }}
                  >
                    {card.titleZh}
                  </span>
                </h4>
                <p
                  className="mb-2 text-[0.9rem] leading-[1.8] text-[#143d34] md:text-[0.95rem]"
                  style={{ fontFamily: "var(--font-cormorant), serif" }}
                >
                  {card.bodyEn}
                </p>
                <p
                  className="text-[0.88rem] leading-[1.8] text-[#143d34] md:text-[0.92rem]"
                  style={{
                    fontFamily:
                      "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
                  }}
                >
                  {card.bodyZh}
                </p>
              </article>
            ))}
          </div>

          <div className="relative overflow-hidden rounded-2xl lg:-mt-24 lg:h-[820px]">
            <div
              className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-14"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(178,194,162,0.95) 0%, rgba(178,194,162,0) 100%)",
              }}
            />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-16"
              style={{
                background:
                  "linear-gradient(to top, rgba(178,194,162,0.96) 0%, rgba(178,194,162,0) 100%)",
              }}
            />

            <div className="grid h-[520px] grid-cols-2 gap-4 md:h-[560px] lg:h-full">
              {[XHS_IMAGES.slice(0, 3), XHS_IMAGES.slice(3, 6)].map(
                (ordered, colIdx) => {
                  const doubled = [...ordered, ...ordered];
                  const colClass =
                    colIdx === 0 ? "kol-track-up-slow" : "kol-track-down-mid";

                  return (
                    <div key={`kol-col-${colIdx}`} className="overflow-hidden">
                      <div className={`flex flex-col gap-3 ${colClass}`}>
                        {doubled.map((src, i) => (
                          <div
                            key={`${src}-${i}`}
                            className="mx-auto flex w-fit max-w-full flex-col items-center"
                          >
                            <figure className="h-[276px] w-fit max-w-full overflow-hidden rounded-xl md:h-[292px] lg:h-[308px]">
                              <img
                                src={src}
                                alt={`KOL content tile ${i + 1}`}
                                className="block h-full w-auto max-w-full object-contain object-center sepia-[0.05]"
                                loading="lazy"
                              />
                            </figure>
                            {i < doubled.length - 1 ? (
                              <div className="mt-3 h-px w-full bg-[#00332E]/16" />
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes kol-up {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(calc(-50% - 6px));
          }
        }

        @keyframes kol-down {
          from {
            transform: translateY(calc(-50% - 6px));
          }
          to {
            transform: translateY(0);
          }
        }

        .kol-track-up-slow {
          animation: kol-up 30s linear infinite;
          will-change: transform;
        }

        .kol-track-down-mid {
          animation: kol-down 31.5s linear infinite;
          will-change: transform;
        }

      `}</style>
    </section>
  );
}
