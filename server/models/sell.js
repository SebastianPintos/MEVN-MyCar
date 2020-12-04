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
  Employee: {type: Schema.Types.ObjectId,  ref: 'Employee'},
  Service: [{type: Schema.Types.ObjectId, ref: 'Service'}],
  ProductStock: [{type: Schema.Types.ObjectId, ref: 'ProductStock'}],
  VehicleSold: [{
      VehicleStock: {type: Schema.Types.ObjectId, ref: 'VehicleStock'},
      PurchaseOrderV: {type: Schema.Types.ObjectId, ref: 'PurchaseOrderV'}
    }],
  PaymentType: [ 
    {Price: {type: Number},
    Type: {type: String, enum: ['CASH', 'CREDICARD', 'WIRETRANSFER']},
    CurrencyType: {type: String}, //EUR ARS USD REAL
    ExchangeRate: {type: Number},
    Credicard: {
      Company: {type: String},
      Bank: {type: String},
      Name: {type: String},
      Number: {type: String}
    },
    WireTransfer: {
      Bank: {type: String},
      TransactionNum: {type: String},
      CBU: {type: String},
      Holder: {type: String}
    }}],
  WorkOrder: {type: Schema.Types.ObjectId, ref: 'WorkOrder'}
},{timestamps: true});

var sell = mongoose.model("Sell", sellSchema);
module.exports = sell; 