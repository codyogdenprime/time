myApp.controller('empManageController', ['$scope', '$http', 'factory', function ($scope, $http, factory){
  console.log('in empManageController');

  $scope.allEmployees = [];

  //get all employees WHERE isadmin = false
  //happens on page load feel free to change.....
  $scope.init = function () {
    factory.getAllEmployees().then(function (results) {
     $scope.allEmployees = results.data;
     console.log($scope.allEmployees);
    });
  };

$scope.empStatus = function(){
  
};

$scope.init();

}]);
