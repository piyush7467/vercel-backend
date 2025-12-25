const express = require('express');
const { signup, login, logout, getMe } = require('../controller/userController.js');
const authMiddleware = require('../middleware/auth.js');
const { validateSignup } = require('../middleware/validateUser.js');
const router = express.Router();

router.post('/signup', validateSignup, signup);
router.post('/login', login);
router.post('/logout', authMiddleware, logout);

// 🔐 NEW ROUTE
router.get("/me", authMiddleware, getMe);

module.exports = router;
