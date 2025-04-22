import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Filter, Sparkles, BarChart2, Archive } from 'lucide-react';
import { toast } from 'react-hot-toast';
import DeleteConfirmation from '../components/DeleteConfirmation';
import { useLinks } from '../hooks/useLinks';
import { LinkCard } from '../components/LinkCard';
import StreaksAndAchievements from '../components/StreaksAndAchievements';

type SortOption = 'newest' | 'oldest' | 'az' | 'za';

const SavedLinks = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { links, loading, deleteLink } = useLinks();
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showFilters, setShowFilters] = useState(false);
  
  // Initialize streaks and achievements with current date
  const [streaks, setStreaks] = useState(() => {
    const today = new Date();
    return {
      dailySaveStreak: 0,
      lastSavedDate: today
    };
  });

  const [achievements, setAchievements] = useState(() => {
    const today = new Date();
    return {
      totalLinksSaved: 0,
      linksSavedThisWeek: 0,
      linksTaggedInARow: 0,
      collectionsCreatedToday: 0,
      lastLoginDate: today,
      loginStreak: 0
    };
  });

  // Extract unique categories and tags
  const categories = useMemo(() => {
    return Array.from(new Set(links.map(link => link.category).filter(Boolean)));
  }, [links]);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    links.forEach(link => {
      link.tags?.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet);
  }, [links]);

  // Filter and sort links
  const filteredLinks = useMemo(() => {
    return links
      .filter(link => {
        const matchesSearch = link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          link.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          link.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesCategory = !selectedCategory || link.category === selectedCategory;
        
        const matchesTags = selectedTags.length === 0 || 
          selectedTags.every(tag => link.tags?.includes(tag));
        
        return matchesSearch && matchesCategory && matchesTags;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'newest':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case 'oldest':
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          case 'az':
            return a.title.localeCompare(b.title);
          case 'za':
            return b.title.localeCompare(a.title);
          default:
            return 0;
        }
      });
  }, [links, searchTerm, selectedCategory, selectedTags, sortBy]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedTags([]);
    setSearchTerm('');
  };

  // Update achievements and streaks when links change
  useEffect(() => {
    if (links.length === 0) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day (12:00 AM)
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Calculate total links and links saved this week
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const linksThisWeek = links.filter(link => {
      const linkDate = new Date(link.createdAt);
      linkDate.setHours(0, 0, 0, 0);
      return linkDate >= oneWeekAgo;
    });

    // Check for today's and yesterday's activity
    const savedToday = links.some(link => {
      const linkDate = new Date(link.createdAt);
      linkDate.setHours(0, 0, 0, 0);
      return linkDate.getTime() === today.getTime();
    });

    const savedYesterday = links.some(link => {
      const linkDate = new Date(link.createdAt);
      linkDate.setHours(0, 0, 0, 0);
      return linkDate.getTime() === yesterday.getTime();
    });

    // Update achievements
    setAchievements(prev => ({
      ...prev,
      totalLinksSaved: links.length,
      linksSavedThisWeek: linksThisWeek.length
    }));

    // Update streaks
    setStreaks(prev => {
      const lastSavedDate = new Date(prev.lastSavedDate);
      lastSavedDate.setHours(0, 0, 0, 0);

      if (savedToday) {
        // If saved today and no previous streak, start streak at 1
        if (prev.dailySaveStreak === 0) {
          return {
            dailySaveStreak: 1,
            lastSavedDate: today
          };
        }
        // If saved today and has previous streak, maintain it
        return {
          ...prev,
          lastSavedDate: today
        };
      } else if (savedYesterday && lastSavedDate.getTime() !== yesterday.getTime()) {
        // If saved yesterday and haven't already counted it, increment streak
        return {
          dailySaveStreak: prev.dailySaveStreak + 1,
          lastSavedDate: yesterday
        };
      } else if (!savedToday && !savedYesterday) {
        // If no activity in the last two days, reset streak to 1 if there was activity today
        return {
          dailySaveStreak: savedToday ? 1 : 0,
          lastSavedDate: today
        };
      }
      return prev;
    });
  }, [links]);

  // Update login streak when user changes
  useEffect(() => {
    if (!currentUser) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day (12:00 AM)
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    setAchievements(prev => {
      const lastLoginDate = new Date(prev.lastLoginDate);
      lastLoginDate.setHours(0, 0, 0, 0);

      // If this is the first login or login streak is 0, start at 1
      if (prev.loginStreak === 0) {
        return {
          ...prev,
          loginStreak: 1,
          lastLoginDate: today
        };
      }

      if (lastLoginDate.getTime() === yesterday.getTime()) {
        // If logged in yesterday, increment streak
        return {
          ...prev,
          loginStreak: prev.loginStreak + 1,
          lastLoginDate: today
        };
      } else if (lastLoginDate.getTime() !== today.getTime()) {
        // If didn't log in yesterday or today, start new streak at 1
        return {
          ...prev,
          loginStreak: 1,
          lastLoginDate: today
        };
      }
      return prev;
    });
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
  }, [currentUser, navigate]);

  const handleDelete = async (linkId: string) => {
    try {
      await deleteLink(linkId);
      toast.success('Link deleted successfully');
    } catch (error) {
      console.error('Error deleting link:', error);
      toast.error('Failed to delete link');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Column - Your Progress */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <StreaksAndAchievements 
              streaks={streaks}
              achievements={achievements}
            />
          </motion.div>

          {/* Right Column - Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="bg-white rounded-2xl shadow p-6 mb-8"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-500">Total Links</h4>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">
                    {links.length} links saved
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-500">Categories</h4>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">
                    {categories.length} categories
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Saved Links</h1>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search your links..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <Filter className="w-5 h-5 text-gray-600" />
              <span>Filters</span>
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-4 pt-4 border-t border-gray-100"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">All Categories</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {allTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`px-4 py-2 rounded-full text-sm font-medium ${
                            selectedTags.includes(tag)
                              ? 'bg-purple-600 text-white'
                              : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Main Links Grid */}
        <div className="mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredLinks.length > 0 ? (
              filteredLinks.map((link) => (
                <LinkCard
                  key={link.id}
                  link={link}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-12"
              >
                <div className="w-16 h-16 mx-auto mb-4 text-neutral-400">
                  <Plus className="w-full h-full" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                  {searchTerm || selectedCategory || selectedTags.length > 0
                    ? "No links match your filters"
                    : "No links saved yet"}
                </h3>
                <p className="text-neutral-600 mb-6">
                  {searchTerm || selectedCategory || selectedTags.length > 0
                    ? "Try clearing your filters or searching again"
                    : "Start by adding your first link from the Dashboard"}
                </p>
                {(searchTerm || selectedCategory || selectedTags.length > 0) ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearFilters}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Clear Filters
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/add')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add a Link
                  </motion.button>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* Recommended Links Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-semibold text-gray-900">Recommended for You</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl shadow p-6 border border-gray-100 cursor-pointer"
                onClick={() => navigate('/coming-soon')}
              >
                <div className="text-center py-8">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">AI Suggestions</h3>
                  <p className="text-sm text-gray-500">Personalized link recommendations coming soon</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Link Insights Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-6">
            <BarChart2 className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-semibold text-gray-900">Link Insights</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow p-6 border border-gray-100 cursor-pointer"
              onClick={() => navigate('/coming-soon')}
            >
              <div className="text-center py-8">
                <BarChart2 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Reading Analytics</h3>
                <p className="text-sm text-gray-500">Track your reading habits and patterns</p>
              </div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow p-6 border border-gray-100 cursor-pointer"
              onClick={() => navigate('/coming-soon')}
            >
              <div className="text-center py-8">
                <BarChart2 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Weekly Stats</h3>
                <p className="text-sm text-gray-500">View your weekly link activity</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Link Cleanup Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-6">
            <Archive className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-semibold text-gray-900">Clean Up Your Links</h2>
          </div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow p-6 border border-gray-100"
          >
            <div className="text-center py-8">
              <Archive className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Archive Old Links</h3>
              <p className="text-sm text-gray-500 mb-4">Organize and archive your older links</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/coming-soon')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Archive Links
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <DeleteConfirmation
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setLinkToDelete(null);
        }}
        onConfirm={() => {
          if (linkToDelete) {
            handleDelete(linkToDelete);
            setShowDeleteModal(false);
            setLinkToDelete(null);
          }
        }}
      />
    </div>
  );
};

export default SavedLinks; 