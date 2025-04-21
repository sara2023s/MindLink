import { Schema, model, Document } from 'mongoose';

export interface IActivity extends Document {
  userId: string;
  type: 'add' | 'summarize' | 'pin' | 'folder' | 'read' | 'reminder';
  description: string;
  linkId?: string;
  folderId?: string;
  createdAt: Date;
}

const ActivitySchema = new Schema<IActivity>({
  userId: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['add', 'summarize', 'pin', 'folder', 'read', 'reminder']
  },
  description: { type: String, required: true },
  linkId: { type: String },
  folderId: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export const Activity = model<IActivity>('Activity', ActivitySchema); 