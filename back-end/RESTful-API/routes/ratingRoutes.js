const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const validateToken = require('../middlewares/tokenValidator');

router.post('/uploadrating', validateToken, ratingController.uploadRating);
router.get('/ratings/:userID', validateToken, ratingController.getUserRatings);
router.delete('/ratings/:userID/:titleID',validateToken, ratingController.deleteRating);
router.get('/recommendations', validateToken, ratingController.getMovieRecommendations);
router.post('/recommendations', validateToken, ratingController.getMovieRecommendations);

module.exports = router;


