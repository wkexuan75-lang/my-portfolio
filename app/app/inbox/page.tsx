"use client";

import { useState, type MouseEvent as ReactMouseEvent } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Bell, Circle, CircleDot } from "lucide-react";
import { useChatContext } from "@/context/ChatContext";
import { useMatchContext } from "@/context/MatchContext";
import { Check, X } from "lucide-react";

const UW_PURPLE = "#4B2E83";
const EMERALD = "#10B981";
const SOFT_RED = "#EF4444";

type Tab = "messages" | "notifications";

type MessageItem = {
  id: number;
  name: string;
  preview: string;
  time: string;
  sport: string;
  unread: boolean;
};

type NotificationItem = {
  id: number;
  title: string;
  body: string;
  unread: boolean;
  kind: "request" | "reminder";
  matchId?: number;
};

const MESSAGES: MessageItem[] = [
  {
    id: 1,
    name: "Ruige",
    preview: "Let’s warm up 10 mins early?",
    time: "5:02 PM",
    sport: "Badminton",
    unread: true,
  },
  {
    id: 2,
    name: "Alex",
    preview: "We’re short one for 3v3.",
    time: "4:41 PM",
    sport: "Basketball",
    unread: false,
  },
  {
    id: 3,
    name: "Jamie",
    preview: "Court 2 just opened up.",
    time: "3:19 PM",
    sport: "Tennis",
    unread: true,
  },
];

const NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    title: "Match Request",
    body: "Ruige wants to join your Badminton match.",
    unread: true,
    kind: "request",
    matchId: 1,
  },
  {
    id: 2,
    title: "Reminder",
    body: "Your Basketball run starts in 1 hour.",
    unread: true,
    kind: "reminder",
  },
  {
    id: 3,
    title: "Update",
    body: "Soccer field changed to IMA Turf B due to maintenance.",
    unread: false,
    kind: "reminder",
  },
];

