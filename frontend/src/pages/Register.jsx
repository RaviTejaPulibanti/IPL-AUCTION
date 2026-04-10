import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { UserPlus, User, Lock, Building, Tag } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    owner: '',
    username: '',
    password: '',
    isAdmin: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-800 w-full max-w-md"
      >
        <div className="flex justify-center mb-4">
          <div className="bg-yellow-500/10 p-4 rounded-full border border-yellow-500/20">
            <UserPlus className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Register Your Team
        </h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Team Name</label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 pl-9 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-yellow-500 shadow-inner text-sm"
                  placeholder="e.g. MI"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Owner</label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  name="owner"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 pl-9 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-yellow-500 text-sm"
                  placeholder="Owner Name"
                  value={formData.owner}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                name="username"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 pl-9 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-yellow-500 text-sm"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                name="password"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 pl-9 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-yellow-500 text-sm"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              name="isAdmin"
              id="isAdmin"
              className="w-4 h-4 accent-yellow-500 rounded border-slate-800 bg-slate-950"
              checked={formData.isAdmin}
              onChange={handleChange}
            />
            <label htmlFor="isAdmin" className="text-sm text-slate-400 cursor-pointer select-none">
              Register as Administrator
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-500/50 text-slate-950 font-bold py-3 rounded-xl transition-all flex items-center justify-center space-x-2 mt-6 shadow-lg shadow-yellow-500/20"
          >
            {loading ? 'Creating Team...' : (
              <>
                <span>Register Team</span>
                <UserPlus className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-slate-400 border-t border-slate-800 pt-4 text-sm">
          Already have a team? {' '}
          <Link to="/login" className="text-yellow-500 hover:text-yellow-400 font-semibold">
            Login here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
