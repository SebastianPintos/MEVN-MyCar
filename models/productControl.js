var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ProductControlSchema = new Schema({
    Min: {type: Number, required: true},
    Product: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Product'
    },
    Status: {type: String, enum: ['ACTIVE', 'INACTIVE'], required: true},
});
 
var product = mongoose.model("ProductControl", ProductControlSchema);
module.exports = product;