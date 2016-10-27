myApp.controller('userHomeController', ['$scope', '$http', 'factory', function ($scope, $http, factory){
  console.log('in userHomeController');

  $scope.allMyProjects = [];
  $scope.allMyTime = [];

  var userUID = sessionStorage.getItem('userGoogleId');
  var userDisplayName = sessionStorage.getItem('userDisplayName');
  var userPhotoURL = sessionStorage.getItem('userPhotoUrl');

  //get all projects for the user
  $scope.getMyProjects = function () {
    factory.getMyProjects(userUID).then(function (results) {
     $scope.allMyProjects = results.data;
    });
  };
  //
  // //if project is clicked get time for that projects
  $scope.getAllTime = function (project) {
    console.log('in getAllTime click');
    factory.getAllMyTime(project).then(function (results) {
      $scope.allMyTime = results.data;
    });
  };
  //add new time
  $scope.newTime = function (projectId, empid) {
    var objectToSend = {
      date: '16-5-6',//$scope.timeDate,
      hours: 4, //$scope.timeHours,
      description: 'none', //$scope.timeDescription,
      projectid: projectId,
      empid: empid
    };//end object

    factory.addTime(objectToSend).then(function () {
      console.log('new time worked!');
    });
  };

  $scope.getMyProjects();

  //$scope.checkUserDB(userUID, userDisplayName, userPhotoURL);
  //$scope.newTime(2, 4);
  //$scope.getMyProjects(2);
  //$scope.getAllTime(2);
}]);
