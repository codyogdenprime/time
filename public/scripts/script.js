console.log('sourced');

var myApp = angular.module('myApp', ['ngRoute','firebase']);

myApp.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.
  when ('/', {
    templateUrl: "/views/dash.html"
  }).
  when ('/addHours', {
    templateUrl: "/views/addHours.html",
    controller: "addHoursController",
    resolve: {
          // controller will not be loaded until $waitForSignIn resolves
          "firebaseUser": function($firebaseAuthService) {
            return $firebaseAuthService.$requireSignIn();
          }
        }
  }).
  when ('/adminHome', {
    templateUrl: "views/adminHome.html",
    controller: "adminHomeController",
    resolve: {
          // controller will not be loaded until $waitForSignIn resolves
          "firebaseUser": function($firebaseAuthService) {
            return $firebaseAuthService.$requireSignIn();
          }
        }
  }).
  when ('/empManage', {
    templateUrl: "views/empManage.html",
    controller: "empManageController",
    resolve: {
          // controller will not be loaded until $waitForSignIn resolves
          "firebaseUser": function($firebaseAuthService) {
            return $firebaseAuthService.$requireSignIn();
          }
        }
  }).
  when ('/reports', {
    templateUrl: "views/reports.html",
    controller: "reportsController",
    resolve: {
          // controller will not be loaded until $waitForSignIn resolves
          "firebaseUser": function($firebaseAuthService) {
            return $firebaseAuthService.$requireSignIn();
          }
        }
  }).
  when ('/userHome', {
    templateUrl: "views/userHome.html",
    controller: "userHomeController",
    resolve: {
          // controller will not be loaded until $waitForSignIn resolves
          "firebaseUser": function($firebaseAuthService) {
            return $firebaseAuthService.$requireSignIn();
          }
        }
  }).
  otherwise({
    redirectTo: "/userHome"
  });
}]);
