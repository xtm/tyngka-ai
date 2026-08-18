from dataclasses import dataclass
@dataclass
class SIPResult:
	future_value: float
	total_investment: float
	estimated_returns: float

def calculate_sip(monthly_investment: float, annual_return: float, years: int)-> SIPResult:
    if monthly_investment <= 0:
        raise ValueError("Monthly investment must be greater than zero.")

    if annual_return < 0:
        raise ValueError("Annual return cannot be negative.")

    if years <= 0:
        raise ValueError("Investment period must be greater than zero.")

    monthly_rate = annual_return / 100 / 12
    months = years * 12

    if monthly_rate == 0:
        future_value = monthly_investment * months
    else:
        future_value = (
            monthly_investment
            * ((1 + monthly_rate) ** months - 1)
            / monthly_rate
        )

    total_investment = monthly_investment * months
    estimated_returns = future_value - total_investment

    return SIPResult(
		future_value=future_value,
		total_investment= total_investment,
		estimated_returns= estimated_returns)


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
