const ctrl = {};
var Employee = require("../models/employee");
var encrypt = require('../lib/helperEncrypt');

ctrl.index = (req, res) => {
    Employee.find((err, employee) => {
        if (err) {console.log(err)}
        res.send({
            employee: employee
        });
    }).populate('BranchOffice');
};

ctrl.create = (req, res) => {
    var body = req.body.employee;
    console.log(req.body.employee); 
    var employee = new Employee({
        User: body.User,
        Password: encrypt.encryptPassword(body.Password),
        Name: body.Name,
        LastName: body.LastName,
        DNI: body.DNI,
        Email: body.Email,
        Status: 'ACTIVE',
        Hierarchy: body.Hierarchy,
        StartDate: body.StartDate,
        DischargeDate: body.DischargeDate,
        Address: body.Address,
        BranchOffice: ""
    });

    employee.save((err) => {
        if(err) {console.log(err)}
        res.send({
            success: true
        });
    });
};

ctrl.update = (req, res) => {
    var id = req.params.employee_id;
    var body = req.body.employee;
    Employee.findOne({_id: id}, (err, employee) => {
        if(err) {console.log(err)}
        else {
            if(!employee) {console.log('No se encontró el empleado')}
            else {
                employee.User = body.User;
                employee.Name = body.Name;
                employee.LastName = body.LastName;
                employee.DNI = body.DNI;
                employee.Email = body.Email;
                employee.Status = 'ACTIVE'
                employee.Hierarchy = body.Hierarchy;
                employee.StartDate = body.StartDate;
                employee.DischargeDate = body.DischargeDate;
                employee.Address = body.Address;
                employee.BranchOffice = body.BranchOffice; 

                employee.save((err) => {
                    if(err) {console.log(err)}
                    res.send({
                        success: true
                    })
                });
            }
        }
    });
};

ctrl.remove = (req, res) => {
    var id = req.params.employee_id;
    Employee.findOne({_id: id}, (err, employee) => {
        if(err) {console.log(err)}
        else {
            if(!employee) {console.log('No se encontró el empleado')}
            else {
                employee.Status = 'INACTIVE';
                employee.DischargeDate = new Date(); 
                employee.save((err) => {
                    if(err) {console.log(err)}
                    res.send({
                        success: true

                    })
                });
            }
        }
    });
};

ctrl.asignarSucursal = (req, res) => {
    var id = req.params.employee_id;
    var sucursal = req.body.sucursal;
    Employee.findOne({_id: id}, (err, employee) => {
        if(err) {console.log(err)}
        else {
            if(!employee) {console.log('No se encontró el empleado')}
            else {
                employee.BranchOffice = sucursal; 
                employee.save((err) => {
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