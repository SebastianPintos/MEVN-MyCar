var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ProductSchema = new Schema({
    code: String,
    category: String,
    subcategory: String,
    name: String,
    brand: String,
    detail: String,
  });
  
  var product = mongoose.model("Product", ProductSchema);
  module.exports = product;