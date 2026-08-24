from fastapi import APIRouter

router = APIRouter()


APPLIANCES = {
    "fan": {
        "name": "Fan",
        "power_watts": 60,
        "voltage": 230
    },
    "led_light": {
        "name": "LED Light",
        "power_watts": 9,
        "voltage": 230
    },
    "ac": {
        "name": "Air Conditioner",
        "power_watts": 1500,
        "voltage": 230
    },
    "tv": {
        "name": "Television",
        "power_watts": 100,
        "voltage": 230
    },
    "refrigerator": {
        "name": "Refrigerator",
        "power_watts": 150,
        "voltage": 230
    },
    "washing_machine": {
        "name": "Washing Machine",
        "power_watts": 500,
        "voltage": 230
    },
    "computer": {
        "name": "Computer",
        "power_watts": 200,
        "voltage": 230
    },
    "iron": {
        "name": "Iron",
        "power_watts": 1000,
        "voltage": 230
    }
}


@router.get("/appliances")
def get_appliances():
    return APPLIANCES


@router.get("/appliances/{appliance_id}")
def get_appliance(appliance_id: str):
    return APPLIANCES.get(appliance_id)