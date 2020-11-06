var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var repuestoDetalladoSchema = new Schema ({
    ID: {Number, required = true}, 
    Lote: {Number, required = true},
    PrecioUltimaCompra: {Number, required = true},
    PrecioDeVenta: {Number, required = true},
    Proveedor: {String, required = true},
    TiempoDelivery: {String, required = true},
    RepuestoMaestro: {type:Schema.Types.ObjectID, required = true, ref: "RepuestoMaestro"}
})

var repuesto = mongoose.model("repuestoDetallado", repuestoDetalladoSchema);
module.exports = repuesto;