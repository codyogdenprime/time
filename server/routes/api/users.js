var router = require('express').Router();
var path = require('path');
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/cimarron-winter';
var firebase = require('firebase');

router.route('/users')
    //selecting all users who are not admins from employees table
    .get(function(req, res) {

        firebase.auth().verifyIdToken(req.headers.id_token).then(function(decodedToken) {
            console.log('users get route hit');
            pg.connect(connectionString, function(err, client, done) {
                if (err) {
                    console.log(err);
                } else {
                    var resultsArray = [];
                    var queryResults = client.query('SELECT * FROM employee');
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

//add an employee
.post(function(req, res) {
        firebase.auth().verifyIdToken(req.headers.id_token).then(function(decodedToken) {
            console.log('users post route hit');
            var data = req.body;
            console.log('data which is also req.body', data);
            pg.connect(connectionString, function(err, client, done) {
                if (err) {
                    console.log(err);
                } else {
                    var query = client.query('INSERT INTO employee (empname, isadmin, authid, authpic, authemail) VALUES ($1,$2,$3,$4,$5)', [data.name, data.adminstatus, data.authid, data.authpic, data.authemail]);
                    res.send({
                        success: true
                    });
                } //else bracket
            }); //pg.connect
        }).catch(function(error) {
            console.log(error);
            // If the id_token isn't right, you end up in this callback function
            res.send("Sorry your Auth-Token was incorrect");
        }); //end catch
    }) //post route

//toggle employee isactive or isadmin status
//  to toggle active status, it expects an object with a key of empid and a key of isactive with any value
//  to toggle user as an admin, it expects an object with a key of empid and a key of isadmin with any value
.put(function(req, res) {
    firebase.auth().verifyIdToken(req.headers.id_token).then(function(decodedToken) {
        console.log('put route');
        var data = req.body;
        console.log(data, 'DATAAAAA');
        pg.connect(connectionString, function(err, client, done) {
            if (err) {
                console.log(err);
            } else {
                switch (data.type) {
                    //toggle isactive
                    case 'activeStatus':
                        client.query('UPDATE employee SET isactive = NOT isactive WHERE empid = $1', [data.empid]);
                        res.send({
                            success: true
                        })(202);
                        break;
                        //toggle isadmin
                    case 'adminStatus':
                        client.query('UPDATE employee SET isadmin = NOT isadmin WHERE empid = $1', [data.empid]);
                        res.send({
                            success: true
                        });
                        break;
                    default:
                        console.log('critical switch failure');
                } //end switch
            } //else
        }); //pg.connect
    }).catch(function(error) {
        console.log(error);
        // If the id_token isn't right, you end up in this callback function
        res.send("Sorry your Auth-Token was incorrect");
    }); //end catch
}); //.put route

//get users who are admins
router.get('/users/admin', function(req, res) {
    firebase.auth().verifyIdToken(req.headers.id_token).then(function(decodedToken) {
        console.log('users/admin get route hit');
        pg.connect(connectionString, function(err, client, done) {
            if (err) {
                console.log(err);
            } else {
                var resultsArray = [];
                var queryResults = client.query('SELECT * FROM employee WHERE isadmin = true');
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
}); //get admin users

//get users who are active
router.get('/users/active', function(req, res) {
    firebase.auth().verifyIdToken(req.headers.id_token).then(function(decodedToken) {
        console.log('users/active get route hit');
        pg.connect(connectionString, function(err, client, done) {
            if (err) {
                console.log(err);
            } else {
                var resultsArray = [];
                var queryResults = client.query('SELECT * FROM employee WHERE isactive = true');
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

}); //get inactive users
router.get('/users/inactive', function(req, res) {
    firebase.auth().verifyIdToken(req.headers.id_token).then(function(decodedToken) {
        console.log('users/inactive get route hit');
        pg.connect(connectionString, function(err, client, done) {
            if (err) {
                console.log(err);
            } else {
                var resultsArray = [];
                var queryResults = client.query('SELECT * FROM employee WHERE isactive = false');
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

router.post('/users/verify', function(req, res) {
    firebase.auth().verifyIdToken(req.headers.id_token).then(function(decodedToken) {
        console.log('users/verify get route hit');
        pg.connect(connectionString, function(err, client, done) {
            if (err) {
                console.log(err);
            } else {
                var resultsArray = [];
                var objectIn = {
                    name: req.body.name,
                    adminstatus: false,
                    activestatus: true,
                    authpic: req.body.pic,
                    authemail: req.body.email,
                    userId: req.body.id
                };

                var queryResults = client.query('SELECT * FROM employee WHERE authid = $1', [objectIn.userId]);


                queryResults.on('row', function(row) {
                    resultsArray.push(row);
                }); //on row function
                queryResults.on('end', function() {
                    if (resultsArray.length === 0) {
                        pg.connect(connectionString, function(err, client, done) {
                            var resultsArray1 = [];
                            var query = client.query('INSERT INTO employee (empname, isadmin, isactive, authid, authpic, authemail) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *', [objectIn.name, objectIn.adminstatus, objectIn.activestatus, objectIn.userId, objectIn.authpic, objectIn.authemail]);
                            query.on('row', function(row) {
                                resultsArray1.push(row);
                            }); //query on row function
                            query.on('end', function() {
                                console.log('resultsArray1', resultsArray1);
                                done();
                                return res.send(resultsArray1);
                            }); //.on end function
                        }); //queryResults on end function
                    } else if (resultsArray.length > 0) {
                        console.log('resultsArray again >>>>>>>', resultsArray);
                        done();
                        return res.send(resultsArray);
                    } // nested else if
                }); //on end function
            } //else
        }); //pg.connect
    }).catch(function(error) {
        console.log(error);
        // If the id_token isn't right, you end up in this callback function
        res.send("Sorry your Auth-Token was incorrect");
    }); //end catch
}); //verify get call

//search users by project using join table
router.get('/users/byProject', function(req, res) {
    var verbose = true;
    firebase.auth().verifyIdToken(req.headers.id_token).then(function(decodedToken) {
        var data = req.query;
        console.log('users/byProject get route hit');
        pg.connect(connectionString, function(err, client, done) {
            if (err) {
                console.log(err);
            } else {
                var resultsArray = [];
                if (verbose) console.log('this is the req.query', data);
                var tester = 'SELECT * FROM employee JOIN emp_proj ON empid=emp_id WHERE project_id = ' + data.projectId;
                if (verbose) console.log('---------=============', tester + '!!!!!!!!!!!!!!!!!!!!');
                var queryResults = client.query(tester);
                if (verbose) console.log('queryResults:', queryResults);
                if (verbose) console.log('after!!!!!');
                queryResults.on('row', function(row) {
                    if (verbose) console.log('in!!!!!');
                    resultsArray.push(row);
                }); //on row function
                queryResults.on('end', function() {
                    if (verbose) console.log('end!!!!!');
                    return res.send(resultsArray);
                }); //on end function
            } //else
        }); //pg.connect
    }).catch(function(error) {
        console.log(error);
        // If the id_token isn't right, you end up in this callback function
        res.send("Sorry your Auth-Token was incorrect");
    }); //end catch
}); //users by project get call

module.exports = router;
