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

    $scope.userProject = function(selUserProject){
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
            ///this gets
            var empId = userUID;
            // var projId = $scope.selUserProject.projectid;
            factory.getMyTimeForThisProject(empId, projId).then(function(results) {
                console.log(results, 'if not admin');
            }); //end factory get
        } //end else
    }; //end run report

    $scope.userStatus = function() {
        //if user is  admin hide
        if (userProfile.isadmin === true) {
            $scope.selectEmp = false;
            $scope.clientSelect = false;
        } else {
            //if user IS NOT admin show forms
            $scope.selectEmp = true;
            $scope.clientSelect = true;
        }
    };



    //this exports to CSV! see html for more
    $scope.exportCSV = function() {
        factory.getAllEmployees().then(function(results) {
            console.log(results.data, 'employees for CSVVVVVV');
            var data = results.data;
            alasql.promise('SELECT * INTO XLSX("my4.xlsx", {headers:TRUE, quote:FALSE})FROM ?', [data])
                .then(function() {
                    console.log('DATA SAVED');
                }).catch(function(err) {
                    console.log('ERROR', err);
                }); //end catch
        }); //end factory
    }; //end scope
    $scope.init();
}]);
