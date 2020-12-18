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

/* {
    "paymentType": {
        "Price": "20023",
        "Type": "Credicard",
        "CurrencyType": "UY",
        "ExchangeRate": "5",
        "Credicard": {
            "Company": "VISA",
            "Bank": "NACION",
            "Name": "Juan Fernandez",
            "Number": "4564 4566 4512 4532"
        },
        "WireTransfer": {
            "Bank": "Banco Ciudad",
            "TransactionNum": "1231666",
            "CBU": "54666219815",
            "Holder": "Juan Carlos"
        }
    }
} */

ctrl.create = (req, res) => {
    var body = req.body.paymentType;
    console.log(req.body.paymentType); 
    var paymentType = new PaymentType({
        Price: body.Price,
        Type: body.Type,
        CurrencyType: body.CurrencyType,
        ExchangeRate: body.ExchangeRate,
        Credicard: body.Credicard,
        WireTransfer: body.WireTransfer
    });

    paymentType.save((err) => {
        if(err) {console.log(err)}
        res.send({paymentType});
});
}

ctrl.update = (req, res) => {
    var id = req.params.paymentType_id;
    var body = req.body.paymentType;
    PaymentType.findOne({_id: id}, (err, paymentType) => {
        if(err) {console.log(err)}
        else {
            if(!paymentType) {console.log(' no se encontro')}
            else {
                paymentType.Price = body.Price;                
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