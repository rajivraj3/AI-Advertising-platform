import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Folder, Search, Trash2, Megaphone, Image as ImageIcon, MessageSquare, Rocket } from 'lucide-react';
import api from '../api/axios';
import GlassCard from '../components/GlassCard';

const SavedCampaigns = () => {
  const [history, setHistory] = useState({ campaigns: [], chats: [] });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/history');
      setHistory(res.data);
    } catch (error) {
      console.error('Failed to fetch history', error);
    }
    setLoading(false);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'poster': return <ImageIcon className="text-blue-400" size={20} />;
      case 'slogan': return <Megaphone className="text-pink-400" size={20} />;
      case 'campaign': return <Rocket className="text-purple-400" size={20} />;
      default: return <Folder className="text-gray-400" size={20} />;
    }
  };

  const filteredCampaigns = history.campaigns.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Folder className="text-[var(--color-primary)]" />
            Saved Campaigns
          </h1>
          <p className="text-gray-400 mt-2">Access all your generated marketing materials in one place.</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-white focus:outline-none focus:border-[var(--color-primary)] transition"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-20"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
      ) : (
        <div className="space-y-8">
          {/* Campaigns Grid */}
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">Generated Assets</h2>
            {filteredCampaigns.length === 0 ? (
              <GlassCard className="text-center py-12 text-gray-500">No saved items found.</GlassCard>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCampaigns.map((item, idx) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <GlassCard className="h-full flex flex-col hover:border-[var(--color-primary)] transition group cursor-pointer">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                            {getIcon(item.type)}
                          </div>
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{item.type}</span>
                        </div>
                        <button className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition">
                          <Trash2 size={18} />
                        </button>
                      </div>
                      
                      <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-400 mb-4 flex-1">
                        Created {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                      
                      <div className="pt-4 border-t border-white/10 flex justify-between items-center text-sm">
                        <span className="text-[var(--color-secondary)]">View Details &rarr;</span>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Chat History */}
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">Strategist Conversations</h2>
            {history.chats.length === 0 ? (
              <GlassCard className="text-center py-8 text-gray-500">No chats found.</GlassCard>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {history.chats.map((chat) => (
                  <GlassCard key={chat._id} className="flex justify-between items-center hover:bg-white/5 cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-pink-500/10 text-pink-400 rounded-xl">
                        <MessageSquare size={20} />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">Marketing Brainstorm</h4>
                        <p className="text-xs text-gray-400">Last updated {new Date(chat.updatedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedCampaigns;
