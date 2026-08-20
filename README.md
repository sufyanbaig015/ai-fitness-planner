# CROCK — AI Health & Fitness Planner

Personalized diet and workout programs powered by **OpenAI + Agno agents**, with a professional **Next.js** coaching dashboard.

> **Suggested GitHub repo name:** `crock-ai-fitness-planner`  
> Alternatives: `ai-health-fitness-planner` · `ai-coach-plan-builder` · `fitcoach-ai-planner`

---

## Features

- **Dietary Expert agent** — structured daily meals, macros, and considerations  
- **Fitness Expert agent** — multi-week program with days, exercises, sets/reps/rest  
- **CROCK-style dashboard** — fixed sidebar, week builder, exercise library, Q&A  
- **Local persistence** — draft/publish status and plans saved in the browser  
- **Optional Streamlit UI** — lightweight alternative under `apps/streamlit`

---

## Architecture

```text
.
├── api/                  # FastAPI + Agno (OpenAI) backend
│   ├── main.py           # REST endpoints
│   ├── agents.py         # Dietary / Fitness / Q&A agents
│   ├── schemas.py        # Pydantic models
│   └── requirements.txt
├── web/                  # Next.js 14 (App Router) frontend
│   └── src/
│       ├── app/          # Routes & layout
│       ├── components/   # layout / planner / ui
│       └── lib/          # api client, types, storage
├── apps/
│   └── streamlit/        # Optional Streamlit app
├── .gitignore
└── README.md
```

| Layer | Stack | Port |
|-------|--------|------|
| Frontend | Next.js 14, TypeScript, Tailwind | `3000` |
| Backend | FastAPI, Agno, OpenAI (`gpt-4o-mini`) | `8000` |

---

## Prerequisites

- Node.js 18+
- Python 3.10+
- OpenAI API key → [platform.openai.com/api-keys](https://platform.openai.com/api-keys)

---

## Quick start

### 1. Backend

```bash
cd api
python3 -m venv ../.venv
source ../.venv/bin/activate   # Windows: ..\.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

API docs: http://127.0.0.1:8000/docs

### 2. Frontend

```bash
cd web
cp .env.example .env.local
npm install
npm run dev
```

App: http://localhost:3000

1. Open **Settings** → paste your OpenAI API key  
2. Fill **Profile** → **Generate Plan**  
3. Review **Fitness** / **Diet** → ask follow-ups in **Q&A**

---

## API

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Health check |
| `POST` | `/api/plans/generate` | Generate diet + fitness plans |
| `POST` | `/api/plans/ask` | Follow-up Q&A on generated plans |

Example generate body:

```json
{
  "api_key": "sk-...",
  "profile": {
    "age": 28,
    "weight": 70,
    "height": 170,
    "sex": "Male",
    "activity_level": "Moderately Active",
    "dietary_preferences": "Vegetarian",
    "fitness_goals": "Stay Fit"
  }
}
```

---

## Environment

| File | Purpose |
|------|---------|
| `web/.env.local` | `NEXT_PUBLIC_API_URL` (default `http://127.0.0.1:8000`) |
| `api/.env.example` | Optional server-side `OPENAI_API_KEY` |

Never commit real API keys.

---

## Scripts

```bash
# From repo root (requires make)
make api    # start FastAPI
make web    # start Next.js
make install
```

Or run the commands in **Quick start** manually.

---

## Tech notes

- Frontend talks only to the local FastAPI server (CORS enabled for `localhost:3000`)
- Agents return **structured JSON** (meals / weeks / exercises) for the builder UI
- Plans auto-save to `localStorage` in the browser

---

## License

MIT — feel free to fork and customize for your coaching product.
