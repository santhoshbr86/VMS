// NOTE: This has to be global.
var dumbleData = {};

(function() {
    "use strict";
    var app = angular.module('taggingService', []);
    app.service('dumble', ['$document', '$window', function($document, $window) {
        $window.dumbleData.omniture = {
            domain: {
                name: 'Bookfairs:VMS',
                channel: 'VMS',
                server: $document[0].location.hostname,
                experience: 'VMS',
                experienceType: 'Content'
            },
            page: {
                name: '', //pageName,
                type: '', //pageType
            },
            user: {
                spsid: '', //spsId,
                role: '', //role,
                loggedInStatus: 0, //loggedInStatus,
                school: '', //school
            },
            fair: {
                name: '', //fairName,
                host: '', //fairHost,
                dateRange: '', //fairDateRange
            },
            self: {
                implementation: 'VMS',
                version: '1.0.0'
            }
        };

        this.setDumbleData = function(pageName, pageType, spsId, role, loggedInStatus, school, fairName, fairHost, fairDateRange) {
            $window.dumbleData.omniture.page.name = pageName;
            $window.dumbleData.omniture.page.type = pageType;

            $window.dumbleData.omniture.user.spsid = spsId;
            $window.dumbleData.omniture.user.role = role;
            $window.dumbleData.omniture.user.loggedInStatus = loggedInStatus;
            $window.dumbleData.omniture.user.school = school;

            $window.dumbleData.omniture.fair.name = fairName;
            $window.dumbleData.omniture.fair.host = fairHost;
            $window.dumbleData.omniture.fair.dateRange = fairDateRange;
        };
    }]);
})();
