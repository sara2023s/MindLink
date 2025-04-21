import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link2, Plus, X, Loader2, Instagram } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useLinks } from '../hooks/useLinks';
import { instagramService } from '../services/instagramService';

type SummarizationMode = 'quick' | 'detailed' | 'bullets';

export const AddLink: React.FC = () => {
  const navigate = useNavigate();
  const { addLink } = useLinks();
  
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isInstagram, setIsInstagram] = useState(false);
  const [isInstagramReelOrPost, setIsInstagramReelOrPost] = useState(false);
  const [summarizationMode, setSummarizationMode] = useState<SummarizationMode>('quick');

  // Check if URL is Instagram and fetch metadata
  useEffect(() => {
    const checkInstagramUrl = async () => {
      if (url && instagramService.isInstagramUrl(url)) {
        setIsInstagram(true);
        const isReelOrPost = instagramService.isInstagramReelOrPost(url);
        setIsInstagramReelOrPost(isReelOrPost);
        
        if (isReelOrPost) {
          const contentType = instagramService.getContentType(url);
          const username = url.split('/')[3] || 'instagram';
          setTitle(instagramService.getDisplayTitle(username, contentType));
          setTags(instagramService.getTags(contentType, username));
          setDescription('');
        } else {
          // For non-reel/post Instagram links, use regular metadata extraction
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

    if (!url) {
      setError('URL is required');
      return;
    }

    if (!isValidUrl(url)) {
      setError('Please enter a valid URL');
      return;
    }

    if (isInstagramReelOrPost && !description) {
      setError('Please provide a description for this Instagram content');
      return;
    }

    setIsLoading(true);
    setIsProcessing(true);

    try {
      await addLink({
        url,
        title: title || extractDomainFromUrl(url),
        description,
        tags,
        category: isInstagramReelOrPost 
          ? (instagramService.getContentType(url) === 'reel' ? 'Instagram Reel' : 'Instagram Post') 
          : 'Uncategorized',
        source: 'manual',
        summarizationMode
      });

      // Show processing state for a moment before navigating
      setTimeout(() => {
        setIsProcessing(false);
        navigate('/');
      }, 1000);
    } catch (err) {
      setError('Failed to add link. Please try again.');
      console.error(err);
      setIsProcessing(false);
    } finally {
      setIsLoading(false);
    }
  };

  const extractDomainFromUrl = (url: string): string => {
    try {
      const hostname = new URL(url).hostname;
      return hostname.replace(/^www\./, '');
    } catch {
      return url;
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
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Add a New Link</h1>
      <p className="text-gray-600 mb-6">
        Save a new link to your collection. Our AI will automatically summarize and categorize it for you.
      </p>

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
            <p className="text-xs text-gray-500 mt-1">
              {isInstagramReelOrPost 
                ? "Add a descriptive title for this Instagram content"
                : "If left blank, a title will be generated from the URL"}
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description {isInstagramReelOrPost ? '*' : '(optional)'}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={isInstagramReelOrPost 
                ? "This is an Instagram link. Please describe the content or why you saved it:"
                : "Leave blank for AI to generate a summary"}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              rows={4}
              required={isInstagramReelOrPost}
            />
            <p className="text-xs text-gray-500 mt-1">
              {isInstagramReelOrPost 
                ? "Please describe what this content is about or why you saved it"
                : "If left blank, AI will generate a summary of the content"}
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Summarization Mode
            </label>
            <select
              value={summarizationMode}
              onChange={(e) => setSummarizationMode(e.target.value as SummarizationMode)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            >
              <option value="quick">Quick Summary (1-2 sentences)</option>
              <option value="detailed">Detailed Summary (3-5 sentences)</option>
              <option value="bullets">Bullet Points</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Choose how you want the content to be summarized
            </p>
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
                className="ml-2"
                disabled={!tagInput.trim()}
              >
                <Plus size={18} />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Press Enter or click + to add tags
            </p>
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full flex items-center"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/')}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
              icon={isLoading ? undefined : <Link2 size={18} />}
            >
              Save Link
            </Button>
          </div>

          {isProcessing && (
            <div className="mt-4 p-4 bg-blue-50 rounded-md flex items-center space-x-2">
              <Loader2 className="animate-spin text-blue-500" size={20} />
              <span className="text-blue-700">
                {isInstagram ? "Fetching Instagram metadata..." : "AI is processing your link..."}
              </span>
            </div>
          )}
        </form>
      </Card>
    </div>
  );
};