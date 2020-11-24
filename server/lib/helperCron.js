const schedule = require('node-schedule');
const Reservation = require('../models/reservation');
const Remainder = require('../models/remainderMail');
const email = require('../src/Email');

const helper = {};


helper.EmailRemainder1 = async () => {
    var dateStartDay =  new Date();
    var hoursBefore = 0;
    var title = '';
    var body = '';
    
    console.log(dateStartDay);
    await Remainder.find((err, remainder) => {
        console.log(remainder);
        hoursBefore = remainder[0].Interval.Days * 24 + remainder[0].Interval.Hours;
        title =  remainder[0].Title;
        body = remainder[0].Body;
    }).limit(2);

    console.log(hoursBefore);

    await Reservation.find({AppointmentTime: {'$gte': dateStartDay}, Remainder1: false}, (err, reserDB) => {
        if(err){console.log(err)}
        else{
            for(i = 0; i < reserDB.length; i++){
                //calcula la diferencia entre la fecha de hoy y la de la reserva, en horas.
                console.log(reserDB[i].AppointmentTime);
                console.log(dateStartDay);
                console.log(Math.abs(reserDB[i].AppointmentTime - dateStartDay));


                var diffDay = Math.abs(reserDB[i].AppointmentTime - dateStartDay) / (60 * 60 * 1000);
                console.log(diffDay);
                if(diffDay < hoursBefore){
                    email.sendEmail(reserDB[i].Client.Email, title, body);
                    reserDB[i].Remainder1 = true;
                    reserDB[i].save((err) => {
                        if(err) {console.log(err)}
                    })
                };
                
                ;
            }

        }
    }).populate('Client');
};

helper.EmailRemainder2 = async () => {
    var dateStartDay =  new Date();
    var hoursBefore = 0;
    var title = '';
    var body = '';
    
    console.log(dateStartDay);
    Remainder.find((err, remainder) => {
        hoursBefore = remainder[1].Interval.Days * 24 + remainder[1].Interval.Hours;
        title =  remainder[1].Title;
        body = remainder[1].Body;
    }).limit(2);

    console.log(hoursBefore);

    Reservation.find({AppointmentTime: {'$gte': dateStartDay}, Remainder2: false}, (err, reserDB) => {
        if(err){console.log(err)}
        else{
            for(i = 0; i < reserDB.length; i++){
                //calcula la diferencia entre la fecha de hoy y la de la reserva, en horas.
                var diffDay = Math.abs(reserDB[i].AppointmentTime - dateStartDay) / 60 * 60 * 1000;
                console.log(diffDay);
                if(diffDay < hoursBefore){
                    email.sendEmail(reserDB[i].Client.Email, title, body);
                    reserDB[i].Remainder2 = true;
                    reserDB[i].save((err) => {
                        if(err) {console.log(err)}
                    })
                };
                
                ;
            }

        }
    }).populate('Client');
};

module.exports = helper;