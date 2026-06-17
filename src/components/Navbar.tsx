import { Wheat } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/src/lib/utils";

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-amber-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg">
            <Wheat size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-primary">MandiRate</span>
            <span className="urdu-text -mt-3 text-sm font-medium text-primary">منڈی ریٹ</span>
          </div>
        </Link>

        <div className="flex items-center gap-6">
          <Link 
            to="/" 
            className={cn(
              "text-sm font-semibold transition-colors hover:text-primary",
              location.pathname === "/" ? "text-primary" : "text-gray-600"
            )}
          >
            Home
          </Link>
          <Link 
            to="/predict" 
            className={cn(
              "rounded-full bg-primary px-4 py-2 text-sm font-bold text-white shadow-md transition-all hover:bg-primary-dark hover:shadow-lg active:scale-95",
              location.pathname === "/predict" ? "bg-primary-dark" : ""
            )}
          >
            Check Prices
          </Link>
        </div>
      </div>
    </nav>
  );
}
