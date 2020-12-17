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
        Employee: {type: Schema.Types.ObjectId, ref: 'Employee'},
        Status: {type: String, enum: ['ACTIVE', 'INACTIVE'], required: true},
        Date: {type:Date},
    });

var deliveryVehicle = mongoose.model("DeliveryVehicle",DeliveryVehicle);
module.exports = deliveryVehicle; 