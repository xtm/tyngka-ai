from fastapi import APIRouter, HTTPException

from calculators.sip import calculate_sip
from app.models.calculator import SIPRequest, SIPResponse


router = APIRouter(
    prefix="/api/v1",
    tags=["Calculators"]
)


@router.post("/sip", response_model=SIPResponse)
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
