"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useCallback, useEffect, useRef } from "react";

import { BubbleCircle } from "@/components/BubbleCircle";

type Ripple = { x: number; y: number; birth: number };

const RIPPLE_DURATION_MS = 1600;
const MAX_RIPPLES = 8;
const RIPPLE_INTERVAL_MS = 110;

const NAME = "KEXUAN WANG";
const NAME_CHARS = NAME.split("");

const HERO_BIO_ZH =
  "这就是我！一个喜欢旅行/羽毛球的创意媒体制作者；我希望我能够原创出更多与体育结合的有趣的设计与内容，并运用我所学的传播技能与知识，让有趣传递！";

const HERO_BIO_EN =
  "Creative Maker | Traveler | Badminton Enthusiast. My goal is to bridge the gap between sports and design with a playful twist. Armed with communication expertise, I'm on a journey to make sure every original idea carries a spark of joy.";

/** Scroll-in only for the bio block (below BubbleCircle); stagger CN → EN. */
const bioScrollParent = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.14, delayChildren: 0.06 },
  },
} as const;

const bioScrollChild = {
  hidden: { opacity: 0, y: 48, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 22,
      mass: 0.82,
    },
  },
} as const;

const nameMid = (NAME_CHARS.length - 1) / 2;

const premiumEase = [0.22, 1, 0.36, 1] as const;

const nameContainerVariants = {
  rest: {},
  hover: {
    transition: { staggerChildren: 0.028, delayChildren: 0 },
  },
};

