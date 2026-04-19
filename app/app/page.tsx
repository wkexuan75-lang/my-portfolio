"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const UW_PURPLE = "#4B2E83";
const FLOORS = [
  { id: "ground", label: "Ground" },
  { id: "second", label: "2nd" },
  { id: "third", label: "3rd" },
] as const;

// Simplified zone layouts per floor (schematic)
const FLOOR_ZONES: Record<
  string,
  { id: string; label: string; x: number; y: number; w: number; h: number }[]
> = {
  ground: [
    { id: "gym", label: "Main Gym", x: 10, y: 15, w: 45, h: 35 },
    { id: "pool", label: "Pool", x: 60, y: 15, w: 35, h: 25 },
    { id: "fitness", label: "Fitness", x: 60, y: 45, w: 35, h: 30 },
    { id: "lobby", label: "Lobby", x: 10, y: 55, w: 45, h: 25 },
  ],
  second: [
    { id: "track", label: "Track", x: 5, y: 10, w: 55, h: 45 },
    { id: "cardio", label: "Cardio", x: 65, y: 10, w: 30, h: 40 },
    { id: "weights", label: "Weights", x: 65, y: 55, w: 30, h: 25 },
  ],
  third: [
    { id: "courts", label: "Courts A", x: 8, y: 12, w: 40, h: 38 },
    { id: "courts2", label: "Courts B", x: 52, y: 12, w: 40, h: 38 },
    { id: "multi", label: "Multi-use", x: 8, y: 55, w: 84, h: 25 },
  ],
};

export default function PulsePage() {
  const [activeFloor, setActiveFloor] = useState<(typeof FLOORS)[number]["id"]>("ground");
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);

  const zones = FLOOR_ZONES[activeFloor] ?? [];

  return (
    <motion.div
      className="relative min-h-screen overflow-hidden bg-[#050505] font-sans"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Liquid Void header */}
      <section className="relative z-10 px-6 pt-8 pb-6">
        <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-[#050505] via-[#090012] to-[#050505] px-5 py-5">
          {/* Liquid blobs */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -top-16 left-4 h-40 w-40 rounded-full bg-[#4B2E83] opacity-40 blur-3xl" />
            <div className="absolute -bottom-10 right-0 h-32 w-44 rounded-full bg-[#9333EA] opacity-50 blur-3xl" />
            <div className="absolute top-10 right-16 h-16 w-32 rounded-full bg-[#22d3ee] opacity-30 blur-2xl" />
          </div>

          <p className="text-[11px] uppercase tracking-[0.22em] text-white/40">
            UW · IMA
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-white">
            UW Sport <span className="text-[#C4B5E0]">Pulse</span>
          </h1>
          <p className="mt-2 text-sm text-white/55">
            Live floor snapshot of where the energy is right now.
          </p>
        </div>
      </section>

      {/* Floor tabs */}
      <div className="relative z-10 mt-1 flex justify-center gap-1 px-6 pb-4">
        {FLOORS.map((floor) => (
          <button
            key={floor.id}
            onClick={() => setActiveFloor(floor.id)}
            className="rounded-full px-5 py-2.5 text-sm font-medium transition-colors duration-200"
            style={{
              backgroundColor:
                activeFloor === floor.id ? "rgba(75, 46, 131, 0.35)" : "rgba(255,255,255,0.06)",
              color: activeFloor === floor.id ? "#c4b5e0" : "rgba(255,255,255,0.5)",
            }}
          >
            {floor.label}
          </button>
        ))}
      </div>

      {/* Interactive SVG map */}
      <div className="relative z-0 flex justify-center px-4 pb-8">
        <svg
          viewBox="0 0 100 85"
          className="h-[min(70vh,420px)] w-full max-w-lg"
          style={{ filter: "drop-shadow(0 0 24px rgba(75,46,131,0.12))" }}
        >
          {/* Grid / building outline */}
          <rect
            x="2"
            y="2"
            width="96"
            height="81"
            rx="4"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="0.8"
          />
          {zones.map((zone) => {
            const isHovered = hoveredZone === zone.id;
            return (
              <g key={zone.id}>
                <rect
                  x={zone.x}
                  y={zone.y}
                  width={zone.w}
                  height={zone.h}
                  rx="2"
                  fill={isHovered ? "rgba(75,46,131,0.25)" : "rgba(255,255,255,0.06)"}
                  stroke={isHovered ? "rgba(75,46,131,0.6)" : "rgba(255,255,255,0.12)"}
                  strokeWidth={isHovered ? 1.2 : 0.6}
                  onMouseEnter={() => setHoveredZone(zone.id)}
                  onMouseLeave={() => setHoveredZone(null)}
                  className="cursor-pointer transition-colors duration-150"
                />
                <text
                  x={zone.x + zone.w / 2}
                  y={zone.y + zone.h / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={isHovered ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.45)"}
                  fontSize="5"
                  fontWeight="500"
                  className="pointer-events-none select-none"
                >
                  {zone.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Floating Check-in button */}
      <div className="fixed bottom-20 left-0 right-0 z-20 flex justify-center px-6">
        <button
          type="button"
          className="relative rounded-full px-8 py-4 text-base font-medium text-white transition-transform active:scale-[0.98]"
          style={{
            backgroundColor: UW_PURPLE,
            boxShadow: `
              0 0 0 1px rgba(75,46,131,0.4),
              0 0 24px rgba(75,46,131,0.35),
              0 0 48px rgba(75,46,131,0.2)
            `,
          }}
        >
          <span className="relative z-10">Check-in</span>
          {/* Extra glow layer */}
          <span
            className="absolute inset-0 rounded-full opacity-60"
            style={{
              background: `radial-gradient(circle at 50% 50%, rgba(75,46,131,0.5), transparent 70%)`,
              filter: "blur(8px)",
            }}
            aria-hidden
          />
        </button>
      </div>
    </motion.div>
  );
}
