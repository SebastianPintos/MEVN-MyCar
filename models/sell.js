var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var sellSchema = new Schema({
<<<<<<< HEAD
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
  VehicleSold: [{type: Schema.Types.ObjectId, ref: 'DeliveryVehicle'}],
 /* VehicleSold: [{
      VehicleStock: {type: Schema.Types.ObjectId, ref: 'VehicleStock'},
      PurchaseOrderV: {type: Schema.Types.ObjectId, ref: 'PurchaseOrderV'}
    }],*/
  PaymentType: [{
    Price: {type: Number},
=======
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
>>>>>>> 47f02b7f15a63ff96d6cd7da8da8e33336841998
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
<<<<<<< HEAD
    BranchOffice: {type: Schema.Types.ObjectId, ref: 'BranchOffice'},
    Reservation: {type: Schema.Types.ObjectId, ref: 'Reservation'}
=======
  WorkOrder: {type: Schema.Types.ObjectId, ref: 'WorkOrder'}
>>>>>>> 47f02b7f15a63ff96d6cd7da8da8e33336841998
},{timestamps: true});

var sell = mongoose.model("Sell", sellSchema);
module.exports = sell; 