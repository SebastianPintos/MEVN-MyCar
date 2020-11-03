var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CarSchema = new Schema({
    brand: String,
    model: String,
    type: String,
    year: String,
    category: String,
    origin: String,
    transmission: String,
    fuel: String,
    detail: String
  });
  
  var car = mongoose.model("Car", CarSchema);
  module.exports = car;