var nodemailer = require('nodemailer');


const sendEmail = function(model, callback){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.emailUser,
            pass: process.env.emailPass
        }
    });
    var mailOptions = {
        from: 'jawetzelemailer@gmail.com',
        to: model.emailTo,
        subject: 'Password Reset',
        text: model.email
    };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            callback({error: true, reason: 'failed to send email'})
        } else {
            callback({success: true});
        }
    });
};

module.exports = {
    sendEmail: sendEmail
};