import { Calendar, Info } from "lucide-react";
import { formatCurrency } from "@/src/lib/utils";
import { motion } from "motion/react";

interface Props {
  price: number;
  change: number;
  changePerc: string;
}

export default function CurrentPriceBanner({ price, change, changePerc }: Props) {
  const isUp = change >= 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl border border-amber-200 bg-white p-6 shadow-xl sm:p-8"
    >
      <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-amber-50 opacity-50" />
      
      <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500 uppercase tracking-wider">
            <Info size={16} className="text-amber-500" />
            Current Market Price
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <h2 className="text-5xl font-black text-gray-900 sm:text-6xl">
              {formatCurrency(price)}
            </h2>
            <span className="text-lg font-medium text-gray-500">/ 40kg</span>
          </div>
          <div className="urdu-text mt-1 text-2xl font-bold text-primary">
            موجودہ قیمت فی من
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className={cn(
            "flex items-center gap-1 rounded-full px-4 py-1 text-sm font-bold shadow-sm",
            isUp ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          )}>
            {isUp ? "+" : ""}{formatCurrency(change)} ({changePerc})
            <span className="ml-1">{isUp ? "↑" : "↓"}</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
            <Calendar size={14} />
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

import { cn } from "@/src/lib/utils";
