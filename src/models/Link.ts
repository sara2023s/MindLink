import { Schema, model, Document } from 'mongoose';

export interface ILink extends Document {
  title: string;
  url: string;
  description?: string;
  category: string;
  tags: string[];
  userId: string;
  isPinned: boolean;
  lastAccessed?: Date;
  createdAt: Date;
  updatedAt: Date;
  aiSummary?: string;
  aiConfidence?: number;
  aiLastProcessed?: Date;
  reminderDate?: Date;
  isRead: boolean;
}

const LinkSchema = new Schema<ILink>({
  title: { type: String, required: true },
  url: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  tags: [{ type: String }],
  userId: { type: String, required: true },
  isPinned: { type: Boolean, default: false },
  lastAccessed: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  aiSummary: { type: String },
  aiConfidence: { type: Number },
  aiLastProcessed: { type: Date },
  reminderDate: { type: Date },
  isRead: { type: Boolean, default: false }
});

export const Link = model<ILink>('Link', LinkSchema); 