import { motion } from 'framer-motion';
import { Megaphone, Image as ImageIcon, MessageSquare, TrendingUp, Users, Download } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import api from '../api/axios';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await api.get('/campaigns');
        setCampaigns(res.data || []);
      } catch (error) {
        console.error('Failed to fetch campaigns', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const stats = [
    { label: 'Total Campaigns', value: campaigns.length, icon: Megaphone, color: 'text-purple-400' },
    { label: 'AI Generations', value: campaigns.length ? campaigns.length * 4 : 0, icon: ImageIcon, color: 'text-blue-400' },
    { label: 'Saved Assets', value: campaigns.length ? campaigns.filter(c => c.content).length : 0, icon: MessageSquare, color: 'text-pink-400' },
    { label: 'Audience Reach', value: campaigns.length ? `${Math.max(2, campaigns.length * 3)}M` : '0M', icon: Users, color: 'text-green-400' },
  ];

  const recentCampaigns = campaigns.slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.name?.split(' ')[0] || 'Marketer'}! 👋</h1>
          <p className="text-gray-400 mt-1">Here is what's happening with your campaigns today.</p>
        </div>
        <Link to="/campaign">
          <button className="btn-primary px-6 py-2 rounded-full font-medium flex items-center gap-2">
            <Megaphone size={18} />
            New Campaign
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard className="flex items-center gap-4">
              <div className={`p-4 rounded-xl bg-white/5 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2">
          <GlassCard>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Recent Activity</h2>
              <Link to="/saved" className="text-sm text-[var(--color-secondary)] hover:underline">View All</Link>
            </div>

            {loading ? (
              <div className="text-gray-400">Loading campaigns...</div>
            ) : recentCampaigns.length === 0 ? (
              <div className="text-gray-400">No campaigns yet. Create your first AI campaign.</div>
            ) : (
              <div className="space-y-4">
                {recentCampaigns.map((campaign) => (
                  <div key={campaign._id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                        <ImageIcon size={20} />
                      </div>
                      <div>
                        <p className="font-medium">{campaign.title || campaign.campaignName || 'Untitled Campaign'}</p>
                        <p className="text-xs text-gray-400">{campaign.productName || 'AI generated campaign'} • {new Date(campaign.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-white transition">
                      <Download size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>

        <div>
          <GlassCard>
            <h2 className="text-xl font-bold mb-6">Quick Tools</h2>
            <div className="space-y-3">
              <Link to="/campaign" className="block p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 hover:border-purple-500/40 transition group">
                <div className="flex items-center gap-3">
                  <ImageIcon className="text-purple-400" size={20} />
                  <span className="font-medium group-hover:text-[var(--color-secondary)] transition">Create Campaign</span>
                </div>
              </Link>
              <Link to="/poster" className="block p-4 rounded-xl bg-gradient-to-r from-pink-500/10 to-orange-500/10 border border-pink-500/20 hover:border-pink-500/40 transition group">
                <div className="flex items-center gap-3">
                  <MessageSquare className="text-pink-400" size={20} />
                  <span className="font-medium group-hover:text-[var(--color-accent)] transition">Write Slogans</span>
                </div>
              </Link>
              <Link to="/chat" className="block p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-teal-500/10 border border-green-500/20 hover:border-green-500/40 transition group">
                <div className="flex items-center gap-3">
                  <TrendingUp className="text-green-400" size={20} />
                  <span className="font-medium group-hover:text-green-400 transition">Talk to Strategist</span>
                </div>
              </Link>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
