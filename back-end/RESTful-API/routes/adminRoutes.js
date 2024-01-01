const express = require('express');
const multer = require('multer');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const { uploadTitleBasics } = require('../controllers/titlebasicsController');

const adminController = require('../controllers/adminController');
const validateToken = require('../middlewares/tokenValidator');
const adminAuth = require('../middlewares/adminAuth');

router.get('/healthcheck', validateToken, adminAuth, adminController.healthCheck);
router.post('/usermod/:username/:password', validateToken, adminAuth, adminController.userMod);
router.get('/users/:username', validateToken, adminAuth, adminController.getUser);
router.post('/upload/titlebasics', validateToken, adminAuth, upload.single('file'), uploadTitleBasics);

module.exports = router;
