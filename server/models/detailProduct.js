var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var DetailProductSchema = new Schema({
    batch: String,
    lastbuyprice: String,
    sellprice: String,
    dealer: String,
    deliverytime: String,
    detail: String,
    product:{type: mongoose.Schema.Types.ObjectId, ref: 'Product'}
  });
  
  var detailProduct = mongoose.model("DetailProduct", DetailProductSchema);
  module.exports = detailProduct;