import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/src/services/api";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface FilterProps {
  onPredict: (crop: string, city: string, days: number) => void;
  loading: boolean;
}

export default function FilterPanel({ onPredict, loading }: FilterProps) {
  const [crops, setCrops] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  
  const [selectedCrop, setSelectedCrop] = useState("wheat");
  const [selectedCity, setSelectedCity] = useState("lahore");
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [period, setPeriod] = useState(30);

  useEffect(() => {
    async function load() {
      const [cropRes, cityRes] = await Promise.all([
        api.getCrops(),
        api.getCities()
      ]);
      setCrops(cropRes);
      setCities(cityRes);
    }
    load();
  }, []);

  const handlePredict = () => {
    onPredict(selectedCrop, selectedCity, period);
  };

  return (
    <div className="rounded-3xl border border-amber-200 bg-white p-6 shadow-lg">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {/* Crop Select */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Select Crop / فصل منتخب کریں</label>
          <select 
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="w-full rounded-xl border border-amber-200 bg-amber-50/30 px-4 py-3 font-medium transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-amber-500/10"
          >
            {crops.map((c) => (
              <option key={c.id} value={c.id}>
                {c.emoji} {c.name} / {c.urdu}
              </option>
            ))}
          </select>
        </div>

        {/* City Select */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Mandi/City / منڈی یا شہر</label>
          <select 
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full rounded-xl border border-amber-200 bg-amber-50/30 px-4 py-3 font-medium transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-amber-500/10"
          >
            {cities.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Start Date */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Analysis From / تاریخ سے</label>
          <DatePicker 
            selected={startDate} 
            onChange={(date) => setStartDate(date)} 
            className="w-full rounded-xl border border-amber-200 bg-amber-50/30 px-4 py-3 font-medium transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-amber-500/10"
          />
        </div>

        {/* Prediction Period */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Predict for / مدت</label>
          <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50/30 p-1">
            {[7, 14, 30].map((d) => (
              <button
                key={d}
                onClick={() => setPeriod(d)}
                className={cn(
                  "flex-1 rounded-lg py-2 text-sm font-bold transition-all",
                  period === d ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-primary"
                )}
              >
                {d}d
              </button>
            ))}
          </div>
        </div>
      </div>

      <button 
        onClick={handlePredict}
        disabled={loading}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-secondary py-4 text-lg font-black text-white shadow-xl transition-all hover:bg-green-700 hover:shadow-2xl active:scale-[0.98] disabled:opacity-50"
      >
        <Search size={24} />
        قیمت پیش کریں - Predict Price
      </button>
    </div>
  );
}

import { cn } from "@/src/lib/utils";
