"use client";

import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import {
  ACTIVITY_LEVELS,
  DIETARY_PREFERENCES,
  FITNESS_GOALS,
  SEX_OPTIONS,
} from "@/lib/constants";
import type { UserProfile } from "@/lib/types";

type Props = {
  profile: UserProfile;
  onChange: (next: UserProfile) => void;
};

export function ProfileForm({ profile, onChange }: Props) {
  const update = <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => {
    onChange({ ...profile, [key]: value });
  };

  return (
    <Card>
      <div className="mb-5">
        <h2 className="text-lg font-bold text-ink">Client Profile</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Feed the dietary and fitness agents with accurate stats. Add your API
          key in Settings, then click Generate Plan.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Age"
          type="number"
          min={10}
          max={100}
          value={profile.age}
          onChange={(e) => update("age", Number(e.target.value))}
        />
        <Input
          label="Weight (kg)"
          type="number"
          min={20}
          max={300}
          step={0.1}
          value={profile.weight}
          onChange={(e) => update("weight", Number(e.target.value))}
        />
        <Input
          label="Height (cm)"
          type="number"
          min={100}
          max={250}
          step={0.1}
          value={profile.height}
          onChange={(e) => update("height", Number(e.target.value))}
        />
        <Select
          label="Sex"
          options={SEX_OPTIONS}
          value={profile.sex}
          onChange={(e) => update("sex", e.target.value)}
        />
        <Select
          label="Activity Level"
          options={ACTIVITY_LEVELS}
          value={profile.activity_level}
          onChange={(e) => update("activity_level", e.target.value)}
        />
        <Select
          label="Dietary Preferences"
          options={DIETARY_PREFERENCES}
          value={profile.dietary_preferences}
          onChange={(e) => update("dietary_preferences", e.target.value)}
        />
        <div className="sm:col-span-2">
          <Select
            label="Fitness Goals"
            options={FITNESS_GOALS}
            value={profile.fitness_goals}
            onChange={(e) => update("fitness_goals", e.target.value)}
          />
        </div>
      </div>
    </Card>
  );
}
