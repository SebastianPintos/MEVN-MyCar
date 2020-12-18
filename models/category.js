var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CategorySchema = new Schema({
        Name: {type: String, required: true, unique:true},
<<<<<<< HEAD
        Brand: {
          type: Schema.Types.ObjectId,
          ref: 'Brand'
        },
=======
>>>>>>> 47f02b7f15a63ff96d6cd7da8da8e33336841998
        Status: {type: String, enum: ['ACTIVE', 'INACTIVE'], required: true},
  });

var category = mongoose.model("Category",CategorySchema);
module.exports = category; 