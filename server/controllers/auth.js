const Employee = require('../models/employee');
const encrypt = require('../lib/helperEncrypt');
const jwt = require('jsonwebtoken');
ctrl = {};

// /signup
ctrl.signup = async (req, res) => {
    var body = req.body.employee;
    console.log(req.body.employee); 
    var encryptPass = await encrypt.encryptPassword(body.Password);
    var employee = new Employee({
        User: body.User,
        Password: encryptPass,
        Name: body.Name,
        LastName: body.LastName,
        DNI: body.DNI,
        Email: body.Email,
        Status: 'ACTIVE',
        Hierarchy: body.Hierarchy,
        StartDate: body.StartDate,
        DischargeDate: body.DischargeDate,
        Address: body.Address,
    });

    employee.save((err) => {
        if(err) {console.log(err)}
        res.send({
            success: true
        });
    });
}

// /login
ctrl.login = async (req, res) => {
    var user = req.body.user;
    var password = req.body.password;
    console.log(password);

    Employee.findOne({User: user}, async (err, employee) => {
        if(err) {console.log(err)}
        else{
            //no existe usuario
            if(!employee) {
                res.status(401).json({title: 'No se encontro el usuario'})
            }
            else{
                //password incorrectas
                if(!await encrypt.matchPassword(password, employee.Password)){
                    res.status(401).json({title: 'Contraseña incorrecta'})
                }
                else{
                    var token = jwt.sign({id: employee._id}, 'thetruekeyisfrindship');
                    res.status(200).json({token: token});
                }
            }
        }
    })
}

ctrl.changePassword = async (req, res) => {
    var user = req.body.user;
    var newPassword = req.body.password;
    var token = req.headers.token;
    console.log(token);

    jwt.verify(token, 'thetruekeyisfrindship', (err, decoded) => {
        if(err){
            console.log(err)
            res.status(400).json({title: 'error al validar token'})
        }
        else{
            //token es valido
            Employee.findOne({_id: decoded.id}, async (err, employee) => {
                if(err) {console.log(err)}
                else{
                    //no existe usuario
                    if(!employee) {
                        res.status(401).json({title: 'No se encontro el usuario'})
                    }
                    else{
                        //cambio la contraseña
                        var encryptPass = await encrypt.encryptPassword(newPassword);
                        employee.Password = encryptPass;

                        employee.save((err) => {
                            if(err) {console.log(err)}
                            else{
                                res.status(200).json({title: 'Contraseña cambiada correctamente'});
                            }
                        });

                    }
                }
            })
        }
    })
}

module.exports = ctrl;