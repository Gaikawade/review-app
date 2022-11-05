const express = require('express');
const router = express.Router();
const {create, verifyEmail, resendEmailVerificationToken, forgetPassword} = require('../controller/userController');
const {userValidator, validate} = require('../middleware/validator');

router.post('/create', userValidator, validate, create);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification-email', resendEmailVerificationToken);
router.post('/forget-password', forgetPassword);

module.exports = router;