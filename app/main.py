from app.config import CORS_ORIGINS
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.connection import initialize_database
from app.routes.calculators import router as calculator_router


app = FastAPI(
    title="Tyngka API",
    description="Financial calculation APIs provided by Tyngka",
    version="1.0.0"
)

initialize_database()

app.add_middleware(
	CORSMiddleware,
	allow_origins = CORS_ORIGINS,
	allow_credentials = True,
	allow_methods = ["*"],
	allow_headers = ["*"],
)

app.include_router(calculator_router)


@app.get("/")
def root():
    return {
        "message": "Welcome to Tyngka API",
        "status": "running"
    }
