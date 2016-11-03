var router = require('express').Router();
var path = require('path');
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/cimarron-winter';
var firebase = require('firebase');
var checkDataType = require('../modules/dataType');


router.route('/projectsbyclient')
//selecting all projects- also listens for an optional query
.get(function(req, res) {
  //verify idToken sent in headers
  firebase.auth().verifyIdToken(req.headers.id_token).then(function(decodedToken) {

    console.log('projects get route hit');
    pg.connect(connectionString, function(err, client, done) {
      //req.query pulls client id from query paramaters
      var data = req.query;
      if (err) {
        console.log(err);
      } else {
        var resultsArray = [];
        var queryResults;
        if(checkDataType('number',[data.clientUID]) || data.clientUID === undefined){
          if (data.clientUID !== undefined) {
            queryResults = client.query('SELECT * FROM projects WHERE client_id = $1', [data.clientUID]);
          } else {
            queryResults = client.query('SELECT * FROM projects');
          }
          queryResults.on('row', function(row) {
            resultsArray.push(row);
          }); //on row function
          queryResults.on('end', function() {
            done();
            return res.send(resultsArray);
          }); //on end function
        }else {
          return res.send({
            success:false
          });//res.send
        }//nested else
      } //else
    }); //pg.connect
  }).catch(function(error) {
    console.log(error);
    // If the id_token isn't right, you end up in this callback function
    res.send("Sorry your Auth-Token was incorrect");
  }); //end catch
}); //router.get

router.route('/projects')
//selecting all projects- also listens for an optional query
.get(function(req, res) {
  //verify idToken sent in headers
  firebase.auth().verifyIdToken(req.headers.id_token).then(function(decodedToken) {

    console.log('projects get route hit');
    pg.connect(connectionString, function(err, client, done) {
      //req.query pulls client id from query paramaters
      var data = req.query;
      if (err) {
        console.log(err);
      } else {
        if(checkDataType('string',[data.empid])){

          var resultsArray = [];
          var empID = client.query('SELECT empid FROM employee WHERE authid = $1', [data.empid]);
          empID.on('end', function () {
            //handles undefined error
            if( empID._result.rows[0]===undefined){
              done();
              return res.send({
                success:false
              });//res.send
            }//if
            var thisisEmpId = empID._result.rows[0].empid;
            var queryResults = client.query('SELECT * FROM projects JOIN emp_proj ON projectid=project_id WHERE emp_id = $1;',[thisisEmpId]);
            console.log(thisisEmpId, data.projectid);
            queryResults.on('row', function(row) {
              resultsArray.push(row);
            }); //on row function
            queryResults.on('end', function() {
              done();
              console.log(resultsArray,'resultssssss');
              return res.send(resultsArray);
            }); //on end function
          });
        }else {
          return res.send({
            success:false
          });//res.send
        }//error handling else
      } //else
    }); //pg.connect
  }).catch(function(error) {
    console.log(error);
    // If the id_token isn't right, you end up in this callback function
    res.send("Sorry your Auth-Token was incorrect");
  }); //end catch
}) //router.get

