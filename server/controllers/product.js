const ctrl = {};

var Product = require("../models/product");

ctrl.index = (req, res) => {
    Product.find((err, product) => {
        if (err) {console.log(err)}
        res.send({
            product: product
        })
    })
};

ctrl.create = (req, res) => {
    var body = req.body.product;
    console.log(req.body.product); 
    var product = new Product({
        Description: body.Description,
        Category: body.Category,
        SubCategory: body.SubCategory,
        Brand: body.Brand,
        SKU: body.SKU,
        LastPurchase: body.LastPurchase,
        SalePrice: body.SalePrice,
        Dealer: body.Dealer,
        Status: body.Statuts,
    });
    product.save((err) => {
        if(err) {console.log(err)}
        res.send({
            success: true
        })
    });
};

ctrl.update = (req, res) =>{
    var id = req.params.product_id;
    var body = req.body.product;
    Product.findOne({_id: id}, (err, product) => {
        if(!product) {console.log(err)}
        else{
            product.Description = body.Description;
            product.Category = body.Category;
            product.SubCategory = body.SubCategory;
            product.Brand = body.Brand;
            product.SKU = body.SKU;
            product.LastPurchase = body.LastPurchase;
            product.SalePrice = body.SalePrice;
            product.Dealer = body.Dealer;
            product.Status = body.Status;
        }
    })
};
ctrl.remove = (req, res) =>{
    var id = req.params.product_id;
    Product.findOne({_id: id}, (err, product) => {
        if(err) {console.log(err)}
        else {
            if(!product) {console.log(' no se encontro')}
            else {
                Product.State = 'Baja';

                Product.save((err) => {
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