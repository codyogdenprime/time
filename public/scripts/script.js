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



var showSingleClient = function() {
    // Transition from all client cards to a single client
    $('section.cards').fadeOutToLeft(function() {
        $('section.single-client').fadeInFromRight();
    });
};

var showClients = function(button) {
    // Transition back to all the clients
    $(button).parent().fadeOutToRight(function() {
        $('section.clients').fadeInFromLeft();
        $('section.single-client').css('left', '200px');
    });
};
var showSingleProject = function() {
    // Transition to single client.
    $('section.single-client').fadeOutToLeft(function() {
        $('section.single-project').fadeInFromRight();
    });
};
var backToSingleClient = function() {
    $('section.single-project').fadeOutToRight(function() {
        $('section.single-client').fadeInFromLeft();
    });
};
var showAddClient = function() {
    $('.modal').addClass('modal-show');
    $('.modal__add-client input[type="text"]').focus();
};
var addProjectToNewClient = function() {
    $('.modal__add-client').animate({
        top: "-200px",
        opacity: 0
    }, 300, function() {
        $(this).hide();
        $('.modal__add-project').show().css("opacity", 0).animate({
            opacity: 1
        }, 400);
        $('.modal__add-project input[type="text"]').focus();
    });
};

var addProjectToClient = function() {
    $('.modal__add-client').hide();
    $('.modal__add-project').show().css('opacity', 1);
    $('.modal').addClass('modal-show');
};

var modalReset = function() {
    if ($('.modal').hasClass('modal-show')) {
        $('.modal').removeClass('modal-show');
    }
    $('.modal__add-project').css('opacity', 0).hide();
    $('.modal__add-client').show().css('top', '0px').css('opacity', 1);
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
        redirectTo: "/"
    });
}]);
