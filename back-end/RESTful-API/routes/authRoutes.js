// routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/authController');
const validateToken = require('../middlewares/tokenValidator');

const router = express.Router();

router.post('/login', authController.login);
router.post('/logout', validateToken, authController.logout);


module.exports = router;