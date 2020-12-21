var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BranchOfficeSchema = new Schema({
  Name: {type: String},
  WorkShop: {type: Boolean},
  Phone: {type: String},
  Email: {type: String},
  Address: {
    Country: {type: String},
    Street: {type: String},
    Number: {type: Number},
    City: {type: String},
    Province: {type: String}
  },
  Status: {type: String, enum: ['ACTIVE', 'INACTIVE']},
  Caja: {Estado:{type: String, enum: ['ABIERTA', 'CERRADA']},
        Date:{type: String},
      SaldoInicial:{type:Number}},
  Employee: [{
    type: Schema.Types.ObjectId,
    ref: 'Employee'
  }],
  Hours: {//Las horas de apertura y cierre se guardan en minutos desde que empezo el dia. Ejemplo si abre a las 9:00hs y cierra 17:00hs, se guardaria Open: 540, Close: 1020.
    Monday: {Open: {type: Number}, Close: {type: Number}},
    Tuesday: {Open: {type: Number}, Close: {type: Number}},
    Wednesday: {Open: {type: Number}, Close: {type: Number}},
    Thrusday: {Open: {type: Number}, Close: {type: Number}},
    Friday: {Open: {type: Number}, Close: {type: Number}},
    Saturday: {Open: {type: Number},Close: {type: Number}},
    Sunday: {Open: {type: Number},Close: {type: Number}}
  },
  ChangeStatus: [{Employee: {
    type: Schema.Types.ObjectId,
    ref: 'Employee'
  }, Date: {type: String},
Description: {type: String}},]
});

var branchOffice = mongoose.model("BranchOffice", BranchOfficeSchema);
module.exports = branchOffice; 