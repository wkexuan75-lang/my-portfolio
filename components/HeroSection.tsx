"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useCallback, useEffect, useRef } from "react";

import { HeroIntroReveal } from "@/components/HeroIntroReveal";

type Ripple = { x: number; y: number; birth: number };

const RIPPLE_DURATION_MS = 1600;
const MAX_RIPPLES = 8;
const RIPPLE_INTERVAL_MS = 110;

const NAME = "KEXUAN WANG";
const NAME_CHARS = NAME.split("");

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
  const sectionRef = useRef<HTMLElement>(null);
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
      ref={sectionRef}
      className="relative flex min-h-[100dvh] w-full items-center justify-center overflow-x-hidden bg-[#FFFFFF]"
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
        className="relative z-10 flex flex-col items-center justify-center px-6 text-center"
        style={{ x: smoothMagX, y: smoothMagY }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.2, ease: premiumEase }}
        >
          <motion.h1
            className="flex max-w-[min(92vw,44rem)] cursor-default flex-wrap items-center justify-center gap-0 text-[clamp(2.35rem,7.2vw,4.85rem)] font-light leading-[1.06] tracking-[0.14em] text-black [font-family:var(--font-cormorant),serif]"
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

        <motion.p
          className="mt-6 max-w-xl text-[10px] font-thin uppercase leading-relaxed tracking-[0.2em] text-black/50 sm:text-[11px] [font-family:var(--font-inter-hero),system-ui,sans-serif]"
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 1.2,
            delay: 0.14,
            ease: premiumEase,
          }}
        >
          Information Design &amp; Data Visualization
        </motion.p>
      </motion.div>

      <HeroIntroReveal />
    </section>
  );
}
