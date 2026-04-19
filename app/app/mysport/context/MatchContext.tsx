"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { supabase } from "@mysport/lib/supabase";

export const SPORTS = [
  "Badminton",
  "Basketball",
  "Soccer",
  "Swimming",
  "Tennis",
] as const;
export type Sport = (typeof SPORTS)[number];

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
export type Day = (typeof DAYS)[number];

export const TIME_SLOTS = [
  "Morning (9-12)",
  "Afternoon (12-6)",
  "Evening (6-10)",
] as const;
export type TimeSlot = (typeof TIME_SLOTS)[number];

export const LEVELS = ["Beginner", "Intermediate", "Advanced", "Pro"] as const;
export type SkillLevel = (typeof LEVELS)[number];

export type MatchFrequency = "single" | "recurring";
export type JoinedMatchStatus = "upcoming" | "completed" | "missed";

export type MatchCard = {
  id: number;
  hostId: string;
  creatorId: string;
  frequency: MatchFrequency;
  sport: Sport;
  days: Day[]; // always length >= 1
  startTime: string; // "HH:MM" 24h
  endTime: string; // "HH:MM" 24h
  durationMinutes: number;
  slot: TimeSlot; // derived from startTime
  title: string;
  time: string; // display string (e.g., "6:15 PM - 7:30 PM")
  location: string;
  filled: number; // base filled (not including the current user)
  capacity: { min: number; max: number };
  capacityLabel: string;
  levels: SkillLevel[]; // selection can include multiple levels
  notes: string;
  attendees: string[];
};

const CURRENT_USER_ID_KEY = "uw-sport-current-user-id";
const SYSTEM_HOST_ID = "system";

type MatchContextValue = {
  joinedMatchIds: number[];
  joinedMatches: Record<number, JoinedMatchStatus>;
  acceptedGuestsCount: Record<number, number>;
  allMatches: MatchCard[];
  currentUserId: string;
  removeMatch: (matchId: number) => void;
  joinMatch: (matchId: number) => void;
  cancelMatch: (matchId: number) => void;
  setJoinedMatchStatus: (matchId: number, status: JoinedMatchStatus) => void;
  acceptGuestRequest: (matchId: number) => void;
  addMatch: (match: MatchCard) => void;
  checkInAttendee: (matchId: number, attendeeId: string) => void;
  getSpotsFilled: (matchId: number, baseFilled: number) => number;
  isJoined: (matchId: number) => boolean;
};

const MatchContext = createContext<MatchContextValue | null>(null);

