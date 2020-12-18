const ctrl = {};
var Egreso = require("../models/egreso");

ctrl.index = (req, res) => {
    Egreso.find((err, egreso) => {
        if (err) {console.log(err)}
        res.send({
            egreso: egreso
        });
    }).populate('Employee').populate('Sueldo');
};

ctrl.create = (req, res) => {
    var body = req.body.egreso;
    console.log(req.body.egreso); 
    var egreso = new Egreso({
        Description: body.Description,
        Sueldo: body.Sueldo,
        Employee: body.Employee,
        Type: body.Type,
        Date: body.Date,
        Monto: body.Monto,
        BranchOffice: body.BranchOffice,
        Status: body.Status
    });

    egreso.save((err) => {
        if(err) {console.log(err)}
        res.send({
            success: true
        });
    });
};

ctrl.update = (req, res) => {
    var id = req.params.egreso_id;
    var body = req.body.egreso;
    Egreso.findOne({_id: id}, (err, egreso) => {
        if(err) {console.log(err)}
        else {
            if(!egreso) {console.log('No se encontró el empleado')}
            else {
                egreso.Employee = body.Employee;
                egreso.Type = body.Type;
                egreso.Date = body.Date;
                egreso.Description = body.Description;
                egreso.Sueldo = body.Sueldo;
                egreso.Monto = body.Monto;
                egreso.BranchOffice = body.BranchOffice;
                egreso.Status = body.Status
                egreso.save((err) => {
                    if(err) {console.log(err)}
                    res.send({
                        egreso
                    })
                });
            }
        }
    });
};


ctrl.remove = (req, res) => {
    var id = req.params.egreso_id;
    Egreso.findOne({_id: id}, (err, egreso) => {
        if(err) {console.log(err)}
        else {
            if(!egreso) {console.log('No se encontró el producto específico')}
            else {
                egreso.Status = 'INACTIVE';

                egreso.save((err) => {
                    if(err) {console.log(err)}
                    res.send({
                        success: true
                        
                    })
                });
            }
        }
    });
};


module.exports = ctrl;