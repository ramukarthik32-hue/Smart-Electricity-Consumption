from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from backend.appliances import router as appliance_router

import joblib
import pandas as pd
from pathlib import Path
from huggingface_hub import hf_hub_download


# =========================================================
# LOAD ML MODEL
# =========================================================

MODEL_FILE = hf_hub_download(
    repo_id="KARTEEKRAMU/Smart-electricity-consumption",
    filename="electricity_consumption_model.pkl"
)

FEATURE_FILE = hf_hub_download(
    repo_id="KARTEEKRAMU/Smart-electricity-consumption",
    filename="feature_columns.pkl"
)

model = joblib.load(MODEL_FILE)
feature_columns = joblib.load(FEATURE_FILE)

# =========================================================
# FASTAPI APP
# =========================================================

app = FastAPI(
    title="Smart Electricity Consumption API",
    description="API for electricity consumption, bill calculation and prediction",
    version="1.0.0"
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# APPLIANCE ROUTER
# =========================================================

app.include_router(appliance_router)


# =========================================================
# HOME
# =========================================================

@app.get("/")
def home():
    return {
        "message": "Smart Electricity Consumption API is running!",
        "status": "success"
    }


# =========================================================
# CALCULATOR
# =========================================================

class ElectricityRequest(BaseModel):

    appliance_name: str
    power_watts: float
    hours_per_day: float
    days_per_month: int
    electricity_rate: float


@app.post("/calculate")
def calculate_consumption(data: ElectricityRequest):

    daily_kwh = (
        data.power_watts * data.hours_per_day
    ) / 1000

    monthly_kwh = (
        daily_kwh * data.days_per_month
    )

    daily_cost = (
        daily_kwh * data.electricity_rate
    )

    monthly_cost = (
        monthly_kwh * data.electricity_rate
    )

    return {
        "appliance": data.appliance_name,
        "power_watts": data.power_watts,
        "hours_per_day": data.hours_per_day,
        "daily_consumption_kwh": round(daily_kwh, 2),
        "monthly_consumption_kwh": round(monthly_kwh, 2),
        "daily_cost": round(daily_cost, 2),
        "monthly_cost": round(monthly_cost, 2)
    }


# =========================================================
# ML PREDICTION REQUEST
# =========================================================

class PredictionRequest(BaseModel):

    lights: float

    T1: float
    RH_1: float

    T2: float
    RH_2: float

    T3: float
    RH_3: float

    T4: float
    RH_4: float

    T5: float
    RH_5: float

    T6: float
    RH_6: float

    T7: float
    RH_7: float

    T8: float
    RH_8: float

    T9: float
    RH_9: float

    T_out: float
    Press_mm_hg: float
    RH_out: float
    Windspeed: float
    Visibility: float
    Tdewpoint: float
    rv1: float
    rv2: float


# =========================================================
# ML PREDICTION
# =========================================================

@app.post("/predict")
def predict_consumption(data: PredictionRequest):

    input_data = pd.DataFrame([{

        "lights": data.lights,

        "T1": data.T1,
        "RH_1": data.RH_1,

        "T2": data.T2,
        "RH_2": data.RH_2,

        "T3": data.T3,
        "RH_3": data.RH_3,

        "T4": data.T4,
        "RH_4": data.RH_4,

        "T5": data.T5,
        "RH_5": data.RH_5,

        "T6": data.T6,
        "RH_6": data.RH_6,

        "T7": data.T7,
        "RH_7": data.RH_7,

        "T8": data.T8,
        "RH_8": data.RH_8,

        "T9": data.T9,
        "RH_9": data.RH_9,

        "T_out": data.T_out,

        "Press_mm_hg": data.Press_mm_hg,

        "RH_out": data.RH_out,

        "Windspeed": data.Windspeed,

        "Visibility": data.Visibility,

        "Tdewpoint": data.Tdewpoint,

        "rv1": data.rv1,
        "rv2": data.rv2
    }])

    prediction = model.predict(input_data)[0]

    return {
        "status": "success",
        "predicted_consumption_wh": round(float(prediction), 2),
        "unit": "Wh"
    }


# =========================================================
# ELECTRICITY BILL LOOKUP
# =========================================================

@app.get("/bill/{bill_number}")
def get_bill(bill_number: str):

    bills = {

        "BILL1001": {

            "bill_number": "BILL1001",

            "billing_month": "August 2026",

            "payment_start_date": "01-Aug-2026",

            "payment_end_date": "31-Aug-2026",

            "monthly_consumption_kwh": 397.02,

            "daily_average_kwh": 12.81,

            "electricity_rate": 8.00,

            "total_bill": 3176.16
        },

        "BILL1002": {

            "bill_number": "BILL1002",

            "billing_month": "August 2026",

            "payment_start_date": "01-Aug-2026",

            "payment_end_date": "31-Aug-2026",

            "monthly_consumption_kwh": 285.50,

            "daily_average_kwh": 9.21,

            "electricity_rate": 8.00,

            "total_bill": 2284.00
        },

        "BILL1003": {

            "bill_number": "BILL1003",

            "billing_month": "August 2026",

            "payment_start_date": "01-Aug-2026",

            "payment_end_date": "31-Aug-2026",

            "monthly_consumption_kwh": 450.75,

            "daily_average_kwh": 14.54,

            "electricity_rate": 8.00,

            "total_bill": 3606.00
        }
    }


    bill = bills.get(
        bill_number.upper()
    )


    if bill is None:

        return {
            "status": "error",
            "message": "Electricity bill not found"
        }


    return {
        "status": "success",
        "bill": bill
    }