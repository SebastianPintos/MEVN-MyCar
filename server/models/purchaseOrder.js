var mongoose = require('mongoose');
var Schema = mongoose.Schema;
/*PRODUCT:
  Description: {type: String},
    Category: {type: String, required: true},
    SubCategory: {type: String},
    Brand: {type: String, required: true},
    SKU: {type: String, required: true},
    LastPurchasePrice: {type: Number, required: true},
    SalePrice: {type: Number, required: true},
    ShippingBranch: {type: Number, required: true},
    ShippingDealer: {type: Number, required: true},
    Dealer: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Dealer'
    },
    Status: {type: String, enum: ['ACTIVE', 'INACTIVE'], required: true},

-----
PRODUCT STOCK:
BatchNum: {type: String},
  Reserved: {type: Number},
  Available: {type: Number},
  OutOfService: {type: Number},
  Expiration: {type: Date},
  Price: {type: Number, required: true},
  Product: {type: Schema.Types.ObjectId,required: true,ref: 'Product'},
  BranchOffice: {type: Schema.Types.ObjectId,required: true,ref: 'BranchOffice'},
  Status: {type: String, enum: ['ACTIVE', 'INACTIVE'], required: true},
    */ 
var PurchaseOrderSchema = new Schema({
  Code: {type: String},
  OrderDate: {type: Date},
  ArrivalDate: {type: Date},
  Price: {type: Number, required: true},
  Product: [{
    ProductID : {type: Schema.Types.ObjectId, required: true, ref: 'Product'},
    BatchNum: {type: String},
    Expiration: {type: Date},
    TotalOrdered: {type: Number},
    Price: {type: Number, required: true}
  }],
  Dealer : {type: Schema.Types.ObjectId, required: true, ref: 'Dealer'},  
  BranchOffice: {type: Schema.Types.ObjectId,ref: 'BranchOffice'},
  Status: {type: String, enum: ['ACTIVE', 'INACTIVE'], required: true},
  Type: {type: String, enum: ['ENVIADA', 'RECIBIDA'], required: true},
  Info: {type: String},
  Employee: {type: Schema.Types.ObjectId, required: true, ref: 'Employee'},
},{timestamps: true});

var PurchaseOrder = mongoose.model("PurchaseOrder", PurchaseOrderSchema);
module.exports = PurchaseOrder;

  