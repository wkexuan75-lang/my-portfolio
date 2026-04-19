"use client";

import type { PropsWithChildren } from "react";
import { ChatProvider } from "@mysport/context/ChatContext";
import { MatchProvider } from "@mysport/context/MatchContext";

export function MySportAppProvider({ children }: PropsWithChildren) {
  return (
    <MatchProvider>
      <ChatProvider>{children}</ChatProvider>
    </MatchProvider>
  );
}
