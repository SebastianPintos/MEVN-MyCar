const ctrl = {};
var Ingreso = require("../models/ingreso");

ctrl.index = (req, res) => {
    Ingreso.find((err, ingreso) => {
        if (err) {console.log(err)}
        res.send({
            ingreso: ingreso
        });
    }).populate('Employee');
};

ctrl.create = (req, res) => {
    var body = req.body.ingreso;
    console.log(req.body.ingreso); 
    var ingreso = new Ingreso({
        Sueldo: body.Sueldo,
        Employee: body.Employee,
        Date: body.Date,
        Monto: body.Monto,
        BranchOffice: body.BranchOffice,
       });

    ingreso.save((err) => {
        if(err) {console.log(err)}
        res.send({
            success: true
        });
    });
};

ctrl.update = (req, res) => {
    var id = req.params.ingreso_id;
    var body = req.body.ingreso;
    Ingreso.findOne({_id: id}, (err, ingreso) => {
        if(err) {console.log(err)}
        else {
            if(!ingreso) {console.log('No se encontró el empleado')}
            else {
                ingreso.Employee = body.Employee;
                ingreso.Date = body.Date;
                ingreso.Monto = body.Monto;
                ingreso.BranchOffice = body.BranchOffice;
                ingreso.save((err) => {
                    if(err) {console.log(err)}
                    res.send({
                        ingreso
                    })
                });
            }
        }
    });
};

module.exports = ctrl;