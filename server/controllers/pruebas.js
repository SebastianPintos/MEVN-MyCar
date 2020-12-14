const ctrl = {};
const Product = require('../models/product');
const Reservation = require('../models/reservation');
const Service = require('../models/service');
const Client = require('../models/client');
const email = require('../lib/Email');
const helper = require('../lib/helperProduct');
const helperStock = require('../lib/helperStock');
const helperSell = require('../lib/helperSell');


ctrl.sellProduct = async (req, res) => {
    var body = req.body.sell;
    await helperSell.SellProduct(body);
    res.send("asas");
}

module.exports = ctrl;