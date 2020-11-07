var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var VehicleSchema = new Schema({
    Brand: {type: String, required: true},
    Model: {type: String, required: true},
    Type: {type: String, required: true},
    Category: {type: String, required: true},
    Fuel: {type: String, required: true},
    transmission: {type: String, required: true},
    origin: {type: String, required: true},
    year: {type: String, required: true},
    SuggestedPrice: {type: Number, required: true},
    Detail: {type: String},
    Status: {type:String, required: true}
});
  
var vehicle = mongoose.model("Vehicle", VehicleSchema);
module.exports = vehicle;