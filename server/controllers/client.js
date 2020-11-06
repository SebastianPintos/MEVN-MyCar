const ctrl = {};

var Client = require("../models/client");

ctrl.index = (req, res) => {
    Client.find((err, client) => {
        if (err) {console.log(err)}
        res.send({
            client: client
        })
    })
};

ctrl.create = (req, res) => {
    var client = new Client({
        Name: 'Carlos',
        LastName: 'Fernandez',
        Phone: '1135353535',
        Email: 'Cfernandez@gmail.com',
        State: 'Active',
        DNI: '32456789',
    });

    client.save((err) => {
        if(err) {console.log(err)}
        res.send({
            success: true
        })
    });
};

ctrl.remove = (req, res) => {
    res.send('Client delete');
};

module.exports = ctrl;
