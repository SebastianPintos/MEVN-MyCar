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
    }
};
helperVehicle.createMailNotifyArrival = (vehicle, vehicleStock, branchOffice,client) => {
    var body = '';
    body += '\n Su vehiculo ha llegado!! \n';
    body += '\n client ' + client.name + ' ' + client.lastName + '\n';
    body += 'Brand' + vehicle.brand + '\n';
    body += 'Model' + vehicle.model + '\n';
    body += 'chasisNum' + vehicleStock.ChasisNum + '\n';
    body += 'EngineNum' + vehicleStock.EngineNum + '\n';
    body += 'Color' + vehicleStock.Color + '\n';
    body += 'branchOffice' + branchOffice.adress.country + ',' + branchOffice.adress.city + ',' + branchOffice.adress.province + '\n';
    return body;
}

module.exports = helperVehicle;