const nodemailer = require('nodemailer');
const mailgunTransport = require('nodemailer-mailgun-transport');
var Reservation = require('../models/reservation');
var Client = require('../models/client');

const ctrl = {};
  
//mailgun
const auth = {
    auth: {
        api_key: 'c4a39abe02c973b1a361520c29439f0a-2af183ba-3221cf59',
        domain: 'sandboxf762f1139bbe47978788fe273ca4738e.mailgun.org'
    }
};

const transporter = nodemailer.createTransport(mailgunTransport(auth));

/*//ethereal mail
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: auth.user,
        pass: auth.pass
        //user: 'mekhi.cruickshank55@ethereal.email',
        //pass: 'ajkdf1zUw7nuYa7Pfc'
    }
});*/

const sendMail = (toEmail, subject, text, cb) => {
    console.log(auth.apiKey);
    const mailOptions = {
        from: 'MyCar@ungs.com',
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

/////////////////////////////////////////////////
ctrl.Prueba = (req, res) => {
    sendMail("cristiangaray101@gmail.com","test", "datos a enviar", function(err, data) {
        if (err) {
            console.log('ERROR: ', err);
            return res.status(500).json({ message: err.message || 'Internal Error' });
        }
        console.log('Email sent!!!');
        return res.json({ message: 'Email sent!!!!!' });
    });
}

ctrl.sendEmail = (email, title, body) => {
    /* const datosReserva = "Datos sobre la reserva: \n";
    var id = req.params.reservation_id;
    var mailClient = '';
    Reservation.findOne({_id: id}, (err, reservation) => {
        if(err) {console.log(err)}
        else {
            if(!reservation) {console.log('No se encontró la reserva')}
            else {
                Client.findOne(reservation.client, (err,client) => {
                    if(err) {console.log(err)}
                    else{
                        datosReserva += client.Name + ' ' + client.LastName + "\n";
                        mailClient = client.Email;
                    }
                });
                datosReserva += reservation.Client + "\n";
                datosReserva += reservation.service + "\n";
                datosReserva += reservation.Vehicle + "\n";
                datosReserva += reservation.Details +"\n";
                datosReserva += reservation.BranchOffice + "\n";
                datosReserva += reservation.Price + "\n";
                datosReserva += reservation.AppointmentTime + "\n";
                datosReserva += reservation.Duration + "\n";
            }
        }
    }); */

    sendMail(email,title, body, function(err, data) {
        if (err) {
            console.log('ERROR: ', err);
            //return res.status(500).json({ message: err.message || 'Internal Error' });
        }
        console.log('Email sent!!!');
        //return res.json({ message: 'Email sent!!!!!' });
    });
}

module.exports = ctrl;