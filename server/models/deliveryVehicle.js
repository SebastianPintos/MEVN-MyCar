var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var DeliveryVehicle = new Schema({
        Documentation: [
            {
                DocumentationID: {type: Schema.Types.ObjectId, ref: 'Documentation'},
                Completed:{type: Boolean}
            }
        ],
        VehicleStock: {type: Schema.Types.ObjectId, ref: 'VehicleStock'},
        PurchaseOrderV: {type: Schema.Types.ObjectId, ref: 'PurchaseOrderV'},
        Status: {type: String, enum: ['ACTIVE', 'INACTIVE'], required: true},
    });

var deliveryVehicle = mongoose.model("DeliveryVehicle",DeliveryVehicle);
module.exports = deliveryVehicle; 