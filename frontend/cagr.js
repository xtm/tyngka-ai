const button = document.getElementById("calculate-cagr-button");

button.addEventListener("click", () => {

    const beginningValue = Number(
        document.getElementById("beginning-value").value
    );

    const endingValue = Number(
        document.getElementById("ending-value").value
    );

    const years = Number(
        document.getElementById("years").value
    );

    if (beginningValue <= 0) {
        alert("Beginning value must be greater than 0.");
        return;
    }

    if (endingValue <= 0) {
        alert("Ending value must be greater than 0.");
        return;
    }

    if (years <= 0 || years > 100) {
        alert("Investment period must be between 1 and 100 years.");
        return;
    }

    button.innerText = "Calculating...";
    button.disabled = true;

    const cagr =
        ((endingValue / beginningValue) ** (1 / years) - 1) * 100;

    document.getElementById("cagr-result").innerHTML = `
        <div class="result-item">
            <span>CAGR</span>
            <strong>${cagr.toFixed(2)}%</strong>
        </div>
    `;

    button.innerText = "Calculate";
    button.disabled = false;
});
