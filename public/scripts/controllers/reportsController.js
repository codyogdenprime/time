myApp.controller('reportsController', ['factory', '$scope', '$http', '$location', function(factory, $scope, $http, $location) {
    console.log('in reportsController');
    $scope.allClients = [];
    $scope.allClientProjects = [];
    $scope.usersOnProject = [];

    // get all clients
    $scope.init = function() {
        factory.getAllClients().then(function(results) {
            $scope.allClients = results.data;
        }); //get all clients
    }; //end scope dot init

    //get all projects based on selected client from above function
    $scope.client = function(selectedClient) {
        var id = $scope.selectedClient.clientid;
        factory.getClientProjects(id).then(function(results) {
            $scope.allClientProjects = results.data;
        }); //end get client projects by client_id
    }; //end scope dot client

    //this should only show if admin = true
    $scope.project = function(selectedProject) {
        var projectId = $scope.selectedProject.projectid;
        factory.getProjectUsers(projectId).then(function(results) {
            $scope.usersOnProject = results.data;
        }); //end get project users
    }; //end scope people on project





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
