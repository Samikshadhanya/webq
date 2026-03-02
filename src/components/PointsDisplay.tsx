import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

interface PointsDisplayProps {
  points: number;
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const PointsDisplay: React.FC<PointsDisplayProps> = ({ points, animated = true, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  const displayValue = Math.floor(points);

  return (
    <motion.div
      className="flex items-center gap-2"
      initial={animated ? { scale: 0.8, opacity: 0 } : {}}
      animate={animated ? { scale: 1, opacity: 1 } : {}}
      transition={{ type: 'spring', stiffness: 200 }}
    >
      <motion.div
        animate={animated ? { rotate: [0, 360] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Zap className="w-6 h-6 text-yellow-400" fill="currentColor" />
      </motion.div>
      <motion.span
        className={`font-bold text-yellow-400 ${sizeClasses[size]}`}
        key={displayValue}
        initial={animated ? { scale: 1.2, opacity: 0 } : {}}
        animate={animated ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.3 }}
      >
        {displayValue}
      </motion.span>
    </motion.div>
  );
};

export default PointsDisplay;
