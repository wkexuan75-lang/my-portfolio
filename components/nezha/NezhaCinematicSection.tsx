"use client";

import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

const YOUTUBE_EMBED = "https://www.youtube.com/embed/Ak7qDoeLEtE";

const reveal = {
  initial: { opacity: 0, x: -20 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.85, ease: EASE },
} as const;

const revealRight = {
  initial: { opacity: 0, x: 20 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.85, ease: EASE, delay: 0.12 },
} as const;

export function NezhaCinematicSection() {
  return (
    <section className="min-h-[70vh] bg-[#050505] px-10 py-14 md:px-16 md:py-20 lg:px-20">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 items-stretch gap-y-10 md:min-h-[70vh] md:grid-cols-2 md:gap-x-[15px] md:gap-y-0">
        {/* Left — narrative */}
        <motion.div
          className="flex h-full min-h-0 flex-col justify-center rounded-sm bg-[#0A0A0A] p-10 md:p-16"
          {...reveal}
        >
          <h2
            className="mb-6 text-3xl text-[#E63946] [font-family:var(--font-cormorant),serif]"
          >
            Nezha: The Awakening
          </h2>

          <p className="mb-8 text-sm leading-relaxed text-gray-300">
            As our debut entry for the Global AI Film Marathon, our team embarked
            on a cinematic odyssey to reimagine a pillar of Chinese mythology:
            Nezha Conquers the Dragon King. Our vision was built on a dual
            foundation: an earnest homage to the 1979 masterpiece by the
            Shanghai Animation Film Studio, fused with the disruptive power of
            AIGC. By synthesizing the haunting, nostalgic original score with
            cutting-edge AI-generated visuals, we crafted a high-octane
            experience reminiscent of a Hollywood blockbuster trailer. This
            project is a dialogue between eras—where traditional heritage meets
            the futuristic pulse of AI to offer a bold, new perspective on an
            immortal legend.
          </p>

          <p
            lang="zh-Hans"
            className="border-t border-white/10 pt-8 text-sm leading-relaxed text-gray-400"
          >
            在首次征战“全球 AI
            电影马拉松”之际，我们团队选择了中国古代神话精粹《哪吒闹海》作为创作蓝本。我们的创作逻辑根植于“致敬”与“突破”的平衡：一方面，我们深度提炼了
            1979
            年上海美术电影制片厂经典版本的原声与音乐精髓，保留了神话的灵魂；另一方面，通过
            AIGC
            技术构建出极具感官震撼力的好莱坞式电影预告视觉。这一次，我们不仅是在讲故事，更是在尝试用前沿
            AI
            语境与传统文化进行一场跨越时空的对话，赋予经典神话一种具有现代张力的新解。
          </p>
        </motion.div>

        {/* Right — YouTube */}
        <motion.div
          className="relative flex h-full min-h-[240px] w-full flex-col md:min-h-0"
          {...revealRight}
        >
          <div className="relative h-full min-h-[min(56vw,280px)] w-full flex-1 overflow-hidden rounded-sm border border-[#E63946] md:min-h-0">
            <iframe
              title="Nezha: The Awakening — trailer"
              src={YOUTUBE_EMBED}
              className="absolute inset-0 h-full w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
