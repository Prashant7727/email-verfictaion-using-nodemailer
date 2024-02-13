const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/verify-otp', userController.verifyOTP); // Add route for OTP verification

module.exports = router;
