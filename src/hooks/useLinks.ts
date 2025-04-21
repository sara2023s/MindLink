import { useState, useEffect } from 'react';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Link } from '../types';
import { useAuth } from '../context/AuthContext';

const recordActivity = async (
  type: 'link_created' | 'link_updated' | 'link_deleted' | 'link_read',
  linkId: string,
  linkTitle: string,
  userId: string,
  details?: { 
    field?: string; 
    oldValue?: string | number | boolean | string[] | { 
      title: string; 
      description: string; 
      thumbnail_url: string; 
      author_name: string; 
      author_url: string; 
      type: "video" | "rich"; 
    } | Date | null; 
    newValue?: string | number | boolean | string[] | { 
      title: string; 
      description: string; 
      thumbnail_url: string; 
      author_name: string; 
      author_url: string; 
      type: "video" | "rich"; 
    } | Date | null; 
  }
) => {
  try {
    // Determine the activity message based on the type and field
    let activityMessage = '';
    
    if (type === 'link_created') {
      activityMessage = 'Added a new link';
    } else if (type === 'link_deleted') {
      activityMessage = 'Deleted a link';
    } else if (type === 'link_read') {
      activityMessage = 'Marked a link as read';
    } else if (type === 'link_updated' && details) {
      // Group related changes into a single, user-friendly message
      if (details.field === 'isPinned') {
        const isPinned = details.newValue?.toString().toLowerCase() === 'true';
        activityMessage = isPinned ? 'Pinned a link' : 'Unpinned a link';
      } else if (details.field === 'isRead') {
        const isRead = details.newValue?.toString().toLowerCase() === 'true';
        activityMessage = isRead ? 'Marked a link as read' : 'Marked a link as unread';
      } else if (['title', 'description', 'category', 'tags'].includes(details.field || '')) {
        activityMessage = 'Updated link details';
      } else {
        // Skip recording internal field updates
        return;
      }
    }

    await addDoc(collection(db, 'activities'), {
      type,
      linkId,
      linkTitle,
      userId,
      timestamp: serverTimestamp(),
      message: activityMessage
    });
  } catch (error) {
    console.error('Error recording activity:', error);
  }
};

export const useLinks = () => {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  const fetchLinks = async () => {
    if (!currentUser) return;

    try {
      const linksRef = collection(db, 'links');
      const q = query(linksRef, where('userId', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);
      
      const linksData: Link[] = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          url: data.url as string,
          title: data.title as string,
          description: data.description as string,
          category: data.category as string,
          tags: data.tags as string[] || [],
          createdAt: data.createdAt?.toDate() ?? new Date(),
          imageUrl: data.imageUrl as string,
          isProcessed: data.isProcessed as boolean,
          isPinned: data.isPinned as boolean || false,
          source: data.source as 'manual' | 'import',
          contentType: data.contentType as 'link' | 'reel' | 'post',
          userId: data.userId as string,
          isRead: data.isRead as boolean ?? false
        };
      });
      
      setLinks(linksData);
    } catch (err) {
      setError('Failed to fetch links');
      console.error('Error fetching links:', err);
    } finally {
      setLoading(false);
    }
  };

  const addLink = async (link: Omit<Link, 'id' | 'createdAt'>) => {
    if (!currentUser) return;

    try {
      const newLink = {
        ...link,
        createdAt: serverTimestamp(),
        userId: currentUser.uid
      };

      const docRef = await addDoc(collection(db, 'links'), newLink);
      await recordActivity('link_created', docRef.id, link.title, currentUser.uid);
      await fetchLinks();
    } catch (err) {
      setError('Failed to add link');
      console.error('Error adding link:', err);
    }
  };

  const updateLink = async (id: string, updates: Partial<Link>) => {
    if (!currentUser) return;

    try {
      const linkRef = doc(db, 'links', id);
      const link = links.find(l => l.id === id);
      
      if (!link) {
        throw new Error('Link not found');
      }

      // Clean up updates by removing undefined and null values
      const cleanUpdates = Object.entries(updates).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null) {
          (acc as Record<string, unknown>)[key] = value;
        }
        return acc;
      }, {} as Partial<Link>);

      await updateDoc(linkRef, cleanUpdates);
      
      // Record activity for each change
      for (const [field, newValue] of Object.entries(cleanUpdates)) {
        await recordActivity(
          'link_updated',
          id,
          link.title,
          currentUser.uid,
          {
            field,
            oldValue: link[field as keyof Link],
            newValue
          }
        );
      }

      await fetchLinks();
    } catch (err) {
      setError('Failed to update link');
      console.error('Error updating link:', err);
    }
  };

  const deleteLink = async (id: string) => {
    if (!currentUser) return;

    try {
      const link = links.find(l => l.id === id);
      if (!link) {
        throw new Error('Link not found');
      }

      await deleteDoc(doc(db, 'links', id));
      await recordActivity('link_deleted', id, link.title, currentUser.uid);
      await fetchLinks();
    } catch (err) {
      setError('Failed to delete link');
      console.error('Error deleting link:', err);
    }
  };

  const markAsRead = async (id: string) => {
    if (!currentUser) return;

    try {
      const linkRef = doc(db, 'links', id);
      const link = links.find(l => l.id === id);
      
      if (!link) {
        throw new Error('Link not found');
      }

      await updateDoc(linkRef, { isRead: true });
      await recordActivity('link_read', id, link.title, currentUser.uid);
      await fetchLinks();
    } catch (err) {
      setError('Failed to mark link as read');
      console.error('Error marking link as read:', err);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, [currentUser]);

  return {
    links,
    loading,
    error,
    addLink,
    updateLink,
    deleteLink,
    markAsRead,
    refreshLinks: fetchLinks
  };
};