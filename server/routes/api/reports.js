 var bodyParser = require('body-parser');
var router = require('express').Router();
var path = require('path');
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/cimarron-winter';
var firebase = require('firebase');
var checkDataType = require('../modules/dataType');

router.use(bodyParser.urlencoded({
    extended: true
}));

//report get route
router.get('/reports', function(req, res) {
    firebase.auth().verifyIdToken(req.headers.id_token).then(function(decodedToken) {
        // console.log('/reports get route hit');
        var objectIn = {
            projectId: req.query.projectId,
            sDate: req.query.sDate,
            eDate: req.query.eDate
        };
        console.log('this is the info sent', objectIn);
        if(checkDataType('number',[objectIn.projectId])){
        pg.connect(connectionString, function(err, client, done) {
            if (err) {
                console.log(err);
            } else {
                var resultsArray = [];
                var queryResults;

                //object properties expected req.query{userid,projectId,sDate,eDate}

                if (objectIn.username !== undefined && objectIn.sDate !== undefined && objectIn.eDate !== undefined) {
                    console.log('inside if statement reports query');
                    queryResults = client.query('SELECT * FROM time JOIN projects on projid = projectid WHERE projectid = $1 AND time.date >= $2 AND time.date <= $3', [objectIn.projectId, objectIn.sDate, objectIn.eDate], function(err, response){
                      if(err){
                        console.log(err.message);
                        done();
                        res.send({success:false, error:err.message});
                      }//if err
                    });//client.query);
                    // console.log('test thing one');
                } else {
                    console.log('inside else statement reports query');
                    queryResults = client.query('SELECT * FROM time JOIN projects on projid = projectid WHERE projectid = $1', [objectIn.projectId], function(err, response){
                      if(err){
                        console.log(err.message);
                        done();
                        res.send({success:false, error:err.message});
                      }//if err
                    });//client.query);
                    // console.log('test thing three');
                }
                queryResults.on('row', function(row) {
                    resultsArray.push(row);
                }); //on row function
                queryResults.on('end', function() {
                    done();
                    return res.send(resultsArray);
                }); //on end function
            } //else
        }); //pg.connect
      }else {
        res.send({
          success: false
        });
      }
    }).catch(function(error) {
        console.log(error);
        // If the id_token isn't right, you end up in this callback function
        res.send("Sorry your Auth-Token was incorrect");
    }); //end catch
}); //get active users

//get reports for users
router.get('/reports/date', function(req, res) {
    var objectIn = {
        empid: req.query.empid,
        projectId: req.query.projectId,
        sDate: req.query.sDate,
        eDate: req.query.eDate
    };
    console.log('this is the info sent users', objectIn);
    if(checkDataType('number',[objectIn.projectId, objectIn.empid]) && checkDataType('string',[objectIn.sDate,objectIn.eDate])){
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            console.log(err);
        } else {
            var resultsArray = [];
            var queryResults = client.query('SELECT * FROM time JOIN projects on projid = projectid WHERE projectid = $1 AND time.date >= $2 AND time.date <= $3 AND empid = $4', [objectIn.projectId, objectIn.sDate, objectIn.eDate, objectIn.empid], function(err, response){
              if(err){
                console.log(err.message);
                done();
                res.send({success:false, error:err.message});
              }//if err
            });//client.query);
            queryResults.on('row', function(row) {
                resultsArray.push(row);
            }); //queryResults on row
            queryResults.on('end', function() {
                return res.send(resultsArray);
            });
        }
    });//pg connect
  }else {
    res.send({
      success: false
    });
  }
}); //end get

//get reports for admins
router.get('/reports/admin', function(req, res) {
  console.log(req.query,'admin query ');
    var objectIn = {
        empId: req.query.empId,
        projectId: req.query.projectId,
        sDate: req.query.sDate,
        eDate: req.query.eDate
    };
    console.log('this is the info sent admin', objectIn);
    if(checkDataType('number',[objectIn.projectId,objectIn.empId]) && checkDataType('string',[objectIn.sDate,objectIn.eDate])){

    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            console.log(err);
        } else {
            var resultsArray = [];
            var queryResults = client.query('SELECT time.timeid, time.date, time.hours, time.description, employee.empname FROM time JOIN projects ON projid = projectid JOIN employee ON time.empid = employee.empid WHERE projects.projectid = $1 AND time.empid = $2 AND time.date >= $3 AND time.date <= $4', [objectIn.projectId, objectIn.empId, objectIn.sDate, objectIn.eDate], function(err, response){
              if(err){
                console.log(err.message);
                done();
                res.send({success:false, error:err.message});
              }//if err
            });//client.query);
            queryResults.on('row', function(row) {
                resultsArray.push(row);
            }); //queryResults on row
            queryResults.on('end', function() {
                return res.send(resultsArray);
            });//on end function
        }//else
    });//pg connect
  }else {
    res.send({
      success: false
    });
  }
}); //end get

