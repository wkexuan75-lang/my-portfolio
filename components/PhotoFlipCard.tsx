"use client";

import Image from "next/image";
import { useCallback, useState, type KeyboardEvent } from "react";
import { motion } from "framer-motion";

export interface PhotoFlipCardProps {
  src: string;
  location: string;
  time: string;
  inspiration: string;
  className?: string;
  sizes?: string;
}

export default function PhotoFlipCard({
  src,
  location,
  time,
  inspiration,
  className = "",
  sizes = "(max-width: 1024px) 100vw, 36vw",
}: PhotoFlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const toggle = useCallback(() => {
    setIsFlipped((f) => !f);
  }, []);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle();
      }
    },
    [toggle],
  );

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={isFlipped}
      aria-label={`Photo from ${location}. Click to flip for details.`}
      className={[
        "relative aspect-[3/4] w-full cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2",
        className,
      ].join(" ")}
      style={{ perspective: "1000px" }}
      onClick={toggle}
      onKeyDown={onKeyDown}
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Front: photo */}
        <div
          className="absolute inset-0 overflow-hidden rounded-sm shadow-lg"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <Image
            src={src}
            alt={location}
            fill
            className="object-cover"
            sizes={sizes}
            draggable={false}
          />
        </div>

        {/* Back: postcard */}
        <div
          className="absolute inset-0 flex flex-col justify-between rounded-sm border border-gray-100 bg-white p-8 shadow-xl"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="space-y-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gray-400">
              Location
            </p>
            <p className="font-serif text-sm italic text-gray-800">{location}</p>

            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-gray-400">
              Timestamp
            </p>
            <p className="text-sm text-gray-600">{time}</p>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-gray-400">
              Inspiration
            </p>
            <p className="text-xs italic leading-relaxed text-gray-500">
              &ldquo;{inspiration}&rdquo;
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
