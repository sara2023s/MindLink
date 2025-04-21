import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useLinks } from '../hooks/useLinks';
import { Link } from '../types';
import { ArrowLeft, ExternalLink, Edit2, Save, X, Globe, FileText, Tag, Folder } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LinkDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { updateLink } = useLinks();
  const [link, setLink] = useState<Link | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedLink, setEditedLink] = useState<Partial<Link>>({});

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

  const handleTagChange = (tags: string[]) => {
    setEditedLink(prev => ({ ...prev, tags }));
  };

  const handleCategoryChange = (category: string) => {
    setEditedLink(prev => ({ ...prev, category }));
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

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        type: "spring",
        stiffness: 300
      }
    },
    tap: {
      scale: 0.95
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen py-12"
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
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
          >
            Link Details
          </motion.h1>
          <div className="w-24" />
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 space-y-8 border border-gray-100"
        >
          {/* URL Section */}
          <motion.div variants={itemVariants} className="space-y-3">
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-semibold text-gray-900">URL</h2>
            </div>
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

          {/* Title Section */}
          <motion.div variants={itemVariants} className="space-y-3">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-semibold text-gray-900">Title</h2>
            </div>
            {isEditing ? (
              <input
                type="text"
                value={editedLink.title || ''}
                onChange={(e) => setEditedLink(prev => ({ ...prev, title: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            ) : (
              <p className="text-lg text-gray-900">{link.title}</p>
            )}
          </motion.div>

          {/* Description Section */}
          <motion.div variants={itemVariants} className="space-y-3">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-semibold text-gray-900">Description</h2>
            </div>
            {isEditing ? (
              <textarea
                value={editedLink.description || ''}
                onChange={(e) => setEditedLink(prev => ({ ...prev, description: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                rows={4}
              />
            ) : (
              <p className="text-gray-700 whitespace-pre-wrap">{link.description}</p>
            )}
          </motion.div>

          {/* Category Section */}
          <motion.div variants={itemVariants} className="space-y-3">
            <div className="flex items-center space-x-2">
              <Folder className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-semibold text-gray-900">Category</h2>
            </div>
            {isEditing ? (
              <input
                type="text"
                value={editedLink.category || ''}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{link.category}</p>
            )}
          </motion.div>

          {/* Tags Section */}
          <motion.div variants={itemVariants} className="space-y-3">
            <div className="flex items-center space-x-2">
              <Tag className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-semibold text-gray-900">Tags</h2>
            </div>
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
                  placeholder="Add new tag"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value) {
                      handleTagChange([...(editedLink.tags || []), e.currentTarget.value]);
                      e.currentTarget.value = '';
                    }
                  }}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                <AnimatePresence>
                  {link.tags?.map((tag) => (
                    <motion.span
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full shadow-sm hover:shadow-md transition-shadow"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex justify-end gap-4 pt-6 border-t border-gray-200"
          >
            {isEditing ? (
              <>
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => {
                    setEditedLink(link);
                    setIsEditing(false);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <X size={20} className="inline-block mr-2" />
                  Cancel
                </motion.button>
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={handleSave}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center"
                >
                  <Save size={20} className="inline-block mr-2" />
                  Save Changes
                </motion.button>
              </>
            ) : (
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center"
              >
                <Edit2 size={20} className="inline-block mr-2" />
                Edit
              </motion.button>
            )}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LinkDetails; 