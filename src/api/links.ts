import { Request, Response } from 'express';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp, orderBy, limit } from 'firebase/firestore';
import { db } from '../server';
import { processLinkWithAI } from '../services/ai';
import { logActivity } from '../services/activity';
import { authMiddleware } from '../middleware/auth';

interface Link {
  id?: string;
  url: string;
  title: string;
  summary: string;
  tags: string[];
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  status: 'pending' | 'processed' | 'error';
  error?: string;
}

// Get all links for a user
export const getLinks = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const linksRef = collection(db, 'links');
    const q = query(
      linksRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    const links = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(links);
  } catch (error) {
    console.error('Error fetching links:', error);
    res.status(500).json({ message: 'Error fetching links' });
  }
};

// Create a new link
export const createLink = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { url, tags = [] } = req.body;
    if (!url) {
      return res.status(400).json({ message: 'URL is required' });
    }

    const newLink: Omit<Link, 'id'> = {
      url,
      title: '',
      summary: '',
      tags,
      userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      status: 'pending'
    };

    const docRef = await addDoc(collection(db, 'links'), newLink);
    
    // Process link with AI in the background
    processLinkWithAI(docRef.id, url).catch(console.error);
    
    await logActivity(userId, 'create', 'link', docRef.id);
    
    res.status(201).json({ id: docRef.id, ...newLink });
  } catch (error) {
    console.error('Error creating link:', error);
    res.status(500).json({ message: 'Error creating link' });
  }
};

// Update a link
export const updateLink = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.params;
    const { tags } = req.body;

    const linkRef = doc(db, 'links', id);
    await updateDoc(linkRef, {
      tags,
      updatedAt: Timestamp.now()
    });

    await logActivity(userId, 'update', 'link', id);
    
    res.json({ message: 'Link updated successfully' });
  } catch (error) {
    console.error('Error updating link:', error);
    res.status(500).json({ message: 'Error updating link' });
  }
};

// Reprocess a link with AI
export const reprocessLink = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.params;
    const linkRef = doc(db, 'links', id);
    
    await updateDoc(linkRef, {
      status: 'pending',
      updatedAt: Timestamp.now()
    });

    const linkDoc = await getDocs(query(linkRef));
    const linkData = linkDoc.docs[0]?.data();
    
    if (linkData) {
      processLinkWithAI(id, linkData.url).catch(console.error);
    }

    await logActivity(userId, 'reprocess', 'link', id);
    
    res.json({ message: 'Link reprocessing started' });
  } catch (error) {
    console.error('Error reprocessing link:', error);
    res.status(500).json({ message: 'Error reprocessing link' });
  }
};

// Delete a link
export const deleteLink = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.params;
    const linkRef = doc(db, 'links', id);
    await deleteDoc(linkRef);

    await logActivity(userId, 'delete', 'link', id);
    
    res.json({ message: 'Link deleted successfully' });
  } catch (error) {
    console.error('Error deleting link:', error);
    res.status(500).json({ message: 'Error deleting link' });
  }
}; 