export interface Link {
  id: string;
  url: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  createdAt: number;
  isProcessed: boolean;
  imageUrl?: string;
  summary?: string;
} 