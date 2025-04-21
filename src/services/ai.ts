import { Timestamp } from 'firebase/firestore';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../server';

export const processLinkWithAI = async (linkId: string, url: string) => {
  try {
    // TODO: Implement actual AI processing
    // For now, we'll just simulate it
    const summary = `Summary for ${url}`;
    const title = `Title for ${url}`;
    
    const linkRef = doc(db, 'links', linkId);
    await updateDoc(linkRef, {
      title,
      summary,
      status: 'processed',
      updatedAt: Timestamp.now()
    });
    
    return { title, summary };
  } catch (error) {
    console.error('Error processing link with AI:', error);
    const linkRef = doc(db, 'links', linkId);
    await updateDoc(linkRef, {
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      updatedAt: Timestamp.now()
    });
    throw error;
  }
}; 