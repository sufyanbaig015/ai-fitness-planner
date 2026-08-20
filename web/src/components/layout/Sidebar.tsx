"use client";

import { clsx } from "clsx";
import {
  BarChart3,
  CreditCard,
  Dumbbell,
  LayoutDashboard,
  MessageSquare,
  Smartphone,
  Users,
  X,
} from "lucide-react";

const navMain = [
  { label: "Dashboard", icon: LayoutDashboard, active: false },
  { label: "Clients", icon: Users, active: false },
  { label: "Programs", icon: Dumbbell, active: true },
  { label: "Check-ins", icon: MessageSquare, badge: 3, active: false },
];

const navBusiness = [
  { label: "Payments", icon: CreditCard },
  { label: "Analytics", icon: BarChart3 },
  { label: "Client App", icon: Smartphone },
];

type Props = {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
};

export function Sidebar({ mobileOpen = false, onCloseMobile }: Props) {
  return (
    <>
      {/* Mobile overlay */}
      <button
        type="button"
        aria-label="Close menu"
        onClick={onCloseMobile}
        className={clsx(
          "fixed inset-0 z-[55] bg-ink/40 backdrop-blur-[2px] transition-opacity md:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <aside
        className={clsx(
          "fixed left-0 top-0 z-[60] flex h-screen w-[248px] flex-col bg-ink text-white shadow-[4px_0_24px_rgba(17,24,39,0.12)] transition-transform duration-300 md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="border-b border-white/10 px-5 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-coral text-xs font-black tracking-tight text-white">
                CR
              </span>
              <div className="text-lg font-extrabold tracking-[0.18em]">CROCK</div>
            </div>
            <button
              type="button"
              className="rounded-lg p-1.5 text-white/50 hover:bg-white/10 hover:text-white md:hidden"
              onClick={onCloseMobile}
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            className="mt-4 flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-left transition hover:bg-white/[0.08]"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-coral to-coral-dark text-[11px] font-bold">
              MS
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-white">
                Maya&apos;s Studio
              </span>
              <span className="block text-[11px] text-white/40">Pro workspace</span>
            </span>
            <span className="text-xs text-white/35">▾</span>
          </button>
        </div>

        <nav className="scrollbar-thin flex-1 overflow-y-auto px-3 py-4">
          <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">
            Workspace
          </p>
          <ul className="space-y-0.5">
            {navMain.map((item) => (
              <li key={item.label}>
                <div
                  className={clsx(
                    "group flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                    item.active
                      ? "bg-white/10 text-white shadow-inner"
                      : "text-white/65 hover:bg-white/[0.06] hover:text-white",
                  )}
                >
                  <item.icon
                    className={clsx(
                      "h-4 w-4",
                      item.active ? "text-coral" : "text-white/45 group-hover:text-white/80",
                    )}
                  />
                  <span className="flex-1">{item.label}</span>
                  {item.badge ? (
                    <span className="rounded-full bg-coral px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
                      {item.badge}
                    </span>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>

          <p className="mb-2 mt-7 px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">
            Business
          </p>
          <ul className="space-y-0.5">
            {navBusiness.map((item) => (
              <li key={item.label}>
                <div className="group flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/65 transition hover:bg-white/[0.06] hover:text-white">
                  <item.icon className="h-4 w-4 text-white/45 group-hover:text-white/80" />
                  {item.label}
                </div>
              </li>
            ))}
          </ul>
        </nav>

        <div className="m-3 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-coral">
            14 days left
          </p>
          <p className="mt-1.5 text-sm leading-snug text-white/70">
            Unlock unlimited AI plans for your clients.
          </p>
          <button
            type="button"
            className="mt-3 w-full rounded-xl bg-coral py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-coral-dark active:scale-[0.98]"
          >
            Upgrade Plan
          </button>
        </div>
      </aside>
    </>
  );
}
