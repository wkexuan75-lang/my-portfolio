import { CreativeVisionSection } from "@/components/game/CreativeVisionSection";
import { Level2ModuleFlipGrid } from "@/components/game/Level2ModuleFlipGrid";
import { TechnicalArchitectureCards } from "@/components/game/TechnicalArchitectureCards";
import Link from "next/link";

export default function GamePage() {
  return (
    <div className="min-h-screen bg-[#f3ebe3] text-neutral-900">
      {/* Subtle grain */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.06]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "256px 256px",
        }}
        aria-hidden
      />

      <header className="sticky top-0 z-50 border-b border-black/10 bg-[#faf6f0]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
          <Link
            href="/"
            className="text-sm font-medium text-neutral-600 transition-colors hover:text-[#1a2f28]"
          >
            ← Back
          </Link>
          <span
            className="text-[10px] font-medium uppercase tracking-[0.28em] text-neutral-500"
            style={{ fontFamily: "var(--font-cormorant), serif" }}
          >
            Healing Odyssey · 医旅
          </span>
        </div>
      </header>

      {/* Hero — Level 1 */}
      <section
        id="level-1"
        className="relative z-[1] overflow-hidden border-b border-black/10"
      >
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#e8ddd0] via-[#d4c4b0]/80 to-[#c5b59a]/60"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_20%,rgba(45,90,74,0.12),transparent_55%)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-12 md:px-8 md:pb-24 md:pt-16">
          <div className="mx-auto max-w-4xl">
            <h1
              className="text-center text-4xl font-semibold tracking-tight text-[#1a2f28] md:text-5xl lg:text-6xl"
              style={{
                fontFamily:
                  "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
              }}
            >
              医旅
            </h1>
            <p
              className="mt-4 text-center text-xl font-light text-[#1a2f28]/90 md:text-2xl [font-family:var(--font-cormorant),serif]"
            >
              Healing Odyssey: An Interactive TCM Knowledge Puzzle Game
            </p>
          </div>

          <div className="mx-auto mt-14 max-w-3xl space-y-8 md:mt-16">
            <div>
              <p
                className="text-[0.95rem] font-light leading-[2] text-[#1a2f28] md:text-[1.05rem]"
                style={{
                  fontFamily:
                    "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
                }}
              >
                《医旅》是一部旨在推广中医药文化的交互式益智游戏。它打破了传统科普的沉闷，通过国风美学与趣味闯关的结合，让玩家在诊断与治疗的模拟体验中，深度了解中医的博大精深。
              </p>
            </div>
            <div>
              <p
                className="text-[0.95rem] font-light leading-[2] text-[#1a2f28] md:text-[1.05rem] [font-family:var(--font-cormorant),serif]"
              >
                Healing Odyssey is an interactive puzzle game designed to
                popularize Traditional Chinese Medicine (TCM) culture. Moving
                away from dull educational methods, it blends &quot;Guofeng&quot;
                (traditional Chinese style) aesthetics with engaging gameplay,
                allowing players to explore the profound wisdom of TCM through
                immersive diagnostic and treatment simulations.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CreativeVisionSection />

      {/* Level 2 — modules */}
      <section
        id="level-2"
        className="relative z-[1] border-b border-black/10 bg-[#faf6f0] py-16 md:py-24"
      >
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <h2
            className="mt-4 text-center text-2xl font-semibold text-[#1a2f28] md:text-3xl"
            style={{
              fontFamily: "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
            }}
          >
            项目模块与功能
          </h2>
          <p
            className="mt-2 text-center text-base text-[#1a2f28]/65 [font-family:var(--font-cormorant),serif] md:text-lg"
          >
            Systematic Learning Experience
          </p>

          <Level2ModuleFlipGrid />
        </div>
      </section>

      {/* Level 4 — technical */}
      <section id="level-4" className="relative z-[1] bg-[#faf6f0] py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <h2
            className="text-center text-2xl font-semibold text-[#1a2f28] md:text-3xl"
            style={{
              fontFamily: "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
            }}
          >
            技术细节与特色
          </h2>
          <p className="mt-2 text-center text-base text-[#1a2f28]/65 [font-family:var(--font-cormorant),serif] md:text-lg">
            TECHNICAL EXECUTION &amp; FEATURES
          </p>

          <TechnicalArchitectureCards />
        </div>
      </section>

      {/* Final showcase */}
      <section className="relative z-[1] border-t border-black/10 bg-[#f3ebe3] py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <h2
            className="text-center text-2xl font-semibold text-[#1a2f28] md:text-3xl"
            style={{
              fontFamily: "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
            }}
          >
            成品展示
          </h2>
          <p className="mt-2 text-center text-base text-[#1a2f28]/65 [font-family:var(--font-cormorant),serif] md:text-lg">
            Final Showcase
          </p>

          <div className="mx-auto mt-10 w-full max-w-5xl overflow-hidden rounded-xl border border-black/10 bg-black shadow-xl">
            <div className="relative w-full pt-[56.25%]">
              <iframe
                className="absolute inset-0 h-full w-full"
                src="https://www.youtube.com/embed/p6SZ75bL4Dg"
                title="Healing Odyssey final showcase video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-[1] border-t border-black/10 bg-[#ebe3d8] py-8 text-center text-xs text-[#1a2f28]/55">
        <p style={{ fontFamily: "var(--font-cormorant), serif" }}>
          Healing Odyssey · Course Project Documentation
        </p>
      </footer>
    </div>
  );
}
