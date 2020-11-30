var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PurchaseOrderSchema = new Schema({
  OrderDate: {type: Date},
  ArrivalDate: {type: Date},
  Price: {type: Number, required: true},
  Product: [{
    ProductID : {type: Schema.Types.ObjectId, required: true, ref: 'Product'},
    Expiration: {type: Date},
    TotalOrdered: {type: Number},
    Price: {type: Number, required: true}
  }],
  Dealer : {type: Schema.Types.ObjectId, required: true, ref: 'Dealer'},  
  BranchOffice: {type: Schema.Types.ObjectId,required: true,ref: 'BranchOffice'},
  Status: {type: String, enum: ['ACTIVE', 'INACTIVE'], required: true},
});

var PurchaseOrder = mongoose.model("PurchaseOrder", PurchaseOrderSchema);
module.exports = PurchaseOrder;

  