exports.generateOTP = (otp_length = 6) => {
    let otp = "";
    for (let i = 1; i <= otp_length; i++) {
        const randomVal = Math.round(Math.random() * 9);
        otp = otp + randomVal;
    }console.log(otp)
    return otp;
};

exports.generateMailTransporter = () =>
    nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "1dbe3c8178bd82",
            pass: "c8b5b37b296b3d",
        },
    });
