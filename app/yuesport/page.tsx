"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import { MySportAppDemo } from "@/app/app/mysport/prototypes/MySportAppDemo";
import { MindMapSection } from "@/components/MindMapSection";
import { PhoneFrame } from "@/components/PhoneFrame";
import { TypewriterNarrative } from "@/components/yuesport/TypewriterNarrative";
import { ZoomIn } from "lucide-react";

const UW_PURPLE = "#4B2E83";

const challengeItems = [
  {
    title: "The Density Gap",
    body: "Students struggle to find immediate sports partners despite a high-density campus.",
  },
  {
    title: "Skill Mismatch",
    body: "Competitive athletes waste time playing with beginners, degrading the experience for both.",
  },
  {
    title: "Trust Barrier",
    body: "Safety concerns when meeting strangers from open social platforms.",
  },
];

const solutionItems = [
  {
    title: "Verified Husky",
    body: "Mandatory UW NetID authentication for a high-trust, student-only community.",
  },
  {
    title: "Zero-Friction Matching",
    body: 'Optimized TTM (Time-to-Match) to get students from "searching" to "playing" instantly.',
  },
  {
    title: "IMA Heatmap",
    body: "Live court occupancy data based on user check-ins.",
  },
  {
    title: "Husky Pride",
    body: "Digital badges and ranking lists to reward active campus players.",
  },
];

const RESEARCH_PERSONAS = [
  {
    headerBg: "bg-[#E8F5E9]",
    avatarSrc: "/images/persona-1.png",
    name: "Alex: The Cautious Explorer",
    level: "Beginner",
    statusLabel: "Social-Focused",
    statusClass: "bg-[#A5D6A7] text-[#1B5E20]",
    workaround: "Only works out with close friends.",
    pain: "Social anxiety & fear of being a burden due to low skill level.",
    insight: "Barrier is anxiety, not lack of interest.",
    feature: '"Beginner-friendly" tags & verified skill levels.',
    waiting: "20–30 mins.",
  },
  {
    headerBg: "bg-[#FFFDE7]",
    avatarSrc: "/images/persona-2.png",
    name: "Jordan: The Reliability Seeker",
    level: "Pro",
    statusLabel: "Efficiency-Focused",
    statusClass: "bg-[#FFE082] text-[#BF360C]",
    workaround: "Manages 5+ different WeChat groups.",
    pain: 'Constantly being "ghosted" (No-shows).',
    insight: "Reliability > Technical skill.",
    feature: "Reliability Score (No-show tracker).",
    waiting: "N/A (Uses existing networks).",
  },
  {
    headerBg: "bg-[#E3F2FD]",
    avatarSrc: "/images/persona-3.png",
    name: "Casey: The Quick Setter",
    level: "Pro",
    statusLabel: "Information-Focused",
    statusClass: "bg-[#90CAF9] text-[#0D47A1]",
    workaround: "Manages 5+ different WeChat groups.",
    pain: "Can not arrange the proper playing time.",
    insight: "Reliability > Technical skill.",
    feature: "Real-time Heatmap & Availability tracking.",
    waiting: "15 mins.",
  },
] as const;

