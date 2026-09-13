from dataclasses import dataclass
@dataclass
class SIPResult:
	future_value: float
	total_investment: float
	estimated_returns: float

def calculate_sip(
    monthly_investment: float,
    annual_return: float,
    years: int,
    existing_investment: float = 0
) -> SIPResult:

    if monthly_investment <= 0:
        raise ValueError("Monthly investment must be greater than zero.")

    if existing_investment < 0:
        raise ValueError("Existing investment cannot be negative.")

    if annual_return < 0:
        raise ValueError("Annual return cannot be negative.")

    if years <= 0:
        raise ValueError("Investment period must be greater than zero.")

    monthly_rate = annual_return / 100 / 12
    months = years * 12

    if monthly_rate == 0:
        sip_future_value = monthly_investment * months
        existing_future_value = existing_investment
    else:
        sip_future_value = (
            monthly_investment
            * ((1 + monthly_rate) ** months - 1)
            / monthly_rate
        )

        existing_future_value = (
            existing_investment
            * (1 + monthly_rate) ** months
        )

    future_value = sip_future_value + existing_future_value

    total_investment = (
        existing_investment
        + monthly_investment * months
    )

    estimated_returns = future_value - total_investment

    return SIPResult(
        future_value=future_value,
        total_investment=total_investment,
        estimated_returns=estimated_returns
    )

def calculate_step_up_sip(
    monthly_investment: float,
    annual_return: float,
    years: int,
    step_up_percent: float,
    existing_investment: float = 0
) -> SIPResult:

    if monthly_investment <= 0:
        raise ValueError("Monthly investment must be greater than zero.")

    if existing_investment < 0:
        raise ValueError("Existing investment cannot be negative.")

    if annual_return < 0:
        raise ValueError("Annual return cannot be negative.")

    if years <= 0:
        raise ValueError("Investment period must be greater than zero.")

    if step_up_percent < 0:
        raise ValueError("Step-up percentage cannot be negative.")

    monthly_rate = annual_return / 100 / 12
    monthly_sip = monthly_investment

    future_value = existing_investment
    total_investment = existing_investment

    for month in range(1, years * 12 + 1):

        if monthly_rate > 0:
            future_value = future_value * (1 + monthly_rate)

        future_value += monthly_sip
        total_investment += monthly_sip

        if month % 12 == 0:
            monthly_sip *= (1 + step_up_percent / 100)

    estimated_returns = future_value - total_investment

    return SIPResult(
        future_value=future_value,
        total_investment=total_investment,
        estimated_returns=estimated_returns
    )



if __name__ == "__main__":
    monthly_investment = float(input("Enter monthly investment: "))
    annual_return = float(input("Expected annual return (%): "))
    years = int(input("Investment period (years): "))

    result = calculate_sip(
        monthly_investment,
        annual_return,
        years
    )

    print("Monthly investment:", monthly_investment)
    print("Annual return:", annual_return)
    print("Investment period:", years, "years")
    print()
    print("Total invested:", round(result.total_investment))
    print("Estimated returns:", round(result.estimated_returns))
    print("Final corpus:", round(result.future_value))
