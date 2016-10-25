var router = require('express').Router();
var path = require('path');
var pg = require ('pg');
var connectionString = 'postgres://localhost:5432/cimaron-winter';
var firebase = require('firebase');


router.route('/projects')
//selecting all projects
.get(function(req, res) {
  //verify idToken sent in headers
  firebase.auth().verifyIdToken(req.headers.id_token).then(function(decodedToken) {

  console.log('projects get route hit');
  pg.connect(connectionString, function(err, client, done){
    var data = client.query;
    if(err){
      console.log(err);
    }else {
      var resultsArray = [];
      var queryResults;
      if(data.clientUID!==undefined){
          queryResults = client.query('SELECT * FROM projects WHERE authid = $1',[data.clientUID]);
    }else{
          queryResults = client.query('SELECT * FROM projects');
    }

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
  firebase.auth().verifyIdToken(req.headers.id_token).then(function(decodedToken) {
  console.log('projects post route hit');
  var data = req.body;
  console.log('data which is also req.body',data);
  pg.connect(connectionString, function(err, client, done){
    if(err){
      console.log(err);
    }else {
    var query = client.query('INSERT INTO projects (projectname, isactive, startdate, enddate, client_id ) VALUES ($1,$2,$3,$4,$5)',[data.projectname, true, data.startdate, data.enddate, data.client_id]);
    res.send({success:true});
    }//else bracket
  });//pg.connect
}).catch(function(error){
  console.log(error);
  // If the id_token isn't right, you end up in this callback function
  res.send("Sorry your Auth-Token was incorrect");
});//end catch
})//post route
//edits projects table expects an object like this{projectid: whatever type:'string' value: whatever updated value}
.put(function(req,res){
  firebase.auth().verifyIdToken(req.headers.id_token).then(function(decodedToken) {
  console.log('put route');
  var data = req.body;
  pg.connect(connectionString, function (err, client, done){
    if (err){
      console.log(err);
    }else {
      var column = '';
      var updatedInfo = '';
      //build sql statement based on data in
      switch (data.type) {
        case 'projectname':
        column = 'projectname';
          break;
        case 'isactive':
          column = 'isactive';
            break;
        case 'startdate':
          column = 'startdate';
            break;
        case 'enddate':
          column = 'enddate';
            break;
        case 'client_id':
            column = 'client_id';
            break;
        default:console.log('critical switch malfunction');
      }
      updatedInfo = data.value;
    client.query( 'UPDATE projects SET ' + column + ' = $1 WHERE projectid = $2',[ updatedInfo, data.projectid ] );
    res.send({success:true});
    }//else
  });//pg.connect
}).catch(function(error){
  console.log(error);
  // If the id_token isn't right, you end up in this callback function
  res.send("Sorry your Auth-Token was incorrect");
});//end catch
});//.put route
module.exports = router;
