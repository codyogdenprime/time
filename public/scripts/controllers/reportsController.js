myApp.controller('reportsController', ['factory', '$scope', '$http', '$location', function(factory, $scope, $http, $location) {
    console.log('in reportsController');

    //global arrays
    $scope.allClients = [];
    $scope.allClientProjects = [];
    $scope.usersOnProject = [];
    var clientid,
    projectId,
    empId;

    //CHECK ADMIN STATUS ?

    // get all clients
    $scope.init = function() {
        factory.getAllClients().then(function(results) {
            $scope.allClients = results.data;
        }); //get all clients
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

    //get selected user from DOM
    $scope.user = function(selectedUser) {
        var empId = $scope.selectedUser.empid;
        console.log(empId);
    };

    //run report
    $scope.runReport = function() {
        console.log($scope.selectedUser.empid, $scope.selectedProject.projectid, $scope.selectedClient.clientid);
        var projid = $scope.selectedProject.projectid;
        var empid = $scope.selectedUser.empid;
        factory.getTime(projid,empid).then(function(results){
          console.log(results,'run report');
        });
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
