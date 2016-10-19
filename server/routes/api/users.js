var router = require('express').Router();
var path = require('path');
var pg = require ('pg');
var connectionString = 'postgres://localhost:5432/cimaron-winter';

router.route('/users')
//selecting all from employees table
.get(function(req, res) {
  console.log('users get route hit');
  pg.connect(connectionString, function(err, client, done){
    if(err){
      console.log(err);
    }else {
      var resultsArray = [];
      var queryResults = client.query('SELECT * FROM employee');
      queryResults.on('row', function(row){
        resultsArray.push(row);
      });//on row function
      queryResults.on('end',function(){
        done();
        return res.send(resultsArray);
      });//on end function
    }//else
  });//pg.connect
})//router.get

//add an employee
.post(function(req, res){
  console.log('users post route hit');
  var data = req.body;
  console.log('data which is also req.body',data);
  pg.connect(connectionString, function(err, client, done){
    if(err){
      console.log(err);
    }else {
    var query = client.query('INSERT INTO employee (empname, isadmin, authid, authpic, authemail) VALUES ($1,$2,$3,$4,$5)',[data.name, data.adminstatus, data.authid, data.authpic, data.authemail]);
    res.sendStatus(201);
    }//else bracket
  });//pg.connect
})//post route

//toggle employee isactive or isadmin status
.put(function(req,res){
  console.log('put route');
  var data = req.body;
  pg.connect(connectionString, function (err, client, done){
    if (err){
      console.log(err);
    }else {
      //toggle isactive
      if(data.isactive!==undefined){
    client.query('UPDATE employee SET isactive = NOT isactive WHERE empid = $1',[data.empid]);
    res.sendStatus(202);
      //toggle isadmin
      }else if(data.isadmin!==undefined){
        client.query('UPDATE employee SET isadmin = NOT isadmin WHERE empid = $1',[data.empid]);
        res.sendStatus(202);
      }//nested else
    }//else
  });//pg.connect
});//.put route

//get users who are admins
router.get('/users/admin',function(req, res){
    console.log('users/admin get route hit');
    pg.connect(connectionString, function(err, client, done){
      if(err){
        console.log(err);
      }else {
        var resultsArray = [];
        var queryResults = client.query('SELECT * FROM employee WHERE isadmin = true');
        queryResults.on('row', function(row){
          resultsArray.push(row);
        });//on row function
        queryResults.on('end',function(){
          done();
          return res.send(resultsArray);
        });//on end function
      }//else
    });//pg.connect
});//get admin users

//get users who are active
router.get('/users/active',function(req, res){
    console.log('users/active get route hit');
    pg.connect(connectionString, function(err, client, done){
      if(err){
        console.log(err);
      }else {
        var resultsArray = [];
        var queryResults = client.query('SELECT * FROM employee WHERE isactive = true');
        queryResults.on('row', function(row){
          resultsArray.push(row);
        });//on row function
        queryResults.on('end',function(){
          done();
          return res.send(resultsArray);
        });//on end function
      }//else
    });//pg.connect
});//get active users
module.exports = router;
