import React from 'react';
import { useActivities } from '../hooks/useActivities';
import { formatDistanceToNow } from 'date-fns';
import { Loader2, Link as LinkIcon, Edit2, Trash2, Eye } from 'lucide-react';
import { Activity } from '../types';

export const RecentActivities: React.FC = () => {
  const { activities, loading, error } = useActivities();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">
        {error}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="p-4 text-gray-500 text-center">
        No recent activities
      </div>
    );
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'link_created':
        return <LinkIcon className="w-4 h-4 text-green-500" />;
      case 'link_updated':
        return <Edit2 className="w-4 h-4 text-blue-500" />;
      case 'link_deleted':
        return <Trash2 className="w-4 h-4 text-red-500" />;
      case 'link_read':
        return <Eye className="w-4 h-4 text-purple-500" />;
      default:
        return <LinkIcon className="w-4 h-4" />;
    }
  };

  const getActivityText = (activity: Activity) => {
    if (activity.message) {
      return `${activity.message}: "${activity.linkTitle}"`;
    }
    
    // Fallback for old activities that don't have a message
    switch (activity.type) {
      case 'link_created':
        return `Created link "${activity.linkTitle}"`;
      case 'link_updated':
        return activity.details?.field 
          ? `Updated ${activity.details.field} of "${activity.linkTitle}"`
          : `Updated "${activity.linkTitle}"`;
      case 'link_deleted':
        return `Deleted link "${activity.linkTitle}"`;
      case 'link_read':
        return `Viewed "${activity.linkTitle}"`;
      default:
        return `Modified "${activity.linkTitle}"`;
    }
  };

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-start space-x-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="mt-1">
            {getActivityIcon(activity.type)}
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-800">
              {getActivityText(activity)}
            </p>
            <p className="text-xs text-gray-500">
              {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}; 