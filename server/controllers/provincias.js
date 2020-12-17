const ctrl = {};
var Provincias = require("../models/provincias");

ctrl.index = (req, res) => {
    Provincias.find((err, provincias) => {
        if (err) {console.log(err)}
        res.send({
            provincias: provincias
        })
    });
};

ctrl.create = (req, res) => {
    var body = req.body.provincias;
    var provincias = new Provincias({
        Name: body.Name,
        Pais: body.Pais    
    });

    provincias.save((err) => {
        if(err) {console.log(err)}
        res.send({
            success: true
        })
    });
};

ctrl.update = (req, res) => {
    var id = req.params.provincias_id;
    var body = req.body.provincias;
    Provincias.findOne({_id: id}, (err, provincias) => {
        if(err) {console.log(err)}
        else {
            if(!provincias) {console.log(' no se encontro')}
            else {
                provincias.Name = body.Name;
                provincias.Pais = body.Pais;
                provincias.save((err) => {
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
