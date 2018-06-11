(function() {
    "use strict";
    var app = angular.module('socialContactsModule', []);
    app.controller('socialContactsController', ['$scope', '$window', function($scope, $window) {
        $scope.importOutLookContacts = function() {
            $window.localStorage.setItem("manuallyClosed", "no");
            $window.close();
        };
        $scope.importOutLookContacts();
    }]);
})();
