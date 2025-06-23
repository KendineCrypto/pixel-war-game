import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FaTimes, FaTrophy } from 'react-icons/fa';
import Canvas from './components/Canvas';
import Leaderboard from './components/Leaderboard';
import PaintModal from './components/PaintModal';
import TeamSelector from './components/TeamSelector';
import TimerOverlay from './components/TimerOverlay';
import { useGameStore } from './store/teamStore';

function App() {
  const { initializeGame, isInitialized, selectedTeam } = useGameStore();
  const [isLeaderboardOpen, setLeaderboardOpen] = useState(false);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const toggleLeaderboard = () => {
    setLeaderboardOpen(!isLeaderboardOpen);
  };

  if (!isInitialized) {
    return (
      <div className="w-screen h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className="w-12 h-12 border-4 border-t-blue-500 border-slate-700 rounded-full mx-auto mb-4"
          ></motion.div>
          <h2 className="text-xl font-bold">Loading Pixel Universe...</h2>
        </div>
      </div>
    );
  }

  if (!selectedTeam) {
    return (
      <div className="w-screen h-screen bg-pink-100">
        <TeamSelector />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-pink-100 flex flex-col">
      {/* Minimal Header */}
      <header className="absolute top-0 right-0 p-4 z-20">
         <button
            onClick={toggleLeaderboard}
            className="flex items-center justify-center px-4 py-2 bg-white/10 backdrop-blur-md text-pink-900 rounded-lg hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
          >
            <FaTrophy className="mr-2" />
            Leaderboard
          </button>
      </header>

      {/* Canvas Container */}
      <main className="flex-grow relative w-full h-full flex items-center justify-center">
        <Canvas />
      </main>

      {/* Overlays */}
      <TimerOverlay />
      <PaintModal />

      {/* Leaderboard Panel */}
      <AnimatePresence>
        {isLeaderboardOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-pink-50/80 backdrop-blur-lg text-pink-900 shadow-2xl z-30 border-l border-white/20"
          >
            <div className="p-4 border-b border-white/20 flex justify-between items-center">
              <h2 className="text-lg font-bold">Leaderboard</h2>
              <button onClick={toggleLeaderboard} className="p-2 rounded-full hover:bg-white/20">
                <FaTimes />
              </button>
            </div>
            <Leaderboard />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
