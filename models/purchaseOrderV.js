var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PurchaseOrderVSchema = new Schema({
<<<<<<< HEAD
  Code: {type: String},
=======
>>>>>>> 47f02b7f15a63ff96d6cd7da8da8e33336841998
  OrderDate: {type: Date},
  ArrivalDate: {type: Date},
  Price: {type: Number, required: true},
  Vehicle: [{
    ChasisNum: {type: String, required: true},
    EngineNum: {type: String, required: true},
    Color: {type: String, required: true}, 
    VehicleID : {type: Schema.Types.ObjectId, required: true, ref: 'Vehicle'},
    Price: {type: Number, required: true},
  }],
  Dealer : {type: Schema.Types.ObjectId, required: true, ref: 'Dealer'},  
  BranchOffice: {type: Schema.Types.ObjectId,ref: 'BranchOffice'},
  Status: {type: String, enum: ['ACTIVE', 'INACTIVE'], required: true},
<<<<<<< HEAD
  Type: {type: String, enum: ['ENVIADA', 'RECIBIDA'], required: true},
  Info: {type: String},
  Venta: {type: Boolean},
  Employee: {type: Schema.Types.ObjectId, ref: 'Employee'}
=======
>>>>>>> 47f02b7f15a63ff96d6cd7da8da8e33336841998
});

var PurchaseOrderV = mongoose.model("PurchaseOrderV", PurchaseOrderVSchema);
module.exports = PurchaseOrderV;