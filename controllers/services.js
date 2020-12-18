const ctrl = {};

var Service = require("../models/service");

ctrl.index = (req, res) => {
    Service.find((err, service) => {
        if (err) {console.log(err)}
        res.send({
            service: service
        })
    }).populate('Vehicle').populate('BranchOffice').populate('Product');
};

ctrl.create = (req, res) => {
    var body = req.body.service; 
    var service = new Service({
        Description: body.Description,
        LaborPrice: body.LaborPrice,
        Time: body.Time,
        Vehicle: body.Vehicle,
        Status: 'ACTIVE',
        Product: body.Product,
        BranchOffice: body.BranchOffice,
        Type: body.Type
    });

    service.save((err) => {
        if(err) {console.log(err)}
        res.send({
            success: true
        })
    });
};

ctrl.update = (req, res) => {
    var id = req.params.service_id;
    var body = req.body.service;
    Service.findOne({_id: id}, (err, service) => {
        if(err) {console.log(err)}
        else {
            if(!service) {console.log(' no se encontro')}
            else {
                service.Description= body.Description;
                service.LaborPrice= body.LaborPrice;
                service.Time= body.Time;
                service.Vehicle= body.Vehicle;
                service.Status= body.Status;
                service.Product= body.Product;
                service.BranchOffice= body.BranchOffice;
                service.Type = body.Type;

                service.save((err) => {
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
    var id = req.params.service_id;
    Service.findOne({_id: id}, (err, service) => {
        if(err) {console.log(err)}
        else {
            if(!service) {console.log(' no se encontro')}
            else {
                service.Status = 'INACTIVE';

                service.save((err) => {
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