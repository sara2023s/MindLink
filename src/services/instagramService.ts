export interface InstagramMetadata {
  url: string;
  contentType: 'reel' | 'post';
  author_name?: string;
}

export const instagramService = {
  isInstagramUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.includes('instagram.com');
    } catch {
      return false;
    }
  },

  isInstagramReelOrPost(url: string): boolean {
    const pattern = /^https?:\/\/(www\.)?instagram\.com\/(reel|p)\/[A-Za-z0-9_-]+/;
    return pattern.test(url);
  },

  getContentType(url: string): 'reel' | 'post' {
    const cleanUrl = url.split('?')[0].replace(/\/$/, '');
    return cleanUrl.includes('/reel/') ? 'reel' : 'post';
  },

  getDisplayTitle(username: string, contentType: 'reel' | 'post'): string {
    return `${contentType === 'reel' ? 'Reel' : 'Post'} by @${username}`;
  },

  getTags(): string[] {
    return ['Instagram'];
  }
}; 