import { Loader2 } from "lucide-react";

export default function LoadingSpinner() {
  return (
    <div className="flex h-64 w-full flex-col items-center justify-center gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <div className="flex flex-col items-center">
        <p className="text-sm font-medium text-gray-500">Loading market data...</p>
        <p className="urdu-text text-lg font-bold text-primary">ڈیٹا لوڈ ہو رہا ہے...</p>
      </div>
    </div>
  );
}
