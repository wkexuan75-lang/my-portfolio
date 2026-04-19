"use client";

import type { PropsWithChildren } from "react";
import { usePathname } from "next/navigation";
import { BottomNav } from "./BottomNav";

export function AppShell({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const hideNav = pathname === "/login" || pathname === "/onboarding";

  return (
    <div
      className="relative min-h-screen"
      style={
        hideNav
          ? undefined
          : { paddingBottom: "calc(80px + env(safe-area-inset-bottom, 0px))" }
      }
    >
      {children}
      {!hideNav && <BottomNav />}
    </div>
  );
}
