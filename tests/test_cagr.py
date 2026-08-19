from calculators.cagr import calculate_cagr


def test_cagr():
    result = calculate_cagr(100000, 200000, 10)

    assert round(result.cagr, 4) == 7.1773
