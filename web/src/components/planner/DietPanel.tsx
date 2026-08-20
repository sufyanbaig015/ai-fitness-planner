"use client";

import { Card } from "@/components/ui/Card";
import type { DietaryPlan } from "@/lib/types";
import { Apple, AlertTriangle, Clock3 } from "lucide-react";

type Props = {
  plan: DietaryPlan | null;
};

export function DietPanel({ plan }: Props) {
  if (!plan) {
    return (
      <Card className="flex min-h-[360px] flex-col items-center justify-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-coral-soft text-coral">
          <Apple className="h-7 w-7" />
        </div>
        <p className="mt-4 text-base font-bold text-ink">No dietary plan yet</p>
        <p className="mt-1 max-w-sm text-sm text-ink-muted">
          Fill your profile and generate a plan to see structured meals, macros,
          and daily targets.
        </p>
      </Card>
    );
  }

  const meals = plan.meals?.length
    ? plan.meals
    : [
        {
          name: "Meal Plan",
          time: "",
          foods: plan.meal_plan.split("\n").filter(Boolean),
          calories: null,
          notes: "",
        },
      ];

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="!p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-faint">
            Why it works
          </p>
          <p className="mt-2 text-sm font-medium text-ink">
            {plan.why_this_plan_works}
          </p>
        </Card>
        <Card className="!p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-faint">
            Daily calories
          </p>
          <p className="mt-2 text-2xl font-extrabold text-ink">
            {plan.daily_calories ? `${plan.daily_calories}` : "—"}
            <span className="ml-1 text-sm font-semibold text-ink-muted">kcal</span>
          </p>
        </Card>
        <Card className="!p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-faint">
            Macros
          </p>
          <p className="mt-2 text-sm font-semibold text-ink">
            {plan.macros || "Balanced macros"}
          </p>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-3">
          {meals.map((meal) => (
            <Card key={`${meal.name}-${meal.time}`} className="!p-4">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-bold uppercase tracking-wide text-ink">
                  {meal.name}
                </h3>
                <div className="flex items-center gap-2 text-xs text-ink-muted">
                  {meal.time ? (
                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="h-3.5 w-3.5" />
                      {meal.time}
                    </span>
                  ) : null}
                  {meal.calories ? (
                    <span className="rounded-md bg-ink px-2 py-0.5 font-bold text-white">
                      {meal.calories} kcal
                    </span>
                  ) : null}
                </div>
              </div>
              <ul className="space-y-1.5">
                {meal.foods.map((food) => (
                  <li
                    key={food}
                    className="rounded-lg bg-canvas px-3 py-2 text-sm text-ink-soft"
                  >
                    {food}
                  </li>
                ))}
              </ul>
              {meal.notes ? (
                <p className="mt-2 text-xs text-ink-muted">{meal.notes}</p>
              ) : null}
            </Card>
          ))}
        </div>

        <Card>
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-ink">
              Considerations
            </h3>
          </div>
          <ul className="space-y-2">
            {plan.important_considerations.map((item) => (
              <li
                key={item}
                className="rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-sm text-ink-soft"
              >
                {item}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