function nameLetterVariants(i: number) {
  return {
    rest: { x: 0 },
    hover: {
      x: (i - nameMid) * 3.2,
      transition: { duration: 0.4, ease: premiumEase },
    },
  };
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ripplesRef = useRef<Ripple[]>([]);
  const rafRef = useRef<number>(0);
  const targetMouseRef = useRef({ x: 0, y: 0 });
  const smoothMouseRef = useRef({ x: 0, y: 0 });
  const lastRippleTimeRef = useRef(0);

  const magneticX = useMotionValue(0);
  const magneticY = useMotionValue(0);
  const smoothMagX = useSpring(magneticX, {
    stiffness: 52,
    damping: 28,
    mass: 1.2,
  });
  const smoothMagY = useSpring(magneticY, {
    stiffness: 52,
    damping: 28,
    mass: 1.2,
  });

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const dpr = Math.min(window.devicePixelRatio ?? 1, 2);
    const { width, height } = section.getBoundingClientRect();
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cx = width / 2;
    const cy = height / 2;
    targetMouseRef.current = { x: cx, y: cy };
    smoothMouseRef.current = { x: cx, y: cy };
  }, []);

  const drawFrame = useCallback(function drawFrameLoop(now: number) {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio ?? 1, 2);
    const { width: w, height: h } = section.getBoundingClientRect();

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);

    const tgt = targetMouseRef.current;
    const sm = smoothMouseRef.current;
    sm.x += (tgt.x - sm.x) * 0.055;
    sm.y += (tgt.y - sm.y) * 0.055;

    const r = Math.max(w, h) * 0.52;
    const grad = ctx.createRadialGradient(sm.x, sm.y, 0, sm.x, sm.y, r);
    grad.addColorStop(0, "rgba(0, 0, 0, 0.012)");
    grad.addColorStop(0.35, "rgba(0, 0, 0, 0.004)");
    grad.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    ripplesRef.current = ripplesRef.current.filter((rpl) => {
      const age = now - rpl.birth;
      if (age > RIPPLE_DURATION_MS) return false;
      const t = age / RIPPLE_DURATION_MS;
      const ease = 1 - (1 - t) ** 2;
      const radius = ease * 200;
      const alpha = (1 - t) * 0.014;

      ctx.beginPath();
      ctx.arc(rpl.x, rpl.y, radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 0, 0, ${alpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(rpl.x, rpl.y, radius * 0.52, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 0, 0, ${alpha * 0.55})`;
      ctx.lineWidth = 0.65;
      ctx.stroke();

      return true;
    });

    rafRef.current = requestAnimationFrame(drawFrameLoop);
  }, []);

  useEffect(() => {
    resizeCanvas();
    rafRef.current = requestAnimationFrame(drawFrame);
    const onResize = () => resizeCanvas();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [resizeCanvas, drawFrame]);

  const handlePointerMove = (clientX: number, clientY: number) => {
    const section = sectionRef.current;
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const lx = clientX - rect.left;
    const ly = clientY - rect.top;

    targetMouseRef.current = { x: lx, y: ly };

    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const factor = 0.06;
    magneticX.set((clientX - (rect.left + cx)) * factor);
    magneticY.set((clientY - (rect.top + cy)) * factor);

    const t = performance.now();
    if (t - lastRippleTimeRef.current >= RIPPLE_INTERVAL_MS) {
      lastRippleTimeRef.current = t;
      ripplesRef.current.push({ x: lx, y: ly, birth: t });
      if (ripplesRef.current.length > MAX_RIPPLES) {
        ripplesRef.current.splice(0, ripplesRef.current.length - MAX_RIPPLES);
      }
    }
  };

  return (
    <section
      id="home-hero"
      className="flex w-full flex-col overflow-x-hidden bg-[#FFFFFF]"
    >
      {/* Exactly one viewport: only name + canvas; bubble sits below the fold */}
      <div
        ref={sectionRef}
        className="relative flex h-[100svh] w-full shrink-0 flex-col items-center justify-center overflow-x-hidden px-3 sm:px-6"
        onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
        onMouseLeave={() => {
          magneticX.set(0);
          magneticY.set(0);
          const section = sectionRef.current;
          if (section) {
            const { width, height } = section.getBoundingClientRect();
            targetMouseRef.current = { x: width / 2, y: height / 2 };
          }
        }}
      >
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-0 z-0"
          aria-hidden
        />

        <motion.div
          className="relative z-20 flex w-full max-w-full flex-col items-center justify-center px-1 text-center"
          style={{ x: smoothMagX, y: smoothMagY }}
        >
          <motion.div
            className="py-4 sm:py-6"
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.2, ease: premiumEase }}
          >
            <motion.h1
              className="flex max-w-full cursor-default flex-nowrap items-center justify-center gap-0 whitespace-nowrap font-light leading-none tracking-[0.14em] text-black [font-family:var(--font-cormorant),serif] text-[clamp(0.95rem,calc((100vw-1.75rem)/10.8),5.25rem)]"
              initial="rest"
              whileHover="hover"
              animate="rest"
              variants={nameContainerVariants}
            >
              {NAME_CHARS.map((ch, i) => (
                <motion.span
                  key={`${ch}-${i}`}
                  variants={nameLetterVariants(i)}
                  className="inline-block"
                >
                  {ch === " " ? "\u00A0" : ch}
                </motion.span>
              ))}
            </motion.h1>
          </motion.div>
        </motion.div>
      </div>

      <div className="relative z-20 flex w-full shrink-0 flex-col items-center px-4 pb-10 pt-8 sm:pt-10 md:pt-12">
        <BubbleCircle />
        <div className="mt-14 flex w-full justify-center sm:mt-16 md:mt-[4.25rem]">
          <motion.div
            className="w-full max-w-[min(92vw,720px)] space-y-3 text-center [font-family:var(--font-geist-sans),system-ui,sans-serif]"
            aria-label="About"
            initial="hidden"
            whileInView="visible"
            variants={bioScrollParent}
            viewport={{
              once: true,
              amount: 0.55,
              margin: "0px 0px -12% 0px",
            }}
          >
            <motion.p
              variants={bioScrollChild}
              lang="zh-Hans"
              className="text-[13px] leading-relaxed text-neutral-800 sm:text-[15px]"
            >
              {HERO_BIO_ZH}
            </motion.p>
            <motion.p
              variants={bioScrollChild}
              lang="en"
              className="text-[12px] leading-relaxed text-neutral-600 sm:text-[14px]"
            >
              {HERO_BIO_EN}
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
