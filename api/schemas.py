from pydantic import BaseModel, Field


class UserProfile(BaseModel):
    age: int = Field(..., ge=10, le=100)
    weight: float = Field(..., ge=20, le=300)
    height: float = Field(..., ge=100, le=250)
    sex: str
    activity_level: str
    dietary_preferences: str
    fitness_goals: str


class GeneratePlansRequest(BaseModel):
    profile: UserProfile
    api_key: str = Field(..., min_length=10)


class MealItem(BaseModel):
    name: str
    time: str = ""
    foods: list[str] = Field(default_factory=list)
    calories: int | None = None
    notes: str = ""


class DietaryPlan(BaseModel):
    why_this_plan_works: str
    meal_plan: str
    meals: list[MealItem] = Field(default_factory=list)
    important_considerations: list[str]
    daily_calories: int | None = None
    macros: str = ""


class ExerciseItem(BaseModel):
    name: str
    muscle: str = ""
    equipment: str = ""
    sets: str = ""
    reps: str = ""
    rest: str = ""
    intensity: str = ""
    notes: str = ""


class WorkoutDay(BaseModel):
    day: str
    title: str
    focus: str = ""
    duration_min: int | None = None
    is_rest: bool = False
    exercises: list[ExerciseItem] = Field(default_factory=list)


class FitnessWeek(BaseModel):
    week: int
    label: str = ""
    days: list[WorkoutDay] = Field(default_factory=list)


class FitnessPlan(BaseModel):
    goals: str
    routine: str
    tips: list[str]
    program_name: str = "Personalized Program"
    weeks: list[FitnessWeek] = Field(default_factory=list)
    tags: list[str] = Field(default_factory=list)
    sessions_per_week: int | None = None
    avg_session_min: int | None = None


class GeneratePlansResponse(BaseModel):
    dietary_plan: DietaryPlan
    fitness_plan: FitnessPlan


class AskQuestionRequest(BaseModel):
    api_key: str = Field(..., min_length=10)
    question: str
    meal_plan: str
    fitness_routine: str


class AskQuestionResponse(BaseModel):
    answer: str
