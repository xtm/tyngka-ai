document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("cagrForm");

    if (!form) {
        return;
    }

    const initialInvestmentInput =
        document.getElementById("initial-investment");

    const finalInvestmentInput =
        document.getElementById("final-investment");

    const yearsInput =
        document.getElementById("years");

    const cagrValueElement =
        document.getElementById("cagr-value");

    const initialValueElement =
        document.getElementById("initial-value");

    const finalValueElement =
        document.getElementById("final-value");

    const resultPlaceholder =
        document.getElementById("result-placeholder");

    const resultValues =
        document.getElementById("result-values");

    const chartSection =
        document.getElementById("projection-chart-section");

    const chartElement =
        document.getElementById("projection-chart");

    const maximizeChartButton =
        document.getElementById("maximize-chart-button");

    const chartDialog =
        document.getElementById("chart-dialog");

    const largeChartElement =
        document.getElementById("projection-chart-large");

    const closeChartButton =
        document.getElementById("close-chart-button");


    /* =========================================================
       Formatting
       ========================================================= */

    function formatCurrency(value) {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }).format(value);
    }


    function formatDisplayCurrency(value) {
        const absValue = Math.abs(value);

        if (absValue >= 10000000) {
            return `₹${(value / 10000000).toFixed(2)} Cr`;
        }

        if (absValue >= 100000) {
            return `₹${(value / 100000).toFixed(2)} L`;
        }

        return formatCurrency(value);
    }


    function formatChartCurrency(value) {
        const absValue = Math.abs(value);

        if (absValue >= 10000000) {
            return `₹${(value / 10000000).toFixed(1)} Cr`;
        }

        if (absValue >= 100000) {
            return `₹${(value / 100000).toFixed(1)} L`;
        }

        if (absValue >= 1000) {
            return `₹${(value / 1000).toFixed(0)}K`;
        }

        return `₹${Math.round(value)}`;
    }


    /* =========================================================
       CAGR Calculation
       ========================================================= */

    function calculateCAGR(
        initialInvestment,
        finalInvestment,
        years
    ) {
        if (
            initialInvestment <= 0 ||
            finalInvestment < 0 ||
            years <= 0
        ) {
            return null;
        }

        if (finalInvestment === 0) {
            return -100;
        }

        const cagr =
            (
                Math.pow(
                    finalInvestment /
                    initialInvestment,
                    1 / years
                ) - 1
            ) * 100;

        return cagr;
    }


    /* =========================================================
       Growth Projection
       ========================================================= */

    function calculateProjection(
        initialInvestment,
        cagr,
        years
    ) {
        const points = [];

        points.push({
            year: 0,
            startingValue: initialInvestment,
            projected: initialInvestment
        });


        for (
            let year = 1;
            year <= years;
            year++
        ) {
            const projected =
                initialInvestment *
                Math.pow(
                    1 + cagr / 100,
                    year
                );

            points.push({
                year,
                startingValue: initialInvestment,
                projected
            });
        }


        return points;
    }


    /* =========================================================
       Chart
       ========================================================= */

    function createChart(
        points,
        large = false
    ) {
        if (
            !points ||
            points.length === 0
        ) {
            return "";
        }


        const width = 900;
        const height =
            large ? 450 : 210;


        const padding = {
            top: 20,
            right: 20,
            bottom: 35,
            left: 55
        };


        const chartWidth =
            width -
            padding.left -
            padding.right;

        const chartHeight =
            height -
            padding.top -
            padding.bottom;


	const values = points.map(
	    point => point.projected
	);

	const dataMin = Math.min(...values);
	const dataMax = Math.max(...values);

	const range = dataMax - dataMin;

	const paddingAmount =
	    range > 0
	        ? range * 0.10
	        : dataMax * 0.10;

	const maxValue =
	    dataMax + paddingAmount;

	const minValue =
	    Math.max(
	        0,
	        dataMin - paddingAmount
	    );

        function x(index) {
            if (
                points.length === 1
            ) {
                return padding.left;
            }

            return (
                padding.left +
                (
                    index /
                    (points.length - 1)
                ) *
                chartWidth
            );
        }


        function y(value) {
            if (
                maxValue === minValue
            ) {
                return (
                    padding.top +
                    chartHeight / 2
                );
            }

            return (
                padding.top +
                chartHeight -
                (
                    (value - minValue) /
                    (maxValue - minValue)
                ) *
                chartHeight
            );
        }


        function buildPath() {
            return points
                .map(
                    (point, index) => {
                        const command =
                            index === 0
                                ? "M"
                                : "L";

                        return `${command} ${x(index).toFixed(2)} ${y(
                            point.projected
                        ).toFixed(2)}`;
                    }
                )
                .join(" ");
        }


        const growthPath =
            buildPath();


        /* Grid */

        const gridValues = [
            maxValue,
            maxValue * 0.75,
            maxValue * 0.5,
            maxValue * 0.25,
            minValue
        ];


        const uniqueGridValues =
            [...new Set(
                gridValues.map(
                    value =>
                        Number(
                            value.toFixed(6)
                        )
                )
            )];


        const gridLines =
            uniqueGridValues
                .map(value => {
                    const lineY =
                        y(value);

                    return `
                        <line
                            x1="${padding.left}"
                            y1="${lineY}"
                            x2="${width - padding.right}"
                            y2="${lineY}"
                            class="chart-grid-line"
                        />

                        <text
                            x="${padding.left - 10}"
                            y="${lineY + 4}"
                            text-anchor="end"
                            class="chart-axis-label"
                        >
                            ${formatChartCurrency(value)}
                        </text>
                    `;
                })
                .join("");


        /* X-axis labels */

        const xLabels =
            points
                .map(
                    (point, index) => {
                        const interval =
                            Math.max(
                                1,
                                Math.ceil(
                                    (points.length - 1) /
                                    4
                                )
                            );

                        const shouldShow =
                            points.length <= 6 ||
                            index === 0 ||
                            index === points.length - 1 ||
                            index % interval === 0;

                        if (!shouldShow) {
                            return "";
                        }

                        return `
                            <text
                                x="${x(index)}"
                                y="${height - 10}"
                                text-anchor="middle"
                                class="chart-axis-label"
                            >
                                ${point.year}
                            </text>
                        `;
                    }
                )
                .join("");


        return `
            <svg
                class="chart-svg"
                viewBox="0 0 ${width} ${height}"
                preserveAspectRatio="none"
                role="img"
                aria-label="Illustrative CAGR growth path"
            >

                ${gridLines}

                <path
                    d="${growthPath}"
                    class="chart-line chart-projected"
                    fill="none"
                />

                ${xLabels}

            </svg>
        `;
    }


    function renderChart(points) {

        if (chartElement) {
            chartElement.innerHTML =
                createChart(
                    points,
                    false
                );
        }

        if (largeChartElement) {
            largeChartElement.innerHTML =
                createChart(
                    points,
                    true
                );
        }
    }


    /* =========================================================
       Calculate
       ========================================================= */

    form.addEventListener(
        "submit",
        event => {
            event.preventDefault();


            const initialInvestment =
                Number(
                    initialInvestmentInput.value
                ) || 0;


            const finalInvestment =
                Number(
                    finalInvestmentInput.value
                ) || 0;


            const years =
                Number(
                    yearsInput.value
                ) || 0;


            if (
                initialInvestment <= 0 ||
                finalInvestment < 0 ||
                years <= 0
            ) {
                return;
            }


            const cagr =
                calculateCAGR(
                    initialInvestment,
                    finalInvestment,
                    years
                );


            if (cagr === null) {
                return;
            }


            cagrValueElement.textContent =
                `${cagr.toFixed(2)}%`;


            initialValueElement.textContent =
                formatDisplayCurrency(
                    initialInvestment
                );


            finalValueElement.textContent =
                formatDisplayCurrency(
                    finalInvestment
                );


            if (resultPlaceholder) {
                resultPlaceholder.hidden =
                    true;
            }


            if (resultValues) {
                resultValues.hidden =
                    false;
            }


            const projection =
                calculateProjection(
                    initialInvestment,
                    cagr,
                    years
                );


            renderChart(projection);


            if (chartSection) {
                chartSection.hidden =
                    false;
            }
        }
    );


    /* =========================================================
       Chart Dialog
       ========================================================= */

    function openChartDialog() {
        if (!chartDialog) {
            return;
        }

        if (
            typeof chartDialog.showModal ===
            "function"
        ) {
            chartDialog.showModal();
        } else {
            chartDialog.setAttribute(
                "open",
                ""
            );
        }
    }


    function closeChartDialog() {
        if (!chartDialog) {
            return;
        }

        if (
            typeof chartDialog.close ===
            "function"
        ) {
            chartDialog.close();
        } else {
            chartDialog.removeAttribute(
                "open"
            );
        }
    }


    if (maximizeChartButton) {
        maximizeChartButton.addEventListener(
            "click",
            event => {
                event.preventDefault();
                openChartDialog();
            }
        );
    }


    if (chartElement) {
        chartElement.addEventListener(
            "click",
            event => {
                event.preventDefault();
                openChartDialog();
            }
        );


        chartElement.addEventListener(
            "keydown",
            event => {
                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {
                    event.preventDefault();
                    openChartDialog();
                }
            }
        );
    }


    if (closeChartButton) {
        closeChartButton.addEventListener(
            "click",
            event => {
                event.preventDefault();
                closeChartDialog();
            }
        );
    }


    if (chartDialog) {
        chartDialog.addEventListener(
            "click",
            event => {
                if (
                    event.target ===
                    chartDialog
                ) {
                    closeChartDialog();
                }
            }
        );
    }


    /* =========================================================
       Initial Calculation
       ========================================================= */

    form.dispatchEvent(
        new Event("submit", {
            bubbles: true,
            cancelable: true
        })
    );
});
