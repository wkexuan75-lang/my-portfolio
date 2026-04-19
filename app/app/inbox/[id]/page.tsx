"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Send } from "lucide-react";
import { useChatContext } from "@/context/ChatContext";

const UW_PURPLE = "#4B2E83";
const UW_GOLD = "#E8D3A2";

const CONVERSATION_NAMES: Record<string, string> = {
  "1": "Ruige",
  "2": "Alex",
  "3": "Jamie",
};

export default function InboxChatPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const name = CONVERSATION_NAMES[id] ?? "Unknown";

  const { getMessages, sendMessage } = useChatContext();
  const messages = getMessages(id);

  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    sendMessage(id, trimmed);
    setInput("");
  };

  const hasText = input.trim().length > 0;

  return (
    <motion.div
      className="relative flex min-h-screen flex-col bg-[#050505] font-sans"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {/* Sticky header */}
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-white/5 bg-[#050505]/95 px-4 py-3 backdrop-blur-xl">
        <Link
          href="/inbox"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/80 transition-colors hover:bg-white/10"
          aria-label="Back to Inbox"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div className="flex min-w-0 flex-1 flex-col">
          <p className="truncate text-base font-semibold text-white">{name}</p>
          <p className="text-[11px] text-emerald-400/90">Active now</p>
        </div>
      </header>

      {/* Scrollable message area — extra pb so content scrolls above fixed input */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 pb-6"
        style={{ paddingBottom: "calc(1.5rem + 72px)" }}
      >
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {messages.map((msg) => {
              const isOutgoing = msg.sender === "me";
              return (
                <motion.div
                  key={msg.id}
                  initial={{
                    opacity: 0,
                    y: 8,
                    scale: isOutgoing ? 0.85 : 0.96,
                  }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 28,
                  }}
                  className={`flex ${isOutgoing ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                      isOutgoing
                        ? "rounded-br-md bg-[#4B2E83] text-white shadow-[0_0_20px_rgba(75,46,131,0.4)]"
                        : "rounded-bl-md border border-white/10 bg-white/[0.06] text-white/95 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl"
                    }`}
                  >
                    <p className="text-[14px] leading-snug">{msg.text}</p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Fixed input above BottomNav — glassmorphism */}
      <div
        className="fixed left-0 right-0 z-20 border-t border-white/5 bg-black/60 px-4 pt-3 pb-5 backdrop-blur-md"
        style={{ bottom: "64px" }}
      >
        <div className="mx-auto flex max-w-md items-center gap-2.5">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type a message..."
            className="min-h-[44px] flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/10"
          />
          <button
            type="button"
            onClick={handleSend}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/60 transition-colors hover:bg-white/15"
            aria-label="Send message"
          >
            <Send
              className="h-4 w-4 transition-colors"
              style={{ color: hasText ? UW_GOLD : undefined }}
            />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
