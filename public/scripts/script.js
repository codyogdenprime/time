console.log('sourced');

(function($) {

    $.fn.fadeOutToLeft = function(callback) {
        $(this).animate({
            opacity: 0,
            left: "-200px"
        }, 300, function() {
            $(this).hide();
            if (callback) {
                callback();
            }
        });
        return this;
    };

    $.fn.fadeInFromRight = function(callback) {
        $(this).show().animate({
            opacity: 1,
            left: "0px"
        }, 200);
        return this;
    };

    $.fn.fadeOutToRight = function(callback) {
        $(this).animate({
            opacity: 0,
            left: "200px"
        }, 300, function() {
            $(this).hide();
            if (callback) {
                callback();
            }
        });
        return this;
    };

    $.fn.fadeInFromLeft = function(callback) {
        $(this).animate({
            opacity: 1,
            left: "0px"
        }, 200);
        if (callback) {
            callback();
        }
    };

})(jQuery);

// These are example functions for testing UI interaction.
// We can incorporate these into the client scripts
// inside Angular as needed.

var showProject = function() {

    $('.projects').fadeOutToLeft(function() {
        $('.single-project').fadeInFromRight();
    });
};

var showProjects = function() {

    $('.single-project').fadeOutToRight(function() {
        $('.projects').show();
        $('.projects').fadeInFromLeft();
    });

};

$(document).keyup(function(e) {
    // If a user hits `esc` and the modal is showing
    if (e.keyCode === 27 && $('.modal-show')) {
        // Get Rid of it and reset it.
        modalReset();
    }
});

var myApp = angular.module('myApp', ['ngRoute', 'firebase']);

myApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
    when('/', {
        templateUrl: "/views/userHome.html"
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
    otherwise({
        redirectTo: "/"
    });
}]);
