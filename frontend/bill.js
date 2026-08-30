const API_URL = "https://smart-electricity-consumption-2.onrender.com";

let currentBill = null;

let selectedPaymentMethod = null;


// =====================================================
// VIEW BILL
// =====================================================

document
    .getElementById("fetchBillBtn")
    .addEventListener("click", async function () {


        const billNumber =
            document
                .getElementById("billNumber")
                .value
                .trim()
                .toUpperCase();


        const errorMessage =
            document.getElementById(
                "errorMessage"
            );


        const billDetails =
            document.getElementById(
                "billDetails"
            );


        errorMessage.textContent = "";


        if (!billNumber) {

            errorMessage.textContent =
                "Please enter your electricity bill number.";

            return;
        }


        try {


            const response =
                await fetch(
                    `${API_URL}/bill/${encodeURIComponent(billNumber)}`
                );


            const result =
                await response.json();


            console.log(
                "Bill API response:",
                result
            );


            if (
                !response.ok ||
                result.status !== "success"
            ) {

                errorMessage.textContent =
                    "Bill not found. Try BILL1001.";

                billDetails.style.display =
                    "none";

                return;
            }


            currentBill =
                result.bill;


            // =========================================
            // BILL DETAILS
            // =========================================

            document.getElementById(
                "displayBillNumber"
            ).textContent =
                currentBill.bill_number;


            document.getElementById(
                "billingMonth"
            ).textContent =
                currentBill.billing_month;


            document.getElementById(
                "paymentStartDate"
            ).textContent =
                currentBill.payment_start_date;


            document.getElementById(
                "paymentEndDate"
            ).textContent =
                currentBill.payment_end_date;


            document.getElementById(
                "monthlyConsumption"
            ).textContent =
                `${currentBill.monthly_consumption_kwh} kWh`;


            document.getElementById(
                "dailyConsumption"
            ).textContent =
                `${currentBill.daily_average_kwh} kWh/day`;


            document.getElementById(
                "electricityRate"
            ).textContent =
                `₹${currentBill.electricity_rate} / kWh`;


            document.getElementById(
                "totalBill"
            ).textContent =
                `₹${currentBill.total_bill}`;


            // Show bill

            billDetails.style.display =
                "block";


            billDetails.scrollIntoView({
                behavior: "smooth"
            });


        }

        catch (error) {

            console.error(
                "Bill error:",
                error
            );


            errorMessage.textContent =
                "Cannot connect to FastAPI server. Make sure the backend is running.";

        }

    });



// =====================================================
// PAYMENT METHOD SELECTION
// =====================================================

document
    .querySelectorAll(".payment-btn")
    .forEach(function (button) {


        button.addEventListener(
            "click",
            function () {


                document
                    .querySelectorAll(".payment-btn")
                    .forEach(function (btn) {

                        btn.classList.remove(
                            "selected"
                        );

                    });


                this.classList.add(
                    "selected"
                );


                selectedPaymentMethod =
                    this.dataset.method;


                document.getElementById(
                    "paymentMessage"
                ).textContent =
                    `${selectedPaymentMethod} selected.`;


                document.getElementById(
                    "payBtn"
                ).disabled = false;

            }
        );

    });



// =====================================================
// PAY BILL
// =====================================================

document
    .getElementById("payBtn")
    .addEventListener(
        "click",
        function () {


            if (!currentBill) {

                alert(
                    "Please view your bill first."
                );

                return;
            }


            if (!selectedPaymentMethod) {

                alert(
                    "Please select a payment method."
                );

                return;
            }


            const paymentMessage =
                document.getElementById(
                    "paymentMessage"
                );


            paymentMessage.textContent =
                "Processing payment...";


            document.getElementById(
                "payBtn"
            ).disabled = true;


            // Demo payment processing

            setTimeout(
                function () {


                    const transactionId =
                        "SE" + Date.now();


                    const paymentDate =
                        new Date()
                            .toLocaleString();


                    // =================================
                    // RECEIPT
                    // =================================

                    document.getElementById(
                        "receiptBillNumber"
                    ).textContent =
                        currentBill.bill_number;


                    document.getElementById(
                        "receiptBillingMonth"
                    ).textContent =
                        currentBill.billing_month;


                    document.getElementById(
                        "receiptStartDate"
                    ).textContent =
                        currentBill.payment_start_date;


                    document.getElementById(
                        "receiptEndDate"
                    ).textContent =
                        currentBill.payment_end_date;


                    document.getElementById(
                        "receiptConsumption"
                    ).textContent =
                        `${currentBill.monthly_consumption_kwh} kWh`;


                    document.getElementById(
                        "receiptRate"
                    ).textContent =
                        `₹${currentBill.electricity_rate} / kWh`;


                    document.getElementById(
                        "receiptAmount"
                    ).textContent =
                        `₹${currentBill.total_bill}`;


                    document.getElementById(
                        "receiptMethod"
                    ).textContent =
                        selectedPaymentMethod;


                    document.getElementById(
                        "transactionId"
                    ).textContent =
                        transactionId;


                    document.getElementById(
                        "paymentDate"
                    ).textContent =
                        paymentDate;


                    paymentMessage.textContent =
                        "Payment successful!";


                    document.getElementById(
                        "receipt"
                    ).style.display =
                        "block";


                    document.getElementById(
                        "receipt"
                    ).scrollIntoView({
                        behavior: "smooth"
                    });


                },
                1500
            );

        }
    );



// =====================================================
// PRINT RECEIPT
// =====================================================

document
    .getElementById("printBtn")
    .addEventListener(
        "click",
        function () {

            window.print();

        }
    );



// =====================================================
// DOWNLOAD RECEIPT
// =====================================================

document
    .getElementById("downloadBtn")
    .addEventListener(
        "click",
        function () {


            const receipt =
                document.getElementById(
                    "receiptContent"
                ).innerText;


            const blob =
                new Blob(
                    [receipt],
                    {
                        type: "text/plain"
                    }
                );


            const url =
                URL.createObjectURL(
                    blob
                );


            const link =
                document.createElement(
                    "a"
                );


            link.href = url;


            link.download =
                "SmartEnergy_Electricity_Bill_Receipt.txt";


            document.body.appendChild(
                link
            );


            link.click();


            document.body.removeChild(
                link
            );


            URL.revokeObjectURL(
                url
            );

        }
    );