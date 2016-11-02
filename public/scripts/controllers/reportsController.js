myApp.constant('moment', moment);
myApp.controller('reportsController', ['factory', 'authFactory', '$scope', '$http', '$location', function(factory, authFactory, $scope, $http, $location) {
    console.log('in reportsController');

    //global arrays
    $scope.allClients = [];
    $scope.allClientProjects = [];
    $scope.usersOnProject = [];
    $scope.reports = [];
    $scope.userProjects = [];

    //get user status
    var userProfile = authFactory.get_user();
    console.log(userProfile.isadmin);
    var userUID = sessionStorage.getItem('userGoogleId');
    var userDisplayName = sessionStorage.getItem('userDisplayName');
    var userPhotoURL = sessionStorage.getItem('userPhotoUrl');

    //display date pickers for start and end dates
    $(function() {
        $("#datepicker").datepicker();
    });
    $(function() {
        $("#datepicker1").datepicker();
    });

    // get all clients
    $scope.init = function() {
        factory.getAllClients().then(function(results) {
            $scope.allClients = results.data;
        }); //get all clients
        if (userProfile.isadmin === false) {
            var empid = userProfile.empid;
            factory.getUserProjects(empid).then(function(results) {
                console.log(results, 'if not admin get projects for current user');
                $scope.userProjects = results.data;
            });
        }
        $scope.userStatus();
    }; //end scope dot init

    //get all projects based on selected client from above function
    $scope.client = function(selectedClient) {
        var clientid = $scope.selectedClient.clientid;
        factory.getClientProjects(clientid).then(function(results) {
            $scope.allClientProjects = results.data;
        }); //end get client projects by client_id
    }; //end scope dot client


    //*********** this should only show if admin = true ************************
    //get user for project selected from above function
    $scope.project = function(selectedProject) {
        var projectId = $scope.selectedProject.projectid;
        factory.getProjectUsers(projectId).then(function(results) {
            $scope.usersOnProject = results.data;
        }); //end get project users
    }; //end scope people on project

    //this gets project
    $scope.userProject = function(selUserProject) {
        var selProjectid = $scope.selUserProject.projectid;
        console.log(selProjectid, 'reportsssssss');
    };

    //get selected user from DOM
    $scope.user = function(selectedUser) {
        var empId = $scope.selectedUser.empid;
        console.log(empId);
    };

    //run report
    $scope.runReport = function() {
        $scope.srcByProject();
        if (userProfile.isadmin === true) {
            //this will get reports for selected user from drop down list -- only for admins
            console.log($scope.selectedUser.empid, $scope.selectedProject.projectid, $scope.selectedClient.clientid);
            var projid = $scope.selectedProject.projectid;
            var empid = $scope.selectedUser.empid;
            factory.getTimebyselected(empid, projid).then(function(results) {
                $scope.reports = results.data;
                console.log($scope.reports, ' reports');
            }); //end factory get
        } else {
            ///this gets projects based on currently logged in user
            var empId = userUID;
            var projId = $scope.selUserProject.projectid;
            factory.getMyTimeForThisProject(empId, projId).then(function(results) {
                console.log(results, 'if not admin');
                $scope.reports = results.data;
                $scope.reports = $scope.reports.map(function(index) {
                    console.log(index, 'index');
                    var m = moment(index.date).format('M/D/YYYY');
                    console.log(m);
                    return ({
                        timeid: index.timeid,
                        date: m,
                        hours: index.hours,
                        description: index.description,
                        empid: index.empid
                    });
                });
                console.log($scope.reports);
                $scope.addHours();
            }); //end factory get
        } //end else

        //     var empId =  $scope.selectedUser.empid;
        //     var projectId = $scope.selectedProject.projectid;
        //     var sDate = $scope.startDate;
        //     var eDate = $scope.endDate;
        //
        //
        // factory.getReports(empId,projectId,sDate,eDate).then(function(results){
        //   console.log(results, 'reports results');
        //   $scope.reports = results.data;
        // });
    }; //end run report

    //search for all times on a project - only for admin
    $scope.srcByProject = function() {
        if (userProfile.isadmin === true) {
            var projId = $scope.selectedProject.projectid;
            factory.getTimeByProj(projId).then(function(results) {
                console.log(results.data, 'proj only search');
                $scope.reports = results.data;
            }); //end factory
        } //end if admin
    }; //end scope src by project


    $scope.userStatus = function() {
        //if user is  admin hide
        if (userProfile.isadmin === true) {
            $scope.selectEmp = false;
            $scope.clientSelect = false;
        } else {
            //if user IS NOT admin show forms
            $scope.selectEmp = true;
            $scope.clientSelect = true;
        } //end else
    }; //end scope.userStatus

    $scope.addHours = function() {
        $scope.addAllHours = 0;
        for (var i = 0; i < $scope.reports.length; i++) {
            $scope.addAllHours += Number($scope.reports[i].hours);
        } //end for loop
    }; //scope add hours

    //this exports to CSV! see html for more
    $scope.exportCSV = function() {
        var data = $scope.reports;
        var projectName = $scope.selUserProject.projectname; // Project Name from Scope
        var filename = projectName.replace(/\s+/g, '-').toLowerCase(); // Replace spaces with dash, force lowercase
        alasql.promise('SELECT * INTO XLSX("' + filename + '-hours.xlsx", {headers:TRUE, quote:FALSE})FROM ?', [data])
            .then(function() {
                console.log('DATA SAVED');
            }).catch(function(err) {
                console.log('ERROR', err);
            }); //end catch
    }; //end scope
    $scope.init();
}]);
