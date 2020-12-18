const ctrl = {};
var DeliveryVehicle = require("../models/deliveryVehicle");

ctrl.index = (req, res) => {
    DeliveryVehicle.find((err, deliveryVehicle) => {
        if (err) {console.log(err)}
        res.send({
            deliveryVehicle: deliveryVehicle
        });
    }).populate('Documentation.DocumentationID').populate('VehicleStock').populate('PurchaseOrderV').populate('Employee');
};

ctrl.create = (req, res) => {
    var body = req.body.deliveryVehicle;
    console.log(req.body.deliveryVehicle); 
    var deliveryVehicle = new DeliveryVehicle({
        Documentation: body.Documentation,
        Status: body.Status,
        VehicleStock: body.VehicleStock,
        PurchaseOrderV : body.PurchaseOrderV
    });

    deliveryVehicle.save((err) => {
        if(err) {console.log(err)}
        res.send({
            deliveryVehicle
        });
    });
};

ctrl.update = (req, res) => {
    var id = req.params.deliveryVehicle_id;
    var body = req.body.deliveryVehicle;
    DeliveryVehicle.findOne({_id: id}, (err, deliveryVehicle) => {
        if(err) {console.log(err)}
        else {
            if(!deliveryVehicle) {console.log('No se encontró el empleado')}
            else {
                deliveryVehicle.Documentation= body.Documentation;
               deliveryVehicle.Status = body.Status;
               deliveryVehicle.Date = body.Date;
               deliveryVehicle.Employee = body.Employee;
                deliveryVehicle.save((err) => {
                    if(err) {console.log(err)}
                    console.log("UPDATE: "+deliveryVehicle)
                    res.send({
                        deliveryVehicle
                    })
                });
            }
        }
    });
};

ctrl.remove = (req, res) => {
    var id = req.params.deliveryVehicle_id;
    DeliveryVehicle.findOne({_id: id}, (err, deliveryVehicle) => {
        if(err) {console.log(err)}
        else {
            if(!deliveryVehicle) {console.log('No se encontró el empleado')}
            else {
                deliveryVehicle.Status = 'INACTIVE';
                deliveryVehicle.save((err) => {
                    if(err) {console.log(err)}
                    res.send({
                        deliveryVehicle
                    })
                });
            }
        }
    });
};
module.exports = ctrl;