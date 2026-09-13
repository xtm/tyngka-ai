from calculators.sip import calculate_sip, calculate_step_up_sip


def test_sip_zero_return():
    result = calculate_sip(50000, 0, 20)

    assert result.total_investment == 12000000
    assert result.future_value == 12000000
    assert result.estimated_returns == 0


def test_sip_with_existing_investment_zero_return():
    result = calculate_sip(1000, 0, 10, 100000)

    assert result.total_investment == 220000
    assert result.future_value == 220000
    assert result.estimated_returns == 0

def test_sip_with_existing_investment():
    result = calculate_sip(1000, 12, 10, 100000)

    assert result.future_value == 560077.3789147337
    assert result.total_investment == 220000
    assert result.estimated_returns == 340077.37891473365

def test_step_up_sip_with_existing_investment():
    result = calculate_step_up_sip(1000, 12, 10, 10, 100000)

    assert result.future_value == 664130.3987818718
    assert result.total_investment == 291249.0952120001
    assert result.estimated_returns == 372881.3035698717

def test_step_up_sip_zero_return():
    result = calculate_step_up_sip(1000, 0, 3, 10)

    assert result.total_investment == 39720
    assert result.future_value == 39720
    assert result.estimated_returns == 0
