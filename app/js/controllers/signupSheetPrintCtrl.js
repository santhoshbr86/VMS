(function() {
    var app = angular.module('printSignupSheetsModule', []);
    app.controller('signupSheetPrintController', ['$scope', '$http', '$location', '$routeParams', 'dumble', 'urlprefix', function($scope, $http, $location, $routeParams, dumble, urlprefix) {
        //"use strict";
        $scope.printSignUpSheets = function() {
            console.log("sid " + $routeParams.sid);
            $("#cpt_header-holder").hide();
            $("#cpt_footer-holder").hide();
            $http.get(urlprefix + '/volunteer-manager/signupsheet/' + $routeParams.sid + '/print').then(
                function(data) {
                    console.log(data);
                    $scope.printData = data.data;
                    dumble.setDumbleData('ChairPerson:Signup Print', 'Print Page', '',
                        'BFC', 1, $scope.printData.schoolName, $scope.printData.eventName,
                        $scope.printData.schoolName, $scope.printData.fairStartEndRange);
                },
                function(data) {
                    console.error('unable to get signups heet');
                });
        };

        //
        // MAIN
        //

        $scope.printSignUpSheets();
    }]);
})();
