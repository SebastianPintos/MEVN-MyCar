var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var VehicleStockSchema = new Schema({
    ChasisNum: {type: String,required: true},
    EngineNum: {type: String,required: true},
    Domain: {type: String,required: true},
    Color: { type: String,required: true},
    PurchasedPrice: {type: Number,required: true},
    Detail: {type: String},
    Vehicle: {type: Schema.Types.ObjectId,required: true,ref: 'Vehicle'},
    UsedDetail: [{Detail: {type: String},PriceModifier: {type: String}}],
    State: {type: String,required: true}
});

var vehicleStock = mongoose.model("VehicleStock", VehicleStockSchema);
module.exports = vehicleStock;