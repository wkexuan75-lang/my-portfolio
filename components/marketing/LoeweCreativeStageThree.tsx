"use client";

import Image from "next/image";

const MINT = "#B2C2A2";
const INK = "#00332E";
const FOREST = "#5A946E";
const DEEP_TEXT = "#001F1B";

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

function BilingualSection({
  titleEn,
  titleZh,
  bodyEn,
  bodyZh,
}: {
  titleEn: string;
  titleZh: string;
  bodyEn: string;
  bodyZh: string;
}) {
  return (
    <section className="space-y-4">
      <h4 className="space-y-2">
        <span
          className="block text-base font-semibold tracking-tight md:text-[1.05rem]"
          style={{ color: DEEP_TEXT, fontFamily: "var(--font-cormorant), serif" }}
        >
          {titleEn}
        </span>
        <span
          className="block text-[0.98rem] font-semibold md:text-[1.02rem]"
          style={{
            color: DEEP_TEXT,
            fontFamily: "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
          }}
        >
          {titleZh}
        </span>
      </h4>
      <div className="space-y-3">
        <p
          className="text-[0.95rem] font-light leading-[2.0] md:text-[0.98rem]"
          style={{ color: DEEP_TEXT, fontFamily: "var(--font-cormorant), serif" }}
        >
          {bodyEn}
        </p>
        <p
          className="text-[0.92rem] font-light leading-[2.0] md:text-[0.95rem]"
          style={{
            color: DEEP_TEXT,
            fontFamily: "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
          }}
        >
          {bodyZh}
        </p>
      </div>
    </section>
  );
}

export function LoeweCreativeStageThree() {
  return (
    <section
      className="relative overflow-hidden border-t border-black/10 py-20 md:py-28"
      style={{ backgroundColor: MINT }}
    >
      <NoiseOverlay />
      <GalleryLeftEdge />

      <div className="relative z-[1] mx-auto max-w-7xl pl-6 pr-4 md:pl-12 md:pr-8 lg:pl-20 lg:pr-5 xl:pr-6">
        <header className="mb-14 md:mb-16 lg:mb-20">
          <h2 className="mb-5 flex flex-col gap-2 text-2xl font-semibold tracking-[0.06em] text-black sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-3 md:text-3xl">
            <span
              className="uppercase"
              style={{ fontFamily: "var(--font-cormorant), serif" }}
            >
              PHASE III: THE VISTA UNVEILED
            </span>
            <span className="hidden text-black/25 sm:inline">/</span>
            <span
              className="text-[1.35rem] font-normal tracking-normal md:text-2xl"
              style={{
                fontFamily:
                  "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
              }}
            >
              阶段三：赏景
            </span>
          </h2>
          <p
            className="text-base font-medium text-black md:text-[1.05rem]"
            style={{ fontFamily: "var(--font-cormorant), serif" }}
          >
            <span className="block sm:inline">
              Offline Cultural Synergy
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
              线下文化协同
            </span>
          </p>
        </header>

        <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          {/* Left: natural typography, no card container */}
          <div className="min-w-0 space-y-12 md:space-y-14">
            <BilingualSection
              titleEn="Cultural Interpretation"
              titleZh="大师讲解"
              bodyEn='We invite renowned domestic landscape masters to interpret the profound meaning of lattice structures, exploring the \"Beauty of Construction\" and the essence of minimalist elegance in Chinese culture.'
              bodyZh="邀请国内著名花境大师，为整个活动讲解窗棂构造内涵，深度解读中国文化中的构建之美与简单之美。"
            />
            <BilingualSection
              titleEn="Interactive Engagement"
              titleZh="社群互动"
              bodyEn="Exclusive offline invitations for Little Red Book influencers to engage gardening and architecture enthusiasts. Users can enjoy a bespoke bottle engraving experience, creating a unique, personalized piece of art."
              bodyZh="小红书 KOL 线下邀请，吸引园艺及建筑爱好者。用户可亲临现场体验定制瓶身雕刻，在互动中创造属于自己的艺术孤品。"
            />
          </div>

          {/* Right: poster focus */}
          <div className="min-w-0 -translate-y-[40px]">
            <div
              className="relative w-full overflow-hidden rounded-sm"
              style={{
                border: `1px solid ${FOREST}`,
                boxShadow:
                  "0 28px 80px -44px rgba(0,0,0,0.28), 0 10px 22px -16px rgba(0,51,46,0.16)",
              }}
            >
              <Image
                src="/images/marketing/p8.jpg"
                alt="Offline cultural synergy poster concept"
                width={1600}
                height={2000}
                className="h-auto w-full object-contain"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <p
              className="mt-3 text-right text-[10px] font-light leading-relaxed text-black/55"
              style={{ fontFamily: "var(--font-cormorant), serif" }}
            >
              Poster Concept Reference: Little Red Book @Cai Shi Chang / 模拟线下活动海报创意图来源：小红书博主蔡视厂。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

