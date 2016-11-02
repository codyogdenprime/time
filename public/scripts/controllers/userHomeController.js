myApp.constant('moment', moment);

var app = angular.module("app", ["xeditable"]);


myApp.controller('userHomeController', ['$scope', '$http', 'factory', 'moment', function($scope, $http, factory, moment) {
    console.log('in userHomeController');


  $scope.allMyProjects = [];
  $scope.allMyTime = [];
  $scope.myCurrentProject = '';

  // var a = moment('2016-01-01');
  // var b = a.add(1, 'week');
  // a.format();
  // console.log(a);

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
  $scope.newTime = function () {
    var objectToSend = {
      date: $scope.dateInputModel,
      hours: $scope.timeInputModel,
      description: $scope.descriptionInputModel,
      projectid: $scope.myCurrentProject.projectid,
      empid: userUID
    };//end object
    console.log('in newTime', objectToSend);

        factory.addTime(objectToSend).then(function() {
            console.log('new time worked!');
            $scope.getMyTimeForThisProject();
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
    factory.getMyTimeForThisProject(userUID, $scope.myCurrentProject.projectid).then(function (response) {
      $scope.allMyTime = response.data;
      $scope.allMyTime = $scope.allMyTime.map(function (index) {
        console.log(index);
        var m = moment(index.date).format('M/D/YY');
        console.log(m);
        return ({timeid: index.timeid , date: m, hours: index.hours , description: index.description , empid: index.empid});
      });
      console.log('in getMyTimeForThisProject', response, $scope.allMyTime);
      $scope.addAllHours();
    });
  };

  $scope.deleteTimeEntry = function(timeId) {
      console.log('in deleteTimeEntry', timeId);
      factory.deleteTimeEntry(timeId).then(function () {
        $scope.getMyTimeForThisProject();
        console.log($scope.myCurrentProject);
      });
      //rerun get all time
  };

  $scope.addAllHours = function () {
    $scope.allHoursAdded = 0;
    for (var i = 0; i < $scope.allMyTime.length; i++) {
      console.log(Number($scope.allMyTime[i].hours));
      $scope.allHoursAdded += Number($scope.allMyTime[i].hours);
    }
    console.log('added all hours:', $scope.allHoursAdded);
  };

  //this exports to CSV! see html for more
  $scope.exportCSV = function() {
          var data = $scope.allMyTime;
          alasql.promise('SELECT * INTO XLSX("my4.xlsx", {headers:TRUE, quote:FALSE})FROM ?', [data])
              .then(function() {
                  console.log('DATA SAVED');
              }).catch(function(err) {
                  console.log('ERROR', err);
              }); //end catch
  }; //end scope

  $scope.getMyProjects();

    //$scope.checkUserDB(userUID, userDisplayName, userPhotoURL);
    //$scope.newTime(2, 4);
    //$scope.getMyProjects(2);
    //$scope.getAllTime(2);
}]);
