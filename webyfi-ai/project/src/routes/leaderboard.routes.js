const express = require('express');
const { LeaderboardController } = require('../controllers/leaderboard.controller');

const router = express.Router();
const leaderboardController = new LeaderboardController();

// Get global leaderboard
router.get('/', leaderboardController.getGlobalLeaderboard);

// Get quiz-specific leaderboard
router.get('/quiz/:quizId', leaderboardController.getQuizLeaderboard);

module.exports = router;