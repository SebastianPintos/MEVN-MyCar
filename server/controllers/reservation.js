const ctrl = {};

const Product = require('../models/product');
var Reservation = require('../models/reservation');
var Service = require('../models/service');
const helper = require('../lib/helperProduct');

ctrl.index = (req, res) => {
    Reservation.find((err, reservation) => {
        if (err) {console.log(err)}
        res.send({
            reservation: reservation
        })
    }).populate('Service').populate('Vehicle').populate('BranchOffice').populate('Client');
};

ctrl.create = async (req, res) => {    
    var body = req.body.reservation;
    var services = await helper.getServices(body);
    var productNot = await helper.checkAvailable(services);
    console.log("service :" + services);
    console.log("productos no disponibles " + productNot);

    if(productNot.length === 0){
        await helper.reserveProduct(services);
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
    }else{
        res.send(productNot);
    }
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

ctrl.cancel = (req, res) => {
    var id = req.params.reservation_id;
    Reservation.findOne({_id: id}, (err, reservation) => {
        if(err) {console.log(err)}
        else {
            if(!reservation) {console.log('No se encontró el producto específico')}
            else {
                reservation.Status = 'CANCEL';

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

ctrl.checkProduct = async (req, res) => {
    var services = req.body.service;
    //console.log(services);
    var productNot = await helper.checkAvailable(services);
    //console.log(productNot);
    res.send({productNot});
}

ctrl.reserveProduct = async (req, res) => {
    var services = req.body.service;
    //console.log(services);
    await helper.reserveProduct(services);
    //console.log(productNot);
    res.send("zsx");
}

ctrl.pruebas = async (req, res) => {
    var body = req.body.reservation;
    helper.getServices(body);
    res.send("asas");
}


module.exports = ctrl;
