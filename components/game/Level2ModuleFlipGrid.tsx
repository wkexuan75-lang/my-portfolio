"use client";

import Image from "next/image";
import { useState } from "react";

const MODULES = [
  {
    id: "four-inspections",
    titleZh: "四诊合参",
    titleEn: "The Four Inspections",
    image: "/images/game/p2.png",
    logicCn: "按序点击完成「望闻问切」交互。",
    logicEn: "Sequential clicks to complete inspection interactions.",
    goalCn: "模拟中医初步诊断的标准化流程。",
    goalEn: "Standardized flow of preliminary TCM diagnosis.",
  },
  {
    id: "etiology",
    titleZh: "辨病因",
    titleEn: "Etiology Identification",
    image: "/images/game/p8.png",
    logicCn: "在时限内将症状拖拽至正确的病因分区。",
    logicEn:
      "Drag symptoms into the correct etiology zones within a time limit.",
    goalCn: "训练对中医病理逻辑的反应与分类能力。",
    goalEn: "Train reflexes and classification of TCM pathological logic.",
  },
  {
    id: "herbs",
    titleZh: "辩方识药",
    titleEn: "Prescription & Herbs",
    image: "/images/game/p6.png",
    logicCn: "通过拼图还原药方并完成药材记忆抓取。",
    logicEn:
      "Puzzle-based prescription reconstruction and herb memory tasks.",
    goalCn: "建立药方构成与药材识别的视觉记忆。",
    goalEn: "Build visual memory of formulas and herb recognition.",
  },
  {
    id: "acupuncture",
    titleZh: "针灸",
    titleEn: "Acupuncture Practice",
    image: "/images/game/p4.png",
    logicCn: "根据提示在虚拟人体上进行精准施针。",
    logicEn: "Place needles precisely on a virtual body from prompts.",
    goalCn: "普及人体穴位知识及针灸的临床应用。",
    goalEn: "Introduce acupoints and clinical acupuncture practice.",
  },
] as const;

type Module = (typeof MODULES)[number];

export function Level2ModuleFlipGrid() {
  return (
    <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 md:gap-8">
      {MODULES.map((m) => (
        <ModuleFlipCard key={m.id} module={m} />
      ))}
    </div>
  );
}

function ModuleFlipCard({ module: m }: { module: Module }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setFlipped((v) => !v)}
      aria-pressed={flipped}
      aria-label={`${m.titleZh}：${flipped ? "返回图片" : "查看逻辑说明"}`}
      className="group relative aspect-[828/425] w-full max-w-lg justify-self-center rounded-xl border border-black/10 bg-[#ebe4d9] text-left shadow-sm outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-[#2d5a4a]/35 sm:max-w-none"
      style={{ perspective: "1100px" }}
    >
      <div
        className="relative h-full w-full transition-transform duration-500 ease-out [transform-style:preserve-3d]"
        style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        {/* 正面：配图（不裁切） */}
        <div
          className="absolute inset-0 overflow-hidden rounded-xl bg-[#ebe4d9] [backface-visibility:hidden]"
          style={{ WebkitBackfaceVisibility: "hidden" }}
        >
          <Image
            src={m.image}
            alt={`${m.titleZh} — ${m.titleEn}`}
            fill
            className="object-contain object-center"
            sizes="(max-width: 640px) 100vw, 50vw"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent px-4 pb-4 pt-14">
            <p
              className="text-lg font-semibold text-white drop-shadow md:text-xl"
              style={{
                fontFamily:
                  "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
              }}
            >
              {m.titleZh}
            </p>
            <p className="mt-1 text-sm font-light text-white/90 [font-family:var(--font-cormorant),serif] md:text-base">
              {m.titleEn}
            </p>
          </div>
          <p className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/35 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-white/95 backdrop-blur-sm">
            点击翻转 · Flip
          </p>
        </div>

        {/* 背面：双语逻辑（可滚动承载长文） */}
        <div
          className="absolute inset-0 flex flex-col overflow-hidden rounded-xl border border-black/10 bg-[#f5efe6] p-4 text-[#1a2f28] [backface-visibility:hidden] [transform:rotateY(180deg)] md:p-5"
          style={{
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#2d5a4a]">
              交互逻辑 · Interaction
            </p>
            <p
              className="text-[0.9rem] leading-[1.85]"
              style={{
                fontFamily:
                  "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
              }}
            >
              {m.logicCn}
            </p>
            <p className="text-[0.92rem] leading-[1.7] text-[#1a2f28]/80 [font-family:var(--font-cormorant),serif]">
              {m.logicEn}
            </p>
          </div>

          <div className="mt-4 space-y-1 border-t border-black/10 pt-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#2d5a4a]">
              教学目标 · Learning goals
            </p>
            <p
              className="text-[0.9rem] leading-[1.85]"
              style={{
                fontFamily:
                  "'Songti SC','STSong','Noto Serif SC','SimSun',serif",
              }}
            >
              {m.goalCn}
            </p>
            <p className="text-[0.92rem] leading-[1.7] text-[#1a2f28]/80 [font-family:var(--font-cormorant),serif]">
              {m.goalEn}
            </p>
          </div>
        </div>
      </div>
    </button>
  );
}
