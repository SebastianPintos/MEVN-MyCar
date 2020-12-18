var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ServiceSchema = new Schema({
    Description: {type: String},
    LaborPrice: {type: Number},
    Time: {type: Number},
    Vehicle: {
        type: Schema.Types.ObjectId,
        ref: 'Vehicle'
    },
    Product: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }],
    BranchOffice: [{
        type:Schema.Types.ObjectId,
        ref: 'BranchOffice'
    }],
    Status: {type: String, enum: ['ACTIVE', 'INACTIVE'], required: true},
    Type: {type: String, enum: ['INTERNO', 'EXTERNO'], required: true},
});

var service = mongoose.model('Service', ServiceSchema);
module.exports = service;