function formatPreviewTime(ts: number) {
  const d = new Date(ts);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) {
    return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

type NotificationStatus = "accepted" | "declined";
type ModalState = { type: "accept" | "decline"; noteId: number } | null;

export default function InboxPage() {
  const { getLastMessage } = useChatContext();
  const { acceptGuestRequest } = useMatchContext();
  const [activeTab, setActiveTab] = useState<Tab>("messages");
  const [notificationStatus, setNotificationStatus] = useState<
    Record<number, NotificationStatus>
  >({});
  const [modal, setModal] = useState<ModalState>(null);

  const handleAccept = (note: NotificationItem) => {
    setNotificationStatus((s) => ({ ...s, [note.id]: "accepted" }));
    if (note.matchId != null) {
      acceptGuestRequest(note.matchId);
    }
    setModal({ type: "accept", noteId: note.id });
  };

  const handleDecline = (note: NotificationItem) => {
    setNotificationStatus((s) => ({ ...s, [note.id]: "declined" }));
    setModal({ type: "decline", noteId: note.id });
  };

  const hasMessages = MESSAGES.length > 0;
  const hasNotifications = NOTIFICATIONS.length > 0;

  const isEmpty =
    (activeTab === "messages" && !hasMessages) ||
    (activeTab === "notifications" && !hasNotifications);

  return (
    <motion.div
      className="relative min-h-screen overflow-hidden bg-[#050505] font-sans"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {/* Sticky header */}
      <header className="sticky top-0 z-20 border-b border-white/5 bg-[#050505]/95 px-6 pb-3 pt-8 backdrop-blur-xl">
        <h1 className="text-xl font-semibold tracking-tight text-white">
          Inbox
        </h1>

        {/* Segmented control */}
        <div className="mt-4 inline-flex rounded-full bg-white/5 p-1 text-xs text-white/60">
          {["messages", "notifications"].map((tab) => {
            const key = tab as Tab;
            const isActive = activeTab === key;
            const label = key === "messages" ? "Messages" : "Notifications";
            const Icon = key === "messages" ? MessageCircle : Bell;

            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                className="relative flex min-w-[7rem] items-center justify-center gap-1.5 rounded-full px-3 py-1.5"
              >
                <AnimatePresence>
                  {isActive && (
                    <motion.span
                      layoutId="inbox-tab-pill"
                      className="absolute inset-0 rounded-full bg-[#111827]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.16 }}
                    />
                  )}
                </AnimatePresence>
                <span className="relative z-10 flex items-center gap-1.5">
                  <Icon
                    className="h-3.5 w-3.5"
                    strokeWidth={1.6}
                  />
                  <span
                    className={`text-[11px] font-medium ${
                      isActive ? "text-white" : "text-white/60"
                    }`}
                  >
                    {label}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Content */}
      <main className="pb-28 pt-3">
        <AnimatePresence mode="wait">
          {activeTab === "messages" ? (
            <motion.section
              key="messages"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="px-4"
            >
              {hasMessages ? (
                <ul className="space-y-2">
                  {MESSAGES.map((msg, index) => {
                    const lastMsg = getLastMessage(String(msg.id));
                    const preview = lastMsg ? lastMsg.text : msg.preview;
                    const time = lastMsg
                      ? formatPreviewTime(lastMsg.timestamp)
                      : msg.time;
                    return (
                    <motion.li
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.22,
                        ease: "easeOut",
                        delay: 0.03 * index,
                      }}
                    >
                      <Link href={`/inbox/${msg.id}`}>
                        <motion.span
                          className="block"
                          whileTap={{ scale: 0.97 }}
                        >
                          <span className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-3.5 py-3 text-left shadow-[0_18px_60px_rgba(0,0,0,0.85)] backdrop-blur-xl">
                        {/* Avatar */}
                        <div className="relative">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#111827] to-[#020617] text-xs font-semibold text-white/80">
                            {msg.name[0]}
                          </div>
                          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-black bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
                        </div>

                        {/* Text content */}
                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-semibold text-white">
                              {msg.name}
                            </p>
                            <span className="rounded-full bg-white/5 px-2 py-[2px] text-[10px] uppercase tracking-wide text-white/45">
                              {msg.sport}
                            </span>
                          </div>
                          <p className="mt-0.5 line-clamp-1 text-[12px] text-white/60">
                            {preview}
                          </p>
                        </div>

                        {/* Meta */}
                        <div className="flex flex-col items-end gap-1 text-right">
                          <span className="text-[10px] text-white/40">
                            {time}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="inline-flex h-5 items-center rounded-full bg-white/5 px-1.5 text-[10px] text-white/45">
                              <CircleDot className="mr-1 h-2.5 w-2.5 text-white/50" />
                              Chat
                            </span>
                            {msg.unread && (
                              <span className="h-2.5 w-2.5 rounded-full bg-[#4B2E83] shadow-[0_0_10px_rgba(75,46,131,0.9)]" />
                            )}
                          </div>
                        </div>
                          </span>
                        </motion.span>
                      </Link>
                    </motion.li>
                    );
                  })}
                </ul>
              ) : (
                <EmptyState kind="messages" />
              )}
            </motion.section>
          ) : (
            <motion.section
              key="notifications"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="px-4"
            >
              {hasNotifications ? (
                <ul className="space-y-2">
                  {NOTIFICATIONS.map((note, index) => {
                    const status = notificationStatus[note.id];
                    const isRequest = note.kind === "request";
                    const showButtons = isRequest && !status;
                    return (
                      <motion.li
                        key={note.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -24 }}
                        transition={{
                          duration: 0.22,
                          ease: "easeOut",
                          delay: 0.03 * index,
                        }}
                      >
                        <motion.div
                          whileTap={showButtons ? { scale: 0.97 } : undefined}
                          className={`flex w-full items-start gap-3 rounded-2xl border px-3.5 py-3 text-left shadow-[0_18px_60px_rgba(0,0,0,0.85)] backdrop-blur-xl ${
                            status
                              ? "border-white/10 bg-white/[0.02] opacity-90"
                              : note.unread
                                ? "border-[#4B2E83]/40 bg-white/[0.05]"
                                : "border-white/12 bg-white/[0.02]"
                          }`}
                        >
                          <div className="mt-1">
                            <Bell className="h-4 w-4 text-white/60" />
                          </div>
                          <div className="flex min-w-0 flex-1 flex-col">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-white">
                                {note.title}
                              </p>
                              {!status && note.unread && (
                                <span className="rounded-full bg-[#4B2E83]/15 px-2 py-[2px] text-[10px] font-medium uppercase tracking-wide text-[#C4B5E0]">
                                  New
                                </span>
                              )}
                              {status === "accepted" && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-[2px] text-[10px] font-medium text-emerald-400">
                                  <Check className="h-3 w-3" />
                                  Accepted
                                </span>
                              )}
                              {status === "declined" && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-[2px] text-[10px] font-medium text-white/50">
                                  <X className="h-3 w-3" />
                                  Declined
                                </span>
                              )}
                            </div>
                            <p className="mt-0.5 text-[12px] text-white/65">
                              {note.body}
                            </p>

                            {showButtons && (
                              <div className="mt-3 flex gap-2 text-[12px]">
                                <button
                                  type="button"
                                  onClick={() => handleAccept(note)}
                                  className="flex-1 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 font-medium text-white/85 transition-transform active:scale-[0.97]"
                                >
                                  Accept
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDecline(note)}
                                  className="flex-1 rounded-full border border-white/10 bg-white/0 px-3 py-1.5 font-medium text-white/60 transition-transform active:scale-[0.97]"
                                >
                                  Decline
                                </button>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      </motion.li>
                    );
                  })}
                </ul>
              ) : (
                <EmptyState kind="notifications" />
              )}
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* Accept success modal */}
      <AnimatePresence>
        {modal?.type === "accept" && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setModal(null)}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center px-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-emerald-500/30 bg-[#050505]/98 p-6 text-center shadow-[0_24px_80px_rgba(0,0,0,0.9)]"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                onClick={(e: ReactMouseEvent<HTMLDivElement>) =>
                  e.stopPropagation()
                }
              >
                {/* Confetti-like dots */}
                <div className="pointer-events-none absolute left-1/2 top-1/2 h-0 w-0 -translate-x-1/2 -translate-y-1/2 overflow-visible">
                  {[...Array(12)].map((_, i) => {
                    const angle = (i / 12) * Math.PI * 2;
                    return (
                      <motion.span
                        key={i}
                        className="absolute h-1.5 w-1.5 rounded-full bg-emerald-400"
                        style={{ left: 0, top: 0 }}
                        initial={{ scale: 0, x: 0, y: 0 }}
                        animate={{
                          scale: 1,
                          x: Math.cos(angle) * 56,
                          y: Math.sin(angle) * 56,
                        }}
                        transition={{
                          duration: 0.45,
                          delay: 0.03 * (i % 6),
                          ease: "easeOut",
                        }}
                      />
                    );
                  })}
                </div>
                <div className="relative">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20">
                    <Check className="h-6 w-6 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    Success
                  </h3>
                  <p className="mt-2 text-sm text-white/70">
                    You&apos;ve accepted the request. They&apos;ll be added to the match.
                  </p>
                  <button
                    type="button"
                    onClick={() => setModal(null)}
                    className="mt-4 w-full rounded-full bg-emerald-500/20 px-4 py-2.5 text-sm font-medium text-emerald-400 transition-colors hover:bg-emerald-500/30"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Decline neutral modal */}
      <AnimatePresence>
        {modal?.type === "decline" && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setModal(null)}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center px-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0a0a0a]/98 p-6 text-center shadow-[0_24px_80px_rgba(0,0,0,0.9)]"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                onClick={(e: ReactMouseEvent<HTMLDivElement>) =>
                  e.stopPropagation()
                }
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#EF4444]/15">
                  <X className="h-6 w-6 text-[#EF4444]/90" />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  Request declined
                </h3>
                <p className="mt-2 text-sm text-white/60">
                  No problem. The requester will not be added to the match.
                </p>
                <button
                  type="button"
                  onClick={() => setModal(null)}
                  className="mt-4 w-full rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/10"
                >
                  Understood
                </button>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function EmptyState({ kind }: { kind: "messages" | "notifications" }) {
  const label =
    kind === "messages" ? "No messages yet" : "No notifications yet";

  return (
    <div className="flex flex-col items-center justify-center px-6 pt-16 text-center text-white/50">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-dashed border-white/15 bg-white/[0.02]">
        <Circle className="h-7 w-7 text-white/25" />
      </div>
      <p className="text-sm font-medium">{label}</p>
      <p className="mt-1 text-[12px] text-white/35">
        When things start moving, you&apos;ll see them here.
      </p>
    </div>
  );
}

