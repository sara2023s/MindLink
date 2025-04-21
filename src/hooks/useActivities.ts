import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, limit, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Activity } from '../types';
import { useAuth } from '../context/AuthContext';

export const useActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  const fetchRecentActivities = async () => {
    if (!currentUser) return;

    try {
      const activitiesRef = collection(db, 'activities');
      
      // Get activities from the last month
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      
      const activitiesQuery = query(
        activitiesRef,
        where('userId', '==', currentUser.uid),
        where('timestamp', '>=', Timestamp.fromDate(oneMonthAgo)),
        orderBy('timestamp', 'desc'),
        limit(5) // Show only 5 most recent activities
      );

      const snapshot = await getDocs(activitiesQuery);
      
      const activitiesData = snapshot.docs
        .map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            type: data.type as Activity['type'],
            linkId: data.linkId as string,
            linkTitle: data.linkTitle as string,
            userId: data.userId as string,
            timestamp: data.timestamp.toDate(),
            message: data.message as string | undefined,
            details: data.details as Activity['details']
          };
        })
        .filter(activity => {
          // Show all types of activities
          if (activity.type === 'link_deleted') return true;
          if (activity.type === 'link_created') return true;
          if (activity.type === 'link_read') return true;
          
          // For link_updated, show all field changes
          if (activity.type === 'link_updated') {
            return true; // Show all updates
          }
          
          return false;
        }) as Activity[];
      
      setActivities(activitiesData);
    } catch (err) {
      setError('Failed to fetch recent activities');
      console.error('Error fetching activities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentActivities();
  }, [currentUser]);

  return {
    activities,
    loading,
    error,
    refreshActivities: fetchRecentActivities
  };
}; 