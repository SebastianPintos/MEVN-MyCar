/* 
  OrderDate: {type: Date},
  ArrivalDate: {type: Date},
  Price: {type: Number, required: true},
  Vehicle: [{
    Vehicle : {type: Schema.Types.ObjectId, required: true, ref: 'Vehicle'},
    ChasisNum: {type: String},
    Price: {type: Number, required: true}
  }],
  Dealer : {type: Schema.Types.ObjectId, required: true, ref: 'Dealer'},  
  BranchOffice: {type: Schema.Types.ObjectId,required: true,ref: 'BranchOffice'},
  Status: {type: String, enum: ['ACTIVE', 'INACTIVE'], required: true},
  */

  
const ctrl = {};
var PurchaseOrderV = require("../models/purchaseOrderV");

ctrl.index = (req, res) => {
    PurchaseOrderV.find((err, purchaseOrderV) => {
        if (err) {console.log(err)}
        res.send({
            purchaseOrderV: purchaseOrderV
        })
    }).populate('Vehicle.VehicleID').populate('Dealer').populate('BranchOffice');
};

ctrl.create = (req, res) => {
    var body = req.body.purchaseOrderV;
   // console.log(req.body.purchaseOrderV); 
    var purchaseOrderV = new PurchaseOrderV({
        Type: body.Type,
        Code: body.Code,
        OrderDate: body.OrderDate,
        ArrivalDate: body.ArrivalDate,
        Price: body.Price,
        Vehicle: body.Vehicle,
        Dealer : body.Dealer, 
        Status: "ACTIVE", 
        BranchOffice: body.BranchOffice,
        Info: body.Info,
        Venta : body.Venta,
    });
    
    purchaseOrderV.save((err) => {
        if(err) {console.log(err)}
        res.send({purchaseOrderV});
    });
};

ctrl.update = (req, res) => {
   var id = req.params.purchaseOrderV_id;
    var body = req.body.purchaseOrderV;
    PurchaseOrderV.findOne({_id: id}, (err, purchaseOrderV) => {
        if(err) {console.log(err)}
        else {
            if(!purchaseOrderV) {console.log('No se encontró el producto específico')}
            else {
                purchaseOrderV.Type = body.Type;
                purchaseOrderV.Code = body.Code;
                purchaseOrderV.OrderDate= body.OrderDate;
                purchaseOrderV.ArrivalDate= body.ArrivalDate;
                purchaseOrderV.Price= body.Price;
                purchaseOrderV.Vehicle= body.Vehicle;
                purchaseOrderV.Dealer = body.Dealer;
                purchaseOrderV.BranchOffice= body.BranchOffice;
                purchaseOrderV.Status = body.Status;
                purchaseOrderV.Info = body.Info;
                purchaseOrderV.Venta = body.Venta;
                purchaseOrderV.save((err) => {
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
    var id = req.params.purchaseOrderV_id;
    PurchaseOrderV.findOne({_id: id}, (err, purchaseOrderV) => {
        if(err) {console.log(err)}
        else {
            if(!purchaseOrderV) {console.log('No se encontró el producto específico')}
            else {
                purchaseOrderV.Status = 'INACTIVE';

                purchaseOrderV.save((err) => {
                    if(err) {console.log(err)}
                    res.send({
                        success: true
                        
                    })
                });
            }
        }
    });
};

ctrl.setArrival = (req, res) => {
    var id = req.params.purchaseOrderV_id;
    PurchaseOrderV.findOne({_id: id}, (err, purchaseOrderV) => {
        if(err) {console.log(err)}
        else {
            if(!purchaseOrderV) {console.log('No se encontró el producto específico')}
            else {
                purchaseOrderV.ArrivalDate = new Date();

                purchaseOrderV.save((err) => {
                    if(err) {console.log(err)}
                    res.send({
                        success: true
                        
                    })
                });
            }
        }
    });
};

ctrl.setEstado = (req, res) => {
    var id = req.params.purchaseOrderV_id;
    PurchaseOrderV.findOne({_id: id}, (err, purchaseOrderV) => {
        if(err) {console.log(err)}
        else {
            if(!purchaseOrderV) {console.log('No se encontró el producto específico')}
            else {
                purchaseOrderV.Type = "RECIBIDA";
                purchaseOrderV.save((err) => {
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
