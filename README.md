# 🌾 Mandi Rate (منڈی ریٹ) - Price Predictor & AI Analyst

Mandi Rate is a premium, modern web application designed for the Pakistani agricultural sector. It predicts crop market prices (e.g., wheat, rice, corn) across various local mandis (Lahore, Karachi, Faisalabad, Multan) and provides AI-powered market trend analysis in both English and Urdu.

---

> [!IMPORTANT]
> ⚠️ **MANDATORY STEP: YOU MUST CREATE A `.env` FILE AND SET UP YOUR API KEY BEFORE RUNNING THE APP!**  
> (The AI Market Analysis feature requires a configured API key to function. Please follow Step 1 of the Setup guide below first.)

---

## ✨ Features

- **📈 Price Trend Charts**: Visualize historical and predicted price trends using interactive charts.
- **🔮 Price Predictor**: Select crop, city/mandi, and prediction periods (7, 14, or 30 days) to forecast price movements.
- **🤖 Dual-Engine AI Analysis**: 
  - Get deep-dive market insights (weather, seasons, supply-demand, policies).
  - Generates analysis in both **English** and **Urdu (Noto Nastaliq script style)**.
  - Supports **Gemini API** and **OpenRouter API** with an inline toggle switch in the UI.
- **📊 Crop Comparison**: Compare prices of all crops in a mandi at a glance.
- **🔔 Price Alerts**: Set up custom price notifications to stay updated on market changes.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS (v4), Motion (Framer Motion), Recharts, Lucide Icons
- **Backend**: Node.js, Express (API routes & server)
- **AI Models**: Google Gemini (via `@google/genai` SDK) & OpenRouter API (via fetch calls)

---

## 🚀 Setup & Installation

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### 1. Configure Environment Variables (Mandatory Step ⚠️)
First, create a `.env` file in the root folder of the project (or copy/rename `.env.example` to `.env`):
```bash
cp .env.example .env
