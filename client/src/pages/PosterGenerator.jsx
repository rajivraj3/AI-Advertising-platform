import { useState } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Loader, Download, Save, Wand2 } from 'lucide-react';
import api from '../api/axios';
import GlassCard from '../components/GlassCard';

const PosterGenerator = () => {
  const [formData, setFormData] = useState({
    brandName: '',
    productName: '',
    industry: '',
    targetAudience: '',
    colorTheme: '',
    posterStyle: 'Minimalist',
    campaignGoal: ''
  });
  const [posterData, setPosterData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generatePoster = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/generate-poster', formData);
      setPosterData(res.data);
    } catch (error) {
      console.error('Error generating poster', error);
      alert('Failed to generate poster. Ensure API key is set.');
    }
    setLoading(false);
  };

  const savePoster = async () => {
    try {
      await api.post('/save', {
        type: 'poster',
        title: `Poster for ${formData.productName}`,
        content: posterData
      });
      alert('Poster details saved to dashboard!');
    } catch (error) {
      alert('Failed to save poster');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <ImageIcon className="text-[var(--color-secondary)]" />
          AI Poster Generator
        </h1>
        <p className="text-gray-400 mt-2">Generate poster copy and a stunning visual prompt for your ad.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-5">
          <GlassCard>
            <form onSubmit={generatePoster} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Brand Name</label>
                  <input type="text" name="brandName" onChange={handleChange} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[var(--color-secondary)]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Product Name</label>
                  <input type="text" name="productName" onChange={handleChange} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[var(--color-secondary)]" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Industry</label>
                <input type="text" name="industry" onChange={handleChange} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[var(--color-secondary)]" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Target Audience</label>
                <input type="text" name="targetAudience" onChange={handleChange} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[var(--color-secondary)]" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Color Theme</label>
                  <input type="text" name="colorTheme" placeholder="e.g. Neon Cyberpunk" onChange={handleChange} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[var(--color-secondary)]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Style</label>
                  <select name="posterStyle" onChange={handleChange} className="w-full bg-[var(--color-dark-bg)] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[var(--color-secondary)]">
                    <option value="Minimalist">Minimalist</option>
                    <option value="Cinematic">Cinematic</option>
                    <option value="Retro 80s">Retro 80s</option>
                    <option value="Cyberpunk">Cyberpunk</option>
                    <option value="Corporate">Corporate</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Campaign Goal</label>
                <input type="text" name="campaignGoal" placeholder="e.g. Black Friday Sale 50% Off" onChange={handleChange} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[var(--color-secondary)]" />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 mt-6 text-white shadow-[0_0_20px_rgba(0,212,255,0.4)]"
                style={{ background: 'linear-gradient(135deg, var(--color-secondary) 0%, var(--color-primary) 100%)' }}
              >
                {loading ? <Loader className="animate-spin" size={20} /> : <><Wand2 size={20} /> Generate Design Concept</>}
              </motion.button>
            </form>
          </GlassCard>
        </div>

        {/* Preview Section */}
        <div className="lg:col-span-7">
          {posterData ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {/* Fake Poster Visual Representation */}
              <div 
                className="w-full aspect-[4/5] rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden group shadow-2xl"
                style={{ 
                  background: `linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)`,
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                <div className="absolute inset-0 bg-black/40 z-0"></div>
                {/* Simulated visual background prompt overlay */}
                <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay"></div>
                
                <div className="relative z-10 flex justify-between items-start">
                  <span className="font-bold text-xl uppercase tracking-widest text-white/80">{formData.brandName || 'BRAND'}</span>
                </div>

                <div className="relative z-10 text-center space-y-4">
                  <h2 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 drop-shadow-lg leading-tight uppercase">
                    {posterData.headline}
                  </h2>
                  <p className="text-xl md:text-2xl font-medium text-gray-200 max-w-lg mx-auto drop-shadow">
                    {posterData.subheadline}
                  </p>
                </div>

                <div className="relative z-10 flex justify-center">
                  <button className="px-8 py-4 bg-white text-black font-bold text-lg rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] uppercase tracking-wider">
                    {posterData.cta || 'Shop Now'}
                  </button>
                </div>
              </div>

              <GlassCard>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg flex items-center gap-2"><ImageIcon size={18}/> Visual Generation Prompt</h3>
                  <div className="flex gap-2">
                    <button onClick={savePoster} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition" title="Save Idea"><Save size={18} /></button>
                  </div>
                </div>
                <div className="p-4 bg-black/30 rounded-xl text-gray-300 font-mono text-sm leading-relaxed border border-white/5">
                  {posterData.visualPrompt}
                </div>
                <p className="text-xs text-gray-500 mt-3">* Copy this prompt into Midjourney or DALL-E to generate the actual image background.</p>
              </GlassCard>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-white/10 rounded-2xl">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4 text-gray-500">
                <ImageIcon size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-400">Awaiting Input</h3>
              <p className="text-gray-500 mt-2 max-w-sm">Define your campaign parameters to see the AI construct a conceptual poster design and ad copy.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PosterGenerator;
