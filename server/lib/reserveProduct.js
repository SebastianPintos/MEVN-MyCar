const reserveProduct = {};
const Product = require('../models/product');
const ProductStock = require('../models/productStock');

reserveProduct.reserve = (service) => {
    var products = [];
    for(item in service){
        for(product in item){
            products.push(product._id);
        }
    }

    for(item in products){
        ProductStock.findOneAndUpdate({Product: item.Product, Status: 'AVAILABLE'}, {Status: 'RESERVE'}, (err) => {
            if(err) {console.log(err)}
                res.send({
                    success: true
            })
        })    
    }
    
}