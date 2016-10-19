console.log('sourced');

var myApp = angular.module('myApp', ['ngRoute']);

myApp.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.
  when ('/', {
    templateUrl: "index.html"
  }).
  when ('/addHours', {
    templateUrl: "/views/addHours.html",
    controller: "addHoursController"
  }).
  when ('/adminHome', {
    templateUrl: "views/adminHome.html",
    controller: "adminHomeController"
  }).
  when ('/empManage', {
    templateUrl: "views/empManage.html",
    controller: "empManageController"
  }).
  when ('/reports', {
    templateUrl: "views/reports.html",
    controller: "reportsController"
  }).
  when ('/userHome', {
    templateUrl: "views/userHome.html",
    controller: "userHomeController"
  }).
  otherwise({
    redirectTo: "/userHome"
  });
}]);
