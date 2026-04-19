"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import {
  Edit2,
  UserPlus,
  Trophy,
  ChevronRight,
  ChevronDown,
  Dumbbell,
  Volleyball,
  PlusCircle,
  Plus,
  Check,
  X,
  Search,
  Camera,
  QrCode,
  Lock,
} from "lucide-react";
import {
  useMatchContext,
  SPORTS,
  LEVELS,
  type MatchCard,
  type SkillLevel,
  type Sport,
} from "@mysport/context/MatchContext";
import { defaultAvatarDataUri } from "@mysport/lib/avatarPlaceholder";
import {
  SESSION_LOGIN_NETID,
  STORAGE_PROFILE_BIO,
  STORAGE_PROFILE_LEVELS,
  STORAGE_PROFILE_NAME,
  STORAGE_PROFILE_PHOTO,
  STORAGE_PROFILE_SPORTS,
} from "@mysport/lib/profileStorage";

type TabKey = "badges" | "hosted" | "joined";

function huskyIdFromUserId(userId: string) {
  const tail = userId.replace(/[^a-zA-Z0-9]/g, "").slice(-8).toUpperCase();
  return `HUSKY-${tail || "00000000"}`;
}

function computeSkillLevelFromCount(count: number): SkillLevel {
  if (count >= 6) return "Pro";
  if (count >= 4) return "Advanced";
  if (count >= 2) return "Intermediate";
  return "Beginner";
}

function matchCreatedAtFallback(match: MatchCard) {
  // Newly created matches use Date.now() for `id` (13 digits).
  // Seeded matches use small ids; we map them to a stable recent-ish time.
  const now = Date.now();
  if (match.id > 10_000_000_000) return match.id;
  return now - (10 - match.id) * 86400000;
}

