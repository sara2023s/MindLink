import React, { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { ExternalLink, Trash2, ChevronDown, Pin, PinOff } from 'lucide-react';
import { Link as LinkType } from '../types';
import { Link as RouterLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLinks } from '../hooks/useLinks';

interface LinkCardProps {
  link: LinkType;
  onDelete: (id: string) => void;
}

export const LinkCard: React.FC<LinkCardProps> = ({ link, onDelete }) => {
  const { updateLink } = useLinks();
  const [isPinned, setIsPinned] = useState(link.isPinned);
  const [isHovered, setIsHovered] = useState(false);
  const tagsContainerRef = useRef<HTMLDivElement>(null);
  const [visibleTags, setVisibleTags] = useState<string[]>([]);
  const [hiddenTagsCount, setHiddenTagsCount] = useState(0);

  const handlePinToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await updateLink(link.id, { isPinned: !isPinned });
      setIsPinned(!isPinned);
    } catch (error) {
      console.error('Error toggling pin status:', error);
    }
  };

  // Calculate visible tags based on container width
  useEffect(() => {
    if (!tagsContainerRef.current || !link.tags?.length) return;

    const container = tagsContainerRef.current;
    const containerWidth = container.clientWidth;
    const tags = link.tags;
    
    // Create a temporary container to measure tag widths
    const tempContainer = document.createElement('div');
    tempContainer.style.visibility = 'hidden';
    tempContainer.style.position = 'absolute';
    tempContainer.style.whiteSpace = 'nowrap';
    document.body.appendChild(tempContainer);

    const tagWidths: number[] = [];
    const moreButtonWidth = 80; // Approximate width of "+X more" button

    // Measure each tag's width
    tags.forEach(tag => {
      const tagElement = document.createElement('span');
      tagElement.className = 'tag flex-shrink-0 bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-sm';
      tagElement.textContent = tag;
      tempContainer.appendChild(tagElement);
      tagWidths.push(tagElement.offsetWidth);
    });

    // Calculate how many tags can fit
    let totalWidth = 0;
    let visibleCount = 0;

    for (let i = 0; i < tags.length; i++) {
      const tagWidth = tagWidths[i];
      
      // Always reserve space for the "+X more" button
      if (totalWidth + tagWidth + moreButtonWidth > containerWidth) {
        break;
      }
      
      totalWidth += tagWidth;
      visibleCount++;
    }

    // Clean up
    document.body.removeChild(tempContainer);

    setVisibleTags(tags.slice(0, visibleCount));
    setHiddenTagsCount(tags.length - visibleCount);
  }, [link.tags]);

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(link.id);
  };

  const cardVariants = {
    hover: {
      y: -5,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        type: "spring",
        stiffness: 300
      }
    }
  };

  const tagVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    hover: { scale: 1.05, y: -2 }
  };

  const moreTagsVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
    hover: { scale: 1.05 }
  };

  return (
    <motion.div 
      whileHover="hover"
      variants={cardVariants}
      className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-[300px] flex flex-col border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <RouterLink
        to={`/link/${link.id}`}
        className="flex-grow cursor-pointer flex flex-col"
      >
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold line-clamp-2 text-gray-900">{link.title}</h3>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePinToggle}
              className={`p-1 rounded-full transition-colors ${
                isPinned ? 'text-indigo-600' : 'text-gray-400 hover:text-indigo-600'
              }`}
            >
              {isPinned ? <Pin className="w-5 h-5" /> : <PinOff className="w-5 h-5" />}
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
        </div>
        
        <div className="flex flex-col gap-2 mb-4">
          <div 
            ref={tagsContainerRef}
            className="flex items-center gap-2 min-h-[28px] overflow-hidden"
          >
            <div className="flex items-center gap-2 flex-nowrap">
              <AnimatePresence>
                {visibleTags.map((tag: string) => (
                  <motion.span
                    key={tag}
                    variants={tagVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    className="tag flex-shrink-0 bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-sm shadow-sm hover:shadow-md transition-shadow"
                  >
                    {tag}
                  </motion.span>
                ))}
              </AnimatePresence>
              {hiddenTagsCount > 0 && (
                <motion.span
                  variants={moreTagsVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  className="flex-shrink-0 bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full text-sm shadow-sm hover:shadow-md transition-shadow flex items-center gap-1"
                >
                  +{hiddenTagsCount} more
                </motion.span>
              )}
            </div>
          </div>
        </div>
      </RouterLink>
      
      <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
        <motion.span 
          whileHover={{ scale: 1.05 }}
          className="text-sm px-3 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm"
        >
          {link.category}
        </motion.span>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDelete}
            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
            aria-label="Delete link"
          >
            <Trash2 size={16} />
          </motion.button>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
          >
            Visit Link <ExternalLink size={14} className="ml-1" />
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
};