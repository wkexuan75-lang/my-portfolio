"use client";

import type { CSSProperties } from "react";
import { Plus, Users, Inbox, User, Map } from "lucide-react";
import type { DemoNavPage } from "@mysport/prototypes/demoNavTypes";

type DemoNavItem = {
  page: DemoNavPage;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const DEMO_NAV_ITEMS: DemoNavItem[] = [
  { page: "main", label: "Pulse", icon: Map },
  { page: "create", label: "Create", icon: Plus },
  { page: "matches", label: "Matches", icon: Users },
  { page: "inbox", label: "Inbox", icon: Inbox },
  { page: "profile", label: "Profile", icon: User },
];

function navButtonClass(isActive: boolean) {
  return `flex flex-1 flex-col items-center gap-1 text-[11px] ${
    isActive ? "text-white" : "text-gray-500"
  }`;
}

function navIconWrapClass(isActive: boolean) {
  return `inline-flex h-8 w-8 items-center justify-center rounded-full transition-all ${
    isActive ? "bg-[#4B2E83]/25" : "bg-white/5 text-white/70"
  }`;
}

function navIconActiveStyle(isActive: boolean): CSSProperties | undefined {
  return isActive
    ? {
        color: "#C4B5E0",
        textShadow:
          "0 0 6px rgba(75,46,131,0.9), 0 0 14px rgba(75,46,131,0.6)",
      }
    : undefined;
}

export type DemoBottomNavProps = {
  currentPage: DemoNavPage;
  onSelectPage: (page: DemoNavPage) => void;
};

export function DemoBottomNav({ currentPage, onSelectPage }: DemoBottomNavProps) {
  return (
    <nav className="z-30 w-full shrink-0 border-t border-white/5 bg-black/80 backdrop-blur-xl">
      <div
        className="mx-auto flex max-w-md items-center justify-between px-4 py-3 text-xs font-medium text-white/50"
        style={{
          paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))",
        }}
      >
        {DEMO_NAV_ITEMS.map(({ page, label, icon: Icon }) => {
          const isActive = currentPage === page;
          return (
            <button
              key={page}
              type="button"
              onClick={() => onSelectPage(page)}
              className={navButtonClass(isActive)}
            >
              <span
                className={navIconWrapClass(isActive)}
                style={navIconActiveStyle(isActive)}
              >
                <Icon className="h-4 w-4" />
              </span>
              <span className="relative flex h-4 flex-col items-center justify-center">
                <span className="tracking-wide">{label}</span>
                {isActive && (
                  <span className="mt-[2px] h-1 w-1 rounded-full bg-[#4B2E83]" />
                )}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
