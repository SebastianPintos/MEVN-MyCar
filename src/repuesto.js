//Funciones para hacer las query correspondientes a la BDD

var express = require ('express');
var bodyParser = require("body-parser");
var app = express();
var mongoose = require ("mongoose");
mongoose.connect("mongodb://localhost/MEVN-MyCar");


//REPUESTO MAESTRO
var repuestoMaestroSchemaJSON = {
    ID: Number,
    Codigo: Number,
    Categoria: String,
    Subcategoria: String,
    Nombre: String,
    Marca: String,
    Detalle: String

}
//REPUESTO DETALLADO
var repuestoDetalladoSchemaJSON = {
    ID: Number,
    Lote: Number,
    PrecioUltimaCompra: Number,
    PrecioDeVenta: Number,
    Proveedor: String,
    TiempoDelivery: String,
    RepuestoMaestro: ObjectID, //VER COMO SE MODELA EN JS
    RepuestoMaestro: String,
    
}

var repuesto_Schema = new Schema(repuestoMaestroSchemaJSON);

var Repuesto = mongoose.model("Repuesto",repuesto_Schema);

app.use("/public",express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended=true}));

app.set("view engine","jade");

app.get("/",function(req,res){
    res.render("index");
});

app.get("/crear repuesto maestro",function(req,res){
    res.render("crear repuesto maestro");
});

app.post("/repuestos maestros",function(req,res){
    var repuestoMaestro = new repuestoMaestro({ID: req.body.ID, Codigo: req.body.Codigo,
         Categoria: req.body.Categoria, Subcategoria: req.body.Subcategoria,
        Nombre: req.body.Nombre, Marca: req.body.Marca, Detalle: req.body.Detalle });
    repuestoMaestro.save(function(){
        res.send("Se guardó la información del repuesto");
    });
});

app.listen(8080);