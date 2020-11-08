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
    var Product = new Client({
        Name: body.Name,
        Description: body.Description,
        Category: body.Category,
        SubCategory: body.SubCategory,
        Brand: body.Brand,
        SKU: body.SKU,
        LastPurchase: body.LastPurchase,
        SalePrice: body.SalePrice,
        Dealer: body.Dealer,
        State: 'active',
    });
    Product.save((err) => {
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
            product.Name =  body.Name;
            product.Description = body.Description;
            product.Category = body.Category;
            product.SubCategory = body.SubCategory;
            product.Brand = body.Brand;
            product.SKU = body.SKU;
            product.LastPurchase = body.LastPurchase;
            product.SalePrice = body.SalePrice;
            product.Dealer = body.Dealer;
        }
    })
};
ctrl.remove = (req, res) =>{
    var id = req.params.product_id;
    Client.findOne({_id: id}, (err, product) => {
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