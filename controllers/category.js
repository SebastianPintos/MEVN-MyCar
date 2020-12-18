const ctrl = {};
var Category = require("../models/category");

ctrl.index = (req, res) => {
    Category.find((err, category) => {
        if (err) {console.log(err)}
        res.send({
            category: category
        })
    }).populate("BranchOffice");
};

ctrl.create = (req, res) => {
    var body = req.body.category;
    var category = new Category({
        Name: body.Name,
        Brand: body.Brand,
        Status: "ACTIVE"
       });

    category.save((err) => {
        if(err) {console.log(err)}
        res.send({
            success: true
        })
    });
};

ctrl.update = (req, res) => {
    var id = req.params.category_id;
    var body = req.body.category;
    Category.findOne({_id: id}, (err, category) => {
        if(err) {console.log(err)}
        else {
            if(!category) {console.log(' no se encontro')}
            else {
                category.Name = body.Name;
                category.Status = body.Status;
                category.Brand = body.Brand;

                category.save((err) => {
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
    var id = req.params.category_id;
    Category.findOne({ _id: id }, (err, category) => {
        if (err) { console.log(err) }
        else {

            if (!category) { console.log('No se encontró el producto específico') }
            else {
                category.Status = 'INACTIVE';
                category.save((err) => {
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
