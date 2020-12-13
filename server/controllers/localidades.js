const ctrl = {};
var Localidades = require("../models/localidades");

ctrl.index = (req, res) => {
    Localidades.find((err, localidades) => {
        if (err) {console.log(err)}
        res.send({
            localidades: localidades
        })
    });
};

ctrl.create = (req, res) => {
    var body = req.body.localidades;
    var localidades = new Localidades({
        Name: body.Name,
        Provincia: body.Provincia,
       });

    localidades.save((err) => {
        if(err) {console.log(err)}
        res.send({
            success: true
        })
    });
};

ctrl.update = (req, res) => {
    var id = req.params.localidades_id;
    var body = req.body.localidades;
    Localidades.findOne({_id: id}, (err, localidades) => {
        if(err) {console.log(err)}
        else {
            if(!localidades) {console.log(' no se encontro')}
            else {
                localidades.Name = body.Name;
                localidades.Provincia = body.Provincia;
                localidades.save((err) => {
                    if(err) {console.log(err)}
                    res.send({
                        success: true
                    })
                });
            }
        }
    })
};
module.exports = ctrl;