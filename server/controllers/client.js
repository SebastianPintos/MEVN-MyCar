const ctrl = {};

var Client = require("../models/client");

ctrl.index = (req, res) => {
    Client.find((err, client) => {
        if (err) {console.log(err)}
        res.send({
            client: client
        })
    }).populate('Vehicle.VehicleID');
};

ctrl.create = (req, res) => {
    var body = req.body.client;
    console.log(req.body.client); 
    var client = new Client({
        Name: body.Name,
        LastName: body.LastName,
        Phone: body.Phone,
        Email: body.Email,
        Status: 'ACTIVE',
        DNI: body.DNI,
        CUIT: body.CUIT,
        CompanyName: body.CompanyName,
        Nationality: body.Nationality,
        TaxCategory: body.TaxCategory,
        Vehicle: body.Vehicle,
        ChangeStatus: body.ChangeStatus
    });

    client.save((err) => {
        if(err) {console.log(err)}
        res.send({
            success: true
        })
    });
};

ctrl.update = (req, res) => {
    var id = req.params.client_id;
    var body = req.body.client;
    Client.findOne({_id: id}, (err, client) => {
        if(err) {console.log(err)}
        else {
            if(!client) {console.log(' no se encontro')}
            else {
                client.Name = body.Name;
                client.LastName = body.LastName;
                client.Phone = body.Phone;
                client.Email = body.Email;
                client.Status = body.Status;
                client.DNI = body.DNI;
                client.CUIT = body.CUIT;
                client.CompanyName = body.CompanyName;
                client.Nationality = body.Nationality;
                client.TaxCategory = body.TaxCategory;
                client.Vehicle = body.Vehicle;
                client.ChangeStatus = body.ChangeStatus

                client.save((err) => {
                    if(err) {console.log(err)}
                    res.send({
                        success: true
                    })
                });
            }
        }
    })
};

ctrl.remove = (req, res) => {
    var id = req.params.client_id;
    Client.findOne({_id: id}, (err, client) => {
        if(err) {console.log(err)}
        else {
            if(!client) {console.log(' no se encontro')}
            else {
                client.Status = 'INACTIVE';

                client.save((err) => {
                    if(err) {console.log(err)}
                    res.send({
                        success: true
                    })
                });
            }
        }
    })
};

ctrl.addVehicle = (req, res) => {
    var id = req.params.client_id;
    var body = req.body.vehicle;
    console.log(body);
    Client.findOne({_id: id}, (err, client) => {
        if(err) {console.log(err)}
        else {
            if(!client) {console.log(' no se encontro')}
            else {
                client.Vehicle.push(body);

                client.save((err) => {
                    if(err) {console.log(err)}
                    res.send({
                        success: true
                    })
                });
            }
        }
    })
}

module.exports = ctrl;
