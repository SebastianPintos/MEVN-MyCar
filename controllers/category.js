const ctrl = {};
var Category = require("../models/category");

ctrl.index = (req, res) => {
    Category.find((err, category) => {
        if (err) {console.log(err)}
        res.send({
            category: category
        })
<<<<<<< HEAD
    }).populate("BranchOffice");
=======
    }).populate('Category');
>>>>>>> 47f02b7f15a63ff96d6cd7da8da8e33336841998
};

ctrl.create = (req, res) => {
    var body = req.body.category;
    var category = new Category({
        Name: body.Name,
<<<<<<< HEAD
        Brand: body.Brand,
=======
>>>>>>> 47f02b7f15a63ff96d6cd7da8da8e33336841998
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
<<<<<<< HEAD
                category.Brand = body.Brand;

=======
>>>>>>> 47f02b7f15a63ff96d6cd7da8da8e33336841998
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
