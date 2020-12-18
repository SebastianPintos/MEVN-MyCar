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
helperVehicle.createMailNotifyArrival = (vehicleStock, client) => {
    var body = '';
    body += '\n Su vehiculo ha llegado!! \n';
    body += 'Cliente: ' + client.Name + ' ' + client.LastName + '\n';
    body += 'Marca:' + vehicleStock.Vehicle.Brand + '\n';
    body += 'Modelo:' + vehicleStock.Vehicle.Model + '\n';
    body += 'Color:' + vehicleStock.Color + '\n';
    return body;
}

helperVehicle.createMailNotifyCalculatedArrival = (date, client, vehicleStock) => {
    var body = '';
    body += '\n Cálculo Estimado de llegada de su vehículo\n';
    body += 'Tiempo estimado: ' + date + ' días \n';
    body += 'Cliente: ' + client.Name + ' ' + client.LastName + '\n';
    body += 'Marca: ' + vehicleStock.Vehicle.Brand + '\n';
    body += 'Modelo: ' + vehicleStock.Vehicle.Model + '\n';
    body += 'N°Chasis: ' + vehicleStock.ChasisNum + '\n';
    body += 'N°de Motor: ' + vehicleStock.EngineNum + '\n';
    body += 'Color: ' + vehicleStock.Color + '\n';
    
    return body;
}

module.exports = helperVehicle;