//add a project expects an object a little something like this {projectname: 'string', startdate:y-m-d, enddate:y-m-d, client_id:number,}
.post(function(req, res) {
  firebase.auth().verifyIdToken(req.headers.id_token).then(function(decodedToken) {
    console.log('projects post route hit');
    var data = req.body;
    console.log('data which is also req.body', data);
    if(checkDataType('number',[data.client_id]) && checkDataType('string',[data.projectname])){

      pg.connect(connectionString, function(err, client, done) {
        if (err) {
          console.log(err);
        } else {
          var query = client.query('INSERT INTO projects (projectname, isactive, startdate, enddate, client_id ) VALUES ($1,$2,$3,$4,$5)', [data.projectname, true, data.startdate, data.enddate, data.client_id]);
          //need to assign employees to project via emp_proj join table
          done();
          res.send({
            success: true
          });

        } //else bracket
      });//pg.connect
    }else {
      return res.send({
        success:false
      });//res.send
    }//else
  }).catch(function(error) {
    console.log(error);
    // If the id_token isn't right, you end up in this callback function
    res.send("Sorry your Auth-Token was incorrect");
  }); //end catch
}) //post route
//edits projects table expects an object like this{projectid: whatever type:'string' value: whatever updated value}
.put(function(req, res) {
  firebase.auth().verifyIdToken(req.headers.id_token).then(function(decodedToken) {
    console.log('put route');
    var data = req.body;
    console.log('req.body', req.body.type, req.body.value, req.body.projectid);
    pg.connect(connectionString, function(err, client, done) {
      if (err) {
        console.log(err);
      } else {
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
          default:
          console.log('critical switch malfunction');
        }
        updatedInfo = data.value;
        var clientQuery = 'UPDATE projects SET ' + column + ' = ' + updatedInfo + ' WHERE projectid = ' + data.projectid;
        console.log(clientQuery);
        client.query('UPDATE projects SET ' + column + ' = $1 WHERE projectid = $2', [updatedInfo, data.projectid]);
        done();
        res.send({
          success: true
        });
      } //else
    }); //pg.connect
  }).catch(function(error) {
    console.log(error);
    // If the id_token isn't right, you end up in this callback function
    res.send("Sorry your Auth-Token was incorrect");
  }); //end catch
}); //.put route


//add user to project
//expects an object like so--- {projectid:number,empid:number}
router.route('/projects/users')
.post(function(req, res) {
  firebase.auth().verifyIdToken(req.headers.id_token).then(function(decodedToken) {
    console.log('projects/users post route hit');
    var data = req.body;
    pg.connect(connectionString, function(err, client, done) {
      if (err) {
        console.log(err);
      } else {
        var query = client.query('INSERT INTO emp_proj (emp_id,project_id) VALUES ($1,$2)', [data.empid, data.projectid]);
        done();
        res.send({
          success: true
        });
      }
    }); //pg connect
  }).catch(function(error) {
    console.log(error);
    // If the id_token isn't right, you end up in this callback function
    res.send("Sorry your Auth-Token was incorrect");
  }); //end catch
}) //router.post projects/users

//delete user from project
.delete(function(req, res) {
  console.log('projects/users delete route hit');
  firebase.auth().verifyIdToken(req.headers.id_token).then(function(decodedToken) {
    var data = req.body;
    console.log('making sure there is a req.body', data);
    pg.connect(connectionString, function(err, client, done) {
      if (err) {
        console.log(err);
      } else {
        var query = client.query('DELETE FROM emp_proj WHERE emp_id=$1 AND project_id=$2', [data.empid, data.projectid]);
        done();
        res.send({
          success: true
        });
      }
    }); //pg connect
  }).catch(function(error) {
    console.log(error);
    // If the id_token isn't right, you end up in this callback function
    res.send("Sorry your Auth-Token was incorrect");
  }); //end catch
}); //router.delete


router.route('/userprojects')
//selecting all projects based on user currently logged in
.get(function(req, res) {
  //verify idToken sent in headers
  firebase.auth().verifyIdToken(req.headers.id_token).then(function(decodedToken) {
    pg.connect(connectionString, function(err, client, done) {
      //req.query pulls client id from query paramaters
      var data = req.query;
      if (err) {
        console.log(err);
      } else {
        var resultsArray = [];
        var queryResults = client.query('SELECT projects.projectid, projects.projectname, projects.isactive FROM emp_proj JOIN projects ON emp_proj.project_id=projects.projectid WHERE emp_proj.emp_id= $1;', [data.empid]);
        queryResults.on('row', function(row) {
          resultsArray.push(row);
        }); //on row function
        queryResults.on('end', function() {
          done();
          return res.send(resultsArray);
        }); //on end function
      } //else
    }); //pg.connect
  }).catch(function(error) {
    console.log(error);
    // If the id_token isn't right, you end up in this callback function
    res.send("Sorry your Auth-Token was incorrect");
  }); //end catch
}); //router.get

module.exports = router;
