import { BellRing, Trash2, CheckCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { formatCurrency } from "@/src/lib/utils";

interface Alert {
  id: string;
  price: number;
  type: "above" | "below";
  createdAt: string;
}

export default function PriceAlertSetup() {
  const [alertPrice, setAlertPrice] = useState("");
  const [alertType, setAlertType] = useState<"above" | "below">("above");
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const handleSetAlert = () => {
    if (!alertPrice || isNaN(Number(alertPrice))) {
      toast.error("Please enter a valid price");
      return;
    }

    const newAlert: Alert = {
      id: Math.random().toString(36).substr(2, 9),
      price: Number(alertPrice),
      type: alertType,
      createdAt: new Date().toISOString()
    };

    setAlerts([newAlert, ...alerts]);
    setAlertPrice("");
    toast.success(
      <div className="flex flex-col">
        <span className="font-bold">Alert Set Successfully</span>
        <span className="urdu-text text-sm">الرٹ کامیابی سے سیٹ ہو گیا ہے</span>
      </div>,
      { duration: 4000 }
    );
  };

  const removeAlert = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id));
    toast("Alert removed", { icon: <Trash2 className="text-gray-400" size={16} /> });
  };

  return (
    <div className="rounded-3xl border border-amber-200 bg-white p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-primary">
          <BellRing size={20} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Price Alerts</h3>
          <p className="urdu-text -mt-2 text-primary font-bold text-lg">قیمت کے الرٹس</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Set Alert Price (PKR)</label>
          <input 
            type="number"
            value={alertPrice}
            onChange={(e) => setAlertPrice(e.target.value)}
            placeholder="e.g. 3500"
            className="w-full rounded-xl border border-amber-200 bg-amber-50/30 px-4 py-3 font-bold text-gray-900 focus:border-primary focus:outline-none focus:ring-4 focus:ring-amber-500/10"
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Condition</label>
          <select 
            value={alertType}
            onChange={(e) => setAlertType(e.target.value as any)}
            className="w-full rounded-xl border border-amber-200 bg-amber-50/30 px-4 py-3 font-bold text-gray-900 focus:border-primary focus:outline-none focus:ring-4 focus:ring-amber-500/10"
          >
            <option value="above">When price goes ABOVE</option>
            <option value="below">When price goes BELOW</option>
          </select>
        </div>
        <div className="flex items-end">
          <button 
            onClick={handleSetAlert}
            className="w-full sm:w-auto rounded-xl bg-primary px-8 py-3.5 text-sm font-black text-white shadow-lg transition-all hover:bg-primary-dark active:scale-95"
          >
            Set Alert / الرٹ سیٹ کریں
          </button>
        </div>
      </div>

      {alerts.length > 0 && (
        <div className="border-t border-gray-100 pt-6">
          <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Active Alerts</h4>
          <div className="flex flex-wrap gap-3">
            {alerts.map((alert) => (
              <div 
                key={alert.id}
                className="flex items-center gap-3 rounded-2xl border border-amber-100 bg-amber-50/40 px-4 py-3 shadow-sm"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-primary">
                  <BellRing size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                    {alert.type === 'above' ? 'Alert if >' : 'Alert if <'}
                  </p>
                  <p className="text-sm font-black text-gray-900 leading-none">{formatCurrency(alert.price)}</p>
                </div>
                <button 
                  onClick={() => removeAlert(alert.id)}
                  className="ml-2 text-gray-300 transition-colors hover:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {alerts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-4 text-center">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 text-gray-300">
            <BellRing size={20} />
          </div>
          <p className="text-xs font-bold text-gray-400">No active alerts set</p>
        </div>
      )}
    </div>
  );
}
