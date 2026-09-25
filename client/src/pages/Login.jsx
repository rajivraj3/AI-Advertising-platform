import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_40%),linear-gradient(135deg,#020817,#0b1120_38%,#111827)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-3 mb-4 px-5 py-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm shadow-[0_0_25px_rgba(96,165,250,0.15)]">
            <span className="text-2xl">⚡</span>
            <span className="text-2xl font-black tracking-tight text-white">AI Advertising Campaign Generator</span>
          </div>
          <p className="text-base font-medium text-gray-200">Create Smarter Ads with AI</p>
        </div>

        <GlassCard>
          <h2 className="text-3xl font-bold mb-2 text-center text-white">Welcome Back</h2>
          <p className="text-center text-gray-400 text-sm mb-6">Sign in to continue with AdGen AI</p>
          {error && <div className="bg-red-500/20 border border-red-500 text-red-100 p-3 rounded-lg mb-4 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[var(--color-primary)] transition"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[var(--color-primary)] transition"
                placeholder="••••••••"
                required
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full btn-primary py-3 rounded-xl font-bold mt-6 shadow-[0_0_20px_rgba(108,99,255,0.4)]"
            >
              Sign In
            </motion.button>
          </form>

          <p className="mt-6 text-center text-gray-400 text-sm">
            Don't have an account? <Link to="/signup" className="text-[var(--color-secondary)] hover:underline font-medium">Sign up</Link>
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default Login;
