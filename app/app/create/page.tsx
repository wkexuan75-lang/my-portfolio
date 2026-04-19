"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Dribbble,
  Goal,
  ShoppingBasket,
  PlusCircle,
  Waves,
  Volleyball,
  ChevronDown,
  Trophy,
} from "lucide-react";
import {
  DAYS,
  LEVELS,
  SPORTS,
  TIME_SLOTS,
  type Day,
  type MatchCard,
  type MatchFrequency,
  type SkillLevel,
  type Sport,
  useMatchContext,
} from "@/context/MatchContext";

const UW_PURPLE = "#4B2E83";
const UW_GOLD = "#E8D3A2";

const VENUES = [
  "IMA Court 1",
  "IMA Court 2",
  "IMA Court 3",
  "IMA Courts 7–8",
  "IMA Turf A",
  "IMA Turf B",
  "IMA Pool Lanes 5–6",
  "IMA Pool Lanes 7–8",
] as const;

const VENUE_GROUPS: { label: string; items: string[] }[] = [
  {
    label: "Outdoor Spaces",
    items: ["IMA Turf A", "IMA Turf B"],
  },
  {
    label: "Indoor/Gyms",
    items: ["IMA Court 1", "IMA Court 2", "IMA Court 3", "IMA Courts 7–8", "IMA Pool Lanes 5–6", "IMA Pool Lanes 7–8"],
  },
];

