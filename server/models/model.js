var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ModelSchema = new Schema({
        Name: {type: String, required: true},
        Brand: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Brand'
        },
        Status: {type: String, enum: ['ACTIVE', 'INACTIVE'], required: true},
});

var model = mongoose.model("Model", ModelSchema);
module.exports = model; 