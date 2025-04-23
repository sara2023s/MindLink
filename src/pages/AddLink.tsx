import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, Loader2, Instagram, ArrowLeft, Pin, ExternalLink } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useLinks } from '../hooks/useLinks';
import { useAuth } from '../contexts/AuthContext';
import { instagramService } from '../services/instagramService';
import { generateLinkContent, AIService } from '../services/aiService';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { extractDomainFromUrl } from '../utils/urlUtils';
import { Link } from '../types';
import DeleteConfirmation from '../components/DeleteConfirmation';

export const AddLink: React.FC = () => {
  const navigate = useNavigate();
  const { addLink, links } = useLinks();
  const { currentUser } = useAuth();
  
  const [showMultiCatModal, setShowMultiCatModal] = useState(false);
  
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isInstagram, setIsInstagram] = useState(false);
  const [isInstagramReelOrPost, setIsInstagramReelOrPost] = useState(false);
  const [isFacebook, setIsFacebook] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [previewData, setPreviewData] = useState<{
    title: string;
    description: string;
    category: string;
    tags: string[];
  } | null>(null);

  // Check if URL is Instagram and fetch metadata
  useEffect(() => {
    const checkInstagramUrl = async () => {
      if (url && instagramService.isInstagramUrl(url)) {
        setIsInstagram(true);
        setPreviewData(null);
        const isReelOrPost = instagramService.isInstagramReelOrPost(url);
        setIsInstagramReelOrPost(isReelOrPost);
        
        if (isReelOrPost) {
          const contentType = instagramService.getContentType(url);
          const username = url.split('/')[3] || 'instagram';
          setTitle(instagramService.getDisplayTitle(username, contentType));
          setTags(instagramService.getTags());
          setDescription('');
        } else {
          setTitle('');
          setDescription('');
          setTags([]);
        }
        setIsProcessing(false);
      } else {
        setIsInstagram(false);
        setIsInstagramReelOrPost(false);
        setTitle('');
        setDescription('');
        setTags([]);
      }
    };

    checkInstagramUrl();
  }, [url]);

  // Detect Facebook URLs and prompt for description
  useEffect(() => {
    if (url && url.includes('facebook.com')) {
      setIsFacebook(true);
      setPreviewData(null);
      // reset fields
      setTitle('');
      setDescription('');
      setTags([]);
      toast(`At this stage we can't generate a description for Facebook links. Please type a short description.`, { icon: 'ℹ️' });
    } else {
      setIsFacebook(false);
    }
  }, [url]);

  // Fetch metadata when URL changes
  useEffect(() => {
    const fetchMetadata = async () => {
      // Only fetch AI metadata for non-Instagram and non-Facebook URLs
      if (
        url &&
        isValidUrl(url) &&
        !url.includes('instagram.com') &&
        !url.includes('facebook.com')
      ) {
        setIsProcessing(true);
        try {
          const aiContent = await generateLinkContent(url);
          setPreviewData(aiContent);
          if (!title) setTitle(aiContent.title);
          if (!description) setDescription(aiContent.description);
          if (!category) setCategory(aiContent.category);
          if (tags.length === 0) setTags(aiContent.tags);
        } catch (error) {
          console.error('Error fetching metadata:', error);
          toast.error('Failed to generate content. Please try again.');
        } finally {
          setIsProcessing(false);
        }
      }
    };

    fetchMetadata();
  }, [url]);

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (category.includes(',')) {
      setShowMultiCatModal(true);
      return;
    }

    if (!url) {
      setError('URL is required');
      return;
    }

    if (!isValidUrl(url)) {
      setError('Please enter a valid URL');
      return;
    }

    // Warn if social link has no description and confirm continuation
    if ((isInstagram || isFacebook) && !description.trim()) {
      const proceed = window.confirm(
        "Without a description, we can't generate tags and categories. Are you sure you want to continue?"
      );
      if (!proceed) {
        return;
      }
    }

    setIsLoading(true);
    setIsProcessing(true);

    try {
      // Gather existing tags and categories to reuse if matching
      const originalCategoriesList = links.map(l => l.category);
      const originalTagsList: string[] = links.flatMap(l => l.tags ?? []);
      let finalTitle = title;
      let finalCategory = category;
      let finalTags = [...tags];
      // Perform AI analysis: use description for social, URL for others
      try {
        let analysisKeywords: string[];
        let analysisCategory: string;
        let analysisTitle: string;
        if (isInstagram || isFacebook) {
          const analysis = await AIService.getInstance().analyzeContent(description);
          analysisKeywords = analysis.keywords;
          analysisCategory = analysis.topics[0] || '';
          // Prefix title with 'This reel' or 'This post' for Instagram content
          if (isInstagramReelOrPost) {
            const type = instagramService.getContentType(url); // 'reel' or 'post'
            analysisTitle = `This ${type} ${analysis.summary}`;
          } else {
            analysisTitle = analysis.summary;
          }
        } else {
          const aiContent = await generateLinkContent(url);
          setPreviewData(aiContent);
          analysisKeywords = aiContent.tags;
          analysisCategory = aiContent.category;
          analysisTitle = aiContent.title;
        }
        // Title: generate if empty
        finalTitle = finalTitle || analysisTitle;
        // Category: reuse existing match if any, otherwise analysis result
        const existingCat = originalCategoriesList.find(c => c.toLowerCase() === analysisCategory.toLowerCase());
        finalCategory = finalCategory || existingCat || analysisCategory;
        // Tags: if any analysis tag matches existing, use those, else use all analysis tags
        const matchedTags = originalTagsList.filter(t =>
          analysisKeywords.some(kw => kw.toLowerCase() === t.toLowerCase())
        );
        finalTags = finalTags.length > 0
          ? finalTags
          : matchedTags.length > 0
          ? matchedTags
          : analysisKeywords;
      } catch (analysisError) {
        console.error('Error during AI analysis:', analysisError);
        toast.error('Failed to generate tags and category.');
      }

      // Enforce title is a single sentence derived from description or AI
      if (finalTitle) {
        const firstSentence = finalTitle.split(/[.?!]/)[0].trim();
        finalTitle = firstSentence.endsWith('.') ? firstSentence : `${firstSentence}.`;
      }
      // Ensure Instagram links include 'instagram' (and 'reel' if reel/post)
      if (isInstagram) {
        finalTags = Array.from(new Set([...finalTags, 'instagram']));
        if (isInstagramReelOrPost) {
          finalTags = Array.from(new Set([...finalTags, 'reel']));
        }
      }
      // Ensure Facebook links include 'facebook'
      if (isFacebook) {
        finalTags = Array.from(new Set([...finalTags, 'facebook']));
      }
      const newLink: Omit<Link, 'id' | 'createdAt'> = {
        url,
        title: finalTitle || extractDomainFromUrl(url),
        description: description,
        category: finalCategory,
        tags: finalTags,
        isPinned,
        isProcessed: false,
        userId: currentUser?.uid || '',
        isRead: false,
        source: 'manual',
        updatedAt: new Date(),
        contentType: isInstagram ? 'reel' : 'link'
      };

      await addLink(newLink);

      toast.success('Link added successfully!');
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to add link. Please try again.');
      console.error(err);
      toast.error('Failed to add link');
    } finally {
      setIsLoading(false);
      setIsProcessing(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-2xl font-semibold text-gray-900">Add a New Link</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <Input
                    label="URL *"
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    fullWidth
                    required
                  />
                  {isInstagram && (
                    <div className="mt-2 flex items-center text-blue-600">
                      <Instagram size={16} className="mr-1" />
                      <span className="text-sm">Instagram {instagramService.getContentType(url)?.toUpperCase()}</span>
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <Input
                    label="Title (optional)"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={isInstagramReelOrPost 
                      ? "Enter a title for this Instagram content"
                      : "Leave blank to auto-generate"}
                    fullWidth
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description {(isInstagramReelOrPost || isFacebook) ? '*' : '(optional)'}
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={
                      isInstagramReelOrPost
                        ? "This is an Instagram link. Please describe the content or why you saved it:"
                        : isFacebook
                        ? "At this stage we can't generate a description for Facebook links. Please type a short description."
                        : "Leave blank for AI to generate a summary"
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    rows={4}
                    required={isInstagramReelOrPost || isFacebook}
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags (optional)
                  </label>
                  <div className="flex">
                    <Input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Add tags"
                      className="flex-grow"
                    />
                    <Button
                      type="button"
                      onClick={handleAddTag}
                      className="ml-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                      disabled={!tagInput.trim()}
                    >
                      <Plus size={18} />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-purple-100 text-purple-600"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(index)}
                          className="ml-1 text-purple-600 hover:text-purple-700"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center mb-6">
                  <input
                    type="checkbox"
                    id="isPinned"
                    checked={isPinned}
                    onChange={(e) => setIsPinned(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isPinned" className="ml-2 block text-sm text-gray-700">
                    Pin this link
                  </label>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
                    {error}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full sm:w-auto"
                    onClick={() => navigate('/dashboard')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading || isProcessing}
                    className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    {isLoading || isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {isProcessing ? 'Processing...' : 'Saving...'}
                      </>
                    ) : (
                      'Save Link'
                    )}
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>

          {/* Preview Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:sticky lg:top-24"
          >
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Preview</h2>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 line-clamp-2">
                    {title || previewData?.title || 'Link Title'}
                  </h3>
                  {isPinned && (
                    <Pin className="w-5 h-5 text-indigo-600" fill="currentColor" />
                  )}
                </div>
                <p className="text-sm text-gray-500 mb-4 line-clamp-3">
                  {description || previewData?.description || 'Link description will appear here'}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {(tags.length > 0 ? tags : previewData?.tags || []).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <span className="text-xs text-gray-400">
                    {new Date().toLocaleDateString()}
                  </span>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-700 flex items-center text-sm"
                  >
                    Visit Link
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </a>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Delete Confirmation Modal for multi-cat restriction */}
      <DeleteConfirmation
        isOpen={showMultiCatModal}
        onClose={() => setShowMultiCatModal(false)}
        onConfirm={() => setShowMultiCatModal(false)}
        title="Multi-Category Links Coming Soon"
        message="Assigning a link to multiple categories isn't supported yet. For now, please pick just one category. This feature will be available in a future update!"
        confirmText="Understood"
        hideCancelButton={true}
      />
    </div>
  );
};