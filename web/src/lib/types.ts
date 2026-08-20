export type UserProfile = {
  age: number;
  weight: number;
  height: number;
  sex: string;
  activity_level: string;
  dietary_preferences: string;
  fitness_goals: string;
};

export type MealItem = {
  name: string;
  time: string;
  foods: string[];
  calories?: number | null;
  notes: string;
};

export type DietaryPlan = {
  why_this_plan_works: string;
  meal_plan: string;
  meals: MealItem[];
  important_considerations: string[];
  daily_calories?: number | null;
  macros: string;
};

export type ExerciseItem = {
  name: string;
  muscle: string;
  equipment: string;
  sets: string;
  reps: string;
  rest: string;
  intensity: string;
  notes: string;
};

export type WorkoutDay = {
  day: string;
  title: string;
  focus: string;
  duration_min?: number | null;
  is_rest: boolean;
  exercises: ExerciseItem[];
};

export type FitnessWeek = {
  week: number;
  label: string;
  days: WorkoutDay[];
};

export type FitnessPlan = {
  goals: string;
  routine: string;
  tips: string[];
  program_name: string;
  weeks: FitnessWeek[];
  tags: string[];
  sessions_per_week?: number | null;
  avg_session_min?: number | null;
};

export type GeneratePlansResponse = {
  dietary_plan: DietaryPlan;
  fitness_plan: FitnessPlan;
};

export type QAPair = {
  question: string;
  answer: string;
};

export type PlannerTab = "profile" | "diet" | "fitness" | "qa";

export type PlanStatus = "draft" | "published";
