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
    }).populate('Vehicle.VehicleID').populate('Dealer').populate('BranchOffice').populate('Employee');
};

ctrl.create = async (req, res) => {
    let countPO = 0;
    await PurchaseOrderV.estimatedDocumentCount((err, count) => {
        if (err) { console.log(err) }
        else { countPO = count + 1;
 
    var body = req.body.purchaseOrderV;
   // console.log(req.body.purchaseOrderV); 
    var purchaseOrderV = new PurchaseOrderV({
        Type: body.Type,
        Code: countPO,
        OrderDate: body.OrderDate,
        ArrivalDate: body.ArrivalDate,
        Price: body.Price,
        Vehicle: body.Vehicle,
        Dealer : body.Dealer, 
        Status: "ACTIVE", 
        BranchOffice: body.BranchOffice,
        Info: body.Info,
        Venta : body.Venta,
        Employee: body.Employee
    });
    
    purchaseOrderV.save((err) => {
        if(err) {console.log(err)}
        res.send({purchaseOrderV});
    });
}
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
                purchaseOrderV.Employee = body.Employee;
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
                
                let date = new Date();
                date = new Date(date.setTime(date.getTime()));
            
                purchaseOrderV.ArrivalDate = date;

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
