const ctrl = {};

var PaymentType = require("../models/paymentType");

ctrl.index = (req, res) => {
    PaymentType.find((err, paymentType) => {
        if (err) {console.log(err)}
        res.send({
            PaymentType: paymentType
        })
    });
};

ctrl.create = (req, res) => {
    var body = req.body.paymentType;
    console.log(req.body.paymentType); 
    var paymentType = new PaymentType({
        Type: body.Type,
        CurrencyType: body.CurrencyType,
        ExchangeRate: body.ExchangeRate,
        Credicard: body.Credicard,
        WireTransfer: body.WireTransfer
    });

    paymentType.save((err) => {
        if(err) {console.log(err)}
        res.send({
            success: true
        })
    });
};

ctrl.update = (req, res) => {
    var id = req.params.paymentType_id;
    var body = req.body.paymentType;
    PaymentType.findOne({_id: id}, (err, paymentType) => {
        if(err) {console.log(err)}
        else {
            if(!paymentType) {console.log(' no se encontro')}
            else {
                paymentType.Type = body.Type;
                paymentType.CurrencyType = body.CurrencyType;
                paymentType.ExchangeRate = body.ExchangeRate;
                paymentType.Credicard = body.Credicard;
                paymentType.WireTransfer = body.WireTransfer;

                paymentType.save((err) => {
                    if(err) {console.log(err)}
                    res.send({
                        success: true
                    })
                });
            }
        }
    })
};

ctrl.remove = (req, res) => {
    var id = req.params.paymentType_id;
    PaymentType.findOne({_id: id}, (err, paymentType) => {
        if(err) {console.log(err)}
        else {
            if(!paymentType) {console.log(' no se encontro')}
            else {
                paymentType.Status = 'INACTIVE';

                paymentType.save((err) => {
                    if(err) {console.log(err)}
                    res.send({
                        success: true
                    })
                });
            }
        }
    })
};


module.exports = ctrl;