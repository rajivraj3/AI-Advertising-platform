import { motion } from 'framer-motion';
import { PieChart as PieChartIcon, Activity, ArrowUpRight, Users, Target, MousePointerClick } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const Analytics = () => {
  const cards = [
    { title: "Campaign ROI Estimate", value: "324%", trend: "+14%", icon: Activity, color: "text-green-400" },
    { title: "Predicted Reach", value: "1.2M", trend: "+5.2%", icon: Users, color: "text-blue-400" },
    { title: "Engagement Rate", value: "8.4%", trend: "+1.1%", icon: MousePointerClick, color: "text-purple-400" },
    { title: "Conversion Goal", value: "92%", trend: "On Track", icon: Target, color: "text-pink-400" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <PieChartIcon className="text-[var(--color-primary)]" />
            Analytics Dashboard
          </h1>
          <p className="text-gray-400 mt-2">AI-driven predictions for your generated campaigns.</p>
        </div>
        <button className="bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-lg font-medium transition flex items-center gap-2">
          Last 30 Days
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard className="relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition duration-500 transform group-hover:scale-110">
                <card.icon size={80} className={card.color} />
              </div>
              <p className="text-gray-400 text-sm font-medium mb-1 relative z-10">{card.title}</p>
              <h2 className="text-3xl font-bold text-white mb-2 relative z-10">{card.value}</h2>
              <div className="flex items-center gap-1 text-sm font-medium text-green-400 relative z-10">
                <ArrowUpRight size={16} />
                <span>{card.trend}</span>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassCard className="min-h-[400px] flex flex-col">
          <h3 className="text-xl font-bold mb-6">Generated Content Breakdown</h3>
          <div className="flex-1 flex items-center justify-center relative">
            {/* Fake Donut Chart via CSS Conic Gradient */}
            <div className="w-64 h-64 rounded-full border border-white/10 relative flex items-center justify-center shadow-[0_0_50px_rgba(108,99,255,0.2)]"
                 style={{ background: 'conic-gradient(#6C63FF 0% 45%, #00D4FF 45% 75%, #FF4ECD 75% 100%)' }}>
               <div className="w-48 h-48 bg-[var(--color-dark-bg)] rounded-full flex items-center justify-center flex-col">
                  <span className="text-3xl font-bold">216</span>
                  <span className="text-sm text-gray-400">Total Assets</span>
               </div>
            </div>
            
            {/* Legend */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 space-y-4 bg-black/40 p-4 rounded-xl border border-white/10 backdrop-blur-md">
              <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-[#6C63FF]"></div><span className="text-sm">Slogans (45%)</span></div>
              <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-[#00D4FF]"></div><span className="text-sm">Posters (30%)</span></div>
              <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-[#FF4ECD]"></div><span className="text-sm">Campaigns (25%)</span></div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="min-h-[400px] flex flex-col">
          <h3 className="text-xl font-bold mb-6">Platform Performance Prediction</h3>
          <div className="flex-1 flex items-end justify-between gap-4 px-4 pb-8 pt-20 relative">
            <div className="absolute top-10 left-0 right-0 flex justify-between px-4 text-xs text-gray-600 border-b border-white/5 pb-2">
              <span>High Engagement</span>
            </div>
            <div className="absolute top-1/2 left-0 right-0 flex justify-between px-4 text-xs text-gray-600 border-b border-white/5 pb-2">
              <span>Avg Engagement</span>
            </div>
            {/* Bar Chart Mockup */}
            <div className="w-full bg-pink-500/80 hover:bg-pink-400 transition-all rounded-t-md h-[80%] relative group">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-black px-2 py-1 rounded text-xs">Instagram</div>
            </div>
            <div className="w-full bg-blue-500/80 hover:bg-blue-400 transition-all rounded-t-md h-[65%] relative group">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-black px-2 py-1 rounded text-xs">Facebook</div>
            </div>
            <div className="w-full bg-red-500/80 hover:bg-red-400 transition-all rounded-t-md h-[45%] relative group">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-black px-2 py-1 rounded text-xs">YouTube</div>
            </div>
            <div className="w-full bg-green-500/80 hover:bg-green-400 transition-all rounded-t-md h-[95%] relative group">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-black px-2 py-1 rounded text-xs">Google Ads</div>
            </div>
          </div>
          <div className="flex justify-between px-4 text-sm font-medium text-gray-400 mt-2 border-t border-white/10 pt-4">
            <span className="w-full text-center">IG</span>
            <span className="w-full text-center">FB</span>
            <span className="w-full text-center">YT</span>
            <span className="w-full text-center">GOOG</span>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Analytics;
