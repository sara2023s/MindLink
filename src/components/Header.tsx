import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, User, ArrowRight, Plus, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

export const Header: React.FC = () => {
  const { currentUser, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const publicNavItems = [
    { path: '/', label: 'Home' },
    { path: '/features', label: 'Features' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  const privateNavItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/saved', label: 'Saved Links' },
    { path: '/categories', label: 'Categories' },
  ];

  const renderNavItems = (items: { path: string; label: string }[]) => (
    <div className="flex items-center space-x-8">
      {items.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`relative text-sm font-medium px-3 py-2 rounded-md transition-colors duration-200 ${
            isActive(item.path) 
              ? 'text-indigo-600' 
              : 'text-gray-600 hover:text-indigo-600'
          }`}
        >
          {item.label}
          {isActive(item.path) && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"></span>
          )}
        </Link>
      ))}
    </div>
  );

  return (
    <header className="fixed inset-x-0 top-0 bg-white/80 backdrop-blur-sm border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2 group">
              <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                MindLink
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 mx-8">
            {currentUser ? renderNavItems(privateNavItems) : renderNavItems(publicNavItems)}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                <Button
                  variant="primary"
                  size="sm"
                  className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  onClick={() => navigate('/add')}
                >
                  <Plus size={18} />
                  <span>New Link</span>
                </Button>

                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors"
                  >
                    {currentUser.photoURL ? (
                      <img
                        src={currentUser.photoURL}
                        alt={currentUser.displayName || 'User Avatar'}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <User size={18} className="text-indigo-600" />
                      </div>
                    )}
                    <span className="hidden md:inline text-sm font-medium">
                      {currentUser.displayName || currentUser.email?.split('@')[0]}
                    </span>
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1"
                      >
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 flex items-center space-x-2"
                        >
                          <LogOut size={16} />
                          <span>Sign Out</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-gray-600 hover:text-indigo-600 border-gray-300 hover:border-indigo-600"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button 
                    variant="primary" 
                    size="sm"
                    className="group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    Get Started
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-600 hover:text-indigo-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden w-full py-4 bg-white shadow-md"
            >
              <nav className="flex flex-col space-y-2">
                {currentUser ? (
                  <>
                    {privateNavItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`w-full text-left px-4 py-2 text-sm font-medium rounded-md ${
                          isActive(item.path)
                            ? 'text-indigo-600 bg-indigo-50'
                            : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                    <button
                      onClick={() => {
                        navigate('/add');
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-md"
                    >
                      <Plus size={18} />
                      <span>New Link</span>
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600"
                    >
                      <LogOut size={18} />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    {publicNavItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`w-full text-left px-4 py-2 text-sm font-medium rounded-md ${
                          isActive(item.path)
                            ? 'text-indigo-600 bg-indigo-50'
                            : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};