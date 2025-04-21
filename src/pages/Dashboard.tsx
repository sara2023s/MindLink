import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLinks } from '../hooks/useLinks';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Link2, 
  Tag, 
  Calendar, 
  Search, 
  Plus, 
  Filter, 
  ExternalLink, 
  Edit2, 
  Trash2,
  Pin,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { RecentActivities } from '../components/RecentActivities';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { links, loading, deleteLink, updateLink } = useLinks();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showActivityTimeline, setShowActivityTimeline] = useState(false);
  const [pinningLinks, setPinningLinks] = useState<Record<string, boolean>>({});

  // Separate pinned and unpinned links
  const pinnedLinks = links.filter(link => link.isPinned);

  // Calculate stats
  const totalLinks = links.length;
  const uniqueCategories = new Set(links.map(link => link.category)).size;
  const lastActivity = links[0]?.createdAt ? format(links[0].createdAt, 'MMM d, yyyy') : 'No activity yet';

  // Filter links based on search and filters
  const filteredLinks = links.filter(link => {
    const matchesSearch = link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         link.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(link.category);
    const matchesTag = selectedTags.length === 0 || (link.tags && link.tags.some(tag => selectedTags.includes(tag)));
    return matchesSearch && matchesCategory && matchesTag;
  });

  // Get unique categories and tags
  const categories = Array.from(new Set(links.map(link => link.category)));
  const tags = Array.from(new Set(links.flatMap(link => link.tags || [])));

  const handleCategoryClick = (category: string) => {
    setSelectedCategories(prevCategories => {
      if (prevCategories.includes(category)) {
        return prevCategories.filter(c => c !== category);
      } else {
        return [...prevCategories, category];
      }
    });
  };

  const handleTagClick = (tag: string) => {
    setSelectedTags(prevTags => {
      if (prevTags.includes(tag)) {
        return prevTags.filter(t => t !== tag);
      } else {
        return [...prevTags, tag];
      }
    });
  };

  const handlePinLink = async (linkId: string) => {
    const link = links.find(l => l.id === linkId);
    if (!link) return;

    setPinningLinks(prev => ({ ...prev, [linkId]: true }));
    
    try {
      await updateLink(linkId, { ...link, isPinned: !link.isPinned });
      toast.success(link.isPinned ? 'Link unpinned' : 'Link pinned');
    } catch (error) {
      console.error('Error updating link:', error);
      toast.error('Failed to update pin status');
    } finally {
      setPinningLinks(prev => ({ ...prev, [linkId]: false }));
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
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Header */}
      <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold mb-4">
              Welcome back, {currentUser?.displayName || 'there'}! 👋
            </h1>
            <p className="text-xl text-indigo-100">
              Here's a quick look at your MindLink universe
            </p>
          </motion.div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Link2 className="w-6 h-6 text-indigo-600" />
              </div>
            <div>
                <p className="text-sm text-gray-500">Total Links</p>
                <p className="text-2xl font-semibold">{totalLinks}</p>
              </div>
            </div>
          </motion.div>

            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Tag className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Categories</p>
                <p className="text-2xl font-semibold">{uniqueCategories}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Activity</p>
                <p className="text-2xl font-semibold">{lastActivity}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Pinned Links */}
      {pinnedLinks.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Pinned Links</h2>
            <button
              onClick={() => navigate('/pinned')}
              className="text-indigo-600 hover:text-indigo-700 flex items-center"
            >
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pinnedLinks.map((link) => (
              <motion.div
                key={link.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/link/${link.id}`)}
              >
                <div className="flex items-start justify-between">
                  <h3 className="font-medium text-gray-900">{link.title}</h3>
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handlePinLink(link.id);
                      }}
                      disabled={pinningLinks[link.id]}
                      className={`p-1 rounded-full transition-colors ${
                        link.isPinned 
                          ? 'text-indigo-600' 
                          : 'text-gray-400 hover:text-indigo-600'
                      } ${pinningLinks[link.id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {pinningLinks[link.id] ? (
                        <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Pin className="w-4 h-4" fill={link.isPinned ? "currentColor" : "none"} />
                      )}
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        navigate(`/link/${link.id}`);
                      }}
                      className="text-gray-400 hover:text-indigo-600"
                    >
                      <Edit2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                  {link.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {format(link.createdAt, 'MMM d, yyyy')}
                  </span>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-700"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Activity Timeline */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <button
          onClick={() => setShowActivityTimeline(!showActivityTimeline)}
          className="flex items-center text-gray-700 hover:text-gray-900"
        >
          <h2 className="text-xl font-semibold">Recent Activity</h2>
          {showActivityTimeline ? (
            <ChevronDown className="w-5 h-5 ml-2" />
          ) : (
            <ChevronRight className="w-5 h-5 ml-2" />
          )}
        </button>
        <AnimatePresence>
          {showActivityTimeline && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-4"
            >
              <div className="bg-white rounded-lg shadow-sm p-6">
                <RecentActivities />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Search and Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search your links..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={selectedCategories.join(',')}
                      onChange={(e) => setSelectedCategories(e.target.value.split(','))}
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tag</label>
                    <select
                      value={selectedTags.join(',')}
                      onChange={(e) => setSelectedTags(e.target.value.split(','))}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">All Tags</option>
                      {tags.map((tag) => (
                        <option key={tag} value={tag}>
                          {tag}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Categories/Tags Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Categories & Tags</h2>
        <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <motion.button
                        key={category}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
              onClick={() => handleCategoryClick(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                selectedCategories.includes(category)
                  ? 'bg-indigo-600 text-white'
                  : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
                        }`}
                      >
                        {category}
                      </motion.button>
                    ))}
          {tags.map((tag) => (
            <motion.button
              key={tag}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleTagClick(tag)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                selectedTags.includes(tag)
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
              }`}
            >
              {tag}
            </motion.button>
          ))}
              </div>
            </div>

      {/* Recent Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Links</h2>
          <button
            onClick={() => navigate('/add-link')}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>New Link</span>
          </button>
            </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLinks.slice(0, 6).map((link) => (
            <motion.div 
              key={link.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/link/${link.id}`)}
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900">{link.title}</h3>
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handlePinLink(link.id);
                      }}
                      disabled={pinningLinks[link.id]}
                      className={`p-1 rounded-full transition-colors ${
                        link.isPinned 
                          ? 'text-indigo-600' 
                          : 'text-gray-400 hover:text-indigo-600'
                      } ${pinningLinks[link.id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {pinningLinks[link.id] ? (
                        <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Pin className="w-4 h-4" fill={link.isPinned ? "currentColor" : "none"} />
                      )}
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        navigate(`/link/${link.id}`);
                      }}
                      className="text-gray-400 hover:text-indigo-600"
                    >
                      <Edit2 className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        deleteLink(link.id);
                      }}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                  {link.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {link.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">
                    {format(link.createdAt, 'MMM d, yyyy')}
                  </span>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-700"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/add-link')}
        className="fixed bottom-4 right-4 md:hidden p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-lg"
      >
        <Plus className="w-6 h-6" />
      </motion.button>
    </div>
  );
};

export default Dashboard;