import { useState } from 'react';
import { motion } from 'framer-motion';
import { Megaphone, Save, Loader, Rocket, Sparkles, CheckCircle2 } from 'lucide-react';
import api from '../api/axios';
import GlassCard from '../components/GlassCard';

const initialForm = {
  campaignName: '',
  productName: '',
  businessDescription: '',
  industry: '',
  objective: 'Brand Awareness',
  targetAudience: '',
  location: '',
  platforms: ['Instagram'],
  budget: '',
  duration: '30 days',
  tone: 'Professional'
};

const platformOptions = ['Instagram', 'Facebook', 'Google Ads', 'YouTube', 'LinkedIn', 'X'];
const objectiveOptions = ['Brand Awareness', 'Website Traffic', 'Lead Generation', 'Sales', 'Engagement', 'App Downloads', 'Conversions'];
const toneOptions = ['Professional', 'Friendly', 'Funny', 'Luxury', 'Emotional', 'Bold', 'Casual', 'Gen Z', 'Corporate'];

const CampaignBuilder = () => {
  const [form, setForm] = useState(initialForm);
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const totalSteps = 6;

  const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const togglePlatform = (platform) => {
    setForm(prev => {
      const selected = prev.platforms.includes(platform)
        ? prev.platforms.filter(item => item !== platform)
        : [...prev.platforms, platform];

      return { ...prev, platforms: selected };
    });
  };

  const generateCampaign = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...form,
        platforms: form.platforms.length ? form.platforms : ['Instagram']
      };

      const res = await api.post('/campaigns/generate', payload);
      setCampaign(res.data);
      setStep(totalSteps);
    } catch (error) {
      console.error('Error generating campaign', error);
      alert(error.response?.data?.message || 'Failed to generate campaign.');
    } finally {
      setLoading(false);
    }
  };

  const saveCampaign = async () => {
    try {
      await api.post('/save', {
        type: 'campaign',
        title: form.campaignName || 'Campaign',
        content: campaign
      });
      alert('Campaign saved successfully!');
    } catch (error) {
      alert('Failed to save campaign');
    }
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Campaign Name</label>
              <input value={form.campaignName} onChange={(e) => updateField('campaignName', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" placeholder="Eco Bottle Launch" />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Product / Business Name</label>
              <input value={form.productName} onChange={(e) => updateField('productName', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" placeholder="Eco Bottle" required />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Business Description</label>
              <textarea value={form.businessDescription} onChange={(e) => updateField('businessDescription', e.target.value)} className="w-full min-h-[120px] bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" placeholder="Reusable stainless steel bottle designed for commuters and professionals." required />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Industry</label>
              <input value={form.industry} onChange={(e) => updateField('industry', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" placeholder="Lifestyle" required />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <label className="block text-sm text-gray-300 mb-2">Objective</label>
            <div className="grid grid-cols-2 gap-3">
              {objectiveOptions.map(option => (
                <button key={option} type="button" onClick={() => updateField('objective', option)} className={`rounded-xl border px-3 py-2 text-sm ${form.objective === option ? 'bg-[var(--color-primary)] border-[var(--color-primary)]' : 'border-white/10 bg-white/5 text-gray-200'}`}>
                  {option}
                </button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Target Audience</label>
              <input value={form.targetAudience} onChange={(e) => updateField('targetAudience', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" placeholder="Young professionals, 24-40, urban India" required />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Location</label>
              <input value={form.location} onChange={(e) => updateField('location', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" placeholder="India" />
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <label className="block text-sm text-gray-300 mb-2">Platforms</label>
            <div className="grid grid-cols-2 gap-3">
              {platformOptions.map(platform => (
                <button key={platform} type="button" onClick={() => togglePlatform(platform)} className={`rounded-xl border px-3 py-2 text-sm ${form.platforms.includes(platform) ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] border-transparent' : 'border-white/10 bg-white/5 text-gray-200'}`}>
                  {platform}
                </button>
              ))}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Budget</label>
              <input value={form.budget} onChange={(e) => updateField('budget', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" placeholder="$5000" required />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Duration</label>
              <input value={form.duration} onChange={(e) => updateField('duration', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" placeholder="30 days" />
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-4">
            <label className="block text-sm text-gray-300 mb-2">Brand Tone</label>
            <div className="grid grid-cols-2 gap-3">
              {toneOptions.map(option => (
                <button key={option} type="button" onClick={() => updateField('tone', option)} className={`rounded-xl border px-3 py-2 text-sm ${form.tone === option ? 'bg-[var(--color-secondary)] border-[var(--color-secondary)]' : 'border-white/10 bg-white/5 text-gray-200'}`}>
                  {option}
                </button>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Rocket className="text-[var(--color-primary)]" />
            Ad Campaign Builder
          </h1>
          <p className="text-gray-400 mt-2">Create a complete AI campaign in a few guided steps.</p>
        </div>
        <div className="text-sm text-gray-300">Step {step} / {totalSteps}</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <GlassCard className="lg:col-span-1 h-fit sticky top-28">
          <form onSubmit={generateCampaign} className="space-y-5">
            <div className="flex items-center gap-2 text-[var(--color-secondary)] mb-2">
              <Sparkles size={18} />
              <span className="font-medium">AI Campaign Setup</span>
            </div>

            {renderStep()}

            <div className="flex justify-between pt-2">
              <button type="button" onClick={prevStep} disabled={step === 1} className="px-4 py-2 rounded-xl border border-white/10 text-gray-300 disabled:opacity-40">
                Back
              </button>
              {step < totalSteps ? (
                <button type="button" onClick={nextStep} className="btn-primary px-4 py-2 rounded-xl font-medium">
                  Next
                </button>
              ) : (
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="btn-primary px-4 py-2 rounded-xl font-medium flex items-center gap-2">
                  {loading ? <Loader className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                  Generate Campaign
                </motion.button>
              )}
            </div>
          </form>
        </GlassCard>

        <div className="lg:col-span-2 space-y-6">
          {campaign ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">{campaign.campaignName || 'Campaign Result'}</h2>
                  <p className="text-sm text-gray-400">AI-generated estimates only — not guaranteed performance.</p>
                </div>
                <button onClick={saveCampaign} className="btn-primary px-4 py-2 rounded-lg flex items-center gap-2 shadow-[0_0_15px_rgba(108,99,255,0.3)]">
                  <Save size={18} /> Save Campaign
                </button>
              </div>

              <GlassCard>
                <h3 className="font-bold text-xl mb-4">Campaign Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><span className="text-gray-400">Objective:</span> <span className="text-white">{campaign.objective}</span></div>
                  <div><span className="text-gray-400">Audience:</span> <span className="text-white">{campaign.targetAudience}</span></div>
                  <div><span className="text-gray-400">Strategy:</span> <span className="text-white">{campaign.campaignStrategy}</span></div>
                  <div><span className="text-gray-400">USP:</span> <span className="text-white">{campaign.usp}</span></div>
                </div>
              </GlassCard>

              <GlassCard>
                <h3 className="font-bold text-xl mb-4">Top Headlines</h3>
                <div className="space-y-2">
                  {(campaign.headlines || []).slice(0, 5).map((headline, index) => (
                    <div key={index} className="rounded-lg border border-white/10 bg-white/5 p-3 text-gray-200">{headline}</div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard>
                <h3 className="font-bold text-xl mb-4">Primary Ad Copy</h3>
                <div className="space-y-2">
                  {(campaign.adCopies || []).slice(0, 3).map((copy, index) => (
                    <div key={index} className="rounded-lg border border-white/10 bg-white/5 p-3 text-gray-300">{copy}</div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard>
                <h3 className="font-bold text-xl mb-4">AI Estimated Scores</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {campaign.analytics && Object.entries(campaign.analytics).filter(([key]) => key !== 'note').map(([key, value]) => (
                    <div key={key} className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-300 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="text-white font-medium">{value}</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10">
                        <div className="h-full rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]" style={{ width: `${value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-xs text-gray-400">AI-generated estimates, not guaranteed advertising performance.</p>
              </GlassCard>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-white/10 rounded-2xl">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4 text-gray-500">
                <Megaphone size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-400">Campaign Preview</h3>
              <p className="text-gray-500 mt-2 max-w-sm">Your generated campaign strategy, audience, headlines, and ad copy will appear here after you create it.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignBuilder;
