myApp.controller('empManageController', ['$scope', '$http', 'factory', function ($scope, $http, factory){
  console.log('in empManageController');

  $scope.allEmployees = [];

  // $scope.getAllEmployees = function () {
  //   firebaseUser.getToken().then(function () {
  //     factory.getAllEmployees().then(function (results) {
  //       $scope.allEmployees = results.data;
  //       console.log($scope.allEmployees);
  //     });
  //   });
  // };


  // $scope.getAllEmployees();

}]);
