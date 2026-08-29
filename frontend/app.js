function formatIndianCurrency(value) {
    if (value >= 10000000) {
        return `₹${(value / 10000000).toFixed(2)} Cr`;
    }

    if (value >= 100000) {
        return `₹${(value / 100000).toFixed(2)} L`;
    }

    return `₹${value.toLocaleString("en-IN")}`;
}


const button = document.getElementById("calculate-button");

    button.addEventListener("click", async () => {
    

    const monthlyInvestment = Number(
        document.getElementById("monthly-investment").value
    );

    const annualReturn = Number(
        document.getElementById("annual-return").value
    );

    const years = Number(
        document.getElementById("years").value
    );

    if (monthlyInvestment <= 0) {
    alert("Monthly investment must be greater than 0.");
    return;
    }

    if (annualReturn < 0 || annualReturn > 100) {
    alert("Annual return must be between 0% and 100%.");
    return;
    }

    if (years <= 0 || years > 100) {
    alert("Investment period must be between 1 and 100 years.");
    return;
    }

    button.innerText = "Calculating...";
    button.disabled = true;

    let response;

    try {
        response = await fetch(
        "http://127.0.0.1:8000/api/v1/sip",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                monthly_investment: monthlyInvestment,
                annual_return: annualReturn,
                years: years
            })
        }
      );
     } catch (error) {
    		document.getElementById("result").innerText =
        	"Unable to connect to Tyngka API.";
    		button.innerText = "Calculate";
		button.disabled = false;
		return;
	}

if (!response.ok) {
    document.getElementById("result").innerText =
        "Unable to calculate. Please check your inputs.";
    button.innerText ="Calculate";
    button.disabled =false;
    return;

}

const data = await response.json();


    document.getElementById("result").innerHTML = `
        <div class="result-item">
            <span>Future Value</span>
            <strong>${formatIndianCurrency(data.future_value)}</strong>
        </div>

        <div class="result-item">
            <span>Total Investment</span>
            <strong>${formatIndianCurrency(data.total_investment)}</strong>
        </div>

        <div class="result-item">
            <span>Estimated Returns</span>
            <strong>${formatIndianCurrency(data.estimated_returns)}</strong>
        </div>
    `;
    button.innerText = "Calculate";
    button.disabled = false;
});
