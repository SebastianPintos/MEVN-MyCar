var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CategorySchema = new Schema({
        Name: {type: String, required: true, unique:true},
        Status: {type: String, enum: ['ACTIVE', 'INACTIVE'], required: true},
  });

var category = mongoose.model("Category",CategorySchema);
module.exports = category; 