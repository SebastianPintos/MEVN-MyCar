var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var IngresoSchema = new Schema({
        Employee: {
          type: Schema.Types.ObjectId,
          ref: 'Employee'
        },
        BranchOffice: {
          type: Schema.Types.ObjectId,
          ref: 'BranchOffice'
        },
        Monto: {type: Number},
        Date: {type: Date}

 });

var ingreso = mongoose.model("Ingreso",IngresoSchema);
module.exports = ingreso; 