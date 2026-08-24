// ==========================================
// FASTAPI URL
// ==========================================

const API_URL = "http://127.0.0.1:8000";


// ==========================================
// GET FORM
// ==========================================

const predictionForm =
    document.getElementById("predictionForm");


// ==========================================
// SUBMIT PREDICTION
// ==========================================

predictionForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        // Hide old messages

        document
            .getElementById("resultCard")
            .classList.add("hidden");

        document
            .getElementById("errorMessage")
            .classList.add("hidden");


        // ======================================
        // COLLECT 27 FEATURES
        // ======================================

        const requestData = {

            lights: Number(
                document.getElementById("lights").value
            ),

            T1: Number(
                document.getElementById("T1").value
            ),

            RH_1: Number(
                document.getElementById("RH_1").value
            ),

            T2: Number(
                document.getElementById("T2").value
            ),

            RH_2: Number(
                document.getElementById("RH_2").value
            ),

            T3: Number(
                document.getElementById("T3").value
            ),

            RH_3: Number(
                document.getElementById("RH_3").value
            ),

            T4: Number(
                document.getElementById("T4").value
            ),

            RH_4: Number(
                document.getElementById("RH_4").value
            ),

            T5: Number(
                document.getElementById("T5").value
            ),

            RH_5: Number(
                document.getElementById("RH_5").value
            ),

            T6: Number(
                document.getElementById("T6").value
            ),

            RH_6: Number(
                document.getElementById("RH_6").value
            ),

            T7: Number(
                document.getElementById("T7").value
            ),

            RH_7: Number(
                document.getElementById("RH_7").value
            ),

            T8: Number(
                document.getElementById("T8").value
            ),

            RH_8: Number(
                document.getElementById("RH_8").value
            ),

            T9: Number(
                document.getElementById("T9").value
            ),

            RH_9: Number(
                document.getElementById("RH_9").value
            ),

            T_out: Number(
                document.getElementById("T_out").value
            ),

            Press_mm_hg: Number(
                document.getElementById("Press_mm_hg").value
            ),

            RH_out: Number(
                document.getElementById("RH_out").value
            ),

            Windspeed: Number(
                document.getElementById("Windspeed").value
            ),

            Visibility: Number(
                document.getElementById("Visibility").value
            ),

            Tdewpoint: Number(
                document.getElementById("Tdewpoint").value
            ),

            rv1: Number(
                document.getElementById("rv1").value
            ),

            rv2: Number(
                document.getElementById("rv2").value
            )

        };


        console.log(
            "Prediction request:",
            requestData
        );


        // ======================================
        // SEND REQUEST TO FASTAPI
        // ======================================

        try {

            const response =
                await fetch(
                    `${API_URL}/predict`,
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
                "Prediction response:",
                result
            );


            // ==================================
            // API ERROR
            // ==================================

            if (!response.ok) {

                throw new Error(
                    result.detail ||
                    "Prediction failed"
                );

            }


            // ==================================
            // DISPLAY RESULT
            // ==================================

            document.getElementById(
                "predictionValue"
            ).textContent =
                `${result.predicted_consumption_wh} ${result.unit}`;


            document
                .getElementById("resultCard")
                .classList.remove("hidden");


        }

        catch (error) {

            console.error(
                "Prediction error:",
                error
            );


            const errorMessage =
                document.getElementById(
                    "errorMessage"
                );


            errorMessage.textContent =
                "Unable to get prediction. Please make sure the FastAPI server is running.";


            errorMessage
                .classList.remove("hidden");

        }

    }
);