const ctrl = {};
var Sueldos = require("../models/sueldos");

ctrl.index = (req, res) => {
    Sueldos.find((err, sueldos) => {
        if (err) {console.log(err)}
        res.send({
            sueldos: Sueldos
        });
    }).populate('Employee');
};

ctrl.create = (req, res) => {
    var body = req.body.sueldos;
    console.log(req.body.sueldos); 
    var sueldos = new Sueldos({
        Monto: body.Monto,
        Employee: body.Employee,
    });

    sueldos.save((err) => {
        if(err) {console.log(err)}
        res.send({
            sueldos
        });
    });
};

ctrl.update = (req, res) => {
    var id = req.params.sueldos_id;
    var body = req.body.sueldos;
    Sueldos.findOne({_id: id}, (err, sueldos) => {
        if(err) {console.log(err)}
        else {
            if(!sueldos) {console.log('No se encontró el empleado')}
            else {
                sueldos.Employee = body.Employee;
                sueldos.Monto = body.Monto;
                sueldos.save((err) => {
                    if(err) {console.log(err)}
                    res.send({
                        sueldos
                    })
                });
            }
        }
    });
};

module.exports = ctrl;