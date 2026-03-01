const express = require('express');
const quizRoutes = require('./quiz.routes');
const userRoutes = require('./user.routes');
const leaderboardRoutes = require('./leaderboard.routes');

const router = express.Router();

router.use('/quizzes', quizRoutes);
router.use('/users', userRoutes);
router.use('/leaderboard', leaderboardRoutes);

module.exports = router;