"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { SESSION_LOGIN_NETID } from "@/lib/profileStorage";

export default function LoginPage() {
  const router = useRouter();
  const [netId, setNetId] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = netId.trim();
    if (!id || !password) return;
    try {
      sessionStorage.setItem(SESSION_LOGIN_NETID, id);
    } catch {
      // still proceed
    }
    router.push("/onboarding");
  };

  return (
    <motion.div
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#050505] px-6 font-sans"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(75,46,131,0.35), transparent 55%), radial-gradient(ellipse 60% 40% at 100% 100%, rgba(232,211,162,0.12), transparent 50%)",
        }}
      />

      <div className="w-full max-w-sm">
        <p className="text-center text-[11px] uppercase tracking-[0.22em] text-white/40">
          University of Washington
        </p>
        <h1 className="mt-2 text-center text-2xl font-semibold tracking-tight text-white">
          Sign in
        </h1>
        <p className="mt-1 text-center text-sm text-white/45">
          Use your UW NetID to continue.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-4">
          <div>
            <label
              htmlFor="netid"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/50"
            >
              UW NetID
            </label>
            <input
              id="netid"
              name="netid"
              type="text"
              autoComplete="username"
              value={netId}
              onChange={(e) => setNetId(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-shadow placeholder:text-white/30 focus:border-[#4B2E83] focus:shadow-[0_0_0_3px_rgba(75,46,131,0.25)]"
              placeholder="your_netid"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/50"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-shadow placeholder:text-white/30 focus:border-[#4B2E83] focus:shadow-[0_0_0_3px_rgba(75,46,131,0.25)]"
              placeholder="••••••••"
            />
          </div>

          <motion.button
            type="submit"
            whileTap={{ scale: 0.99 }}
            disabled={!netId.trim() || !password}
            className="mt-2 w-full rounded-2xl border border-[#4B2E83]/50 bg-[#4B2E83] py-3.5 text-sm font-semibold text-white shadow-[0_0_32px_rgba(75,46,131,0.45)] transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
          >
            Sign In
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}
