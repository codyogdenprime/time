myApp.controller('userHomeController', ['$scope', '$http', 'factory', 'authFactory', function($scope, $http, factory, authFactory) {
    console.log('in userHomeController');

  $scope.allMyProjects = [];
  $scope.allMyTime = [];
  $scope.myCurrentProject = '';

    var userUID = sessionStorage.getItem('userGoogleId');
    var userDisplayName = sessionStorage.getItem('userDisplayName');
    var userPhotoURL = sessionStorage.getItem('userPhotoUrl');

  //get all projects for the user
  $scope.getMyProjects = function () {
    factory.getMyProjects(userUID).then(function (results) {
     $scope.allMyProjects = results.data;
     console.log('allMyProjects', $scope.allMyProjects);
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


        factory.addTime(objectToSend).then(function() {
            console.log('new time worked!');
        });
    };

  $scope.showProject = function () {
    console.log('in showProject');
    console.log(this.project);
    $scope.myCurrentProject = this.project;
    $scope.getMyTimeForThisProject();
    //console.log($scope.myCurrentProject);
    console.log('jquery projects', $('.projects'));
    $('.projects').fadeOutToLeft(function() {
        $('.single-project').fadeInFromRight();
    });
  };

  $scope.showProjects = function () {
    console.log('in showProjects');
    $('.single-project').fadeOutToRight(function() {
        $('.projects').show();
        $('.projects').fadeInFromLeft();
    });
  };

  $scope.getMyTimeForThisProject = function () {
    console.log('in getMyTimeForThisProject');
    authFactory.getUserInfo().
    factory.getMyTimeForThisProject(userUID, $scope.myCurrentProject.projectid);
  };

  $scope.getMyProjects();

    //$scope.checkUserDB(userUID, userDisplayName, userPhotoURL);
    //$scope.newTime(2, 4);
    //$scope.getMyProjects(2);
    //$scope.getAllTime(2);
}]);
