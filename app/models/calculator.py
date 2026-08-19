from pydantic import BaseModel, Field


class SIPRequest(BaseModel):
    monthly_investment: float = Field(gt=0)
    annual_return: float = Field(ge=0)
    years: int = Field(gt=0)


class SIPResponse(BaseModel):
    future_value: float
    total_investment: float
    estimated_returns: float