function BulletList({
  items,
}: {
  items: { title: string; body: string }[];
}) {
  return (
    <ul className="space-y-5">
      {items.map((item) => (
        <li key={item.title} className="flex gap-3">
          <span
            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: UW_PURPLE }}
            aria-hidden
          />
          <div>
            <p className="font-medium text-neutral-900">{item.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-neutral-600">
              {item.body}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function YueSportPage() {
  return (
    <div className="relative w-full bg-[#FAFAFA] font-sans antialiased text-neutral-900">
      <header className="sticky top-0 z-50 border-b border-neutral-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <p className="text-sm font-light tracking-wide text-neutral-500 [font-family:var(--font-cormorant),serif]">
            Yue Sport{" "}
            <span className="text-neutral-400">(Husky Edition)</span>
          </p>
          <Link
            href="/"
            className="text-xs font-medium text-neutral-500 transition-colors hover:text-neutral-900"
          >
            作品集
          </Link>
        </div>
      </header>

      {/* Part 1 — Hero narrative (typewriter) */}
      <section
        className="relative flex min-h-[min(88vh,920px)] flex-col items-center justify-center py-24 sm:py-32"
        aria-labelledby="yue-narrative-heading"
      >
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-neutral-400">
            From problem to product
          </p>
          <h1
            id="yue-narrative-heading"
            className="sr-only"
          >
            Personal narrative: why Yue Sport exists
          </h1>
        </div>
        <motion.div
          className="mt-10 w-full sm:mt-14"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <TypewriterNarrative />
        </motion.div>
      </section>

      {/* Part 2 — Research: three personas */}
      <section
        className="border-t border-neutral-200/80 bg-white py-20 sm:py-24"
        aria-labelledby="user-research-heading"
      >
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
            Research
          </p>
          <h2
            id="user-research-heading"
            className="mt-2 text-3xl font-light tracking-tight text-neutral-950 [font-family:var(--font-cormorant),serif] sm:text-4xl"
          >
            Alex, Jordan &amp; Casey
          </h2>
          <p className="mt-3 max-w-2xl text-neutral-600">
            Three campus personas shaped priorities—from trust signals to scheduling
            clarity.
          </p>

          <div className="mt-14 grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-10 lg:mt-16 lg:grid-cols-3 lg:gap-8">
            {RESEARCH_PERSONAS.map((p, i) => (
              <motion.article
                key={p.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.55,
                  delay: i * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative rounded-3xl bg-white shadow-sm ring-1 ring-neutral-200/60"
              >
                <div
                  className="pointer-events-none absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-[42%]"
                  aria-hidden
                >
                  <div className="relative h-[92px] w-[92px] overflow-hidden rounded-full border-[3px] border-white bg-neutral-100 shadow-md ring-1 ring-neutral-200/80 sm:h-[100px] sm:w-[100px]">
                    <Image
                      src={p.avatarSrc}
                      alt={`Portrait for ${p.name}`}
                      fill
                      className="object-cover"
                      sizes="100px"
                    />
                  </div>
                </div>

                <div
                  className={`rounded-t-3xl px-5 pb-5 pt-14 text-center sm:pt-[3.75rem] ${p.headerBg}`}
                >
                  <h3 className="text-lg font-semibold tracking-tight text-neutral-900">
                    {p.name}
                  </h3>
                  <p className="mt-2 text-[12px] font-medium text-neutral-600">
                    Level:{" "}
                    <span className="font-semibold text-neutral-800">
                      {p.level}
                    </span>
                  </p>
                  <span
                    className={`mt-3 inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] ${p.statusClass}`}
                  >
                    {p.statusLabel}
                  </span>
                </div>

                <div className="space-y-4 rounded-b-3xl border-t border-neutral-100 bg-white px-5 py-6 text-sm text-neutral-700">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                      Workaround
                    </p>
                    <p className="mt-1 leading-relaxed">{p.workaround}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                      Pain
                    </p>
                    <p className="mt-1 leading-relaxed">{p.pain}</p>
                  </div>
                  <div className="rounded-xl bg-blue-50 px-3 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-800/70">
                      Aha! Moment
                    </p>
                    <p className="mt-1 italic leading-relaxed text-blue-950/90">
                      {p.insight}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                      Feature direction
                    </p>
                    <p className="mt-1 leading-relaxed text-neutral-800">
                      {p.feature}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                      Waiting time
                    </p>
                    <p className="mt-1 leading-relaxed">{p.waiting}</p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Part 3 — IA: 2:1 mind map + challenge/solution */}
      <section
        className="border-t border-neutral-200/80 bg-[#FAFAFA] py-20 sm:py-24"
        aria-labelledby="information-architecture-heading"
      >
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
            Information architecture
          </p>
          <h2
            id="information-architecture-heading"
            className="mt-2 text-3xl font-light tracking-tight text-neutral-950 [font-family:var(--font-cormorant),serif] sm:text-4xl"
          >
            System map &amp; design response
          </h2>
          <p className="mt-3 max-w-2xl text-neutral-600">
            How the experience is structured—and how product decisions answer the
            friction we heard in research.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-10 lg:mt-14 lg:grid-cols-3 lg:gap-8">
            <div className="min-w-0 lg:col-span-2">
              <MindMapSection showHeader={false} />
              <p className="mt-3 flex items-center gap-2 text-xs font-medium text-neutral-500">
                <ZoomIn
                  className="h-3.5 w-3.5 shrink-0 text-neutral-400"
                  strokeWidth={2}
                  aria-hidden
                />
                <span>Interactive: hover clusters to enlarge</span>
              </p>
            </div>

            <aside className="flex min-w-0 flex-col justify-start lg:col-span-1">
              <div>
                <h3 className="text-xl font-light leading-snug tracking-tight text-neutral-950 [font-family:var(--font-cormorant),serif] sm:text-2xl">
                  Challenges
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                  Gaps between intent and court time—density, skill fit, and trust.
                </p>
                <div className="mt-6 font-sans">
                  <BulletList items={challengeItems} />
                </div>
              </div>

              <div className="mt-12 border-t border-neutral-200/90 pt-12">
                <h3 className="text-xl font-light leading-snug tracking-tight text-neutral-950 [font-family:var(--font-cormorant),serif] sm:text-2xl">
                  Solutions{" "}
                  <span className="text-base text-neutral-500">(UW ecosystem)</span>
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                  How Yue Sport closes the loop with verification, matching speed, and
                  live context.
                </p>
                <div className="mt-6 font-sans">
                  <BulletList items={solutionItems} />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Part 4 — Prototype + CTA */}
      <section
        className="border-t border-neutral-200/80 bg-white py-20 sm:py-28"
        aria-labelledby="prototype-heading"
      >
        <div className="mx-auto flex max-w-6xl flex-col items-center px-6">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
            Prototype
          </p>
          <h2
            id="prototype-heading"
            className="mt-2 text-center text-3xl font-light tracking-tight text-neutral-950 [font-family:var(--font-cormorant),serif] sm:text-4xl"
          >
            In-product preview
          </h2>
          <p className="mt-3 max-w-xl text-center text-neutral-600">
            A live shell inside an iPhone frame—login entry and core flows as
            implemented for Husky Edition.
          </p>

          <motion.div
            className="mt-14 w-full max-w-[min(100%,420px)]"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <PhoneFrame>
              <div className="relative flex h-full min-h-0 max-h-full flex-col overflow-hidden bg-[#050505]">
                <div className="pointer-events-none absolute inset-x-0 top-[38px] z-30 flex justify-center px-3">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="pointer-events-auto rounded-full px-4 py-2 text-[11px] font-semibold tracking-wide text-white shadow-lg transition-shadow hover:shadow-[0_0_24px_rgba(75,46,131,0.45)]"
                    style={{
                      backgroundColor: UW_PURPLE,
                      boxShadow: "0 0 0 1px rgba(255,255,255,0.12)",
                    }}
                  >
                    Login with UW NetID
                  </motion.button>
                </div>

                <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                  <MySportAppDemo
                    className="isolate mx-0 flex h-full min-h-0 w-full max-w-none flex-col rounded-none border-0 shadow-none ring-0"
                    shellClassName="!min-h-0 h-full min-h-0 flex-1"
                  />
                </div>
              </div>
            </PhoneFrame>
          </motion.div>

          <motion.div
            className="mt-14"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            <Link
              href="/"
              className="inline-flex min-w-[200px] items-center justify-center rounded-full border border-neutral-900/10 bg-neutral-900 px-10 py-3.5 text-sm font-medium tracking-wide text-white shadow-md transition hover:bg-neutral-800 hover:shadow-lg"
            >
              返回作品集
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
