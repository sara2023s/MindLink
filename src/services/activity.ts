import { Timestamp } from 'firebase/firestore';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../server';

export interface ActivityLog {
  userId: string;
  action: string;
  details: Record<string, string | number | boolean | null>;
  timestamp: Timestamp;
}

export const logActivity = async (
  userId: string, 
  action: string, 
  details: Record<string, string | number | boolean | null> = {}
) => {
  try {
    const activityLog: ActivityLog = {
      userId,
      action,
      details,
      timestamp: Timestamp.now()
    };
    
    await addDoc(collection(db, 'activity_logs'), activityLog);
  } catch (error) {
    console.error('Error logging activity:', error);
    // Don't throw the error since activity logging is non-critical
  }
}; 