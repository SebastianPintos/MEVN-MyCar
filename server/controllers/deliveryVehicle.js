const ctrl = {};
var DeliveryVehicle = require("../models/deliveryVehicle");

ctrl.index = (req, res) => {
    DeliveryVehicle.find((err, deliveryVehicle) => {
        if (err) {console.log(err)}
        res.send({
            deliveryVehicle: deliveryVehicle
        });
    })
};

ctrl.create = (req, res) => {
    var body = req.body.deliveryVehicle;
    console.log(req.body.deliveryVehicle); 
    var deliveryVehicle = new DeliveryVehicle({
        Documentation: body.Documentation,
        Sell: body.Sell,
        Status: body.Status,
        VehicleStock: body.VehicleStock,
        PurchaseOrderV : body.PurchaseOrderV
    });

    deliveryVehicle.save((err) => {
        if(err) {console.log(err)}
        res.send({
            success: true
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
                deliveryVehicle.Sell= body.Sell;
                deliveryVehicle.Status= body.Status;
                deliveryVehicle.PurchaseOrderV = body.PurchaseOrderV;
                deliveryVehicle.VehicleStock = body.VehicleStock;
                
                deliveryVehicle.save((err) => {
                    if(err) {console.log(err)}
                    res.send({
                        success: true
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
                        success: true
                    })
                });
            }
        }
    });
};
module.exports = ctrl;