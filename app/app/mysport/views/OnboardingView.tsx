"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Dumbbell,
  Plus,
  Volleyball,
  PlusCircle,
} from "lucide-react";
import {
  useMatchContext,
  SPORTS,
  LEVELS,
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

function sportIcon(sport: string) {
  switch (sport) {
    case "Badminton":
      return Volleyball;
    case "Basketball":
      return Dumbbell;
    case "Soccer":
    case "Swimming":
    case "Tennis":
      return Dumbbell;
    default:
      return PlusCircle;
  }
}

function displayNameFromNetId(raw: string) {
  const t = raw.trim();
  if (!t) return "Husky";
  return t.charAt(0).toUpperCase() + t.slice(1);
}

function huskyIdFromUserId(userId: string) {
  const tail = userId.replace(/[^a-zA-Z0-9]/g, "").slice(-8).toUpperCase();
  return `HUSKY-${tail || "00000000"}`;
}

export function OnboardingView() {
  const router = useRouter();
  const { currentUserId } = useMatchContext();
  const huskyId = useMemo(
    () => huskyIdFromUserId(currentUserId),
    [currentUserId]
  );

  const [hydrated, setHydrated] = useState(false);
  const [netId, setNetId] = useState("");
  const [fullName, setFullName] = useState("");

  const [preferredSports, setPreferredSports] = useState<Sport[]>([]);
  const [preferredLevels, setPreferredLevels] = useState<
    Partial<Record<Sport, SkillLevel>>
  >({});
  const [bio, setBio] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const [profilePhotoSrc, setProfilePhotoSrc] = useState<string>("");

  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeName, setWelcomeName] = useState("");

  useEffect(() => {
    try {
      const id = sessionStorage.getItem(SESSION_LOGIN_NETID);
      if (!id) {
        router.replace("/login");
        return;
      }
      setNetId(id);
      setFullName(displayNameFromNetId(id));
    } catch {
      router.replace("/login");
    } finally {
      setHydrated(true);
    }
  }, [router]);

  const avatarInitial = useMemo(() => {
    return (
      (fullName.trim() || displayNameFromNetId(netId)).trim()[0] ?? "H"
    ).toUpperCase();
  }, [fullName, netId]);

  const defaultAvatarSrc = useMemo(
    () => defaultAvatarDataUri(avatarInitial),
    [avatarInitial]
  );

  const openPhotoPicker = () => fileInputRef.current?.click();

  const onProfilePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
      const nextUrl = URL.createObjectURL(file);
      objectUrlRef.current = nextUrl;
      setProfilePhotoSrc(nextUrl);
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        if (typeof result === "string") setProfilePhotoSrc(result);
      };
      reader.readAsDataURL(file);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  const toggleSport = (s: Sport) => {
    const exists = preferredSports.includes(s);
    if (exists) {
      setPreferredSports((prev) => prev.filter((x) => x !== s));
      setPreferredLevels((prev) => {
        const next = { ...prev };
        delete next[s];
        return next;
      });
    } else {
      setPreferredSports((prev) => [...prev, s]);
      setPreferredLevels((prev) => ({
        ...prev,
        [s]: prev[s] ?? "Beginner",
      }));
    }
  };

  const setLevelForSport = (s: Sport, level: SkillLevel) => {
    setPreferredLevels((prev) => ({ ...prev, [s]: level }));
  };

  const persistAndWelcome = useCallback(() => {
    const displayName = fullName.trim();
    try {
      localStorage.setItem(STORAGE_PROFILE_NAME, displayName);
      localStorage.setItem(STORAGE_PROFILE_BIO, bio.trim());
      localStorage.setItem(
        STORAGE_PROFILE_SPORTS,
        JSON.stringify(preferredSports)
      );
      localStorage.setItem(
        STORAGE_PROFILE_LEVELS,
        JSON.stringify(preferredLevels)
      );
      if (profilePhotoSrc) {
        localStorage.setItem(STORAGE_PROFILE_PHOTO, profilePhotoSrc);
      }
    } catch {
      // ignore
    }
    setWelcomeName(displayName);
    setShowWelcome(true);
  }, [bio, fullName, preferredLevels, preferredSports, profilePhotoSrc]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || preferredSports.length === 0) return;
    persistAndWelcome();
  };

  useEffect(() => {
    if (!showWelcome) return;
    const t = window.setTimeout(() => {
      router.push("/matches");
    }, 2500);
    return () => window.clearTimeout(t);
  }, [showWelcome, router]);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505] text-white/50">
        Loading…
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#050505] font-sans text-white">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(to bottom, rgba(75,46,131,0.22), transparent 42%, rgba(232,211,162,0.08))",
        }}
      />

      <div className="mx-auto max-w-md px-6 pb-16 pt-12">
        <p className="text-[11px] uppercase tracking-[0.22em] text-white/40">
          Step 2 · Initialize profile
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          Set up your profile
        </h1>
        <p className="mt-1 text-sm text-white/50">
          Syncs with your Profile page. Husky ID:{" "}
          <span className="text-white/75">{huskyId}</span>
        </p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-10">
          {/* Avatar */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
              Profile photo
            </p>
            <div className="mt-4 flex justify-center">
              <div
                className="relative z-[50] flex h-24 w-24 items-center justify-center overflow-visible rounded-full"
                style={{
                  boxShadow:
                    "0 0 0 1px rgba(232,211,162,0.35), 0 0 26px rgba(232,211,162,0.25)",
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
                  alt=""
                  className="relative z-10 h-full w-full rounded-full object-cover"
                />
                <button
                  type="button"
                  onClick={openPhotoPicker}
                  aria-label="Add photo"
                  className="absolute bottom-0 right-0 z-[50] h-10 w-10 -translate-y-[18%] translate-x-[18%] rounded-full border border-[#4B2E83]/60 bg-black/60 text-white shadow-[0_0_26px_rgba(75,46,131,0.35)] transition-transform hover:scale-[1.06] active:scale-[0.96]"
                >
                  <Plus className="mx-auto h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Sports */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
              Sports you play
            </p>
            <p className="mt-1 text-xs text-white/40">
              Select one or more. You can change this anytime in Profile.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {SPORTS.map((s) => {
                const selected = preferredSports.includes(s);
                const Icon = sportIcon(s);
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSport(s)}
                    className={[
                      "flex items-center gap-2 rounded-2xl border px-3 py-3 text-left text-sm transition-colors",
                      selected
                        ? "border-[#4B2E83]/55 bg-[#4B2E83]/18 text-white shadow-[0_0_22px_rgba(75,46,131,0.22)]"
                        : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10",
                    ].join(" ")}
                  >
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-[#4B2E83]/10">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="truncate">{s}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Levels */}
          {preferredSports.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
                Skill levels
              </p>
              <div className="mt-4 space-y-4">
                {preferredSports.map((s) => {
                  const level = preferredLevels[s] ?? "Beginner";
                  const Icon = sportIcon(s);
                  return (
                    <div
                      key={s}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4"
                    >
                      <div className="mb-3 flex items-center gap-2">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#4B2E83]/10">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="text-sm font-medium">{s}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {LEVELS.map((l) => (
                          <button
                            key={l}
                            type="button"
                            onClick={() => setLevelForSport(s, l)}
                            className={[
                              "rounded-xl border px-3 py-2 text-xs font-semibold uppercase tracking-wide transition-colors",
                              l === level
                                ? "border-[#4B2E83] bg-[#4B2E83]/25 text-[#E8D3A2]"
                                : "border-white/10 bg-black/30 text-white/60 hover:border-white/20",
                            ].join(" ")}
                          >
                            {l}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Full name */}
          <div>
            <label
              htmlFor="onboarding-full-name"
              className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45"
            >
              Full Name
            </label>
            <input
              id="onboarding-full-name"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#4B2E83] focus:shadow-[0_0_0_3px_rgba(75,46,131,0.2)]"
            />
          </div>

          {/* Bio */}
          <div>
            <label
              htmlFor="onboarding-bio"
              className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45"
            >
              Bio
            </label>
            <textarea
              id="onboarding-bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              placeholder="Tell us a bit about your play style."
              className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#4B2E83] focus:shadow-[0_0_0_3px_rgba(75,46,131,0.2)]"
            />
          </div>

          <motion.button
            type="submit"
            whileTap={{ scale: 0.99 }}
            disabled={!fullName.trim() || preferredSports.length === 0}
            className="w-full rounded-2xl border border-[#4B2E83]/50 bg-[#4B2E83] py-4 text-sm font-semibold text-white shadow-[0_0_32px_rgba(75,46,131,0.4)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Start My Journey
          </motion.button>
        </form>
      </div>

      <AnimatePresence>
        {showWelcome && (
          <motion.div
            className="fixed inset-0 z-[5000] flex flex-col items-center justify-center bg-black px-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <motion.h2
              className="max-w-md text-3xl font-bold leading-tight text-[#E8D3A2] sm:text-4xl"
              style={{ textShadow: "0 0 40px rgba(232,211,162,0.35)" }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.45, ease: "easeOut" }}
            >
              Welcome to the Husky Pack! 🐾
            </motion.h2>
            <motion.p
              className="mt-3 text-lg font-medium text-white"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              {welcomeName}
            </motion.p>
            <motion.p
              className="mt-6 max-w-sm text-sm text-white/55"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.35 }}
            >
              Your profile is ready. Connecting you to the community…
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
