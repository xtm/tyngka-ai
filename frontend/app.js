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

button.addEventListener("click", () => {
    const existingInvestment = Number(
        document.getElementById("existing-investment").value
    );

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

    const monthlyRate = annualReturn / 100 / 12;
    const months = years * 12;

    let sipFutureValue;
    let existingFutureValue;

    if (monthlyRate === 0) {
        sipFutureValue = monthlyInvestment * months;
        existingFutureValue = existingInvestment;
    } else {
        sipFutureValue =
            monthlyInvestment *
            (((1 + monthlyRate) ** months - 1) / monthlyRate);

        existingFutureValue =
            existingInvestment *
            ((1 + monthlyRate) ** months);
    }

    const futureValue =
        sipFutureValue + existingFutureValue;

    const totalInvestment =
        existingInvestment +
        monthlyInvestment * months;

    const estimatedReturns =
        futureValue - totalInvestment;

    document.getElementById("result").innerHTML = `
        <div class="result-item">
            <span>Future Value</span>
            <strong>${formatIndianCurrency(futureValue)}</strong>
        </div>

        <div class="result-item">
            <span>Total Investment</span>
            <strong>${formatIndianCurrency(totalInvestment)}</strong>
        </div>

        <div class="result-item">
            <span>Estimated Returns</span>
            <strong>${formatIndianCurrency(estimatedReturns)}</strong>
        </div>
    `;

    button.innerText = "Calculate";
    button.disabled = false;
});
