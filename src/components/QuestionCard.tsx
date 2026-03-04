import React from 'react';
import { motion } from 'framer-motion';
import { Question } from '../types';

interface QuestionCardProps {
  question: Question;
  selectedAnswers: string[];
  onAnswerSelect: (optionId: string, isMultiple?: boolean) => void;
  questionNumber: number;
  totalQuestions: number;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedAnswers,
  onAnswerSelect,
  questionNumber,
  totalQuestions,
}) => {
  const isMultipleChoice = question.correct_option_ids.length > 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-dark-200 rounded-lg shadow-xl border border-dark-100 p-6"
    >
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-400">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className="text-sm font-medium text-primary-400">
            {question.marks} point{question.marks > 1 ? 's' : ''}
          </span>
        </div>
        <div className="w-full bg-dark-300 rounded-full h-2">
          <div
            className="bg-primary-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          ></div>
        </div>
      </div>

      <h2 className="text-xl md:text-2xl font-bold text-white mb-6">{question.question_text}</h2>

      <div className="space-y-3">
        {question.options.map((option) => {
          const isSelected = selectedAnswers.includes(option.option_id);
          const isCorrect = question.correct_option_ids.includes(option.option_id);

          return (
            <motion.label
              key={option.option_id}
              whileHover={{ scale: 1.02 }}
              className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                isSelected
                  ? 'bg-primary-500/20 border-primary-400'
                  : 'bg-dark-300 border-dark-100 hover:border-primary-400'
              }`}
            >
              <input
                type={isMultipleChoice ? 'checkbox' : 'radio'}
                checked={isSelected}
                onChange={() => onAnswerSelect(option.option_id, isMultipleChoice)}
                name={`question-${question.question_id}`}
                className="w-5 h-5 text-primary-400 bg-dark-300 border-dark-100 focus:ring-primary-400 cursor-pointer"
              />
              <span className="ml-3 text-white font-medium">{option.text}</span>
            </motion.label>
          );
        })}
      </div>

      {isMultipleChoice && (
        <p className="mt-4 text-sm text-gray-400 flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-primary-400"></span>
          Multiple answers can be selected for this question
        </p>
      )}
    </motion.div>
  );
};

export default QuestionCard;
