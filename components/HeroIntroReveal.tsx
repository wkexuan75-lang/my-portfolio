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
      className="pointer-events-none absolute inset-x-0 bottom-0 z-[15] flex justify-center px-4 pb-10 pt-6 sm:px-6 sm:pb-14"
      initial={false}
      animate={{
        opacity: visible ? 1 : 0,
        y: visible ? 0 : 18,
        filter: visible ? "blur(0px)" : "blur(8px)",
      }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      aria-hidden={!visible}
    >
      <div className="mx-auto flex w-full max-w-[min(94vw,64rem)] flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8 md:gap-10">
        <motion.div
          className="flex shrink-0 justify-center sm:justify-start"
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
            width={400}
            height={400}
            className="h-72 w-72 object-contain sm:h-[22rem] sm:w-[22rem] md:h-96 md:w-96"
            sizes="(max-width: 640px) 288px, (max-width: 768px) 352px, 384px"
            priority={false}
          />
        </motion.div>
        <div className="flex min-w-0 flex-1 flex-col gap-3 text-left sm:gap-3.5">
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
