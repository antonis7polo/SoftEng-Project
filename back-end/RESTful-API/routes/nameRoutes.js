const express = require('express');
const router = express.Router();
const nameController = require('../controllers/nameController');
const validateToken = require('../middlewares/tokenValidator');

router.get('/name/:nameID',validateToken, nameController.getNameByID);
router.get('/searchname',validateToken, nameController.searchName);
router.post('/searchname',validateToken, nameController.searchName);

module.exports = router;
