var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ClientSchema = new Schema({
    name: String,
    lastname: String,
    dni: String,
    email: String,
    phone: String,
    direccion: {
        street: String,
        number: Number,
        city: String,
    },
    cars: [{type: mongoose.Schema.Types.ObjectId, ref: 'Car'}]
  });
  
  var Client = mongoose.model("Client", ClientSchema);
  module.exports = Client;