function minutesToHHMM(totalMinutes: number) {
  const clamped = Math.max(0, Math.round(totalMinutes));
  const h = Math.floor(clamped / 60);
  const m = clamped % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function minutesTo12h(totalMinutes: number) {
  const clamped = Math.max(0, Math.round(totalMinutes));
  const h24 = Math.floor(clamped / 60);
  const m = clamped % 60;
  const suffix = h24 >= 12 ? "PM" : "AM";
  const h12raw = h24 % 12;
  const h12 = h12raw === 0 ? 12 : h12raw;
  return `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
}

function formatDuration(durationMinutes: number) {
  const total = Math.max(0, Math.round(durationMinutes));
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h <= 0) return `${m} min`;
  if (m <= 0) return `${h} hr`;
  return `${h} hr ${m} min`;
}

function computeSlotFromStart(startMinutes: number): (typeof TIME_SLOTS)[number] {
  const h = Math.floor(startMinutes / 60);
  if (h >= 9 && h < 12) return "Morning (9-12)";
  if (h >= 12 && h < 18) return "Afternoon (12-6)";
  return "Evening (6-10)";
}

function DualTimeRangeSlider(props: {
  minMinutes: number;
  maxMinutes: number;
  stepMinutes: number;
  startMinutes: number;
  endMinutes: number;
  onChange: (next: { startMinutes: number; endMinutes: number }) => void;
}) {
  const { minMinutes, maxMinutes, stepMinutes, startMinutes, endMinutes, onChange } =
    props;

  const sliderRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState<"start" | "end" | null>(null);

  const startPercent = ((startMinutes - minMinutes) / (maxMinutes - minMinutes)) * 100;
  const endPercent = ((endMinutes - minMinutes) / (maxMinutes - minMinutes)) * 100;

  const minutesFromClientX = (clientX: number) => {
    const track = trackRef.current;
    if (!track) return startMinutes;
    const rect = track.getBoundingClientRect();
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
    const ratio = rect.width <= 0 ? 0 : x / rect.width;
    const raw = minMinutes + ratio * (maxMinutes - minMinutes);
    const stepped = Math.round(raw / stepMinutes) * stepMinutes;
    return Math.min(maxMinutes, Math.max(minMinutes, stepped));
  };

  const commit = (which: "start" | "end", minutes: number) => {
    if (which === "start") {
      const nextStart = Math.min(minutes, endMinutes - stepMinutes);
      onChange({
        startMinutes: nextStart,
        endMinutes: endMinutes,
      });
    } else {
      const nextEnd = Math.max(minutes, startMinutes + stepMinutes);
      onChange({
        startMinutes: startMinutes,
        endMinutes: nextEnd,
      });
    }
  };

  const handlePointerDown = (
    which: "start" | "end",
    e: ReactPointerEvent,
  ) => {
    const el = sliderRef.current;
    if (!el) return;
    (el as HTMLDivElement).setPointerCapture(e.pointerId);
    setDragging(which);
    commit(which, minutesFromClientX(e.clientX));
  };

  const handleTrackPointerDown = (e: ReactPointerEvent) => {
    const clicked = minutesFromClientX(e.clientX);
    const distToStart = Math.abs(clicked - startMinutes);
    const distToEnd = Math.abs(clicked - endMinutes);
    const which: "start" | "end" = distToStart <= distToEnd ? "start" : "end";
    handlePointerDown(which, e);
  };

  const handlePointerMove = (e: ReactPointerEvent) => {
    if (!dragging) return;
    commit(dragging, minutesFromClientX(e.clientX));
  };

  const handlePointerUp = () => setDragging(null);

  const fromLabel = `${minutesToHHMM(startMinutes)}`;
  const toLabel = `${minutesToHHMM(endMinutes)}`;
  const durationMinutes = endMinutes - startMinutes;

  return (
    <div ref={sliderRef} className="relative select-none" onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
      <div
        ref={trackRef}
        className="relative h-10"
        onPointerDown={handleTrackPointerDown}
        role="presentation"
      >
        <div className="absolute left-0 right-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-white/10" />
        <div
          className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-[#4B2E83]/70 shadow-[0_0_18px_rgba(75,46,131,0.55)]"
          style={{
            left: `${startPercent}%`,
            width: `${Math.max(0, endPercent - startPercent)}%`,
          }}
        />

        <motion.button
          type="button"
          aria-label="Start time"
          onPointerDown={(e: ReactPointerEvent<HTMLButtonElement>) =>
            handlePointerDown("start", e)
          }
          className="absolute top-1/2 h-7 w-7 -translate-y-1/2 -translate-x-1/2 rounded-full bg-black/80 backdrop-blur-xl border border-white/10"
          style={{ left: `${startPercent}%`, zIndex: dragging === "start" ? 4 : 2 }}
          animate={{ scale: dragging === "start" ? 1.12 : 1 }}
          transition={{ type: "spring", stiffness: 280, damping: 18 }}
          whileTap={{ scale: 0.98 }}
        >
          <span
            className="block h-2 w-2 rounded-full"
            style={{ backgroundColor: UW_GOLD, margin: "0 auto" }}
          />
        </motion.button>

        <motion.button
          type="button"
          aria-label="End time"
          onPointerDown={(e: ReactPointerEvent<HTMLButtonElement>) =>
            handlePointerDown("end", e)
          }
          className="absolute top-1/2 h-7 w-7 -translate-y-1/2 -translate-x-1/2 rounded-full bg-black/80 backdrop-blur-xl border border-white/10"
          style={{ left: `${endPercent}%`, zIndex: dragging === "end" ? 4 : 2 }}
          animate={{ scale: dragging === "end" ? 1.12 : 1 }}
          transition={{ type: "spring", stiffness: 280, damping: 18 }}
          whileTap={{ scale: 0.98 }}
        >
          <span
            className="block h-2 w-2 rounded-full"
            style={{ backgroundColor: UW_PURPLE, margin: "0 auto" }}
          />
        </motion.button>
      </div>

      <div className="flex items-center justify-between px-1 text-xs text-white/55">
        <span>
          Start <span className="text-white/80">{fromLabel}</span>
        </span>
        <span className="text-right">
          End <span className="text-white/80">{toLabel}</span>
        </span>
      </div>

      <div className="mt-2 flex justify-end">
        <motion.div
          key={durationMinutes}
          initial={{ scale: 0.96, opacity: 0.85 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: UW_PURPLE }} />
          <span>Duration: </span>
          <span className="text-white/90">{formatDuration(durationMinutes)}</span>
        </motion.div>
      </div>
    </div>
  );
}

function DualNumberRangeSlider(props: {
  minValue: number;
  maxValue: number;
  stepValue: number;
  leftValue: number;
  rightValue: number;
  onChange: (next: { min: number; max: number }) => void;
}) {
  const {
    minValue,
    maxValue,
    stepValue,
    leftValue,
    rightValue,
    onChange,
  } = props;

  const sliderRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState<"left" | "right" | null>(null);

  const leftPercent =
    ((leftValue - minValue) / (maxValue - minValue)) * 100;
  const rightPercent =
    ((rightValue - minValue) / (maxValue - minValue)) * 100;

  const valueFromClientX = (clientX: number) => {
    const track = trackRef.current;
    if (!track) return leftValue;
    const rect = track.getBoundingClientRect();
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
    const ratio = rect.width <= 0 ? 0 : x / rect.width;
    const raw = minValue + ratio * (maxValue - minValue);
    const stepped = Math.round(raw / stepValue) * stepValue;
    return Math.min(maxValue, Math.max(minValue, stepped));
  };

  const commit = (which: "left" | "right", value: number) => {
    if (which === "left") {
      // Ensure left handle can't cross the right handle.
      const nextLeft = Math.min(value, rightValue - stepValue);
      onChange({ min: nextLeft, max: rightValue });
    } else {
      const nextRight = Math.max(value, leftValue + stepValue);
      onChange({ min: leftValue, max: nextRight });
    }
  };

  const handlePointerDown = (
    which: "left" | "right",
    e: ReactPointerEvent,
  ) => {
    const el = sliderRef.current;
    if (!el) return;
    (el as HTMLDivElement).setPointerCapture(e.pointerId);
    setDragging(which);
    commit(which, valueFromClientX(e.clientX));
  };

  const handleTrackPointerDown = (e: ReactPointerEvent) => {
    const clicked = valueFromClientX(e.clientX);
    const distToLeft = Math.abs(clicked - leftValue);
    const distToRight = Math.abs(clicked - rightValue);
    const which: "left" | "right" =
      distToLeft <= distToRight ? "left" : "right";
    handlePointerDown(which, e);
  };

  const handlePointerMove = (e: ReactPointerEvent) => {
    if (!dragging) return;
    commit(dragging, valueFromClientX(e.clientX));
  };

  const handlePointerUp = () => setDragging(null);

  return (
    <div
      ref={sliderRef}
      className="relative select-none"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <div
        ref={trackRef}
        className="relative h-10"
        onPointerDown={handleTrackPointerDown}
        role="presentation"
      >
        <div className="absolute left-0 right-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-white/10" />
        <motion.div
          className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full shadow-[0_0_18px_rgba(75,46,131,0.65)]"
          style={{
            left: `${leftPercent}%`,
            width: `${Math.max(0, rightPercent - leftPercent)}%`,
            backgroundColor: "#4B2E83",
          }}
          animate={{ filter: dragging ? "brightness(1.12)" : "brightness(1)" }}
          transition={{ duration: 0.12 }}
        />

        <motion.button
          type="button"
          aria-label="Min capacity"
          onPointerDown={(e: ReactPointerEvent<HTMLButtonElement>) =>
            handlePointerDown("left", e)
          }
          className="absolute top-1/2 h-7 w-7 -translate-y-1/2 -translate-x-1/2 rounded-full bg-black/80 backdrop-blur-xl border border-white/10"
          style={{ left: `${leftPercent}%`, zIndex: dragging === "left" ? 4 : 2 }}
          animate={{ scale: dragging === "left" ? 1.12 : 1 }}
          transition={{ type: "spring", stiffness: 280, damping: 18 }}
          whileTap={{ scale: 0.98 }}
        >
          <span
            className="block h-2 w-2 rounded-full"
            style={{ backgroundColor: UW_PURPLE, margin: "0 auto" }}
          />
        </motion.button>

        <motion.button
          type="button"
          aria-label="Max capacity"
          onPointerDown={(e: ReactPointerEvent<HTMLButtonElement>) =>
            handlePointerDown("right", e)
          }
          className="absolute top-1/2 h-7 w-7 -translate-y-1/2 -translate-x-1/2 rounded-full bg-black/80 backdrop-blur-xl border border-white/10"
          style={{ left: `${rightPercent}%`, zIndex: dragging === "right" ? 4 : 2 }}
          animate={{ scale: dragging === "right" ? 1.12 : 1 }}
          transition={{ type: "spring", stiffness: 280, damping: 18 }}
          whileTap={{ scale: 0.98 }}
        >
          <span
            className="block h-2 w-2 rounded-full"
            style={{ backgroundColor: UW_PURPLE, margin: "0 auto" }}
          />
        </motion.button>
      </div>
    </div>
  );
}

const SPORT_ICON: Record<Sport, ComponentType<{ className?: string }>> = {
  Badminton: Volleyball,
  Basketball: Dribbble,
  Soccer: Goal,
  Swimming: Waves,
  Tennis: ShoppingBasket,
};

export default function CreateMatchPage() {
  const router = useRouter();
  const { addMatch, currentUserId } = useMatchContext();

  const [frequency, setFrequency] = useState<MatchFrequency>("single");
  const [sport, setSport] = useState<Sport>(SPORTS[0]);
  const [singleDay, setSingleDay] = useState<Day>(DAYS[0]);
  const [recurringDays, setRecurringDays] = useState<Day[]>([DAYS[0], DAYS[2]]);
  const [startMinutes, setStartMinutes] = useState<number>(9 * 60);
  const [endMinutes, setEndMinutes] = useState<number>(10 * 60 + 30);
  const [minCapacity, setMinCapacity] = useState<string>("");
  const [maxCapacity, setMaxCapacity] = useState<string>("");
  const [levels, setLevels] = useState<SkillLevel[]>([LEVELS[1], LEVELS[2]]);
  const [venue, setVenue] = useState<string>("");
  const [venueOpen, setVenueOpen] = useState(false);
  const [venueFocused, setVenueFocused] = useState(false);
  const venueWrapRef = useRef<HTMLDivElement | null>(null);
  const [notes, setNotes] = useState<string>("");

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastLaunchedMatchId, setLastLaunchedMatchId] = useState<number | null>(
    null,
  );

  useEffect(() => {
    if (!venueOpen) return;
    const onDown = (e: PointerEvent) => {
      const el = venueWrapRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) {
        setVenueOpen(false);
      }
    };
    window.addEventListener("pointerdown", onDown, true);
    return () => window.removeEventListener("pointerdown", onDown, true);
  }, [venueOpen]);

  const [error, setError] = useState<string | null>(null);

  const durationMinutes = endMinutes - startMinutes;

  const selectedDays = useMemo(() => {
    return frequency === "single" ? [singleDay] : recurringDays;
  }, [frequency, recurringDays, singleDay]);

  const minCapacityNum =
    minCapacity === "" ? null : Number.isFinite(Number(minCapacity)) ? Number(minCapacity) : null;
  const maxCapacityNum =
    maxCapacity === "" ? null : Number.isFinite(Number(maxCapacity)) ? Number(maxCapacity) : null;

  const capacityBubbleText =
    minCapacity === "" && maxCapacity === ""
      ? "Enter Capacity"
      : `${minCapacity || "Min"}-${maxCapacity || "Max"} players`;

  const isCapacityValid =
    minCapacityNum !== null &&
    maxCapacityNum !== null &&
    minCapacityNum >= 2 &&
    minCapacityNum <= 10 &&
    maxCapacityNum >= 2 &&
    maxCapacityNum <= 10 &&
    minCapacityNum <= maxCapacityNum;

  const capacityErrorText =
    minCapacityNum !== null &&
    maxCapacityNum !== null &&
    minCapacityNum > maxCapacityNum
      ? "Min cannot exceed Max"
      : null;

  const capacityLabelText =
    minCapacityNum !== null && maxCapacityNum !== null
      ? `${minCapacityNum}-${maxCapacityNum} players`
      : "Enter Capacity";

  const toggleRecurringDay = (d: Day) => {
    setRecurringDays((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d],
    );
  };

  const handleLaunchMatch = () => {
    setError(null);
    if (selectedDays.length === 0) {
      setError("Please select at least one day.");
      return;
    }
    if (endMinutes <= startMinutes) {
      setError("End time must be after start time.");
      return;
    }
    if (!isCapacityValid) {
      setError(capacityErrorText ?? "Enter Capacity");
      return;
    }
    if (minCapacityNum === null || maxCapacityNum === null) {
      setError("Enter Capacity");
      return;
    }
    if (!levels.length) {
      setError("Please select at least one skill level.");
      return;
    }
    if (!venue) {
      setError("Select a venue.");
      return;
    }

    const slot = computeSlotFromStart(startMinutes);
    const time = `${minutesTo12h(startMinutes)} - ${minutesTo12h(endMinutes)}`;

    const newMatch: MatchCard = {
      id: Date.now(),
      hostId: currentUserId,
      creatorId: currentUserId,
      frequency,
      sport,
      days: selectedDays,
      startTime: minutesToHHMM(startMinutes),
      endTime: minutesToHHMM(endMinutes),
      durationMinutes,
      slot,
      title: `${sport} @ ${venue}`,
      time,
      location: venue,
      filled: 0,
      capacity: { min: minCapacityNum!, max: maxCapacityNum! },
      capacityLabel: capacityLabelText,
      levels,
      notes: notes.trim(),
      attendees: [],
    };

    addMatch(newMatch);
    setLastLaunchedMatchId(newMatch.id);
    setShowSuccessModal(false);
    router.push("/profile");
  };

  return (
    <motion.div
      className="relative min-h-screen overflow-visible bg-[#050505] font-sans"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <section className="relative z-10 px-6 pt-8 pb-4">
        <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-[#050505] via-[#090012] to-[#050505] px-5 py-5">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -top-14 left-5 h-44 w-44 rounded-full bg-[#4B2E83] opacity-35 blur-3xl" />
            <div className="absolute -bottom-10 right-0 h-36 w-44 rounded-full bg-[#9333EA] opacity-45 blur-3xl" />
            <div className="absolute top-10 right-12 h-16 w-28 rounded-full bg-[#22d3ee] opacity-25 blur-2xl" />
          </div>

          <p className="text-[11px] uppercase tracking-[0.22em] text-white/40">
            UW · IMA
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-white">
            Create <span className="text-[#C4B5E0]">Match</span>
          </h1>
          <p className="mt-2 text-sm text-white/55">
            Spin up a high-quality pickup run with a sleek schedule.
          </p>
        </div>
      </section>

      <section className="relative z-10 px-6 pb-28">
        <div className="space-y-4">
          {/* Frequency toggle */}
          <div className="rounded-2xl border border-white/10 bg-[#0A0A0A]/60 p-4 text-white/80 backdrop-blur-xl shadow-[0_18px_50px_rgba(0,0,0,0.9)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
                  Frequency
                </p>
                <p className="mt-1 text-sm text-white/75">Choose how this match repeats.</p>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              {([
                { key: "single", label: "Single Event" },
                { key: "recurring", label: "Recurring" },
              ] as const).map((opt) => {
                const active = frequency === opt.key;
                return (
                  <motion.button
                    key={opt.key}
                    type="button"
                    onClick={() => setFrequency(opt.key)}
                    className={[
                      "rounded-2xl px-4 py-3 text-sm font-semibold transition-all border",
                      active
                        ? "border-[#4B2E83]/90 bg-[#4B2E83]/30 text-[#E8D3A2] shadow-[0_0_26px_rgba(75,46,131,0.45)]"
                        : "border-white/10 bg-white/[0.03] text-white/65",
                    ].join(" ")}
                    whileTap={{ scale: 0.99 }}
                  >
                    {opt.label}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Sport picker */}
          <div className="rounded-2xl border border-white/10 bg-[#0A0A0A]/60 p-4 backdrop-blur-xl shadow-[0_18px_50px_rgba(0,0,0,0.9)]">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
              Sport
            </p>

            <div className="mt-3 flex items-center gap-3 overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch]">
              {SPORTS.map((s) => {
                const active = sport === s;
                const Icon = SPORT_ICON[s];
                return (
                  <motion.button
                    key={s}
                    type="button"
                    onClick={() => setSport(s)}
                    className={[
                      "relative min-w-[112px] flex-shrink-0 rounded-2xl border p-3 text-left transition-all",
                      active
                        ? "border-[#4B2E83]/90 bg-[#4B2E83]/20"
                        : "border-white/10 bg-white/[0.03]",
                    ].join(" ")}
                    whileTap={{ scale: 0.99 }}
                  >
                    {active && (
                      <span
                        className="absolute -inset-1 rounded-3xl opacity-60 blur-2xl"
                        style={{ backgroundColor: "rgba(75,46,131,0.35)" }}
                        aria-hidden
                      />
                    )}
                    <div className="relative flex items-center gap-2">
                      <span
                        className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-black/35"
                        style={active ? { borderColor: UW_GOLD } : undefined}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-white">
                          {s}
                        </span>
                        <span className="block truncate text-[11px] text-white/55">
                          Pick for your card
                        </span>
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Time range */}
          <div className="rounded-2xl border border-white/10 bg-[#0A0A0A]/60 p-4 backdrop-blur-xl shadow-[0_18px_50px_rgba(0,0,0,0.9)]">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
                  Time Range
                </p>
                <p className="mt-1 text-sm text-white/75">
                  Set start & end between 06:00 and 22:00.
                </p>
              </div>
              <motion.div
                key={durationMinutes}
                initial={{ scale: 0.98, opacity: 0.75 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
              >
                <span className="text-white/90 font-semibold">Duration</span>{" "}
                <span style={{ color: UW_GOLD }}>{formatDuration(durationMinutes)}</span>
              </motion.div>
            </div>

            <div className="mt-3">
              <DualTimeRangeSlider
                minMinutes={6 * 60}
                maxMinutes={22 * 60}
                stepMinutes={15}
                startMinutes={startMinutes}
                endMinutes={endMinutes}
                onChange={({ startMinutes: ns, endMinutes: ne }) => {
                  // Keep the slider well-formed (>= 15 minutes).
                  if (ne - ns < 15) {
                    setStartMinutes(Math.min(ns, ne - 15));
                    setEndMinutes(ne);
                  } else {
                    setStartMinutes(ns);
                    setEndMinutes(ne);
                  }
                }}
              />
            </div>
          </div>

          {/* Days selection */}
          <div className="rounded-2xl border border-white/10 bg-[#0A0A0A]/60 p-4 backdrop-blur-xl shadow-[0_18px_50px_rgba(0,0,0,0.9)]">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
              {frequency === "single" ? "Day" : "Days of the Week"}
            </p>

            {frequency === "single" ? (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {DAYS.map((d) => {
                  const active = singleDay === d;
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setSingleDay(d)}
                      className={[
                        "min-w-[2.3rem] rounded-full px-2 py-1 text-[11px] font-medium transition-all border",
                        active
                          ? "border-[#4B2E83]/90 bg-[#4B2E83]/40 text-[#E8D3A2] shadow-[0_0_16px_rgba(75,46,131,0.6)]"
                          : "border-white/12 bg-white/[0.03] text-white/65",
                      ].join(" ")}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
            ) : (
              <AnimatePresence initial={false}>
                <motion.div
                  className="mt-3 overflow-hidden"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  <div className="flex flex-wrap gap-1.5">
                    {DAYS.map((d) => {
                      const active = recurringDays.includes(d);
                      return (
                        <button
                          key={d}
                          type="button"
                          onClick={() => toggleRecurringDay(d)}
                          className={[
                            "min-w-[2.3rem] rounded-full px-2 py-1 text-[11px] font-medium transition-all border",
                            active
                              ? "border-[#4B2E83]/90 bg-[#4B2E83]/40 text-[#E8D3A2] shadow-[0_0_16px_rgba(75,46,131,0.6)]"
                              : "border-white/12 bg-white/[0.03] text-white/65",
                          ].join(" ")}
                        >
                          {d}
                        </button>
                      );
                    })}
                  </div>

                  <p className="mt-3 text-[11px] text-white/55">
                    Recurring matches will show on those days on the Matches page.
                  </p>
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          {/* Capacity */}
          <div className="rounded-2xl border border-white/10 bg-[#0A0A0A]/60 p-4 backdrop-blur-xl shadow-[0_18px_50px_rgba(0,0,0,0.9)]">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
              Capacity
            </p>

            {/* Glass label card (centered) */}
            <div className="mt-3 flex justify-center">
              <div className="w-full max-w-xs rounded-2xl border border-[#4B2E83]/25 bg-white/5 px-4 py-3 text-center backdrop-blur-xl shadow-[0_18px_50px_rgba(0,0,0,0.9)]">
                <span className="text-sm text-white/80">
                  <span className="font-semibold text-white/90">
                    {capacityBubbleText}
                  </span>
                </span>
              </div>
            </div>

            <div className="mt-4">
              {/* Min / Max numeric inputs */}
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <p className="mb-1 text-[11px] text-white/50">Min</p>
                  <input
                    type="number"
                    min={2}
                    max={10}
                    step={1}
                    placeholder="Min"
                    value={minCapacity || ""}
                    onChange={(e) => {
                      setMinCapacity(e.target.value);
                    }}
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/85 outline-none transition-colors placeholder:text-[#6B7280] focus:border-[#4B2E83] focus:ring-2 focus:ring-[#4B2E83]/35"
                  />
                </div>

                <span className="text-white/25 select-none text-sm">-</span>

                <div className="flex-1">
                  <p className="mb-1 text-[11px] text-white/50">Max</p>
                  <input
                    type="number"
                    min={2}
                    max={10}
                    step={1}
                    placeholder="Max"
                    value={maxCapacity || ""}
                    onChange={(e) => {
                      setMaxCapacity(e.target.value);
                    }}
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/85 outline-none transition-colors placeholder:text-[#6B7280] focus:border-[#4B2E83] focus:ring-2 focus:ring-[#4B2E83]/35"
                  />
                </div>
              </div>

              {capacityErrorText && (
                <p className="mt-2 text-[12px] text-red-400">
                  {capacityErrorText}
                </p>
              )}
            </div>
          </div>

          {/* Level selector */}
          <div className="rounded-2xl border border-white/10 bg-[#0A0A0A]/60 p-4 backdrop-blur-xl shadow-[0_18px_50px_rgba(0,0,0,0.9)]">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
              Skill Level (Recommended to pick 1-2)
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {LEVELS.map((l) => {
                const active = levels.includes(l);
                return (
                  <motion.button
                    key={l}
                    type="button"
                    onClick={() =>
                      setLevels((prev) =>
                        prev.includes(l)
                          ? prev.filter((x) => x !== l)
                          : [...prev, l],
                      )
                    }
                    whileTap={{ scale: 0.99 }}
                    className={[
                      "rounded-full px-4 py-2 text-[11px] font-semibold transition-all border",
                      active
                        ? "border-[#4B2E83]/90 bg-[#4B2E83]/35 text-[#E8D3A2] shadow-[0_0_18px_rgba(75,46,131,0.45)]"
                        : "border-white/10 bg-white/[0.03] text-white/65",
                    ].join(" ")}
                  >
                    {l}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Venue + notes */}
          <div className="rounded-2xl border border-white/10 bg-[#0A0A0A]/60 p-4 backdrop-blur-xl shadow-[0_18px_50px_rgba(0,0,0,0.9)]">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
              Venue
            </p>

            <div className="mt-3 relative overflow-visible" ref={venueWrapRef}>
              {/* Trigger */}
              <button
                type="button"
                onClick={() => setVenueOpen((o) => !o)}
                onFocus={() => setVenueFocused(true)}
                onBlur={() => setVenueFocused(false)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setVenueOpen(false);
                }}
                className={[
                  "relative flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm shadow-[0_12px_36px_rgba(0,0,0,0.7)] transition-colors outline-none",
                  "bg-white/5 backdrop-blur-xl border",
                  venueOpen || venueFocused
                    ? "border-[#4B2E83] shadow-[0_0_15px_rgba(75,46,131,0.3)]"
                    : "border-white/10",
                ].join(" ")}
              >
                <span
                  className={[
                    venue ? "text-white" : "text-white/60",
                    "truncate",
                  ].join(" ")}
                >
                  {venue ? venue : "Select a venue..."}
                </span>

                <ChevronDown
                  className={[
                    "h-4 w-4 text-white/60 transition-transform",
                    venueOpen ? "rotate-180" : "rotate-0",
                  ].join(" ")}
                />
              </button>

              {/* Dropdown */}
              <AnimatePresence>
                {venueOpen && (
                  <motion.div
                    key="venue-dropdown"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute mt-2 w-full z-[9999] max-h-48 overflow-y-auto rounded-2xl border border-white/10 bg-[#050505]/95 backdrop-blur-[12px] shadow-2xl
                      [&::-webkit-scrollbar]:w-2
                      [&::-webkit-scrollbar-thumb]:bg-[#4B2E83]
                      [&::-webkit-scrollbar-thumb]:rounded-full
                      [&::-webkit-scrollbar-track]:bg-transparent"
                    style={{
                      // Helps in non-WebKit engines.
                      scrollbarColor: "rgba(75,46,131,0.85) transparent",
                      scrollbarWidth: "thin",
                    }}
                  >
                    <div className="p-2">
                      {VENUE_GROUPS.map((group) => {
                        // Only render groups that have items in our available venue set.
                        const filtered = group.items.filter((x) => (VENUES as readonly string[]).includes(x));
                        if (!filtered.length) return null;
                        return (
                          <div key={group.label} className="mb-2 last:mb-0">
                            <div className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">
                              {group.label}
                            </div>

                            {filtered.map((item) => {
                              const active = venue === item;
                              return (
                                <button
                                  key={item}
                                  type="button"
                                  onClick={() => {
                                    setVenue(item);
                                    setVenueOpen(false);
                                  }}
                                  className={[
                                    "w-full px-3 py-2 text-left text-sm transition-colors rounded-xl",
                                    active
                                      ? "bg-[#4B2E83]/20 text-white"
                                      : "text-white/90 hover:bg-white/5",
                                  ].join(" ")}
                                >
                                  {item}
                                </button>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
                Additional Info
              </p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., bring your own racket, leave comment for pairing preferences..."
                className="mt-3 min-h-[104px] w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/80 shadow-[0_12px_36px_rgba(0,0,0,0.7)] focus:outline-none"
              />
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100"
            >
              {error}
            </motion.div>
          )}

          <AnimatePresence>
            {showSuccessModal && (
              <>
                <motion.div
                  className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setShowSuccessModal(false)}
                />
                <motion.div
                  className="fixed inset-0 z-[1010] flex items-center justify-center px-6"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                >
                  <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#050505]/90 p-6 text-center shadow-[0_0_0_1px_rgba(75,46,131,0.25),0_18px_70px_rgba(0,0,0,0.9)] backdrop-blur-2xl">
                    <div className="flex items-center justify-center">
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="flex h-14 w-14 items-center justify-center rounded-2xl"
                        style={{
                          backgroundColor: "rgba(75,46,131,0.25)",
                          boxShadow:
                            "0 0 0 1px rgba(75,46,131,0.35), 0 0 28px rgba(75,46,131,0.25)",
                        }}
                      >
                        <Trophy className="h-7 w-7" style={{ color: UW_GOLD }} />
                      </motion.div>
                    </div>

                    <h3 className="mt-4 text-xl font-semibold text-white">
                      Congratulations! Match Launched 🚀
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/70">
                      Your husky pack is on its way! Get ready for some serious action at
                      IMA.
                    </p>
                    <p className="mt-3 text-xs text-white/50">
                      (You can manage this match anytime in your Profile or the Community
                      feed.)
                    </p>

                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.99 }}
                      onClick={() => {
                        setShowSuccessModal(false);
                        router.push("/matches");
                      }}
                      className="mt-5 w-full rounded-2xl border border-[#4B2E83]/40 bg-[#4B2E83] px-5 py-3 text-sm font-semibold text-white shadow-[0_0_28px_rgba(75,46,131,0.55)] transition-colors hover:bg-[#5A3AB0]"
                    >
                      View in Community
                    </motion.button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-5">
          <motion.button
            type="button"
            whileTap={{ scale: 0.99 }}
            onClick={handleLaunchMatch}
            disabled={!isCapacityValid || !venue}
            className="relative z-10 w-full rounded-3xl border border-[#4B2E83]/40 bg-[#4B2E83] px-6 py-4 text-sm font-semibold text-white shadow-[0_0_28px_rgba(75,46,131,0.6)]"
            style={{
              boxShadow: `0 0 0 1px rgba(75,46,131,0.4), 0 0 36px rgba(75,46,131,0.35), 0 0 72px rgba(75,46,131,0.15)`,
            }}
          >
            <span className="relative z-10 inline-flex items-center justify-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Launch Match
            </span>
            <span
              className="absolute inset-0 rounded-3xl opacity-60"
              style={{
                background: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.18), transparent 62%)`,
                filter: "blur(8px)",
              }}
              aria-hidden
            />
          </motion.button>
        </div>
      </section>
    </motion.div>
  );
}

