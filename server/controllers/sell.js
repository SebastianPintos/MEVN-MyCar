const Sell = require('../models/sell');
const helperSell = require('../lib/helperSell');
const helperProduct = require('../lib/helperProduct');
const ctrl = {};

ctrl.listVehicle = (req, res) => {
    Sell.find((err, sell) => {
        if (err) { console.log(err) }
        res.send({
            sell: sell
        })
    }).populate('VehicleSold').populate('PaymentType').populate('Factura').populate('Client');
};

ctrl.sellVehicle = async (req, res) => {
    var body = req.body.sell;
    console.log(body);
    
    var sell = new Sell({
        CUIT: body.CUIT,
        Date: body.Date,
        RewarderDiscount: body.RewarderDiscount,
        Client: body.Client,
        Employee: body.Employee,
        Service: body.Service,
        ProductStock: body.ProductStock,
        VehicleSold: body.VehicleSold,
        PaymentType: body.PaymentType,
        Factura: body.Factura
    })

    console.log(sell);

    sell.save(async (err, sellDB) => {
        if(err) {console.log(err)}
        else{ 
            console.log(sellDB);
            await helperSell.SellVehicle(sellDB);
            await helperSell.SellProduct(sellDB);
            res.status(200).json(sellDB);
        }
    });
}

ctrl.sellService = async (req, res) => {
    var body = req.body.sell;
    
    var sell = new Sell({
        CUIT: body.CUIT,
        Date: body.Date,
        RewarderDiscount: body.RewarderDiscount,
        Client: body.Client,
        Employee: body.Employee,
        Service: body.Service,
        ProductStock: body.ProductStock,
        VehicleSold: body.VehicleSold,
        PaymentType: body.PaymentType,
        Factura: body.Factura
    })
}

module.exports = ctrl;
