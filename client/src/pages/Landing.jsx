import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Megaphone, Image as ImageIcon, MessageSquare } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const Landing = () => {
  return (
    <div className="flex flex-col items-center justify-center pt-20 px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-[var(--color-secondary)] mb-8">
          <Sparkles size={16} />
          <span>Powered by Google Gemini AI</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Create Powerful Advertising Campaigns with <span className="text-gradient">AI</span>
        </h1>

        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          Generate platform-ready advertisements, strategies, headlines and creative ideas in seconds with Gemini AI.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/signup">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary px-8 py-4 rounded-full font-bold text-lg shadow-[0_0_30px_rgba(108,99,255,0.4)] w-full sm:w-auto"
            >
              Start Free
            </motion.button>
          </Link>
          <button className="px-8 py-4 rounded-full font-bold text-lg bg-white/5 border border-white/10 hover:bg-white/10 transition w-full sm:w-auto">
            Watch Demo
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 max-w-6xl w-full pb-20">
        <GlassCard className="text-left hover:border-[var(--color-secondary)] transition-colors duration-300">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-6 border border-white/10">
            <ImageIcon className="text-[var(--color-secondary)]" size={28} />
          </div>
          <h3 className="text-2xl font-bold mb-3">Poster Generator</h3>
          <p className="text-gray-400">Instantly generate high-converting poster copy and visual prompts for any product or industry.</p>
        </GlassCard>

        <GlassCard className="text-left hover:border-[var(--color-primary)] transition-colors duration-300">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-6 border border-white/10">
            <Megaphone className="text-[var(--color-primary)]" size={28} />
          </div>
          <h3 className="text-2xl font-bold mb-3">Slogan Generator</h3>
          <p className="text-gray-400">Craft the perfect tagline with our fine-tuned AI. Choose your tone and audience for maximum impact.</p>
        </GlassCard>

        <GlassCard className="text-left hover:border-[var(--color-accent)] transition-colors duration-300">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500/20 to-orange-500/20 flex items-center justify-center mb-6 border border-white/10">
            <MessageSquare className="text-[var(--color-accent)]" size={28} />
          </div>
          <h3 className="text-2xl font-bold mb-3">AI Strategist</h3>
          <p className="text-gray-400">Chat with your personal marketing expert. Get campaign ideas, SEO tips, and growth hacks on demand.</p>
        </GlassCard>
      </div>
    </div>
  );
};

export default Landing;
