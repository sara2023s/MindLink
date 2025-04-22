import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Pin, ExternalLink, Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { useLinks } from '../hooks/useLinks';
import { Link } from '../types';
import DeleteConfirmation from './DeleteConfirmation';

interface LinkCardProps {
  link: Link;
  onDelete: (id: string) => void;
}

const cardVariants = {
  hover: {
    y: -5,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  }
};

export const LinkCard: React.FC<LinkCardProps> = ({ link, onDelete }) => {
  const navigate = useNavigate();
  const { updateLink } = useLinks();
  const [isPinned, setIsPinned] = useState(link.isPinned);
  const [isPinning, setIsPinning] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handlePinToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isPinning) return;
    
    setIsPinning(true);
    try {
      await updateLink(link.id, { isPinned: !isPinned });
      setIsPinned(!isPinned);
      toast.success(isPinned ? 'Link unpinned' : 'Link pinned');
    } catch (error) {
      console.error('Error updating pin status:', error);
      toast.error('Failed to update pin status');
    } finally {
      setIsPinning(false);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(link.id);
      toast.success('Link deleted successfully');
    } catch (error) {
      console.error('Error deleting link:', error);
      toast.error('Failed to delete link');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <motion.div 
        whileHover="hover"
        variants={cardVariants}
        className="w-full p-4 sm:p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-auto md:h-[300px] flex flex-col border border-gray-100"
      >
        <div className="flex-grow cursor-pointer flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <img 
                src={`https://www.google.com/s2/favicons?domain=${link.url}`} 
                alt="favicon" 
                className="w-5 h-5"
              />
              <h3 className="text-lg font-semibold line-clamp-2 text-gray-900">{link.title}</h3>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePinToggle}
                disabled={isPinning}
                className={`p-1 rounded-full transition-colors ${
                  isPinned 
                    ? 'text-indigo-600' 
                    : 'text-gray-400 hover:text-indigo-600'
                } ${isPinning ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isPinning ? (
                  <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Pin className="w-5 h-5" fill={isPinned ? "currentColor" : "none"} />
                )}
              </motion.button>
              <span className="text-sm text-gray-500 flex-shrink-0">
                {format(new Date(link.createdAt), 'dd/MM/yy')}
              </span>
            </div>
          </div>
          
          <div className="relative flex-grow">
            <p className="text-gray-600 mb-4 line-clamp-3">
              {link.description}
            </p>
            {link.tags && link.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {link.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {link.tags.length > 3 && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full">
                    +{link.tags.length - 3}
                  </span>
                )}
              </div>
            )}
            {link.category && (
              <div className="mb-4">
                <span className="px-3 py-1 bg-indigo-100 text-indigo-600 text-xs rounded-full">
                  {link.category}
                </span>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center mt-auto">
            <div className="flex items-center gap-2">
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-indigo-600 hover:text-indigo-700"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigate(`/link/${link.id}`);
                }}
                className="text-gray-400 hover:text-indigo-600"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleDeleteClick}
                disabled={isDeleting}
                className={`p-1 rounded-full transition-colors ${
                  isDeleting
                    ? 'opacity-50 cursor-not-allowed'
                    : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                }`}
              >
                {isDeleting ? (
                  <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      <DeleteConfirmation
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};