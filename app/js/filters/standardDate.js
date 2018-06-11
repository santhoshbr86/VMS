angular.module('appDirectives').filter('standardDate', ['$filter', function($filter) {
    "use strict";
    return function(input) {
        if (input === null) {
            return "";
        }
        return $filter('date')(new Date(input), 'MM/dd/yyyy');
    };
}]);
