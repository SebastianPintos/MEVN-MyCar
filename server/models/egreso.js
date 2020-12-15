var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var EgresoSchema = new Schema({
        Employee: {
          type: Schema.Types.ObjectId,
          ref: 'Employee'
        },
        Sueldo: {
            type: Schema.Types.ObjectId,
            ref: 'Sueldo'
        },
        BranchOffice: {
          type: Schema.Types.ObjectId,
          ref: 'BranchOffice'
        },
        Type: {type: String, enum: ['GASTOS GENERALES', 'MOVILIDAD','SUELDO'], required: true},
        Description: {type: String},
        Monto: {type: Number},
        Date: {type: Date}

 });

var egreso = mongoose.model("Egreso",EgresoSchema);
module.exports = egreso; 