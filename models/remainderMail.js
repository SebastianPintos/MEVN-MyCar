var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var RemainderSchema = new Schema({
    Title: {type: String, required: true},
    Body: {type: String, required: true},
    Interval: {
        Days: {type: Number, required: true},
        Hours: {type: Number, required: true}
    },
    Status: {type: String, enum: ['ACTIVE', 'INACTIVE'], required: true}
});

var remainder = mongoose.model("Remaider", RemainderSchema);
module.exports = remainder;