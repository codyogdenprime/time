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
        //get all Active employees including Admin's 
        factory.getActiveEmp().then(function(results){
          $scope.allActiveEmp = results.data;
          console.log($scope.allActiveEmp, 'All Active Emp');
        });
    };

    //set emp status active/admin
    $scope.empStatus = function() {
        //grab data from user empId and isactive or isadmin
        //if checked send adminstatus //if toggles green send activeStatus black activeStatus
        var objectToSend = {
            empid: 16, //of selected employee
            type: 'adminStatus' // set to activeStatus or adminStatus based on whats selected
        };
        //send object to factory http call
        factory.changeIsAdmin(objectToSend).then(function(results) {
            console.log(results);
        });
    };
    //run on page load
    $scope.init();

}]);
