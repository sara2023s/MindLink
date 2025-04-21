import express from 'express';
import axios from 'axios';
import cors from 'cors';
import NodeCache from 'node-cache';

const app = express();
const port = process.env.PORT || 3000;
const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Instagram metadata proxy endpoint
app.get('/api/instagram/oembed', async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url) {
      console.error('No URL provided in request');
      return res.status(400).json({ error: 'URL parameter is required' });
    }

    console.log('Processing request for URL:', url);

    // Check cache first
    const cachedData = cache.get(url);
    if (cachedData) {
      console.log('Returning cached Instagram data for URL:', url);
      return res.json(cachedData);
    }

    // Clean the URL by removing query parameters and trailing slashes
    const cleanUrl = url.split('?')[0].replace(/\/$/, '');
    console.log('Cleaned URL:', cleanUrl);

    try {
      // Fetch the Instagram page directly
      const response = await axios.get(cleanUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Sec-Fetch-User': '?1'
        }
      });

      const html = response.data;
      
      // Extract metadata from the HTML
      const titleMatch = html.match(/<title>(.*?)<\/title>/);
      const descriptionMatch = html.match(/<meta property="og:description" content="(.*?)"/);
      const imageMatch = html.match(/<meta property="og:image" content="(.*?)"/);
      const authorMatch = html.match(/<meta property="og:site_name" content="(.*?)"/);
      
      // Extract username from various sources
      let username = 'instagram';
      
      // Try to extract from the URL first
      const urlMatch = cleanUrl.match(/instagram\.com\/([^\/]+)/);
      if (urlMatch && urlMatch[1]) {
        username = urlMatch[1];
      }
      
      // If not found in URL, try the description
      if (username === 'instagram' && descriptionMatch) {
        const desc = descriptionMatch[1];
        const descMatch = desc.match(/ - ([^:]+):/);
        if (descMatch) {
          username = descMatch[1].trim();
        }
      }

      // Clean up the username
      username = username.replace(/[^a-zA-Z0-9._]/g, '').toLowerCase();

      // Extract caption from the description
      let caption = '';
      if (descriptionMatch) {
        const desc = descriptionMatch[1];
        // Remove likes and comments count and username
        caption = desc.replace(/^\d+,\d+ likes, \d+ comments - [^:]+: /, '');
        // Remove quotes and periods
        caption = caption.replace(/^"(.*)"\.?$/, '$1');
        // Remove any remaining quotes
        caption = caption.replace(/&quot;/g, '"');
        // Remove date if present
        caption = caption.replace(/on [A-Za-z]+ \d{1,2}, \d{4}/, '').trim();
      }

      const isReel = cleanUrl.includes('/reel/');
      const contentType = isReel ? 'reel' : 'post';
      
      // Extract hashtags from the caption
      const hashtags = caption.match(/#[a-zA-Z0-9_]+/g) || [];
      
      const metadata = {
        title: `${isReel ? 'Reel' : 'Post'} by @${username}`,
        description: caption || `${isReel ? 'Instagram Reel' : 'Instagram Post'}`,
        thumbnail_url: imageMatch ? imageMatch[1] : '',
        author_name: username,
        author_url: `https://www.instagram.com/${username}/`,
        type: 'video',
        tags: ['Instagram', contentType, `@${username}`, ...hashtags],
        contentType: contentType
      };

      console.log('Final metadata:', metadata);
      
      // Cache the successful response
      cache.set(url, metadata);
      
      res.json(metadata);
    } catch (apiError) {
      console.error('Instagram Page Fetch Error:', apiError.message);
      if (apiError.response) {
        console.error('API Error Response:', {
          status: apiError.response.status,
          data: apiError.response.data,
          headers: apiError.response.headers
        });
      }
      throw apiError;
    }
  } catch (error) {
    console.error('Error in Instagram metadata endpoint:', error);
    
    // Return a more detailed error response
    const errorResponse = {
      error: 'Failed to fetch Instagram metadata',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    };

    if (error.response) {
      errorResponse.status = error.response.status;
      errorResponse.data = error.response.data;
    }

    res.status(500).json(errorResponse);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 