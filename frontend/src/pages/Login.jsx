import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, User, Lock } from 'lucide-react';

const Login = () => {
  const [username, setUsername]   = useState('');
  const [password, setPassword]   = useState('');
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [activeDot, setActiveDot] = useState(0);

  const { login } = useAuth();
  const navigate  = useNavigate();

  useEffect(() => {
    const id = setInterval(() => setActiveDot(d => (d + 1) % 6), 850);
    return () => clearInterval(id);
  }, []);

  const flashError = (msg) => {
    setError(msg);
    setTimeout(() => setError(''), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      flashError(err.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const fieldWrap = "flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 transition-all focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/10";
  const inp       = "flex-1 bg-transparent border-none outline-none py-2.5 text-sm text-white placeholder-zinc-600 font-sans";

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-950"
      >

        {/* ── Top dark panel ── */}
        <div className="bg-black px-6 pt-7 pb-6 text-center">

          {/* Stumps */}
          <div className="relative w-12 h-12 mx-auto mb-4">
            <div className="absolute bottom-0 left-0     w-1.5 h-9  bg-amber-300 rounded-t-sm" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-11 bg-amber-300 rounded-t-sm" />
            <div className="absolute bottom-0 right-0    w-1.5 h-9  bg-amber-300 rounded-t-sm" />
            <div className="absolute top-1 left-0  w-3 h-0.5 bg-amber-300 rounded-full" />
            <div className="absolute top-1 right-0 w-3 h-0.5 bg-amber-300 rounded-full" />
          </div>

          <h1 className="text-2xl font-extrabold text-white leading-tight mb-1">
            Ready to <span className="text-orange-500">bat?</span>
          </h1>
          <p className="text-[11px] font-semibold tracking-widest uppercase text-zinc-600">
            IPL Auction 2026
          </p>
        </div>

        {/* ── Form ── */}
        <div className="px-6 pt-5 pb-4">

          {/* Over dots */}
          <div className="flex justify-center gap-1.5 mb-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  i === activeDot ? 'bg-orange-500' : 'bg-zinc-800'
                }`}
              />
            ))}
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 px-3 py-2.5 rounded-lg text-center mb-4"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-3.5">

            {/* Username */}
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-zinc-500 mb-1.5">
                Username
              </label>
              <div className={fieldWrap}>
                <User className="w-3.5 h-3.5 text-zinc-600 flex-shrink-0" />
                <input
                  type="text"
                  required
                  className={inp}
                  placeholder="Enter your username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-zinc-500 mb-1.5">
                Password
              </label>
              <div className={fieldWrap}>
                <Lock className="w-3.5 h-3.5 text-zinc-600 flex-shrink-0" />
                <input
                  type="password"
                  required
                  className={inp}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[.98] text-white text-sm font-bold py-2.5 rounded-lg transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              {loading ? 'Signing in…' : 'Sign in'}
            </button>

          </form>
        </div>

        {/* ── Footer ── */}
        <div className="text-center text-xs text-zinc-500 px-6 py-4 border-t border-zinc-900">
          New player?{' '}
          <Link to="/register" className="text-orange-500 hover:text-orange-400 font-semibold">
            Create your account
          </Link>
        </div>

      </motion.div>
    </div>
  );
};

export default Login;