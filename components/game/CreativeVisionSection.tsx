"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const rowViewport = { once: true, amount: 0.22 } as const;

const rowParent = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0, delayChildren: 0 },
  },
} as const;

const fromLeft = {
  hidden: { opacity: 0, x: -52 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: EASE },
  },
} as const;

const fromRight = {
  hidden: { opacity: 0, x: 52 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: EASE },
  },
} as const;

export function CreativeVisionSection() {
  return (
    <section
      id="level-3"
      className="relative z-[1] border-b border-black/10 bg-[#fdfcf8] py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <h2
          className="text-center text-2xl font-semibold text-[#1a2f28] md:text-3xl"
          style={{
            fontFamily: "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
          }}
        >
          设计构思与创意
        </h2>
        <p className="mt-2 text-center text-sm text-[#1a2f28]/65 [font-family:var(--font-cormorant),serif]">
          Creative Vision &amp; Structure
        </p>

        {/* Section Heritage — 滑入视口：文案从左、配图从右 */}
        <motion.div
          className="mt-12 flex flex-col gap-8 md:mt-14 md:flex-row md:items-center md:gap-10"
          initial="hidden"
          whileInView="visible"
          viewport={rowViewport}
          variants={rowParent}
        >
          <motion.article
            variants={fromLeft}
            className="w-full border-l-2 border-[#8EA48B] pl-5 md:order-1 md:w-[52%] md:pl-6"
          >
            <h3
              className="text-lg font-semibold text-[#1a2f28] md:text-xl"
              style={{
                fontFamily:
                  "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
              }}
            >
              传承与焕新{" "}
              <span className="text-sm font-normal text-[#1A1A1A] [font-family:var(--font-cormorant),serif] md:text-base">
                (Heritage &amp; Innovation)
              </span>
            </h3>
            <p
              className="mt-4 text-[0.98rem] leading-[2] text-[#666666]"
              style={{
                fontFamily:
                  "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
              }}
            >
              针对当代对中医认可度下降的现状，作品通过诙谐可爱的人物形象和轻松愉悦的氛围，消解了古老医学的距离感。
            </p>
            <p className="mt-4 text-[0.96rem] leading-[1.95] text-[#1A1A1A] [font-family:var(--font-cormorant),serif]">
              Aiming to revitalize public interest in TCM, the project utilizes
              whimsical character designs and a lighthearted atmosphere to
              bridge the gap between ancient medical wisdom and modern
              audiences.
            </p>
          </motion.article>

          <motion.div
            variants={fromRight}
            className="w-full overflow-hidden rounded-xl border border-[#8EA48B]/30 bg-white/40 shadow-lg md:order-2 md:w-[48%]"
          >
            <div className="relative aspect-[828/425] w-full">
              <Image
                src="/images/game/p3.png"
                alt="Healing Odyssey heritage visual"
                fill
                className="object-contain object-center"
                sizes="(max-width: 768px) 100vw, 48vw"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Section Edutainment — 配图从左、文案从右 */}
        <motion.div
          className="mt-10 flex flex-col gap-8 md:mt-12 md:flex-row md:items-center md:gap-10"
          initial="hidden"
          whileInView="visible"
          viewport={rowViewport}
          variants={rowParent}
        >
          <motion.div
            variants={fromLeft}
            className="w-full overflow-hidden rounded-xl border border-[#8EA48B]/30 bg-white/40 shadow-lg md:order-1 md:w-[48%]"
          >
            <div
              className="relative aspect-[828/425] w-full overflow-hidden rounded-xl border border-[#d2c7b5] bg-[#f9f4ea] p-[6px] md:p-[8px]"
              style={{
                boxShadow:
                  "inset 0 0 0 1px rgba(120,98,74,0.15), 0 0 0 1px rgba(236,226,207,0.9)",
              }}
            >
              <Image
                src="/images/game/p1.png"
                alt="医旅寓教于乐关卡截图"
                fill
                className="rounded-md object-contain object-center"
                sizes="(max-width: 768px) 100vw, 48vw"
              />
            </div>
          </motion.div>

          <motion.article
            variants={fromRight}
            className="w-full border-l-2 border-[#8EA48B] pl-5 md:order-2 md:w-[52%] md:pl-6"
          >
            <h3
              className="text-lg font-semibold text-[#1a2f28] md:text-xl"
              style={{
                fontFamily:
                  "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
              }}
            >
              寓教于乐{" "}
              <span className="text-sm font-normal text-[#1A1A1A] [font-family:var(--font-cormorant),serif] md:text-base">
                (Edutainment)
              </span>
            </h3>
            <p
              className="mt-4 text-[0.98rem] leading-[2] text-[#666666]"
              style={{
                fontFamily:
                  "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
              }}
            >
              采用关卡与剧情并行的方式。自制「中药科普小知识」视频穿插其间，形成「操作+学习+反馈」的闭环体验。
            </p>
            <p className="mt-4 text-[0.96rem] leading-[1.95] text-[#1A1A1A] [font-family:var(--font-cormorant),serif]">
              By weaving narrative storylines with gameplay, we created a
              closed-loop experience of &quot;Action + Learning + Feedback,&quot;
              further enriched by original educational video shorts.
            </p>
          </motion.article>
        </motion.div>

        {/* Section Logic */}
        <div className="mt-14 md:mt-16">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="mx-auto w-full max-w-5xl overflow-hidden rounded-xl border border-[#8EA48B]/25 bg-[#dacdbc] shadow-xl"
          >
            {/* Fine irregular fiber texture for handcrafted parchment feel */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.2] mix-blend-multiply"
              style={{
                backgroundImage:
                  'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 240 240%27%3E%3Cfilter id=%27f%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.95%27 numOctaves=%272%27 seed=%2713%27/%3E%3CfeColorMatrix type=%27saturate%27 values=%270%27/%3E%3C/filter%3E%3Crect width=%27240%27 height=%27240%27 filter=%27url(%23f)%27 opacity=%270.42%27/%3E%3Cg opacity=%270.2%27 stroke=%27%23806a45%27 stroke-width=%270.55%27%3E%3Cpath d=%27M-10 24 C30 12 64 40 106 25 S184 8 250 24%27 fill=%27none%27/%3E%3Cpath d=%27M-12 82 C24 66 66 98 112 84 S190 68 252 86%27 fill=%27none%27/%3E%3Cpath d=%27M-8 142 C36 126 74 152 118 138 S196 122 248 144%27 fill=%27none%27/%3E%3Cpath d=%27M-14 202 C30 186 70 216 120 198 S200 182 254 204%27 fill=%27none%27/%3E%3C/g%3E%3C/svg%3E")',
                backgroundSize: "240px 240px",
              }}
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.1]"
              style={{
                backgroundImage:
                  "radial-gradient(ellipse at 14% 18%, rgba(120,98,74,0.18), transparent 48%), radial-gradient(ellipse at 82% 72%, rgba(120,98,74,0.14), transparent 46%), radial-gradient(ellipse at 50% 50%, transparent 62%, rgba(78,60,40,0.16) 100%)",
              }}
              aria-hidden
            />
            <Image
              src="/images/game/mindmap-1.png"
              alt="医旅逻辑结构图"
              width={2048}
              height={1152}
              className="relative z-[1] h-auto w-full object-contain"
              sizes="(max-width: 1024px) 100vw, 80vw"
            />
          </motion.div>
          <div className="mx-auto mt-6 max-w-5xl text-center md:mt-8">
            <p
              className="text-[0.96rem] leading-[2] text-[#666666] md:text-[1rem]"
              style={{
                fontFamily:
                  "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
              }}
            >
              这张详细的思维导图是《医旅》在正式进入游戏制作阶段前的核心顶层设计方案。它全面梳理了游戏的整体结构、关卡逻辑以及核心玩法机制。通过这种可视化的逻辑呈现，我们为整个开发团队建立了一个统一的“执行蓝图”，确保在后期的美术资源绘制、ActionScript 脚本编写以及交互设计过程中，能够精准把控各模块间的跳转逻辑与功能实现。
            </p>
            <p className="mt-5 text-[0.95rem] leading-[1.95] text-[#1A1A1A] [font-family:var(--font-cormorant),serif] md:text-[0.98rem]">
              This comprehensive mind map represents the core top-level design
              formulated prior to the formal production phase of Healing
              Odyssey. It systematically outlines the game’s overall structure,
              level logic, and core gameplay mechanics. By visualizing these
              complex logical flows, we established a unified &quot;blueprint&quot;
              for the entire development team. This ensured precise control over
              scene transition logic and functional implementation during the
              subsequent stages of asset creation, ActionScript programming, and
              interactive design.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
