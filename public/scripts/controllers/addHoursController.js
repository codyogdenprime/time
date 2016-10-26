myApp.controller('addHoursController', ['$scope', '$http','factory', function ($scope, $http,factory){
  console.log('in addHoursController');

  $scope.editTime = function (type, value, id) {
    console.log('in editTime');
    factory.editTime(type, value, id);
  };//scope.editTime

$scope.editTime('empid','3',2);
}]);//addHoursController
