import { useState } from 'react';
import { motion } from 'framer-motion';
import { Megaphone, Copy, CheckCircle, Loader, Save } from 'lucide-react';
import api from '../api/axios';
import GlassCard from '../components/GlassCard';

const SloganGenerator = () => {
  const [productName, setProductName] = useState('');
  const [tone, setTone] = useState('Professional');
  const [audience, setAudience] = useState('');
  const [slogans, setSlogans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const generateSlogans = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/generate-slogans', { productName, tone, audience });
      setSlogans(res.data.slogans);
    } catch (error) {
      console.error('Error generating slogans', error);
      alert('Failed to generate slogans. Make sure API key is set.');
    }
    setLoading(false);
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const saveSlogans = async () => {
    try {
      await api.post('/save', {
        type: 'slogan',
        title: `Slogans for ${productName}`,
        content: { slogans }
      });
      alert('Slogans saved to dashboard!');
    } catch (error) {
      alert('Failed to save slogans');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Megaphone className="text-[var(--color-primary)]" />
          AI Slogan Generator
        </h1>
        <p className="text-gray-400 mt-2">Generate catchy taglines and slogans for your product.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <GlassCard className="lg:col-span-1 h-fit">
          <form onSubmit={generateSlogans} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Product / Brand Name</label>
              <input 
                type="text" 
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. EcoKicks"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-primary)] transition"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Target Audience</label>
              <input 
                type="text" 
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g. Gen Z, Tech Enthusiasts"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-primary)] transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Tone of Voice</label>
              <select 
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full bg-[var(--color-dark-bg)] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-primary)] transition"
              >
                <option value="Professional">Professional</option>
                <option value="Catchy">Catchy & Short</option>
                <option value="Funny">Funny / Humorous</option>
                <option value="Luxury">Luxury / Premium</option>
                <option value="Emotional">Emotional / Inspiring</option>
              </select>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 rounded-xl font-bold flex items-center justify-center gap-2 mt-4"
            >
              {loading ? <Loader className="animate-spin" size={20} /> : <><Megaphone size={20} /> Generate Slogans</>}
            </motion.button>
          </form>
        </GlassCard>

        <div className="lg:col-span-2">
          {slogans.length > 0 ? (
            <GlassCard>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Generated Results</h2>
                <button onClick={saveSlogans} className="flex items-center gap-2 text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition">
                  <Save size={16} /> Save All
                </button>
              </div>
              <div className="space-y-3">
                {slogans.map((slogan, index) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={index} 
                    className="p-4 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center group hover:border-[var(--color-secondary)] transition"
                  >
                    <p className="text-lg font-medium">{slogan}</p>
                    <button 
                      onClick={() => copyToClipboard(slogan, index)}
                      className="text-gray-400 hover:text-white transition opacity-0 group-hover:opacity-100 p-2"
                    >
                      {copiedIndex === index ? <CheckCircle className="text-green-400" size={20} /> : <Copy size={20} />}
                    </button>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-white/10 rounded-2xl">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4 text-gray-500">
                <Megaphone size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-400">Ready to brainstorm?</h3>
              <p className="text-gray-500 mt-2 max-w-sm">Fill out the form on the left to generate AI-powered slogans tailored to your audience.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SloganGenerator;
