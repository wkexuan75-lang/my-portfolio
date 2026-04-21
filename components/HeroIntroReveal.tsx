"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

/** Fade in icon + bio after user scrolls down this many pixels */
const SCROLL_REVEAL_PX = 50;

export function HeroIntroReveal() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY >= SCROLL_REVEAL_PX);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.div
      className="pointer-events-none flex w-full justify-center px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 sm:px-6 sm:pb-10 sm:pt-6"
      initial={false}
      animate={{
        opacity: visible ? 1 : 0,
        y: visible ? 0 : 18,
        filter: visible ? "blur(0px)" : "blur(8px)",
      }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      aria-hidden={!visible}
    >
      <div className="mx-auto flex w-full max-w-[min(94vw,64rem)] flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:gap-6 md:gap-8">
        <motion.div
          className="flex shrink-0 justify-center sm:max-w-[42%] sm:justify-start"
          initial={false}
          animate={
            visible
              ? { scale: 1, rotate: 0 }
              : { scale: 0.35, rotate: -8 }
          }
          transition={{
            type: "spring",
            stiffness: 420,
            damping: 14,
            mass: 0.65,
          }}
        >
          <Image
            src="/images/icon.png"
            alt="Kexuan Wang"
            width={800}
            height={800}
            className="mx-auto h-auto w-auto max-h-[min(26svh,200px)] max-w-[min(72vw,200px)] object-contain sm:mx-0 sm:max-h-[min(30svh,260px)] sm:max-w-[min(40vw,280px)] md:max-h-[min(32svh,300px)] md:max-w-[min(34vw,320px)]"
            sizes="(max-width: 640px) 200px, (max-width: 1024px) 280px, 320px"
            priority={false}
          />
        </motion.div>
        <div className="flex min-w-0 flex-1 flex-col gap-2.5 text-left sm:gap-3 sm:pl-1">
          <p
            lang="zh-Hans"
            className="text-sm leading-relaxed text-neutral-700 sm:text-[15px] sm:leading-relaxed"
          >
            这就是我！一个喜欢旅行/羽毛球的创意媒体制作者；我希望我能够原创出更多与体育结合的有趣的设计与内容，并运用我所学的传播技能与知识，让有趣传递！
          </p>
          <p
            lang="en"
            className="text-xs leading-relaxed text-neutral-500 sm:text-sm sm:leading-relaxed"
          >
            Creative Maker | Traveler | Badminton Enthusiast. My goal is to bridge
            the gap between sports and design with a playful twist. Armed with
            communication expertise, I&apos;m on a journey to make sure every
            original idea carries a spark of joy.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
