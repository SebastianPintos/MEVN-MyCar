const express = require('express');
const router = express.Router();

const client = require('../controllers/client');
const product = require('../controllers/product');
const productStock = require('../controllers/productStock');
const vehicle = require('../controllers/vehicle');
const home = require('../controllers/home');
const dealer = require('../controllers/dealer');
const service = require('../controllers/services');
const reservation = require('../controllers/reservation');
const employee = require('../controllers/employee');
const branchOffice = require('../controllers/branchOffice');
const remainder = require('../controllers/remainder');

const Email = require('../lib/Email')

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
    router.get('/vehicle/:vehicle_id', vehicle.getOne);
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
    
    router.get('/reservation', reservation.index);
    router.post('/reservation/add', reservation.create);
    router.post('/reservation/:reservation_id/update', reservation.update);
    router.delete('/reservation/:reservation_id/delete', reservation.remove);

    router.delete('/reservation/:reservation_id/cancel', reservation.cancel);
    router.post('/reservation/checkProduct', reservation.checkProduct);
    router.post('/reservation/reserveproduct', reservation.reserveProduct);
    router.post('/reservation/checkHour', reservation.checkHour);
    
    router.post('/reservation/prueba', reservation.pruebas);
    //router.get('/reservation/:reservation_id/reservationConfirm', Email.ReservationConfirm);

    router.get('/remainder', remainder.index);
    router.post('/remainder/add', remainder.create);
    router.post('/remainder/:remainder_id/update', remainder.update);
 
    router.post('/sell/products', productStock.ModifyStock);
    app.use(router);
}