console.log('sourced');

var myApp = angular.module('myApp', ['ngRoute', 'firebase']);

myApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
    when('/', {
        templateUrl: "/views/dash.html"
    }).
    when('/addHours', {
        templateUrl: "/views/addHours.html",
        controller: "addHoursController",
        resolve: {
            // controller will not be loaded until $requireSignIn resolves
            "firebaseUser": function($firebaseAuthService) {
                return $firebaseAuthService.$requireSignIn();
            }
        }
    }).
    when('/manageProjects', {
        templateUrl: "views/manageProjects.html",
        controller: "manageProjectsController",
        resolve: {
            "firebaseUser": function($firebaseAuthService) {
                return $firebaseAuthService.$requireSignIn();
            }
        }
    }).
    when('/empManage', {
        templateUrl: "views/empManage.html",
        controller: "empManageController",
        resolve: {
            "firebaseUser": function($firebaseAuthService) {
                return $firebaseAuthService.$requireSignIn();
            }
        }
    }).
    when('/reports', {
        templateUrl: "views/reports.html",
        controller: "reportsController",
        resolve: {
            "firebaseUser": function($firebaseAuthService) {
                return $firebaseAuthService.$requireSignIn();
            }
        }
    }).
    when('/userHome', {
        templateUrl: "views/userHome.html",
        controller: "userHomeController",
        resolve: {
            "firebaseUser": function($firebaseAuthService) {
                return $firebaseAuthService.$requireSignIn();
            }
        }
    }).
    otherwise({
        redirectTo: "/userHome"
    });
}]);