//get reports for admins
router.get('/reports/adminNoEmp', function(req, res) {
  console.log(req.query,'admin query ');
    var objectIn = {
        projectId: req.query.projectId,
        sDate: req.query.sDate,
        eDate: req.query.eDate
    };
    console.log('this is the info sent admin', objectIn);
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            console.log(err);
        } else {
            var resultsArray = [];
            var queryResults = client.query('SELECT time.timeid, time.date, time.hours, time.description, employee.empname FROM time JOIN projects ON projid = projectid JOIN employee ON time.empid = employee.empid WHERE projects.projectid = $1 AND time.date >= $2 AND time.date <= $3;', [objectIn.projectId, objectIn.sDate, objectIn.eDate], function(err, response){
              if(err){
                console.log(err.message);
                done();
                res.send({success:false, error:err.message});
              }//if err
            });//client.query);
            queryResults.on('row', function(row) {
                resultsArray.push(row);
            }); //queryResults on row
            queryResults.on('end', function() {
                return res.send(resultsArray);
            });
        }
    });
}); //end get


router.get('/reports/all', function(req, res) {
  console.log(req.query,'admin query ');
        var clientid = req.query.clientid;
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            console.log(err);
        } else {
            var resultsArray = [];
            var queryResults = client.query('SELECT time.timeid, time.date, time.hours, time.description, employee.empname FROM time JOIN projects ON projid = projectid JOIN employee ON time.empid = employee.empid WHERE client_id = $1', [clientid], function(err, response){
              if(err){
                console.log(err.message);
                done();
                res.send({success:false, error:err.message});
              }//if err
            });//client.query);
            queryResults.on('row', function(row) {
                resultsArray.push(row);
            }); //queryResults on row
            queryResults.on('end', function() {
                return res.send(resultsArray);
            });
        }
    });
}); //end get

//get all time based on dates and emp id
router.get('/reports/allTime', function(req, res) {
  console.log(req.query,'admin query ');
    var objectIn = {
        empid: req.query.emp_id,
        sDate: req.query.s_Date,
        eDate: req.query.e_Date
    };
    console.log('this is the info sent admin', objectIn);
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            console.log(err);
        } else {
            var resultsArray = [];
            var queryResults = client.query('SELECT * FROM time WHERE empid = $1 AND time.date >= $2 AND time.date <= $3', [objectIn.empid, objectIn.sDate, objectIn.eDate], function(err, response){
              if(err){
                console.log(err.message);
                done();
                res.send({success:false, error:err.message});
              }//if err
            });//client.query);
            queryResults.on('row', function(row) {
                resultsArray.push(row);
            }); //queryResults on row
            queryResults.on('end', function() {
                return res.send(resultsArray);
            });
        }
    });
}); //end get

//get all time base on client id and date's
router.get('/reports/allTimeClient', function(req, res) {
  console.log(req.query,'admin query ');
    var objectIn = {
        client_id: req.query.clientid,
        sDate: req.query.sDate,
        eDate: req.query.eDate
    };
    console.log('this is the info sent admin', objectIn);
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            console.log(err);
        } else {
            var resultsArray = [];
            var queryResults = client.query('SELECT * FROM projects JOIN time on projectid = projid  WHERE client_id = $1 AND time.date >= $2 AND time.date <= $3', [objectIn.client_id, objectIn.sDate, objectIn.eDate], function(err, response){
              if(err){
                console.log(err.message);
                done();
                res.send({success:false, error:err.message});
              }//if err
            });//client.query);
            queryResults.on('row', function(row) {
                resultsArray.push(row);
            }); //queryResults on row
            queryResults.on('end', function() {
                return res.send(resultsArray);
            });
        }
    });
}); //end get
module.exports = router;
