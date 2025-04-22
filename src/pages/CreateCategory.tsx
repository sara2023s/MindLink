import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Folder, Book, Briefcase, Code, Music, Video, Image, Globe, FileText, Heart, Star, Clock, Plus, X, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useLinks } from '../hooks/useLinks';
import { Link } from '../types';
import DeleteConfirmation from '../components/DeleteConfirmation';

// Define available icons for category selection
const icons = [
  { name: 'Folder', component: Folder },
  { name: 'Book', component: Book },
  { name: 'Briefcase', component: Briefcase },
  { name: 'Code', component: Code },
  { name: 'Music', component: Music },
  { name: 'Video', component: Video },
  { name: 'Image', component: Image },
  { name: 'Globe', component: Globe },
  { name: 'FileText', component: FileText },
  { name: 'Heart', component: Heart },
  { name: 'Star', component: Star },
];

const CreateCategory: React.FC = () => {
  const navigate = useNavigate();
  const { links, updateLink } = useLinks();
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon] = useState('Folder');
  const [error, setError] = useState('');
  const [selectedLinks, setSelectedLinks] = useState<Link[]>([]);
  const availableLinks = links.filter(link => !link.isDeleted && !selectedLinks.some(l => l.id === link.id));
  const [showEmptyCategoryModal, setShowEmptyCategoryModal] = useState(false);

  // Auto-focus on the name input when component mounts
  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  const handleSave = async () => {
    // Basic validation for category name
    if (!name.trim()) {
      setError('Category name is required');
      return;
    }
    if (selectedLinks.length === 0) {
      setShowEmptyCategoryModal(true);
      return;
    }
    if (description.length > 200) {
      setError('Description cannot exceed 200 characters');
      return;
    }

    try {
      // Update each selected link with the new category
      await Promise.all(
        selectedLinks.map(link =>
          updateLink(link.id, { category: name.trim(), updatedAt: new Date() })
        )
      );
      toast.success('Category created successfully');
      navigate('/categories');
    } catch (err) {
      console.error('Error creating category:', err);
      toast.error('Failed to create category');
    }
  };

  const handleAddLinkToCategory = (link: Link) => {
    setSelectedLinks(prev => [...prev, link]);
  };

  const handleRemoveLinkFromCategory = (link: Link) => {
    setSelectedLinks(prev => prev.filter(l => l.id !== link.id));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="relative mb-8 text-center">
          <button
            onClick={() => navigate('/categories')}
            className="absolute left-0 top-1 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} className="inline-block sm:mr-2" />
            <span className="hidden sm:inline">Back to Categories</span>
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">Create New Category</h1>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          {/* Form Section */}
          <div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
                  {error}
                </div>
              )}

              {/* Name Field */}
              <div className="mb-6">
                <label htmlFor="category-name" className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name
                </label>
                <input
                  id="category-name"
                  ref={nameInputRef}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter category name"
                />
                {!name.trim() && (
                  <p className="mt-1 text-sm text-red-600">Category name is required</p>
                )}
              </div>

              {/* Description Field */}
              <div className="mb-6">
                <label htmlFor="category-description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="category-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Describe this category..."
                  rows={4}
                />
                <p className={`text-sm mt-1 ${description.length > 200 ? 'text-red-600' : 'text-gray-500'}`}>
                  {description.length}/200 characters
                </p>
              </div>

              {/* Icon Picker */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                <div className="p-4 text-center text-gray-500">
                  This feature is coming soon.
                </div>
              </div>

              {/* Links Section */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Links ({selectedLinks.length})
                </label>
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Links in this Category</h3>
                  <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
                    {selectedLinks.length > 0 ? (
                      selectedLinks.map(link => (
                        <div
                          key={link.id}
                          className="flex items-center justify-between p-3 border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
                        >
                          <div className="flex items-center space-x-3">
                            <LinkIcon size={18} className="text-gray-400" />
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">{link.title}</h4>
                              <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                              >
                                {new URL(link.url).hostname}
                                <ExternalLink size={14} className="ml-1" />
                              </a>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveLinkFromCategory(link)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                            aria-label={`Remove ${link.title} from category`}
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">No links in this category yet</div>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Available Links to Add</h3>
                  <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
                    {availableLinks.length > 0 ? (
                      availableLinks.map(link => (
                        <div
                          key={link.id}
                          className="flex items-center justify-between p-3 border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
                        >
                          <div className="flex items-center space-x-3">
                            <LinkIcon size={18} className="text-gray-400" />
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">{link.title}</h4>
                              <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                              >
                                {new URL(link.url).hostname}
                                <ExternalLink size={14} className="ml-1" />
                              </a>
                            </div>
                          </div>
                          <button
                            onClick={() => handleAddLinkToCategory(link)}
                            className="p-1 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                            aria-label={`Add ${link.title} to category`}
                          >
                            <Plus size={18} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">No more links available to add</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="mt-8 lg:mt-0">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Preview</h2>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  {(() => {
                    const IconComponent = icons.find(i => i.name === selectedIcon)?.component;
                    return IconComponent ? <IconComponent size={24} className="text-indigo-600 mr-3" /> : null;
                  })()}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{name || 'Category Name'}</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock size={14} className="mr-1" />
                      {new Date().toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              {description && (
                <p className="text-sm text-gray-600 mb-4">
                  {description.length > 100 ? `${description.substring(0, 100)}...` : description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:static lg:border-0 lg:mt-8">
          <div className="max-w-7xl mx-auto flex justify-end space-x-4">
            <button
              onClick={() => navigate('/categories')}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
      {/* Empty Category Restriction Modal */}
      <DeleteConfirmation
        isOpen={showEmptyCategoryModal}
        onClose={() => setShowEmptyCategoryModal(false)}
        onConfirm={() => setShowEmptyCategoryModal(false)}
        title="Empty Categories Coming Soon"
        message="You can't create a category without any links just yet. Support for empty categories is coming soon, so stay tuned!"
        confirmText="Got it"
        hideCancelButton={true}
      />
    </motion.div>
  );
};

export default CreateCategory; 