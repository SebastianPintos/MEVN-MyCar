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
    Bank: {type: String},
    TransactionNum: {type: String},
    CBU: {type: String},
    Holder: {type: String}
  },
  Status: {type: String, enum: ['ACTIVE', 'INACTIVE']}
});

var paymentType = mongoose.model("PaymentType", PaymentType);
module.exports = paymentType; 