var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var sellSchema = new Schema({
  PriceFreeTax: {type: Number, required: true},
  Tax: {type: Number},
  Discount: {type: Number},
  RewarderDiscount: [{
    Detail: {type: String},
    Service: {type: Schema.Types.ObjectId, ref: 'Service'}
  }],
  CompanyName: {type: String},
  CUIT: {type: String},
  TaxCategory: {type: String},
  Client: {type: Schema.Types.ObjectId, ref: 'Client'},
  Employee: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Employee'
    },
  Service: [{
      type: Schema.Types.ObjectId,
      ref: 'Service'
    }],
  ProductStock: [{
      type: Schema.Types.ObjectId,
      ref: 'ProductStock'
    }],
  Vehicle: [{
      type: Schema.Types.ObjectId,
      ref: 'Vehicle'
    }],
  PaymentType: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'PaymentType'
  }
});

var sell = mongoose.model("Sell", sellSchema);
module.exports = sell; 