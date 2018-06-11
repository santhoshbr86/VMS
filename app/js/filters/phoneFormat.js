angular.module('appDirectives').filter('phoneFormat', function() {
    "use strict";
    return function(phone) {
        if (null === phone || angular.isUndefined(phone)) {
            return "";
        }
        if (phone.length === 7) {
            return phone.replace(/(\d{3})(\d{4})/, "$1-$2");
        } else if (phone.length === 10) {
            return phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
        } else {
            return "";
        }
    };
});
angular.module('appDirectives').filter('htmlEscape', function() {
    "use strict";
    return function(input) {
        if (!input) {
            return '';
        }
        return input.
        replace(/&/g, '&amp;').
        replace(/</g, '&lt;').
        replace(/>/g, '&gt;').
        replace(/'/g, '&#39;').
        replace(/"/g, '&quot;');
    };
});
angular.module('appDirectives').filter('textToHtml', ['$sce', 'htmlEscapeFilter', function($sce, htmlEscapeFilter) {
    "use strict";
    return function(input) {
        if (!input) {
            return '';
        }
        input = htmlEscapeFilter(input);

        var output = '';
        angular.forEach(input.split("\n"), function(paragraph) {
            output += '<p>' + paragraph + '</p>';
        });

        return $sce.trustAsHtml(output);
    };
}]);
angular.module('appDirectives').filter('howToHtml', ['$sce', 'htmlEscapeFilter', function($sce, htmlEscapeFilter) {
    "use strict";
    return function(input) {
        if (!input) {
            return '';
        }
        return $sce.trustAsHtml(input);
    };
}]);
