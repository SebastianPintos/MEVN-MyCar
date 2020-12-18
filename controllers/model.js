const ctrl = {};
var Model = require("../models/model");

ctrl.index = (req, res) => {
    Model.find((err, model) => {
        if (err) {console.log(err)}
        res.send({
            model: model
        })
    }).populate('Brand');
};

ctrl.create = (req, res) => {
    var body = req.body.model;
    var model = new Model({
        Name: body.Name,
        Brand: body.Brand,
        Status: "ACTIVE",
       });

    model.save((err) => {
        if(err) {console.log(err)}
        res.send({
            success: true
        })
    });
};

ctrl.update = (req, res) => {
    var id = req.params.model_id;
    var body = req.body.model;
    Model.findOne({_id: id}, (err, model) => {
        if(err) {console.log(err)}
        else {
            if(!model) {console.log(' no se encontro')}
            else {
                model.Name = body.Name;
                model.Brand = body.Brand;
                model.Status = body.Status;
                model.save((err) => {
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
    var id = req.params.model_id;
    Model.findOne({ _id: id }, (err, model) => {
        if (err) { console.log(err) }
        else {

            if (!model) { console.log('No se encontró el producto específico') }
            else {
                model.Status = 'INACTIVE';
                model.save((err) => {
                    if (err) { console.log(err) }
                    res.send({
                        success: true
                    })
                });
            }
        }
    });
}

module.exports = ctrl;
