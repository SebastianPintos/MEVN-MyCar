const express = require('express');
const config = require('./config');
const app = config(express());
const schedule = require('node-schedule');
const cronJob = require('../lib/helperCron');

const mongodb_conn_module = require('./mongodbConnModule');
var db = mongodb_conn_module.connect();

 
//Tareas en intervalos
/*
*    *    *    *    *    *
┬    ┬    ┬    ┬    ┬    ┬
│    │    │    │    │    │
│    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
│    │    │    │    └───── month (1 - 12)
│    │    │    └────────── day of month (1 - 31)
│    │    └─────────────── hour (0 - 23)
│    └──────────────────── minute (0 - 59)
└───────────────────────── second (0 - 59, OPTIONAL)*/

//Cada hora, de lunes a viernes 0 */1 * * 1-5
schedule.scheduleJob('0 */5 * * 1-5', cronJob.EmailRemainder1);
schedule.scheduleJob('0 */5 * * 1-5', cronJob.EmailRemainder2);


//Starting Server
//app.listen(process.env.PORT || 8081)
app.listen(app.get('port'), () => {
	console.log('Server on Port ', app.get('port'))
});


