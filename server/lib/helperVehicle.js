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
    if(vehicleStock.Vehicle.Brand==null){
        body += '\n Orden de compra enviada:\n';
        body += 'Hola ' + client.Name + ' ' + client.LastName + '\n';
        body += 'Le informamos que la orden de compra para la compra de su vehículo ya ha sido enviada.\n';
        body += 'En breve nos estaremos comunicando con usted para avisarle cuándo estará en nuestra sucursal.\n';
        body += 'Una vez recibido, deberá esperar aproximadamente unos: '+date+' días para poder retirarlo\n';
        body += 'Gracias por su compra!!';        
    }
    else{
    body += '\n Compra Exitosa: \n';
    body += 'Hola ' + client.Name + ' ' + client.LastName + '\n';
    body += 'Le informamos que la compra de su vehículo ya ha sido procesada.\n';
    body += 'Tiempo estimado de entrega: ' + date + ' días \n';
    body += 'Marca: ' + vehicleStock.Vehicle.Brand + '\n';
    body += 'Modelo: ' + vehicleStock.Vehicle.Model + '\n';
    body += 'N°Chasis: ' + vehicleStock.ChasisNum + '\n';
    body += 'N°de Motor: ' + vehicleStock.EngineNum + '\n';
    body += 'Color: ' + vehicleStock.Color + '\n';
    body += 'Gracias por su compra!!';        
    }
    return body;
}

module.exports = helperVehicle;
