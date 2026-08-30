const API_URL = "https://smart-electricity-consumption-2.onrender.com";


// ==========================================
// LOAD APPLIANCES FROM FASTAPI
// ==========================================

async function loadAppliances() {

    const applianceSelect =
        document.getElementById("appliance");

    try {

        const response =
            await fetch(`${API_URL}/appliances`);

        if (!response.ok) {

            throw new Error(
                "Failed to load appliances"
            );

        }

        const appliances =
            await response.json();

        console.log(
            "Appliances from API:",
            appliances
        );


        // Clear dropdown

        applianceSelect.innerHTML =
            `<option value="">Select an appliance</option>`;


        // Add appliances

        for (const key in appliances) {

            const appliance =
                appliances[key];

            const option =
                document.createElement("option");

            option.value = key;

            option.textContent =
                appliance.name;

            applianceSelect.appendChild(option);

        }

    }

    catch (error) {

        console.error(
            "Appliance loading error:",
            error
        );

        applianceSelect.innerHTML =
            `<option value="">Unable to load appliances</option>`;

    }

}



// ==========================================
// APPLIANCE SELECTION
// ==========================================

document
    .getElementById("appliance")
    .addEventListener(
        "change",
        async function () {

            const selectedAppliance =
                this.value;


            if (!selectedAppliance) {

                document.getElementById("power").value = "";

                document.getElementById("voltage").value = "230";

                return;

            }


            try {

                const response =
                    await fetch(
                        `${API_URL}/appliances`
                    );


                const appliances =
                    await response.json();


                const appliance =
                    appliances[selectedAppliance];


                if (appliance) {

                    // Automatic power

                    document.getElementById(
                        "power"
                    ).value =
                        appliance.power_watts;


                    // Automatic voltage

                    document.getElementById(
                        "voltage"
                    ).value =
                        appliance.voltage;

                }

            }

            catch (error) {

                console.error(
                    "Appliance selection error:",
                    error
                );

            }

        }
    );



// ==========================================
// CALCULATE CONSUMPTION
// ==========================================

document
    .getElementById("calculatorForm")
    .addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // Get values

            const applianceSelect =
                document.getElementById(
                    "appliance"
                );

            const applianceName =
                applianceSelect.options[
                    applianceSelect.selectedIndex
                ].text;


            const power =
                Number(
                    document.getElementById(
                        "power"
                    ).value
                );


            const hours =
                Number(
                    document.getElementById(
                        "hours"
                    ).value
                );


            const days =
                Number(
                    document.getElementById(
                        "days"
                    ).value
                );


            const rate =
                Number(
                    document.getElementById(
                        "rate"
                    ).value
                );


            // Validation

            if (!applianceSelect.value) {

                alert(
                    "Please select an appliance."
                );

                return;

            }


            if (
                power <= 0 ||
                hours <= 0 ||
                days <= 0 ||
                rate < 0
            ) {

                alert(
                    "Please enter valid values."
                );

                return;

            }


            // Request body

            const requestData = {

                appliance_name:
                    applianceName,

                power_watts:
                    power,

                hours_per_day:
                    hours,

                days_per_month:
                    days,

                electricity_rate:
                    rate

            };


            console.log(
                "Sending calculation:",
                requestData
            );


            try {

                const response =
                    await fetch(
                        `${API_URL}/calculate`,
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify(
                                    requestData
                                )

                        }
                    );


                const result =
                    await response.json();


                console.log(
                    "Calculation result:",
                    result
                );


                // Error from API

                if (!response.ok) {

                    console.error(
                        "API Error:",
                        result
                    );

                    alert(
                        "Calculation failed. Check the browser console."
                    );

                    return;

                }


                // ==================================
                // DISPLAY RESULT
                // ==================================

                document.getElementById(
                    "dailyConsumption"
                ).textContent =
                    `${result.daily_consumption_kwh} kWh`;


                document.getElementById(
                    "monthlyConsumption"
                ).textContent =
                    `${result.monthly_consumption_kwh} kWh`;


                document.getElementById(
                    "dailyCost"
                ).textContent =
                    `₹${result.daily_cost}`;


                document.getElementById(
                    "monthlyCost"
                ).textContent =
                    `₹${result.monthly_cost}`;


            }

            catch (error) {

                console.error(
                    "Calculation error:",
                    error
                );

                alert(
                    "Cannot connect to FastAPI server. Make sure the server is running."
                );

            }

        }
    );



// ==========================================
// START
// ==========================================

loadAppliances();