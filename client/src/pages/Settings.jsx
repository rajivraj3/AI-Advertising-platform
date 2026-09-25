import { useState, useContext } from 'react';
import { Settings as SettingsIcon, User, Key, Bell, Shield } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';

const Settings = () => {
  const { user } = useContext(AuthContext);
  const [apiKey, setApiKey] = useState('**********************');

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <SettingsIcon className="text-gray-300" />
          Settings
        </h1>
        <p className="text-gray-400 mt-2">Manage your account, API keys, and preferences.</p>
      </div>

      <div className="space-y-6">
        <GlassCard>
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-2xl font-bold shadow-lg">
              {user?.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold">{user?.name}</h2>
              <p className="text-gray-400">{user?.email}</p>
            </div>
            <button className="ml-auto px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition">
              Edit Profile
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/20 text-blue-400 rounded-lg"><Key size={20} /></div>
                <div>
                  <p className="font-bold">Gemini API Key</p>
                  <p className="text-sm text-gray-400">Used for generating all AI content.</p>
                </div>
              </div>
              <div className="flex gap-2">
                <input 
                  type="password" 
                  value={apiKey} 
                  onChange={(e) => setApiKey(e.target.value)}
                  className="bg-black/50 border border-white/10 rounded-lg px-3 py-1.5 text-sm w-48 text-gray-400" 
                  disabled
                />
                <button className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition">Update</button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-pink-500/20 text-pink-400 rounded-lg"><Bell size={20} /></div>
                <div>
                  <p className="font-bold">Email Notifications</p>
                  <p className="text-sm text-gray-400">Receive weekly campaign performance reports.</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/20 text-green-400 rounded-lg"><Shield size={20} /></div>
                <div>
                  <p className="font-bold">Data Privacy</p>
                  <p className="text-sm text-gray-400">Allow AI models to train on your generated campaigns.</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
              </label>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Settings;
