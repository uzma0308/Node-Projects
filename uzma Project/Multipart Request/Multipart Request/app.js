var express = require('express');
var app = express();
var multer = require("multer");
var bodyParser = require("body-parser");
var formData = require("express-form-data");
var base64Img = require('base64-img');
var path=require('path');
// var mongoose = require('mongoose');
var autoIncrement = require("mongodb-autoincrement");
// var ObjectId = require('mongodb').ObjectID; 
var MongoClient = require("mongodb").MongoClient;
// var expressValidator = require("express-validator");

var information,users;


// for parsing application/json
app.use(bodyParser.json()); 

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: false })); 




var storage = multer.diskStorage({
	destination:function(req,file,callback){
		callback(null,"./uploads");
	},
	filename:function(req,file,callback){
    console.log("data check");
		console.log(file);
		var ext = file.mimetype.split("/");
		callback(null,Date.now()+"."+ext[1]);
	}
});

var upload = multer({storage:storage}).single('userImage');

app.post('/upload-image',function(req,res){

  console.log(req.body.json);

	upload(req,res,function(err){
		if(err){
			console.log(err);
			return res.end("Error uploading file");
		}

    base64Img.base64('./uploads/uploads.PNG', function(err, data) {
    console.log("Base 64");
    res.send(data);


});

	});
});



//login

  app.post('/login', function(req, res){

    var flag=false;

    console.log(req.body);

    MongoClient.connect('mongodb://localhost:27017/notice_db', function(err, db) {

      

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


  //getting all the notice information from information_db

  app.post('/', function(req, res){

    MongoClient.connect('mongodb://localhost/notice_db', function (err, db) {

      information = db.collection("information");

      information.find().toArray(function(err, docs) {
       // console.log(docs);

        res.send(docs);

        db.close();
      });

    });

  });

 //getting user info
  app.post('/getUserInfo', function(req, res){
    var info=req.body.user_id_store;

    console.log(info);

    MongoClient.connect('mongodb://localhost/notice_db', function (err, db) {

          user = db.collection("users");

          user.find({_id: parseInt(info)}).toArray(function(err, docs) {
           
            console.log(docs);
            res.send(docs);

            db.close();
      });

    });

  });

  //deleting particular item by getting id

  app.post('/deleteData',function(req,res){

    MongoClient.connect('mongodb://localhost/notice_db', function (err, db) {

      information = db.collection("information");
      information.remove({'_id':req.body.data},function(err, obj) {

        if (err) throw err;
      });

      db.close();
    });

    res.send("ok");

  });


//fetching category information

  app.post('/category',function(req,res){

    MongoClient.connect('mongodb://localhost/notice_db', function (err, db) {

      autoIncrement.getNextSequence(db,"category", function (err, autoIndex) {

          category = db.collection("category");

          var Info = req.body; 
          console.log(Info);

          category.insert({

              _id: autoIndex,
              category: Info.name

          },function(err,res){

              console.log("inserted");
            });
              
      });

    });

  });



  //getting selected data
  app.post('/getSelected', function(req, res){
    var info=req.body.user_id_store;
    console.log(info);

MongoClient.connect('mongodb://localhost/notice_db', function (err, db) {

      information = db.collection("information");

      information.find({user_id: info}).toArray(function(err, docs) {
       // console.log(docs);

        res.send(docs);

        db.close();
      });

    });

  });

  //writing new notice
  app.post('/writeData', function(req, res){

    MongoClient.connect('mongodb://localhost/notice_db', function (err, db) {

      autoIncrement.getNextSequence(db,"information", function (err, autoIndex) {

          information = db.collection("information");

          var Info = req.body; 
          var Info_data=Info.data;
          var breif_data=Info_data.substr(0, 120);
       
          var dateCreation = new Date();

          information.insert({

            _id: autoIndex,
            title: Info.title,
            description: Info_data,
            date_of_creation:dateCreation,
            date_of_updation:dateCreation,
            category_id:Info.categorySelected,
            user_id:Info.id,
            user_name:Info.name,
            brief_description:breif_data

          },function(err,res){

              //console.log(res+"hhhhj");

            });
              
      });

    });

    res.end("success");
     
  });



//updating data in database
  app.post('/writeUpdatedData', function(req, res){

    MongoClient.connect('mongodb://localhost/notice_db', function (err, db) {


        var Info = req.body; 

        var Info_data=Info.dataInModal;
        var breif_data=Info_data.substr(0,120);
        console.log(Info.id);


        information = db.collection("information");
        information.update(
            { "_id" :Info.id  },
            {
              $set: { "title": Info.titleInModal,"description":Info.dataInModal,"brief_description":breif_data},
              $currentDate: { "date_of_updation": true }
            }
        );


         db.close();
    });

    res.send('ok');

  });


//submitting user information
  app.post('/sign_up', function(req, res){

    MongoClient.connect('mongodb://localhost/notice_db', function (err, db) {

          var flag=false;

          user = db.collection("users");

          user.find({ email: req.body.email}).toArray(function(err, result) {

            if (err) throw err;

            console.log(result);

            if(result.length>=1)
            {
                  console.log("already taken");
                  flag=true;
                  res.send(flag);
            }
            else
            {
                  autoIncrement.getNextSequence(db,"users", function (err, autoIndex) {

                        var Info = req.body; 
                        console.log(Info);

                        user.insert({

                            _id: autoIndex,
                            email: Info.email,
                            password: Info.password,
                            name:Info.name
                        },function(err,res){

                          if (err) throw err;
                          console.log("1 user inserted");

                          });
                      
                  });

                  res.send(flag);
            }

          });
    });

  });


var server = app.listen(8080, function () {
   var host = server.address().address;
   var port = server.address().port;
   
   console.log("server started");
});