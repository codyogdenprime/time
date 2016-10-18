var router = require('express').Router();
var path = require('path');
var pg = require ('pg');
var connectionString = 'postgres://localhost:5432/cimaron-winter';


//selecting all from employees table
router.get('/employees', function(req, res) {
  console.log('employees hit');
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
});//router.get
router.post('/employees',function(req, res){
  var data = req.body;
  console.log('data which is also req.body',data);
  pg.connect(connectionString, function(){
    client.query('INSERT INTO employee (empname, isadmin, authid, authpic, authemail) VALUES ($1,$2,$3,$4,$5)',[data.name, data.adminstatus, data.authid, data.authpic, data.authemail]);
    res.sendStatus(201);
  });//pg.connect
});//post route
module.exports = router;
