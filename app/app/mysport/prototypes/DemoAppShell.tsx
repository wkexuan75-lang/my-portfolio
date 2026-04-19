"use client";

import type { PropsWithChildren } from "react";
import type { DemoNavPage } from "@mysport/prototypes/demoNavTypes";
import { DemoBottomNav } from "@mysport/prototypes/DemoBottomNav";

export type DemoAppShellProps = PropsWithChildren<{
  currentPage: DemoNavPage;
  onSelectPage: (page: DemoNavPage) => void;
  className?: string;
}>;

export function DemoAppShell({
  children,
  currentPage,
  onSelectPage,
  className,
}: DemoAppShellProps) {
  return (
    <div
      className={[
        "relative flex min-h-[min(100dvh,56rem)] w-full flex-col overflow-hidden bg-[#050505] text-white",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className="flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden overscroll-contain touch-pan-y"
        onWheel={(e) => e.stopPropagation()}
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {children}
      </div>
      <DemoBottomNav currentPage={currentPage} onSelectPage={onSelectPage} />
    </div>
  );
}
