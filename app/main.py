from fastapi import FastAPI

from app.routes.calculators import router as calculator_router


app = FastAPI(
    title="Tyngka API",
    description="Financial calculation APIs provided by Tyngka",
    version="1.0.0"
)


app.include_router(calculator_router)


@app.get("/")
def root():
    return {
        "message": "Welcome to Tyngka API",
        "status": "running"
    }
