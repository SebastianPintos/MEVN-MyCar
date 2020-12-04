const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser')
const routes = require('../routes/index');

module.exports = app => {
   
    //settings
    app.set('port', process.env.PORT || 3000);

    //Middlewares
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Authorization,token, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
        res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
        next();
    });
    app.use(morgan('dev'));
    app.use(express.urlencoded({extended: false}));
    app.use(express.json());
    app.use(bodyParser.json())

    //Routes
    routes(app);
    
    return app;
}