import axios from 'axios';

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

interface ContentAnalysis {
  keywords: string[];
  topics: string[];
  summary: string;
  confidence: number;
}

interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenRouterResponseFormat {
  type: 'json_object' | 'text';
}

interface AIResponse {
  title: string;
  summary: string;
  categories: string[];
}

export const aiService = {
  async generateContent(url: string, content: string, mode: 'quick' | 'detailed' | 'bullets' = 'quick'): Promise<AIResponse> {
    try {
      const systemPrompt = {
        quick: `You are an AI assistant that helps organize and categorize content. 
        For the given URL and content, generate a JSON object with these exact keys:
        {
          "title": "A concise, engaging title",
          "summary": "A single-sentence summary (max 20 words)",
          "categories": ["3-5", "relevant", "categories/tags"]
        }
        
        IMPORTANT: Return ONLY the JSON object, no additional text or explanation.`,
        
        detailed: `You are an AI assistant that helps organize and categorize content. 
        For the given URL and content, generate a JSON object with these exact keys:
        {
          "title": "A concise, engaging title",
          "summary": "A detailed summary (3-5 sentences)",
          "categories": ["3-5", "relevant", "categories/tags"]
        }
        
        IMPORTANT: Return ONLY the JSON object, no additional text or explanation.`,
        
        bullets: `You are an AI assistant that helps organize and categorize content. 
        For the given URL and content, generate a JSON object with these exact keys:
        {
          "title": "A concise, engaging title",
          "summary": "• Point 1\\n• Point 2\\n• Point 3\\n• Point 4\\n• Point 5",
          "categories": ["3-5", "relevant", "categories/tags"]
        }
        
        IMPORTANT: 
        1. Return ONLY the JSON object, no additional text or explanation
        2. For the summary field, use bullet points (•) with each point on a new line
        3. Each bullet point should be a concise, standalone statement
        4. Include 3-5 key points that capture the most important aspects of the content
        5. Use \\n for newlines in the JSON string (not actual newlines)
        6. Keep each bullet point on a single line in the JSON`
      };

      const response = await axios.post(
        `${OPENROUTER_BASE_URL}/chat/completions`,
        {
          model: 'meta-llama/llama-2-70b-chat',
          messages: [
            {
              role: 'system',
              content: systemPrompt[mode]
            },
            {
              role: 'user',
              content: `URL: ${url}\n\nContent: ${content}`
            }
          ],
          temperature: 0.7,
          max_tokens: 500,
          response_format: { type: "json_object" }
        },
        {
          headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': window.location.origin,
            'X-Title': 'LinkMind'
          }
        }
      );

      // Check for API errors
      if (response.data.error) {
        console.error('API Error:', response.data.error);
        throw new Error(`API Error: ${response.data.error.message || 'Unknown error'}`);
      }

      // Safely parse the response
      if (!response.data?.choices?.[0]?.message?.content) {
        console.error('Invalid response structure:', response.data);
        throw new Error('Invalid AI response structure');
      }

      let aiResponse;
      try {
        const content = response.data.choices[0].message.content;
        // Try to extract JSON if the response is wrapped in markdown code blocks
        const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || 
                         content.match(/```\n([\s\S]*?)\n```/);
        const jsonContent = jsonMatch ? jsonMatch[1] : content;
        aiResponse = JSON.parse(jsonContent);
      } catch (error) {
        console.error('Error parsing AI response:', error);
        console.error('Raw content:', response.data.choices[0].message.content);
        throw new Error('Failed to parse AI response');
      }

      // Validate the response structure
      if (!aiResponse.title || !aiResponse.summary || !Array.isArray(aiResponse.categories)) {
        console.error('Invalid AI response format:', aiResponse);
        throw new Error('Invalid AI response format');
      }

      return aiResponse;
    } catch (error) {
      console.error('Error generating content:', error);
      throw new Error('Failed to generate content');
    }
  },

  async addTextToContent(existingContent: string, newText: string): Promise<string> {
    try {
      const response = await axios.post(
        `${OPENROUTER_BASE_URL}/chat/completions`,
        {
          model: 'meta-llama/llama-2-70b-chat',
          messages: [
            {
              role: 'system',
              content: 'You are an AI assistant that helps expand and improve content. Combine the existing content with the new text in a coherent way.'
            },
            {
              role: 'user',
              content: `Existing content: ${existingContent}\n\nNew text to add: ${newText}`
            }
          ],
          temperature: 0.7,
          max_tokens: 1000,
          response_format: { type: "json_object" }
        },
        {
          headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': window.location.origin,
            'X-Title': 'LinkMind'
          }
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error adding text to content:', error);
      throw new Error('Failed to add text to content');
    }
  }
};

export class AIService {
  private static instance: AIService;
  private readonly MIN_CONFIDENCE = 0.7;

  private constructor() {}

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  private async callOpenRouter(
    messages: OpenRouterMessage[], 
    responseFormat: OpenRouterResponseFormat = { type: "json_object" },
    maxRetries = 3
  ): Promise<string> {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Add explicit instruction for JSON response in the last message
        const lastMessage = messages[messages.length - 1];
        if (lastMessage.role === 'user') {
          lastMessage.content = `IMPORTANT: You must respond with ONLY a valid JSON object. Do not include any explanatory text, headers, or other content. The response must be complete and not truncated. Here is the request:\n\n${lastMessage.content}`;
        }

        // Log the request for debugging
        console.log('OpenRouter API Request:', {
          model: 'meta-llama/llama-2-70b-chat',
          messages,
          temperature: 0.3,
          max_tokens: 2000,
          response_format: responseFormat
        });

        const response = await axios.post(
          `${OPENROUTER_BASE_URL}/chat/completions`,
          {
            model: 'meta-llama/llama-2-70b-chat',
            messages,
            temperature: 0.3,
            max_tokens: 2000,
            response_format: responseFormat,
            stop: ['```', '"""', 'You are an', '<|im_end|>', '<|im_start|>', '<|end|>', '<|start|>'] // Stop at common non-JSON patterns
          },
          {
            headers: {
              'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': window.location.origin,
              'X-Title': 'LinkMind'
            }
          }
        );

        // Log the full response for debugging
        console.log('OpenRouter API Response:', response.data);

        if (!response.data?.choices?.[0]?.message?.content) {
          throw new Error('Invalid response structure');
        }

        return response.data.choices[0].message.content;
      } catch (error) {
        console.error(`Attempt ${attempt} failed:`, error);
        lastError = error as Error;
        
        if (attempt < maxRetries) {
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }

    throw lastError || new Error('Failed to call OpenRouter API');
  }

  async analyzeContent(text: string): Promise<ContentAnalysis> {
    try {
      const messages: OpenRouterMessage[] = [
        {
          role: 'system',
          content: `You are an AI assistant that analyzes content and extracts key information. 
          For the given text, generate a JSON object with these exact keys:
          {
            "keywords": ["array", "of", "important", "keywords"],
            "topics": ["main", "topics", "covered"],
            "summary": "A concise summary of the content",
            "confidence": 0.95 // A number between 0 and 1 indicating confidence in the analysis
          }
          
          IMPORTANT: Return ONLY the JSON object, no additional text or explanation.`
        },
        {
          role: 'user',
          content: text
        }
      ];

      const result = await this.callOpenRouter(messages);
      return JSON.parse(result);
    } catch (error) {
      console.error('Error analyzing content:', error);
      throw new Error('Failed to analyze content');
    }
  }
} 