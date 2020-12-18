const ctrl = {};
const Product = require('../models/product');
const Reservation = require('../models/reservation');
const Service = require('../models/service');
const Client = require('../models/client');
const email = require('../lib/Email');
const helper = require('../lib/helperProduct');
const helperStock = require('../lib/helperStock');
const helperSell = require('../lib/helperSell');
const helperReport = require('../lib/helperReport');


ctrl.sellProduct = async (req, res) => {
    var body = req.body.sell;
    await helperSell.SellProduct(body);
    res.send("asas");
}

ctrl.reporte = async (req, res) => {
    var date = req.body.date;
    var report = await helperReport.TotalSell(date);
    console.log(report);
    res.send('asda');
}

ctrl.reporte2 = async (req, res) => {
    var date = req.body.date;
    var report = await helperReport.Expenses(date);
    console.log(report);
    res.send('asda');
}

ctrl.reporte3 = async (req, res) => {
    var dateStart = req.body.dateStart;
    var dateFinish = req.body.dateFinish;

    var report = await helperReport.Discriminated(dateStart, dateFinish);
    console.log('reporte afuerade la funcion',report);
    res.send('asda');
}

ctrl.reporte4 = async (req, res) => {
    var service = req.body.service;

    var report = await helperReport.getMoneyFromService(service);
    console.log('money ',report);
    res.send('asda');
}

ctrl.reporte5 = async (req, res) => {
    var dateStart = req.body.dateStart;
    var dateFinish = req.body.dateFinish;

    var report = await helperReport.bestSeller(dateStart, dateFinish);
    res.send('asda');
}

module.exports = ctrl;