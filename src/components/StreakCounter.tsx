import React from 'react';
import { motion } from 'framer-motion';

interface StreakCounterProps {
  days: number;
  animated?: boolean;
}

const StreakCounter: React.FC<StreakCounterProps> = ({ days, animated = true }) => {
  return (
    <motion.div
      className="flex items-center gap-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-4 text-white"
      initial={animated ? { scale: 0.8, opacity: 0 } : {}}
      animate={animated ? { scale: 1, opacity: 1 } : {}}
      transition={{ type: 'spring', stiffness: 200 }}
    >
      <motion.div
        animate={animated ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 1, repeat: Infinity }}
        className="text-2xl"
      >
        🔥
      </motion.div>
      <div className="flex-1">
        <p className="text-sm font-medium opacity-90">Current Streak</p>
        <motion.p
          className="text-2xl font-bold"
          key={days}
          initial={animated ? { scale: 1.2, opacity: 0 } : {}}
          animate={animated ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.3 }}
        >
          {days} {days === 1 ? 'day' : 'days'}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default StreakCounter;
