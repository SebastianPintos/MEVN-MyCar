const ctrl = {};

const Product = require('../models/product');
var Reservation = require('../models/reservation');
var Service = require('../models/service');

ctrl.index = (req, res) => {
    Reservation.find((err, reservation) => {
        if (err) {console.log(err)}
        res.send({
            reservation: reservation
        })
    }).populate('Service').populate('Vehicle').populate('BranchOffice');
};

ctrl.create = (req, res) => {
    var body = req.body.reservation;
    var reservation = new Reservation({
        Duration: body.Duration,
        Price: body.Price,
        Status: 'ACTIVE',
        Domain: body.Domain,
        AppointmentTime: body.AppointmentTime,
        Client: body.Client,
        BranchOffice: body.BranchOffice,
        Details: body.Details,
        Service: body.Service,
        Vehicle: body.Vehicle
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
    Reservation.findOne({_id: id}, (err, reservation) => {
        if(err) {console.log(err)}
        else {
            if(!reservation) {console.log('No se encontró el producto específico')}
            else {
                reservation.Duration= body.Duration;
                reservation.Price= body.Price;
                reservation.Status= Body.Status;
                reservation.Domain= body.Domain;
                reservation.AppointmentTime= body.AppointmentTime;
                reservation.Client= body.Client;
                reservation.BranchOffice= body.BranchOffice;
                reservation.Details= body.Details;
                reservation.Service= body.Service;
                reservation.Vehicle= body.Vehicle;
               
                reservation.save((err) => {
                    if(err) {console.log(err)}
                    res.send({
                        success: true
                    })
                });
            }
        }
    });
}

ctrl.remove = (req, res) => {
    var id = req.params.reservation_id;
    Reservation.findOne({_id: id}, (err, reservation) => {
        if(err) {console.log(err)}
        else {
            if(!reservation) {console.log('No se encontró el producto específico')}
            else {
                reservation.Status = 'CLOSED';

                reservation.save((err) => {
                    if(err) {console.log(err)}
                    res.send({
                        success: true
                        
                    })
                });
            }
        }
    });
}

module.exports = ctrl;
