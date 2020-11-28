var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductStockSchema = new Schema({
  BatchNum: {type: String},
  Reserved: {type: Number},
  Available: {type: Number},
  OutOfService: {type: Number},
  TotalOrdered: {type: Number},
  Expiration: {type: Date},
  OrderDate: {type: Date},
  ArrivalDate: {type: Date},
  Price: {type: Number, required: true},
  Product: {type: Schema.Types.ObjectId,required: true,ref: 'Product'},
  Status: {type: String, enum: ['ACTIVE', 'INACTIVE'], required: true},
});

var ProductStock = mongoose.model("ProductStock", ProductStockSchema);
module.exports = ProductStock;

  