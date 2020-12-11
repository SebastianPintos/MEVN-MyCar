const ctrl = {};

var ProductControl = require('../models/productControl');
var VehicleControl = require('../models/vehicleControl');
const helper = require('../lib/helperStock');

ctrl.indexCP = (req, res) => {
    ProductControl.find((err, productControl) => {
        if (err) {console.log(err)}
        res.send({
            productControl: productControl
        })
    }).populate('Product');
};

ctrl.createCP = (req, res) => {
    var body = req.body.productControl;
    var productControl = new ProductControl({
        Product: body.Product,
        Min: body.Min,
        Status: "ACTIVE",
    });

    //helper.checkMinCreation(body);
    productControl.save((err) => {
        if(err) {console.log(err)}
        res.send({
            success: true
        })
    });
};

ctrl.updateCP = (req, res) => {
    var id = req.params.productControl_id;
    var body = req.body.productControl;
    ProductControl.findOne({_id: id}, (err, productControl) => {
        if(err) {console.log(err)}
        else {
            if(!productControl) {console.log(' no se encontro')}
            else {
                productControl.Product= body.Product;
                productControl.Min= body.Min;
               
                
                helper.checkMinCreation(body);
                productControl.save((err) => {
                    if(err) {console.log(err)}
                    res.send({
                        success: true
                    })
                });
            }
        }
    })
};

ctrl.removeCP = (req, res) => {
    var id = req.params.productControl_id;
    ProductControl.findOne({_id: id}, (err, productControl) => {
        if(err) {console.log(err)}
        else { 
            if(!productControl) {console.log(' no se encontro')}
            else {
                productControl.Status = 'INACTIVE';
                productControl.save((err) => {
                    if(err) {console.log(err)}
                    res.send({
                        success: true
                    })
                });
            }
        }
    })
};

ctrl.indexCV = (req, res) => {
    VehicleControl.find((err, vehicleControl) => {
        if (err) {console.log(err)}
        res.send({
            vehicleControl: vehicleControl
        })
    }).populate('Vehicle');
};

ctrl.createCV = (req, res) => {
    var body = req.body.vehicleControl;
    var vehicleControl = new VehicleControl({
        Min: body.Min,
        Vehicle: body.Vehicle,
        Status: body.Status,
    });

    
    helper.checkMinCreationVehicle(body);

    vehicleControl.save((err) => {
        if(err) {console.log(err)}
        res.send({
            success: true
        })
    });
};

ctrl.updateCV = (req, res) => {
    var id = req.params.vehicleControl_id;
    var body = req.body.vehicleControl;

    VehicleControl.findOne({_id: id}, (err, vehicleControl) => {
        if(err) {console.log(err)}
        else {
            if(!vehicleControl) {console.log(' no se encontro')}
            else {
                vehicleControl.Min = body.Min;
                vehicleControl.Vehicle = body.Vehicle;
                vehicleControl.Status = body.Status;
                
                
                helper.checkMinCreationVehicle(body);
                vehicleControl.save((err) => {
                    if(err) {console.log(err)}
                    res.send({
                        success: true
                    })
                });
            }
        }
    })

};

ctrl.getOne = (req, res) => {
    var id = req.params.vehicleControl_id;
    VehicleControl.findById(id, (err, vehicleControl) => {
        if (err) {console.log(err)}
        res.send({
            vehicleControl: vehicleControl
        })
    });
};

ctrl.removeCV = (req, res) => {
    var id = req.params.vehicleControl_id;
    var ChangeStatus = req.body.ChangeStatus;
    VehicleControl.findOne({_id: id}, (err, vehicleControl) => {
        if(err) {console.log(err)}
        else {
            if(!vehicleControl) {console.log(' no se encontro')}
            else {
                vehicleControl.Status = 'NOT AVAILABLE';
                if(ChangeStatus){
                    vehicleControl.ChangeStatus.push(ChangeStatus);
                }
                vehicleControl.save((err) => {
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