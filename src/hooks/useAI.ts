import { useState } from 'react';
import { aiService } from '../services/aiService';

export const useAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateContent = async (url: string, content: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await aiService.generateContent(url, content);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const addTextToContent = async (existingContent: string, newText: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await aiService.addTextToContent(existingContent, newText);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateContent,
    addTextToContent,
    isLoading,
    error
  };
}; 