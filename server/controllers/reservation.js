const ctrl = {};

var Reservation = require("../models/reservation");

ctrl.index = (req, res) => {
    Reservation.find((err, reservation) => {
        if (err) {console.log(err)}
        res.send({
            reservation: reservation
        })
    })
};

ctrl.create = (req, res) => {
    var body = req.body.reservation;
    console.log(req.body.reservation); 
    var reservation = new Reservation({
        Duration: body.Duration,
        Price: body.Price,
        Created_At: body.Created_At,
        Status: "ACTIVE",
        Domain: body.Domain,
        Appointment_Time: body.Appointment_Time,
        Client: body.Client,
        BranchOffice: body.BranchOffice,
        Details: body.Details,
        Service: body.Service,
        Vehicle: body.Vehicle,
    });

    reservation.save((err) => {
        if(err) {console.log(err)}
        res.send({
            success: true
        })
    });
};

ctrl.update = (req, res) => {
    var id = req.params.reservation_id;
    var body = req.body.reservation;
    Reservation.findOne({_id: id}, (err,reservation) => {
        if(err) {console.log(err)}
        else {
            if(!client) {console.log('No se encontró la reserva')}
            else {
                Duration: body.Duration,
                 Price: body.Price,
                Created_At: body.Created_At,
                Status: "ACTIVE",
                Domain: body.Domain,
                Appointment_Time: body.Appointment_Time,
                Client: body.Client,
                BranchOffice: body.BranchOffice,
                Details: body.Details,
                Service: body.Service,
                Vehicle: body.Vehicle,

                client.save((err) => {
                    if(err) {console.log(err)}
                    res.send({
                        success: true
                    })
                });
            }
        }
    })
};

ctrl.remove = (req, res) => {
    var id = req.params.reservation_id;
    Reservation.findOne({_id: id}, (err, reservation) => {
        if(err) {console.log(err)}
        else {
            if(!reservation) {console.log('No se enontró la reserva')}
            else {
                Reservation.Status = 'Baja';

                client.save((err) => {
                    if(err) {console.log(err)}
                    res.send({
                        success: true
                    })
                });
            }
        }
    })
};

module.exports = ctrl;
