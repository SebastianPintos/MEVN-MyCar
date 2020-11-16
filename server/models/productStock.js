var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductStockSchema = new Schema({
  Code: {type: String,required: true},
  BatchNum: {type: String},
  Reserved: {type: Number},
  Available: {type: Number},
  OutOfService: {type: Number},
  TotalOrdered: {type: Number},
  Expiration: {type: Date},
  OrderDate: {type: Date},
  ArrivalDate: {type: Date},
  Product: {type: Schema.Types.ObjectId,required: true,ref: 'Product'},
  Status: {type: String, enum: ['ACTIVE', 'INACTIVE'], required: true},
});

var ProductStock = mongoose.model("ProductStock", ProductStockSchema);
module.exports = ProductStock;

  