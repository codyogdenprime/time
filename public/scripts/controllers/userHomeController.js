myApp.controller('userHomeController', ['$scope', '$http', 'factory', function ($scope, $http, factory){
  console.log('in userHomeController');

  $scope.allMyProjects = [];
  $scope.allMyTime = [];

  var userUID = sessionStorage.getItem('userGoogleId');
  var userDisplayName = sessionStorage.getItem('userDisplayName');
  var userPhotoURL = sessionStorage.getItem('userPhotoUrl');


  $scope.checkUserDB = function (id, name, photo) {
    factory.checkUserDB(id, name, photo);
    //.then(function (results) {
      console.log(results);
    //   if(results){
    //     //if user get all user projects
    //   }else if{
    //     //if not user, user setup, get projects, if no projects none assigned
    //   }else{
    //     //if admin, get projects, change view to admin view
    //   }

    //});
    $scope.getMyProjects(id);
    $scope.getAllTime();
  };
  //get all projects for the user
  $scope.getMyProjects = function (arg) {
    factory.getMyProjects(arg).then(function (results) {
     $scope.allMyProjects = results.data;
    });
  };

  //if project is clicked get time for that projects
  $scope.getAllTime = function (project) {
    console.log('in getAllTime click');
    factory.getAllTime(project).then(function (results) {
      $scope.allMyTime = results.data;
    });
  };
  //---------------------------------------------------------FINISH
  $scope.newTime = function (projectId) {
    var objectToSend = {
      date: $scope.timeDate,
      hours: $scope.timeHours,
      description: $scope.timeDescription,
      projectid: projectId
    };//end object
  };

  $scope.checkUserDB(userUID, userDisplayName, userPhotoURL);


}]);
