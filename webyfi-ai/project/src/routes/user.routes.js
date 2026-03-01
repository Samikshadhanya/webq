const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { UserController } = require('../controllers/user.controller');

const router = express.Router();
const userController = new UserController();

// Get user profile
router.get('/profile', userController.getProfile);

// Update user profile
router.put('/profile',
  validate([
    body('name').optional().trim(),
    body('email').optional().isEmail(),
  ]),
  userController.updateProfile
);

// Get user's quiz history
router.get('/history', userController.getQuizHistory);

module.exports = router;