/*

  OrderDate: {type: Date},
  ArrivalDate: {type: Date},
  Price: {type: Number, required: true},
  Product: [{
    ProductID : {type: Schema.Types.ObjectId, required: true, ref: 'Product'},
    Expiration: {type: Date},
    TotalOrdered: {type: Number},
    Price: {type: Number, required: true}
  }],
  Dealer : {type: Schema.Types.ObjectId, required: true, ref: 'Dealer'},  
  BranchOffice: {type: Schema.Types.ObjectId,required: true,ref: 'BranchOffice'},
  Status: {type: String, enum: ['ACTIVE', 'INACTIVE'], required: true},
*/
const ctrl = {};
var PurchaseOrder = require("../models/purchaseOrder");

ctrl.index = (req, res) => {
    PurchaseOrder.find((err, purchaseOrder) => {
        if (err) {console.log(err)}
        res.send({
            purchaseOrder: purchaseOrder
        })
    }).populate('Product.ProductID').populate('Dealer').populate('BranchOffice');
};

ctrl.create = (req, res) => {
    var body = req.body.purchaseOrder;
   // console.log(req.body.purchaseOrder); 
    var purchaseOrder = new PurchaseOrder({
        OrderDate: body.OrderDate,
        ArrivalDate: body.ArrivalDate,
        Price: body.Price,
        Product: body.Product,
        Dealer : body.Dealer, 
        Status: "ACTIVE", 
        BranchOffice: body.BranchOffice,
    });
    
    purchaseOrder.save((err) => {
        if(err) {console.log(err)}
        res.send({
            success: true
        });
    });
};

ctrl.update = (req, res) => {
   var id = req.params.purchaseOrder_id;
    var body = req.body.purchaseOrder;
    PurchaseOrder.findOne({_id: id}, (err, purchaseOrder) => {
        if(err) {console.log(err)}
        else {
            if(!purchaseOrder) {console.log('No se encontró el producto específico')}
            else {
                purchaseOrder.OrderDate= body.OrderDate;
                purchaseOrder.ArrivalDate= body.ArrivalDate;
                purchaseOrder.Price= body.Price;
                purchaseOrder.Product= body.Product;
                purchaseOrder.Dealer = body.Dealer;
                purchaseOrder.BranchOffice= body.BranchOffice;
                purchaseOrder.Status = body.Status
                
                purchaseOrder.save((err) => {
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
    var id = req.params.purchaseOrder_id;
    PurchaseOrder.findOne({_id: id}, (err, purchaseOrder) => {
        if(err) {console.log(err)}
        else {
            if(!purchaseOrder) {console.log('No se encontró el producto específico')}
            else {
                purchaseOrder.Status = 'INACTIVE';

                purchaseOrder.save((err) => {
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
