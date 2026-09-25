import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="fixed w-full z-50 glass-card border-b-0 rounded-none bg-opacity-30 backdrop-blur-md px-6 py-4 flex justify-between items-center">
      <Link to="/" className="flex items-center gap-2">
        <Zap className="text-[var(--color-secondary)] w-8 h-8" />
        <span className="text-2xl font-bold text-gradient">AdGenius AI</span>
      </Link>
      
      <div className="flex gap-4 items-center">
        {user ? (
          <>
            <Link to="/dashboard" className="text-gray-300 hover:text-white transition">Dashboard</Link>
            <button onClick={logout} className="text-gray-300 hover:text-white transition">Logout</button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center font-bold text-white shadow-lg">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-300 hover:text-white transition">Login</Link>
            <Link to="/signup">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary px-6 py-2 rounded-full font-medium"
              >
                Start Free
              </motion.button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
