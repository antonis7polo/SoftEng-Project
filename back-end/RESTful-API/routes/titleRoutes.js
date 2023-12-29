const express = require('express');
const router = express.Router();
const titleController = require('../controllers/titleController');
const validateToken = require('../middlewares/tokenValidator');

// Define the route for getting a title by ID
router.get('/title/:titleID', validateToken, titleController.getTitleByID);

module.exports = router;
