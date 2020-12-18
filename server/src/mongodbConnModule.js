var mongoose = require('mongoose');

module.exports.connect = function() {
	//mongodb+srv://UsuarioGeneral:mycar1234@cluster0.7xuhv.mongodb.net/MyCar?retryWrites=true&w=majority
	//mongodb://localhost:27017/MEVN-boilerplate
	mongoose.connect('mongodb://localhost:27017/MEVN-boilerplate', { useNewUrlParser: true, useUnifiedTopology: true });
	var db = mongoose.connection;
	db.on("error", console.error.bind(console, "connection error"));
	db.once("open", function(callback){
	  console.log("Connection Succeeded");
	});
	return db;
}