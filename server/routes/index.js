const express = require('express');
const router = express.Router();

const client = require('../controllers/client');
const product = require('../controllers/product');
const productStock = require('../controllers/productStock');
const vehicle = require('../controllers/vehicle');
const home = require('../controllers/home');
const ProductStock = require('../models/productStock');
const employee = require('../models/employee');

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

    router.get('/productStock', productStock.index);
    router.post('/productStock/add', productStock.create);
    router.post('/productStock/:productStock_id/update', productStock.update);
    router.delete('/productStock/:productStock_id/delete', productStock.remove);

    router.get('/employee', employee.index);
    router.post('/employee/add', employee.create);
    router.post('/employee/:employee_id/update', employee.update);
    router.delete('/employee/:employee_id/delete', employee.remove);

    
    app.use(router);
}