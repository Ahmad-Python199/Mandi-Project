import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  ReferenceLine, 
  Area, 
  ComposedChart 
} from "recharts";
import { formatDate, formatCurrency } from "@/src/lib/utils";

interface Props {
  historical: any[];
  predicted: any[];
}

export default function PriceLineChart({ historical, predicted }: Props) {
  // Merge data for the chart
  const data = [
    ...historical.map(d => ({ ...d, type: 'historical' })),
    ...predicted.map(d => ({ ...d, type: 'predicted' }))
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="rounded-xl border border-amber-100 bg-white p-3 shadow-xl ring-1 ring-black/5">
          <p className="text-xs font-bold text-gray-400">{formatDate(label)}</p>
          <p className="text-lg font-black text-primary">{formatCurrency(dataPoint.price)}</p>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
            {dataPoint.type === 'historical' ? '• Historical' : '• Prediction'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[400px] w-full pt-4">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}
            tick={{ fontSize: 10, fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fontWeight: 500 }}
            tickFormatter={(val) => `₨${val}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="top" 
            align="right" 
            iconType="circle"
            wrapperStyle={{ paddingBottom: 20, fontSize: 12, fontWeight: 600 }}
          />
          
          {/* Confidence Interval Area */}
          <Area
            type="monotone"
            dataKey="confidence_high"
            data={predicted}
            stroke="none"
            fill="#16a34a"
            fillOpacity={0.05}
            connectNulls
            activeDot={false}
            tooltipType="none"
          />
          <Area
            type="monotone"
            dataKey="confidence_low"
            data={predicted}
            stroke="none"
            fill="#fffbeb"
            fillOpacity={1}
            connectNulls
            activeDot={false}
            tooltipType="none"
          />

          {/* Historical Line */}
          <Line 
            type="monotone" 
            data={historical}
            dataKey="price" 
            stroke="#1d4ed8" /* blue-700 */
            strokeWidth={3}
            dot={false}
            animationDuration={1500}
            name="Historical Price"
          />

          {/* Predicted Line */}
          <Line 
            type="monotone" 
            data={predicted}
            dataKey="price" 
            stroke="#16a34a" /* green-600 */
            strokeWidth={3}
            strokeDasharray="5 5"
            dot={false}
            animationDuration={1500}
            name="Predicted Price"
          />

          <ReferenceLine 
            x={historical[historical.length - 1]?.date} 
            stroke="#94a3b8" 
            strokeDasharray="3 3" 
            label={{ position: 'top', value: 'Today / آج', fill: '#64748b', fontSize: 10, fontWeight: 700 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
