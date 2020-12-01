var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var SubCategory = new Schema({
        Name: {type: String, required: true},
        Category: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Category'
        },
        Status: {type: String, enum: ['ACTIVE', 'INACTIVE'], required: true},
});

var subcategory = mongoose.model("SubCategory", SubCategory);
module.exports = subcategory; 