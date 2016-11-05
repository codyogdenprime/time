var router = require('express').Router();
var path = require('path');
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/cimarron-winter';
var firebase = require('firebase');
var checkDataType = require('../modules/dataType');

router.route('/timebyprojemp')
    //get time by projectid and empid
    .get(function(req, res) {
        firebase.auth().verifyIdToken(req.headers.id_token).then(function(decodedToken) {
            console.log('time get route hit', req.query.empid, req.query.projectid);
            var data = req.query;
            pg.connect(connectionString, function(err, client, done) {
                if (err) {
                    console.log(err);
                } else {
                    var resultsArray = [];
                    var empID = client.query('SELECT empid FROM employee WHERE authid = $1', [data.empid]);
                    empID.on('end', function () {
                      //console.log( 'sdfghjk-------' + empID._result.rows[0].empid );
                      var thisisEmpId = empID._result.rows[0].empid;
                      var queryResults = client.query('SELECT * FROM time WHERE empid = $1 AND projid = $2',[thisisEmpId, data.projectid]);
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
                } //else
            }); //pg.connect
        }).catch(function(error) {
            console.log(error);
            // If the id_token isn't right, you end up in this callback function
            res.send("Sorry your Auth-Token was incorrect");
        }); //end catch
    }); //router.get
    //get time based on selected user from DOM
    router.route('/timebyemp')
      .get(function(req,res){
        firebase.auth().verifyIdToken(req.headers.id_token).then(function(decodedToken) {
        var data = req.query;
        pg.connect(connectionString, function(err,client,done){
          if (err) {
            console.log(err);
          }else {
            var resultsArray = [];
            var queryResults = client.query('SELECT * FROM time WHERE empid = $1 and projid = $2', [data.empid, data.projid]);
            queryResults.on('row',function(row){
              resultsArray.push(row);
            });//query results row
            queryResults.on('end', function(){
              done();
              return res.send(resultsArray);
            });//end queryResults end
          }//end else
        });//end pg connect
      }).catch(function(error) {
          console.log(error);
          // If the id_token isn't right, you end up in this callback function
          res.send("Sorry your Auth-Token was incorrect");
      }); //end catch
      });//end router get
    //selecting all from time table
    router.route('/time')
        //selecting all from time table
        .get(function(req, res) {
            firebase.auth().verifyIdToken(req.headers.id_token).then(function(decodedToken) {
                console.log('timebyprojemp get route hit');
                pg.connect(connectionString, function(err, client, done) {
                    if (err) {
                        console.log(err);
                    } else {
                        var resultsArray = [];
                        var clientID = client.query('');
                        var queryResults = client.query('SELECT * FROM time');
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
        }) //router.get

//add a time instance
.post(function(req, res) {
        firebase.auth().verifyIdToken(req.headers.id_token).then(function(decodedToken) {
            console.log('time post route hit');
            var data = req.body;
            console.log('data which is also req.body', data);
            pg.connect(connectionString, function(err, client, done) {
                if (err) {
                    console.log(err);
                } else {
                  var empID = client.query('SELECT empid FROM employee WHERE authid = $1', [data.empid]);
                  empID.on('end', function () {
                    //console.log( 'sdfghjk-------' + empID._result.rows[0].empid );
                    var thisisEmpId = empID._result.rows[0].empid;
                    var queryResults = client.query('INSERT INTO time (date, hours, description, empid, projid) VALUES ($1,$2,$3,$4,$5)', [data.date, Number(data.hours), data.description, thisisEmpId, data.projectid]);
                  queryResults.on('end', function() {
                      done();
                      return res.send({success: true});
                  }); //on end function
                });
                } //else bracket
            }); //pg.connect
        }).catch(function(error) {
            console.log(error);
            // If the id_token isn't right, you end up in this callback function
            res.send("Sorry your Auth-Token was incorrect");
        }); //end catch
    }) //post route

//update time table
//expects an object that includes a key of projid and one of the following: date,hours,description,empid
.put(function(req, res) {
        firebase.auth().verifyIdToken(req.headers.id_token).then(function(decodedToken) {
            console.log('/time put route');
            var data = req.body;
            console.log("data logged here", data);
            pg.connect(connectionString, function(err, client, done) {
                if (err) {
                    console.log(err);
                } else {
                    var column = '';
                    var updatedInfo = '';
                    //build sql statement based on data in
                    switch (data.type) {
                        case 'date':
                            column = 'date';
                            break;
                        case 'hours':
                            column = 'hours';
                            break;
                        case 'description':
                            column = 'description';
                            break;
                        case 'empid':
                            column = 'empid';
                            break;
                        default:
                        console.log('switch failure');
                        res.send({
                            success: false
                        });
                    }
                    updatedInfo = data.value;
                    client.query('UPDATE time SET ' + column + ' = $1 WHERE timeid = $2', [updatedInfo, data.timeid]);
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
    }) //.put route


//finds by timeid and deletes the whole thing
.delete(function(req, res) {
    firebase.auth().verifyIdToken(req.headers.id_token).then(function(decodedToken) {
        var data = req.body;
        pg.connect(connectionString, function(err, client, done) {
            if (err) {
                console.log(err);
            } else {
                var query = client.query('DELETE FROM time WHERE timeid = $1', [data.timeid]);
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
}); //delete function


router.route('/timebyproj')
    //selecting time by project id only
    .get(function(req, res) {
        firebase.auth().verifyIdToken(req.headers.id_token).then(function(decodedToken) {
          var data = req.query.projId;
            pg.connect(connectionString, function(err, client, done) {
                if (err) {
                    console.log(err);
                } else {
                    var resultsArray = [];
                    var queryResults = client.query('SELECT * FROM time WHERE projid = $1', [data]);
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
    });//router.get

module.exports = router;
