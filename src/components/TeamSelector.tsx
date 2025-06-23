import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { useGameStore } from '../store/teamStore';
import { Team } from '../types';
import { TEAM_COLORS, TEAM_EMOJIS, TEAM_NAMES } from '../utils/colors';

const TeamSelector: React.FC = () => {
  const { isTeamSelectorOpen, selectTeam, isLoading } = useGameStore();

  const teams: Team[] = ['blue', 'pink', 'orange', 'purple', 'green'];

  const handleTeamSelect = async (team: Team) => {
    await selectTeam(team);
  };

  return (
    <AnimatePresence>
      {isTeamSelectorOpen && (
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
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Choose Your Team
              </h2>
              <p className="text-gray-600">
                Which team do you want to play for? This choice cannot be undone.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {teams.map((team) => (
                <motion.button
                  key={team}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleTeamSelect(team)}
                  disabled={isLoading}
                  className={`
                    relative p-4 rounded-xl border-2 transition-all duration-200
                    ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg cursor-pointer'}
                    ${`border-${team === 'blue' ? 'team-blue' : 
                        team === 'pink' ? 'team-pink' : 
                        team === 'orange' ? 'team-orange' : 
                        team === 'purple' ? 'team-purple' : 'team-green'}`}
                  `}
                  style={{
                    borderColor: TEAM_COLORS[team],
                    backgroundColor: `${TEAM_COLORS[team]}10`
                  }}
                >
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                      style={{ backgroundColor: TEAM_COLORS[team] }}
                    >
                      {TEAM_EMOJIS[team]}
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-lg text-gray-800">
                        {TEAM_NAMES[team]}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {team === 'blue' && 'Reliable and stable'}
                        {team === 'pink' && 'Creative and energetic'}
                        {team === 'orange' && 'Brave and dynamic'}
                        {team === 'purple' && 'Mysterious and powerful'}
                        {team === 'green' && 'Natural and balanced'}
                      </p>
                    </div>
                  </div>
                  
                  {isLoading && (
                    <div className="absolute inset-0 bg-white bg-opacity-75 rounded-xl flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-800"></div>
                    </div>
                  )}
                </motion.button>
              ))}
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                ⚠️ This choice cannot be changed during the game
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TeamSelector; 