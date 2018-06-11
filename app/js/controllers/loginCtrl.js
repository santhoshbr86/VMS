(function() {
    "use strict";
    var app = angular.module('loginModule', []);
    app.controller('adminLoginController', ['$scope', '$http', '$location', '$window', 'dumble', 'urlprefix', 'teamsite', function($scope, $http, $location, $window, dumble, urlprefix, teamsite) {
        $scope.submitted = false;
        $scope.closePopUp = false;
        $scope.showError = false;
        $scope.include = {
            top: teamsite + "/VolunteerAdminLogin.html",
        };

        $scope.login = function() {
            $scope.submitted = true;
            if ($scope.loginForm.$valid) {
                console.log(urlprefix + "/volunteer-manager/admin/login");
                $http.post(urlprefix + "/volunteer-manager/admin/login", $scope.loginData).then(
                    function(response) {
                        $window.localStorage.setItem('token', response.data.token);
                        $location.path('/admin/home');
                    },
                    function(response) {
                        console.error(response);
                        $scope.error = "There was a problem logging in, please try later.";
                        $scope.showError = true;
                    });
            }
        };

        $scope.closePopUp = function() {
            $scope.showError = false;
        };

        //
        // MAIN
        //

        dumble.setDumbleData('Admin:Login', 'Login Page', '', '', 0, '', '', '', '');
    }]);
})();
