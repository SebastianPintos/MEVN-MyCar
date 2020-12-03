var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var PaymentType = new Schema({
  Type: {type: String},
  CurrencyType: {type: String},
  ExchangeRate: {type: Number},
  Credicard: {
    Company: {type: String, required: true},
    Bank: {type: String},
    Name: {type: String,required: true},
    Number: {type: String,required: true}
  },
  WireTransfer: {
    Bank: {type: String, required: true},
    TransactionNum: {type: String, required: true},
    CBU: {type: String, required: true},
    Holder: {type: String}
  },
  Status: {type: String, enum: ['ACTIVE', 'INACTIVE'], required: true}
});

var paymentType = mongoose.model("PaymentType", PaymentType);
module.exports = paymentType; 