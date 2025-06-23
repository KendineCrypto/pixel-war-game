import { motion } from 'framer-motion';
import React, { useEffect } from 'react';
import { FaUsers } from 'react-icons/fa';
import { useGameStore } from '../store/teamStore';
import { getTeamEmoji, getTeamName } from '../utils/colors';

const Leaderboard: React.FC = () => {
  const { leaderboard, loadLeaderboard, selectedTeam } = useGameStore();

  useEffect(() => {
    loadLeaderboard();
    const interval = setInterval(loadLeaderboard, 10000); // 10 saniyede bir güncelle
    return () => clearInterval(interval);
  }, [loadLeaderboard]);

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('tr-TR').format(num);
  };

  if (leaderboard.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-pink-900/70">
        <FaUsers size={48} className="mb-4" />
        <p className="font-semibold">Loading leaderboard...</p>
        <p className="text-sm">Or no pixels have been painted yet.</p>
      </div>
    );
  }

  return (
    <div className="flex-grow p-4 space-y-2 overflow-y-auto">
      {leaderboard.map((entry, index) => (
        <motion.div
          key={entry.team}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className={`
            flex items-center justify-between p-3 rounded-xl transition-all border
            ${selectedTeam === entry.team
              ? 'bg-white/50 border-white/60 shadow-md'
              : 'bg-white/20 border-white/30'
            }
          `}
        >
          <div className="flex items-center space-x-4">
            <span className="text-lg font-bold text-pink-900/60 w-8 text-center flex-shrink-0">
              {index + 1}.
            </span>
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-lg shadow-inner"
              style={{ backgroundColor: entry.color, color: 'white', textShadow: '0px 1px 2px rgba(0,0,0,0.3)' }}
            >
              {getTeamEmoji(entry.team)}
            </div>
            <div>
              <div className="font-semibold text-pink-950">
                {getTeamName(entry.team)}
              </div>
              {selectedTeam === entry.team && (
                <div className="text-xs text-blue-600 font-medium">
                  Your team
                </div>
              )}
            </div>
          </div>

          <div className="text-right">
            <div className="font-bold text-pink-950 text-lg">
              {formatNumber(entry.count)}
            </div>
            <div className="text-sm text-pink-900/70 -mt-1">pixels</div>
          </div>
        </motion.div>
      ))}
       <div className="pt-4">
              <div className="text-xs text-pink-800/80 text-center">
                <p>The team with the most pixels is on top.</p>
                <p className="mt-1">Updates every 10 seconds.</p>
              </div>
            </div>
    </div>
  );
};

export default Leaderboard;