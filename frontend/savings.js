const API_URL = "http://127.0.0.1:8000";


// ==========================================
// LOAD APPLIANCES
// ==========================================

async function loadAppliances() {

    const applianceSelect =
        document.getElementById("appliance");

    try {

        const response =
            await fetch(`${API_URL}/appliances`);

        if (!response.ok) {
            throw new Error("Failed to load appliances");
        }

        const appliances =
            await response.json();

        console.log("Savings - Appliances:", appliances);

        applianceSelect.innerHTML =
            `<option value="">Select an appliance</option>`;

        for (const key in appliances) {

            const appliance = appliances[key];

            const option =
                document.createElement("option");

            option.value = key;

            option.textContent =
                appliance.name;

            applianceSelect.appendChild(option);
        }

    } catch (error) {

        console.error(
            "Error loading appliances:",
            error
        );

        applianceSelect.innerHTML =
            `<option value="">Unable to load appliances</option>`;
    }
}



// ==========================================
// CALCULATE SAVINGS
// ==========================================

document
    .getElementById("savingsForm")
    .addEventListener("submit", async function(event) {

        event.preventDefault();


        const applianceSelect =
            document.getElementById("appliance");

        const currentHours =
            Number(
                document.getElementById("currentHours").value
            );

        const recommendedHours =
            Number(
                document.getElementById("recommendedHours").value
            );

        const days =
            Number(
                document.getElementById("days").value
            );

        const rate =
            Number(
                document.getElementById("rate").value
            );


        // ==================================
        // VALIDATION
        // ==================================

        if (!applianceSelect.value) {

            alert("Please select an appliance.");

            return;
        }

        if (
            currentHours <= 0 ||
            recommendedHours < 0 ||
            days <= 0 ||
            rate < 0
        ) {

            alert("Please enter valid values.");

            return;
        }

        if (recommendedHours > currentHours) {

            alert(
                "Recommended hours should not be greater than current hours."
            );

            return;
        }


        // ==================================
        // GET APPLIANCE DATA
        // ==================================

        try {

            const response =
                await fetch(`${API_URL}/appliances`);

            const appliances =
                await response.json();

            const appliance =
                appliances[applianceSelect.value];


            if (!appliance) {

                alert("Appliance information not found.");

                return;
            }


            const powerWatts =
                Number(appliance.power_watts);


            const applianceName =
                appliance.name;


            // ==================================
            // CURRENT CONSUMPTION
            // ==================================

            const currentDailyKwh =
                (powerWatts * currentHours) / 1000;


            const currentMonthlyKwh =
                currentDailyKwh * days;


            const currentMonthlyCost =
                currentMonthlyKwh * rate;


            // ==================================
            // RECOMMENDED CONSUMPTION
            // ==================================

            const recommendedDailyKwh =
                (powerWatts * recommendedHours) / 1000;


            const recommendedMonthlyKwh =
                recommendedDailyKwh * days;


            const recommendedMonthlyCost =
                recommendedMonthlyKwh * rate;


            // ==================================
            // SAVINGS
            // ==================================

            const energySaved =
                currentMonthlyKwh -
                recommendedMonthlyKwh;


            const moneySaved =
                currentMonthlyCost -
                recommendedMonthlyCost;


            // ==================================
            // DISPLAY RESULT
            // ==================================

            showSavingsResult({

                applianceName,
                powerWatts,

                currentHours,
                recommendedHours,

                currentMonthlyKwh,
                recommendedMonthlyKwh,

                currentMonthlyCost,
                recommendedMonthlyCost,

                energySaved,
                moneySaved

            });


            console.log(
                "Savings Result:",
                {
                    applianceName,
                    powerWatts,
                    currentMonthlyKwh,
                    recommendedMonthlyKwh,
                    currentMonthlyCost,
                    recommendedMonthlyCost,
                    energySaved,
                    moneySaved
                }
            );

        }

        catch (error) {

            console.error(
                "Savings calculation error:",
                error
            );

            alert(
                "Cannot connect to FastAPI server."
            );
        }

    });



