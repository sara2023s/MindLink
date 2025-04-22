import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useLinks } from '../hooks/useLinks';
import { Link } from '../types';
import { ArrowLeft, ExternalLink, Edit2, Pin, Trash2, Clock, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import DeleteConfirmation from '../components/DeleteConfirmation';

const LinkDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { links, updateLink, deleteLink } = useLinks();
  const [link, setLink] = useState<Link | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedLink, setEditedLink] = useState<Partial<Link>>({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLastCategoryModal, setShowLastCategoryModal] = useState(false);

  useEffect(() => {
    const fetchLink = async () => {
      if (!id) return;
      
      try {
        const linkRef = doc(db, 'links', id);
        const linkDoc = await getDoc(linkRef);
        
        if (linkDoc.exists()) {
          const linkData = { id: linkDoc.id, ...linkDoc.data() } as Link;
          setLink(linkData);
          setEditedLink(linkData);
        }
      } catch (error) {
        console.error('Error fetching link:', error);
      }
    };

    fetchLink();
  }, [id]);

  const handleSave = async () => {
    if (!link || !id) return;

    try {
      await updateLink(id, editedLink);
      setLink({ ...link, ...editedLink });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating link:', error);
    }
  };

  const handleDelete = async () => {
    if (!id || !link) return;
    const categoryName = link.category;
    if (categoryName) {
      const otherLinks = links.filter(l => l.category === categoryName && l.id !== id && !l.isDeleted);
      if (otherLinks.length === 0) {
        setShowLastCategoryModal(true);
        return;
      }
    }
    try {
      await deleteLink(id);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error deleting link:', error);
    }
  };

  const confirmDelete = async () => {
    if (!id) return;
    try {
      await deleteLink(id);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error deleting link:', error);
    } finally {
      setShowLastCategoryModal(false);
    }
  };

  const handleTagChange = (tags: string[]) => {
    setEditedLink(prev => ({ ...prev, tags }));
  };

  const handleCategoryChange = (category: string) => {
    setEditedLink(prev => ({ ...prev, category }));
  };

  const togglePin = async () => {
    if (!link || !id) return;
    try {
      await updateLink(id, { isPinned: !link.isPinned });
      setLink({ ...link, isPinned: !link.isPinned });
    } catch (error) {
      console.error('Error toggling pin:', error);
    }
  };

  if (!link) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        staggerChildren: 0.1
      }
    }
  };

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

  const getDomain = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return domain.startsWith('www.') ? domain.substring(4) : domain;
    } catch {
      return url;
    }
  };

  const getFormattedDate = (date: Date | { toDate: () => Date } | string) => {
    try {
      if (date instanceof Date) {
        return format(date, 'MMM d, yyyy');
      } else if (typeof date === 'object' && 'toDate' in date) {
        return format(date.toDate(), 'MMM d, yyyy');
      } else if (typeof date === 'string') {
        return format(new Date(date), 'MMM d, yyyy');
      }
      return 'Unknown date';
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      {/* Animated blob background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="flex justify-between items-center mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Dashboard
          </motion.button>
          <div className="flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={togglePin}
              className={`p-1 rounded-full transition-colors ${
                link.isPinned 
                  ? 'text-indigo-600' 
                  : 'text-gray-400 hover:text-indigo-600'
              }`}
            >
              <Pin className="w-5 h-5" fill={link.isPinned ? "currentColor" : "none"} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(!isEditing)}
              className="p-1 rounded-full text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              <Edit2 className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDeleteModal(true)}
              className="p-1 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 space-y-8 border border-gray-100"
        >
          {/* Title Section */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center space-x-4">
              <img 
                src={`https://www.google.com/s2/favicons?domain=${link.url}`} 
                alt="favicon" 
                className="w-8 h-8"
              />
              <h1 className="text-3xl font-bold text-gray-900">{link.title}</h1>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Clock size={16} className="mr-1" />
                {getFormattedDate(link.createdAt)}
              </div>
              <div className="flex items-center">
                <Globe size={16} className="mr-1" />
                {getDomain(link.url)}
              </div>
            </div>
          </motion.div>

          {/* URL Section */}
          <motion.div variants={itemVariants} className="space-y-3">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-800 hover:underline break-all flex items-center"
            >
              {link.url}
              <ExternalLink size={16} className="ml-2" />
            </a>
          </motion.div>

          {/* AI Summary Section */}
          <motion.div variants={itemVariants} className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">AI Summary</h2>
            <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
              <p className="text-gray-700 whitespace-pre-wrap">{link.description}</p>
            </div>
          </motion.div>

          {/* Category Section */}
          <motion.div variants={itemVariants} className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">Category</h2>
            {isEditing ? (
              <input
                type="text"
                value={editedLink.category || ''}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            ) : (
              <span className="inline-block bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full">
                {link.category}
              </span>
            )}
          </motion.div>

          {/* Tags Section */}
          <motion.div variants={itemVariants} className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">Tags</h2>
            {isEditing ? (
              <div className="flex flex-wrap gap-2">
                <AnimatePresence>
                  {editedLink.tags?.map((tag, index) => (
                    <motion.div
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ scale: 1.05 }}
                      className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full flex items-center shadow-sm hover:shadow-md transition-shadow"
                    >
                      <span>{tag}</span>
                      <button
                        onClick={() => handleTagChange(editedLink.tags?.filter((_, i) => i !== index) || [])}
                        className="ml-2 text-red-600 hover:text-red-800"
                      >
                        ×
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <input
                  type="text"
                  placeholder="Add tag..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                      handleTagChange([...(editedLink.tags || []), e.currentTarget.value.trim()]);
                      e.currentTarget.value = '';
                    }
                  }}
                  className="px-3 py-1 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {link.tags?.map((tag) => (
                  <motion.span
                    key={tag}
                    whileHover={{ scale: 1.05 }}
                    className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full shadow-sm hover:shadow-md transition-shadow"
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            )}
          </motion.div>

          {/* Related Links Section (Placeholder) */}
          <motion.div variants={itemVariants} className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">Related Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-500 italic">Related links feature coming soon...</p>
              </div>
            </div>
          </motion.div>

          {isEditing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-end space-x-4 mt-8"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Save Changes
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>

      <DeleteConfirmation
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
      />
      {/* Last-Link-in-Category Deletion Confirmation */}
      <DeleteConfirmation
        isOpen={showLastCategoryModal}
        onClose={() => setShowLastCategoryModal(false)}
        onConfirm={confirmDelete}
        title="This Will Delete the Category"
        message={`Removing this link will also delete the category ${link?.category} because it won't contain any more links. Are you sure you want to continue?`}
        confirmText="Yes, Remove & Delete"
        cancelText="Cancel"
      />
    </motion.div>
  );
};

export default LinkDetails; 