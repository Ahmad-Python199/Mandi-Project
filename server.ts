import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

import { 
  CROP_DATA, 
  CITY_MULTIPLIERS, 
  generateHistoricalPrices, 
  predictFuturePrices 
} from "./src/lib/mandiLogic.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/prices/crops", (req, res) => {
    res.json(Object.keys(CROP_DATA).map(key => ({
      id: key,
      ...CROP_DATA[key]
    })));
  });

  app.get("/api/prices/cities", (req, res) => {
    res.json(Object.keys(CITY_MULTIPLIERS).map(city => ({
      id: city,
      name: city.charAt(0).toUpperCase() + city.slice(1)
    })));
  });

  app.post("/api/prices/predict", (req, res) => {
    const { crop, city, days = 30 } = req.body;
    
    if (!crop || !city) {
      return res.status(400).json({ error: "Crop and city are required" });
    }

    const cropInfo = CROP_DATA[crop.toLowerCase()];
    if (!cropInfo) return res.status(404).json({ error: "Crop not found" });

    const historical = generateHistoricalPrices(crop, city, 30);
    const predicted = predictFuturePrices(historical, days);

    const currentPrice = historical[historical.length - 1].price;
    const prevPrice = historical[historical.length - 2]?.price || currentPrice;
    const changeToday = currentPrice - prevPrice;
    const changePercent = ((changeToday / prevPrice) * 100).toFixed(1);

    const highPrice = Math.max(...predicted.map(p => p.price));
    const lowPrice = Math.min(...predicted.map(p => p.price));
    const bestSellingDay = predicted.find(p => p.price === highPrice);

    const lastPredicted = predicted[predicted.length - 1].price;
    const totalChange = ((lastPredicted - currentPrice) / currentPrice * 100);
    const trend = totalChange > 1 ? "upward" : totalChange < -1 ? "downward" : "stable";
    const trendUrdu = trend === "upward" ? "اضافہ" : trend === "downward" ? "کمی" : "مستحکم";

    res.json({
      crop: cropInfo.name,
      crop_urdu: cropInfo.urdu,
      city: city.charAt(0).toUpperCase() + city.slice(1),
      unit: "per 40kg (1 Mann)",
      current_price: currentPrice,
      price_change_today: changeToday,
      price_change_percent: (changeToday >= 0 ? "+" : "") + changePercent + "%",
      historical_prices: historical,
      predicted_prices: predicted,
      summary: {
        predicted_high: highPrice,
        predicted_high_date: bestSellingDay?.date,
        predicted_low: lowPrice,
        predicted_low_date: predicted.find(p => p.price === lowPrice)?.date,
        best_selling_date: bestSellingDay?.date,
        best_selling_price: highPrice,
        trend: trend,
        trend_urdu: trendUrdu,
        percentage_change: (totalChange >= 0 ? "+" : "") + totalChange.toFixed(1) + "%"
      }
    });
  });

  app.get("/api/prices/historical", (req, res) => {
    const { crop, city } = req.query;
    if (typeof crop !== 'string' || typeof city !== 'string') return res.status(400).json({ error: "Invalid params" });
    const historical = generateHistoricalPrices(crop, city, 30);
    res.json(historical);
  });

  app.get("/api/prices/all-crops", (req, res) => {
    const { city = "lahore" } = req.query;
    const results = Object.keys(CROP_DATA).map(cropKey => {
      const hist = generateHistoricalPrices(cropKey, city as string, 1);
      return {
        id: cropKey,
        name: CROP_DATA[cropKey].name,
        urdu: CROP_DATA[cropKey].urdu,
        price: hist[hist.length - 1].price,
        emoji: CROP_DATA[cropKey].emoji
      };
    });
    res.json(results);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