// ==========================================
// DISPLAY SAVINGS RESULT
// ==========================================

function showSavingsResult(data) {

    let resultCard =
        document.getElementById("savingsResult");


    // Create result card if it doesn't exist

    if (!resultCard) {

        resultCard =
            document.createElement("div");

        resultCard.id =
            "savingsResult";

        resultCard.style.marginTop =
            "30px";

        resultCard.style.padding =
            "30px";

        resultCard.style.background =
            "white";

        resultCard.style.borderRadius =
            "15px";

        resultCard.style.boxShadow =
            "0 10px 30px rgba(0,0,0,0.08)";


        const form =
            document.getElementById("savingsForm");

        form.parentElement.appendChild(
            resultCard
        );
    }


    resultCard.innerHTML = `

        <h2 style="
            text-align:center;
            margin-bottom:25px;
        ">
            💰 Your Savings Result
        </h2>


        <div style="
            text-align:center;
            margin-bottom:25px;
        ">

            <h3>
                ${data.applianceName}
            </h3>

            <p style="color:#697386;">
                Power: ${data.powerWatts} W
            </p>

        </div>


        <div style="
            display:grid;
            grid-template-columns:repeat(2, 1fr);
            gap:20px;
        ">


            <div style="
                padding:20px;
                background:#f5f7fb;
                border-radius:10px;
                text-align:center;
            ">

                <p>Current Monthly Usage</p>

                <strong style="
                    font-size:24px;
                    color:#2563eb;
                ">

                    ${data.currentMonthlyKwh.toFixed(2)} kWh

                </strong>

            </div>



            <div style="
                padding:20px;
                background:#f5f7fb;
                border-radius:10px;
                text-align:center;
            ">

                <p>Recommended Usage</p>

                <strong style="
                    font-size:24px;
                    color:#2563eb;
                ">

                    ${data.recommendedMonthlyKwh.toFixed(2)} kWh

                </strong>

            </div>



            <div style="
                padding:20px;
                background:#f5f7fb;
                border-radius:10px;
                text-align:center;
            ">

                <p>Current Monthly Cost</p>

                <strong style="
                    font-size:24px;
                    color:#172033;
                ">

                    ₹${data.currentMonthlyCost.toFixed(2)}

                </strong>

            </div>



            <div style="
                padding:20px;
                background:#f5f7fb;
                border-radius:10px;
                text-align:center;
            ">

                <p>New Monthly Cost</p>

                <strong style="
                    font-size:24px;
                    color:#172033;
                ">

                    ₹${data.recommendedMonthlyCost.toFixed(2)}

                </strong>

            </div>

        </div>


        <div style="
            margin-top:25px;
            padding:25px;
            background:#eef5ff;
            border-radius:12px;
            text-align:center;
        ">

            <h2 style="
                color:#2563eb;
                margin-bottom:10px;
            ">

                💰 Estimated Monthly Savings

            </h2>


            <div style="
                font-size:36px;
                font-weight:bold;
                color:#16a34a;
            ">

                ₹${data.moneySaved.toFixed(2)}

            </div>


            <p style="
                margin-top:10px;
                color:#697386;
            ">

                You can save approximately
                ${data.energySaved.toFixed(2)} kWh
                of electricity every month.

            </p>

        </div>


        <div style="
            margin-top:20px;
            padding:20px;
            background:#fff7ed;
            border-radius:10px;
        ">

            💡 <strong>Recommendation:</strong>

            Reduce ${data.applianceName}
            usage from

            <strong>${data.currentHours} hours</strong>

            to

            <strong>${data.recommendedHours} hours</strong>

            per day to reduce your electricity bill.

        </div>

    `;
}



// ==========================================
// START APPLICATION
// ==========================================

loadAppliances();