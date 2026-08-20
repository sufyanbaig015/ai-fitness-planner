from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from agents import answer_question, generate_dietary_plan, generate_fitness_plan
from schemas import (
    AskQuestionRequest,
    AskQuestionResponse,
    GeneratePlansRequest,
    GeneratePlansResponse,
)

app = FastAPI(
    title="AI Health & Fitness Planner API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/api/plans/generate", response_model=GeneratePlansResponse)
def generate_plans(body: GeneratePlansRequest):
    try:
        dietary = generate_dietary_plan(body.profile, body.api_key)
        fitness = generate_fitness_plan(body.profile, body.api_key)
        return GeneratePlansResponse(dietary_plan=dietary, fitness_plan=fitness)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.post("/api/plans/ask", response_model=AskQuestionResponse)
def ask_about_plan(body: AskQuestionRequest):
    try:
        answer = answer_question(
            api_key=body.api_key,
            question=body.question,
            meal_plan=body.meal_plan,
            fitness_routine=body.fitness_routine,
        )
        return AskQuestionResponse(answer=answer)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
