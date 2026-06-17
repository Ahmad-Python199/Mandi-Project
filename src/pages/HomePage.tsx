import { Wheat, MapPin, Search, ArrowRight, BarChart3, ShieldCheck, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary px-4 py-20 text-white sm:px-6 sm:py-32 lg:px-8">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/20 blur-[120px]" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-primary-dark/30 blur-[80px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col items-center text-center lg:items-start lg:text-left"
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 backdrop-blur-md">
                <span className="flex h-2 w-2 rounded-full bg-amber-400" />
                <span className="text-xs font-black uppercase tracking-[0.2em]">The Future of Farming</span>
              </div>
              
              <h1 className="text-5xl font-black leading-tight sm:text-7xl">
                MandiRate <br /> 
                <span className="urdu-text text-amber-300 text-6xl sm:text-8xl">منڈی ریٹ</span>
              </h1>
              
              <p className="mt-8 max-w-lg text-lg font-medium leading-relaxed text-amber-50/80">
                Revolutionizing Pakistani agriculture with AI-powered price predictions. 
                Get real-time insights for your crops across all major Mandis.
              </p>

              <div className="mt-12 flex flex-col gap-4 sm:flex-row">
                <Link 
                  to="/predict" 
                  className="group flex items-center justify-center gap-3 rounded-2xl bg-white px-8 py-4 text-lg font-black text-primary shadow-2xl transition-all hover:-translate-y-1 hover:bg-amber-50 active:scale-95"
                >
                  <Search size={24} />
                  قیمت چیک کریں - Check Prices
                  <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              {/* Stats Row */}
              <div className="mt-16 flex flex-wrap justify-center gap-8 lg:justify-start">
                <div className="flex flex-col">
                  <span className="text-3xl font-black">10+</span>
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-200/60">Crops</span>
                </div>
                <div className="h-12 w-px bg-white/10" />
                <div className="flex flex-col">
                  <span className="text-3xl font-black">7</span>
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-200/60">Major Cities</span>
                </div>
                <div className="h-12 w-px bg-white/10" />
                <div className="flex flex-col">
                  <span className="text-3xl font-black">AI</span>
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-200/60">Powered</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               className="relative hidden lg:block"
            >
              <div className="relative aspect-square overflow-hidden rounded-[4rem] bg-amber-400 p-8 shadow-2xl ring-1 ring-white/20">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542601906990-b4d3fb773b09?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center mix-blend-overlay opacity-60" />
                <div className="relative flex h-full flex-col justify-end">
                   <div className="rounded-3xl bg-black/30 p-6 backdrop-blur-xl border border-white/10">
                      <p className="text-sm font-bold text-amber-200">Real-time Prediction</p>
                      <h4 className="text-2xl font-black">Wheat Rates: +12% Expected</h4>
                      <BarChart3 className="mt-4 text-white/50" size={120} />
                   </div>
                </div>
              </div>
              
              {/* Floating badges */}
              <div className="absolute -top-6 -left-6 rotate-[-12deg] rounded-2xl bg-white p-4 shadow-xl">
                 <ShieldCheck className="text-secondary" size={32} />
              </div>
              <div className="absolute -bottom-6 -right-6 rotate-[12deg] rounded-2xl bg-secondary p-4 shadow-xl">
                 <Zap className="text-white" size={32} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary">Benefits</h2>
          <h3 className="mt-2 text-4xl font-black text-gray-900">Why Farmers Trust MandiRate</h3>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            { 
              title: "AI Forecasting", 
              desc: "Predict prices up to 30 days in advance with 92% accuracy using machine learning.",
              icon: <Zap className="text-amber-600" />
            },
            { 
              title: "Market Coverage", 
              desc: "Access rates from Lahore, Karachi, Multan and all major trade hubs instantly.",
              icon: <MapPin className="text-amber-600" />
            },
            { 
              title: "Smart Insights", 
              desc: "Receive tailored analysis on when to hold or sell your harvest for maximum profit.",
              icon: <BarChart3 className="text-amber-600" />
            }
          ].map((f, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="rounded-3xl border border-amber-100 bg-white p-8 shadow-sm transition-all hover:shadow-xl"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50">
                {f.icon}
              </div>
              <h4 className="text-xl font-black text-gray-900">{f.title}</h4>
              <p className="mt-4 text-gray-500 leading-relaxed font-medium">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
