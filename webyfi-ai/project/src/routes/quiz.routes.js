const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { QuizController } = require('../controllers/quiz.controller');

const router = express.Router();
const quizController = new QuizController();

// Get all quizzes
router.get('/', quizController.getQuizzes);

// Get quiz by ID
router.get('/:id', quizController.getQuizById);

// Create new quiz
router.post('/',
  validate([
    body('title').notEmpty().trim(),
    body('description').notEmpty().trim(),
    body('category').notEmpty().trim(),
    body('difficulty').isIn(['Easy', 'Medium', 'Hard']),
    body('timeLimit').isInt({ min: 1 }),
    body('questions').isArray({ min: 1 }),
    body('questions.*.text').notEmpty().trim(),
    body('questions.*.options').isArray({ min: 2 }),
    body('questions.*.correctOptionIds').isArray({ min: 1 })
  ]),
  quizController.createQuiz
);

// Submit quiz response
router.post('/:id/submit',
  validate([
    body('responses').isArray(),
    body('responses.*.questionId').notEmpty(),
    body('responses.*.selectedOptionIds').isArray()
  ]),
  quizController.submitQuiz
);

module.exports = router;