const userModel = require("../models/userModel");
const { isValidObjectId } = require("mongoose");

const emailVerificationToken = require("../models/emailVerificationToken");
const passwordResetToken = require("../models/passwordResetToken");
const { generateOTP, generateMailTransporter } = require("../utils/mail");
const { sendError, generateRandomByte } = require("../utils/helper");

const create = async function (req, res) {
    try {
        let { name, email, password } = req.body;

        let emailExists = await userModel.findOne({ email });
        if (emailExists) {
            return sendError(res, "Email already registered");
        }

        const newUser = new userModel({ name, email, password });
        await newUser.save();

        //generate 6 digit OPT
        let otp = generateOTP();
        //store otp in our db
        const newEmailVerificationToken = new emailVerificationToken({
            owner: newUser._id,
            token: otp,
        });
        await newEmailVerificationToken.save();
        // send that otp to user
        var transport = generateMailTransporter();

        transport.sendMail({
            from: "verification@reviewapp.com",
            to: newUser.email,
            subject: "Email Verification",
            html: `
                <p> Your verification OTP </p>
                <h1> ${otp} </h1>
            `,
        });

        res.status(201).json({
            msg: "Please verify your email",
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: false, error: err.message });
    }
};

const verifyEmail = async (req, res) => {
    try {
        const { userId, otp } = req.body;

        if (!isValidObjectId(userId)) return sendError(res, "Invalid user id");

        const user = await userModel.findById(userId);
        if (!user) {
            return sendError(res, "User not found", 404);
        }

        if (user.isVerified) {
            return sendError(res, "User is already verified");
        }

        const token = await emailVerificationToken.findOne({ owner: userId });
        if (!token) {
            return res.json({ msg: "token not found" });
        }

        const isMatched = await token.compareToken(otp);
        if (!isMatched) {
            return sendError(res, "Please submit a valid OTP");
        }

        user.isVerified = true;
        await user.save();

        await emailVerificationToken.findByIdAndDelete(token._id);

        var transport = generateMailTransporter();

        transport.sendMail({
            from: "verification@reviewapp.com",
            to: user.email,
            subject: "Welcome Email",
            html: `<h3> Welcome to our app, thanks for choosing us </h3>`,
        });

        res.json({ msg: "Your email is verified" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const resendEmailVerificationToken = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!isValidObjectId(userId)) return sendError(res, "Invalid user id");

        const user = await userModel.findById(userId);
        if (!user) {
            return sendError(res, "User not found", 404);
        }
        if (user.isVerified) {
            return res.json({ error: "This email id is already verified" });
        }

        const alreadyHasToken = await emailVerificationToken.findOne({
            owner: userId,
        });
        if (alreadyHasToken) {
            return sendError(
                res,
                "Only after one hour you can request for another token"
            );
        }

        //generate 6 digit OPT
        let otp = generateOTP();
        //store otp in our db
        const newEmailVerificationToken = new emailVerificationToken({
            owner: user._id,
            token: otp,
        });
        await newEmailVerificationToken.save();
        // send that otp to user
        var transport = generateMailTransporter();

        transport.sendMail({
            from: "verification@reviewapp.com",
            to: user.email,
            subject: "Email Verification",
            html: `
            <p> Your verification OTP </p>
            <h1> ${otp} </h1>
        `,
        });

        res.status(201).json({
            msg: "New OTP has been send to your email",
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) return sendError(res, "Email is missing");

        const user = await userModel.findOne({ email });
        if (!user) return sendError(res, "User not found", 404);

        const alreadyHasToken = await passwordResetToken.findOne({
            owner: user._id,
        });
        if (alreadyHasToken)
            return sendError(
                res,
                "Only after one hour you can request for another token"
            );

        const token = await generateRandomByte();
        const newPasswordResetToken = await passwordResetToken({
            owner: user._id,
            token,
        });
        await newPasswordResetToken.save();

        const resetPasswordURL = `http://localhost:3000/reset-password?token=${token}&id=${user._id}`;

        var transport = generateMailTransporter();

        transport.sendMail({
            from: "verification@reviewapp.com",
            to: user.email,
            subject: "Password Reset Link",
            html: `
                <p> click here to reset password </p>
                <a href='${resetPasswordURL}'> Change Password </a>
            `,
        });

        res.json({ msg: "Link send to registered email" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    create,
    verifyEmail,
    resendEmailVerificationToken,
    forgetPassword,
};
