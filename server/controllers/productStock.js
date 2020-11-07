const ctrl = {};

const ProductStock = require("../models/productStock");
var productStock = require("../models/productStock");

ctrl.index = (req, res) => {
    productStock.find((err, productStock) => {
        if (err) {console.log(err)}
        res.send({
            productStock: productStock
        })
    })
};

ctrl.create = (req, res) => {
    var body = req.body.productStock;
    console.log(req.body.productStock); 
    var productoEspecifico = new productStock({
        Code: body.Code,
        BatchNum: body.BatchNum,
        State: 'Active',
        Product: body.Product //QUE PONGO ACA?
    });
    
    productoEspecifico.save((err) => {
        if(err) {console.log(err)}
        res.send({
            success: true
        })
    });

    ctrl.update = (req, res) => {
        var id = req.params.productStock_id;
        var body = req.body.productStock;
        productStock.findOne({_id: id}, (err, productStock) => {
            if(err) {console.log(err)}
            else {
                if(!ProductStock) {console.log('No se encontró el producto específico')}
                else {
                    productStock.Code = body.Code;
                    productStock.BatchNum = body.BatchNum;
                    productStock.State = 'Active';
                    productStock.Product = body.Product;
                   
    
                    productStock.save((err) => {
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
        var id = req.params.productStock_id;
        productStock.findOne({_id: id}, (err, productStock) => {
            if(err) {console.log(err)}
            else {
                if(!productStock) {console.log('No se encontró el producto específico')}
                else {
                    productStock.Status = 'Baja';
    
                    productStock.save((err) => {
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
