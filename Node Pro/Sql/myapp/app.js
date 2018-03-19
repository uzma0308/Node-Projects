var express = require('express');
var app=express();
var mysql=require('mysql');

var connection=mysql.createConnection(
{
	host:'sql12.freesqldatabase.com',
	user:'sql12225688',
	password:'pVGCDu4MWG',
	database:'sql12225688'

});

connection.connect(function(error)
{
	if(error)
	{
		console.log('Error');

	}
	else
	{
		console.log('Connected');
	}
});

app.get("/",function(req,res) {
	
	connection.query("Select * from user",function(error,rows,feilds)
	{
		if(error)
		{
			console.log("Error");
		}
		else
		{
			res.send(rows);
		}

	});
});

app.get("/insert",function(req,res) {

	var sql = "INSERT INTO user(user_name,user_email) VALUES ('Ayaan', 'ayan@gmail.com')";
	
	connection.query(sql,function(error,rows,feilds)
	{
		if(error)
		{
			console.log("Error");
		}
		else
		{
			console.log("Inserted Successfully");
			//res.send(rows);
		}

	});
});

app.get("/update",function(req,res) {

	var sql = "UPDATE user SET user_college = 'Amity' WHERE user_id = 2";
	
	connection.query(sql,function(error,rows,feilds)
	{
		if(error)
		{
			console.log("Error in updation");
		}
		else
		{
			console.log("Updated Successfully");
			//res.send(rows);
		}

	});
});

module.exports = app;
