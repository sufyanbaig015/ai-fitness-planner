import json
import re
from typing import Any

from agno.agent import Agent
from agno.models.openai import OpenAIChat

from schemas import (
    DietaryPlan,
    ExerciseItem,
    FitnessPlan,
    FitnessWeek,
    MealItem,
    UserProfile,
    WorkoutDay,
)


def _model(api_key: str) -> OpenAIChat:
    return OpenAIChat(id="gpt-4o-mini", api_key=api_key)


def _profile_text(profile: UserProfile) -> str:
    return f"""
Age: {profile.age}
Weight: {profile.weight}kg
Height: {profile.height}cm
Sex: {profile.sex}
Activity Level: {profile.activity_level}
Dietary Preferences: {profile.dietary_preferences}
Fitness Goals: {profile.fitness_goals}
""".strip()


def _extract_json(text: str) -> dict[str, Any]:
    if not text:
        return {}
    cleaned = text.strip()
    fence = re.search(r"```(?:json)?\s*([\s\S]*?)```", cleaned)
    if fence:
        cleaned = fence.group(1).strip()
    try:
        data = json.loads(cleaned)
        return data if isinstance(data, dict) else {}
    except json.JSONDecodeError:
        start = cleaned.find("{")
        end = cleaned.rfind("}")
        if start >= 0 and end > start:
            try:
                data = json.loads(cleaned[start : end + 1])
                return data if isinstance(data, dict) else {}
            except json.JSONDecodeError:
                return {}
    return {}


DIET_SCHEMA_HINT = """
Return ONLY valid JSON (no markdown) with this shape:
{
  "why_this_plan_works": "short string",
  "daily_calories": 2100,
  "macros": "P 140g / C 180g / F 70g",
  "meals": [
    {
      "name": "Breakfast",
      "time": "8:00 AM",
      "foods": ["item 1", "item 2"],
      "calories": 450,
      "notes": "optional"
    }
  ],
  "important_considerations": ["Hydration tip", "Fiber tip"]
}
Include breakfast, lunch, dinner, and 1-2 snacks.
""".strip()


FITNESS_SCHEMA_HINT = """
Return ONLY valid JSON (no markdown) with this shape:
{
  "program_name": "Glute Builder",
  "goals": "short goals summary",
  "tags": ["GLUTES", "HYPERTROPHY"],
  "sessions_per_week": 4,
  "avg_session_min": 52,
  "tips": ["tip 1", "tip 2", "tip 3"],
  "weeks": [
    {
      "week": 1,
      "label": "Foundation",
      "days": [
        {
          "day": "Mon",
          "title": "Heavy Lower",
          "focus": "Glutes",
          "duration_min": 55,
          "is_rest": false,
          "exercises": [
            {
              "name": "Hip Thrust",
              "muscle": "Glutes",
              "equipment": "Barbell",
              "sets": "4",
              "reps": "8",
              "rest": "2:00",
              "intensity": "@ RPE 8",
              "notes": ""
            }
          ]
        },
        {
          "day": "Tue",
          "title": "Rest Day",
          "focus": "",
          "duration_min": 0,
          "is_rest": true,
          "exercises": []
        }
      ]
    }
  ]
}
Create exactly 2 weeks. Each week should have 5-7 days mixing training and rest.
Warm-up style movements can be first exercises in a session.
""".strip()


def generate_dietary_plan(profile: UserProfile, api_key: str) -> DietaryPlan:
    agent = Agent(
        name="Dietary Expert",
        role="Provides personalized dietary recommendations as structured JSON",
        model=_model(api_key),
        instructions=[
            "Consider dietary restrictions and preferences carefully.",
            "Create a practical one-day meal plan suited to the user's goals.",
            "Respond with JSON only.",
            DIET_SCHEMA_HINT,
        ],
    )
    response = agent.run(_profile_text(profile))
    data = _extract_json(response.content or "")

    meals_raw = data.get("meals") or []
    meals: list[MealItem] = []
    for item in meals_raw:
        if not isinstance(item, dict):
            continue
        meals.append(
            MealItem(
                name=str(item.get("name") or "Meal"),
                time=str(item.get("time") or ""),
                foods=[str(f) for f in (item.get("foods") or [])],
                calories=item.get("calories"),
                notes=str(item.get("notes") or ""),
            )
        )

    considerations = data.get("important_considerations") or [
        "Hydration: Drink plenty of water throughout the day",
        "Electrolytes: Monitor sodium, potassium, and magnesium levels",
        "Fiber: Ensure adequate intake through vegetables and fruits",
        "Listen to your body: Adjust portion sizes as needed",
    ]

    meal_plan_text = response.content or ""
    if meals:
        lines: list[str] = []
        for meal in meals:
            foods = ", ".join(meal.foods) if meal.foods else meal.notes
            cal = f" (~{meal.calories} kcal)" if meal.calories else ""
            lines.append(f"{meal.name}{cal}: {foods}")
        meal_plan_text = "\n".join(lines)

    return DietaryPlan(
        why_this_plan_works=str(
            data.get("why_this_plan_works")
            or "High Protein, Healthy Fats, Moderate Carbohydrates, and Caloric Balance"
        ),
        meal_plan=meal_plan_text,
        meals=meals,
        important_considerations=[str(c) for c in considerations],
        daily_calories=data.get("daily_calories"),
        macros=str(data.get("macros") or ""),
    )


