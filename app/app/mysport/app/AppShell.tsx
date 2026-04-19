"use client";

import type { PropsWithChildren, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { BottomNav } from "./BottomNav";

type AppShellProps = PropsWithChildren<{
  /** When set, shows this nav instead of router-based BottomNav (no navigation). */
  embeddedNav?: ReactNode;
}>;

export function AppShell({ children, embeddedNav }: AppShellProps) {
  const pathname = usePathname();
  const hideRouterNav =
    pathname === "/login" ||
    pathname === "/onboarding" ||
    pathname?.endsWith("/login") ||
    pathname?.endsWith("/onboarding");

  const showRouterNav = embeddedNav == null && !hideRouterNav;
  const showEmbeddedNav = embeddedNav != null;

  return (
    <div
      className="relative min-h-screen"
      style={
        showRouterNav || showEmbeddedNav
          ? { paddingBottom: "calc(80px + env(safe-area-inset-bottom, 0px))" }
          : undefined
      }
    >
      {children}
      {showEmbeddedNav ? embeddedNav : null}
      {showRouterNav ? <BottomNav /> : null}
    </div>
  );
}
