import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Image as ImageIcon, MessageSquare, Megaphone, Folder, PieChart, Settings } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/poster', icon: ImageIcon, label: 'Poster Generator' },
    { path: '/slogan', icon: Megaphone, label: 'Slogan Generator' },
    { path: '/chat', icon: MessageSquare, label: 'AI Strategist' },
    { path: '/campaign', icon: Megaphone, label: 'Campaign Builder' },
    { path: '/saved', icon: Folder, label: 'Saved Campaigns' },
    { path: '/analytics', icon: PieChart, label: 'Analytics' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="w-64 h-screen fixed left-0 top-0 pt-24 pb-6 px-4 glass-card border-r-0 rounded-none flex flex-col">
      <div className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link key={item.path} to={item.path}>
              <motion.div 
                whileHover={{ x: 5 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive ? 'bg-gradient-to-r from-[rgba(108,99,255,0.2)] to-transparent border border-[var(--color-primary)] text-white shadow-[0_0_15px_rgba(108,99,255,0.3)]' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Icon className={isActive ? 'text-[var(--color-secondary)]' : ''} size={20} />
                <span className="font-medium">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
