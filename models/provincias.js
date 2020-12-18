var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ProvinciasSchema = new Schema({
    Name: {type: String},
    Pais: {type: String},
});
 
var provincias = mongoose.model("Provincias", ProvinciasSchema);
module.exports = provincias;