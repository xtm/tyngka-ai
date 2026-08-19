from dataclasses import dataclass


@dataclass
class CAGRResult:
    cagr: float


def calculate_cagr(
    beginning_value: float,
    ending_value: float,
    years: int
) -> CAGRResult:

    if beginning_value <= 0:
        raise ValueError("Beginning value must be greater than zero.")

    if ending_value <= 0:
        raise ValueError("Ending value must be greater than zero.")

    if years <= 0:
        raise ValueError("Years must be greater than zero.")

    cagr = (ending_value / beginning_value) ** (1 / years) - 1

    return CAGRResult(
        cagr=cagr * 100
    )
