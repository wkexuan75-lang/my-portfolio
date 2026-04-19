"use client";

import Image from "next/image";

const MINT = "#B2C2A2";
const INK = "#00332E";
/** Slightly lighter mint for Philosophy block */
const MINT_SOFT = "#c5d4c5";

const imgShadow =
  "shadow-[0_14px_48px_-12px_rgba(0,51,46,0.14)]";

/** Module 4 top row: match left / right image display size */
const module4TopImgClass =
  "mx-auto block h-auto w-full max-w-full max-h-[min(68vh,640px)] object-contain";

/** bg1.png — Module 2 hero */
const BG1_W = 2400;
const BG1_H = 1200;

/** bg2.png — full-bleed strip (black rails) between Module 1 & 2 */
const BG2_W = 2400;
const BG2_H = 1200;

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

function BilingualBlock({
  labelEn,
  labelZh,
  bodyEn,
  bodyZh,
  justify = false,
  center = false,
}: {
  labelEn: string;
  labelZh: string;
  bodyEn: string;
  bodyZh: string;
  justify?: boolean;
  center?: boolean;
}) {
  const align = center ? "text-center" : "text-left";
  const bodyJustify = justify ? "text-justify" : "";
  return (
    <div className={`space-y-3 ${align}`}>
      <h3
        className="text-sm font-semibold tracking-tight md:text-base"
        style={{
          color: INK,
          fontFamily: "var(--font-cormorant), serif",
        }}
      >
        <span className="block sm:inline">{labelEn}</span>
        <span
          className="hidden text-black/30 sm:inline"
          style={{ fontFamily: "'Songti SC','STSong','Noto Serif SC',serif" }}
        >
          {" "}
          /{" "}
        </span>
        <span
          className="mt-1 block text-[15px] font-normal sm:mt-0 sm:inline"
          style={{
            color: INK,
            fontFamily: "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
          }}
        >
          {labelZh}
        </span>
      </h3>
      <p
        className={`text-[0.9rem] leading-relaxed md:text-[0.95rem] ${bodyJustify}`}
        style={{ color: INK, fontFamily: "var(--font-cormorant), serif" }}
      >
        {bodyEn}
      </p>
      <p
        className={`text-[0.88rem] leading-relaxed md:text-[0.92rem] ${bodyJustify}`}
        style={{
          color: INK,
          fontFamily: "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
        }}
      >
        {bodyZh}
      </p>
    </div>
  );
}

