var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Monedas = new Schema({
        Name: {type: String, required: true},
        Value: {type: Number, required: true},
        Status: {type: String, enum: ['ACTIVE', 'INACTIVE'], required: true},
});

var monedas = mongoose.model("Monedas", Monedas);
module.exports = monedas; 