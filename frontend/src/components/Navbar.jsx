import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Trophy, LogOut, User, LayoutDashboard, Gavel, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/login');
  };

  const navLinks = [
    { name: 'Auction', path: '/', icon: Gavel },
    { name: 'My Team', path: '/team', icon: User },
    ...(user?.isAdmin ? [{ name: 'Admin', path: '/admin', icon: LayoutDashboard }] : []),
  ];

  return (
    <nav className="bg-slate-900 border-b border-slate-800 px-4 md:px-6 py-4 shadow-xl sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link 
          to="/" 
          className="flex items-center space-x-2 text-xl md:text-2xl font-bold text-yellow-500"
          onClick={() => setIsOpen(false)}
        >
          <Trophy className="w-6 h-6 md:w-8 md:h-8" />
          <span>IPL AUCTION</span>
        </Link>

        {/* Desktop Menu */}
        {user && (
          <div className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className="flex items-center space-x-1 hover:text-yellow-500 transition-colors"
              >
                <link.icon className="w-5 h-5" />
                <span>{link.name}</span>
              </Link>
            ))}
            
            <div className="h-6 w-px bg-slate-700 mx-2" />

            <div className="flex items-center space-x-4">
              <span className="text-slate-400 text-sm">
                Logged in as <span className="text-slate-100 font-semibold">{user.name}</span>
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 bg-red-600/20 hover:bg-red-600/40 text-red-500 px-3 py-1.5 rounded-lg border border-red-500/50 transition-all text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}

        {!user && (
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login" className="text-slate-400 hover:text-white transition-colors">Login</Link>
            <Link
              to="/register"
              className="bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-bold px-4 py-2 rounded-lg transition-all"
            >
              Sign Up
            </Link>
          </div>
        )}

        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden text-slate-300 hover:text-yellow-500 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* Mobile Menu Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden mt-4 bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden"
          >
            <div className="p-4 flex flex-col space-y-4">
              {user ? (
                <>
                  <div className="pb-4 border-b border-slate-700">
                    <p className="text-slate-400 text-sm">Hello,</p>
                    <p className="text-white font-bold">{user.name}</p>
                  </div>
                  {navLinks.map((link) => (
                    <Link 
                      key={link.name} 
                      to={link.path} 
                      className="flex items-center space-x-3 text-slate-300 hover:text-yellow-500 transition-colors p-2"
                      onClick={() => setIsOpen(false)}
                    >
                      <link.icon className="w-6 h-6" />
                      <span className="text-lg">{link.name}</span>
                    </Link>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 text-red-400 hover:text-red-300 transition-colors p-2 border-t border-slate-700 pt-4"
                  >
                    <LogOut className="w-6 h-6" />
                    <span className="text-lg">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="text-slate-300 hover:text-yellow-500 transition-colors p-2 text-lg text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="bg-yellow-500 text-slate-950 font-bold p-3 rounded-xl text-lg text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
