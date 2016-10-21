var router = require('express').Router();
var path = require('path');
var pg = require ('pg');
var connectionString = 'postgres://localhost:5432/cimaron-winter';

router.route('/projects')
//selecting all projects
.get(function(req, res) {
  console.log('projects get route hit');
  pg.connect(connectionString, function(err, client, done){
    if(err){
      console.log(err);
    }else {
      var resultsArray = [];
      var queryResults = client.query('SELECT * FROM projects');
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
  console.log('projects post route hit');
  var data = req.body;
  console.log('data which is also req.body',data);
  pg.connect(connectionString, function(err, client, done){
    if(err){
      console.log(err);
    }else {
    var query = client.query('INSERT INTO projects (projectname, isactive, startdate, enddate, client_id ) VALUES ($1,$2,$3,$4,$5)',[data.projectname, data.isactive, data.startdate, data.enddate, data.client_id]);
    res.sendStatus(201);
    }//else bracket
  });//pg.connect
})//post route

//expects an object with two properties projectid and one of these{projectname, isactive,startdate,enddate,clientid}
.put(function(req,res){
  console.log('put route');
  var data = req.body;
  pg.connect(connectionString, function (err, client, done){
    if (err){
      console.log(err);
    }else {
      if(1){

      }else if(2){

      }else if (3) {

      }else if (4){

      }else if (5){

      }else{
        console.log('error - req.body is somehow whacky');
      }








    //   //toggle isactive
    //   if(data.isactive!==undefined){
    // client.query('UPDATE employee SET isactive = NOT isactive WHERE empid = $1',[data.empid]);
    // res.sendStatus(202);
    //   //toggle isadmin
    //   }else if(data.isadmin!==undefined){
    //     client.query('UPDATE employee SET isadmin = NOT isadmin WHERE empid = $1',[data.empid]);
    //     res.sendStatus(202);
    //   }//nested else
    }//else
  });//pg.connect
});//.put route


module.exports = router;
