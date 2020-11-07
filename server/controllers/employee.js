const ctrl = {};
var employee = require("../models/employee");

ctrl.index = (req, res) => {
    employee.find((err, employee) => {
        if (err) {console.log(err)}
        res.send({
            employee: employee
        });
    });
};

ctrl.create = (req, res) => {
    var body = req.body.employee;
    console.log(req.body.employee); 
    var employee = new employee({
        User: body.User,
        Password: body.Password,
        Name: body.Name,
        Lastname: body.Lastname,
        DNI: body.DNI,
        Email: body.Email,
        State: 'Active',
        hierarchy: body.hierarchy,
        StartDate: body.StartDate,
        DischargeDate: body.DischargeDate,
        Address: body.Address //DATO COMPUESTO; REVISAR SI NO CAUSA PROBLEMAS
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
    employee.findOne({_id: id}, (err, employee) => {
        if(err) {console.log(err)}
        else {
            if(!employee) {console.log('No se encontró el empleado')}
            else {
                employee.User = body.User;
                employee.Password = body.Password;
                employee.Name = body.Name;
                employee.Lastname = body.Lastname;
                employee.DNI = body.DNI;
                employee.Email = body.Email;
                employee.State = 'Active'
                employee.hierarchy = body.hierarchy;
                employee.StartDate = body.StartDate;
                employee.DischargeDate = body.DischargeDate;
                employee.Address = body.Address; 

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
    employee.findOne({_id: id}, (err, employee) => {
        if(err) {console.log(err)}
        else {
            if(!employee) {console.log('No se encontró el empleado')}
            else {
                const today = new Date();
                var year = today.getFullYear();
                var month = today.getMonth();
                var day = today.getDay();
                var fullDate = year + "/" + month + "/" + day;
                employee.Status = 'Baja';
                employee.DischargeDate = fullDate; //ES UN STRING; REVISAR SI ES COMPATIBLE CON DATE DE MONGODB
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
