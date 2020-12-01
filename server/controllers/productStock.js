const ctrl = {};
var ProductStock = require("../models/productStock");

ctrl.index = (req, res) => {
    ProductStock.find((err, productStock) => {
        if (err) {console.log(err)}
        res.send({
            productStock: productStock
        })
    }).populate('Product');
};

ctrl.create = (req, res) => {
    var body = req.body.productStock;
    console.log(req.body.productStock); 
    var productStock = new ProductStock({
        Code: body.Code,
        BatchNum: body.BatchNum,
        Status: 'ACTIVE',
        Reserved: 0,
        Available: 0,
        OutOfService: 0,
        TotalOrdered: body.TotalOrdered,
        Expiration: body.Expiration,
        OrderDate: body.OrderDate,
        Product: body.Product,
    });
    
    productStock.save((err) => {
        if(err) {console.log(err)}
        res.send({
            success: true
        });
    });
};

ctrl.update = (req, res) => {
   var id = req.params.productStock_id;
    var body = req.body.productStock;
    ProductStock.findOne({_id: id}, (err, productStock) => {
        if(err) {console.log(err)}
        else {
            if(!productStock) {console.log('No se encontró el producto específico')}
            else {
                productStock.Code = body.Code;
                productStock.BatchNum = body.BatchNum;
                productStock.Status = 'ACTIVE';
                productStock.Reserved= body.Reserved,
                productStock.Available= body.Available,        
                productStock.OutOfService= body.OutOfService,
                productStock.TotalOrdered= body.TotalOrdered,
                productStock.Expiration= body.Expiration,
                productStock.Product = body.Product;
                productStock.OrderDate= body.OrderDate,
                productStock.ArrivalDate = body.ArrivalDate,
               
                productStock.save((err) => {
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
    var id = req.params.productStock_id;
    ProductStock.findOne({_id: id}, (err, productStock) => {
        if(err) {console.log(err)}
        else {
            if(!productStock) {console.log('No se encontró el producto específico')}
            else {
                productStock.Status = 'INACTIVE';

                productStock.save((err) => {
                    if(err) {console.log(err)}
                    res.send({
                        success: true
                        
                    })
                });
            }
        }
    });
};

ctrl.ModifyStock = (req,res) => {
    var products = req.body;
    for(x=0; x < products.length; x++){
        ProductStock.findOne( {id: products[x].id}, (err,productDb) => {
            if(err) {console.log(err)} 
            else{ 
                productDb.Available -= 1;
            }
            productDb.save((err) => {
                if(err) {console.log(err)}
            });
        });  
    }
}

module.exports = ctrl;