def generate_fitness_plan(profile: UserProfile, api_key: str) -> FitnessPlan:
    agent = Agent(
        name="Fitness Expert",
        role="Provides personalized fitness programs as structured JSON",
        model=_model(api_key),
        instructions=[
            "Create an actionable training program tailored to the user's goals.",
            "Include warm-up, main lifts, and accessory work inside sessions.",
            "Respond with JSON only.",
            FITNESS_SCHEMA_HINT,
        ],
    )
    response = agent.run(_profile_text(profile))
    data = _extract_json(response.content or "")

    weeks: list[FitnessWeek] = []
    for week_raw in data.get("weeks") or []:
        if not isinstance(week_raw, dict):
            continue
        days: list[WorkoutDay] = []
        for day_raw in week_raw.get("days") or []:
            if not isinstance(day_raw, dict):
                continue
            exercises: list[ExerciseItem] = []
            for ex in day_raw.get("exercises") or []:
                if not isinstance(ex, dict):
                    continue
                exercises.append(
                    ExerciseItem(
                        name=str(ex.get("name") or "Exercise"),
                        muscle=str(ex.get("muscle") or ""),
                        equipment=str(ex.get("equipment") or ""),
                        sets=str(ex.get("sets") or ""),
                        reps=str(ex.get("reps") or ""),
                        rest=str(ex.get("rest") or ""),
                        intensity=str(ex.get("intensity") or ""),
                        notes=str(ex.get("notes") or ""),
                    )
                )
            days.append(
                WorkoutDay(
                    day=str(day_raw.get("day") or "Day"),
                    title=str(day_raw.get("title") or "Session"),
                    focus=str(day_raw.get("focus") or ""),
                    duration_min=day_raw.get("duration_min"),
                    is_rest=bool(day_raw.get("is_rest")),
                    exercises=exercises,
                )
            )
        weeks.append(
            FitnessWeek(
                week=int(week_raw.get("week") or len(weeks) + 1),
                label=str(week_raw.get("label") or f"Week {len(weeks) + 1}"),
                days=days,
            )
        )

    tips = data.get("tips") or [
        "Track your progress regularly",
        "Allow proper rest between workouts",
        "Focus on proper form",
        "Stay consistent with your routine",
    ]

    routine_text = response.content or ""
    if weeks:
        parts: list[str] = []
        for week in weeks:
            parts.append(f"Week {week.week} — {week.label}")
            for day in week.days:
                if day.is_rest:
                    parts.append(f"{day.day}: REST")
                    continue
                parts.append(f"{day.day}: {day.title}")
                for ex in day.exercises:
                    parts.append(
                        f"  - {ex.name}: {ex.sets}x{ex.reps} rest {ex.rest} {ex.intensity}"
                    )
        routine_text = "\n".join(parts)

    tags = [str(t) for t in (data.get("tags") or [])]
    if profile.fitness_goals and profile.fitness_goals.upper() not in {
        t.upper() for t in tags
    }:
        tags.insert(0, profile.fitness_goals.upper())

    return FitnessPlan(
        goals=str(data.get("goals") or "Build strength, improve endurance, and maintain overall fitness"),
        routine=routine_text,
        tips=[str(t) for t in tips],
        program_name=str(data.get("program_name") or "Personalized Program"),
        weeks=weeks,
        tags=tags,
        sessions_per_week=data.get("sessions_per_week"),
        avg_session_min=data.get("avg_session_min"),
    )


def answer_question(
    api_key: str,
    question: str,
    meal_plan: str,
    fitness_routine: str,
) -> str:
    context = (
        f"Dietary Plan: {meal_plan}\n\n"
        f"Fitness Plan: {fitness_routine}\n"
        f"User Question: {question}"
    )
    agent = Agent(model=_model(api_key), markdown=True)
    response = agent.run(context)
    return response.content or "Sorry, I couldn't generate a response at this time."
