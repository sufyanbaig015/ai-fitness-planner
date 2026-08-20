"use client";

import { useState, type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

type Props = {
  children: ReactNode;
  onGenerate: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  onOpenSettings: () => void;
  generating: boolean;
  canGenerate: boolean;
  hasPlans: boolean;
  status: "draft" | "published";
  savedAgo: string;
};

export function AppShell({
  children,
  onGenerate,
  onSaveDraft,
  onPublish,
  onOpenSettings,
  generating,
  canGenerate,
  hasPlans,
  status,
  savedAgo,
}: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Offset for fixed sidebar on desktop */}
      <div className="flex min-h-screen min-w-0 flex-col md:pl-[248px]">
        <TopBar
          onGenerate={onGenerate}
          onSaveDraft={onSaveDraft}
          onPublish={onPublish}
          onOpenSettings={onOpenSettings}
          onOpenMobileNav={() => setMobileOpen(true)}
          generating={generating}
          canGenerate={canGenerate}
          hasPlans={hasPlans}
          status={status}
          savedAgo={savedAgo}
        />
        <main className="relative flex-1 px-4 py-5 md:px-7 md:py-6">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,90,95,0.04),_transparent_55%)]" />
          <div className="relative">{children}</div>
        </main>
      </div>
    </div>
  );
}
