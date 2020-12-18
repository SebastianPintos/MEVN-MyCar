var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var LocalidadesSchema = new Schema({
    Name: {type: String},
    Provincia: {type: String},
});
 
var localidades = mongoose.model("Localidades", LocalidadesSchema);
module.exports = localidades;