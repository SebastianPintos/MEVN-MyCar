var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ClientSchema = new Schema({
        Name: {type: String, required: true},
        LastName: {type: String, required: true},
        Phone: {type: String, required: true},
        Email: {type: String, required: true, unique: true},
        Vehicle: [{
            VehicleID : {type: Schema.Types.ObjectId, ref: 'Vehicle'},
            Domain: {type: String}            
        }],
        Status: {type: String, enum: ['ACTIVE', 'INACTIVE'], required: true},
        DNI: {type: String, required: true, unique: true},
        CUIT: {type: String},
        CompanyName: {type: String},
        Nationality: {type: String},
        TaxCategory: {type: String},
        ChangeStatus: [{
            Motive: {type: String},
            EmployerID: {type: Schema.Types.ObjectId, required: true},
            Time: {type: Date}
        }]
  });

var client = mongoose.model("Client", ClientSchema);
module.exports = client; 