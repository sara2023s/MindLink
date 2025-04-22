export enum SummarizationMode {
  BULLET_POINTS = 'BULLET_POINTS',
  PARAGRAPH = 'PARAGRAPH',
  KEY_POINTS = 'KEY_POINTS',
}

export interface Link {
  id: string;
  url: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  summary?: string;
  summaryMode?: SummarizationMode;
  isArchived?: boolean;
  isFavorite?: boolean;
  notes?: string;
  previewImage?: string;
  imageUrl?: string | null;
  isProcessed: boolean;
  isPinned: boolean;
  source: 'manual' | 'import';
  contentType?: 'link' | 'reel' | 'post';
  userId: string;
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
  photoURL: string | null;
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

export interface LinkFormData {
  url: string;
  title: string;
  description: string;
  category: string;
  summary?: string;
  summaryMode?: SummarizationMode;
  tags?: string[];
  notes?: string;
}