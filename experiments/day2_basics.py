def calculate_total_investment(monthly_investment, years):
	months = years*12
	total_investment = monthly_investment*months
	return total_investment


monthly_investment = 50000
years = 15

total_investment = calculate_total_investment(monthly_investment,years)
print("Total investment:", total_investment)
