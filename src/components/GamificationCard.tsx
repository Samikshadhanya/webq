import React from 'react';
import { motion } from 'framer-motion';

interface GamificationCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: 'primary' | 'success' | 'warning' | 'danger';
  animated?: boolean;
  progress?: number;
}

const colorClasses = {
  primary: 'from-blue-500/20 to-cyan-500/20 border-blue-400',
  success: 'from-green-500/20 to-emerald-500/20 border-green-400',
  warning: 'from-yellow-500/20 to-orange-500/20 border-yellow-400',
  danger: 'from-red-500/20 to-pink-500/20 border-red-400',
};

const GamificationCard: React.FC<GamificationCardProps> = ({
  title,
  value,
  icon,
  color = 'primary',
  animated = true,
  progress,
}) => {
  return (
    <motion.div
      className={`bg-gradient-to-br ${colorClasses[color]} border-2 rounded-lg p-6 backdrop-blur-sm`}
      initial={animated ? { opacity: 0, scale: 0.8 } : {}}
      animate={animated ? { opacity: 1, scale: 1 } : {}}
      whileHover={animated ? { scale: 1.05, y: -5 } : {}}
      transition={{ type: 'spring', stiffness: 200 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="text-3xl">{icon}</div>
        <motion.div
          animate={animated ? { rotate: [0, 10, -10, 0] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-xl opacity-50"
        >
          ✨
        </motion.div>
      </div>

      <p className="text-gray-300 text-sm font-medium mb-2">{title}</p>

      <motion.p
        className="text-3xl font-bold text-white mb-4"
        key={value}
        initial={animated ? { scale: 1.2, opacity: 0 } : {}}
        animate={animated ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.3 }}
      >
        {value}
      </motion.p>

      {progress !== undefined && (
        <div className="w-full bg-black/30 rounded-full h-2">
          <motion.div
            className="bg-white/30 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress * 100, 100)}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      )}
    </motion.div>
  );
};

export default GamificationCard;
