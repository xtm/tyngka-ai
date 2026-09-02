const button = document.getElementById("calculate-cagr-button");

button.addEventListener("click", async () => {

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

    let response;

    try {
        response = await fetch(
            "http://127.0.0.1:8000/api/v1/cagr",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    beginning_value: beginningValue,
                    ending_value: endingValue,
                    years: years
                })
            }
        );
    } catch (error) {
        document.getElementById("cagr-result").innerText =
            "Unable to connect to Tyngka API.";

        button.innerText = "Calculate";
        button.disabled = false;
        return;
    }

    if (!response.ok) {
        document.getElementById("cagr-result").innerText =
            "Unable to calculate. Please check your inputs.";

        button.innerText = "Calculate";
        button.disabled = false;
        return;
    }

    const data = await response.json();

    document.getElementById("cagr-result").innerHTML = `
        <div class="result-item">
            <span>CAGR</span>
            <strong>${data.cagr.toFixed(2)}%</strong>
        </div>
    `;

    button.innerText = "Calculate";
    button.disabled = false;
});
