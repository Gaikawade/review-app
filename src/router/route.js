const express = require('express');
const router = express.Router();
const {create, verifyEmail} = require('../controller/userController');
const {userValidator, validate} = require('../middleware/validator');

router.post('/create', userValidator, validate, create);
router.post('/verify-email', verifyEmail);

module.exports = router;