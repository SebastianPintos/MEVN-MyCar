var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var SueldoSchema = new Schema({
        Employee: [{
          type: Schema.Types.ObjectId,
          ref: 'Employee'
        }],
        Monto: {type: Number},
 });

var sueldo = mongoose.model("Sueldo",SueldoSchema);
module.exports = sueldo; 