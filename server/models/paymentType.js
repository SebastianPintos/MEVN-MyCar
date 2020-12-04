var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var PaymentType = new Schema({
  Price: {type: Number},
  Type: {type: String, enum: ['CASH', 'CREDICARD', 'WIRETRANSFER']},
  CurrencyType: {type: String, enum: ['USD', "EUR", "ARS","REA"]},
  ExchangeRate: {type: Number},
  Credicard: {
    Company: {type: String, required: true},
    Bank: {type: String},
    Name: {type: String,required: true},
    Number: {type: String,required: true}
  },
  WireTransfer: {
    Bank: {type: String},
    TransactionNum: {type: String},
    CBU: {type: String},
    Holder: {type: String}
  },
  Status: {type: String, enum: ['ACTIVE', 'INACTIVE']}
});

var paymentType = mongoose.model("PaymentType", PaymentType);
module.exports = paymentType; 