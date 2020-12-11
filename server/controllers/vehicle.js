const ctrl = {};

var Vehicle = require('../models/vehicle');
var VehicleStock = require('../models/vehicleStock');

ctrl.index = (req, res) => {
    Vehicle.find((err, vehicle) => {
        if (err) {console.log(err)}
        res.send({
            vehicle: vehicle
        })
    }).populate('Dealer');
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
        Status: "ACTIVE",
        Dealer: body.Dealer
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
                vehicle.Dealer = body.Dealer
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
                vehicle.Status = 'INACTIVE';

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

ctrl.indexStock = (req, res) => {
    VehicleStock.find((err, vehicle) => {
        if (err) {console.log(err)}
        res.send({
            vehicle: vehicle
        })
    }).populate('Vehicle',(err, story) =>{
        if (err) {console.log(err)}
        else {console.log(story)}
    })
};

ctrl.createStock = (req, res) => {
    var body = req.body.vehicleStock;
    console.log(req.body.vehicleStock);
    var vehicleStock = new VehicleStock({
        ChasisNum: body.ChasisNum,
        EngineNum: body.EngineNum,
        Domain: body.Domain,
        Color: body.Color,
        PurchasedPrice: body.PurchasedPrice,
        Detail: body.Detail,
        Vehicle: body.Vehicle,
        UsedDetail: body.UsedDetail,
        Status: body.Status,
        Kind: body.Kind,
        BranchOffice: body.BranchOffice
    });

  
    vehicleStock.save((err) => {
        if(err) {console.log(err)}
        res.send({
            success: true
        })
    });
};

ctrl.updateStock = (req, res) => {
    var id = req.params.vehicleStock_id;
    var body = req.body.vehicleStock;

    VehicleStock.findOne({_id: id}, (err, vehicleStock) => {
        if(err) {console.log(err)}
        else {
            if(!vehicleStock) {console.log(' no se encontro')}
            else {
                vehicleStock.ChasisNum = body.ChasisNum;
                vehicleStock.EngineNum = body.EngineNum;
                vehicleStock.Domain = body.Domain;
                vehicleStock.Color = body.Color;
                vehicleStock.PurchasedPrice = body.PurchasedPrice;
                vehicleStock.Detail = body.Detail;
                vehicleStock.Vehicle = body.Vehicle;
                vehicleStock.UsedDetail = body.UsedDetail;
                vehicleStock.Status = body.Status;
                vehicleStock.ChangeStatus.push(body.ChangeStatus)
                vehicleStock.BranchOffice = body.BranchOffice,
                vehicleStock.Kind = body.Kind,
                
              
                vehicleStock.save((err) => {
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
    var id = req.params.vehicle_id;
    Vehicle.findById(id, (err, vehicle) => {
        if (err) {console.log(err)}
        res.send({
            vehicle: vehicle
        })
    });
};

ctrl.removeStock = (req, res) => {
    var id = req.params.vehicleStock_id;
    var ChangeStatus = req.body.ChangeStatus;
    VehicleStock.findOne({_id: id}, (err, vehicleStock) => {
        if(err) {console.log(err)}
        else {
            if(!vehicleStock) {console.log(' no se encontro')}
            else {
                vehicleStock.Status = 'NOT AVAILABLE';
                if(ChangeStatus){
                    vehicleStock.ChangeStatus.push(ChangeStatus);
                }
                vehicleStock.save((err) => {
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