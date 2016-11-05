var bodyParser = require('body-parser');
var router = require('express').Router();
var path = require('path');
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/cimarron-winter';
var firebase = require('firebase');

router.use(bodyParser.urlencoded({
    extended: true
}));

//report get route
router.get('/reports', function(req, res) {
    firebase.auth().verifyIdToken(req.headers.id_token).then(function(decodedToken) {
        console.log('/reports get route hit');
        var objectIn = {
            projectId: req.query.projectId,
            sDate: req.query.sDate,
            eDate: req.query.eDate
        };
        console.log('this is the info sent', objectIn);
        pg.connect(connectionString, function(err, client, done) {
            if (err) {
                console.log(err);
            } else {
                var resultsArray = [];
                var queryResults;

                //object properties expected req.query{userid,projectId,sDate,eDate}

                if (objectIn.username !== undefined && objectIn.sDate !== undefined && objectIn.eDate !== undefined) {
                    console.log('inside if statement reports query');
                    queryResults = client.query('SELECT * FROM time JOIN projects on projid = projectid WHERE projectid = $1 AND time.date >= $2 AND time.date <= $3', [objectIn.projectId, objectIn.sDate, objectIn.eDate]);
                    // console.log('test thing one');
                } else {
                    console.log('inside else statement reports query');
                    queryResults = client.query('SELECT * FROM time JOIN projects on projid = projectid WHERE projectid = $1', [objectIn.projectId]);
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
    }).catch(function(error) {
        console.log(error);
        // If the id_token isn't right, you end up in this callback function
        res.send("Sorry your Auth-Token was incorrect");
    }); //end catch
}); //get active users

//get reports for users
router.get('/reports/date', function(req, res) {
    var objectIn = {
        projectId: req.query.projectId,
        sDate: req.query.sDate,
        eDate: req.query.eDate
    };
    console.log('this is the info sent users', objectIn);
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            console.log(err);
        } else {
            var resultsArray = [];
            var queryResults = client.query('SELECT * FROM time JOIN projects on projid = projectid WHERE projectid = $1 AND time.date >= $2 AND time.date <= $3', [objectIn.projectId, objectIn.sDate, objectIn.eDate]);
            queryResults.on('row', function(row) {
                resultsArray.push(row);
            }); //queryResults on row
            queryResults.on('end', function() {
                return res.send(resultsArray);
            });
        }
    });
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
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            console.log(err);
        } else {
            var resultsArray = [];
            var queryResults = client.query('SELECT * FROM time JOIN projects on projid = projectid WHERE projectid = $1 AND empid = $2 AND time.date >= $3 AND time.date <= $4', [objectIn.projectId, objectIn.empId, objectIn.sDate, objectIn.eDate]);
            queryResults.on('row', function(row) {
                resultsArray.push(row);
            }); //queryResults on row
            queryResults.on('end', function() {
                return res.send(resultsArray);
            });
        }
    });
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
            var queryResults = client.query('SELECT * FROM time JOIN projects on projid = projectid WHERE projectid = $1 AND time.date >= $2 AND time.date <= $3', [objectIn.projectId, objectIn.sDate, objectIn.eDate]);
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
