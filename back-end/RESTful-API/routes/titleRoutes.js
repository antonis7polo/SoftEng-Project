const express = require('express');
const router = express.Router();
const titleController = require('../controllers/titleController');
const validateToken = require('../middlewares/tokenValidator');

router.get('/title/:titleID', validateToken, titleController.getTitleByID);

module.exports = router;
