const nodemailer = require('nodemailer');
const userModel = require('../models/userModel');
const emailVerificationToken = require('../models/emailVerificationToken');
const { isValidObjectId } = require('mongoose');

const create = async function (req, res) {
    try {
        let { name, email, password } = req.body;

        let emailExists = await userModel.findOne({ email });
        if (emailExists) {
            return res
                .status(401)
                .json({ status: false, msg: "Email already registered" });
        }

        const newUser = new userModel({name, email, password});
        await newUser.save();

        //generate 6 digit OPT
        let otp = '';
        for(let i=0; i<=5; i++){
            const randomVal = Math.round(Math.random() * 9)
            otp = otp + randomVal;
        }
        //store otp in our db
        const newEmailVerificationToken = new emailVerificationToken({
            owner: newUser._id,
            token: otp
        })
        await newEmailVerificationToken.save();
        // send that otp to user
        var transport = nodemailer.createTransport({
          host: "smtp.mailtrap.io",
          port: 2525,
          auth: {
            user: "1dbe3c8178bd82",
            pass: "c8b5b37b296b3d"
          }
        });

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
        return res.status(400).json({msg: 'Invalid user id'});
    
    const user = await userModel.findById(userId);
    if(!user){
        return res.status(404).json({msg: 'User not found'});
    }

    if(user.isVerified){
        return res.status(200).json({msg: 'User is already verified'});
    }

    const token = await emailVerificationToken.findOne({owner: userId});
    if(!token){
        return res.json({msg: 'token not found'});
    }

    const isMatched = await token.compareToken(otp);
    if(!isMatched){
        return res.json({msg: 'Please submit a valid OTP'})
    }

    user.isVerified = true;
    await user.save();

    await emailVerificationToken.findByIdAndDelete(token._id);

    var transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "1dbe3c8178bd82",
          pass: "c8b5b37b296b3d"
        }
      });

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

module.exports = {
    create,
    verifyEmail
};