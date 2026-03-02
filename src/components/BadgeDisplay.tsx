import React from 'react';
import { motion } from 'framer-motion';
import { Award } from 'lucide-react';

interface BadgeProps {
  name: string;
  icon: string;
  earned: boolean;
  progress?: number;
}

interface BadgeDisplayProps {
  badges: BadgeProps[];
  animated?: boolean;
}

const BadgeDisplay: React.FC<BadgeDisplayProps> = ({ badges, animated = true }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1 },
  };

  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-3 gap-4"
      variants={animated ? container : {}}
      initial={animated ? 'hidden' : ''}
      animate={animated ? 'show' : ''}
    >
      {badges.map((badge, index) => (
        <motion.div
          key={badge.name}
          variants={animated ? item : {}}
          className={`relative p-4 rounded-lg border-2 transition-all ${
            badge.earned
              ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-400'
              : 'bg-dark-300 border-dark-100 opacity-50'
          }`}
          whileHover={badge.earned ? { scale: 1.05 } : {}}
          whileTap={badge.earned ? { scale: 0.95 } : {}}
        >
          {badge.earned && (
            <motion.div
              className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </motion.div>
          )}

          <div className="text-3xl mb-2">{badge.icon}</div>
          <h3 className="font-semibold text-sm text-white mb-1">{badge.name}</h3>

          {!badge.earned && badge.progress !== undefined && (
            <div className="mt-2">
              <div className="w-full bg-dark-200 rounded-full h-1.5">
                <motion.div
                  className="bg-primary-400 h-1.5 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(badge.progress * 100, 100)}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">{Math.round(badge.progress * 100)}%</p>
            </div>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default BadgeDisplay;
