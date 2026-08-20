.PHONY: install api web streamlit

install:
	python3 -m venv .venv
	. .venv/bin/activate && pip install -r api/requirements.txt
	cd web && npm install

api:
	. .venv/bin/activate && cd api && uvicorn main:app --reload --port 8000

web:
	cd web && npm run dev

streamlit:
	. .venv/bin/activate && cd apps/streamlit && streamlit run health_agent.py
