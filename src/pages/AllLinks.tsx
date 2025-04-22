import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLinks } from '../hooks/useLinks';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Pin, ExternalLink, Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import DeleteConfirmation from '../components/DeleteConfirmation';

const AllLinks = () => {
  const navigate = useNavigate();
  const { links, loading, deleteLink, updateLink } = useLinks();
  const [deletingLinkId, setDeletingLinkId] = useState<string | null>(null);
  const [pinningLinks, setPinningLinks] = useState<Record<string, boolean>>({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState<string | null>(null);

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
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-2xl font-semibold text-gray-900">All Links</h1>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-sm">
                {links.length} links
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence>
          {links.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <Pin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No links yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Add your first link to get started
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {links.map((link) => (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900 line-clamp-2">
                      {link.title}
                    </h3>
                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handlePinLink(link.id)}
                        disabled={pinningLinks[link.id]}
                        className={`p-1 rounded-full transition-colors ${
                          link.isPinned 
                            ? 'text-indigo-600' 
                            : 'text-gray-400 hover:text-indigo-600'
                        } ${pinningLinks[link.id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {pinningLinks[link.id] ? (
                          <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Pin className="w-5 h-5" fill={link.isPinned ? "currentColor" : "none"} />
                        )}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate(`/link/${link.id}`)}
                        className="p-1 rounded-full text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                      >
                        <Edit2 className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteClick(link.id)}
                        disabled={deletingLinkId === link.id}
                        className={`p-1 rounded-full transition-colors ${
                          deletingLinkId === link.id
                            ? 'opacity-50 cursor-not-allowed'
                            : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                        }`}
                      >
                        {deletingLinkId === link.id ? (
                          <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-5 h-5" />
                        )}
                      </motion.button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 mb-4 line-clamp-3">
                    {link.description}
                  </p>

                  {link.tags && link.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {link.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-auto">
                    <span className="text-xs text-gray-400">
                      {format(link.createdAt, 'MMM d, yyyy')}
                    </span>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-700 flex items-center text-sm"
                    >
                      Visit Link
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <DeleteConfirmation
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setLinkToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default AllLinks; 