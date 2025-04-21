export interface Link {
  id: string;
  url: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  createdAt: Date;
  imageUrl?: string | null;
  isProcessed: boolean;
  isPinned: boolean;
  source: 'manual' | 'import';
  contentType?: 'link' | 'reel' | 'post';
  userId: string;
  summarizationMode?: 'quick' | 'detailed' | 'bullets';
  metadata?: {
    title: string;
    description: string;
    thumbnail_url: string;
    author_name: string;
    author_url: string;
    type: 'video' | 'rich';
  } | null;
  aiSummary?: string;
  aiConfidence?: number;
  reminderDate?: Date;
  isRead: boolean;
  lastAccessed?: Date;
  aiLastProcessed?: Date;
  folderId?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  count: number;
}

export type User = {
  uid: string;
  email: string | null;
  displayName: string | null;
  isAdmin: boolean;
};

export interface Activity {
  id: string;
  type: 'link_created' | 'link_updated' | 'link_deleted' | 'link_read';
  linkId: string;
  linkTitle: string;
  userId: string;
  timestamp: Date;
  message: string;
  details?: {
    field?: string;
    oldValue?: string;
    newValue?: string;
  };
}