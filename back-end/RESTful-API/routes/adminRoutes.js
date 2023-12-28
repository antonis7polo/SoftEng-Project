const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const validateToken = require('../middlewares/tokenValidator');
const adminAuth = require('../middlewares/adminAuth');

router.get('/healthcheck', va