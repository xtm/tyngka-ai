document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("sipForm");

    if (!form) {
        return;
    }

    const existingInvestmentInput =
        document.getElementById("existing-investment");

    const monthlyInvestmentInput =
        document.getElementById("monthly-investment");

    const annualReturnInput =
        document.getElementById("annual-return");

    const yearsInput =
        document.getElementById("years");

    const futureValueElement =
        document.getElementById("future-value");

    const totalInvestmentElement =
        document.getElementById("total-investment");

    const estimatedReturnsElement =
        document.getElementById("estimated-returns");

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


    function formatCompactCurrency(value) {
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
       SIP Calculation
       ========================================================= */

    function calculateSIP(
        existingInvestment,
        monthlyInvestment,
        annualReturn,
        years
    ) {
        const monthlyRate =
            annualReturn / 100 / 12;

        const months =
            years * 12;

        let sipFutureValue;
        let existingFutureValue;

        if (monthlyRate === 0) {
            sipFutureValue =
                monthlyInvestment * months;

            existingFutureValue =
                existingInvestment;
        } else {
            sipFutureValue =
                monthlyInvestment *
                (
                    ((1 + monthlyRate) ** months - 1) /
                    monthlyRate
                );

            existingFutureValue =
                existingInvestment *
                (1 + monthlyRate) ** months;
        }

        const futureValue =
            sipFutureValue + existingFutureValue;

        const totalInvestment =
            existingInvestment +
            monthlyInvestment * months;

        const estimatedReturns =
            futureValue - totalInvestment;

        return {
            futureValue,
            totalInvestment,
            estimatedReturns
        };
    }


    /* =========================================================
       Projection Data
       ========================================================= */

    function calculateProjection(
        existingInvestment,
        monthlyInvestment,
        annualReturn,
        years
    ) {
        const monthlyRate =
            annualReturn / 100 / 12;

        const totalMonths =
            years * 12;

        let value =
            existingInvestment;

        const points = [];

        points.push({
            year: 0,
            invested: existingInvestment,
            projected: existingInvestment
        });

        for (
            let month = 1;
            month <= totalMonths;
            month++
        ) {
            if (monthlyRate > 0) {
                value *= 1 + monthlyRate;
            }

            value += monthlyInvestment;

            if (month % 12 === 0) {
                const year =
                    month / 12;

                points.push({
                    year,
                    invested:
                        existingInvestment +
                        monthlyInvestment * month,
                    projected: value
                });
            }
        }

        return points;
    }


    /* =========================================================
       Chart
       ========================================================= */

    function createChart(points, large = false) {
        if (!points || points.length === 0) {
            return "";
        }

        const width = 900;
        const height = large ? 450 : 210;

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

        const maxValue =
            Math.max(
                ...points.map(
                    point => point.projected
                )
            );

        const minValue = 0;


        function x(index) {
            if (points.length === 1) {
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
            if (maxValue === minValue) {
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


        function buildPath(key) {
            return points
                .map((point, index) => {
                    const command =
                        index === 0
                            ? "M"
                            : "L";

                    return `${command} ${x(index).toFixed(2)} ${y(
                        point[key]
                    ).toFixed(2)}`;
                })
                .join(" ");
        }


        const investedPath =
            buildPath("invested");

        const projectedPath =
            buildPath("projected");


        const gridValues = [
            maxValue,
            maxValue * 0.75,
            maxValue * 0.5,
            maxValue * 0.25,
            0
        ];

        const gridLines =
            gridValues
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
                            ${formatCompactCurrency(value)}
                        </text>
                    `;
                })
                .join("");


        const xLabels =
            points
                .map((point, index) => {
                    const interval =
                        Math.max(
                            1,
                            Math.ceil(
                                (points.length - 1) / 4
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
                })
                .join("");


        return `
            <svg
                class="chart-svg"
                viewBox="0 0 ${width} ${height}"
                preserveAspectRatio="none"
                role="img"
                aria-label="Investment projection chart"
            >

                ${gridLines}

                <path
                    d="${investedPath}"
                    class="chart-line chart-invested"
                    fill="none"
                />

                <path
                    d="${projectedPath}"
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
                createChart(points, false);
        }

        if (largeChartElement) {
            largeChartElement.innerHTML =
                createChart(points, true);
        }
    }


    /* =========================================================
       Calculate
       ========================================================= */

    form.addEventListener("submit", event => {
        event.preventDefault();

        const existingInvestment =
            Number(
                existingInvestmentInput.value
            ) || 0;

        const monthlyInvestment =
            Number(
                monthlyInvestmentInput.value
            ) || 0;

        const annualReturn =
            Number(
                annualReturnInput.value
            ) || 0;

        const years =
            Number(
                yearsInput.value
            ) || 0;


        if (
            monthlyInvestment <= 0 ||
            annualReturn < 0 ||
            years <= 0
        ) {
            return;
        }


        const result =
            calculateSIP(
                existingInvestment,
                monthlyInvestment,
                annualReturn,
                years
            );


        futureValueElement.textContent =
            formatDisplayCurrency(
                result.futureValue
            );

        totalInvestmentElement.textContent =
            formatDisplayCurrency(
                result.totalInvestment
            );

        estimatedReturnsElement.textContent =
            formatDisplayCurrency(
                result.estimatedReturns
            );


        if (resultPlaceholder) {
            resultPlaceholder.hidden = true;
        }

        if (resultValues) {
            resultValues.hidden = false;
        }


        const projection =
            calculateProjection(
                existingInvestment,
                monthlyInvestment,
                annualReturn,
                years
            );

        renderChart(projection);


        if (chartSection) {
            chartSection.hidden = false;
        }
    });


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
