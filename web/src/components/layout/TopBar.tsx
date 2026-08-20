"use client";

import { Button } from "@/components/ui/Button";
import { Menu, Settings } from "lucide-react";

type Props = {
  onGenerate: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  onOpenSettings: () => void;
  onOpenMobileNav: () => void;
  generating: boolean;
  canGenerate: boolean;
  hasPlans: boolean;
  status: "draft" | "published";
  savedAgo: string;
};

export function TopBar({
  onGenerate,
  onSaveDraft,
  onPublish,
  onOpenSettings,
  onOpenMobileNav,
  generating,
  canGenerate,
  hasPlans,
  status,
  savedAgo,
}: Props) {
  return (
    <header className="sticky top-0 z-40 border-b border-canvas-line/80 bg-white/90 backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-6 md:py-3.5">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileNav}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-canvas-line bg-white text-ink md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4" />
          </button>
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-ink-muted">
              Programs{" "}
              <span className="text-ink-faint">/</span> AI Health Planner{" "}
              <span className="text-ink-faint">/</span> Personalized Plan
            </p>
            <div className="mt-0.5 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs text-ink-muted">Auto-saved {savedAgo}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="ghost"
            type="button"
            onClick={onOpenSettings}
            className="!px-3"
          >
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </Button>
          <Button
            variant="secondary"
            type="button"
            disabled={!hasPlans}
            className="hidden !px-3 lg:inline-flex"
          >
            Preview
          </Button>
          <Button
            variant="secondary"
            type="button"
            onClick={onSaveDraft}
            disabled={!hasPlans}
            className="hidden sm:inline-flex"
          >
            Save Draft
          </Button>
          {hasPlans ? (
            <>
              <Button
                variant="secondary"
                type="button"
                onClick={onGenerate}
                loading={generating}
                disabled={!canGenerate}
                className="hidden md:inline-flex"
              >
                Regenerate
              </Button>
              <Button
                type="button"
                onClick={onPublish}
                disabled={status === "published"}
              >
                {status === "published" ? "Published" : "Publish"}
              </Button>
            </>
          ) : (
            <Button
              type="button"
              onClick={onGenerate}
              loading={generating}
              disabled={!canGenerate}
            >
              Generate Plan
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