function formatMatchDate(ts: number) {
  const d = new Date(ts);
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

function formatMatchTime(match: MatchCard) {
  // MatchContext stores a single display time range (e.g., "6:15 PM - 7:15 PM")
  // We keep it minimalist.
  return match.time;
}

function parseHHMMToMinutes(hhmm: string) {
  const m = hhmm.match(/^(\d{2}):(\d{2})$/);
  if (!m) return null;
  const hh = Number(m[1]);
  const mm = Number(m[2]);
  if (!Number.isFinite(hh) || !Number.isFinite(mm)) return null;
  if (hh < 0 || hh > 23 || mm < 0 || mm > 59) return null;
  return hh * 60 + mm;
}

function dayToJsIndex(day: string) {
  const map: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  return map[day] ?? 1;
}

function getNextMatchStartDate(match: MatchCard, now: Date) {
  const startMinutes = parseHHMMToMinutes(match.startTime);
  if (startMinutes == null) return null;
  const targetDay = dayToJsIndex(match.days[0] ?? "Mon");
  const currentDay = now.getDay();
  const daysAhead = (targetDay - currentDay + 7) % 7;
  const next = new Date(now);
  next.setDate(now.getDate() + daysAhead);
  next.setHours(Math.floor(startMinutes / 60), startMinutes % 60, 0, 0);
  if (next.getTime() <= now.getTime()) {
    next.setDate(next.getDate() + 7);
  }
  return next;
}

function sportIcon(sport: string) {
  // Only used for small preference chips; map a few to existing lucide icons.
  switch (sport) {
    case "Badminton":
      return Volleyball;
    case "Basketball":
      return Dumbbell; // stylized fallback
    case "Soccer":
      return Dumbbell;
    case "Swimming":
      return Dumbbell;
    case "Tennis":
      return Dumbbell;
    default:
      return PlusCircle;
  }
}

const BADGE_GRID: {
  id: string;
  title: string;
  description: string;
  condition: string;
  // unlock if `getCount` meets requirement
  kind: "host" | "participate" | "sport" | "recurring" | "overall";
  sport?: Sport;
  min: number;
}[] = [
  {
    id: "host-1",
    title: "Host Spark",
    description: "You hosted your first match.",
    condition: "Host 1 match",
    kind: "host",
    min: 1,
  },
  {
    id: "host-3",
    title: "Community Builder",
    description: "Keep the courts alive.",
    condition: "Host 3 matches",
    kind: "host",
    min: 3,
  },
  {
    id: "sport-badminton-5",
    title: "Badminton Rhythm",
    description: "Your rallies are getting sharp.",
    condition: "Participate in 5 Badminton matches",
    kind: "sport",
    sport: "Badminton",
    min: 5,
  },
  {
    id: "sport-basketball-5",
    title: "Court Captain",
    description: "You bring energy to hoops.",
    condition: "Participate in 5 Basketball matches",
    kind: "sport",
    sport: "Basketball",
    min: 5,
  },
  {
    id: "overall-5",
    title: "Husky Regular",
    description: "Consistency beats talent.",
    condition: "Participate in 5 matches",
    kind: "overall",
    min: 5,
  },
  {
    id: "recurring-1",
    title: "Recurring Force",
    description: "You plan ahead for the community.",
    condition: "Launch 1 recurring match",
    kind: "recurring",
    min: 1,
  },
  {
    id: "sport-tennis-3",
    title: "Baseline Focus",
    description: "You play with intent.",
    condition: "Participate in 3 Tennis matches",
    kind: "sport",
    sport: "Tennis",
    min: 3,
  },
  {
    id: "sport-swimming-2",
    title: "Lap Listener",
    description: "You’re building stamina.",
    condition: "Participate in 2 Swimming matches",
    kind: "sport",
    sport: "Swimming",
    min: 2,
  },
  {
    id: "participate-8",
    title: "Level Up",
    description: "You’re always showing up.",
    condition: "Participate in 8 matches",
    kind: "overall",
    min: 8,
  },
];

const DEFAULT_BADGE_LOCKED_POPUP_TITLE = "Unlock requirements";

const MOCK_FRIEND_DISPLAY_NAME = "Alex Chen";
const MOCK_FRIEND_AVATAR = defaultAvatarDataUri("A");

function mockStartQrScan() {
  // Placeholder until real camera / QR integration.
}

export function ProfileView() {
  const {
    allMatches,
    isJoined,
    joinedMatches,
    cancelMatch,
    currentUserId,
    checkInAttendee,
  } = useMatchContext();

  const TAB_ORDER: TabKey[] = ["badges", "hosted", "joined"];

  const [tab, setTab] = useState<TabKey>("badges");
  const [tabDirection, setTabDirection] = useState<1 | -1>(1);

  const prevTabRef = useRef<TabKey>("badges");
  const [name, setName] = useState<string>("Husky");
  const [bio, setBio] = useState<string>("");
  const [editingBio, setEditingBio] = useState(false);

  const [lockedBadgeId, setLockedBadgeId] = useState<string | null>(null);

  const [sportsEditorOpen, setSportsEditorOpen] = useState(false);
  const sportsEditorRef = useRef<HTMLDivElement | null>(null);

  const [preferredSports, setPreferredSports] = useState<Sport[]>([]);
  const [preferredLevels, setPreferredLevels] = useState<
    Partial<Record<Sport, SkillLevel>>
  >({});
  const [levelDropdownSport, setLevelDropdownSport] = useState<Sport | null>(
    null
  );
  const [levelDropdownDirection, setLevelDropdownDirection] = useState<
    "down" | "up"
  >("down");
  const levelDropdownRef = useRef<HTMLDivElement | null>(null);

  const [activeCheckInMatchId, setActiveCheckInMatchId] = useState<number | null>(
    null
  );
  const activeCheckInMatch = useMemo(() => {
    if (activeCheckInMatchId == null) return null;
    return allMatches.find((m) => m.id === activeCheckInMatchId) ?? null;
  }, [allMatches, activeCheckInMatchId]);
  const [manualCheckInValue, setManualCheckInValue] = useState("");
  const [checkInError, setCheckInError] = useState<string | null>(null);
  const [cameraDenied, setCameraDenied] = useState(false);
  const [checkInToast, setCheckInToast] = useState<string | null>(null);
  const checkInToastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [cancelJoinedMatchId, setCancelJoinedMatchId] = useState<number | null>(null);

  const didInitPrefsRef = useRef(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const [profilePhotoSrc, setProfilePhotoSrc] = useState<string>("");

  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [showMyQrModal, setShowMyQrModal] = useState(false);
  type FriendModalMode = "scan" | "search";
  const [friendModalMode, setFriendModalMode] =
    useState<FriendModalMode>("search");
  const [friendSearchQuery, setFriendSearchQuery] = useState("");
  const [mockFriendRequestSent, setMockFriendRequestSent] = useState(false);
  const [friendToastMessage, setFriendToastMessage] = useState<string | null>(
    null
  );
  const friendToastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const closeMyQrModal = useCallback(() => {
    setShowMyQrModal(false);
  }, []);

  const closeAddFriendModal = useCallback(() => {
    setShowAddFriendModal(false);
    setFriendModalMode("search");
    setFriendSearchQuery("");
    setMockFriendRequestSent(false);
    if (friendToastTimeoutRef.current) {
      clearTimeout(friendToastTimeoutRef.current);
      friendToastTimeoutRef.current = null;
    }
    setFriendToastMessage(null);
  }, []);

  const showFriendRequestToast = (message: string) => {
    if (friendToastTimeoutRef.current) {
      clearTimeout(friendToastTimeoutRef.current);
    }
    setFriendToastMessage(message);
    friendToastTimeoutRef.current = setTimeout(() => {
      setFriendToastMessage(null);
      friendToastTimeoutRef.current = null;
    }, 3200);
  };

  const showCheckInToast = (message: string) => {
    if (checkInToastTimeoutRef.current) {
      clearTimeout(checkInToastTimeoutRef.current);
    }
    setCheckInToast(message);
    checkInToastTimeoutRef.current = setTimeout(() => {
      setCheckInToast(null);
      checkInToastTimeoutRef.current = null;
    }, 3000);
  };

  const searchQueryHasDigit = /\d/.test(friendSearchQuery);

  const hostedMatches = useMemo(() => {
    return allMatches.filter((m) => (m.creatorId ?? m.hostId) === currentUserId);
  }, [allMatches, currentUserId]);

  const extractHuskyId = (value: string) => {
    const match = value.toUpperCase().match(/HUSKY-[A-Z0-9]{6,}/);
    return match ? match[0] : null;
  };

  const submitCheckIn = (input: string) => {
    if (!activeCheckInMatch) return;
    const parsed = extractHuskyId(input.trim());
    if (!parsed) {
      setCheckInError("Please enter a valid Husky ID (e.g. HUSKY-AB12CD34).");
      return;
    }
    checkInAttendee(activeCheckInMatch.id, parsed);
    const nickname = parsed === huskyId ? name : `Husky ${parsed.slice(-4)}`;
    setActiveCheckInMatchId(null);
    setManualCheckInValue("");
    setCheckInError(null);
    setCameraDenied(false);
    showCheckInToast(`Check-in Successful: ${nickname}! 🐾`);
  };

  const handleOpenCameraScanner = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((t) => t.stop());
      setCameraDenied(false);
      const mockPayload = window.prompt(
        "Camera ready. Paste scanned QR payload (Husky ID):",
        "HUSKY-",
      );
      if (!mockPayload) return;
      submitCheckIn(mockPayload);
    } catch {
      setCameraDenied(true);
      setCheckInError("Camera access denied. Use manual Husky ID input below.");
    }
  };

  const handleLevelChange = (sport: Sport, newLevel: SkillLevel) => {
    setPreferredLevels((prev) => ({
      ...prev,
      [sport]: newLevel,
    }));
    setLevelDropdownSport(null);
  };

  useEffect(() => {
    try {
      const savedName = localStorage.getItem(STORAGE_PROFILE_NAME)?.trim();
      if (savedName) {
        setName(savedName);
      } else {
        const fallbackNetId = sessionStorage
          .getItem(SESSION_LOGIN_NETID)
          ?.trim();
        if (fallbackNetId) setName(fallbackNetId);
      }
      const savedBio = localStorage.getItem(STORAGE_PROFILE_BIO);
      if (savedBio) setBio(savedBio);
      const savedPhoto = localStorage.getItem(STORAGE_PROFILE_PHOTO);
      if (savedPhoto && typeof savedPhoto === "string") setProfilePhotoSrc(savedPhoto);
    } catch {
      // ignore
    }
  }, []);

  const avatarInitial = useMemo(() => {
    return (name.trim()[0] ?? "H").toUpperCase();
  }, [name]);

  const defaultAvatarSrc = useMemo(() => defaultAvatarDataUri(avatarInitial), [
    avatarInitial,
  ]);

  const openPhotoPicker = () => {
    fileInputRef.current?.click();
  };

  const onProfilePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Instant preview (fast).
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
      const nextUrl = URL.createObjectURL(file);
      objectUrlRef.current = nextUrl;
      setProfilePhotoSrc(nextUrl);

      // Persist for later sessions (data URL).
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        if (typeof result === "string") {
          setProfilePhotoSrc(result);
          localStorage.setItem(STORAGE_PROFILE_PHOTO, result);
        }
      };
      reader.readAsDataURL(file);
    } catch {
      // If preview/persist fails, still keep the picker responsive.
    }
  };

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  useEffect(() => {
    try {
      if (!editingBio) return;
      localStorage.setItem(STORAGE_PROFILE_BIO, bio);
    } catch {
      // ignore
    }
  }, [bio, editingBio]);

  const huskyId = useMemo(() => huskyIdFromUserId(currentUserId), [currentUserId]);

  const participationMatches = useMemo(() => {
    // Participate == hosted or joined.
    return allMatches.filter((m) => m.hostId === currentUserId || isJoined(m.id));
  }, [allMatches, currentUserId, isJoined]);

  const joinedMatchCards = useMemo(() => {
    return allMatches.filter((m) => m.hostId !== currentUserId && m.id in joinedMatches);
  }, [allMatches, currentUserId, joinedMatches]);

  const bySportCounts = useMemo(() => {
    const counts: Partial<Record<Sport, number>> = {};
    for (const m of participationMatches) {
      counts[m.sport] = (counts[m.sport] ?? 0) + 1;
    }
    return counts as Record<Sport, number>;
  }, [participationMatches]);

  const recurringCount = useMemo(() => {
    return hostedMatches.filter((m) => m.frequency === "recurring").length;
  }, [hostedMatches]);

  const overallParticipateCount = participationMatches.length;

  const unlockedBadge = (badgeId: string) => {
    const badge = BADGE_GRID.find((b) => b.id === badgeId);
    if (!badge) return false;
    switch (badge.kind) {
      case "host":
        return hostedMatches.length >= badge.min;
      case "overall":
        return overallParticipateCount >= badge.min;
      case "recurring":
        return recurringCount >= badge.min;
      case "sport":
        return (badge.sport ? bySportCounts[badge.sport] ?? 0 : 0) >= badge.min;
      case "participate":
        return overallParticipateCount >= badge.min;
      default:
        return false;
    }
  };

  const lockedBadge = useMemo(() => {
    if (!lockedBadgeId) return null;
    return BADGE_GRID.find((b) => b.id === lockedBadgeId) ?? null;
  }, [lockedBadgeId]);

  // Initialize editable sports preferences + per-sport skill levels.
  useEffect(() => {
    if (didInitPrefsRef.current) return;
    didInitPrefsRef.current = true;

    try {
      const rawSports = localStorage.getItem(STORAGE_PROFILE_SPORTS);
      const rawLevels = localStorage.getItem(STORAGE_PROFILE_LEVELS);

      const savedSportsParsed = rawSports ? (JSON.parse(rawSports) as unknown) : null;
      const savedLevelsParsed = rawLevels ? (JSON.parse(rawLevels) as unknown) : null;

      const defaultSportsByCount = SPORTS.map((s) => ({
        s,
        c: bySportCounts[s] ?? 0,
      }))
        .sort((a, b) => b.c - a.c)
        .filter((x) => x.c > 0)
        .slice(0, 2)
        .map((x) => x.s);

      const nextSports: Sport[] =
        Array.isArray(savedSportsParsed) && savedSportsParsed.length > 0
          ? (Array.from(
              new Set(
                savedSportsParsed.filter((x) => SPORTS.includes(x as Sport)) as Sport[]
              )
            ).slice(0, 4) as Sport[])
          : defaultSportsByCount.length
            ? defaultSportsByCount
            : (["Badminton", "Basketball"] as Sport[]);

      const nextLevels: Partial<Record<Sport, SkillLevel>> = {};
      for (const s of nextSports) {
        const raw =
          savedLevelsParsed && typeof savedLevelsParsed === "object"
            ? (savedLevelsParsed as Record<string, unknown>)[s]
            : undefined;

        if (typeof raw === "string" && (LEVELS as readonly string[]).includes(raw)) {
          nextLevels[s] = raw as SkillLevel;
        } else {
          nextLevels[s] = computeSkillLevelFromCount(bySportCounts[s] ?? 0);
        }
      }

      setPreferredSports(nextSports);
      setPreferredLevels(nextLevels);
    } catch {
      const fallbackSports: Sport[] = ["Badminton", "Basketball"];
      const nextLevels: Partial<Record<Sport, SkillLevel>> = {};
      for (const s of fallbackSports) {
        nextLevels[s] = computeSkillLevelFromCount(bySportCounts[s] ?? 0);
      }
      setPreferredSports(fallbackSports);
      setPreferredLevels(nextLevels);
    }
  }, [bySportCounts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PROFILE_SPORTS, JSON.stringify(preferredSports));
    } catch {
      // ignore
    }
  }, [preferredSports]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PROFILE_LEVELS, JSON.stringify(preferredLevels));
    } catch {
      // ignore
    }
  }, [preferredLevels]);

  // Close sport editor / level dropdown on outside click + Escape.
  useEffect(() => {
    if (!sportsEditorOpen && !levelDropdownSport) return;

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null;
      if (!target) return;

      if (
        sportsEditorOpen &&
        sportsEditorRef.current &&
        !sportsEditorRef.current.contains(target)
      ) {
        setSportsEditorOpen(false);
      }

      if (
        levelDropdownSport &&
        levelDropdownRef.current &&
        !levelDropdownRef.current.contains(target)
      ) {
        setLevelDropdownSport(null);
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setSportsEditorOpen(false);
      setLevelDropdownSport(null);
    };

    document.addEventListener("pointerdown", onPointerDown, true);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [sportsEditorOpen, levelDropdownSport]);

  useEffect(() => {
    if (!searchQueryHasDigit) setMockFriendRequestSent(false);
  }, [searchQueryHasDigit]);

  useEffect(() => {
    return () => {
      if (friendToastTimeoutRef.current) {
        clearTimeout(friendToastTimeoutRef.current);
      }
      if (checkInToastTimeoutRef.current) {
        clearTimeout(checkInToastTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!showAddFriendModal) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      closeAddFriendModal();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showAddFriendModal, closeAddFriendModal]);

  useEffect(() => {
    if (!showMyQrModal) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      closeMyQrModal();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showMyQrModal, closeMyQrModal]);

  useEffect(() => {
    if (activeCheckInMatchId == null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setActiveCheckInMatchId(null);
      setCheckInError(null);
      setManualCheckInValue("");
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeCheckInMatchId]);

  return (
    <motion.div
      className="relative min-h-screen overflow-visible bg-[#050505] font-sans"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {/* Liquid Void depth gradient */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(to bottom, rgba(75,46,131,0.28), rgba(0,0,0,0.0) 40%, rgba(232,211,162,0.14))",
        }}
      />

      <section
        className="relative z-10 px-6 pb-6"
        style={{ paddingTop: "calc(40px + env(safe-area-inset-top, 0px))" }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1 pr-2">
            <p className="text-[11px] uppercase tracking-[0.22em] text-white/40">
              Liquid Void Profile
            </p>
            <div className="mt-1 flex items-center gap-2">
              <h1 className="min-w-0 truncate text-2xl font-semibold tracking-tight text-white">
                {name}
              </h1>
              <motion.button
                type="button"
                onClick={() => setShowMyQrModal(true)}
                aria-label="My QR code"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#E8D3A2]/25 bg-[#E8D3A2]/10 text-[#E8D3A2] shadow-[0_0_18px_rgba(232,211,162,0.35)] transition-shadow hover:shadow-[0_0_26px_rgba(232,211,162,0.55)] hover:animate-pulse"
              >
                <QrCode className="h-[18px] w-[18px]" strokeWidth={2.25} />
              </motion.button>
            </div>
            <p className="mt-1 text-sm text-white/55">{huskyId}</p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddFriendModal(true)}
            className="relative inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#4B2E83]/40 bg-[#4B2E83]/20 text-white/90 shadow-[0_0_28px_rgba(75,46,131,0.35)] transition-transform active:scale-[0.98]"
            aria-label="Add friend"
          >
            <UserPlus className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 flex items-center gap-5">
          <div
            className="relative z-[50] flex h-20 w-20 items-center justify-center overflow-visible rounded-full"
            style={{
              boxShadow: `0 0 0 1px rgba(232,211,162,0.35), 0 0 26px rgba(232,211,162,0.25), 0 0 60px rgba(232,211,162,0.12)`,
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onProfilePhotoChange}
            />

            <div className="absolute inset-0 rounded-full bg-[#4B2E83]/15 blur-[1px]" />
            <img
              src={profilePhotoSrc || defaultAvatarSrc}
              alt={`${name} profile photo`}
              className="relative z-10 h-full w-full rounded-full object-cover"
            />

            <button
              type="button"
              onClick={openPhotoPicker}
              aria-label="Change photo"
              className="absolute bottom-0 right-0 z-[50] h-10 w-10 -translate-y-[18%] translate-x-[18%] rounded-full border border-[#4B2E83]/60 bg-black/60 text-white shadow-[0_0_26px_rgba(75,46,131,0.35)] transition-transform hover:scale-[1.06] active:scale-[0.96]"
            >
              <Plus className="mx-auto h-5 w-5" />
            </button>
          </div>

          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
              Bio
            </p>
            <div className="mt-2 flex items-start gap-2">
              <div className="flex-1">
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  readOnly={!editingBio}
                  placeholder="Keep it minimal. Share your game vibe..."
                  className={[
                    "w-full min-h-[74px] resize-none rounded-2xl border px-4 py-3 text-sm outline-none transition-colors",
                    "bg-white/5 border-white/10 text-white/85 placeholder:text-white/35 backdrop-blur-xl",
                    editingBio
                      ? "border-[#4B2E83] focus:ring-2 focus:ring-[#4B2E83]/35"
                      : "cursor-default",
                  ].join(" ")}
                />
              </div>

              <button
                type="button"
                onClick={() => setEditingBio((v) => !v)}
                className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/85 shadow-[0_12px_36px_rgba(0,0,0,0.6)] transition-transform active:scale-[0.98]"
                aria-label={editingBio ? "Close bio editor" : "Edit bio"}
              >
                <Edit2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-6 pb-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Preferences */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_18px_50px_rgba(0,0,0,0.9)] p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
                Sports Prefer
              </p>

              <button
                type="button"
                onClick={() => setSportsEditorOpen((v) => !v)}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/75 shadow-[0_0_18px_rgba(75,46,131,0.16)] transition-colors hover:bg-white/10"
              >
                {sportsEditorOpen ? (
                  <X className="h-4 w-4 text-[#E8D3A2]/80" />
                ) : (
                  <PlusCircle className="h-4 w-4 text-[#E8D3A2]/80" />
                )}
                {sportsEditorOpen ? "Close" : "Add/Remove"}
              </button>
            </div>

            <div className="mt-3 flex items-center gap-3 overflow-x-auto pb-2">
              {preferredSports.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-white/45">
                  Select sports to personalize your profile.
                </div>
              ) : (
                preferredSports.map((s) => {
                  const Icon = sportIcon(s);
                  return (
                    <div
                      key={s}
                      className="relative flex items-center gap-2 rounded-2xl border border-[#4B2E83]/45 bg-[#4B2E83]/15 px-3 py-2 text-sm text-white/90 shadow-[0_0_24px_rgba(75,46,131,0.25)]"
                    >
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl border border-[#4B2E83]/35 bg-[#4B2E83]/10">
                        <Icon className="h-4 w-4 text-white/90" />
                      </span>
                      <span className="whitespace-nowrap">{s}</span>
                    </div>
                  );
                })
              )}
            </div>

            <AnimatePresence>
              {sportsEditorOpen && (
                <motion.div
                  key="sports-editor"
                  ref={sportsEditorRef}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="mt-3 rounded-2xl border border-white/10 bg-[#050505]/80 p-3 backdrop-blur-xl shadow-[0_18px_70px_rgba(0,0,0,0.75)]"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
                    Choose your preferred sports
                  </p>

                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {SPORTS.map((s) => {
                      const selected = preferredSports.includes(s);
                      const Icon = sportIcon(s);
                      return (
                        <motion.button
                          key={s}
                          type="button"
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            const exists = preferredSports.includes(s);
                            if (exists) {
                              setPreferredSports((prev) => prev.filter((x) => x !== s));
                              setPreferredLevels((prev) => {
                                const next = { ...prev };
                                delete next[s];
                                return next;
                              });
                            } else {
                              setPreferredSports((prev) => {
                                if (prev.includes(s)) return prev;
                                return [...prev, s];
                              });
                              setPreferredLevels((prev) => {
                                const current = prev[s];
                                if (current) return prev;
                                return {
                                  ...prev,
                                  [s]: computeSkillLevelFromCount(bySportCounts[s] ?? 0),
                                };
                              });
                            }
                          }}
                          className={[
                            "flex items-center justify-between gap-2 rounded-2xl border px-3 py-2 text-sm transition-colors",
                            selected
                              ? "border-[#4B2E83]/55 bg-[#4B2E83]/18 shadow-[0_0_26px_rgba(75,46,131,0.25)]"
                              : "border-white/10 bg-white/5 hover:bg-white/10 text-white/80",
                          ].join(" ")}
                        >
                          <span className="flex items-center gap-2 min-w-0">
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl border border-white/10 bg-[#4B2E83]/10">
                              <Icon className="h-4 w-4 text-white/90" />
                            </span>
                            <span className="truncate">{s}</span>
                          </span>

                          {selected ? (
                            <Check className="h-4 w-4 text-[#E8D3A2]" />
                          ) : (
                            <span className="h-4 w-4" />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>

                  <div className="mt-3 flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => setSportsEditorOpen(false)}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/75 transition-colors hover:bg-white/10"
                    >
                      Done
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Skill */}
          <div className="relative z-40 overflow-visible rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_18px_50px_rgba(0,0,0,0.9)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
              Skill Levels
            </p>
            <div className="mt-3 space-y-3">
              {preferredSports.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-white/45">
                  Pick sports above to set your proficiency levels.
                </div>
              ) : (
                preferredSports.map((s) => {
                  const level = preferredLevels[s] ?? "Beginner";
                  const Icon = sportIcon(s);
                  return (
                    <div key={s} className="relative flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-[#4B2E83]/10">
                          <Icon className="h-4 w-4 text-white/90" />
                        </span>
                        <span className="truncate text-sm text-white/85">{s}</span>
                      </div>

                      <div className="relative">
                        <button
                          type="button"
                          onClick={(e) => {
                            const nextOpen = levelDropdownSport !== s;
                            if (nextOpen) {
                              const rect =
                                e.currentTarget?.getBoundingClientRect?.() ??
                                null;
                              if (rect) {
                                const spaceBelow = window.innerHeight - rect.bottom;
                                setLevelDropdownDirection(
                                  spaceBelow < 220 ? "up" : "down"
                                );
                              } else {
                                setLevelDropdownDirection("down");
                              }
                            }
                            setLevelDropdownSport((prev) =>
                              prev === s ? null : s
                            );
                          }}
                          className="inline-flex items-center gap-2 rounded-2xl border border-[#4B2E83]/25 bg-[#4B2E83]/10 px-3 py-[7px] text-[11px] font-semibold uppercase tracking-wide text-[#E8D3A2] shadow-[0_0_22px_rgba(75,46,131,0.14)] transition-colors hover:bg-[#4B2E83]/15"
                        >
                          {level}
                          <ChevronDown
                            className={[
                              "h-4 w-4 transition-transform",
                              levelDropdownSport === s ? "rotate-180" : "rotate-0",
                            ].join(" ")}
                          />
                        </button>

                        <AnimatePresence>
                          {levelDropdownSport === s && (
                            <motion.div
                              key={`level-dropdown-${s}`}
                              ref={levelDropdownRef}
                              initial={{ opacity: 0, y: -8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                              transition={{ duration: 0.16, ease: "easeOut" }}
                              className={[
                                "absolute right-0 z-[9999] w-44 rounded-2xl border p-2 shadow-2xl bg-black border-[#4B2E83]",
                                levelDropdownDirection === "down"
                                  ? "top-full mt-2"
                                  : "bottom-full mb-2",
                              ].join(" ")}
                            >
                              <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35">
                                Proficiency
                              </div>
                              <div className="mt-1 space-y-1">
                                {LEVELS.map((l) => {
                                  const isSelected = l === level;
                                  return (
                                    <button
                                      key={l}
                                      type="button"
                                      onClick={() => {
                                        handleLevelChange(s, l);
                                      }}
                                      className={[
                                        "flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm transition-colors",
                                        isSelected
                                          ? "bg-[#4B2E83]/25 text-white border border-[#4B2E83]/40"
                                          : "bg-transparent text-white/80 hover:bg-white/5",
                                      ].join(" ")}
                                    >
                                      <span>{l}</span>
                                      {isSelected ? (
                                        <Check className="h-4 w-4 text-[#E8D3A2]" />
                                      ) : (
                                        <span className="h-4 w-4" />
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="relative z-10 px-6 pb-28">
        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/25 p-1 text-xs font-semibold text-white/60 backdrop-blur-xl">
          <button
            type="button"
            onClick={() => {
              if (tab === "badges") return;
              const dir =
                TAB_ORDER.indexOf("badges") > TAB_ORDER.indexOf(tab) ? 1 : -1;
              setTabDirection(dir);
              prevTabRef.current = tab;
              setTab("badges");
            }}
            className={[
              "flex-1 rounded-xl px-3 py-2 transition-colors",
              tab === "badges"
                ? "bg-[#4B2E83]/25 text-white shadow-[0_0_18px_rgba(75,46,131,0.25)]"
                : "text-white/60 hover:text-white/80",
            ].join(" ")}
          >
            My Badges
          </button>
          <button
            type="button"
            onClick={() => {
              if (tab === "hosted") return;
              const dir =
                TAB_ORDER.indexOf("hosted") > TAB_ORDER.indexOf(tab) ? 1 : -1;
              setTabDirection(dir);
              prevTabRef.current = tab;
              setTab("hosted");
            }}
            className={[
              "flex-1 rounded-xl px-3 py-2 transition-colors",
              tab === "hosted"
                ? "bg-[#4B2E83]/25 text-white shadow-[0_0_18px_rgba(75,46,131,0.25)]"
                : "text-white/60 hover:text-white/80",
            ].join(" ")}
          >
            Hosted Matches
          </button>
          <button
            type="button"
            onClick={() => {
              if (tab === "joined") return;
              const dir =
                TAB_ORDER.indexOf("joined") > TAB_ORDER.indexOf(tab) ? 1 : -1;
              setTabDirection(dir);
              prevTabRef.current = tab;
              setTab("joined");
            }}
            className={[
              "flex-1 rounded-xl px-3 py-2 transition-colors",
              tab === "joined"
                ? "bg-[#4B2E83]/25 text-white shadow-[0_0_18px_rgba(75,46,131,0.25)]"
                : "text-white/60 hover:text-white/80",
            ].join(" ")}
          >
            Joined Matches
          </button>
        </div>

        <AnimatePresence mode="wait">
          {tab === "badges" && (
            <motion.div
              key="badges"
              initial={{
                opacity: 0,
                x: tabDirection === 1 ? 40 : -40,
              }}
              animate={{ opacity: 1, x: 0 }}
              exit={{
                opacity: 0,
                x: tabDirection === 1 ? -40 : 40,
              }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="mt-4"
            >
              <div className="grid grid-cols-3 gap-3">
                {BADGE_GRID.map((b) => {
                  const unlocked = unlockedBadge(b.id);
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => {
                        if (unlocked) return;
                        setLockedBadgeId(b.id);
                      }}
                      className={[
                        "relative flex aspect-square items-center justify-center rounded-2xl border transition-all",
                        "bg-white/5 border-white/10",
                        unlocked
                          ? "border-[#4B2E83]/60 shadow-[0_0_0_1px rgba(75,46,131,0.35),0_0_26px rgba(75,46,131,0.25)]"
                          : "grayscale opacity-60 hover:opacity-85",
                      ].join(" ")}
                    >
                      <div className="absolute inset-0 rounded-2xl bg-[#4B2E83]/10 opacity-0 transition-opacity" />
                      <div className="relative z-10 flex flex-col items-center gap-1 px-2 text-center">
                        <Trophy
                          className={[
                            "h-5 w-5",
                            unlocked ? "text-[#E8D3A2]" : "text-white/50",
                          ].join(" ")}
                        />
                        <span className="text-[10px] font-semibold leading-tight text-white/80">
                          {b.title}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {tab === "hosted" && (
            <motion.div
              key="hosted"
              initial={{
                opacity: 0,
                x: tabDirection === 1 ? 40 : -40,
              }}
              animate={{ opacity: 1, x: 0 }}
              exit={{
                opacity: 0,
                x: tabDirection === 1 ? -40 : 40,
              }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="mt-4"
            >
              <div className="space-y-3">
                {hostedMatches.length === 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">
                    You haven't hosted any matches yet.
                  </div>
                ) : (
                  hostedMatches
                    .slice()
                    .sort((a, b) => b.id - a.id)
                    .map((m) => {
                      const createdAt = matchCreatedAtFallback(m);
                      return (
                        <motion.div
                          key={m.id}
                          whileTap={{ scale: 0.99 }}
                          className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl"
                        >
                          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-[#4B2E83]/15">
                            <div className="absolute inset-0 rounded-2xl bg-[#4B2E83]/25 blur-xl" />
                            <Trophy className="relative h-5 w-5 text-[#E8D3A2]" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-3">
                              <p className="truncate text-sm font-semibold text-white">
                                {m.sport}
                              </p>
                              <span className="rounded-full border border-white/10 bg-black/25 px-2 py-[4px] text-[11px] text-white/60">
                                {formatMatchDate(createdAt)}
                              </span>
                            </div>
                            <p className="mt-1 text-[11px] text-white/55">
                              {m.location} · {formatMatchTime(m)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveCheckInMatchId(m.id);
                                setManualCheckInValue("");
                                setCheckInError(null);
                                setCameraDenied(false);
                              }}
                              className="rounded-2xl border border-[#4B2E83]/45 bg-[#4B2E83]/15 px-3 py-[9px] text-[12px] font-semibold text-white shadow-[0_0_22px_rgba(75,46,131,0.22)] transition-colors hover:bg-[#4B2E83]/20"
                            >
                              Manage Check-in
                            </button>
                          </div>
                        </motion.div>
                      );
                    })
                )}
              </div>
            </motion.div>
          )}

          {tab === "joined" && (
            <motion.div
              key="joined"
              initial={{
                opacity: 0,
                x: tabDirection === 1 ? 40 : -40,
              }}
              animate={{ opacity: 1, x: 0 }}
              exit={{
                opacity: 0,
                x: tabDirection === 1 ? -40 : 40,
              }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="mt-4"
            >
              <div className="space-y-3">
                {joinedMatchCards.length === 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">
                    You haven't joined any matches yet.
                  </div>
                ) : (
                  joinedMatchCards
                    .slice()
                    .sort((a, b) => b.id - a.id)
                    .map((m) => {
                      const createdAt = matchCreatedAtFallback(m);
                      const status = joinedMatches[m.id] ?? "upcoming";
                      const nextStart = getNextMatchStartDate(m, new Date());
                      const isCancelable =
                        nextStart != null &&
                        nextStart.getTime() - Date.now() > 2 * 60 * 60 * 1000;
                      return (
                        <motion.div
                          key={m.id}
                          whileTap={{ scale: 0.99 }}
                          className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl"
                        >
                          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5">
                            <div className="absolute inset-0 rounded-2xl bg-[#4B2E83]/20 blur-xl" />
                            <Trophy className="relative h-5 w-5 text-white/70" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-3">
                              <p className="truncate text-sm font-semibold text-white">
                                {m.sport}
                              </p>
                              <span className="rounded-full border border-white/10 bg-black/25 px-2 py-[4px] text-[11px] text-white/60">
                                {formatMatchDate(createdAt)}
                              </span>
                            </div>
                            <p className="mt-1 text-[11px] text-white/55">
                              {m.location} · {formatMatchTime(m)}
                            </p>
                            <div className="mt-2 flex items-center gap-2">
                              {status === "upcoming" && (
                                <motion.span
                                  animate={{ opacity: [0.7, 1, 0.7] }}
                                  transition={{ duration: 1.8, repeat: Infinity }}
                                  className="inline-flex items-center rounded-full border border-[#4B2E83]/70 bg-[#4B2E83]/18 px-2 py-[3px] text-[10px] font-semibold uppercase tracking-wide text-[#E8D3A2] shadow-[0_0_18px_rgba(75,46,131,0.35)]"
                                >
                                  Upcoming
                                </motion.span>
                              )}
                              {status === "completed" && (
                                <span className="inline-flex items-center gap-1 rounded-full border border-[#E8D3A2]/50 bg-[#E8D3A2]/10 px-2 py-[3px] text-[10px] font-semibold uppercase tracking-wide text-[#E8D3A2]">
                                  <Check className="h-3 w-3" />
                                  Completed
                                </span>
                              )}
                              {status === "missed" && (
                                <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-2 py-[3px] text-[10px] font-semibold uppercase tracking-wide text-white/45">
                                  Missed
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            {status === "upcoming" && (
                              <>
                                <button
                                  type="button"
                                  disabled={!isCancelable}
                                  onClick={() => setCancelJoinedMatchId(m.id)}
                                  className={[
                                    "rounded-xl px-2.5 py-1.5 text-[11px] font-semibold transition-all duration-200",
                                    isCancelable
                                      ? "border border-red-400/25 bg-red-500/5 text-red-200 hover:border-red-400/45 hover:bg-red-500/10 hover:shadow-[0_0_18px_rgba(239,68,68,0.28)]"
                                      : "cursor-not-allowed border border-zinc-700 bg-zinc-800 text-zinc-500",
                                  ].join(" ")}
                                >
                                  Cancel
                                </button>
                                {!isCancelable && (
                                  <span className="inline-flex items-center gap-1 text-[10px] text-zinc-500">
                                    <Lock className="h-3 w-3" />
                                    Cannot cancel within 2 hours of start.
                                  </span>
                                )}
                              </>
                            )}
                            <ChevronRight className="h-4 w-4 text-white/25" />
                          </div>
                        </motion.div>
                      );
                    })
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Joined match cancel confirmation */}
      <AnimatePresence>
        {cancelJoinedMatchId != null && (
          <>
            <motion.div
              className="fixed inset-0 z-[2090] bg-black/60 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setCancelJoinedMatchId(null)}
            />
            <motion.div
              className="fixed inset-0 z-[2095] flex items-center justify-center px-6"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#050505]/95 p-6 text-center shadow-[0_20px_80px_rgba(0,0,0,0.95)] backdrop-blur-xl">
                <h3 className="text-lg font-semibold text-white">
                  Are you sure you want to withdraw?
                </h3>
                <p className="mt-2 text-sm text-white/65">
                  This will open up your spot to other Huskies.
                </p>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setCancelJoinedMatchId(null)}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/80 hover:bg-white/10"
                  >
                    Keep
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (cancelJoinedMatchId == null) return;
                      cancelMatch(cancelJoinedMatchId);
                      setCancelJoinedMatchId(null);
                    }}
                    className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200 transition-all hover:border-red-400/55 hover:bg-red-500/15 hover:shadow-[0_0_20px_rgba(239,68,68,0.25)]"
                  >
                    Confirm Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Hosted match check-in scanner */}
      <AnimatePresence>
        {activeCheckInMatchId != null && activeCheckInMatch && (
          <>
            <motion.div
              className="fixed inset-0 z-[2100] bg-black/60 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => {
                setActiveCheckInMatchId(null);
                setCheckInError(null);
                setManualCheckInValue("");
              }}
            />
            <motion.div
              className="fixed inset-0 z-[2110] flex items-center justify-center px-6"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#050505]/95 p-6 text-center shadow-[0_20px_80px_rgba(0,0,0,0.95)] backdrop-blur-xl">
                <div className="flex items-center justify-center">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-2xl"
                    style={{
                      boxShadow:
                        "0 0 0 1px rgba(75,46,131,0.35), 0 0 30px rgba(75,46,131,0.25)",
                      backgroundColor: "rgba(75,46,131,0.18)",
                    }}
                  >
                    <Camera className="h-7 w-7 text-[#E8D3A2]" />
                  </div>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">
                  Manage Check-in
                </h3>
                <p className="mt-2 text-sm text-white/70">
                  Scan a participant QR (Husky ID) for:
                </p>
                <p className="mt-1 text-sm font-semibold text-white/90">
                  {activeCheckInMatch.title}
                </p>

                <div className="mt-5 space-y-3 text-left">
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.99 }}
                    onClick={handleOpenCameraScanner}
                    className="w-full rounded-2xl border border-[#4B2E83]/45 bg-[#4B2E83]/15 px-4 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(75,46,131,0.28)] transition-colors hover:bg-[#4B2E83]/25"
                  >
                    Open Camera Scanner
                  </motion.button>

                  {cameraDenied && (
                    <p className="text-xs text-amber-200">
                      Camera access denied. Use manual Husky ID input.
                    </p>
                  )}

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/55">
                      Manual Check-in (Fallback)
                    </p>
                    <input
                      value={manualCheckInValue}
                      onChange={(e) => setManualCheckInValue(e.target.value)}
                      placeholder="Enter participant Husky ID"
                      className="w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#4B2E83]"
                    />
                    <button
                      type="button"
                      onClick={() => submitCheckIn(manualCheckInValue)}
                      className="mt-2 w-full rounded-xl border border-[#4B2E83]/45 bg-[#4B2E83]/20 px-3 py-2 text-sm font-semibold text-white"
                    >
                      Confirm Check-in
                    </button>
                  </div>

                  {checkInError && (
                    <p className="text-xs text-red-300">{checkInError}</p>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setActiveCheckInMatchId(null);
                      setCheckInError(null);
                      setManualCheckInValue("");
                    }}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/80 transition-colors hover:bg-white/10"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Locked badge popup */}
      <AnimatePresence>
        {lockedBadgeId && lockedBadge && !unlockedBadge(lockedBadgeId) && (
          <>
            <motion.div
              className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setLockedBadgeId(null)}
            />
            <motion.div
              className="fixed inset-0 z-[2010] flex items-center justify-center px-6"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#050505]/95 p-6 text-center shadow-[0_20px_80px_rgba(0,0,0,0.95)] backdrop-blur-xl">
                <div className="flex items-center justify-center">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-2xl"
                    style={{
                      boxShadow:
                        "0 0 0 1px rgba(75,46,131,0.35), 0 0 30px rgba(75,46,131,0.25)",
                      backgroundColor: "rgba(75,46,131,0.18)",
                    }}
                  >
                    <Trophy className="h-7 w-7 text-[#E8D3A2]" />
                  </div>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">
                  {DEFAULT_BADGE_LOCKED_POPUP_TITLE}
                </h3>
                <p className="mt-2 text-sm text-white/70">
                  {lockedBadge.condition}
                </p>
                <p className="mt-3 text-xs text-white/45">{lockedBadge.description}</p>

                <motion.button
                  type="button"
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setLockedBadgeId(null)}
                  className="mt-5 w-full rounded-2xl border border-[#4B2E83]/40 bg-[#4B2E83] px-5 py-3 text-sm font-semibold text-white shadow-[0_0_28px_rgba(75,46,131,0.45)]"
                >
                  Got it
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add Friend modal */}
      <AnimatePresence>
        {showAddFriendModal && (
          <>
            <motion.div
              className="fixed inset-0 z-[2200] bg-black/90 backdrop-blur-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeAddFriendModal}
              aria-hidden
            />
            <motion.div
              className="fixed inset-0 z-[2210] flex items-center justify-center px-5 py-10"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              onClick={closeAddFriendModal}
            >
              <div
                className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#050505] shadow-[0_24px_80px_rgba(0,0,0,0.85)]"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={closeAddFriendModal}
                  className="absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80 transition-colors hover:bg-white/10"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="border-b border-white/10 px-5 pb-4 pt-5 pr-14">
                  <h2 className="text-lg font-semibold tracking-tight text-white">
                    Add Friend
                  </h2>
                  <p className="mt-1 text-xs text-white/45">
                    Scan a QR code or search by phone or Husky ID.
                  </p>
                </div>

                <div className="p-2">
                  <div className="flex gap-2 rounded-2xl border border-white/10 bg-black/40 p-1">
                    <button
                      type="button"
                      onClick={() => setFriendModalMode("scan")}
                      className={[
                        "flex-1 rounded-xl px-3 py-2 text-xs font-semibold transition-all",
                        friendModalMode === "scan"
                          ? "bg-[#4B2E83]/30 text-white shadow-[0_0_20px_rgba(75,46,131,0.35)]"
                          : "text-white/50 hover:text-white/75",
                      ].join(" ")}
                    >
                      Scan QR
                    </button>
                    <button
                      type="button"
                      onClick={() => setFriendModalMode("search")}
                      className={[
                        "flex-1 rounded-xl px-3 py-2 text-xs font-semibold transition-all",
                        friendModalMode === "search"
                          ? "bg-[#4B2E83]/30 text-white shadow-[0_0_20px_rgba(75,46,131,0.35)]"
                          : "text-white/50 hover:text-white/75",
                      ].join(" ")}
                    >
                      Search
                    </button>
                  </div>
                </div>

                <div className="px-5 pb-6">
                  {friendModalMode === "scan" ? (
                    <div className="space-y-4">
                      <div
                        className="relative mx-auto flex aspect-square w-full max-w-[240px] items-center justify-center rounded-2xl border-2 border-[#4B2E83] bg-black"
                        style={{
                          boxShadow:
                            "0 0 0 1px rgba(75,46,131,0.5), 0 0 40px rgba(75,46,131,0.45), inset 0 0 60px rgba(75,46,131,0.12)",
                        }}
                      >
                        <div className="absolute inset-4 rounded-xl border border-dashed border-[#4B2E83]/60" />
                        <p className="relative z-10 px-4 text-center text-xs text-white/40">
                          Camera preview
                        </p>
                      </div>
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.99 }}
                        onClick={() => mockStartQrScan()}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#4B2E83]/50 bg-[#4B2E83]/20 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(75,46,131,0.3)] transition-colors hover:bg-[#4B2E83]/30"
                      >
                        <Camera className="h-4 w-4" />
                        Open Camera
                      </motion.button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4B2E83]" />
                        <input
                          type="text"
                          inputMode="search"
                          autoComplete="off"
                          placeholder="Enter Phone Number or Husky ID"
                          value={friendSearchQuery}
                          onChange={(e) => setFriendSearchQuery(e.target.value)}
                          className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white outline-none transition-shadow placeholder:text-white/35 focus:border-[#4B2E83] focus:shadow-[0_0_0_3px_rgba(75,46,131,0.25)]"
                        />
                      </div>

                      {searchQueryHasDigit && (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="rounded-2xl border border-white/10 bg-black p-4"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={MOCK_FRIEND_AVATAR}
                              alt=""
                              className="h-12 w-12 shrink-0 rounded-full border border-[#4B2E83]/40 object-cover"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-white">
                                {MOCK_FRIEND_DISPLAY_NAME}
                              </p>
                              <p className="mt-0.5 text-xs text-white/50">
                                Badminton: Int.
                              </p>
                            </div>
                          </div>
                          <motion.button
                            type="button"
                            whileTap={{ scale: 0.99 }}
                            disabled={mockFriendRequestSent}
                            onClick={() => {
                              if (mockFriendRequestSent) return;
                              setMockFriendRequestSent(true);
                              showFriendRequestToast(
                                `Friend request sent to ${MOCK_FRIEND_DISPLAY_NAME}!`
                              );
                            }}
                            className={[
                              "mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border py-3 text-sm font-semibold transition-all",
                              mockFriendRequestSent
                                ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-200"
                                : "border-[#4B2E83]/50 bg-[#4B2E83] text-white shadow-[0_0_24px_rgba(75,46,131,0.35)]",
                            ].join(" ")}
                          >
                            {mockFriendRequestSent ? (
                              <>
                                <Check className="h-4 w-4" />
                                Sent
                              </>
                            ) : (
                              "Add Friend"
                            )}
                          </motion.button>
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* My QR code modal */}
      <AnimatePresence>
        {showMyQrModal && (
          <>
            <motion.div
              className="fixed inset-0 z-[2300] bg-black/80 backdrop-blur-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeMyQrModal}
              aria-hidden
            />
            <motion.div
              className="fixed inset-0 z-[2310] flex items-center justify-center px-5 py-10"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              onClick={closeMyQrModal}
            >
              <div
                className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-black/80 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.85)] backdrop-blur-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={closeMyQrModal}
                  className="absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80 transition-colors hover:bg-white/10"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="flex flex-col items-center pt-2 text-center">
                  <img
                    src={profilePhotoSrc || defaultAvatarSrc}
                    alt=""
                    className="h-16 w-16 rounded-full border-2 border-[#E8D3A2]/40 object-cover shadow-[0_0_24px_rgba(232,211,162,0.25)]"
                  />
                  <p className="mt-3 text-lg font-semibold text-white">{name}</p>
                  <p className="mt-0.5 text-xs text-white/50">{huskyId}</p>
                </div>

                <div className="mt-6 flex justify-center rounded-2xl bg-white p-4 shadow-inner">
                  <QRCodeSVG
                    value={huskyId}
                    size={200}
                    level="M"
                    bgColor="#ffffff"
                    fgColor="#000000"
                  />
                </div>

                <p className="mt-5 text-center text-xs leading-relaxed text-white/55">
                  Show this to your husky partner to get connected!
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Check-in success toast */}
      <AnimatePresence>
        {checkInToast && (
          <motion.div
            className="pointer-events-none fixed bottom-36 left-1/2 z-[2230] w-[min(92vw,22rem)] -translate-x-1/2"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="rounded-2xl border border-[#4B2E83]/60 bg-black px-4 py-3 text-center text-sm font-medium text-white shadow-[0_0_28px_rgba(75,46,131,0.45)]">
              {checkInToast}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Friend request toast */}
      <AnimatePresence>
        {friendToastMessage && (
          <motion.div
            className="pointer-events-none fixed bottom-24 left-1/2 z-[2220] w-[min(92vw,20rem)] -translate-x-1/2"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="rounded-2xl border border-[#4B2E83]/60 bg-black px-4 py-3 text-center text-sm font-medium text-white shadow-[0_0_28px_rgba(75,46,131,0.45)]">
              {friendToastMessage}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

