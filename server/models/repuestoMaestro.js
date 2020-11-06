var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var repuestoMaestroSchema = new Schema({
    ID: {Number, required = true},
    Codigo: {Number, required = true},
    Categoria: {String, required = true},
    Subcategoria: {String, required = true},
    Nombre: {String, required = true},
    Marca: {String, required = true},
    Detalle: {String, required = true} 
})

var repuesto = mongoose.model("repuestoMaestro", repuestoMaestroSchema);
module.exports = repuesto;
