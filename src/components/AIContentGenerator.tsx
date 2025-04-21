import { useState } from 'react';
import { useAI } from '../hooks/useAI';

export const AIContentGenerator = () => {
  const [url, setUrl] = useState('');
  const [content, setContent] = useState('');
  const [generatedContent, setGeneratedContent] = useState<{
    title: string;
    summary: string;
    categories: string[];
  } | null>(null);
  const [newText, setNewText] = useState('');
  const [expandedContent, setExpandedContent] = useState('');

  const { generateContent, addTextToContent, isLoading, error } = useAI();

  const handleGenerate = async () => {
    try {
      const result = await generateContent(url, content);
      setGeneratedContent(result);
    } catch (err) {
      console.error('Failed to generate content:', err);
    }
  };

  const handleAddText = async () => {
    if (!content) return;
    try {
      const result = await addTextToContent(content, newText);
      setExpandedContent(result);
    } catch (err) {
      console.error('Failed to add text:', err);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <h2 className="text-xl font-bold">Generate AI Content</h2>
        <input
          type="text"
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Enter content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border rounded h-32"
        />
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {isLoading ? 'Generating...' : 'Generate Content'}
        </button>
      </div>

      {error && <div className="text-red-500">{error}</div>}

      {generatedContent && (
        <div className="space-y-2">
          <h3 className="font-bold">Generated Content:</h3>
          <p><strong>Title:</strong> {generatedContent.title}</p>
          <p><strong>Summary:</strong> {generatedContent.summary}</p>
          <p><strong>Categories:</strong> {generatedContent.categories.join(', ')}</p>
        </div>
      )}

      <div className="space-y-2">
        <h2 className="text-xl font-bold">Expand Content</h2>
        <textarea
          placeholder="Enter additional text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          className="w-full p-2 border rounded h-32"
        />
        <button
          onClick={handleAddText}
          disabled={isLoading}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
        >
          {isLoading ? 'Expanding...' : 'Expand Content'}
        </button>
      </div>

      {expandedContent && (
        <div className="space-y-2">
          <h3 className="font-bold">Expanded Content:</h3>
          <p>{expandedContent}</p>
        </div>
      )}
    </div>
  );
}; 