var router = require('express').Router();
var path = require('path');
var pg = require ('pg');
var connectionString = 'postgres://localhost:5432/cimarron';
var firebase = require('firebase');


router.route('/projects')
//selecting all projects who are not admins from employees table
.get(function(req, res) {
  //verify idToken sent in headers
  firebase.auth().verifyIdToken(req.headers.id_token).then(function(decodedToken) {
    
  console.log('projects get route hit');
  pg.connect(connectionString, function(err, client, done){
    if(err){
      console.log(err);
    }else {
      var resultsArray = [];
      var queryResults = client.query('SELECT * FROM projects WHERE isactive = TRUE');
      queryResults.on('row', function(row){
        resultsArray.push(row);
      });//on row function
      queryResults.on('end',function(){
        done();
        return res.send(resultsArray);
      });//on end function
    }//else
  });//pg.connect
}).catch(function(error){
  console.log(error);
  // If the id_token isn't right, you end up in this callback function
  res.send("Sorry your Auth-Token was incorrect");
});//end catch
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

//toggle employee isactive or isadmin status
//  to toggle active status, it expects an object with a key of empid and a key of isactive with any value
//  to toggle user as an admin, it expects an object with a key of empid and a key of isadmin with any value
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



module.exports = router;
