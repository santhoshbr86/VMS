(function() {
    "use strict";
    var app = angular.module('volScheduleModule', []);
    $("#cpt_header-holder").hide();
    $("#cpt_footer-holder").hide();
    app.controller('scheduleCarouselCtrl', ['$scope', '$http', '$window', function($scope, $http, $window) {
        $scope.CloseCarousel = function() {
            carouseloverLay.hide();
            carouselEle.hide();
            $window.localStorage.setItem('sessionScheduleOverlay', true);
        };
        $scope.donotShowOverLay = function() {
            $window.localStorage.setItem('scheduleOverlay', true);
        };

        //
        // MAIN
        //

        $("#cpt_header-holder").hide();
        $("#cpt_footer-holder").hide();
        var carouseloverLay = angular.element('.carouselWrap');
        var carouselEle = angular.element('.carousel');
        if (JSON.parse($window.localStorage.getItem('scheduleOverlay')) === true || JSON.parse($window.localStorage.getItem('sessionScheduleOverlay')) === true) {
            carouseloverLay.hide();
            carouselEle.hide();
        }


        $(window).unload(function() {
            $window.localStorage.removeItem('sessionScheduleOverlay');
        });
    }]);
})();
