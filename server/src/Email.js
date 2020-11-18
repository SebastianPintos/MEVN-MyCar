require('dotenv').config();
const nodemailer = require('nodemailer');
const mailgun = require('nodemailer-mailgun-transport');

const auth = {
    auth: {
        api_key: process.env.API_KEY,
        domain: process.env.DOMAIN
    }
};

const transporter = nodemailer.createTransport(mailgun(auth));

const sendMail = (toEmail, subject, text, cb) => {
    const mailOptions = {
        from: '"nodemailer" <sandboxf762f1139bbe47978788fe273ca4738e.mailgun.org>',
        to: toEmail,
        subject: subject,
        text: text
    };
    transporter.sendMail(mailOptions, (err,data) => {
        if(err){
            return cb(err,null);
        }
        return cb (null,data);
    })
}

module.exports = sendMail;