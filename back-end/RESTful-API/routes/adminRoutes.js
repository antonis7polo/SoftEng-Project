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

const adminController = re