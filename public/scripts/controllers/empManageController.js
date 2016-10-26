myApp.controller('empManageController', ['$scope', '$http', 'factory', function($scope, $http, factory) {
    console.log('in empManageController');

    $scope.allEmployees = [];


    //get all employees WHERE isadmin = false
    //happens on page load feel free to change.....
    $scope.init = function() {
        factory.getAllEmployees().then(function(results) {
            $scope.allEmployees = results.data;
            console.log($scope.allEmployees);
        });
    };

    //get emp status
    $scope.empStatus = function() {
      //grab data from user empId and isactive or isadmin 
        var objectToSend = {
          id: 16,
          type: 'isadmin'
        };
        factory.changeIsAdmin(objectToSend).then(function(results){
          console.log(results);
        });
    };

    $scope.init();

}]);
