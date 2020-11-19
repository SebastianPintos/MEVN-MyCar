const express = require('express');
const config = require('./config');
const app = config(express());

const mongodb_conn_module = require('./mongodbConnModule');
var db = mongodb_conn_module.connect();

//Starting Server
//app.listen(process.env.PORT || 8081)
app.listen(app.get('port'), () => {
	console.log('Server on Port ', app.get('port'))
});
