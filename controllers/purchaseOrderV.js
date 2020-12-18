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
<<<<<<< HEAD
    }).populate('Vehicle.VehicleID').populate('Dealer').populate('BranchOffice').populate('Employee');
=======
    }).populate('Vehicle.VehicleID').populate('Dealer').populate('BranchOffice');
>>>>>>> 47f02b7f15a63ff96d6cd7da8da8e33336841998
};

ctrl.create = (req, res) => {
    var body = req.body.purchaseOrderV;
   // console.log(req.body.purchaseOrderV); 
    var purchaseOrderV = new PurchaseOrderV({
<<<<<<< HEAD
        Type: body.Type,
        Code: body.Code,
=======
>>>>>>> 47f02b7f15a63ff96d6cd7da8da8e33336841998
        OrderDate: body.OrderDate,
        ArrivalDate: body.ArrivalDate,
        Price: body.Price,
        Vehicle: body.Vehicle,
        Dealer : body.Dealer, 
        Status: "ACTIVE", 
        BranchOffice: body.BranchOffice,
<<<<<<< HEAD
        Info: body.Info,
        Venta : body.Venta,
        Employee: body.Employee
=======
>>>>>>> 47f02b7f15a63ff96d6cd7da8da8e33336841998
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
<<<<<<< HEAD
                purchaseOrderV.Type = body.Type;
                purchaseOrderV.Code = body.Code;
=======
>>>>>>> 47f02b7f15a63ff96d6cd7da8da8e33336841998
                purchaseOrderV.OrderDate= body.OrderDate;
                purchaseOrderV.ArrivalDate= body.ArrivalDate;
                purchaseOrderV.Price= body.Price;
                purchaseOrderV.Vehicle= body.Vehicle;
                purchaseOrderV.Dealer = body.Dealer;
                purchaseOrderV.BranchOffice= body.BranchOffice;
<<<<<<< HEAD
                purchaseOrderV.Status = body.Status;
                purchaseOrderV.Info = body.Info;
                purchaseOrderV.Employee = body.Employee;
                purchaseOrderV.Venta = body.Venta;
=======
                purchaseOrderV.Status = body.Status
                
>>>>>>> 47f02b7f15a63ff96d6cd7da8da8e33336841998
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
<<<<<<< HEAD
                
                let date = new Date();
                date = new Date(date.setTime(date.getTime()));
            
                purchaseOrderV.ArrivalDate = date;
=======
                purchaseOrderV.ArrivalDate = new Date();
>>>>>>> 47f02b7f15a63ff96d6cd7da8da8e33336841998

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

<<<<<<< HEAD
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
=======
>>>>>>> 47f02b7f15a63ff96d6cd7da8da8e33336841998
module.exports = ctrl;
