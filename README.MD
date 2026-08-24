# ⚡ Smart Electricity Consumption Prediction AI

A machine learning based web application that predicts electricity consumption, calculates appliance-wise energy usage and electricity cost, and provides energy-saving insights.

The project combines **Machine Learning, FastAPI, HTML, CSS, and JavaScript** to create a complete electricity-management application.

---

## 🚀 Features

- ⚡ Electricity consumption calculation
- 💰 Daily and monthly electricity cost calculation
- 🏠 Appliance-wise consumption analysis
- 📊 Electricity consumption dashboard
- 🤖 Machine Learning based electricity consumption prediction
- 💡 Energy-saving recommendations
- 🔌 Appliance power and voltage information
- 🌐 FastAPI backend
- 🎨 Responsive frontend
- 📈 Consumption visualization
- 🔮 Extra Trees Regression model

---

## 🖥️ Application Pages

### 🏠 Home

Introduction and overview of the SmartEnergy application.

### 📊 Dashboard

Displays:

- Total electricity consumption
- Estimated electricity cost
- Average voltage
- Available appliances
- Appliance-wise monthly consumption
- Electricity consumption charts
- Appliance power and voltage information

### 🧮 Calculator

Calculates:

- Daily electricity consumption
- Monthly electricity consumption
- Daily electricity cost
- Monthly electricity cost

The calculation is based on appliance power, usage hours, number of days, and electricity rate.

### 🤖 Prediction

Uses the trained **Extra Trees Regressor** machine learning model to predict electricity consumption.

The prediction uses environmental and lighting-related features from the trained dataset.

### 💡 Savings

Provides energy-saving insights based on appliance usage and electricity consumption.

---

## 🤖 Machine Learning

The project uses an **Extra Trees Regressor** model for electricity consumption prediction.

### Model Features

The trained model uses 27 features:

```text
lights
T1
RH_1
T2
RH_2
T3
RH_3
T4
RH_4
T5
RH_5
T6
RH_6
T7
RH_7
T8
RH_8
T9
RH_9
T_out
Press_mm_hg
RH_out
Windspeed
Visibility
Tdewpoint
rv1
rv2