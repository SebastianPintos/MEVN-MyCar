const Sell = require('../models/sell');
const helperVehicle = require('../lib/helperVehicle');
const helperProduct = require('../lib/helperProduct');
const ctrl = {};

ctrl.listVehicle = (req, res) => {
    Sell.find((err, sell) => {
        if (err) { console.log(err) }
        res.send({
            Sell: sell
        })
    }).populate('VehicleSell').populate('PaymentType');
};

ctrl.sellVehicle = async (req, res) => {
    var body = req.body.sell;
    console.log(body);
    
    var sell = new Sell({
        PriceFeeTax: body.PriceFeeTax,
        Tax: body.Tax,
        Discount: body.Discount,
        RewarderDiscount: body.RewarderDiscount,
        CompanyName: body.CompanyName,
        CUIT: body.CUIT,
        TaxCategory: body.TaxCategory,
        Client: body.Client,
        Employee: body.Employee,
        Service: body.Service,
        ProductStock: body.ProductStock,
        Vehicle: body.Vehicle,
        PaymentType: body.PaymentType
    })

    console.log(sell);

    sell.save(async (err, sellDB) => {
        if(err) {console.log(err)}
        else{
            console.log(sellDB);
            await helperVehicle.SellVehicle(sellDB);
            res.status(200).json({title: 'Venta generada correctamente'});
        }
    });
}

module.exports = ctrl;
