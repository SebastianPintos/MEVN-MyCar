var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var DetailCarSchema = new Schema({
    chasis: String,
    engine: String,
    buyprice: String,
    sellerprice: String,
    state: String,
    detail: String,
    car:{type: mongoose.Schema.Types.ObjectId, ref: Car}
  });
  
  var detailCar = mongoose.model("DetailCar", DetailCarSchema);
  module.exports = detailCar;