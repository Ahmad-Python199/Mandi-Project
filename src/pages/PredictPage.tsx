import { useState, useEffect } from "react";
import FilterPanel from "@/src/components/FilterPanel";
import CurrentPriceBanner from "@/src/components/CurrentPriceBanner";
import SummaryCards from "@/src/components/SummaryCards";
import PriceLineChart from "@/src/components/PriceLineChart";
import AIAnalysisCard from "@/src/components/AIAnalysisCard";
import PriceDataTable from "@/src/components/PriceDataTable";
import PriceAlertSetup from "@/src/components/PriceAlertSetup";
import CropComparisonChart from "@/src/components/CropComparisonChart";
import LoadingSpinner from "@/src/components/LoadingSpinner";
import { api } from "@/src/services/api";
import { getMarketAnalysis, MarketAnalysis } from "@/src/services/geminiService";
import { toast } from "react-hot-toast";
import { motion } from "motion/react";
import { AlertTriangle, Bot } from "lucide-react";
import { cn } from "@/src/lib/utils";

export default function PredictPage() {
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [analysis, setAnalysis] = useState<MarketAnalysis | null>(null);
  const [comparisonData, setComparisonData] = useState<any[]>([]);

  const geminiKey = process.env.GEMINI_API_KEY;
  const openrouterKey = process.env.OPENROUTER_API_KEY;
  const hasKeys = !!geminiKey || !!openrouterKey;

  const [provider, setProvider] = useState<"gemini" | "openrouter">(() => {
    if (openrouterKey && !geminiKey) return "openrouter";
    return "gemini";
  });

  const loadAIAnalysis = async (resultData: any, activeProvider: "gemini" | "openrouter") => {
    if (!resultData) return;
    setAiLoading(true);
    try {
      const aiResult = await getMarketAnalysis(
        resultData.crop, 
        resultData.city, 
        resultData.current_price, 
        resultData.summary.best_selling_price, 
        resultData.summary.trend, 
        resultData.summary.percentage_change,
        activeProvider
      );
      setAnalysis(aiResult);
    } catch (err) {
      toast.error("Failed to load AI market analysis.");
    } finally {
      setAiLoading(false);
    }
  };

  const handlePredict = async (crop: string, city: string, days: number) => {
    setLoading(true);
    setAnalysis(null);
    try {
      const result = await api.predictPrices(crop, city, days);
      setData(result);
      if (hasKeys) {
        await loadAIAnalysis(result, provider);
      }
    } catch (err) {
      toast.error("Failed to load predictions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial call
    handlePredict("wheat", "lahore", 30);
    
    // Load comparison data
    async function loadComp() {
      const res = await api.getAllCropPrices("lahore");
      setComparisonData(res);
    }
    loadComp();
  }, []);

  // Trigger AI analysis when provider changes (if data is already loaded)
  useEffect(() => {
    if (data && !loading && hasKeys) {
      loadAIAnalysis(data, provider);
    }
  }, [provider]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Price Predictor</h1>
          <p className="urdu-text -mt-2 text-primary font-bold text-2xl">قیمت کی پیشن گوئی</p>
        </div>

        {/* AI Provider selector */}
        {hasKeys && (
          <div className="flex items-center gap-2 bg-amber-50/50 p-1 rounded-2xl border border-amber-200/60 shadow-sm self-start">
            <button
              onClick={() => setProvider("gemini")}
              disabled={!geminiKey}
              className={cn(
                "px-4 py-2 text-xs font-black rounded-xl transition-all uppercase tracking-wider",
                provider === "gemini" 
                  ? "bg-primary text-white shadow-md" 
                  : "text-gray-500 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
              )}
            >
              Gemini
            </button>
            <button
              onClick={() => setProvider("openrouter")}
              disabled={!openrouterKey}
              className={cn(
                "px-4 py-2 text-xs font-black rounded-xl transition-all uppercase tracking-wider",
                provider === "openrouter" 
                  ? "bg-primary text-white shadow-md" 
                  : "text-gray-500 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
              )}
            >
              OpenRouter
            </button>
          </div>
        )}
      </div>

      {!hasKeys && (
        <div className="mb-8 p-5 rounded-3xl bg-red-50 border border-red-200 text-red-900 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600 shrink-0">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h4 className="font-bold text-base">AI Analysis Disabled</h4>
            <p className="text-sm text-red-700 mt-0.5">
              Please add a <code>GEMINI_API_KEY</code> or <code>OPENROUTER_API_KEY</code> to your <code>.env</code> file to enable AI Market Analysis.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-8">
        <FilterPanel onPredict={handlePredict} loading={loading} />

        {loading && <LoadingSpinner />}

        {!loading && data && (
          <div className="flex flex-col gap-10">
            {/* Main Price Row */}
            <CurrentPriceBanner 
              price={data.current_price} 
              change={data.price_change_today} 
              changePerc={data.price_change_percent} 
            />

            {/* Summary Grid */}
            <SummaryCards data={data.summary} />

            {/* Main Visuals Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Chart Card */}
              <div className="lg:col-span-2 rounded-3xl border border-amber-200 bg-white p-6 shadow-lg">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Price Trend Chart</h3>
                  <p className="urdu-text -mt-2 text-primary font-bold text-lg">قیمت کا گراف</p>
                </div>
                <PriceLineChart 
                  historical={data.historical_prices} 
                  predicted={data.predicted_prices} 
                />
              </div>

              {/* Sidebar: Alerts & Comp */}
              <div className="flex flex-col gap-8">
                <PriceAlertSetup />
                <CropComparisonChart data={comparisonData} />
              </div>
            </div>

            {/* AI Analysis (display card if keys are configured, passing the loading state) */}
            {hasKeys && (
              <AIAnalysisCard analysis={analysis} loading={aiLoading} />
            )}

            {/* Data Table */}
            <div className="rounded-3xl border border-amber-200 bg-white p-6 shadow-lg">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900">Historical & Predicted Prices</h3>
                <p className="urdu-text -mt-2 text-primary font-bold text-lg">تاریخی اور متوقع قیمتیں</p>
              </div>
              <PriceDataTable 
                historical={data.historical_prices} 
                predicted={data.predicted_prices} 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
