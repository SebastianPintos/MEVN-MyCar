const schedule = require('node-schedule');
const Reservation = require('../models/reservation');
const helper = {};


helper.twoDayRemainder = async () => {
    var dateStartDay =  new Date();
    
    console.log(dateStartDay);
    
    Reservation.find({AppointmentTime: {'$gte': dateStartDay}}, (err, reserDB) => {
        if(err){console.log(err)}
        else{
            for(i = 0; i < reserDB.length; i++){
                //calcula la diferencia entre la fecha de hoy y la de la reserva, en horas.
                var diffDay = Math.abs(reserDB[i].AppointmentTime - dateStartDay) / 60 * 60 * 1000;
                if(diffDay < 120 /*&& !reserDB[i].Remainder*/){
                    //mandar mail
                };
                reserDB[i].Remainder = false;
                reserDB[i].save((err) => {
                    if(err) {console.log(err)}
                });
            }

        }
    })
};

module.exports = helper;