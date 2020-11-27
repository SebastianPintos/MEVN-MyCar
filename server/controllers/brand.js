const ctrl = {};
var Brand = require("../models/brand");

ctrl.index = (req, res) => {
    Brand.find((err, brand) => {
        if (err) {console.log(err)}
        res.send({
            brand: brand
        })
    }).populate('Brand');
};

ctrl.create = (req, res) => {
    var body = req.body.brand;
    var brand = new Brand({
        Name: body.Name,
        Kind: body.Kind,
        Status: "ACTIVE"
       });

    brand.save((err) => {
        if(err) {console.log(err)}
        res.send({
            success: true
        })
    });
};

ctrl.update = (req, res) => {
    var id = req.params.brand_id;
    var body = req.body.brand;
    Brand.findOne({_id: id}, (err, brand) => {
        if(err) {console.log(err)}
        else {
            if(!brand) {console.log(' no se encontro')}
            else {
                brand.Name = body.Name;
                brand.Kind = body.Kind;
                brand.Status = body.Status;
                brand.save((err) => {
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
    var id = req.params.brand_id;
    Brand.findOne({ _id: id }, (err, brand) => {
        if (err) { console.log(err) }
        else {

            if (!brand) { console.log('No se encontró el producto específico') }
            else {
                brand.Status = 'INACTIVE';
                brand.save((err) => {
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
