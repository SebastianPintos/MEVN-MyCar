const ctrl = {};
var Documentation = require("../models/documentation");

ctrl.index = (req, res) => {
    Documentation.find((err, documentation) => {
        if (err) {console.log(err)}
        res.send({
            documentation: documentation
        });
    }).populate('BranchOffice');
};

ctrl.create = (req, res) => {
    var body = req.body.documentation;
    console.log(req.body.documentation); 
    var documentation = new Documentation({
       Name: body.Name,
       EstimatedTime: body.EstimatedTime,
       Origin: body.Origin,
       Status: body.Status,
       BranchOffice: body.BranchOffice
    });

    documentation.save((err) => {
        if(err) {console.log(err)}
        res.send({
            success: true
        });
    });
};

ctrl.update = (req, res) => {
    var id = req.params.documentation_id;
    var body = req.body.documentation;
    Documentation.findOne({_id: id}, (err, documentation) => {
        if(err) {console.log(err)}
        else {
            if(!documentation) {console.log('No se encontró el empleado')}
            else {
                documentation.Name = body.Name;
                documentation.EstimatedTime = body.EstimatedTime;
                documentation.Origin = body.Origin;
                documentation.Status = body.Status;
                documentation.BranchOffice = body.BranchOffice
                
                documentation.save((err) => {
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
    var id = req.params.documentation_id;
    Documentation.findOne({_id: id}, (err, documentation) => {
        if(err) {console.log(err)}
        else {
            if(!documentation) {console.log('No se encontró el empleado')}
            else {
                documentation.Status = 'INACTIVE';
                documentation.save((err) => {
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