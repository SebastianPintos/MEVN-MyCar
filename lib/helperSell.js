const helperProduct = require("./helperProduct");

helperSell = {};
const VehicleStock = require('../models/vehicleStock');
const Vehicle = require('../models/vehicle');
const VehicleOrder = require('../models/vehicleOrder');
const ProductStock = require('../models/productStock');
const Sell = require('../models/sell');
const helperStock = require('../lib/helperStock');
const Service = require('../models/service');


helperSell.SellVehicle = async (sell) => {
    
    var VehicleSold = [];
    await Sell.findOne({_id: sell._id}, (err, sellDB) => {
        if(sellDB.VehicleSold==null){
            return;
        }
        if(err) {console.log(err)}
        else{
            for(i = 0; i < sellDB.VehicleSold.length; i++){
                if(sellDB.VehicleSold[i].VehicleStock){
                    console.log('vehicle', sellDB.VehicleSold[i].VehicleStock);
                    VehicleSold.push(sellDB.VehicleSold[i].VehicleStock);
                }
            }
        }
    }).populate('VehicleSold');
    
    console.log(VehicleSold);

    for(i = 0; i < VehicleSold.length; i++){
        if(VehicleSold[i]){
            VehicleStock.findOne({_id: VehicleSold[i]}, async (err, vehicleDB) => {
                if(err) {return console.log(err)}
                else{
                    vehicleDB.Status = 'RESERVED';
                    console.log(vehicleDB);
                    
                    await vehicleDB.save((err) => {
                        if(err) {console.log(err)}
                    });
                }
            })
        }
    }
}

helperSell.SellProduct =  async (sell) => {
    
    var productSorted = [];
    if(sell.ProductStock!=null){
    for (i = 0; i < sell.ProductStock.length; i++) {
        if (productSorted.indexOf(sell.ProductStock[i].toString()) === -1) {
            console.log('sorteador de productos' + productSorted);
            productSorted.push(sell.ProductStock[i].toString());
        }
    }
   }
    console.log(productSorted);

    var count = 0;
    var arrayProductQuantity = [];
    for (i = 0; i < productSorted.length; i++) {
        for (y = 0; y < sell.ProductStock.length; y++) {
            if (productSorted[i] === sell.ProductStock[y].toString()) {
                count += 1;
            }
        }
        var productQuantity = { id: productSorted[i], quantity: count };
        arrayProductQuantity.push(productQuantity);
        count = 0;
    }

    console.log(arrayProductQuantity);

    for (i = 0; i < arrayProductQuantity.length; i++) {
        await ProductStock.find({ _id: arrayProductQuantity[i].id, Status: 'ACTIVE' }, async (err, productsDB) => {
            if (err) { console.log(err) }
            else {
                var quantity = 0;
                console.log(productsDB);
                for (y = 0; y < productsDB.length; y++) {
                    if (arrayProductQuantity[i].quantity != 0) {
                        if (productsDB[y].Available >= arrayProductQuantity[i].quantity) {
                            productsDB[y].Available -= arrayProductQuantity[i].quantity;
                            arrayProductQuantity[i].quantity = 0;
                        } else {
                            arrayProductQuantity[i].quantity -= productsDB[y].Available;
                            productsDB[y].Available = 0;
                        }
                    }                    
                    
                    await productsDB[y].save((err) => {
                        if (err) { console.log(err) }
                    });
                    
                    await helperStock.checkMin(productsDB[y]);

                }
            }
        });
    }
}

helperSell.SellProductFromReserve =  async (sell) => {
    
    var service = [];
    for(i = 0; i < sell.Service.length; i++){
        await Service.findOne({_id: sell.Service[i]}, (err, serviceDB) => {
            service.push(serviceDB);
        })
    }
    console.log(service);
    
    var products = [];
    for (i = 0; i < service.length; i++) {
        var arrayProduct = service[i].Product;
        for (y = 0; y < arrayProduct.length; y++) {
            products.push(arrayProduct[y].toString());
        }
    }
    console.log(products);

    var productSorted = [];
    for (i = 0; i < products.length; i++) {
        if (productSorted.indexOf(products[i].toString()) === -1) {
            productSorted.push(products[i].toString());
        }
    }
    console.log(productSorted);

    var count = 0;
    var arrayProductQuantity = [];
    for (i = 0; i < productSorted.length; i++) {
        for (y = 0; y < products.length; y++) {
            if (productSorted[i] === products[y].toString()) {
                count += 1;
            }
        }
        var productQuantity = { id: productSorted[i], quantity: count };
        arrayProductQuantity.push(productQuantity);
        count = 0;
    }

    console.log(arrayProductQuantity);

    for (i = 0; i < arrayProductQuantity.length; i++) {
        await ProductStock.find({ Product: arrayProductQuantity[i].id, Status: 'ACTIVE' }, async (err, productsDB) => {
            if (err) { console.log(err) }
            else {
                var quantity = 0;
                console.log(productsDB);
                for (y = 0; y < productsDB.length; y++) {
                    if (arrayProductQuantity[i].quantity != 0) {
                        if (productsDB[y].Reserved >= arrayProductQuantity[i].quantity) {
                            productsDB[y].Reserved -= arrayProductQuantity[i].quantity;
                            arrayProductQuantity[i].quantity = 0;
                        } else {
                            arrayProductQuantity[i].quantity -= productsDB[y].Reserved;
                            productsDB[y].Reserved = 0;
                        }
                    }                    
                    
                    await productsDB[y].save((err) => {
                        if (err) { console.log(err) }
                    });
                    

                }
            }
        });
    }
}


module.exports = helperSell;