var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var DeliveryVehicle = new Schema({
        Documentation: [{type: Schema.Types.ObjectId, ref: 'Documentation'}],
        Sell: {type: Schema.Types.ObjectId, ref: 'Sell'},
        VehicleStock: {type: Schema.Types.ObjectId, ref: 'VehicleStock'},
        purchaseOrderV: {type: Schema.Types.ObjectId, ref: 'PurchaseOrderV'},
        Status: {type: String, enum: ['ACTIVE', 'INACTIVE'], required: true},
    });

var deliveryVehicle = mongoose.model("DeliveryVehicle",DeliveryVehicle);
module.exports = deliveryVehicle; 