export function MatchProvider({ children }: { children: React.ReactNode }) {
  const [joinedMatchIds, setJoinedMatchIds] = useState<number[]>([]);
  const [joinedMatches, setJoinedMatches] = useState<
    Record<number, JoinedMatchStatus>
  >({});
  const [acceptedGuestsCount, setAcceptedGuestsCount] = useState<
    Record<number, number>
  >({});
  const [currentUserId] = useState<string>(() => {
    try {
      if (typeof window === "undefined") return "guest";
      const raw = localStorage.getItem(CURRENT_USER_ID_KEY);
      if (raw && typeof raw === "string") return raw;
      const next =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      localStorage.setItem(CURRENT_USER_ID_KEY, next);
      return next;
    } catch {
      return "guest";
    }
  });
  const [allMatches, setAllMatches] = useState<MatchCard[]>(() => {
    // Seed data: matches page previously used a hard-coded list.
    // We keep the same cards but store richer time/day state so the Create page can add new ones.
    const parse12hToMinutes = (time12h: string) => {
      // Example input: "5:00 PM", "6:15 PM", "3:30 PM"
      const m = time12h.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
      if (!m) return 12 * 60;
      let hours = Number(m[1]);
      const minutes = Number(m[2]);
      const ampm = m[3].toUpperCase();
      if (ampm === "PM" && hours !== 12) hours += 12;
      if (ampm === "AM" && hours === 12) hours = 0;
      return hours * 60 + minutes;
    };

    const minutesToHHMM = (totalMinutes: number) => {
      const clamped = Math.max(0, Math.round(totalMinutes));
      const h = Math.floor(clamped / 60);
      const m = clamped % 60;
      const hh = String(h).padStart(2, "0");
      const mm = String(m).padStart(2, "0");
      return `${hh}:${mm}`;
    };

    const minutesTo12h = (totalMinutes: number) => {
      const minutes = Math.max(0, Math.round(totalMinutes));
      const h24 = Math.floor(minutes / 60);
      const m = minutes % 60;
      const suffix = h24 >= 12 ? "PM" : "AM";
      const h12raw = h24 % 12;
      const h12 = h12raw === 0 ? 12 : h12raw;
      return `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
    };

    const getSlotFromStartMinutes = (startMinutes: number): TimeSlot => {
      // Slot buckets align with the Matches page UI.
      const h = Math.floor(startMinutes / 60);
      if (h >= 9 && h < 12) return "Morning (9-12)";
      if (h >= 12 && h < 18) return "Afternoon (12-6)";
      return "Evening (6-10)";
    };

    const formatTimeRange = (startMinutes: number, endMinutes: number) => {
      return `${minutesTo12h(startMinutes)} - ${minutesTo12h(endMinutes)}`;
    };

    const durationDefault = 60;
    const seeded = [
      {
        id: 1,
        hostId: SYSTEM_HOST_ID,
        frequency: "single" as const,
        sport: "Badminton" as const,
        day: "Mon" as const,
        slot: "Afternoon (12-6)" as const,
        title: "Intramural Badminton",
        time: "5:00 PM",
        location: "IMA Court 3",
        filled: 2,
        capacity: 4,
        level: "Intermediate" as const,
      },
      {
        id: 2,
        hostId: SYSTEM_HOST_ID,
        frequency: "single" as const,
        sport: "Basketball" as const,
        day: "Wed" as const,
        slot: "Evening (6-10)" as const,
        title: "Pickup Basketball Run",
        time: "6:15 PM",
        location: "IMA Court 1",
        filled: 7,
        capacity: 10,
        level: "Advanced" as const,
      },
      {
        id: 3,
        hostId: SYSTEM_HOST_ID,
        frequency: "single" as const,
        sport: "Soccer" as const,
        day: "Fri" as const,
        slot: "Evening (6-10)" as const,
        title: "Small-Sided Soccer",
        time: "7:00 PM",
        location: "IMA Turf A",
        filled: 8,
        capacity: 12,
        level: "Intermediate" as const,
      },
      {
        id: 4,
        hostId: SYSTEM_HOST_ID,
        frequency: "single" as const,
        sport: "Swimming" as const,
        day: "Sat" as const,
        slot: "Morning (9-12)" as const,
        title: "Lap Swim Squad",
        time: "4:30 PM",
        location: "IMA Pool Lanes 5–6",
        filled: 4,
        capacity: 6,
        level: "Beginner" as const,
      },
      {
        id: 5,
        hostId: SYSTEM_HOST_ID,
        frequency: "single" as const,
        sport: "Tennis" as const,
        day: "Thu" as const,
        slot: "Afternoon (12-6)" as const,
        title: "Doubles Tennis Ladder",
        time: "3:30 PM",
        location: "IMA Courts 7–8",
        filled: 3,
        capacity: 4,
        level: "Advanced" as const,
      },
    ];

    return seeded.map((m) => {
      const startMinutes = parse12hToMinutes(m.time);
      const endMinutes = startMinutes + durationDefault;
      return {
        id: m.id,
        hostId: m.hostId,
        creatorId: m.hostId,
        frequency: m.frequency,
        sport: m.sport,
        days: [m.day],
        startTime: minutesToHHMM(startMinutes),
        endTime: minutesToHHMM(endMinutes),
        durationMinutes: durationDefault,
        slot: getSlotFromStartMinutes(startMinutes),
        title: m.title,
        time: formatTimeRange(startMinutes, endMinutes),
        location: m.location,
        filled: m.filled,
        capacity: { min: m.capacity, max: m.capacity },
        capacityLabel: `${m.capacity} players`,
        levels: [m.level],
        notes: "",
        attendees: [],
      };
    });
  });

  const fetchRemoteState = useCallback(async () => {
    const { data: matchRows, error: matchesError } = await supabase
      .from("matches")
      .select("*")
      .order("id", { ascending: false });

    if (matchesError) return;

    const { data: attendanceRows } = await supabase
      .from("attendance")
      .select("match_id,user_id,status,checked_in");

    const joinedByMatch: Record<number, JoinedMatchStatus> = {};
    const checkedInByMatch: Record<number, string[]> = {};

    for (const row of attendanceRows ?? []) {
      const matchId = Number((row as { match_id: number }).match_id);
      const userId = String((row as { user_id: string }).user_id ?? "");
      if (!Number.isFinite(matchId) || !userId) continue;

      if (userId === currentUserId) {
        const status = (row as { status?: string }).status;
        joinedByMatch[matchId] =
          status === "completed" || status === "missed" ? status : "upcoming";
      }

      if ((row as { checked_in?: boolean }).checked_in) {
        checkedInByMatch[matchId] = [...(checkedInByMatch[matchId] ?? []), userId];
      }
    }

    const normalized = (matchRows ?? [])
      .map((row) => {
        const r = row as Record<string, unknown>;
        const id = Number(r.id);
        if (!Number.isFinite(id)) return null;
        const days = Array.isArray(r.days)
          ? (r.days.filter((d) => typeof d === "string") as Day[])
          : (["Mon"] as Day[]);
        const levels = Array.isArray(r.levels)
          ? (r.levels.filter((l) => typeof l === "string") as SkillLevel[])
          : (["Beginner"] as SkillLevel[]);
        const capacityMin = Number(r.capacity_min ?? 2);
        const capacityMax = Number(r.capacity_max ?? capacityMin);
        return {
          id,
          hostId: String(r.host_id ?? SYSTEM_HOST_ID),
          creatorId: String(r.creator_id ?? r.host_id ?? SYSTEM_HOST_ID),
          frequency: (r.frequency === "recurring" ? "recurring" : "single") as MatchFrequency,
          sport: String(r.sport ?? "Badminton") as Sport,
          days: days.length ? days : (["Mon"] as Day[]),
          startTime: String(r.start_time ?? "18:00"),
          endTime: String(r.end_time ?? "19:00"),
          durationMinutes: Number(r.duration_minutes ?? 60),
          slot: String(r.slot ?? "Evening (6-10)") as TimeSlot,
          title: String(r.title ?? "Match"),
          time: String(r.time ?? ""),
          location: String(r.location ?? ""),
          filled: Number(r.filled ?? 0),
          capacity: {
            min: Math.min(capacityMin, capacityMax),
            max: Math.max(capacityMin, capacityMax),
          },
          capacityLabel: String(r.capacity_label ?? `${capacityMin}-${capacityMax} players`),
          levels: levels.length ? levels : (["Beginner"] as SkillLevel[]),
          notes: String(r.notes ?? ""),
          attendees: checkedInByMatch[id] ?? [],
        } as MatchCard;
      })
      .filter((m): m is MatchCard => m !== null);

    if (normalized.length > 0) setAllMatches(normalized);
    setJoinedMatches(joinedByMatch);
    setJoinedMatchIds(Object.keys(joinedByMatch).map((k) => Number(k)));
  }, [currentUserId]);

  useEffect(() => {
    // Keep a lightweight profile row in sync for realtime lookups.
    supabase
      .from("profiles")
      .upsert(
        {
          user_id: currentUserId,
          husky_id: `HUSKY-${currentUserId.replace(/[^a-zA-Z0-9]/g, "").slice(-8).toUpperCase()}`,
        },
        { onConflict: "user_id" },
      )
      .then(() => undefined);
    fetchRemoteState().then(() => undefined);

    const channel = supabase
      .channel(`match-sync-${currentUserId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "matches" },
        () => fetchRemoteState().then(() => undefined),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "attendance" },
        () => fetchRemoteState().then(() => undefined),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId, fetchRemoteState]);

  const joinMatch = useCallback((matchId: number) => {
    setJoinedMatchIds((ids) => (ids.includes(matchId) ? ids : [...ids, matchId]));
    setJoinedMatches((prev) => ({
      ...prev,
      [matchId]: prev[matchId] ?? "upcoming",
    }));
    supabase
      .from("attendance")
      .upsert(
        {
          match_id: matchId,
          user_id: currentUserId,
          status: "upcoming",
          checked_in: false,
        },
        { onConflict: "match_id,user_id" },
      )
      .then(() => undefined);
  }, [currentUserId]);

  const cancelMatch = useCallback((matchId: number) => {
    setJoinedMatchIds((ids) => ids.filter((id) => id !== matchId));
    setJoinedMatches((prev) => {
      if (!(matchId in prev)) return prev;
      const next = { ...prev };
      delete next[matchId];
      return next;
    });
    supabase
      .from("attendance")
      .delete()
      .eq("match_id", matchId)
      .eq("user_id", currentUserId)
      .then(() => undefined);
  }, [currentUserId]);

  const setJoinedMatchStatus = useCallback(
    (matchId: number, status: JoinedMatchStatus) => {
      setJoinedMatches((prev) => {
        if (!(matchId in prev)) return prev;
        return { ...prev, [matchId]: status };
      });
      supabase
        .from("attendance")
        .update({ status })
        .eq("match_id", matchId)
        .eq("user_id", currentUserId)
        .then(() => undefined);
    },
    [currentUserId],
  );

  const acceptGuestRequest = useCallback((matchId: number) => {
    setAcceptedGuestsCount((prev) => ({
      ...prev,
      [matchId]: (prev[matchId] ?? 0) + 1,
    }));
  }, []);

  const getSpotsFilled = useCallback(
    (matchId: number, baseFilled: number) => {
      const self = joinedMatchIds.includes(matchId) ? 1 : 0;
      const guests = acceptedGuestsCount[matchId] ?? 0;
      return baseFilled + self + guests;
    },
    [joinedMatchIds, acceptedGuestsCount],
  );

  const isJoined = useCallback(
    (matchId: number) => matchId in joinedMatches,
    [joinedMatches],
  );

  const addMatch = useCallback((match: MatchCard) => {
    setAllMatches((prev) => {
      if (prev.some((m) => m.id === match.id)) return prev;
      return [match, ...prev];
    });
    supabase
      .from("matches")
      .upsert(
        {
          id: match.id,
          host_id: match.hostId,
          creator_id: match.creatorId,
          frequency: match.frequency,
          sport: match.sport,
          days: match.days,
          start_time: match.startTime,
          end_time: match.endTime,
          duration_minutes: match.durationMinutes,
          slot: match.slot,
          title: match.title,
          time: match.time,
          location: match.location,
          filled: match.filled,
          capacity_min: match.capacity.min,
          capacity_max: match.capacity.max,
          capacity_label: match.capacityLabel,
          levels: match.levels,
          notes: match.notes,
        },
        { onConflict: "id" },
      )
      .then(() => undefined);
  }, []);

  const checkInAttendee = useCallback((matchId: number, attendeeId: string) => {
    const normalized = attendeeId.trim();
    if (!normalized) return;
    setAllMatches((prev) =>
      prev.map((m) => {
        if (m.id !== matchId) return m;
        if (m.attendees.includes(normalized)) return m;
        return {
          ...m,
          attendees: [...m.attendees, normalized],
        };
      }),
    );
    supabase
      .from("attendance")
      .upsert(
        {
          match_id: matchId,
          user_id: normalized,
          checked_in: true,
          status: "completed",
          checked_in_at: new Date().toISOString(),
        },
        { onConflict: "match_id,user_id" },
      )
      .then(() => undefined);
  }, []);

  const removeMatch = useCallback((matchId: number) => {
    setAllMatches((prev) => prev.filter((m) => m.id !== matchId));
    setJoinedMatchIds((ids) => ids.filter((id) => id !== matchId));
    setAcceptedGuestsCount((prev) => {
      if (!(matchId in prev)) return prev;
      const next: Record<number, number> = { ...prev };
      delete next[matchId];
      return next;
    });
    setJoinedMatches((prev) => {
      if (!(matchId in prev)) return prev;
      const next = { ...prev };
      delete next[matchId];
      return next;
    });
    supabase.from("attendance").delete().eq("match_id", matchId).then(() => undefined);
    supabase.from("matches").delete().eq("id", matchId).then(() => undefined);
  }, []);

  const value: MatchContextValue = {
    joinedMatchIds,
    joinedMatches,
    acceptedGuestsCount,
    allMatches,
    currentUserId,
    removeMatch,
    joinMatch,
    cancelMatch,
    setJoinedMatchStatus,
    acceptGuestRequest,
    addMatch,
    checkInAttendee,
    getSpotsFilled,
    isJoined,
  };

  return (
    <MatchContext.Provider value={value}>{children}</MatchContext.Provider>
  );
}

export function useMatchContext(): MatchContextValue {
  const ctx = useContext(MatchContext);
  if (!ctx) {
    throw new Error("useMatchContext must be used within MatchProvider");
  }
  return ctx;
}
