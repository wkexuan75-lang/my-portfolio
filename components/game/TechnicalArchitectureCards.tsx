"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function TechnicalArchitectureCards() {
  return (
    <div className="mt-12 space-y-8 md:space-y-10">
      <motion.article
        initial={{ opacity: 0, x: -56 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="overflow-hidden rounded-xl border border-[#8b6914]/25 bg-white/45 shadow-sm"
      >
        <div className="grid gap-0 md:grid-cols-[42%_58%]">
          <div className="relative min-h-[220px] border-b border-[#8b6914]/20 bg-[#f3ecdf] md:min-h-full md:border-b-0 md:border-r">
            <Image
              src="/images/game/edit-1.png"
              alt="Multi-Software Synergy workflow screenshot"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 42vw"
            />
          </div>
          <div className="p-6 md:p-8">
            <h3 className="text-base font-semibold text-[#1a2f28] [font-family:var(--font-cormorant),serif] md:text-lg">
              Multi-Software Synergy{" "}
              <span className="font-normal text-[#1a2f28]/55">/</span>{" "}
              <span
                className="font-normal"
                style={{
                  fontFamily: "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
                }}
              >
                多软件协同
              </span>
            </h3>
            <p
              className="mt-3 text-[0.95rem] font-light leading-[2] text-[#1a2f28]"
              style={{
                fontFamily: "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
              }}
            >
              以 Animate (ActionScript) 为交互核心，协同 PS/Procreate 进行美术表现，Ai/Ae 完成动态特效。
            </p>
            <p className="mt-3 text-[0.95rem] font-light leading-[1.95] text-[#1a1a1a] [font-family:var(--font-cormorant),serif]">
              Developed using Animate with ActionScript for the core interactivity,
              integrated with PS/Procreate for visual assets and Ai/Ae for motion
              graphics.
            </p>
          </div>
        </div>
      </motion.article>

      <motion.article
        initial={{ opacity: 0, x: 56 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.55, ease: "easeOut", delay: 0.08 }}
        className="overflow-hidden rounded-xl border border-[#8b6914]/25 bg-white/45 shadow-sm"
      >
        <div className="grid gap-0 md:grid-cols-[42%_58%]">
          <div className="relative min-h-[220px] border-b border-[#8b6914]/20 bg-[#f3ecdf] md:min-h-full md:border-b-0 md:border-r">
            <Image
              src="/images/game/edit-3.png"
              alt="Seamless Scene Transition workflow screenshot"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 42vw"
            />
          </div>
          <div className="p-6 md:p-8">
            <h3 className="text-base font-semibold text-[#1a2f28] [font-family:var(--font-cormorant),serif] md:text-lg">
              Seamless Scene Transition{" "}
              <span className="font-normal text-[#1a2f28]/55">/</span>{" "}
              <span
                className="font-normal"
                style={{
                  fontFamily: "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
                }}
              >
                无缝场景切换
              </span>
            </h3>
            <p
              className="mt-3 text-[0.95rem] font-light leading-[2] text-[#1a2f28]"
              style={{
                fontFamily: "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
              }}
            >
              通过脚本优化实现多个 An 文件间的快速跳转，确保游戏关卡切换的流畅度。
            </p>
            <p className="mt-3 text-[0.95rem] font-light leading-[1.95] text-[#1a1a1a] [font-family:var(--font-cormorant),serif]">
              Optimized via scripting to achieve fast jumps between multiple Animate
              files, ensuring fluid transitions between complex game levels.
            </p>
          </div>
        </div>
      </motion.article>
    </div>
  );
}
