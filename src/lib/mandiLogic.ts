/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CropInfo {
  name: string;
  urdu: string;
  emoji: string;
  base: number;
}

export const CROP_DATA: Record<string, CropInfo> = {
  wheat: { name: "Wheat", urdu: "گندم", emoji: "🌾", base: 3200 },
  rice: { name: "Rice", urdu: "چاول", emoji: "🍚", base: 5500 },
  cotton: { name: "Cotton", urdu: "کپاس", emoji: "🌿", base: 8000 },
  sugarcane: { name: "Sugarcane", urdu: "گنا", emoji: "🎋", base: 500 },
  maize: { name: "Maize", urdu: "مکئی", emoji: "🌽", base: 2800 },
  onion: { name: "Onion", urdu: "پیاز", emoji: "🧅", base: 4000 },
  tomato: { name: "Tomato", urdu: "ٹماٹر", emoji: "🍅", base: 3500 },
  potato: { name: "Potato", urdu: "آلو", emoji: "🥔", base: 2500 },
  mango: { name: "Mango", urdu: "آم", emoji: "🥭", base: 6000 },
  chili: { name: "Chili", urdu: "مرچ", emoji: "🌶️", base: 15000 },
};

export const CITY_MULTIPLIERS: Record<string, number> = {
  lahore: 1.00,
  karachi: 1.08,
  faisalabad: 0.97,
  multan: 0.95,
  rawalpindi: 1.03,
  peshawar: 1.05,
  quetta: 1.10,
};

export interface PriceData {
  date: string;
  price: number;
  change?: number;
  trend?: "up" | "down" | "stable";
}

export interface PredictedPriceData extends PriceData {
  confidence_low: number;
  confidence_high: number;
}

export function generateHistoricalPrices(crop: string, city: string, days: number = 30): PriceData[] {
  const cropInfo = CROP_DATA[crop.toLowerCase()];
  if (!cropInfo) return [];

  const cityMult = CITY_MULTIPLIERS[city.toLowerCase()] || 1.0;
  const adjustedBase = cropInfo.base * cityMult;
  
  const prices: PriceData[] = [];
  let currentPrice = adjustedBase * (0.90 + Math.random() * 0.05);
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Add realistic daily fluctuation (±3%)
    const fluctuation = (Math.random() * 0.06) - 0.03;
    // Add seasonal trend (slight upward over time)
    const trendValue = 0.001 * (days - i);
    
    currentPrice = currentPrice * (1 + fluctuation + trendValue);
    
    const prevPrice = prices.length > 0 ? prices[prices.length - 1].price : currentPrice;
    const change = currentPrice - prevPrice;

    prices.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(currentPrice),
      change: Math.round(change),
      trend: change > 0 ? "up" : change < 0 ? "down" : "stable"
    });
  }
  
  return prices;
}

export function predictFuturePrices(historical: PriceData[], daysCount: number = 30): PredictedPriceData[] {
  if (historical.length === 0) return [];

  // Simple linear regression (y = mx + b)
  const n = historical.length;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;

  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += historical[i].price;
    sumXY += i * historical[i].price;
    sumX2 += i * i;
  }

  const m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const b = (sumY - m * sumX) / n;

  const predictions: PredictedPriceData[] = [];
  const lastDateStr = historical[historical.length - 1].date;
  const lastDate = new Date(lastDateStr);

  for (let i = 1; i <= daysCount; i++) {
    const nextDate = new Date(lastDate);
    nextDate.setDate(lastDate.getDate() + i);
    
    const x = n + i - 1;
    let predPrice = m * x + b;
    
    // Add some noise and confidence interval
    const noise = (Math.random() * 0.04) - 0.02;
    predPrice = predPrice * (1 + noise);
    
    const confidenceRange = predPrice * 0.05 * (i / daysCount);

    predictions.push({
      date: nextDate.toISOString().split('T')[0],
      price: Math.round(predPrice),
      confidence_low: Math.round(predPrice - confidenceRange),
      confidence_high: Math.round(predPrice + confidenceRange)
    });
  }

  return predictions;
}
