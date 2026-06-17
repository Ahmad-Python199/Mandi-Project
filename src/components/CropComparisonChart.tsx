import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from "recharts";
import { formatCurrency } from "@/src/lib/utils";

export default function CropComparisonChart({ data }: { data: any[] }) {
  const sortedData = [...data].sort((a, b) => b.price - a.price);

  return (
    <div className="rounded-3xl border border-amber-200 bg-white p-6 shadow-lg">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900">Crop Comparison</h3>
        <p className="urdu-text -mt-2 text-primary font-bold text-lg">فصلوں کا موازنہ</p>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sortedData} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f3f4f6" />
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fontWeight: 700, fill: '#6b7280' }}
              width={70}
            />
            <Tooltip 
              cursor={{ fill: 'rgba(217, 119, 6, 0.05)' }}
              content={({ active, payload }: any) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-xl border border-amber-100 bg-white p-2 shadow-xl">
                      <p className="text-xs font-bold text-gray-500">{payload[0].payload.name} / {payload[0].payload.urdu}</p>
                      <p className="text-sm font-black text-primary">{formatCurrency(payload[0].value)}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar 
              dataKey="price" 
              radius={[0, 10, 10, 0]} 
              barSize={20}
              animationDuration={2000}
            >
              {sortedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === 0 ? '#b45309' : '#d97706'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <p className="mt-4 text-center text-xs font-bold text-gray-400">
        Prices shown are Current Rates per 40kg
      </p>
    </div>
  );
}
