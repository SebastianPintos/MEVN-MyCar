const ctrl = {};
var Vehicle = require('../models/vehicle');

ctrl.index = (req, res) => {
    Vehicle.find((err, vehicle) => {
        if (err) {console.log(err)}
        res.send({
            vehicle: vehicle
        })
    })
};

ctrl.create = (req, res) => {
    var body = req.body.vehicle;
    console.log(req.body.vehicle);
    var vehicle = new Vehicle({
        Brand: body.Brand,
        Model: body.Model,
        Type: body.Type,
        Category: body.Category,
        Fuel: body.Fuel,
        transmission: body.transmission,
        origin: body.origin,
        year: body.year,
        SuggestedPrice: body.SuggestedPrice,
        Detail: body.Detail,
        Status: 'Active'
    });

    vehicle.save((err) => {
        if(err) {console.log(err)}
        res.send({
            success: true
        })
    });
};

ctrl.update = (req, res) => {
    var id = req.params.vehicle_id;
    var body = req.body.vehicle;
    Vehicle.findOne({_id: id}, (err, vehicle) => {
        if(err) {console.log(err)}
        else {
            if(!vehicle) {console.log(' no se encontro')}
            else {
                vehicle.Brand= body.Brand;
                vehicle.Model= body.Model;
                vehicle.Type= body.Type;
                vehicle.Category= body.Category;
                vehicle.Fuel= body.Fuel;
                vehicle.transmission= body.transmission;
                vehicle.origin= body.origin;
                vehicle.year= body.year;
                vehicle.SuggestedPrice= body.SuggestedPrice;
                vehicle.Detail= body.Detail;
                vehicle.Status = body.Status;

                vehicle.save((err) => {
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
    var id = req.params.vehicle_id;
    Vehicle.findOne({_id: id}, (err, vehicle) => {
        if(err) {console.log(err)}
        else {
            if(!vehicle) {console.log(' no se encontro')}
            else {
                vehicle.Status = 'Baja';

                vehicle.save((err) => {
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