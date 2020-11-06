const express = require('express');
const router = express.Router();

const client = require('../controllers/client');
const product = require('../controllers/product');
const vehicle = require('../controllers/vehicle');
const home = require('../controllers/home');

module.exports = app => {
    router.get('/', home.index);
    router.get('/client', client.index);
    router.post('/client/add', client.create);
    router.post('/client/:client_id/update', client.update);
    router.delete('/client/:client_id/delete', client.remove);
    
    app.use(router);
}