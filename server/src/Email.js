require('dotenv').config();
const nodemailer = require('nodemailer');

const email = process.env.EMAIL;

class Email{

    constructor(){
        this.createTransport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: email, 
                pass: process.env.PASS
            }
        });    
    }

    sendMail(mailOptions){
        this.createTransport.sendMail(mailOptions, (err, data) => {
            if (err) {
                return console.log('Error');
            }
            return console.log('Email sent!!!');
    }) 
}

/*let mailOptions = {
    from: email,
    to: 'cba@gmail.com',
    subject: 'Nodemailer - Test',
    text: 'Wooohooo it works!!'
};*/

module.exports = Email; 