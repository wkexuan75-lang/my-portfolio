"use client";

import { ChatProvider } from "@mysport/context/ChatContext";
import { MatchProvider } from "@mysport/context/MatchContext";

export function MySportProvider({ children }: { children: React.ReactNode }) {
  return (
    <MatchProvider>
      <ChatProvider>{children}</ChatProvider>
    </MatchProvider>
  );
}
