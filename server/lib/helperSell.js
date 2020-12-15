const helperProduct = require("./helperProduct");

helperSell = {};
const VehicleStock = require('../models/vehicleStock');
const Vehicle = require('../models/vehicle');
const VehicleOrder = require('../models/vehicleOrder');
const ProductStock = require('../models/productStock');
const Sell = require('../models/sell');
const helperStock = require('../lib/helperStock');

helperSell.SellVehicle = async (sell) => {

    var VehicleSold = [];
    await Sell.findOne({_id: sell._id}, (err, sellDB) => {
        if(err) {console.log(err)}
        else{
            for(i = 0; i < sellDB.VehicleSold.length; i++){
                VehicleSold.push(sellDB.VehicleSold[i].VehicleStock);
            }
        }
    }).populate('VehicleSold');
    
    console.log(VehicleSold);

    for(i = 0; i < VehicleSold.length; i++){
        if(VehicleSold[i].VehicleStock){
            VehicleStock.findOne({_id: VehicleSold[i].VehicleStock}, async (err, vehicleDB) => {
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
    for (i = 0; i < sell.ProductStock.length; i++) {
        if (productSorted.indexOf(sell.ProductStock[i]) === -1) {
            console.log('sorteador de productos' + productSorted);
            productSorted.push(sell.ProductStock[i]);
        }
    }
    console.log(productSorted);

    var count = 0;
    var arrayProductQuantity = [];
    for (i = 0; i < productSorted.length; i++) {
        for (y = 0; y < sell.ProductStock.length; y++) {
            if (productSorted[i] === sell.ProductStock[y]) {
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


module.exports = helperSell;