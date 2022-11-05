const express = require("express");
const router = express.Router();
const {
    create,
    verifyEmail,
    resendEmailVerificationToken,
    forgetPassword,
    sendResetPassTokenStatus,
    resetPassword,
    signIn,
} = require("../controller/userController");
const { isValidPassResetToken } = require("../middleware/user");
const { userValidator, validate, validatePassword, signInValidator } = require("../middleware/validator");

router.post("/create", userValidator, validate, create);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification-email", resendEmailVerificationToken);
router.post("/forget-password", forgetPassword);
router.post(
    "/verify-pass-reset-token",
    isValidPassResetToken,
    sendResetPassTokenStatus
);
router.post(
    "/reset-password",
    validatePassword,
    validate,
    isValidPassResetToken,
    resetPassword
);
router.post('/signin', signInValidator, validate, signIn)

module.exports = router;
