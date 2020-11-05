var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductStockSchema = new Schema({
  Code: {
    type: String,
    required: true
  },
  BatchNum: {
    type: String,
    required: true
  },
  State: {
    type: String,
    required: true
  },
  Product: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Product'
  },
  Product: {
    type: Number,
    required: true,
    ref: 'Product'
  }
});
  var ProductStock = mongoose.model("ProductStock", ProductStockSchema);
  module.exports = ProductStock;

  