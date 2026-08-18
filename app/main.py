from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from calculators.sip import calculate_sip


app = FastAPI(
    title="Tyngka API",
    description="Financial calculation APIs provided by Tyngka",
    version="1.0.0"
)


class SIPRequest(BaseModel):
    monthly_investment: float = Field(gt=0)
    annual_return: float = Field(ge=0)
    years: int = Field(gt=0)


class SIPResponse(BaseModel):
    future_value: float
    total_investment: float
    estimated_returns: float


@app.get("/")
def root():
    return {
        "message": "Welcome to Tyngka API",
        "status": "running"
    }


@app.post("/api/v1/sip", response_model=SIPResponse)
def calculate_sip_api(request: SIPRequest):

    try:
        result = calculate_sip(
            request.monthly_investment,
            request.annual_return,
            request.years
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

    return SIPResponse(
        future_value=result.future_value,
        total_investment=result.total_investment,
        estimated_returns=result.estimated_returns
    )
