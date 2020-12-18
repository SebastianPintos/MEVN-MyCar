const ctrl = {};
var Factura = require("../models/Factura");

ctrl.index = (req, res) => {
    Factura.find((err, factura) => {
        if (err) {console.log(err)}
        res.send({
            factura: factura
        })
    }).populate('Client').populate('BranchOffice');
};

ctrl.create = (req, res) => {
    var body = req.body.factura;
    
    var factura = new Factura({
        Client: body.Client,
        Kind: body.Kind,
        Status: body.Status,
        Elements: body.Elements,
        BranchOffice: body.BranchOffice,
        PrecioNeto: body.PrecioNeto,
        Impuesto: body.Impuesto
       });

    factura.save((err) => {
        if(err) {console.log(err)}
        res.send({
            factura
        })
    });
};

ctrl.update = (req, res) => {
    var id = req.params.factura_id;
    var body = req.body.factura;
    Factura.findOne({_id: id}, (err, factura) => {
        if(err) {console.log(err)}
        else {
            if(!factura) {console.log(' no se encontro')}
            else {
                
            factura.Client= body.Client;    
            factura.Kind= body.Kind;
            factura.Status= body.Status;
            factura.Elements= body.Elements;
            factura.BranchOffice= body.BranchOffice;
            factura.PrecioNeto= body.PrecioNeto;
            factura.Impuesto= body.Impuesto
                factura.save((err) => {
                    if(err) {console.log(err)}
                    res.send({
                        success: true
                    })
                });
            }
        }
    })
};

ctrl.remove = (req, res) => {
    var id = req.params.factura_id;
    Factura.findOne({ _id: id }, (err, factura) => {
        if (err) { console.log(err) }
        else {

            if (!factura) { console.log('No se encontró el producto específico') }
            else {
                factura.Status = 'INACTIVE';
                factura.save((err) => {
                    if (err) { console.log(err) }
                    res.send({
                        success: true
                    })
                });
            }
        }
    });
}

module.exports = ctrl;
