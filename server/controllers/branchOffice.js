const ctrl = {};
var BranchOffice = require("../models/branchOffice");
/*
Name: {type: String},
  WorkShop: {type: Boolean},
  Phone: {type: String},
  Email: {type: String},
  Address: {
    Street: {type: String},
    Number: {type: Number},
    City: {type: String},
    Province: {type: String}
  },
  Status: {type: String},
  Employee: [{
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Employee'
  }],
  Hours: {//Las horas de apertura y cierre se guardan en minutos desde que empezo el dia. Ejemplo si abre a las 9:00hs y cierra 17:00hs, se guardaria Open: 540, Close: 1020.
    Monday: {Open: {type: Number}, Close: {type: Number}},
    Tuesday: {Open: {type: Number}, Close: {type: Number}},
    Wednesday: {Open: {type: Number}, Close: {type: Number}},
    Thrusday: {Open: {type: Number}, Close: {type: Number}},
    Friday: {Open: {type: Number}, Close: {type: Number}},
    Saturday: {Open: {type: Number},Close: {type: Number}},
    Sunday: {Open: {type: Number},Close: {type: Number}}
  }
*/
ctrl.index = (req, res) => {
    BranchOffice.find((err, branchOffice) => {
        if (err) {console.log(err)}
        res.send({
            branchOffice: branchOffice
        });
    }).populate('Employee');
};

ctrl.create = (req, res) => {
    var body = req.body.branchOffice;
    console.log(req.body.branchOffice); 
    var branchOffice = new BranchOffice({
        Name: body.Name,
        WorkShop: body.WorkShop,
        Email: body.Email,
        Phone: body.Phone,
        Address: body.Address,
        Status: 'ACTIVE',
        Employee: body.Employee,
        Hours: body.Hours,
        Caja: body.Caja,
        ChangeStatus: body.ChangeStatus
    });

    branchOffice.save((err) => {
        if(err) {console.log(err)}
        res.send({
            branchOffice
        });
    });
};

ctrl.update = (req, res) => {
    var id = req.params.branchOffice_id;
    var body = req.body.branchOffice;
    BranchOffice.findOne({_id: id}, (err, branchOffice) => {
        if(err) {console.log(err)}
        else {
            if(!branchOffice) {console.log('No se encontró el empleado')}
            else {
                branchOffice.Caja = body.Caja;
                branchOffice.Name = body.Name;
                branchOffice.WorkShop = body.WorkShop;
                branchOffice.Email = body.Email;
                branchOffice.Phone = body.Phone;
                branchOffice.Address = body.Address;
                branchOffice.Status = 'ACTIVE'
                branchOffice.Employee = body.Employee;
                branchOffice.Hours = body.Hours;
                branchOffice.ChangeStatus = body.ChangeStatus;

                branchOffice.save((err) => {
                    if(err) {console.log(err)}
                    res.send({
                        branchOffice
                    })
                });
            }
        }
    });
};

ctrl.remove = (req, res) => {
    var id = req.params.branchOffice_id;
    BranchOffice.findOne({_id: id}, (err, branchOffice) => {
        if(err) {console.log(err)}
        else {
            if(!branchOffice) {console.log('No se encontró el empleado')}
            else {
                branchOffice.Status = 'INACTIVE';
                branchOffice.save((err) => {
                    if(err) {console.log(err)}
                    res.send({
                        success: true

                    })
                });
            }
        }
    });
};


ctrl.setCaja = (req, res) => {
    var id = req.params.branchOffice_id;
    var caja = req.body.Caja;
   
    BranchOffice.findOne({_id: id}, (err, branchOffice) => {
        if(err) {console.log(err)}
        else {
            if(!branchOffice) {console.log('No se encontró el producto específico')}
            else {
                branchOffice.Caja = caja;

                branchOffice.save((err) => {
                    if(err) {console.log(err)}
                    res.send({
                        success: true
                        
                    })
                });
            }
        }
    });
};

ctrl.changeStatus = (req, res) => {
    var id = req.params.branchOffice_id;
    var change = req.body;
   
    BranchOffice.findOne({_id: id}, (err, branchOffice) => {
        if(err) {console.log(err)}
        else {
            if(!branchOffice) {console.log('No se encontró el producto específico')}
            else {
                branchOffice.ChangeStatus = change;

                branchOffice.save((err) => {
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