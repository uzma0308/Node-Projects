
var express=require('express');
var bodyParser=require('body-parser');
var path=require('path');
var app=express();
var mongoose = require('mongoose');
var autoIncrement = require("mongodb-autoincrement");
var ObjectId = require('mongodb').ObjectID;
var formData = require("express-form-data");
var MongoClient = require("mongodb").MongoClient;
var expressValidator = require("express-validator");
var multer  = require('multer');
var base64Img = require('base64-img');

var information,users;



app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

var storage = multer.diskStorage({
  destination:function(req,file,callback){
    console.log("yahan aarha hai");
    callback(null,"./uploads");
  },
  filename:function(req,file,callback){
    console.log(req.body.json);
    console.log(file);
    var ext = file.mimetype.split("/");
    callback(null,Date.now()+"."+ext[1]);
  }
});

var upload = multer({ storage: 'storage'}).single('userImage');

//app.use(fileUpload());

app.use(expressValidator());



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



  //uploading image
  app.post('/uploadImage', function(req, res,next) {
    console.log("upload image req");//ye bhi ni aarha
    upload(req,res,function(err){
    if(err){
      console.log(err);
     
    }
      
    console.log("File is uploaded");
    res.end("nm");
    /*var userIdImage=req.body;
    var userImageType=req.body.imageType;

    console.log(userIdImage); 
    console.log(userImageType);


    MongoClient.connect('mongodb://localhost/notice_db', function (err, db) {
    console.log("inside user");
      

          var user_db = db.collection("users");

          var user_img = req.files; 


           user_db.update(
            { "_id" :parseInt(userIdImage)},
            {
              $set: {"image_type":userImageType,"profile_image":user_img}
            },function(err,res){
               if (err) throw err;
              console.log("1 document updated");
              db.close();
            }
        );
              

    });*/

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

app.listen(8080,function()
{
	console.log('server started');
});
