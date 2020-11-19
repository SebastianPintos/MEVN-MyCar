require('dotenv').config();
const nodemailer = require('nodemailer');
const mailgun = require('nodemailer-mailgun-transport');
const auth = require('./auth.json');
var Reservation = require('../models/reservation');

const ctrl = {};
/*
//mailgun
const auth = {
    auth: {
        apiKey: auth.api_key || "c4a39abe02c973b1a361520c29439f0a-2af183ba-3221cf59",
        domain: auth.domain || "sandboxf762f1139bbe47978788fe273ca4738e.mailgun.org"
    }
};

const transporter = nodemailer.createTransport(mailgun(auth));
*/
//ethereal mail
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'mekhi.cruickshank55@ethereal.email',
        pass: 'ajkdf1zUw7nuYa7Pfc'
    }
});

const sendMail = (toEmail, subject, text, cb) => {
    const mailOptions = {
        from: 'remitente',
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

ctrl.ReservationConfirm = (req, res) => {
    const datosReserva = "Datos sobre la reserva: \n";
    var id = req.params.reservation_id;
    Reservation.findOne({_id: id}, (err, reservation) => {
        if(err) {console.log(err)}
        else {
            if(!reservation) {console.log('No se encontró el producto específico')}
            else {
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
    });
    sendMail("cristiangaray101@gmail.com","Confirmacion Reserva", datosReserva, function(err, data) {
        if (err) {
            console.log('ERROR: ', err);
            return res.status(500).json({ message: err.message || 'Internal Error' });
        }
        console.log('Email sent!!!');
        return res.json({ message: 'Email sent!!!!!' });
    });
}

module.exports = sendMail;