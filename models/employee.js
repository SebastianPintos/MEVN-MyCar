var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EmployeeSchema = new Schema({
    User: {type: String,required: true},
    Password: {type: String,required: true},
    Name: {type: String,required: true},
    LastName: {type: String,required: true},
    DNI: {type: String,required: true},
    Email: {type: String,required: true},
    Hierarchy: {type: String,required: true},
    StartDate: {type: Date,required: true},
    DischargeDate: {type: Date,required: false},
    Address: {
        Country: {type: String},
        Province: {type: String},
        Street: {type: String},
        Number: {type: Number},
        City: {type: String}
    },
  BranchOffice: {type: Schema.Types.ObjectId, ref: 'BranchOffice'},
  Status: {type: String, enum: ['ACTIVE', 'INACTIVE'], required: true},
});

var employee = mongoose.model('Employee', EmployeeSchema);
module.exports = employee;