const helperProduct = require("./helperProduct");

helperVehicle = {};
const VehicleStock = require('../models/vehicleStock');
const Vehicle = require('../models/vehicle');
const VehicleOrder = require('../models/vehicleOrder');

helperVehicle.SellVehicle = async (sell) => {

    var VehicleSell = sell.VehicleSell;

    for(i = 0; i < VehicleSell.lenght; i++){
        if(VehicleSell[i].VehicleStock){
            VehicleStock.findOne({_id: VehicleSell[i].VehicleStock}, async (err, vehicleDB) => {
                if(err) {return console.log(err)}
                else{
                    vehicleDB.Status = 'RESERVED';
                    
                    await vehicleDB.save((err) => {
                        if(err) {console.log(err)}
                        res.send({
                            success: true
                        });
                    });
                }
            })
        }
        else{
            if(VehicleSell[i].Vehicle){
                var vehicleOrder = new VehicleOrder({
                    Vehicle: VehicleSell[i].Vehicle,
                    Sell: sell._id,
                    Status: 'ORDER'
                });

                await vehicleOrder.save((err) => {
                    if(err) {console.log(err)}
                    res.send({
                        success: true
                    });
                });
                
            }
        }
    }
}



module.exports = helperVehicle;