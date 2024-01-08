const express = require('express');
const router = express.Router();
const titleController = require('../controllers/titleController');
const validateToken = require('../middlewares/tokenValidator');

router.get('/title/:titleID', validateToken, titleController.getTitleByID);
router.get('/searchtitle', validateToken, titleController.searchTitleByPart);
router.post('/searchtitle', validateToken, titleController.searchTitleByPart);
router.get('/bygenre/', validateToken, titleController.getTitlesByGenre);
router.post('/bygenre/', validateToken, titleController.getTitlesByGenre);
router.get('/titles/:titleID/details', validateToken, titleController.getTitleDetails);
router.get('/home',validateToken, titleController.getHomepageData);
router.get('/tv-shows/episodes',validateToken, titleController.getAllTvShowsEpisodes);

module.exports = router;
