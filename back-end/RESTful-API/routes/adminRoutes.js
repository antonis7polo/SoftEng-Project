const express = require('express');
const multer = require('multer');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');

const { uploadTitleBasics } = require('../controllers/titlebasicsController');
const { uploadTitleAkas } = require('../controllers/titleakasController');
const { uploadTitleRatings} = require('../controllers/titleratingsController');
const { uploadNameBasics } = require('../controllers/namebasicsController');
const { uploadTitleCrew } = require('../controllers/titlecrewController');
const { uploadTitleEpisode } = require('../controllers/titleepisodeController');
const { uploadTitlePrincipals } = require('../controllers/titleprincipalsController');
const { resetallController } = require('../controllers/resetallController');

const adminController = require('../controllers/adminController');
const validateToken = require('../middlewares/tokenValidator');
const adminAuth = require('../middlewares/adminAuth');

router.get('/healthcheck', validateToken, adminAuth, adminController.healthCheck);
router.post('/usermod/:username/:password', validateToken, adminAuth, adminController.userMod);
router.get('/users/:username', validateToken, adminAuth, adminController.getUser);
router.post('/upload/titlebasics', validateToken, adminAuth, upload.single('file'), uploadTitleBasics);
router.post('/upload/titleakas', validateToken, adminAuth, upload.single('file'),uploadTitleAkas);
router.post('/upload/titleratings', validateToken, adminAuth, upload.single('file'),uploadTitleRatings);
router.post('/upload/namebasics', validateToken, adminAuth, upload.single('file'),uploadNameBasics);
router.post('/upload/titlecrew', validateToken, adminAuth, upload.single('file'),uploadTitleCrew);
router.post('/upload/titleepisode', validateToken, adminAuth, upload.single('file'),uploadTitleEpisode);
router.post('/upload/titleprincipals', validateToken, adminAuth, upload.single('file'),uploadTitlePrincipals);
router.post('/resetall', validateToken, adminAuth, resetallController);

module.exports = router;
