
myApp.constant('moment', moment);

myApp.controller('reportsController', ['factory','authFactory', '$scope', '$http', '$location','$filter', function(factory, authFactory,$scope, $http, $location, $filter) {

    console.log('in reportsController');

    //global arrays
    $scope.allClients = [];
    $scope.allClientProjects = [];
    $scope.usersOnProject = [];
    $scope.reports = [];


    $scope.userProfile = authFactory.get_user();
    console.log($scope.userProfile, 'in reports');
    //CHECK ADMIN STATUS ?

    // get all clients
    $scope.init = function(isadmin) {
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
        $scope.addAllHours();
    }; //end scope people on project

    //get selected user from DOM
    $scope.user = function(selectedUser) {
        var empId = $scope.selectedUser.empid;
        console.log(empId);
    };
    $scope.addAllHours = function(){
      $scope.addAllHoursAdded = 0;
      for (var i = 0; i < $scope.selectedProject.length; i++) {
        console.log(Number($scope.selectedProject[i].hours));
        $scope.allHoursAdded += Number($scope.selectedProject[i].hours);
      }
      console.log('ADDDDDDDDD', $scope.allHoursAdded);
    };

    //run report
    $scope.runReport = function() {
        console.log($scope.selectedUser.empid, $scope.selectedProject.projectid, $scope.selectedClient.clientid);
        var projid = $scope.selectedProject.projectid;
        var empid = $scope.selectedUser.empid;
        factory.getMyTimeForThisProject(projid,empid).then(function(results){
          $scope.reports = results.data;
          console.log($scope.reports, ' reports');
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
