var express = require('express');
var app = express();
var multer = require("multer");
var bodyParser = require("body-parser");
var formData = require("express-form-data");
var base64Img = require('base64-img');
var path=require('path');
var mongoose = require('mongoose');
var autoIncrement = require("mongodb-autoincrement");
var ObjectId = require('mongodb').ObjectID;
var MongoClient = require("mongodb").MongoClient;
var expressValidator = require("express-validator");

var information,users;


// for parsing application/json
app.use(bodyParser.json()); 

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: false })); 


app.post('/process_get',function(req,res){


base64Img.base64('./uploads/adb.PNG', function(err, data) {
	console.log("Base 64");
	res.send(data);

});
});

function processFile() {
    console.log(content);
}

//form-urlencoded


app.get('/index', function (req, res) {
   res.sendFile( __dirname + "/" + "index.html" );
});

var storage = multer.diskStorage({
	destination:function(req,file,callback){
		callback(null,"./uploads");
	},
	filename:function(req,file,callback){
		console.log(req.body.json);
		console.log(file);
		var ext = file.mimetype.split("/");
		callback(null,Date.now()+"."+ext[1]);
	}
});

var upload = multer({storage:storage}).single('userImage');

app.post('/upload-image',function(req,res){

	upload(req,res,function(err){
		if(err){
			console.log(err);
			return res.end("Error uploading file");
		}
			
		res.end("File is uploaded");
	});
});



//login

  app.post('/login', function(req, res){

    var flag=false;

    console.log(req.body);

    MongoClient.connect('mongodb://localhost/notice_db', function(err, db) {

        if (err) throw err;

        db.collection("users").find({$and:[{email:req.body.email},{password:req.body.password}]}).toArray(function(err, result) {
              if (err) throw err;
              console.log(result);

              if(result.length>=1)
              {
                flag=true;
                res.send(result);
              }
              else
              {
                console.log("invalid user");
                res.send(flag);
               }
              
              db.close();
        });

    });

  });
var server = app.listen(8080, function () {
   var host = server.address().address;
   var port = server.address().port;
   
   console.log("server started");
});