export interface Link {
  id: string;
  title: string;
  url: string;
  description?: string;
  category: string;
  tags?: string[];
  isProcessed?: boolean;
  isPinned?: boolean;
  isRead?: boolean;
  imageUrl?: string | null;
  source?: string;
  contentType?: 'link' | 'reel' | 'post';
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted?: boolean;
} 