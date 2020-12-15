var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var EgresoSchema = new Schema({
        Employee: {
          type: Schema.Types.ObjectId,
          ref: 'Employee'
        },
        Sueldo: {
          Employee: {
            type: Schema.Types.ObjectId,
            ref: 'Employee'
          },
          Monto: {type: Number},
        },
        BranchOffice: {
          type: Schema.Types.ObjectId,
          ref: 'BranchOffice'
        },
        Type: {type: String, enum: ['VARIOS', 'MOVILIDAD','SUELDO'], required: true},
        Status: {type: String, enum: ['ACTIVE', 'INACTIVE'], required: true},
        Description: {type: String},
        Monto: {type: Number},
        Date: {type: Date}

 });

var egreso = mongoose.model("Egreso",EgresoSchema);
module.exports = egreso; 