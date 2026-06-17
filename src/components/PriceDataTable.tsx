import { TrendingUp, TrendingDown, Download, Minus } from "lucide-react";
import { useState } from "react";
import { formatDate, formatCurrency } from "@/src/lib/utils";

interface Props {
  historical: any[];
  predicted: any[];
}

export default function PriceDataTable({ historical, predicted }: Props) {
  const [view, setView] = useState<"historical" | "predicted">("predicted");

  const data = view === "historical" ? [...historical].reverse().slice(0, 30) : predicted;

  const downloadCSV = () => {
    const headers = ["Date", "Price (PKR)", "Change", "Trend"];
    const rows = data.map(d => [
      d.date, 
      d.price, 
      d.change ?? 0, 
      d.trend ?? (d.price > data[0]?.price ? "up" : "down")
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `mandi_rates_${view}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2 rounded-xl bg-amber-100 p-1">
          <button 
            onClick={() => setView("historical")}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-bold transition-all",
              view === "historical" ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-primary"
            )}
          >
            Historical
          </button>
          <button 
            onClick={() => setView("predicted")}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-bold transition-all",
              view === "predicted" ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-primary"
            )}
          >
            Predicted
          </button>
        </div>

        <button 
          onClick={downloadCSV}
          className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-600 transition-all hover:bg-gray-50 active:scale-95"
        >
          <Download size={16} />
          <span>CSV</span>
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-amber-50">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">تاریخ (Date)</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">قیمت (Price PKR)</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">تبدیلی (Change)</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">رجحان (Trend)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-amber-50">
            {data.map((row, idx) => {
              const prev = idx < data.length - 1 ? data[idx + 1] : null;
              const change = row.change ?? (prev ? row.price - prev.price : 0);
              const isUp = change > 0;
              const isStable = change === 0;

              return (
                <tr key={row.date} className="hover:bg-amber-50/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-gray-700">{formatDate(row.date)}</td>
                  <td className="px-6 py-4 text-sm font-black text-gray-900">{formatCurrency(row.price)}</td>
                  <td className={cn(
                    "px-6 py-4 text-sm font-bold text-center",
                    isStable ? "text-gray-400" : isUp ? "text-green-600" : "text-red-600"
                  )}>
                    {isStable ? "-" : (isUp ? "+" : "") + formatCurrency(change)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      {isStable ? (
                        <Minus size={18} className="text-gray-400" />
                      ) : isUp ? (
                        <TrendingUp size={18} className="text-green-600" />
                      ) : (
                        <TrendingDown size={18} className="text-red-600" />
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { cn } from "@/src/lib/utils";
