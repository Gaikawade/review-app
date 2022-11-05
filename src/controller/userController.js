// const nodemailer = require('nodemailer');
const userModel = require('../models/userModel');
const emailVerificationToken = require('../models/emailVerificationToken');
const { isValidObjectId } = require('mongoose');
const { generateOTP, generateMailTransporter } = require('../utils/mail');
const { sendError } = require('../utils/helper');

const create = async function (req, res) {
    try {
        let { name, email, password } = req.body;

        let emailExists = await userModel.findOne({ email });
        if (emailExists) {
            return sendError(res, 'Email already registered');
        }

        const newUser = new userModel({name, email, password});
        await newUser.save();

        //generate 6 digit OPT
        let otp = generateOTP();
        //store otp in our db
        const newEmailVerificationToken = new emailVerificationToken({
            owner: newUser._id,
            token: otp
        })
        await newEmailVerificationToken.save();
        // send that otp to user
        var transport = generateMailTransporter();

        transport.sendMail({
            from: 'verification@reviewapp.com',
            to: newUser.email,
            subject: 'Email Verification',
            html: `
                <p> Your verification OTP </p>
                <h1> ${otp} </h1>
            `
        })

        res.status(201).json({
            msg: "Please verify your email"
        });
    } catch (err) {
      console.log(err);
        res.status(500).send({ status: false, error: err.message });
    }
};

const verifyEmail = async (req, res) => {
    const {userId, otp} = req.body;

    if(!isValidObjectId(userId))
        return sendError(res, 'Invalid user id');
    
    const user = await userModel.findById(userId);
    if(!user){
        return sendError(res, 'User not found', 404);
    }

    if(user.isVerified){
        return sendError(res, 'User is already verified');
    }

    const token = await emailVerificationToken.findOne({owner: userId});
    if(!token){
        return res.json({msg: 'token not found'});
    }

    const isMatched = await token.compareToken(otp);
    if(!isMatched){
        return sendError(res, 'Please submit a valid OTP');
    }

    user.isVerified = true;
    await user.save();

    await emailVerificationToken.findByIdAndDelete(token._id);

    var transport = generateMailTransporter();

    transport.sendMail({
        from: 'verification@reviewapp.com',
        to: user.email,
        subject: 'Welcome Email',
        html: `
            <h3> Welcome to our app, thanks for choosing us </h3>
        `
    })

    res.json({msg: 'Your email is verified'});
}

const resendEmailVerificationToken = async (req, res) => {
    const {userId} = req.body;

    if(!isValidObjectId(userId))
        return sendErr0r(res, 'Invalid user id');
    
    const user = await userModel.findById(userId);
    if(!user){
        return sendError(res, 'User not found', 404);
    }
    if(user.isVerified){
        return res.json({ error: 'This email id is already verified'});
    }

    const alreadyHasToken = await emailVerificationToken.findOne({owner: userId});
    if(alreadyHasToken){
        return sendError(res, 'Only after one hour you can request for another token');
    }

    //generate 6 digit OPT
    let otp = generateOTP();
    //store otp in our db
    const newEmailVerificationToken = new emailVerificationToken({
        owner: user._id,
        token: otp
    })
    await newEmailVerificationToken.save();
    // send that otp to user
    var transport = generateMailTransporter();

    transport.sendMail({
        from: 'verification@reviewapp.com',
        to: user.email,
        subject: 'Email Verification',
        html: `
            <p> Your verification OTP </p>
            <h1> ${otp} </h1>
        `
    })

    res.status(201).json({
        msg: "New OTP has been send to your email"
    });
}



module.exports = {
    create,
    verifyEmail,
    resendEmailVerificationToken
};