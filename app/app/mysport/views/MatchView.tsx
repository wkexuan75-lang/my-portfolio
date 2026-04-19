"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useMatchContext,
  SPORTS,
  DAYS,
  TIME_SLOTS,
  type MatchCard,
  type Sport,
  type Day,
  type TimeSlot,
} from "@mysport/context/MatchContext";
import {
  Trophy,
  SlidersHorizontal,
  Clock,
  MapPin,
  Users as UsersIcon,
  MessageCircle,
  Check,
} from "lucide-react";

const UW_PURPLE = "#4B2E83";
const UW_GOLD = "#E8D3A2";

const formatDaysLabel = (days: Day[]) =>
  days.length === 1 ? days[0] : days.join(" · ");

export function MatchView() {
  const {
    allMatches,
    joinMatch,
    cancelMatch,
    getSpotsFilled,
    isJoined,
    currentUserId,
    removeMatch,
  } = useMatchContext();

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedSports, setSelectedSports] = useState<Sport[]>([]);
  const [selectedDays, setSelectedDays] = useState<Day[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<TimeSlot[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<MatchCard | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPointsToast, setShowPointsToast] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showHostDeleteConfirm, setShowHostDeleteConfirm] = useState(false);
  const [showJoinedToast, setShowJoinedToast] = useState(false);

  const toggleValue = <T,>(
    value: T,
    list: T[],
    setList: (next: T[]) => void,
  ) => {
    setList(
      list.includes(value)
        ? list.filter((v) => v !== value)
        : [...list, value],
    );
  };

  const filteredMatches = allMatches.filter((match) => {
    const sportOk =
      selectedSports.length === 0 || selectedSports.includes(match.sport);
    const dayOk =
      selectedDays.length === 0 ||
      match.days.some((d) => selectedDays.includes(d));
    const slotOk =
      selectedSlots.length === 0 || selectedSlots.includes(match.slot);
    return sportOk && dayOk && slotOk;
  });

  const hasAnyFilter =
    selectedSports.length > 0 ||
    selectedDays.length > 0 ||
    selectedSlots.length > 0;

  const handleToggleJoin = () => {
    if (!selectedMatch) return;
    if (isJoined(selectedMatch.id)) {
      setShowCancelConfirm(true);
    } else {
      joinMatch(selectedMatch.id);
      setShowJoinedToast(true);
      setTimeout(() => setShowJoinedToast(false), 1600);
      setShowSuccess(true);
      setShowPointsToast(true);
      setTimeout(() => {
        setShowPointsToast(false);
      }, 2200);
    }
  };

  const handleConfirmCancel = () => {
    if (!selectedMatch) return;
    cancelMatch(selectedMatch.id);
    setShowCancelConfirm(false);
    setSelectedMatch(null);
  };

  const handleHostManage = () => {
    if (!selectedMatch) return;
    setShowHostDeleteConfirm(true);
  };

  const handleConfirmHostDelete = () => {
    if (!selectedMatch) return;
    removeMatch(selectedMatch.id);
    setShowHostDeleteConfirm(false);
    setSelectedMatch(null);
  };

  return (
    <motion.div
      className="relative min-h-screen overflow-hidden bg-[#050505] font-sans"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <section className="relative z-10 px-6 pt-8 pb-4">
        <h1 className="text-xl font-semibold tracking-tight text-white">
          Match Center
        </h1>
        <p className="mt-1 text-sm text-white/55">
          Curated runs and scrimmages at the IMA.
        </p>
      </section>

      {/* Filters summary + toggle */}
      <section className="relative z-10 px-6 pb-2">
        <button
          type="button"
          onClick={() => setFiltersOpen((open) => !open)}
          className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-[#0A0A0A]/60 px-3.5 py-2 text-left text-xs text-white/70 shadow-[0_14px_40px_rgba(0,0,0,0.85)] backdrop-blur-xl"
        >
          <div className="flex flex-1 flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-[3px] text-[10px] uppercase tracking-wide text-white/50">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: UW_PURPLE }}
              />
              Filters
            </span>
            {hasAnyFilter ? (
              <>
                {selectedSports.length > 0 && (
                  <span className="rounded-full bg-white/5 px-2 py-[3px] text-[11px] text-white/70">
                    {selectedSports.join(" · ")}
                  </span>
                )}
                {selectedDays.length > 0 && (
                  <span className="rounded-full bg-white/5 px-2 py-[3px] text-[11px] text-white/60">
                    {selectedDays.join(" ")}
                  </span>
                )}
                {selectedSlots.length > 0 && (
                  <span className="rounded-full bg-white/5 px-2 py-[3px] text-[11px] text-white/60">
                    {selectedSlots.length === 1
                      ? selectedSlots[0]
                      : "Multiple time windows"}
                  </span>
                )}
              </>
            ) : (
              <span className="text-[11px] text-white/45">
                All sports · Any day · Any time
              </span>
            )}
          </div>
          <span className="ml-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/5 text-white/70">
            <SlidersHorizontal className="h-3.5 w-3.5" />
          </span>
        </button>
      </section>

      {/* Expanded multi-tier filters */}
      <AnimatePresence initial={false}>
        {filtersOpen && (
          <motion.section
            key="filters-panel"
            initial={{ opacity: 0, y: -6, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -6, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative z-10 px-6 pb-3"
          >
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A0A]/60 p-3.5 text-xs text-white/70 shadow-[0_18px_50px_rgba(0,0,0,0.9)] backdrop-blur-xl">
              {/* Row 1: Sports grid */}
              <div className="mb-3">
                <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-white/45">
                  Sports
                </p>
                <div className="grid grid-cols-3 gap-1.5">
                  {SPORTS.map((sport) => {
                    const active = selectedSports.includes(sport);
                    return (
                      <button
                        key={sport}
                        type="button"
                        onClick={() =>
                          toggleValue<Sport>(sport, selectedSports, setSelectedSports)
                        }
                        className={[
                          "flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-[11px] font-medium transition-all",
                          active
                            ? "border border-[#4B2E83]/80 bg-[#4B2E83]/25 text-[#E8D3A2] shadow-[0_0_20px_rgba(75,46,131,0.55)]"
                            : "border border-white/10 bg-white/[0.03] text-white/65",
                        ].join(" ")}
                      >
                        <span
                          className="flex h-4 w-4 items-center justify-center rounded-full border border-white/30 text-[8px]"
                          style={active ? { borderColor: UW_GOLD } : undefined}
                        >
                          {sport[0]}
                        </span>
                        <span className="truncate">{sport}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 2: Days row */}
              <div className="mb-3">
                <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-white/45">
                  Days
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {DAYS.map((day) => {
                    const active = selectedDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() =>
                          toggleValue<Day>(day, selectedDays, setSelectedDays)
                        }
                        className={[
                          "min-w-[2.3rem] rounded-full px-2 py-1 text-[11px] font-medium transition-all",
                          active
                            ? "border border-[#4B2E83]/90 bg-[#4B2E83]/40 text-[#E8D3A2] shadow-[0_0_16px_rgba(75,46,131,0.6)]"
                            : "border border-white/12 bg-white/[0.03] text-white/65",
                        ].join(" ")}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 3: Time slots */}
              <div>
                <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-white/45">
                  Time of day
                </p>
                <div className="flex flex-col gap-1.5">
                  {TIME_SLOTS.map((slot) => {
                    const active = selectedSlots.includes(slot);
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() =>
                          toggleValue<TimeSlot>(slot, selectedSlots, setSelectedSlots)
                        }
                        className={[
                          "flex items-center justify-between rounded-2xl px-3 py-2.5 text-[11px] font-medium transition-all",
                          active
                            ? "border border-[#4B2E83]/90 bg-[#4B2E83]/35 text-[#E8D3A2] shadow-[0_0_22px_rgba(75,46,131,0.7)]"
                            : "border border-white/12 bg-white/[0.03] text-white/70",
                        ].join(" ")}
                      >
                        <span>{slot}</span>
                        {active && (
                          <span className="h-1.5 w-5 rounded-full bg-gradient-to-r from-[#4B2E83] to-[#E8D3A2]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showJoinedToast && (
          <motion.div
            className="pointer-events-none fixed bottom-24 left-1/2 z-80 -translate-x-1/2 rounded-full border border-[#4B2E83]/55 bg-black/90 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_22px_rgba(75,46,131,0.45)]"
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2 }}
          >
            Joined! 🐾
          </motion.div>
        )}
      </AnimatePresence>

      {/* Match cards */}
      <section className="relative z-10 px-6 pb-24">
        <div className="space-y-3">
          {filteredMatches.map((match, index) => {
            const matchIsJoined = isJoined(match.id);
            const matchIsHostedByYou = match.hostId === currentUserId;
            const displayFilled = getSpotsFilled(match.id, match.filled);
            const fillPercent = Math.round(
              (displayFilled / match.capacity.max) * 100,
            );
            const isNearlyFull = fillPercent >= 75;
            const levelText =
              match.levels.length === 1
                ? match.levels[0]
                : match.levels.join(" · ");

            return (
              <motion.button
                key={match.id}
                type="button"
                onClick={() => setSelectedMatch(match)}
                className={`relative flex w-full items-stretch gap-3 rounded-2xl bg-gradient-to-br from-white/[0.02] via-white/[0.01] to-white/[0.02] px-3.5 py-3 text-left shadow-[0_18px_60px_rgba(0,0,0,0.85)] border ${
                  matchIsHostedByYou
                    ? "border-2 border-[#4B2E83]/90 shadow-[0_0_0_1px_rgba(75,46,131,0.35),0_0_26px_rgba(75,46,131,0.25)] animate-[pulse_2s_ease-in-out_infinite]"
                    : matchIsJoined
                      ? "border-2 border-[#E8D3A2] shadow-[0_0_10px_rgba(232,211,162,0.3)]"
                      : "border-transparent"
                }`}
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.28, delay: 0.05 * index, ease: "easeOut" }}
                whileTap={{ scale: 0.97 }}
              >
                {matchIsHostedByYou && (
                  <span className="absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-full border border-[#4B2E83]/60 bg-[#4B2E83]/15 px-2 py-[2px] text-[10px] font-semibold uppercase tracking-wide text-white shadow-[0_0_18px_rgba(75,46,131,0.35)]">
                    Hosted by You
                  </span>
                )}
                {/* Left: icon */}
                <div className="flex items-center">
                  <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-[#4B2E83]/20">
                    <div className="absolute inset-0 rounded-2xl bg-[#4B2E83]/40 blur-xl opacity-60" />
                    <Trophy className="relative h-5 w-5" style={{ color: UW_GOLD }} />
                  </div>
                </div>

                {/* Middle: title, time, location */}
                <div className="flex min-w-0 flex-1 flex-col justify-center">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-sm font-semibold text-white">
                      {match.title}
                    </p>
                    <span className="rounded-full bg-white/5 px-2 py-[2px] text-[10px] uppercase tracking-wide text-white/45">
                      {match.sport}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-white/55">
                    <span>{formatDaysLabel(match.days)}</span>
                    <span className="h-0.5 w-0.5 rounded-full bg-white/35" />
                    <span>{match.time}</span>
                    <span className="h-0.5 w-0.5 rounded-full bg-white/35" />
                    <span className="truncate text-white/45">{match.location}</span>
                    <AnimatePresence>
                      {matchIsJoined && (
                        <motion.span
                          key="registered-badge"
                          initial={{ opacity: 0, scale: 0.6 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.6 }}
                          transition={{ duration: 0.18, ease: "easeOut" }}
                          className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-[2px] text-[10px] font-semibold uppercase tracking-wide text-emerald-400"
                        >
                          <Check className="h-3 w-3" />
                          <span>Registered</span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Right: spots + level */}
                <div className="flex flex-col items-end gap-1 text-right">
                  <div className="flex items-center gap-1 text-[11px]">
                    <span className="rounded-full bg-black/60 px-2 py-[3px] text-white/60">
                        {displayFilled}/{match.capacity.max} filled
                    </span>
                  </div>
                  <span className="rounded-full bg-white/5 px-2 py-[3px] text-[10px] uppercase tracking-wide text-white/60">
                    {match.capacityLabel}
                  </span>
                  <span
                    className={[
                      "mt-1 rounded-full px-2 py-[3px] text-[10px] uppercase tracking-wide",
                      isNearlyFull
                        ? "bg-[#E8D3A2]/90 text-black"
                        : "bg-[#E8D3A2]/70 text-black/80",
                    ].join(" ")}
                  >
                    {levelText}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* Details modal */}
      <AnimatePresence>
        {selectedMatch && (
          <>
            {/* Overlay */}
            <motion.button
              type="button"
              aria-label="Close match details"
              className="fixed inset-0 z-40 bg-black/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSelectedMatch(null)}
            />

            {/* Bottom sheet */}
            <motion.div
              className="fixed inset-x-0 bottom-0 z-50"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              <div className="mx-auto max-w-md rounded-t-3xl border border-white/10 border-b-0 bg-[#0A0A0A]/70 pb-6 pt-3 shadow-[0_-24px_80px_rgba(0,0,0,0.95)] backdrop-blur-2xl">
                {/* Drag handle */}
                <div className="mb-3 flex justify-center">
                  <div className="h-1 w-10 rounded-full bg-white/15" />
                </div>

                <div className="px-5">
                  {/* Header title */}
                  <h2 className="text-lg font-semibold tracking-tight text-white">
                    {selectedMatch.title}
                  </h2>
                  <p className="mt-1 text-xs text-white/45">
                    {selectedMatch.sport} ·{" "}
                    {formatDaysLabel(selectedMatch.days)} ·{" "}
                    {selectedMatch.location}
                  </p>

                  {/* Tag row */}
                  <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                    {(() => {
                      const displayFilled = selectedMatch
                        ? getSpotsFilled(selectedMatch.id, selectedMatch.filled)
                        : 0;
                      const levelText =
                        selectedMatch.levels.length === 1
                          ? selectedMatch.levels[0]
                          : selectedMatch.levels.join(" · ");
                      return (
                        <>
                          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/6 px-2.5 py-1 text-white/80">
                            <Clock className="h-3.5 w-3.5 text-white/60" />
                            <span>
                              {formatDaysLabel(selectedMatch.days)}{" "}
                              {selectedMatch.time}
                            </span>
                          </div>
                          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/6 px-2.5 py-1 text-white/80">
                            <MapPin className="h-3.5 w-3.5 text-white/60" />
                            <span>{selectedMatch.location}</span>
                          </div>
                          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/6 px-2.5 py-1 text-white/80">
                            <UsersIcon className="h-3.5 w-3.5 text-white/60" />
                            <span>
                              {displayFilled}/{selectedMatch.capacity.max} filled
                            </span>
                          </div>
                          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/6 px-2.5 py-1 text-white/80">
                            <span>{selectedMatch.capacityLabel}</span>
                          </div>
                          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E8D3A2]/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-black">
                            <span className="h-1.5 w-1.5 rounded-full bg-black/70" />
                            <span>{levelText}</span>
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  {/* Sections */}
                  <div className="mt-4 space-y-3 text-xs text-white/70">
                    <div>
                      <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">
                        Activity Content
                      </p>
                      <p className="leading-relaxed text-white/70">
                        High-energy run designed for UW students looking to join
                        a focused, friendly match. Warm-up, structured play, and
                        cool-down included.
                      </p>
                    </div>

                    <div>
                      <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">
                        Notes
                      </p>
                      <p className="leading-relaxed text-white/70">
                        {selectedMatch.notes.trim()
                          ? selectedMatch.notes
                          : "Please arrive 10 minutes early to check in at the IMA front desk. Bring your Husky Card and appropriate gear."}
                      </p>
                    </div>

                    <div>
                      <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">
                        Organizer Info
                      </p>
                      <p className="leading-relaxed text-white/70">
                        Hosted by UW Recreation · Intramurals. Match host will
                        confirm final rosters 2 hours before start time.
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={
                        selectedMatch && selectedMatch.hostId === currentUserId
                          ? handleHostManage
                          : handleToggleJoin
                      }
                      className={`flex-1 rounded-full px-4 py-3 text-center text-sm font-semibold transition-transform active:scale-[0.97] ${
                        selectedMatch && selectedMatch.hostId === currentUserId
                          ? "bg-[#4B2E83] text-white shadow-[0_0_24px_rgba(75,46,131,0.7)]"
                          : selectedMatch && isJoined(selectedMatch.id)
                            ? "border border-white/20 bg-white/5 text-white/80"
                            : "bg-[#4B2E83] text-white shadow-[0_0_24px_rgba(75,46,131,0.7)]"
                      }`}
                    >
                      {selectedMatch && selectedMatch.hostId === currentUserId
                        ? "Manage"
                        : selectedMatch && isJoined(selectedMatch.id)
                          ? "Cancel Match"
                          : "Join Match"}
                    </button>
                    <button
                      type="button"
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-transform active:scale-[0.97]"
                      aria-label="Message host"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Success notification */}
      <AnimatePresence>
        {showSuccess && (
          <>
            <motion.div
              className="fixed inset-0 z-60 bg-black/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setShowSuccess(false)}
            />
            <motion.div
              className="fixed inset-0 z-70 flex items-center justify-center px-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#050505]/95 p-5 text-center shadow-[0_20px_80px_rgba(0,0,0,0.95)] backdrop-blur-xl">
                <h3 className="text-lg font-semibold text-white">
                  Success! You&apos;re in! 🎉
                </h3>
                <p className="mt-2 text-sm text-white/70">
                  Don&apos;t forget to bring your gear (racket, sports shoes, water).
                  We look forward to seeing you at the IMA!
                </p>
                <button
                  type="button"
                  className="mt-4 inline-flex items-center justify-center rounded-full bg-white/10 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/15 transition-colors"
                  onClick={() => setShowSuccess(false)}
                >
                  Great!
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Cancel confirmation modal */}
      <AnimatePresence>
        {showCancelConfirm && selectedMatch && (
          <>
            <motion.div
              className="fixed inset-0 z-60 bg-black/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setShowCancelConfirm(false)}
            />
            <motion.div
              className="fixed inset-0 z-70 flex items-center justify-center px-6"
              initial={{ opacity: 0, x: -4, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 4, scale: 0.97 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <motion.div
                className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#050505]/95 p-5 text-center shadow-[0_20px_80px_rgba(0,0,0,0.95)] backdrop-blur-xl"
                initial={{ x: 0 }}
                animate={{ x: [0, -4, 4, -2, 2, 0] }}
                transition={{ duration: 0.28, ease: "easeInOut" }}
              >
                <h3 className="text-lg font-semibold text-white">
                  Are you sure? 🥺
                </h3>
                <p className="mt-2 text-sm text-white/70">
                  We were really looking forward to seeing you at the IMA! Are you
                  sure you want to give up your spot?
                </p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.96 }}
                    className="flex-1 rounded-full border border-white/15 bg-white/8 px-4 py-2.5 text-sm font-medium text-white/80"
                    onClick={handleConfirmCancel}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.96 }}
                    className="flex-1 rounded-full bg-[#4B2E83] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_0_18px_rgba(75,46,131,0.7)]"
                    onClick={() => setShowCancelConfirm(false)}
                  >
                    Later
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Host delete confirmation modal */}
      <AnimatePresence>
        {showHostDeleteConfirm && selectedMatch && (
          <>
            <motion.div
              className="fixed inset-0 z-60 bg-black/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setShowHostDeleteConfirm(false)}
            />
            <motion.div
              className="fixed inset-0 z-70 flex items-center justify-center px-6"
              initial={{ opacity: 0, x: -4, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 4, scale: 0.97 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <motion.div
                className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#050505]/95 p-5 text-center shadow-[0_20px_80px_rgba(0,0,0,0.95)] backdrop-blur-xl"
                initial={{ x: 0 }}
                animate={{ x: [0, -4, 4, -2, 2, 0] }}
                transition={{ duration: 0.28, ease: "easeInOut" }}
              >
                <h3 className="text-lg font-semibold text-white">
                  Manage this match?
                </h3>
                <p className="mt-2 text-sm text-white/70">
                  As the host, you can remove it from the Community feed.
                </p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.96 }}
                    className="flex-1 rounded-full border border-white/15 bg-white/8 px-4 py-2.5 text-sm font-medium text-white/80"
                    onClick={() => setShowHostDeleteConfirm(false)}
                  >
                    Keep
                  </motion.button>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.96 }}
                    className="flex-1 rounded-full bg-[#4B2E83] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_0_18px_rgba(75,46,131,0.7)]"
                    onClick={handleConfirmHostDelete}
                  >
                    Remove Match
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Reliability points toast */}
      <AnimatePresence>
        {showPointsToast && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 flex items-center gap-2 rounded-full bg-[#0A0A0A]/80 px-3 py-2 text-xs text-[#E8D3A2] shadow-[0_10px_40px_rgba(0,0,0,0.9)] backdrop-blur-xl"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#E8D3A2]" />
            <span>+10 Reliability Points</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

