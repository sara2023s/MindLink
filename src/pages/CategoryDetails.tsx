import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, Folder, Book, Briefcase, Code, Music, Video, Image, Globe, FileText, Heart, Star, X, Clock, Link as LinkIcon, Plus, ExternalLink } from 'lucide-react';
import { useLinks } from '../hooks/useLinks';
import DeleteConfirmation from '../components/DeleteConfirmation';
import { toast } from 'react-hot-toast';
import { Link } from '../types';

interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  linkCount: number;
  lastUpdated: Date;
  isPinned: boolean;
}

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

const CategoryDetails = () => {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { links, updateLink, deleteLink } = useLinks();
  const [category, setCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('Folder');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [categoryLinks, setCategoryLinks] = useState<Link[]>([]);
  const [allLinks, setAllLinks] = useState<Link[]>([]);
  const [linkToRemove, setLinkToRemove] = useState<Link | null>(null);
  const [showLastLinkModal, setShowLastLinkModal] = useState(false);

  useEffect(() => {
    const fetchCategory = () => {
      try {
        const activeLinks = links.filter(link => !link.isDeleted);
        const categoryLinks = activeLinks.filter(link => link.category === categoryId);
        setAllLinks(activeLinks);
        if (categoryLinks.length > 0) {
          const categoryData: Category = {
            id: categoryId!,
            name: categoryId!,
            description: '',
            linkCount: categoryLinks.length,
            lastUpdated: new Date(Math.max(...categoryLinks.map(l => new Date(l.updatedAt).getTime()))),
            isPinned: false
          };
          setCategory(categoryData);
          setName(categoryData.name);
          setDescription(categoryData.description || '');
          setSelectedIcon(categoryData.icon || 'Folder');
          setCategoryLinks(categoryLinks);
        }
      } catch (err) {
        console.error('Error fetching category:', err);
        setError('Failed to load category details');
      }
    };

    fetchCategory();
  }, [categoryId, links]);

  useEffect(() => {
    // Auto-focus the name input
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Category name is required');
      return;
    }

    if (description.trim()) {
      toast('Descriptions are not saved yet – this feature is coming soon!');
      setDescription('');
      return;
    }

    if (description.length > 200) {
      setError('Description cannot exceed 200 characters');
      return;
    }

    setIsSaving(true);
    try {
      // Update all links in this category with the new category name
      const updatePromises = categoryLinks.map(link => 
        updateLink(link.id, {
          ...link,
          category: name.trim(),
          title: link.title,
          url: link.url,
          description: link.description || '',
          tags: link.tags || [],
          isProcessed: link.isProcessed || false,
          isPinned: link.isPinned || false,
          isRead: link.isRead || false,
          updatedAt: new Date()
        })
      );
      await Promise.all(updatePromises);
      
      toast.success('Category updated successfully');
      navigate('/categories');
    } catch (err) {
      console.error('Error saving category:', err);
      setError('Failed to save changes');
      toast.error('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      // Delete all links in this category
      const deletePromises = categoryLinks.map(link => deleteLink(link.id));
      await Promise.all(deletePromises);
      
      toast.success('Category and all its links deleted successfully');
      navigate('/categories');
    } catch (err) {
      console.error('Error deleting category:', err);
      setError('Failed to delete category');
      toast.error('Failed to delete category');
    }
  };

  const handleAddLinkToCategory = async (link: Link) => {
    try {
      const updates: Partial<Link> = {
        category: name.trim(),
        updatedAt: new Date()
      };
      await updateLink(link.id, updates);
      setCategoryLinks(prev => [...prev, { ...link, ...updates }]);
      setAllLinks(prev => prev.map(l => l.id === link.id ? { ...l, ...updates } : l));
      toast.success('Link added to category');
    } catch (err) {
      console.error('Error adding link to category:', err);
      toast.error('Failed to add link to category');
    }
  };

  const handleRemoveLinkFromCategory = async (link: Link) => {
    try {
      const updates: Partial<Link> = {
        category: '',
        updatedAt: new Date()
      };
      await updateLink(link.id, updates);
      setCategoryLinks(prev => prev.filter(l => l.id !== link.id));
      setAllLinks(prev => prev.map(l => l.id === link.id ? { ...l, ...updates } : l));
      toast.success('Link removed from category');
    } catch (err) {
      console.error('Error removing link from category:', err);
      toast.error('Failed to remove link from category');
    }
  };

  const confirmRemoveLink = (link: Link) => {
    if (categoryLinks.filter(l => !l.isDeleted).length === 1) {
      setLinkToRemove(link);
      setShowLastLinkModal(true);
    } else {
      handleRemoveLinkFromCategory(link);
    }
  };

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Folder size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Category not found</h2>
          <p className="text-gray-600 mt-2">The category you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/categories')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Categories
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50 overflow-x-hidden"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative mb-8 text-center">
          <button
            onClick={() => navigate('/categories')}
            className="absolute left-0 top-1 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} className="inline-block mr-2" />
            Back to Categories
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">Edit Category</h1>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          {/* Form Section */}
          <div>
            {/* Category Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
                  {error}
                </div>
              )}

              {/* Name */}
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

              {/* Description */}
              <div className="mb-6">
                <label htmlFor="category-description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="category-description"
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  placeholder="This feature is coming soon"
                  rows={4}
                />
              </div>

              {/* Links Section */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Links ({categoryLinks.length})
                </label>
                
                {/* Current Category Links */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Links in this Category</h3>
                  <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
                    {categoryLinks.filter(link => !link.isDeleted).length > 0 ? (
                      categoryLinks
                        .filter(link => !link.isDeleted)
                        .map((link) => (
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
                              onClick={() => confirmRemoveLink(link)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                              aria-label={`Remove ${link.title} from category`}
                            >
                              <X size={18} />
                            </button>
                          </div>
                        ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        No links in this category yet
                      </div>
                    )}
                  </div>
                </div>

                {/* Available Links to Add */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Available Links to Add</h3>
                  <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
                    {allLinks
                      .filter(link => !link.isDeleted && !categoryLinks.some(l => l.id === link.id))
                      .length > 0 ? (
                      allLinks
                        .filter(link => !link.isDeleted && !categoryLinks.some(l => l.id === link.id))
                        .map((link) => (
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
                      <div className="p-4 text-center text-gray-500">
                        No more links available to add
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Icon Picker */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon
                </label>
                <div className="p-4 text-center text-gray-500">
                  This feature is coming soon.
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
                  {description.length > 100
                    ? `${description.substring(0, 100)}...`
                    : description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:static lg:border-0 lg:mt-8">
          <div className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
            <button
              onClick={handleDelete}
              className="w-full sm:w-auto px-6 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              <Trash2 size={18} className="inline-block mr-2" />
              Delete Category
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full sm:w-auto px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              <Save size={18} className="inline-block mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Category"
        message="Are you sure you want to delete this category? All associated links will remain, but they will no longer be categorized under this group."
      />

      {/* Last-Link Removal Confirmation Modal */}
      <DeleteConfirmation
        isOpen={showLastLinkModal}
        onClose={() => setShowLastLinkModal(false)}
        onConfirm={() => {
          if (linkToRemove) handleRemoveLinkFromCategory(linkToRemove);
          // then deleting the entire category is implicit by inferring from links
          setShowLastLinkModal(false);
        }}
        title="This Will Delete the Category"
        message={`Removing this link will also delete the category ${category?.name} because it won't contain any more links. Are you sure you want to continue?`}
        confirmText="Yes, Remove & Delete"
        cancelText="Cancel"
      />
    </motion.div>
  );
};

export default CategoryDetails; 