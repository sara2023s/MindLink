import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Tag, Calendar, Link2 } from 'lucide-react';

interface StreaksAndAchievementsProps {
  streaks: {
    dailySaveStreak: number;
    lastSavedDate: Date;
  };
  achievements: {
    totalLinksSaved: number;
    linksSavedThisWeek: number;
    linksTaggedInARow: number;
    collectionsCreatedToday: number;
    lastLoginDate: Date;
    loginStreak: number;
  };
}

const StreaksAndAchievements: React.FC<StreaksAndAchievementsProps> = ({ 
  streaks, 
  achievements 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow p-6 mb-8"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Streaks Section */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-500">Current Streaks</h4>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="text-sm text-gray-700">
              {streaks.dailySaveStreak} day save streak
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-500" />
            <span className="text-sm text-gray-700">
              {achievements.loginStreak} day login streak
            </span>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-500">Recent Achievements</h4>
          <div className="flex items-center gap-2">
            <Link2 className="w-5 h-5 text-purple-500" />
            <span className="text-sm text-gray-700">
              {achievements.linksSavedThisWeek} links saved this week
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-700">
              {achievements.linksTaggedInARow} links tagged in a row
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StreaksAndAchievements; 