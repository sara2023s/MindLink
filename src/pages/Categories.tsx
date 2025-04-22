import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Folder, Search, Book, Briefcase, Code, Music, Video, Image, Globe, FileText, Heart, Star, Pin, Tag, Users, Clock, HelpCircle, Dot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLinks } from '../hooks/useLinks';
import DeleteConfirmation from '../components/DeleteConfirmation';
import { Card } from '../components/ui/Card';

interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  linkCount: number;
  lastUpdated: Date;
  tags: string[];
  isPinned: boolean;
  collaborators?: string[];
}

const getCategoryIcon = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  if (name.includes('book') || name.includes('read')) return <Book size={24} className="text-indigo-600" />;
  if (name.includes('work') || name.includes('business')) return <Briefcase size={24} className="text-indigo-600" />;
  if (name.includes('code') || name.includes('dev')) return <Code size={24} className="text-indigo-600" />;
  if (name.includes('music') || name.includes('audio')) return <Music size={24} className="text-indigo-600" />;
  if (name.includes('video') || name.includes('movie')) return <Video size={24} className="text-indigo-600" />;
  if (name.includes('image') || name.includes('photo')) return <Image size={24} className="text-indigo-600" />;
  if (name.includes('web') || name.includes('site')) return <Globe size={24} className="text-indigo-600" />;
  if (name.includes('doc') || name.includes('file')) return <FileText size={24} className="text-indigo-600" />;
  if (name.includes('favorite') || name.includes('like')) return <Heart size={24} className="text-indigo-600" />;
  if (name.includes('star') || name.includes('featured')) return <Star size={24} className="text-indigo-600" />;
  return <Folder size={24} className="text-indigo-600" />;
};

