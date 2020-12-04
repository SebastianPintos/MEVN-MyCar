const ctrl = {};
var SubCategory = require("../models/subCategory");

ctrl.index = (req, res) => {
    SubCategory.find((err, subcategory) => {
        if (err) {console.log(err)}
        res.send({
            subcategory: subcategory
        })
    }).populate('Category');
};

ctrl.create = (req, res) => {
    var body = req.body.subcategory;
    var subcategory = new SubCategory({
        Name: body.Name,
        Category: body.Category,
        Status: "ACTIVE",
       });

    subcategory.save((err) => {
        if(err) {console.log(err)}
        res.send({
            success: true
        })
    });
};

ctrl.update = (req, res) => {
    var id = req.params.subcategory_id;
    var body = req.body.subcategory;
    SubCategory.findOne({_id: id}, (err, subcategory) => {
        if(err) {console.log(err)}
        else {
            if(!subcategory) {console.log(' no se encontro')}
            else {
                subcategory.Name = body.Name;
                subcategory.Category = body.Category;
                subcategory.Status = body.Status;
                subcategory.save((err) => {
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
    var id = req.params.subcategory_id;
    SubCategory.findOne({ _id: id }, (err, subcategory) => {
        if (err) { console.log(err) }
        else {

            if (!subcategory) { console.log('No se encontró el producto específico') }
            else {
                subcategory.Status = 'INACTIVE';
                subcategory.save((err) => {
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
