"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const STORAGE_KEY = "uw-sport-chat-histories";

export type ChatMessage = {
  id: string;
  text: string;
  sender: "me" | "them";
  timestamp: number;
};

type ChatHistories = Record<string, ChatMessage[]>;

const INITIAL_THREADS: ChatHistories = {
  "1": [
    {
      id: "i1",
      text: "Hey! Ready for tomorrow's match?",
      sender: "them",
      timestamp: Date.now() - 3600000,
    },
    {
      id: "i2",
      text: "Yeah, see you at the court.",
      sender: "me",
      timestamp: Date.now() - 3500000,
    },
    {
      id: "i3",
      text: "Let's warm up 10 mins early?",
      sender: "them",
      timestamp: Date.now() - 60000,
    },
  ],
  "2": [
    {
      id: "a1",
      text: "We're short one for 3v3. You in?",
      sender: "them",
      timestamp: Date.now() - 7200000,
    },
  ],
  "3": [
    {
      id: "j1",
      text: "Court 2 just opened up if you want to hit.",
      sender: "them",
      timestamp: Date.now() - 5400000,
    },
  ],
};

type ChatContextValue = {
  chatHistories: ChatHistories;
  getMessages: (chatId: string) => ChatMessage[];
  getLastMessage: (chatId: string) => ChatMessage | null;
  sendMessage: (chatId: string, messageText: string) => void;
};

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [chatHistories, setChatHistories] = useState<ChatHistories>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw =
        typeof window !== "undefined"
          ? localStorage.getItem(STORAGE_KEY)
          : null;
      if (raw) {
        const parsed = JSON.parse(raw) as unknown;
        if (
          parsed !== null &&
          typeof parsed === "object" &&
          !Array.isArray(parsed)
        ) {
          const next: ChatHistories = {};
          for (const [key, value] of Object.entries(parsed)) {
            if (Array.isArray(value) && key) {
              next[key] = value.filter(
                (m: unknown) =>
                  m !== null &&
                  typeof m === "object" &&
                  "id" in m &&
                  "text" in m &&
                  "sender" in m &&
                  "timestamp" in m,
              ) as ChatMessage[];
            }
          }
          setChatHistories(next);
        }
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chatHistories));
    } catch {
      // ignore
    }
  }, [chatHistories, hydrated]);

  const getMessages = useCallback(
    (chatId: string): ChatMessage[] => {
      return (
        chatHistories[chatId] ??
        INITIAL_THREADS[chatId] ??
        []
      );
    },
    [chatHistories],
  );

  const getLastMessage = useCallback(
    (chatId: string): ChatMessage | null => {
      const list = getMessages(chatId);
      return list.length > 0 ? list[list.length - 1]! : null;
    },
    [getMessages],
  );

  const sendMessage = useCallback((chatId: string, messageText: string) => {
    const trimmed = messageText.trim();
    if (!trimmed) return;
    const newMsg: ChatMessage = {
      id: `sent-${Date.now()}`,
      text: trimmed,
      sender: "me",
      timestamp: Date.now(),
    };
    setChatHistories((prev) => {
      const base = prev[chatId] ?? INITIAL_THREADS[chatId] ?? [];
      return { ...prev, [chatId]: [...base, newMsg] };
    });
  }, []);

  const value: ChatContextValue = {
    chatHistories,
    getMessages,
    getLastMessage,
    sendMessage,
  };

  return (
    <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
  );
}

export function useChatContext(): ChatContextValue {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error("useChatContext must be used within ChatProvider");
  }
  return ctx;
}
