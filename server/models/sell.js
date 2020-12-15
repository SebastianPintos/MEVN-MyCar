var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var sellSchema = new Schema({
 CUIT: {type: String},
 Date: {type: Date},
 RewarderDiscount: [{
    Detail: {type: String},
    Service: {type: Schema.Types.ObjectId, ref: 'Service'}
  }],
  Client: {type: Schema.Types.ObjectId, ref: 'Client'},
  Factura: {type: Schema.Types.ObjectId, ref: 'Factura'},
  Employee: {type: Schema.Types.ObjectId,  ref: 'Employee'},
  Service: [{type: Schema.Types.ObjectId, ref: 'Service'}],
  ProductStock: [{type: Schema.Types.ObjectId, ref: 'ProductStock'}],
  VehicleSold: [ {type: Schema.Types.ObjectId, ref: 'DeliveryVehicle'}],
 /* VehicleSold: [{
      VehicleStock: {type: Schema.Types.ObjectId, ref: 'VehicleStock'},
      PurchaseOrderV: {type: Schema.Types.ObjectId, ref: 'PurchaseOrderV'}
    }],*/
  PaymentType: [{
    Price: {type: Number},
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
    BranchOffice: {type: Schema.Types.ObjectId, ref: 'BranchOffice'},
    WorkOrder: {type: Schema.Types.ObjectId, ref: 'WorkOrder'}
},{timestamps: true});

var sell = mongoose.model("Sell", sellSchema);
module.exports = sell; 