"use client";

import { useEffect, useState } from "react";

const PARAGRAPHS = [
  'As a sports enthusiast, I have witnessed how athletics have become a vital pillar of social connection. However, I consistently face a frustrating reality within the campus: the immense time and energy wasted trying to coordinate with the right partners at the right time.',
  'Current social platforms are fragmented and inefficient, failing to bridge the gap between "wanting to play" and "actually being on the court." This friction inspired me to develop a dedicated sports community product—a solution designed to streamline matching, reduce social overhead, and foster high-trust athletic connections.',
] as const;

const CHAR_MS = 22;
const PARAGRAPH_PAUSE_MS = 480;

export function TypewriterNarrative({ className = "" }: { className?: string }) {
  const [phase, setPhase] = useState<{
    paragraphIndex: number;
    charIndex: number;
  }>({ paragraphIndex: 0, charIndex: 0 });

  const done =
    phase.paragraphIndex === PARAGRAPHS.length - 1 &&
    phase.charIndex >= PARAGRAPHS[PARAGRAPHS.length - 1].length;

  useEffect(() => {
    if (done) return;

    const current = PARAGRAPHS[phase.paragraphIndex];
    if (phase.charIndex < current.length) {
      const t = window.setTimeout(() => {
        setPhase((p) => ({ ...p, charIndex: p.charIndex + 1 }));
      }, CHAR_MS);
      return () => window.clearTimeout(t);
    }

    if (phase.paragraphIndex < PARAGRAPHS.length - 1) {
      const t = window.setTimeout(() => {
        setPhase({
          paragraphIndex: phase.paragraphIndex + 1,
          charIndex: 0,
        });
      }, PARAGRAPH_PAUSE_MS);
      return () => window.clearTimeout(t);
    }
  }, [phase, done]);

  const visibleFirst = PARAGRAPHS[0].slice(
    0,
    phase.paragraphIndex === 0 ? phase.charIndex : PARAGRAPHS[0].length,
  );
  const visibleSecond =
    phase.paragraphIndex >= 1
      ? PARAGRAPHS[1].slice(
          0,
          phase.paragraphIndex === 1
            ? phase.charIndex
            : PARAGRAPHS[1].length,
        )
      : "";

  return (
    <div
      className={[
        "mx-auto max-w-3xl px-6 text-center",
        className,
      ].join(" ")}
    >
      <p
        className="text-xl font-light leading-[1.65] tracking-tight text-neutral-800 sm:text-2xl sm:leading-[1.6] [font-family:var(--font-cormorant),serif]"
        aria-live="polite"
      >
        {visibleFirst}
        {phase.paragraphIndex === 0 && phase.charIndex < PARAGRAPHS[0].length ? (
          <span
            className="ml-1 inline-block h-[0.92em] w-px animate-pulse bg-neutral-700 align-[-0.05em]"
            aria-hidden
          />
        ) : null}
      </p>

      {phase.paragraphIndex >= 1 ? (
        <p className="mt-8 text-xl font-light leading-[1.65] tracking-tight text-neutral-800 sm:text-2xl sm:leading-[1.6] [font-family:var(--font-cormorant),serif]">
          {visibleSecond}
          {phase.paragraphIndex === 1 &&
          phase.charIndex < PARAGRAPHS[1].length ? (
            <span
              className="ml-1 inline-block h-[0.92em] w-px animate-pulse bg-neutral-700 align-[-0.05em]"
              aria-hidden
            />
          ) : null}
        </p>
      ) : null}
    </div>
  );
}