const Categories = () => {
  const navigate = useNavigate();
  const { links } = useLinks();
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'links' | 'updated'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesMap = new Map<string, Category>();
        
        links.forEach(link => {
          if (link.category) {
            const existing = categoriesMap.get(link.category);
            if (existing) {
              existing.linkCount += 1;
              if (link.updatedAt && new Date(link.updatedAt) > existing.lastUpdated) {
                existing.lastUpdated = new Date(link.updatedAt);
              }
            } else {
              categoriesMap.set(link.category, {
                id: link.category,
                name: link.category,
                description: '',
                linkCount: 1,
                lastUpdated: link.updatedAt ? new Date(link.updatedAt) : new Date(),
                tags: [],
                isPinned: false
              });
            }
          }
        });

        setCategories(Array.from(categoriesMap.values()));
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [links]);

  const filteredCategories = categories
    .filter(category =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy === 'links') {
        return sortOrder === 'asc'
          ? a.linkCount - b.linkCount
          : b.linkCount - a.linkCount;
      } else {
        return sortOrder === 'asc'
          ? a.lastUpdated.getTime() - b.lastUpdated.getTime()
          : b.lastUpdated.getTime() - a.lastUpdated.getTime();
      }
    });

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      setCategories(prev => [...prev, {
        id: newCategoryName.trim(),
        name: newCategoryName.trim(),
        description: newCategoryDescription.trim(),
        linkCount: 0,
        lastUpdated: new Date(),
        tags: [],
        isPinned: false
      }]);
      setNewCategoryName('');
      setNewCategoryDescription('');
      setIsAddingCategory(false);
    }
  };

  const handleSaveEdit = (categoryId: string) => {
    setCategories(prev => prev.map(category =>
      category.id === categoryId
        ? { ...category, name: editName, description: editDescription }
        : category
    ));
    setIsEditing(null);
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(prev => prev.filter(category => category.id !== categoryId));
    setShowDeleteModal(null);
  };

  const togglePin = (categoryId: string) => {
    setCategories(prev => prev.map(category =>
      category.id === categoryId
        ? { ...category, isPinned: !category.isPinned }
        : category
    ));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
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
    },
    hover: {
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50 flex flex-col lg:flex-row"
    >
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md p-4 hidden lg:block">
        <div className="mt-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Sort By</h2>
          <div className="space-y-2">
            <button
              onClick={() => {
                setSortBy('name');
                setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
              }}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                sortBy === 'name' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => {
                setSortBy('links');
                setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
              }}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                sortBy === 'links' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Number of Links {sortBy === 'links' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => {
                setSortBy('updated');
                setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
              }}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                sortBy === 'updated' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Last Updated {sortBy === 'updated' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Categories</h1>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search categories by name, description, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Categories Grid */}
        {categories.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center py-8"
          >
            <Folder size={48} className="text-gray-400 mb-3" />
            <h3 className="text-xl font-semibold text-gray-900 mb-1">
              No Categories Yet
            </h3>
            <p className="text-gray-600 mb-4">
              You haven't created any categories yet. Start by adding one!
            </p>
            <button
              onClick={() => setIsAddingCategory(true)}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors"
            >
              Create Your First Category
            </button>
          </motion.div>
        ) : (
          <>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {filteredCategories.map((category) => (
                <motion.div
                  key={category.id}
                  variants={itemVariants}
                  whileHover="hover"
                  className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 cursor-pointer ${
                    category.isPinned ? 'border-l-4 border-indigo-500' : ''
                  }`}
                  onClick={() => navigate(`/category/${category.id}`)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      {getCategoryIcon(category.name)}
                      <div className="ml-3">
                        {isEditing === category.id ? (
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="border-b border-gray-300 focus:border-indigo-500 focus:outline-none text-lg font-semibold"
                          />
                        ) : (
                          <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                        )}
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock size={14} className="mr-1" />
                          {category.lastUpdated.toLocaleDateString()}
                        </div>
                        {category.description && (
                          <p className="text-sm text-gray-600 mt-1">
                            {category.description.length > 100
                              ? `${category.description.substring(0, 100)}...`
                              : category.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePin(category.id);
                        }}
                        className={`p-1 rounded-full transition-colors ${
                          category.isPinned 
                            ? 'text-indigo-600' 
                            : 'text-gray-400 hover:text-indigo-600'
                        }`}
                      >
                        <Pin className="w-5 h-5" fill={category.isPinned ? "currentColor" : "none"} />
                      </button>
                      {isEditing === category.id ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSaveEdit(category.id);
                          }}
                          className="text-indigo-600 hover:text-indigo-700"
                        >
                          Save
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/category/${category.id}/edit`);
                            }}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowDeleteModal(category.id);
                            }}
                            className="text-gray-400 hover:text-red-600"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {isEditing === category.id ? (
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Add a description..."
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                      rows={2}
                    />
                  ) : (
                    <div className="space-y-2">
                      {category.description && (
                        <p className="text-sm text-gray-600">
                          {expandedCategory === category.id
                            ? category.description
                            : `${category.description.substring(0, 100)}${category.description.length > 100 ? '...' : ''}`
                          }
                          {category.description.length > 100 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedCategory(expandedCategory === category.id ? null : category.id);
                              }}
                              className="text-indigo-600 hover:text-indigo-700 ml-1"
                            >
                              {expandedCategory === category.id ? 'Show less' : 'Show more'}
                            </button>
                          )}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">
                            {category.linkCount} {category.linkCount === 1 ? 'link' : 'links'}
                          </span>
                          {category.tags.length > 0 && (
                            <div className="flex items-center">
                              <Tag size={14} className="text-gray-400 mr-1" />
                              <span className="text-sm text-gray-500">
                                {category.tags.join(', ')}
                              </span>
                            </div>
                          )}
                        </div>
                        {category.collaborators && category.collaborators.length > 0 && (
                          <div className="flex items-center">
                            <Users size={14} className="text-gray-400 mr-1" />
                            <span className="text-sm text-gray-500">
                              {category.collaborators.length} {category.collaborators.length === 1 ? 'collaborator' : 'collaborators'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>

            {/* Pinned Categories Section */}
            <div className="mt-16">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Pin size={20} className="text-indigo-600 mr-2" />
                Pinned Categories
              </h2>
              {categories.some(category => category.isPinned) ? (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {filteredCategories
                    .filter(category => category.isPinned)
                    .map((category) => (
                      <motion.div
                        key={category.id}
                        variants={itemVariants}
                        whileHover="hover"
                        className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 cursor-pointer border-l-4 border-indigo-500"
                        onClick={() => navigate(`/category/${category.id}`)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center">
                            {getCategoryIcon(category.name)}
                            <div className="ml-3">
                              <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                              <div className="flex items-center text-sm text-gray-500">
                                <Clock size={14} className="mr-1" />
                                {category.lastUpdated.toLocaleDateString()}
                              </div>
                              {category.description && (
                                <p className="text-sm text-gray-600 mt-1">
                                  {category.description.length > 100
                                    ? `${category.description.substring(0, 100)}...`
                                    : category.description}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                togglePin(category.id);
                              }}
                              className={`p-1 rounded-full transition-colors ${
                                category.isPinned 
                                  ? 'text-indigo-600' 
                                  : 'text-gray-400 hover:text-indigo-600'
                              }`}
                            >
                              <Pin className="w-5 h-5" fill={category.isPinned ? "currentColor" : "none"} />
                            </button>
                            {isEditing === category.id ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSaveEdit(category.id);
                                }}
                                className="text-indigo-600 hover:text-indigo-700"
                              >
                                Save
                              </button>
                            ) : (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/category/${category.id}/edit`);
                                  }}
                                  className="text-gray-400 hover:text-gray-600"
                                >
                                  <Edit2 size={18} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowDeleteModal(category.id);
                                  }}
                                  className="text-gray-400 hover:text-red-600"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        {isEditing === category.id ? (
                          <textarea
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            placeholder="Add a description..."
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                            rows={2}
                          />
                        ) : (
                          <div className="space-y-2">
                            {category.description && (
                              <p className="text-sm text-gray-600">
                                {expandedCategory === category.id
                                  ? category.description
                                  : `${category.description.substring(0, 100)}${category.description.length > 100 ? '...' : ''}`
                                }
                                {category.description.length > 100 && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setExpandedCategory(expandedCategory === category.id ? null : category.id);
                                    }}
                                    className="text-indigo-600 hover:text-indigo-700 ml-1"
                                  >
                                    {expandedCategory === category.id ? 'Show less' : 'Show more'}
                                  </button>
                                )}
                              </p>
                            )}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-500">
                                  {category.linkCount} {category.linkCount === 1 ? 'link' : 'links'}
                                </span>
                                {category.tags.length > 0 && (
                                  <div className="flex items-center">
                                    <Tag size={14} className="text-gray-400 mr-1" />
                                    <span className="text-sm text-gray-500">
                                      {category.tags.join(', ')}
                                    </span>
                                  </div>
                                )}
                              </div>
                              {category.collaborators && category.collaborators.length > 0 && (
                                <div className="flex items-center">
                                  <Users size={14} className="text-gray-400 mr-1" />
                                  <span className="text-sm text-gray-500">
                                    {category.collaborators.length} {category.collaborators.length === 1 ? 'collaborator' : 'collaborators'}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                </motion.div>
              ) : (
                <div className="rounded-lg p-6 text-center border border-gray-200">
                  <Pin size={24} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-600">
                    No pinned categories yet. Pin important categories to keep them easily accessible.
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Add Category Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/create-category')}
          className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 flex items-center p-4 sm:px-6 sm:py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full shadow-lg hover:from-purple-700 hover:to-indigo-700 transition-colors"
        >
          <Plus size={24} className="mr-0 sm:mr-2" />
          <span className="hidden sm:inline">Add New Category</span>
        </motion.button>

        {/* Add Category Modal */}
        <AnimatePresence>
          {isAddingCategory && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-xl p-4 max-w-md w-full"
              >
                <h3 className="text-lg font-semibold mb-3">Add New Category</h3>
                <input
                  type="text"
                  placeholder="Category name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <textarea
                  placeholder="Add a description (optional)"
                  value={newCategoryDescription}
                  onChange={(e) => setNewCategoryDescription(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows={3}
                />
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setIsAddingCategory(false)}
                    className="px-3 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddCategory}
                    className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Add Category
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmation
          isOpen={!!showDeleteModal}
          onClose={() => setShowDeleteModal(null)}
          onConfirm={() => showDeleteModal && handleDeleteCategory(showDeleteModal)}
        />

        {/* Help Section */}
        <Card className="bg-muted p-6 rounded-2xl shadow-sm max-w-2xl w-full mt-16">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle size={20} className="text-indigo-600" />
            <h2 className="text-lg font-semibold">Need Help?</h2>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <Dot size={16} className="text-muted-foreground mt-1" />
              Click on a category to view its links
            </li>
            <li className="flex items-start gap-2">
              <Dot size={16} className="text-muted-foreground mt-1" />
              Use the search bar to find categories by name, description, or tags
            </li>
            <li className="flex items-start gap-2">
              <Dot size={16} className="text-muted-foreground mt-1" />
              Sort categories by name, number of links, or last updated date
            </li>
            <li className="flex items-start gap-2">
              <Dot size={16} className="text-muted-foreground mt-1" />
              Pin important categories to keep them at the top
            </li>
            <li className="flex items-start gap-2">
              <Dot size={16} className="text-muted-foreground mt-1" />
              Add descriptions and tags to better organize your categories
            </li>
          </ul>
        </Card>
      </div>
    </motion.div>
  );
};

export default Categories; 