"use client";

import { Card } from "@/components/ui/Card";
import type { FitnessPlan } from "@/lib/types";
import { Dumbbell } from "lucide-react";
import { FitnessBuilder } from "./FitnessBuilder";

type Props = {
  plan: FitnessPlan | null;
  activeWeek: number;
  onWeekChange: (week: number) => void;
  selectedKey: string | null;
  onSelect: (key: string | null) => void;
};

export function FitnessPanel({
  plan,
  activeWeek,
  onWeekChange,
  selectedKey,
  onSelect,
}: Props) {
  if (!plan) {
    return (
      <Card className="flex min-h-[360px] flex-col items-center justify-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-coral-soft text-coral">
          <Dumbbell className="h-7 w-7" />
        </div>
        <p className="mt-4 text-base font-bold text-ink">No fitness plan yet</p>
        <p className="mt-1 max-w-sm text-sm text-ink-muted">
          Generate a program to open the week schedule, exercise library, and
          session builder.
        </p>
      </Card>
    );
  }

  if (!plan.weeks?.length) {
    return (
      <Card>
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-coral">
          Goals
        </p>
        <p className="mt-2 text-sm font-medium text-ink">{plan.goals}</p>
        <pre className="mt-4 whitespace-pre-wrap font-sans text-sm leading-relaxed text-ink-soft">
          {plan.routine}
        </pre>
      </Card>
    );
  }

  return (
    <FitnessBuilder
      plan={plan}
      activeWeek={activeWeek}
      onWeekChange={onWeekChange}
      selectedKey={selectedKey}
      onSelect={onSelect}
    />
  );
}
