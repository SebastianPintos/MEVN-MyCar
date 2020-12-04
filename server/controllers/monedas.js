const ctrl = {};
var Monedas = require("../models/Monedas");

ctrl.index = (req, res) => {
    Monedas.find((err, monedas) => {
        if (err) {console.log(err)}
        res.send({
            monedas: monedas
        })
    })
};

ctrl.create = (req, res) => {
    var body = req.body.monedas;
    var monedas = new Monedas({
        Name: body.Name,
        Value: body.Value,
        Status: "ACTIVE",
       });

    monedas.save((err) => {
        if(err) {console.log(err)}
        res.send({
            success: true
        })
    });
};

ctrl.update = (req, res) => {
    var id = req.params.monedas_id;
    var body = req.body.monedas;
    Monedas.findOne({_id: id}, (err, monedas) => {
        if(err) {console.log(err)}
        else {
            if(!monedas) {console.log(' no se encontro')}
            else {
                monedas.Name = body.Name;
                monedas.Value = body.Value;
                monedas.Status = body.Status;
                monedas.save((err) => {
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
    var id = req.params.monedas_id;
    Monedas.findOne({ _id: id }, (err, monedas) => {
        if (err) { console.log(err) }
        else {

            if (!monedas) { console.log('No se encontró el producto específico') }
            else {
                monedas.Status = 'INACTIVE';
                monedas.save((err) => {
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
