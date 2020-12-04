var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var VehicleControlSchema = new Schema({
    Min: {type: Number, required: true},
    Vehicle: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Vehicle'
    },
    Status: {type: String, enum: ['ACTIVE', 'INACTIVE'], required: true},
});
 
var Vehicle = mongoose.model("VehicleControl", VehicleControlSchema);
module.exports = Vehicle;