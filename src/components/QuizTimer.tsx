import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertCircle } from 'lucide-react';

interface QuizTimerProps {
  initialTime: number; // in seconds
  onTimeExpired?: () => void;
  onTimeChange?: (timeRemaining: number) => void;
  isPaused?: boolean;
}

const QuizTimer: React.FC<QuizTimerProps> = ({
  initialTime,
  onTimeExpired,
  onTimeChange,
  isPaused = false,
}) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1;
        onTimeChange?.(newTime);

        if (newTime <= 0) {
          clearInterval(interval);
          onTimeExpired?.();
          return 0;
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, onTimeExpired, onTimeChange]);

  const hours = Math.floor(timeRemaining / 3600);
  const minutes = Math.floor((timeRemaining % 3600) / 60);
  const seconds = timeRemaining % 60;

  const isLow = timeRemaining < 300; // 5 minutes
  const isCritical = timeRemaining < 60; // 1 minute

  return (
    <motion.div
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-lg ${
        isCritical
          ? 'bg-red-500/20 text-red-400 border border-red-500/50'
          : isLow
            ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
            : 'bg-dark-300 text-white border border-dark-100'
      }`}
    >
      {isCritical ? (
        <AlertCircle className="w-5 h-5 animate-pulse" />
      ) : (
        <Clock className="w-5 h-5" />
      )}
      <span>
        {hours > 0 ? `${hours}:` : ''}
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </motion.div>
  );
};

export default QuizTimer;
