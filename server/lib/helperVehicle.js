const helperProduct = require("./helperProduct");

helperVehicle = {};
const VehicleStock = require('../models/vehicleStock');
const Vehicle = require('../models/vehicle');
const VehicleOrder = require('../models/vehicleOrder');

helperVehicle.SellVehicle = async (sell) => {

    var VehicleSold = sell.VehicleSold;

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
        else{
            if(VehicleSold[i].Vehicle){
                var vehicleOrder = new VehicleOrder({
                    Vehicle: VehicleSold[i].Vehicle,
                    Sell: sell._id,
                    Status: 'ORDER'
                });
                console.log(vehicleOrder);

                await vehicleOrder.save((err, data) => {
                    if(err) {console.log(err)}
                    else{
                        console.log(data);
                    }
                });
                
            }
        }
    }
}



module.exports = helperVehicle;