export function LoeweCreativeStageOne() {
  return (
    <section
      className="relative overflow-hidden border-t border-black/10 py-20 md:py-28"
      style={{ backgroundColor: MINT }}
    >
      <NoiseOverlay />

      <div className="relative z-[1] mx-auto max-w-7xl px-6 md:px-12 lg:px-20">
        {/* Section title */}
        <header className="mb-16 md:mb-24">
          <h2 className="flex flex-col gap-2 text-2xl font-semibold tracking-[0.06em] text-black sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-3 md:text-3xl">
            <span
              className="uppercase"
              style={{ fontFamily: "var(--font-cormorant), serif" }}
            >
              PHASE I: THE GOSSAMER GRILLE
            </span>
            <span className="hidden text-black/25 sm:inline">/</span>
            <span
              className="text-[1.35rem] font-normal tracking-normal md:text-2xl"
              style={{
                fontFamily:
                  "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
              }}
            >
              阶段一：花窗
            </span>
          </h2>
        </header>

        <div className="flex flex-col gap-20 md:gap-28">
          {/* Module 1 — Product core */}
          <article>
            <p
              className="mb-8 text-xs font-medium uppercase tracking-[0.2em] md:mb-10"
              style={{ color: INK, fontFamily: "var(--font-cormorant), serif" }}
            >
              Module 1 · The Essence / 模块一：产品核心
            </p>
            <div className="grid gap-10 md:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] md:gap-12 md:items-start lg:gap-16">
              <div
                className={`relative overflow-hidden rounded-sm ${imgShadow}`}
              >
                <Image
                  src="/images/marketing/p2.jpg"
                  alt="LOEWE home fragrance bottle close-up"
                  width={900}
                  height={1200}
                  className="h-auto w-full origin-center scale-[1.045] object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 48vw"
                />
              </div>
              <div className="flex flex-col justify-center space-y-10 md:min-h-0 md:py-2">
                <BilingualBlock
                  labelEn="Fragrance"
                  labelZh="香味"
                  bodyEn="Featuring Ivy and Honeysuckle scented candles, blending botanical notes with the serene spirit of Suzhou gardens."
                  bodyZh="主推常春藤与金银花草香氛蜡烛，主推草木香型，与苏州园林主题相结合。"
                  justify
                />
                <BilingualBlock
                  labelEn="Bottle Design"
                  labelZh="瓶身设计"
                  bodyEn="Traditional minimalist geometry is replaced by intricate Suzhou garden window lattice patterns, achieving an organic fusion of Chinese aesthetics."
                  bodyZh="将由苏州园林传统窗棂纹样替代传统极简的几何形，构成中式美学的有机结合。"
                  justify
                />
              </div>
            </div>
          </article>
        </div>
      </div>

      {/* Full-bleed band: half-height image (proportional), centered; black rails match image height */}
      <div
        className="relative z-[1] my-12 flex w-full max-w-none items-stretch md:my-16"
      >
        <div className="min-w-0 flex-1 bg-black" />
        <div className="flex shrink-0 items-center justify-center">
          <Image
            src="/images/marketing/bg2.png"
            alt=""
            width={BG2_W}
            height={BG2_H}
            className="h-auto w-auto max-w-[100vw] object-contain"
            sizes="(max-width: 768px) 100vw, 70vw"
            style={{
              maxHeight: `calc(100vw * ${BG2_H} / ${BG2_W} / 2 * 1.2)`,
            }}
          />
        </div>
        <div className="relative min-w-0 flex-1 bg-black">
          <p
            className="absolute bottom-2 right-3 text-right text-[10px] font-light leading-tight text-white md:bottom-3 md:right-4"
            style={{
              fontFamily: "var(--font-cormorant), serif",
              textShadow: "0 1px 3px rgba(0,0,0,0.5)",
            }}
          >
            <span className="block">
              Photo reference: Little Red Book @LeLe Leilei
            </span>
            <span
              className="block"
              style={{
                fontFamily:
                  "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
              }}
            >
              照片来自小红书@LeLe蕾蕾
            </span>
          </p>
        </div>
      </div>

      <div className="relative z-[1] mx-auto max-w-7xl px-6 md:px-12 lg:px-20">
        <div className="flex flex-col gap-20 md:gap-28">
          {/* Module 2 — Philosophy */}
          <article
            className="rounded-2xl px-6 py-12 md:px-12 md:py-16"
            style={{ backgroundColor: MINT_SOFT }}
          >
            <p
              className="mb-10 text-center text-xs font-medium uppercase tracking-[0.2em] md:mb-12"
              style={{ color: INK, fontFamily: "var(--font-cormorant), serif" }}
            >
              Module 2 · Philosophy / 模块二：设计哲学 — 对称美学
            </p>
            <div className="mx-auto mb-12 max-w-4xl md:mb-14">
              <div
                className={`relative overflow-hidden rounded-sm ${imgShadow}`}
              >
                <Image
                  src="/images/marketing/bg1.png"
                  alt="Garden lattice and product atmosphere"
                  width={BG1_W}
                  height={BG1_H}
                  className="h-auto w-full object-contain"
                  sizes="(max-width: 768px) 100vw, 720px"
                />
                <p
                  className="absolute bottom-2 right-3 text-right text-[10px] font-light leading-tight text-white md:bottom-3 md:right-4"
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    textShadow: "0 1px 3px rgba(0,0,0,0.5)",
                  }}
                >
                  <span className="block">
                    Photo reference: Little Red Book @Gao Yajie (GaoYaJie)
                  </span>
                  <span
                    className="block"
                    style={{
                      fontFamily:
                        "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
                    }}
                  >
                    图片来自小红书@高娅杰GaoYaJie📸
                  </span>
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-3xl space-y-12 text-center md:space-y-14">
              <BilingualBlock
                labelEn="Interaction of Void and Substance"
                labelZh="虚实结合"
                bodyEn='The window lattice design skillfully applies the aesthetic of "permeability," allowing interior and exterior spaces to interact. This creates a spatial extension that echoes LOEWE&apos;s philosophy of blending nature with modern design.'
                bodyZh="窗棂设计巧妙运用了「虚实结合」的美学原则，让外部景色与室内空间相互渗透。通过「虚」的窗与「实」的景色产生空间的延展，与罗意威自然现代设计的融合理念相呼应。"
                center
              />
              <BilingualBlock
                labelEn="Beauty of Symmetry and Balance"
                labelZh="对称与均衡之美"
                bodyEn="The orderly layout of the lattice maintains the harmony of the architectural whole while incorporating rhythmic details to break rigidity."
                bodyZh="窗棂的格子布局多为对称排列，保持了整体的和谐感，同时通过细节雕刻形成有节奏的韵律之美。"
                center
              />
            </div>
          </article>

          {/* Module 3 — Participatory aesthetics (same card shell as Module 2) */}
          <article
            className="rounded-2xl px-6 py-12 md:px-12 md:py-16"
            style={{ backgroundColor: MINT_SOFT }}
          >
            <p
              className="mb-10 text-center text-xs font-medium uppercase tracking-[0.2em] md:mb-12"
              style={{ color: INK, fontFamily: "var(--font-cormorant), serif" }}
            >
              Module 3 · Participatory Aesthetics / 模块三：参与式空间美学
            </p>
            <div className="mx-auto mb-12 max-w-4xl md:mb-14">
              <div
                className={`relative overflow-hidden rounded-sm ${imgShadow}`}
              >
                <Image
                  src="/images/marketing/p5.jpg"
                  alt="Lattice and interior spatial composition"
                  width={1200}
                  height={900}
                  className="h-auto w-full object-contain"
                  sizes="(max-width: 768px) 100vw, 720px"
                />
              </div>
            </div>
            <div className="mx-auto max-w-3xl space-y-12 text-center md:space-y-14">
              <BilingualBlock
                labelEn="Participatory Home Aesthetics"
                labelZh="参与式空间美学"
                bodyEn="Inspired by traditional lattice window structures, this design integrates the aesthetics of Chinese garden art into the interior. It forms a unique spatial structure where customers act as co-creators of their own living environment."
                bodyZh="灵感源于窗棂设计，通过增添窗棂结构，将园林艺术美学引入室内，形成可以由顾客自己参与构造的居家空间美学。"
                center
              />
              <div className="space-y-8 md:space-y-10">
                {/* ~1.4× prior row width (64rem → 90rem); proportional object-contain */}
                <div className="mx-auto grid w-full max-w-[min(100%,90rem)] grid-cols-2 gap-4 md:gap-6">
                  <div
                    className={`relative w-full overflow-hidden rounded-sm ${imgShadow}`}
                  >
                    <Image
                      src="/images/marketing/p6.jpg"
                      alt="Modular lattice arrangement reference one"
                      width={2000}
                      height={1500}
                      className="h-auto w-full object-contain object-center"
                      sizes="(max-width: 768px) 46vw, 700px"
                    />
                  </div>
                  <div
                    className={`relative w-full overflow-hidden rounded-sm ${imgShadow}`}
                  >
                    <Image
                      src="/images/marketing/p7.jpg"
                      alt="Modular lattice arrangement reference two"
                      width={2000}
                      height={1500}
                      className="h-auto w-full object-contain object-center"
                      sizes="(max-width: 768px) 46vw, 700px"
                    />
                  </div>
                </div>
                <BilingualBlock
                  labelEn="Modular Freedom"
                  labelZh="模块化自由构筑"
                  bodyEn="Users can freely arrange the position of the lattice frames according to their specific home environment. This flexibility allows the product to transcend its physical form and become a medium for personal artistic expression."
                  bodyZh="顾客可根据自身的室内环境情况，任意摆放窗棂位置，打破产品与空间的界限，让美学成为一种随心的自我表达。"
                  center
                />
              </div>
            </div>
          </article>

          {/* Module 4 — blind-box narrative (label style matches Module 1) */}
          <article>
            <p
              className="mb-8 text-xs font-medium uppercase tracking-[0.2em] md:mb-10"
              style={{ color: INK, fontFamily: "var(--font-cormorant), serif" }}
            >
              Module 4 · The Allure of Uncertainty: Blind-Box Interaction / 模块四：结构与惊喜：盲盒属性
            </p>

            {/* Top: lattice matrix | p1 + caption */}
            <div className="mb-12 grid gap-10 md:mb-16 md:grid-cols-2 md:gap-10 lg:gap-12">
              <div className="w-full">
                <img
                  src="/images/marketing/p3.jpg"
                  alt="Lattice pattern matrix — diversity of forms"
                  className={module4TopImgClass}
                />
              </div>
              <div className="flex flex-col">
                <div className="w-full">
                  <img
                    src="/images/marketing/p1.png"
                    alt="Lattice pattern study"
                    className={module4TopImgClass}
                  />
                </div>
                <p
                  className="mt-4 text-center text-[11px] italic leading-relaxed text-black/50 md:mt-5 md:text-xs"
                  style={{ fontFamily: "var(--font-cormorant), serif" }}
                >
                  <span className="block sm:inline">
                    Exploration of various lattice patterns
                  </span>
                  <span className="mx-1 hidden text-black/25 sm:inline">/</span>
                  <span
                    className="mt-1 block text-[11px] not-italic text-black/45 sm:mt-0 sm:inline md:text-xs"
                    style={{
                      fontFamily:
                        "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
                    }}
                  >
                    窗棂形态的多样性探索
                  </span>
                </p>
              </div>
            </div>

            {/* Core narrative — two columns */}
            <div>
              <div className="grid gap-10 md:grid-cols-2 md:gap-12 md:items-start">
                <div className="space-y-4 text-left">
                  <h3 className="space-y-1">
                    <span
                      className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-[#00332E] md:text-xs"
                      style={{ fontFamily: "var(--font-cormorant), serif" }}
                    >
                      Surprise &amp; Freshness
                    </span>
                    <span
                      className="block text-sm text-black/80"
                      style={{
                        fontFamily:
                          "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
                      }}
                    >
                      不确定性的新鲜感
                    </span>
                  </h3>
                  <p
                    className="text-[0.9rem] leading-relaxed text-[#00332E] md:text-[0.95rem]"
                    style={{ fontFamily: "var(--font-cormorant), serif" }}
                  >
                    By purchasing the product, users encounter an element of
                    uncertainty with randomized lattice patterns. This not only
                    offers a diversified aesthetic experience but also provides
                    a sense of novelty and the euphoric &quot;unboxing&quot;
                    thrill.
                  </p>
                  <p
                    className="text-[0.88rem] leading-relaxed text-[#00332E]/95"
                    style={{
                      fontFamily:
                        "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
                    }}
                  >
                    用户可以通过购买产品获得不确定性的窗棂图案。这不仅能提供多样化的审美体验，也能给用户以不确定性的新鲜感与愉悦的开箱体验。
                  </p>
                </div>
                <div className="space-y-4 text-left">
                  <h3 className="space-y-1">
                    <span
                      className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-[#00332E] md:text-xs"
                      style={{ fontFamily: "var(--font-cormorant), serif" }}
                    >
                      Sustainable Innovation
                    </span>
                    <span
                      className="block text-sm text-black/80"
                      style={{
                        fontFamily:
                          "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
                      }}
                    >
                      零浪费的创意执行
                    </span>
                  </h3>
                  <p
                    className="text-[0.9rem] leading-relaxed text-[#00332E] md:text-[0.95rem]"
                    style={{ fontFamily: "var(--font-cormorant), serif" }}
                  >
                    Designed with a philosophy of &quot;zero-waste,&quot; every
                    structural element of the packaging serves an aesthetic
                    purpose. The lattice frames are integrated parts of the art
                    piece, ensuring that the thrill of discovery does not come
                    at the cost of environmental impact.
                  </p>
                  <p
                    className="text-[0.88rem] leading-relaxed text-[#00332E]/95"
                    style={{
                      fontFamily:
                        "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
                    }}
                  >
                    设计在追求极致美感的同时，遵循零浪费原则。窗棂结构作为包装的一部分，既是视觉重点也是实用的空间构件，确保了开箱的愉悦感不会造成任何包装材料的浪费。
                  </p>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
