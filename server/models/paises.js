var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var PaisesSchema = new Schema({
    Name: {type: String},
    CodePhone: {type: String},
    Population: {type: String},    
});
 
var paises = mongoose.model("Paises", paisesSchema);
module.exports = paises;
