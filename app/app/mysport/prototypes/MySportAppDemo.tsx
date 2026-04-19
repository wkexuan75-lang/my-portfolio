"use client";

import { useState } from "react";
import { DemoAppShell } from "@mysport/prototypes/DemoAppShell";
import { MySportAppProvider } from "@mysport/prototypes/MySportAppProvider";
import type { DemoNavPage } from "@mysport/prototypes/demoNavTypes";
import { HomeView } from "@mysport/views/HomeView";
import { MatchView } from "@mysport/views/MatchView";
import { CreateView } from "@mysport/views/CreateView";
import { InboxView } from "@mysport/views/InboxView";
import { ProfileView } from "@mysport/views/ProfileView";

function DemoPageView({ page }: { page: DemoNavPage }) {
  switch (page) {
    case "main":
      return <HomeView />;
    case "matches":
      return <MatchView />;
    case "create":
      return <CreateView />;
    case "inbox":
      return <InboxView />;
    case "profile":
      return <ProfileView />;
    default:
      return <HomeView />;
  }
}

export type MySportAppDemoProps = {
  className?: string;
  shellClassName?: string;
};

export function MySportAppDemo({
  className,
  shellClassName,
}: MySportAppDemoProps) {
  const [currentPage, setCurrentPage] = useState<DemoNavPage>("main");

  return (
    <div
      className={[
        "isolate mx-auto flex min-h-0 w-full max-w-md flex-col overflow-hidden touch-pan-y rounded-3xl border border-white/10 shadow-2xl ring-1 ring-white/5",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      onWheel={(e) => e.stopPropagation()}
    >
      <MySportAppProvider>
        <DemoAppShell
          currentPage={currentPage}
          onSelectPage={setCurrentPage}
          className={shellClassName}
        >
          <DemoPageView page={currentPage} />
        </DemoAppShell>
      </MySportAppProvider>
    </div>
  );
}
