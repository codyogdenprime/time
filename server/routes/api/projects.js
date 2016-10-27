var router = require('express').Router();
var path = require('path');
var pg = require ('pg');
var connectionString = 'postgres://localhost:5432/cimarron-winter';
var firebase = require('firebase');


router.route('/projects')
//selecting all projects- also listens for an optional query
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

//add a project expects an object a little something like this {projectname: 'string', startdate:y-m-d, enddate:y-m-d, client_id:number,}
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
    //need to assign employees to project via emp_proj join table
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
  console.log('req.body', req.body.type, req.body.value, req.body.projectid);
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
      var clientQuery = 'UPDATE projects SET ' + column + ' = ' + updatedInfo + ' WHERE projectid = ' + data.projectid;
      console.log(clientQuery);
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


//add user to project
//expects an object like so--- {projectid:number,empid:number}
router.route('/projects/users')
.post(function(req,res){
  firebase.auth().verifyIdToken(req.headers.id_token).then(function(decodedToken) {
  console.log('projects/users post route hit');
  var data = req.body;
  pg.connect(connectionString, function(err, client, done){
  if (err){
    console.log(err);
  }else {
    var query = client.query('INSERT INTO emp_proj (emp_id,project_id) VALUES ($1,$2)',[data.empid, data.projectid]);
    res.send({success:true});
  }
  });//pg connect
}).catch(function(error){
  console.log(error);
  // If the id_token isn't right, you end up in this callback function
  res.send("Sorry your Auth-Token was incorrect");
});//end catch
})//router.post projects/users

//delete user from project
.delete(function(req,res){
  console.log('projects/users delete route hit');
  firebase.auth().verifyIdToken(req.headers.id_token).then(function(decodedToken) {
    var data = req.body;
    console.log('making sure there is a req.body',data);
    pg.connect(connectionString, function(err, client, done){
    if (err){
      console.log(err);
    }else {
      var query = client.query('DELETE FROM emp_proj WHERE emp_id=$1 AND project_id=$2',[data.empid, data.projectid]);
      res.send({success:true});
    }
    });//pg connect
}).catch(function(error){
  console.log(error);
  // If the id_token isn't right, you end up in this callback function
  res.send("Sorry your Auth-Token was incorrect");
});//end catch
});//router.delete


module.exports = router;
