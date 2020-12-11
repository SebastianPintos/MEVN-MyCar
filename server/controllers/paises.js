const ctrl = {};
var Paises = require("../models/paises");

ctrl.index = (req, res) => {
    Paises.find((err, paises) => {
        if (err) {console.log(err)}
        res.send({
            paises: paises
        })
    });
};

ctrl.create = (req, res) => {
    var body = req.body.paises;
    var paises = new Paises({
        Name: body.Name,
        CodePhone: body.CodePhone,
        Population: body.Population,
       });

    paises.save((err) => {
        if(err) {console.log(err)}
        res.send({
            success: true
        })
    });
};

ctrl.update = (req, res) => {
    var id = req.params.paises_id;
    var body = req.body.paises;
    Paises.findOne({_id: id}, (err, paises) => {
        if(err) {console.log(err)}
        else {
            if(!paises) {console.log(' no se encontro')}
            else {
                paises.Name = body.Name;
                paises.Population = body.Population;
                paises.CodePhone = body.CodePhone;
                paises.save((err) => {
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
