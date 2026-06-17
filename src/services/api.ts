import axios from "axios";

export const api = {
  async getCrops() {
    const res = await axios.get("/api/prices/crops");
    return res.data;
  },
  async getCities() {
    const res = await axios.get("/api/prices/cities");
    return res.data;
  },
  async predictPrices(crop: string, city: string, days: number = 30) {
    const res = await axios.post("/api/prices/predict", { crop, city, days });
    return res.data;
  },
  async getHistoricalPrices(crop: string, city: string) {
    const res = await axios.get(`/api/prices/historical?crop=${crop}&city=${city}`);
    return res.data;
  },
  async getAllCropPrices(city: string = "lahore") {
    const res = await axios.get(`/api/prices/all-crops?city=${city}`);
    return res.data;
  }
};
