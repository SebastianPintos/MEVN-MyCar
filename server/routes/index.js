const express = require('express');
const router = express.Router();

const client = require('../controllers/client');
const product = require('../controllers/product');
const productStock = require('../controllers/productStock');
const vehicle = require('../controllers/vehicle');
const home = require('../controllers/home');
const dealer = require('../controllers/dealer');
const service = require('../controllers/services');
const employee = require('../controllers/employee');
const branchOffice = require('../controllers/branchOffice');

module.exports = app => {
    router.get('/', home.index);

    router.get('/client', client.index);
    router.post('/client/add', client.create);
    router.post('/client/:client_id/update', client.update);
    router.delete('/client/:client_id/delete', client.remove);
    router.post('/client/:client_id/addvehicle', client.addVehicle);

    router.get('/vehicle', vehicle.index);
    router.post('/vehicle/add', vehicle.create);
    router.post('/vehicle/:vehicle_id/update', vehicle.update);
    router.delete('/vehicle/:vehicle_id/delete', vehicle.remove);
    router.get('/vehiclestock', vehicle.indexStock);
    router.post('/vehiclestock/add', vehicle.createStock);
    router.post('/vehiclestock/:vehicleStock_id/update', vehicle.updateStock);
    router.delete('/vehiclestock/:vehicleStock_id/delete', vehicle.removeStock);

    router.get('/dealer', dealer.index);
    router.post('/dealer/add', dealer.create);
    router.post('/dealer/:dealer_id/update', dealer.update);
    router.delete('/dealer/:dealer_id/delete', dealer.remove);
    router.get('/dealer/:dealer_id', dealer.getOne);

    router.get('/employee', employee.index);
    router.post('/employee/add', employee.create);
    router.post('/employee/:employee_id/update', employee.update);
    router.delete('/employee/:employee_id/delete', employee.remove);
    
    router.get('/branchOffice', branchOffice.index);
    router.post('/branchOffice/add', branchOffice.create);
    router.post('/branchOffice/:branchOffice_id/update', branchOffice.update);
    router.delete('/branchOffice/:branchOffice_id/delete', branchOffice.remove);
    
    router.get('/productStock', productStock.index);
    router.post('/productStock/add', productStock.create);
    router.post('/productStock/:productStock_id/update', productStock.update);
    router.delete('/productStock/:productStock_id/delete', productStock.remove);

    router.get('/product', product.index);
    router.post('/product/add', product.create);
    router.post('/product/:product_id/update', product.update);
    router.delete('/product/:product_id/delete', product.remove);

    router.get('/service', service.index);
    router.post('/service/add', service.create);
    router.post('/service/:service_id/update', service.update);
    router.delete('/service/:service_id/delete', service.remove);    
  
    app.use(router);
}