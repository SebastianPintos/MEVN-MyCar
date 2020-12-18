var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ProductSchema = new Schema({
    Description: {type: String},
    Category: {type: String, required: true},
    SubCategory: {type: String},
    Brand: {type: String, required: true},
    SKU: {type: String, required: true},
    LastPurchasePrice: {type: Number, required: true},
    SalePrice: {type: Number, required: true},
    ShippingBranch: {type: Number, required: true},
    ShippingDealer: {type: Number, required: true},
    Dealer: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Dealer'
    },
    Status: {type: String, enum: ['ACTIVE', 'INACTIVE'], required: true},
});
 
var product = mongoose.model("Product", ProductSchema);
module.exports = product;