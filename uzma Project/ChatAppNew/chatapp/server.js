var express = require('express');
var app = express();
var fs = require('fs');
var os = require("os");
var bodyParser = require('body-parser');
var server  = app.listen(8000);
var io = require('socket.io').listen(server);
var fileUploader = require('express-fileupload');

app.use("/Images", express.static(__dirname + '/Images'));

/* ===================== Mongo db operation ========================= */
//var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost/chatdb';
//mongoose.connect('mongodb://localhost/chatdb');

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
   db.createCollection("users", function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
    db.collection('users').drop();
    db.close();
  });
});

//var users = mongoose.model('users', { name: String, active:Boolean , emp_id:Number,ip:String,socket_id:String });


/* =====================End of  Mongo db operation ========================= */

var allMsg = []; // for storing messages in local variable

//Whenever someone connects this gets executed
io.on('connection', function(socket){
    socket.on('user_connected', function(msg){
    // var user = new users({ name: msg.name,active:true,emp_id:msg.emp_id,ip:msg.ip,socket_id:socket.id });
    // user.save(function (err) {
    // if (err) {
    //     console.log(err);
    // } else {
    //     console.log('added successfully');
    // }
    // });

    // inserting active user in db
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var myobj = { name: msg.name,active:true,emp_id:msg.emp_id,ip:msg.ip,socket_id:socket.id  };
        db.collection("users").insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
        });
    });

    //fetching online user to the client
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        db.collection("users").find({}).toArray(function(err, result) {
            if (err) throw err;
            io.emit('online_user',result);
            db.close();
        });
    });

    console.log('message: ' + msg);

    socket.emit('prev_msg', allMsg);
     
  });

  socket.on('chat_message', function(msg){
    console.log('message: ' + msg);
     allMsg.push(msg);
     io.emit('chat_message', msg);
  });

  socket.on('userImage', function (msg) {
      console.log("*************"+msg);
      allMsg.push(msg);
        //Received an image: broadcast to all
        io.emit('userImage',  msg);
    });

  //Whenever someone disconnects this piece of code executed
  socket.on('disconnect', function () {
    console.log('A user disconnected '+socket.id);
    // try {
    //     db.users.deleteOne( { "socket_id" : socket.id } );
    //     } catch (e) {
    //     console.log(e);
    //     }
     
    // delete user from db
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var myquery = { socket_id: socket.id  };
        db.collection("users").deleteOne(myquery, function(err, obj) {
            if (err) throw err;
            console.log("1 document deleted");
            db.close();
        });
    });

    //fetching online user to the client
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        db.collection("users").find({}).toArray(function(err, result) {
            if (err) throw err;
            io.emit('online_user',result);
            db.close();
        });
    });

  });

});

app.get('/',function(req,res){
    res.sendFile(__dirname+'/client.html');
});

app.post('/getOnlineUsers',function(req,res){

    //fetching online user to the client
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        db.collection("users").find({}).toArray(function(err, result) {
            if (err) throw err;
            res.send(result);
            db.close();
        });
    });
});







