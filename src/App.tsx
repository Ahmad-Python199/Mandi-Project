import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import PredictPage from "./pages/PredictPage";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-mandi-bg">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/predict" element={<PredictPage />} />
          </Routes>
        </main>
        <footer className="mt-20 border-t border-amber-200 bg-white py-12">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <p className="text-sm font-bold text-gray-400">© {new Date().getFullYear()} MandiRate (منڈی ریٹ). All rights reserved.</p>
            <p className="mt-2 text-xs text-gray-400">Agricultural data for educational purposes based on AI analysis.</p>
          </div>
        </footer>
        <Toaster position="bottom-right" />
      </div>
    </Router>
  );
}
