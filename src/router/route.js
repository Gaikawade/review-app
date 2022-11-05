const express = require('express');
const router = express.Router();
const {create, verifyEmail, resendEmailVerificationToken} = require('../controller/userController');
const {userValidator, validate} = require('../middleware/validator');

router.post('/create', userValidator, validate, create);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification-email', resendEmailVerificationToken);

module.exports = router;