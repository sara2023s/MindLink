import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Plus, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  const { currentUser, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const currentYear = new Date().getFullYear();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleDashboardClick = () => {
    if (location.pathname === '/dashboard') {
      window.location.reload();
    } else {
      navigate('/dashboard');
    }
  };

  const Attribution = () => (
    <div className="text-center pt-4 mt-6 pb-8">
      <p className="text-neutral-400 text-xs sm:text-sm">
        Built by{' '}
        <a
          href="https://buildwithsds.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-indigo-500 transition-colors"
        >
          buildwithsds.com
        </a>
      </p>
    </div>
  );

  if (currentUser) {
    return (
      <footer className="bg-white border-t-2 border-neutral-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-sm text-neutral-600">
              © {currentYear} MindLink. All rights reserved.
            </div>
            <div className="flex items-center space-x-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDashboardClick}
                className="text-neutral-600 hover:text-indigo-600 transition-colors flex items-center"
              >
                Dashboard
                <ChevronRight className="w-4 h-4 ml-1" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/add')}
                className="text-neutral-600 hover:text-indigo-600 transition-colors flex items-center"
              >
                New Link
                <Plus className="w-4 h-4 ml-1" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="text-neutral-600 hover:text-red-600 transition-colors flex items-center"
              >
                Logout
                <LogOut className="w-4 h-4 ml-1" />
              </motion.button>
            </div>
          </div>
        </div>
        <Attribution />
      </footer>
    );
  }

  return (
    <footer className="bg-white border-t-2 border-neutral-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">About</h3>
            <p className="text-neutral-600">
              MindLink helps you organize and manage your web links with AI-powered insights.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-neutral-600 hover:text-indigo-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/features" className="text-neutral-600 hover:text-indigo-600 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-neutral-600 hover:text-indigo-600 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-neutral-600 hover:text-indigo-600 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Connect</h3>
            <div className="flex justify-center md:justify-start space-x-4">
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="https://buildwithsds.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-600 hover:text-indigo-600 transition-colors"
              >
                Portfolio
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="https://github.com/sara2023s"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-600 hover:text-indigo-600 transition-colors"
              >
                GitHub
              </motion.a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-neutral-200">
          <p className="text-center text-neutral-600">
            © {currentYear} MindLink. All rights reserved.
          </p>
        </div>
      </div>
      <Attribution />
    </footer>
  );
};

export default Footer; 