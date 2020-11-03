//Funciones para hacer las query correspondientes a la BDD

var express = require ('express');
var router = express.Router();
var mongo = require ('mongodb').MongoClient;
var assert = require ('assert');

//ATENCION, localhost puede variar 

var url = 'mongodb://localhost8080/test';

router.get('/',function(req,res,next){
    res.render('index');
});

router.get('/get-data',function(req,res,next)){

}

router.post('/insert',function(req,res,next)){
    var item = {

    };
}

router.post('/update',function(req,res,next)){
    
}

router.post('/delete',function(req,res,next)){
    
}

module.exports = router;