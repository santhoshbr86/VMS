(function() {
    "use strict";
    var app = angular.module('signUpService', []);
    var anyTime = 'Any Time';
    app.service('timeandtaskSheet', ['$http', '$q', '$filter', 'urlprefix', function($http, $q, $filter, urlprefix) {
        var timeanddate = null;

        // '6PM'  ->  '6:00 PM'
        // '12AM' -> '12:00 AM'
        // 'Any Time' -> 'Any Time'
        var normalize = function convert(s) {
            if (angular.isUndefined(s)) {
                return anyTime;
            }
            if (s === 'ANY_TIME' || s === 'Any Time') {
                return anyTime;
            }
            var b = Math.max(s.indexOf('AM'), s.indexOf('PM'));
            var e = s.length;
            return s.substring(0, b) + ':00 ' + s.substring(b, e);
        };

        // '6PM' -> '7PM'
        // 'Any Time' -> 'Any Time'
        var nextHour = function nextHour(s) {
            var real = 0;
            if (angular.isUndefined(s)) {
                return anyTime;
            }
            if (s === 'ANY_TIME' || s === 'Any Time') {
                return anyTime;
            }
            console.log('s = ' + s);
            var b = Math.max(s.indexOf('AM'), s.indexOf('PM'));
            real = parseInt(s.substring(0, b)) + 1;
            if (s.indexOf('AM') > 0) {
                if (s === '12:00 AM') {
                    real = 1;
                }
            }
            if (s.indexOf('PM') > 0) {
                if (s === '12:00 PM') {
                    real = 13;
                } else {
                    real = parseInt(s.substring(0, b)) + 1 + 12;
                }
            }

            var midnight = $filter('date')(new Date(0, 0, 0, real, 0, 0), 'h:00 a');

            if (midnight === "12:00 AM" && s === "11:00 PM") {
                return "Midnight";
            }

            return $filter('date')(new Date(0, 0, 0, real, 0, 0), 'h:00 a');
        };

        this.setTimeandDay = function(hour, day) {
            timeanddate = {};
            timeanddate.hour = normalize(hour);
            timeanddate.hourNext = nextHour(normalize(hour));
            timeanddate.day = day;
        };

        this.getTimeandDay = function() {
            return timeanddate;
        };

        this.resetMode = function() {
            if (!angular.isUndefined(timeanddate) && timeanddate !== null) {
                console.log("NonEmpty timeanddate");
                console.log("resetMode " + timeanddate.mode);
                timeanddate.mode = '';
                console.log("resetMode " + timeanddate.mode);
            } else {
                console.log("Empty timeanddate");
            }
        };

        this.setFairStartDateAndEndDate = function(fairStartDate, fairEndDate, mode) {
            // DJ VMS-1132 fair start date validation logic
            timeanddate.fairStartDate = fairStartDate;
            timeanddate.fairEndDate = fairEndDate;
            timeanddate.mode = mode;
        };

        this.getTasks = function(signupSheetId) {
            console.log("GET UNPUBLISHED: {signupSheetId: %i}", signupSheetId);
            return $http.get(urlprefix + '/volunteer-manager/signupsheet/' + signupSheetId);
        };

        this.getPublishedTasks = function(signupSheetId) {
            console.log("GET PUBLISHED: {signupSheetId: %i}", +signupSheetId);
            return $http.get(urlprefix + '/volunteer-manager/signupsheet/published/' + signupSheetId);
        };
        // Delete from the back end when SAVE button selected.
        this.deleteTaskBackend = function(delTask) {
            var temp = [];
            for (var i = 0; i < delTask.length; i++) {
                if (delTask[i].activityId !== undefined) {
                    temp.push(delTask[i].activityId);
                }
            }
            return $http.delete(urlprefix + '/volunteer-manager/signupsheet/activities/' +
                temp);
        };
    }]);

    app.service('fairStore', ['$filter', '$window', function($filter, $window) {
        var fair, tempStore = [],
            adminRoles = {},
            customRoles = {},
            contactList = [],
            publishedFlag = false;

        var ConvertTimeformat = function(format, str) {
            //Santhosh Code Below
            var time = str;
            var hours = Number(time.match(/^(\d+)/)[1]);
            var minutes = Number(time.match(/:(\d+)/)[1]);
            var AMPM = time.match(/\s(.*)$/)[1];
            if (AMPM === "PM" && hours < 12) {
                hours = hours + 12;
            }
            if (AMPM === "AM" && hours === 12) {
                hours = hours - 12;
            }
            var sHours = hours.toString();
            var sMinutes = minutes.toString();
            if (hours < 10) {
                sHours = "0" + sHours;
            }
            if (minutes < 10) {
                sMinutes = "0" + sMinutes;
            }

            return sHours + ":" + sMinutes;
        };

        this.convertUtcFormat = function(t) {
            var tim = {};
            angular.copy(t, tim);
            var strTim = tim.startTime;
            var endTim = tim.endTime;

            tim.startTime = $filter('date')(new Date(tim.activityDate), 'yyyy-MM-dd') + 'T' + ConvertTimeformat("24", strTim);
            tim.endTime = $filter('date')(new Date(tim.activityDate), 'yyyy-MM-dd') + 'T' + ConvertTimeformat("24", endTim);
            tim.millisecondDuration = this.taskDuration(tim.startTime, tim.endTime);
            return tim;
        };
        this.taskDuration = function(startTime, endTime) {
            //"2016-05-13T08:00"
            return (new Date(moment(endTime, "YYYY-MM-DDTHH:mm")) - new Date(moment(startTime, "YYYY-MM-DDTHH:mm"))); // / 3600000
        };
        this.assignSignupId = function(sid) {
            tempStore.signupSheetId = sid;
            tempStore.signUpSheetId = sid;
            tempStore.previousSignUpId = sid;
        };

        this.storeTasks = function(t) {
            tempStore = t;
        };
        this.updateStore = function(t) {
            var tim = {};
            angular.copy(t, tim);
            var strTim = tim.startTime;
            var endTim = tim.endTime;
            if (strTim.indexOf('T') === -1) {
                tim.startTime = $filter('date')(new Date(tim.activityDate), 'yyyy-MM-dd') + 'T' + ConvertTimeformat("24", strTim);
                tim.endTime = $filter('date')(new Date(tim.activityDate), 'yyyy-MM-dd') + 'T' + ConvertTimeformat("24", endTim);
                tim.millisecondDuration = this.taskDuration(tim.startTime, tim.endTime);
            }
            if (tim.hasOwnProperty('uid')) {
                for (var i = 0; i < tempStore.signupSheetActivities.length; i++) {
                    if (tempStore.signupSheetActivities[i].uid === tim.uid) {
                        tempStore.signupSheetActivities[i].activityDate = tim.activityDate;
                        tempStore.signupSheetActivities[i].startTime = tim.startTime;
                        tempStore.signupSheetActivities[i].endTime = tim.endTime;
                        tempStore.signupSheetActivities[i].millisecondDuration = tim.millisecondDuration;
                    }
                }
            } else {
                tim.uid = tempStore.signupSheetActivities.length;
                tempStore.signupSheetActivities.push(tim);
            }
        };
        this.deleteTask = function(t) {
            if (tempStore.signupSheetActivities.length > 0) {
                for (var i = 0; i < tempStore.signupSheetActivities.length; i++) {
                    if (tempStore.signupSheetActivities[i].uid === t.uid) {
                        tempStore.signupSheetActivities.splice(i, 1);
                        i--;
                        break; // will only delete the first instance of matching task
                    }
                }
            }
            return tempStore;
        };
        this.getStoreTasks = function() {
            return tempStore;
        };
        this.clearStoreTasks = function() {
            tempStore = [];
        };
        this.setFair = function(f) {
            fair = f;
        };
        this.getFair = function() {
            return fair;
        };
        this.setAdminRoles = function(roles) {
            adminRoles = roles;
        };
        this.getAdminRoles = function() {
            if (adminRoles.hasOwnProperty('rolesStatus')) {
                return adminRoles;
            } else {
                return false;
            }
        };
        this.setCustomRoles = function(roles) {
            customRoles = roles;
        };
        this.deleteCustomRole = function(role) {
            customRoles.signupSheetCustomRolesMessagesList.splice(customRoles.signupSheetCustomRolesMessagesList.indexOf(role), 1);
        };
        this.updateCustomRoles = function(role) {
            var tmpCustomRole = {};
            tmpCustomRole.id = role.customRoleId;
            tmpCustomRole.schoolId = role.schoolId;
            tmpCustomRole.description = role.description;
            tmpCustomRole.title = role.eventName;
            customRoles.signupSheetCustomRolesMessagesList.push(tmpCustomRole);
        };
        this.getCustomRoles = function() {
            if (customRoles.hasOwnProperty('signupSheetCustomRolesMessagesList')) {
                return customRoles;
            } else {
                return false;
            }
        };
        this.getContactsList = function() {
            contactList = JSON.parse($window.sessionStorage.getItem('allContacts'));
            if (contactList !== []) {
                angular.forEach(contactList, function(con) {
                    con.name = con.volunteerExt.firstName + ' ' + con.volunteerExt.lastName;
                });
            }
            return contactList;
        };
        this.setContactsList = function(contacts) {
            contactList = contacts;
        };

        this.timeFormat = function(t) {
            return t.split(' ')[0].concat(':00').concat(' ' + t.split(' ')[1]);
        };
        this.setPublishedFlag = function(flag) {
            publishedFlag = flag;
        };
        this.getPublishedFlag = function() {
            return publishedFlag;
        };
    }]);

    app.service('socialMediaService', ['$window', function($window) {
        this.getFBError = function() {
            return "Cannot establish a connection with Facebook.";
        };

        // Determine if FB's sdk.js has been properly loaded.
        this.fbHasSDK = function() {
            return typeof $window.FB !== 'undefined';
        };

        // Share a URL to Facebook.
        this.fbShare = function(url) {
            $window.FB.ui({
                method: 'share',
                href: url
            });
        };

        // Share URL and some text to Twitter.
        this.twShare = function(referer, text, url) {
            $window.open(encodeURI("https://twitter.com/intent/tweet?original_referer=" + referer + "&text=" + text + "&url=" + url).replace(/\/#\//, encodeURIComponent('/#/')), 'tw_share', 'width=450,height=400');
        };
    }]);

})();
