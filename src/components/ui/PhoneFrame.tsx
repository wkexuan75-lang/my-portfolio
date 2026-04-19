"use client";

import { motion } from "framer-motion";
import type { PropsWithChildren } from "react";

type PhoneFrameProps = PropsWithChildren<{
  className?: string;
}>;

const SHADOW_REST =
  "0 32px 64px -14px rgba(0,0,0,0.16), 0 12px 28px -10px rgba(0,0,0,0.08)";
const SHADOW_HOVER =
  "0 40px 80px -14px rgba(0,0,0,0.22), 0 18px 40px -12px rgba(0,0,0,0.12)";

/**
 * iPhone-style device frame: 9:19.5 aspect, white face, thin border,
 * Dynamic Island. Outer shell: subtle hover lift (scale) + deeper shadow — no 3D tilt.
 */
export function PhoneFrame({ children, className }: PhoneFrameProps) {
  return (
    <motion.div
      className={[
        "relative mx-auto w-full max-w-[min(100%,420px)] cursor-default rounded-[3rem]",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ boxShadow: SHADOW_REST }}
      whileHover={{
        scale: 1.02,
        boxShadow: SHADOW_HOVER,
      }}
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative aspect-[9/19.5] w-full overflow-hidden rounded-[3rem] border border-neutral-200/90 bg-white">
        <div
          className="pointer-events-none absolute left-1/2 top-[10px] z-20 h-7 w-[min(32%,118px)] -translate-x-1/2 rounded-full bg-neutral-800"
          aria-hidden
        />
        <div
          className="relative z-0 flex h-full min-h-0 w-full flex-col overflow-hidden touch-pan-y"
          onWheel={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </motion.div>
  );
}
