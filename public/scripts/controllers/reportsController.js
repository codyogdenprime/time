myApp.controller('reportsController', ['factory', '$scope', '$http', '$location', function(factory, $scope, $http, $location) {
    console.log('in reportsController');
    $scope.allClients = [];

    // get all clients
    $scope.init = function() {
        console.log('in get clients ');
        factory.getAllClients().then(function(results) {
            console.log(results.data);
            $scope.allClients = results.data;
        });
    };
    $scope.client = function(selectedClient){
      console.log(selectedClient.clientid,'clientid');
      var objectToSend = {
        cID: selectedClient.clientid
      };
      var id = $scope.selectedClient.clientid;
      console.log(objectToSend, 'send this');
      console.log(id,'ididi');
      factory.getClientProjects(id,objectToSend).then(function(results){
          console.log(results.data, 'client projects');
      });
    };

    // get all projects
    //

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
