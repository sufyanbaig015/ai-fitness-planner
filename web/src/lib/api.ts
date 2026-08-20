import { API_BASE_URL } from "./constants";
import type { GeneratePlansResponse, UserProfile } from "./types";

async function parseError(res: Response): Promise<string> {
  try {
    const data = await res.json();
    return data.detail ?? data.message ?? res.statusText;
  } catch {
    return res.statusText || "Request failed";
  }
}

export async function generatePlans(
  profile: UserProfile,
  apiKey: string,
): Promise<GeneratePlansResponse> {
  const res = await fetch(`${API_BASE_URL}/api/plans/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profile, api_key: apiKey }),
  });

  if (!res.ok) {
    throw new Error(await parseError(res));
  }

  return res.json();
}

export async function askAboutPlan(params: {
  apiKey: string;
  question: string;
  mealPlan: string;
  fitnessRoutine: string;
}): Promise<string> {
  const res = await fetch(`${API_BASE_URL}/api/plans/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: params.apiKey,
      question: params.question,
      meal_plan: params.mealPlan,
      fitness_routine: params.fitnessRoutine,
    }),
  });

  if (!res.ok) {
    throw new Error(await parseError(res));
  }

  const data = await res.json();
  return data.answer as string;
}
