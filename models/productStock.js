var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductStockSchema = new Schema({
  BatchNum: {type: String},
  Reserved: {type: Number},
  Available: {type: Number},
  OutOfService: {type: Number},
  Expiration: {type: Date},
<<<<<<< HEAD
  Price: {type: Number},
  Product: {type: Schema.Types.ObjectId,required: true,ref: 'Product'},
  BranchOffice: {type: Schema.Types.ObjectId,ref: 'BranchOffice'},
=======
  Price: {type: Number, required: true},
  Product: {type: Schema.Types.ObjectId,required: true,ref: 'Product'},
  BranchOffice: {type: Schema.Types.ObjectId,required: true,ref: 'BranchOffice'},
>>>>>>> 47f02b7f15a63ff96d6cd7da8da8e33336841998
  Status: {type: String, enum: ['ACTIVE', 'INACTIVE'], required: true},
});

var ProductStock = mongoose.model("ProductStock", ProductStockSchema);
module.exports = ProductStock;

  