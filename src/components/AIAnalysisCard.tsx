import { Bot, Sparkles, CheckCircle2, AlertCircle, HelpCircle } from "lucide-react";
import { MarketAnalysis } from "@/src/services/geminiService";
import { motion } from "motion/react";

interface AIAnalysisCardProps {
  analysis: MarketAnalysis | null;
  loading?: boolean;
}

export default function AIAnalysisCard({ analysis, loading }: AIAnalysisCardProps) {
  if (loading) {
    return (
      <div className="rounded-3xl border border-primary/20 bg-white p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Bot size={120} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6 animate-pulse">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-200 text-gray-400">
              <Bot size={24} />
            </div>
            <div>
              <div className="h-5 w-40 bg-gray-200 rounded-md mb-2"></div>
              <div className="h-4 w-24 bg-gray-200 rounded-md"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="h-4 w-32 bg-gray-200 rounded-md"></div>
              <div className="h-3 w-full bg-gray-200 rounded-md"></div>
              <div className="h-3 w-5/6 bg-gray-200 rounded-md"></div>
            </div>
            <div className="space-y-3">
              <div className="h-4 w-32 bg-gray-200 rounded-md ml-auto"></div>
              <div className="h-3 w-full bg-gray-200 rounded-md"></div>
              <div className="h-3 w-5/6 bg-gray-200 rounded-md ml-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-primary/20 bg-white p-6 shadow-xl overflow-hidden relative"
    >
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <Bot size={120} />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-md">
              <Bot size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">AI Market Analysis</h3>
              <p className="urdu-text -mt-2 text-primary font-bold text-lg">AI مارکیٹ تجزیہ</p>
            </div>
          </div>
          {analysis.provider && (
            <span className={cn(
              "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border",
              analysis.provider === "openrouter" 
                ? "bg-purple-50 text-purple-700 border-purple-200" 
                : "bg-blue-50 text-blue-700 border-blue-200"
            )}>
              {analysis.provider === "openrouter" ? "OpenRouter" : "Gemini"}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-400 uppercase tracking-widest">
              <Sparkles size={14} className="text-amber-500" />
              Analysis (English)
            </div>
            <p className="text-gray-700 leading-relaxed text-sm">
              {analysis.analysis_en}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-400 uppercase tracking-widest justify-end">
              تجزیہ (اردو)
              <Sparkles size={14} className="text-amber-500" />
            </div>
            <p className="urdu-text text-xl text-gray-800 text-right leading-loose">
              {analysis.analysis_ur}
            </p>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Key Market Factors</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {analysis.key_factors.map((factor, idx) => (
              <div key={idx} className="bg-gray-50 rounded-2xl p-4 border border-gray-100 transition-hover hover:border-primary/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-900">{factor.factor}</span>
                  {factor.impact === 'positive' ? (
                    <CheckCircle2 size={16} className="text-green-500" />
                  ) : factor.impact === 'negative' ? (
                    <AlertCircle size={16} className="text-red-500" />
                  ) : (
                    <HelpCircle size={16} className="text-amber-500" />
                  )}
                </div>
                <p className="text-[10px] leading-tight text-gray-500 font-medium">{factor.detail}</p>
                <div className={cn(
                  "mt-2 text-[9px] font-black uppercase tracking-tighter inline-block px-2 py-0.5 rounded-full",
                  factor.impact === 'positive' ? "bg-green-100 text-green-700" :
                  factor.impact === 'negative' ? "bg-red-100 text-red-700" :
                  "bg-amber-100 text-amber-700"
                )}>
                  {factor.impact}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

import { cn } from "@/src/lib/utils";
