import { TrendingUp, TrendingDown, Star, BarChart3, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { formatDate, formatCurrency } from "@/src/lib/utils";
import { motion } from "motion/react";

interface SummaryData {
  predicted_high: number;
  predicted_high_date: string;
  predicted_low: number;
  predicted_low_date: string;
  best_selling_date: string;
  best_selling_price: number;
  trend: string;
  trend_urdu: string;
}

export default function SummaryCards({ data }: { data: SummaryData }) {
  const cards = [
    {
      title: "Predicted High",
      urdu: "زیادہ سے زیادہ",
      value: formatCurrency(data.predicted_high),
      sub: formatDate(data.predicted_high_date),
      icon: <TrendingUp className="text-green-600" />,
      bg: "bg-green-50",
      border: "border-green-100"
    },
    {
      title: "Predicted Low",
      urdu: "کم سے کم",
      value: formatCurrency(data.predicted_low),
      sub: formatDate(data.predicted_low_date),
      icon: <TrendingDown className="text-red-600" />,
      bg: "bg-red-50",
      border: "border-red-100"
    },
    {
      title: "Best Selling Day",
      urdu: "بہترین دن",
      value: formatDate(data.best_selling_date),
      sub: `Expected: ${formatCurrency(data.best_selling_price)}`,
      icon: <Star className="text-amber-600" />,
      bg: "bg-amber-50",
      border: "border-amber-100"
    },
    {
      title: "Price Trend",
      urdu: "رجحان",
      value: data.trend.charAt(0).toUpperCase() + data.trend.slice(1),
      sub: data.trend_urdu,
      icon: data.trend === "upward" ? <ArrowUpRight className="text-green-600" /> : 
            data.trend === "downward" ? <ArrowDownRight className="text-red-600" /> : 
            <Minus className="text-gray-600" />,
      bg: "bg-blue-50",
      border: "border-blue-100"
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card, idx) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.1 }}
          className={cn(
            "rounded-2xl border p-4 shadow-sm transition-all hover:shadow-md",
            card.bg,
            card.border
          )}
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="rounded-lg bg-white p-2 shadow-sm">{card.icon}</div>
            <div className="urdu-text text-sm font-bold opacity-60">{card.urdu}</div>
          </div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-tight">{card.title}</p>
          <h3 className="mt-1 text-lg font-bold text-gray-900 sm:text-xl truncate">{card.value}</h3>
          <p className="mt-1 text-xs font-medium text-gray-500">{card.sub}</p>
        </motion.div>
      ))}
    </div>
  );
}

import { cn } from "@/src/lib/utils";
