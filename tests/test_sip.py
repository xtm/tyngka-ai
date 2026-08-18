from calculators.sip import calculate_sip

def test_sip_zero_return():
	result = calculate_sip(50000, 0, 20)
	assert result.total_investment == 12000000
	assert result.future_value == 12000000
	assert result.estimated_returns == 0
