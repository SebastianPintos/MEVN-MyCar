var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var DealerSchema = new Schema({
    Name: {type: String, required: true},
    Phone: {type: Number, required: true},
    Email: {type: String, required: true},
    Address: {
        Street: {type: String},
        Number: {type: Number},
        City: {type: String}
    },
    Status: {type: String, enum: ['ACTIVE', 'INACTIVE'], required: true},


});

var dealer = mongoose.model('Dealer', DealerSchema);
module.exports = dealer;
