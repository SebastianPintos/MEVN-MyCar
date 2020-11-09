const express = require('express');
const router = express.Router();

const client = require('../controllers/client');
const product = require('../controllers/product');
const vehicle = require('../controllers/vehicle');
const home = require('../controllers/home');
const dealer = require('../controllers/dealer');

module.exports = app => {
    router.get('/', home.index);
    router.get('/client', client.index);
    router.post('/client/add', client.create);
    router.post('/client/:client_id/update', client.update);
    router.delete('/client/:client_id/delete', client.remove);

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

    app.use(router);
}