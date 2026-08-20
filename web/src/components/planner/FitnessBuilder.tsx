"use client";

import { clsx } from "clsx";
import type { ExerciseItem, FitnessPlan, FitnessWeek } from "@/lib/types";
import { Dumbbell, Moon, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";

type Props = {
  plan: FitnessPlan;
  activeWeek: number;
  onWeekChange: (week: number) => void;
  selectedKey: string | null;
  onSelect: (key: string | null) => void;
};

function exerciseKey(week: number, dayIdx: number, exIdx: number) {
  return `${week}-${dayIdx}-${exIdx}`;
}

function libraryFromPlan(weeks: FitnessWeek[]): ExerciseItem[] {
  const map = new Map<string, ExerciseItem>();
  for (const week of weeks) {
    for (const day of week.days) {
      for (const ex of day.exercises) {
        if (!map.has(ex.name)) map.set(ex.name, ex);
      }
    }
  }
  return Array.from(map.values());
}

const FILTERS = ["ALL", "GLUTES", "LEGS", "CORE", "UPPER", "CARDIO"] as const;

export function FitnessBuilder({
  plan,
  activeWeek,
  onWeekChange,
  selectedKey,
  onSelect,
}: Props) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("ALL");

  const week =
    plan.weeks.find((w) => w.week === activeWeek) ?? plan.weeks[0] ?? null;

  const library = useMemo(() => libraryFromPlan(plan.weeks), [plan.weeks]);

  const filteredLibrary = useMemo(() => {
    return library.filter((ex) => {
      const hay = `${ex.name} ${ex.muscle} ${ex.equipment}`.toLowerCase();
      const q = query.trim().toLowerCase();
      if (q && !hay.includes(q)) return false;
      if (filter === "ALL") return true;
      return hay.includes(filter.toLowerCase());
    });
  }, [library, query, filter]);

  if (!week) {
    return (
      <div className="rounded-xl border border-dashed border-canvas-line bg-white p-10 text-center text-sm text-ink-muted">
        No structured weeks returned. Ask again or regenerate the plan.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {plan.weeks.map((w) => (
          <button
            key={w.week}
            type="button"
            onClick={() => onWeekChange(w.week)}
            className={clsx(
              "rounded-lg px-3.5 py-2 text-sm font-semibold transition",
              w.week === week.week
                ? "bg-ink text-white"
                : "border border-canvas-line bg-white text-ink-muted hover:text-ink",
            )}
          >
            Week {w.week}
            {w.label ? (
              <span className="ml-1.5 font-medium opacity-70">— {w.label}</span>
            ) : null}
          </button>
        ))}
        <button
          type="button"
          className="rounded-lg border border-dashed border-canvas-line px-3 py-2 text-xs font-bold uppercase tracking-wider text-ink-faint"
        >
          + Add Week
        </button>
      </div>

      <div className="grid gap-4 xl:grid-cols-[280px_1fr]">
        <aside className="h-fit rounded-2xl border border-canvas-line bg-white p-4 shadow-card xl:sticky xl:top-[120px]">
          <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-ink-faint">
            Exercise Library
          </h3>
          <div className="relative mt-3">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search exercise…"
              className="w-full rounded-lg border border-canvas-line bg-canvas py-2.5 pl-9 pr-3 text-sm outline-none focus:border-coral focus:ring-2 focus:ring-coral/20"
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {FILTERS.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => setFilter(chip)}
                className={clsx(
                  "rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider",
                  filter === chip
                    ? "bg-coral text-white"
                    : "bg-canvas text-ink-muted hover:text-ink",
                )}
              >
                {chip}
              </button>
            ))}
          </div>
          <ul className="scrollbar-thin mt-3 max-h-[520px] space-y-2 overflow-y-auto pr-1">
            {filteredLibrary.map((ex) => (
              <li
                key={ex.name}
                className="flex items-center gap-3 rounded-xl border border-canvas-line bg-canvas px-3 py-2.5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ink text-white">
                  <Dumbbell className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">
                    {ex.name}
                  </p>
                  <p className="truncate text-xs text-ink-muted">
                    {[ex.muscle, ex.equipment].filter(Boolean).join(" · ") ||
                      "General"}
                  </p>
                </div>
              </li>
            ))}
            {filteredLibrary.length === 0 ? (
              <li className="py-8 text-center text-xs text-ink-muted">
                No exercises match.
              </li>
            ) : null}
          </ul>
        </aside>

        <section className="space-y-3">
          {week.days.map((day, dayIdx) => (
            <div
              key={`${day.day}-${dayIdx}`}
              className="overflow-hidden rounded-xl border border-canvas-line bg-white shadow-card"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-canvas-line px-4 py-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-faint">
                    {day.day}
                  </p>
                  <h4 className="text-sm font-bold uppercase tracking-wide text-ink">
                    {day.title}
                  </h4>
                </div>
                <div className="flex items-center gap-3 text-xs text-ink-muted">
                  {!day.is_rest ? (
                    <>
                      <span>{day.exercises.length} exercises</span>
                      {day.duration_min ? (
                        <span>~{day.duration_min} min</span>
                      ) : null}
                    </>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-canvas px-2.5 py-1 font-semibold">
                      <Moon className="h-3.5 w-3.5" /> Rest
                    </span>
                  )}
                </div>
              </div>

              {day.is_rest ? (
                <div className="flex flex-col items-center justify-center gap-3 px-4 py-10 text-center">
                  <p className="text-sm text-ink-muted">
                    Recovery day — walk, stretch, or fully rest.
                  </p>
                  <button
                    type="button"
                    className="rounded-lg border border-canvas-line px-3 py-2 text-xs font-bold uppercase tracking-wider text-ink-muted"
                  >
                    Convert to Workout
                  </button>
                </div>
              ) : (
                <ul>
                  {day.exercises.map((ex, exIdx) => {
                    const key = exerciseKey(week.week, dayIdx, exIdx);
                    const selected = selectedKey === key;
                    return (
                      <li key={key}>
                        <button
                          type="button"
                          onClick={() => onSelect(selected ? null : key)}
                          className={clsx(
                            "flex w-full items-center gap-3 border-b border-canvas-line px-4 py-3 text-left transition last:border-b-0",
                            selected
                              ? "border-l-4 border-l-coral bg-coral-soft"
                              : "border-l-4 border-l-transparent hover:bg-canvas/70",
                          )}
                        >
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-ink text-[11px] font-bold text-white">
                            {exIdx + 1}
                          </span>
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-canvas text-ink">
                            <Dumbbell className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-ink">
                              {ex.name}
                            </p>
                            <p className="truncate text-xs text-ink-muted">
                              {[ex.muscle, ex.equipment].filter(Boolean).join(" · ")}
                            </p>
                          </div>
                          <div className="hidden items-center gap-2 sm:flex">
                            {(ex.sets || ex.reps) && (
                              <span className="rounded-md bg-ink px-2 py-1 text-[11px] font-bold text-white">
                                {ex.sets}×{ex.reps}
                              </span>
                            )}
                            {ex.intensity ? (
                              <span className="text-xs font-medium text-ink-muted">
                                {ex.intensity}
                              </span>
                            ) : null}
                            {ex.rest ? (
                              <span className="text-xs text-ink-faint">
                                Rest {ex.rest}
                              </span>
                            ) : null}
                          </div>
                        </button>
                      </li>
                    );
                  })}
                  <li>
                    <button
                      type="button"
                      className="flex w-full items-center justify-center gap-2 bg-ink px-4 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-ink-soft"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add Exercise or Drop Here
                    </button>
                  </li>
                </ul>
              )}
            </div>
          ))}
        </section>
      </div>

      {plan.tips.length > 0 ? (
        <div className="rounded-xl border border-coral-muted bg-coral-soft px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-coral">
            Pro Tips
          </p>
          <ul className="mt-2 grid gap-2 sm:grid-cols-2">
            {plan.tips.map((tip) => (
              <li key={tip} className="text-sm text-ink-soft">
                • {tip}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
