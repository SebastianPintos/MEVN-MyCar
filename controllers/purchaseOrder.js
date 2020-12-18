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
<<<<<<< HEAD
    }).populate('Product.ProductID').populate('Dealer').populate('BranchOffice').populate('Employee');
};

ctrl.create = async (req, res) => {
    var body = req.body.purchaseOrder;
   // console.log(req.body.purchaseOrder);

    let countPO = 0;
    await PurchaseOrder.estimatedDocumentCount((err, count) => {
        if (err) { console.log(err) }
        else { countPO = count + 1}
    });

    var purchaseOrder = new PurchaseOrder({
        Type : body.Type,
        Code: countPO,
=======
    }).populate('Product.ProductID').populate('Dealer').populate('BranchOffice');
};

ctrl.create = (req, res) => {
    var body = req.body.purchaseOrder;
   // console.log(req.body.purchaseOrder); 
    var purchaseOrder = new PurchaseOrder({
>>>>>>> 47f02b7f15a63ff96d6cd7da8da8e33336841998
        OrderDate: body.OrderDate,
        ArrivalDate: body.ArrivalDate,
        Price: body.Price,
        Product: body.Product,
        Dealer : body.Dealer, 
        Status: "ACTIVE", 
        BranchOffice: body.BranchOffice,
<<<<<<< HEAD
        Info: body.Info,
        Employee: body.Employee
    });


=======
    });
>>>>>>> 47f02b7f15a63ff96d6cd7da8da8e33336841998
    
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
<<<<<<< HEAD
                purchaseOrder.Type = body.Type;
                purchaseOrder.Code = body.Code;
=======
>>>>>>> 47f02b7f15a63ff96d6cd7da8da8e33336841998
                purchaseOrder.OrderDate= body.OrderDate;
                purchaseOrder.ArrivalDate= body.ArrivalDate;
                purchaseOrder.Price= body.Price;
                purchaseOrder.Product= body.Product;
                purchaseOrder.Dealer = body.Dealer;
                purchaseOrder.BranchOffice= body.BranchOffice;
<<<<<<< HEAD
                purchaseOrder.Status = body.Status;
                purchaseOrder.Info = body.Info;
                purchaseOrder.Employee = body.Employee;

=======
                purchaseOrder.Status = body.Status
                
>>>>>>> 47f02b7f15a63ff96d6cd7da8da8e33336841998
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

ctrl.setArrival = (req, res) => {
    var id = req.params.purchaseOrder_id;
    PurchaseOrder.findOne({_id: id}, (err, purchaseOrder) => {
        if(err) {console.log(err)}
        else {
            if(!purchaseOrder) {console.log('No se encontró el producto específico')}
            else {
<<<<<<< HEAD
                let date = new Date();
                date = new Date(date.setTime(date.getTime()));
            
                purchaseOrder.ArrivalDate = date;

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

ctrl.setEstado = (req, res) => {
    var id = req.params.purchaseOrder_id;
    PurchaseOrder.findOne({_id: id}, (err, purchaseOrder) => {
        if(err) {console.log(err)}
        else {
            if(!purchaseOrder) {console.log('No se encontró el producto específico')}
            else {
                purchaseOrder.Type = "RECIBIDA";
=======
                purchaseOrder.ArrivalDate = new Date();
>>>>>>> 47f02b7f15a63ff96d6cd7da8da8e33336841998

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
