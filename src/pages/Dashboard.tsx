import React, { useState, useEffect } from 'react';
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
  Lightbulb,
  Bell,
  MessageSquare,
  Folder
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { toast } from 'react-hot-toast';
import DeleteConfirmation from '../components/DeleteConfirmation';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { links, loading, deleteLink, updateLink } = useLinks();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [pinningLinks, setPinningLinks] = useState<Record<string, boolean>>({});
  const [deletingLinkId, setDeletingLinkId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState<string | null>(null);
  const [recentActivities, setRecentActivities] = useState<Array<{
    id: string;
    link: typeof links[0];
    type: 'created' | 'pinned' | 'unpinned' | 'deleted';
    timestamp: Date;
  }>>(() => {
    // Load activities from localStorage on initial render
    const savedActivities = localStorage.getItem('recentActivities');
    if (savedActivities) {
      try {
        const parsed = JSON.parse(savedActivities);
        // Convert string timestamps back to Date objects
        return parsed.map((activity: {
          id: string;
          link: typeof links[0];
          type: 'created' | 'pinned' | 'unpinned' | 'deleted';
          timestamp: string;
        }) => ({
          ...activity,
          timestamp: new Date(activity.timestamp),
          link: {
            ...activity.link,
            createdAt: new Date(activity.link.createdAt)
          }
        }));
      } catch (error) {
        console.error('Error parsing saved activities:', error);
        return [];
      }
    }
    return [];
  });

  // Save activities to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('recentActivities', JSON.stringify(recentActivities));
    } catch (error) {
      console.error('Error saving activities:', error);
    }
  }, [recentActivities]);

  // Track link changes
  useEffect(() => {
    // Get all activities from links
    const allActivities = links.map(link => ({
      id: `${link.id}-created-${Date.now()}`,
      link,
      type: 'created' as const,
      timestamp: new Date(link.createdAt)
    }));

    // Add pin/unpin activities
    const pinActivities = links
      .filter(link => link.isPinned)
      .map(link => ({
        id: `${link.id}-pinned-${Date.now()}`,
        link,
        type: 'pinned' as const,
        timestamp: new Date(link.createdAt)
      }));

    // Combine all activities and sort by timestamp
    const combinedActivities = [...allActivities, ...pinActivities]
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 3);

    // Only update if there are actual activities
    if (combinedActivities.length > 0) {
      setRecentActivities(prev => {
        // Keep any existing pin/unpin activities that aren't in the new list
        const existingPinActivities = prev.filter(a => 
          (a.type === 'pinned' || a.type === 'unpinned') && 
          !combinedActivities.some(newA => newA.link.id === a.link.id)
        );

        // Combine and sort all activities
        const updated = [...combinedActivities, ...existingPinActivities]
          .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
          .slice(0, 3);

        return updated;
      });
    }
  }, [links]);

  // Separate pinned and unpinned links
  const pinnedLinks = links.filter(link => link.isPinned);

  // Calculate stats
  const totalLinks = links.length;
  const uniqueCategories = new Set(links.map(link => link.category)).size;
  const lastActivity = links[0]?.createdAt ? format(links[0].createdAt, 'MMM d, yyyy') : 'No activity yet';

  // Filter links based on search and filters
  const filteredLinks = links.filter(link => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      link.title.toLowerCase().includes(searchLower) ||
      (link.description ? link.description.toLowerCase().includes(searchLower) : false) ||
      link.url.toLowerCase().includes(searchLower) ||
      (link.tags ? link.tags.some(tag => tag.toLowerCase().includes(searchLower)) : false);
    const matchesCategory =
      selectedCategories.length === 0 ||
      (link.category ? selectedCategories.includes(link.category) : false);
    const matchesTag =
      selectedTags.length === 0 ||
      (link.tags ? link.tags.some(tag => selectedTags.includes(tag)) : false);
    return matchesSearch && matchesCategory && matchesTag;
  });

  // Get unique categories and tags from active links only
  const categories = Array.from(new Set(filteredLinks.map(link => link.category)));
  const tags = Array.from(new Set(filteredLinks.flatMap(link => link.tags || [])));

  // Helper function to capitalize first letter
  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

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
      
      setRecentActivities(prev => {
        const newActivity = {
          id: `${linkId}-${!link.isPinned ? 'pinned' : 'unpinned'}-${Date.now()}`,
          link,
          type: !link.isPinned ? 'pinned' as const : 'unpinned' as const,
          timestamp: new Date()
        };

        // Add new activity at the beginning and keep only the 3 most recent
        return [newActivity, ...prev].slice(0, 3);
      });
      
      toast.success(link.isPinned ? 'Link unpinned' : 'Link pinned');
    } catch (error) {
      console.error('Error updating link:', error);
      toast.error('Failed to update pin status');
    } finally {
      setPinningLinks(prev => ({ ...prev, [linkId]: false }));
    }
  };

  const handleDelete = async (linkId: string) => {
    setDeletingLinkId(linkId);
    try {
      await deleteLink(linkId);
      toast.success('Link deleted successfully');
    } catch (error) {
      console.error('Error deleting link:', error);
      toast.error('Failed to delete link');
    } finally {
      setDeletingLinkId(null);
    }
  };

  const handleDeleteClick = (linkId: string) => {
    setLinkToDelete(linkId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (linkToDelete) {
      handleDelete(linkToDelete);
      setShowDeleteModal(false);
      setLinkToDelete(null);
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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex items-center gap-2 mb-4">
          <Pin className="w-5 h-5 text-indigo-600" />
          <h2 className="text-xl font-semibold text-gray-900">Pinned Links</h2>
          {pinnedLinks.length > 0 && (
            <button
              onClick={() => navigate('/pinned')}
              className="text-indigo-600 hover:text-indigo-700 flex items-center ml-auto"
            >
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          )}
        </div>
        {pinnedLinks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDeleteClick(link.id);
                      }}
                      disabled={deletingLinkId === link.id}
                      className={`p-1 rounded-full transition-colors ${
                        deletingLinkId === link.id
                          ? 'opacity-50 cursor-not-allowed'
                          : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                      }`}
                    >
                      {deletingLinkId === link.id ? (
                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </motion.button>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">{link.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {format(link.createdAt, 'MMM d, yyyy')}
                  </span>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-700"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-lg shadow-sm p-8 text-center"
          >
            <Pin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No pinned links yet</h3>
            <p className="mt-2 text-sm text-gray-500">
              Pin your favorite links to see them here. Click the pin icon on any link to pin it.
            </p>
          </motion.div>
        )}
      </div>

      {/* Search and Filter Bar */}
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 mt-12">
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
                          {capitalizeFirstLetter(category)}
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
                          {capitalizeFirstLetter(tag)}
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
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex items-center gap-2 mb-4">
          <Tag className="w-5 h-5 text-indigo-600" />
          <h2 className="text-xl font-semibold text-gray-900">Categories & Tags</h2>
        </div>
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
              {capitalizeFirstLetter(category)}
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
              {capitalizeFirstLetter(tag)}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Recent Links */}
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex items-center gap-2 mb-4">
          <Link2 className="w-5 h-5 text-indigo-600" />
          <h2 className="text-xl font-semibold text-gray-900">Recent Links</h2>
          <button
            onClick={() => navigate('/saved')}
            className="text-indigo-600 hover:text-indigo-700 flex items-center ml-auto"
          >
            View All
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                        handleDeleteClick(link.id);
                      }}
                      disabled={deletingLinkId === link.id}
                      className={`p-1 rounded-full transition-colors ${
                        deletingLinkId === link.id
                          ? 'opacity-50 cursor-not-allowed'
                          : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                      }`}
                    >
                      {deletingLinkId === link.id ? (
                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
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
                      {capitalizeFirstLetter(tag)}
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
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        {filteredLinks.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No links found matching your search.</p>
          </div>
        )}
        <div className="mt-8 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/add')}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>New Link</span>
          </motion.button>
        </div>
      </div>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/add')}
        className="fixed bottom-4 right-4 md:hidden p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-lg"
      >
        <Plus className="w-6 h-6" />
      </motion.button>

      {/* MindLink Tips Section */}
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex items-center gap-2 mb-6">
          <Lightbulb className="w-5 h-5 text-indigo-600" />
          <h2 className="text-xl font-semibold text-gray-900">MindLink Tips</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow p-6 border border-gray-100 cursor-pointer"
            onClick={() => navigate('/coming-soon')}
          >
            <div className="text-center py-8">
              <Lightbulb className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Using Categories</h3>
              <p className="text-sm text-gray-500">Learn how to organize your links effectively</p>
            </div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow p-6 border border-gray-100 cursor-pointer"
            onClick={() => navigate('/coming-soon')}
          >
            <div className="text-center py-8">
              <Lightbulb className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Tagging Your Links</h3>
              <p className="text-sm text-gray-500">Master the art of tagging for better organization</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex items-center gap-2 mb-6">
          <Bell className="w-5 h-5 text-indigo-600" />
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow p-6 border border-gray-100"
        >
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              <AnimatePresence mode="popLayout">
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                      delay: index * 0.1
                    }}
                    className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => {
                      if (activity.type === 'deleted') {
                        navigate('/coming-soon');
                      } else {
                        navigate(`/link/${activity.link.id}`);
                      }
                    }}
                  >
                    <div className="flex-shrink-0 mt-1">
                      {activity.type === 'pinned' && <Pin className="w-4 h-4 text-indigo-600" fill="currentColor" />}
                      {activity.type === 'unpinned' && <Pin className="w-4 h-4 text-indigo-600" fill="none" />}
                      {activity.type === 'created' && <Plus className="w-4 h-4 text-indigo-600" />}
                      {activity.type === 'deleted' && <Trash2 className="w-4 h-4 text-red-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">
                        {activity.type === 'pinned' && 'Pinned a link: '}
                        {activity.type === 'unpinned' && 'Unpinned a link: '}
                        {activity.type === 'created' && 'Added a new link: '}
                        {activity.type === 'deleted' && 'Deleted a link: '}
                        <span className="font-medium">{activity.link.title}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8"
              >
                <Bell className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Recent Activity</h3>
                <p className="text-sm text-gray-500">Your recent actions will appear here</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setLinkToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />

      {/* Categories Section Card */}
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* Section Heading */}
        <div className="flex items-center gap-2 mb-4">
          <Folder className="w-5 h-5 text-indigo-600" />
          <h2 className="text-xl font-semibold text-gray-900">Categories</h2>
        </div>
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white rounded-xl shadow p-6 border border-gray-100 cursor-pointer transition-transform"
          onClick={() => navigate('/categories')}
        >
          <p className="text-gray-600">
            Organize your links into categories for better management and quick access.
          </p>
        </motion.div>
      </div>

      {/* Feedback Section */}
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex items-center gap-2 mb-6">
          <MessageSquare className="w-5 h-5 text-indigo-600" />
          <h2 className="text-xl font-semibold text-gray-900">Share Your Feedback</h2>
        </div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow p-6 border border-gray-100 cursor-pointer"
          onClick={() => navigate('/coming-soon')}
        >
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Help Us Improve</h3>
            <p className="text-sm text-gray-500 mb-4">Share your thoughts and suggestions</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              Submit Feedback
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;