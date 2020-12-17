var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var VehicleOrderSchema = new Schema({
    Vehicle: {type: Schema.Types.ObjectId, ref: 'Vehicle'},
    Sell: {type: Schema.Types.ObjectId, ref: 'Sell'},
    Status: {type: String, enum: ['ORDER', 'DELIVERED', 'ON THE WAY']}
},{timestamps: true})

var vehicleOrder = mongoose.model('VehicleOrder', VehicleOrderSchema);
module.exports = vehicleOrder;