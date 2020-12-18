var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Factura = new Schema({
  Client: {type: Schema.Types.ObjectId, ref: 'Client'},
  Kind: {type: String, enum: ['A', 'B','E'], required: true},
  Status: {type: String, enum: ['PAGADA', 'NO PAGADA','INACTIVE'], required: true},
  Elements: [
      {
            Name:{type: String},
            PrecioNeto: {type: Number},
            Impuesto:{type: Number},
            Descuento: {type: Number},
            PrecioConDescuento: {type: Number}
    }],
  BranchOffice: {type: Schema.Types.ObjectId,ref: 'BranchOffice'},
  PrecioNeto:{type: Number},
  Impuesto: {type: Number}
});

var factura = mongoose.model("Factura", Factura);
module.exports = factura; 