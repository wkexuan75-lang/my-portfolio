"use client";

import { useState } from "react";

import { AppShell } from "./app/AppShell";
import { HomeView } from "./views/HomeView";
import { MatchView } from "./views/MatchView";
import { ProfileView } from "./views/ProfileView";
import { MySportBottomNav } from "./MySportBottomNav";
import { MySportProvider } from "./MySportProvider";
import type { MySportDemoTab } from "./mySportDemoTab";

export default function MySportDemo() {
  const [tab, setTab] = useState<MySportDemoTab>("home");

  return (
    <MySportProvider>
      <AppShell
        embeddedNav={
          <MySportBottomNav active={tab} onChange={setTab} />
        }
      >
        {tab === "home" && <HomeView />}
        {tab === "matches" && <MatchView />}
        {tab === "profile" && <ProfileView />}
      </AppShell>
    </MySportProvider>
  );
}
