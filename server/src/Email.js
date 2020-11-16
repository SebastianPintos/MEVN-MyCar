const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user:'@gmail.com', 
        pass: '1234'
    }
});

let mailOptions = {
    from: 'abc@gmail.com',
    to: 'cba@gmail.com',
    subject: 'Nodemailer - Test',
    text: 'Wooohooo it works!!'
};

transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
        return log('Error occurs');
    }
    return log('Email sent!!!');
});