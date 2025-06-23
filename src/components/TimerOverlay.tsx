import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { FaHourglassHalf } from 'react-icons/fa';
import { useGameStore } from '../store/teamStore';

const TimerOverlay: React.FC = () => {
  const { canPaint, getTimeUntilNextPaint, selectedTeam } = useGameStore();
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    const updateTimer = () => {
      setTimeRemaining(getTimeUntilNextPaint());
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [getTimeUntilNextPaint]);

  const formatTime = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = Math.max(0, Math.min(100, (timeRemaining / (5 * 60 * 1000)) * 100));

  if (canPaint() || !selectedTeam) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-4 left-4 z-40"
      >
        <div className="bg-slate-50 rounded-2xl shadow-xl p-4 w-72 border border-slate-100">
          <div className="flex items-center space-x-4 mb-3">
            <div className="w-11 h-11 bg-slate-200 text-slate-600 rounded-full flex items-center justify-center">
              <FaHourglassHalf size={20} />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800">
                Wait for the next paint
              </h4>
              <p className="text-sm text-slate-600">
                Time remaining: {formatTime(timeRemaining)}
              </p>
            </div>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-2 mb-2 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-amber-400 to-orange-500 h-2 rounded-full"
              initial={{ width: '100%' }}
              animate={{ width: `${100 - progress}%` }}
              transition={{ duration: 1, ease: 'easeInOut' }}
            />
          </div>

          <div className="text-xs text-slate-500 text-center">
            You can paint one pixel every 5 minutes
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TimerOverlay; 