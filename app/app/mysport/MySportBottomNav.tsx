"use client";

import type { CSSProperties } from "react";
import { Home, Users, User } from "lucide-react";

import type { MySportDemoTab } from "./mySportDemoTab";

const ITEMS: {
  id: MySportDemoTab;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "matches", label: "Matches", icon: Users },
  { id: "profile", label: "Profile", icon: User },
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

export function MySportBottomNav({
  active,
  onChange,
}: {
  active: MySportDemoTab;
  onChange: (tab: MySportDemoTab) => void;
}) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-white/5 bg-black/80 backdrop-blur-xl">
      <div
        className="mx-auto flex max-w-md items-center justify-between px-6 py-3 text-xs font-medium text-white/50"
        style={{ paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))" }}
      >
        {ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
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
