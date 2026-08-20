import type {
  DietaryPlan,
  FitnessPlan,
  PlanStatus,
  QAPair,
  UserProfile,
} from "./types";

const KEY = "crock-planner-v1";

export type PersistedPlanner = {
  apiKey: string;
  profile: UserProfile;
  dietaryPlan: DietaryPlan | null;
  fitnessPlan: FitnessPlan | null;
  qaPairs: QAPair[];
  status: PlanStatus;
};

export function loadPlanner(): Partial<PersistedPlanner> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Partial<PersistedPlanner>;
  } catch {
    return null;
  }
}

export function savePlanner(data: PersistedPlanner) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(data));
}
