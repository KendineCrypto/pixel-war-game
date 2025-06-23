import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { useGameStore } from '../store/teamStore';
import { getTeamColor, getTeamEmoji, getTeamName } from '../utils/colors';

const PaintModal: React.FC = () => {
  const { 
    isPaintModalOpen, 
    selectedPixel, 
    selectedTeam, 
    closePaintModal, 
    paintPixel,
    canPaint,
    getTimeUntilNextPaint
  } = useGameStore();

  const handlePaint = async () => {
    if (selectedPixel && selectedTeam) {
      await paintPixel(selectedPixel.x, selectedPixel.y);
    }
  };

  const formatTime = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const timeRemaining = getTimeUntilNextPaint();

  if (!selectedPixel || !selectedTeam) return null;

  return (
    <AnimatePresence>
      {isPaintModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4"
          >
            <div className="text-center">
              <div className="mb-6">
                <div 
                  className="w-16 h-16 rounded-lg mx-auto mb-4 flex items-center justify-center text-2xl"
                  style={{ backgroundColor: getTeamColor(selectedTeam) }}
                >
                  {getTeamEmoji(selectedTeam)}
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Do you want to paint this pixel?
                </h2>
                <p className="text-gray-600 mb-4">
                  Location: X: {selectedPixel.x}, Y: {selectedPixel.y}
                </p>
                <p className="text-sm text-gray-500">
                  Team: {getTeamName(selectedTeam)}
                </p>
              </div>

              {!canPaint() && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 font-medium">
                    ⏰ Wait for the next paint
                  </p>
                  <p className="text-yellow-700 text-sm mt-1">
                    Time remaining: {formatTime(timeRemaining)}
                  </p>
                </div>
              )}

              <div className="flex space-x-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={closePaintModal}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  ❌ Cancel
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePaint}
                  disabled={!canPaint()}
                  className={`
                    flex-1 px-6 py-3 rounded-lg font-medium transition-all
                    ${canPaint()
                      ? 'bg-green-500 text-white hover:bg-green-600' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }
                  `}
                  style={{
                    backgroundColor: canPaint() ? getTeamColor(selectedTeam) : undefined
                  }}
                >
                  {'✅ Paint'}
                </motion.button>
              </div>

              <div className="mt-4 text-xs text-gray-500">
                <p>• You can paint one pixel every 5 minutes</p>
                <p>• Painted pixels can be repainted</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaintModal; 