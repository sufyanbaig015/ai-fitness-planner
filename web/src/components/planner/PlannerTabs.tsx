"use client";

import { clsx } from "clsx";
import type { PlannerTab } from "@/lib/types";
import { Apple, Dumbbell, MessageCircle, UserRound } from "lucide-react";

const tabs: {
  id: PlannerTab;
  label: string;
  icon: typeof UserRound;
}[] = [
  { id: "profile", label: "Profile", icon: UserRound },
  { id: "diet", label: "Diet Plan", icon: Apple },
  { id: "fitness", label: "Fitness Plan", icon: Dumbbell },
  { id: "qa", label: "Q&A", icon: MessageCircle },
];

type Props = {
  active: PlannerTab;
  onChange: (tab: PlannerTab) => void;
  hasPlans: boolean;
};

export function PlannerTabs({ active, onChange, hasPlans }: Props) {
  return (
    <div className="sticky top-[57px] z-30 -mx-1 overflow-x-auto px-1 pb-1 backdrop-blur-sm">
      <div className="inline-flex min-w-full gap-1 rounded-2xl border border-canvas-line bg-white/90 p-1.5 shadow-card sm:min-w-0">
        {tabs.map((tab) => {
          const disabled = !hasPlans && tab.id !== "profile";
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              disabled={disabled}
              onClick={() => onChange(tab.id)}
              className={clsx(
                "inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                active === tab.id
                  ? "bg-ink text-white shadow-sm"
                  : "text-ink-muted hover:bg-canvas hover:text-ink",
                disabled && "cursor-not-allowed opacity-35",
              )}
            >
              <Icon className="h-4 w-4 shrink-0 opacity-80" />
              <span className="whitespace-nowrap">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
