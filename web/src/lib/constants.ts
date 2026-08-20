import type { UserProfile } from "./types";

export const ACTIVITY_LEVELS = [
  "Sedentary",
  "Lightly Active",
  "Moderately Active",
  "Very Active",
  "Extremely Active",
] as const;

export const DIETARY_PREFERENCES = [
  "Vegetarian",
  "Keto",
  "Gluten Free",
  "Low Carb",
  "Dairy Free",
] as const;

export const FITNESS_GOALS = [
  "Lose Weight",
  "Gain Muscle",
  "Endurance",
  "Stay Fit",
  "Strength Training",
] as const;

export const SEX_OPTIONS = ["Male", "Female", "Other"] as const;

export const DEFAULT_PROFILE: UserProfile = {
  age: 28,
  weight: 70,
  height: 170,
  sex: "Male",
  activity_level: "Moderately Active",
  dietary_preferences: "Vegetarian",
  fitness_goals: "Stay Fit",
};

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";
