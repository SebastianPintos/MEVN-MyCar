const ctrl = {};
var ProductStock = require("../models/productStock");
const helper = require('../lib/helperStock');

ctrl.index = (req, res) => {
    ProductStock.find((err, productStock) => {
        if (err) {console.log(err)}
        res.send({
            productStock: productStock
        })
    }).populate('Product').populate('BranchOffice');
};

ctrl.create = (req, res) => {
    var body = req.body.productStock;
    console.log(req.body.productStock);

    var productStock = new ProductStock({
        BatchNum: body.BatchNum,
        Status: 'ACTIVE',
        Reserved: body.Reserved,
        Available: body.Available,
        OutOfService: body.OutOfService,
        Expiration: body.Expiration,
        Product: body.Product,
        Price: body.Price,
        BranchOffice: body.BranchOffice
    });

    helper.checkMin(body);
    
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
                productStock.BatchNum = body.BatchNum;
                productStock.Status = 'ACTIVE';
                productStock.Reserved= body.Reserved,
                productStock.Available= body.Available,        
                productStock.OutOfService= body.OutOfService,
                productStock.Expiration= body.Expiration,
                productStock.Product = body.Product;
                productStock.Price = body.Price,
                productStock.BranchOffice = body.BranchOffice,
                
                
                //helper.checkMin(body);
                
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

module.exports = ctrl;
