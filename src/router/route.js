const express = require('express');
const router = express.Router();
const {create} = require('../controller/userController');

router.post('/create', create);

module.exports = router;