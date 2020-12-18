var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var BrandSchema = new Schema({
        Name: {type: String, required: true},
        Kind: {type: String, enum: ['VEHICLE', 'PRODUCT'], required: true},
        Status: {type: String, enum: ['ACTIVE', 'INACTIVE'], required: true},
  });

var brand = mongoose.model("Brand", BrandSchema);
module.exports = brand; 