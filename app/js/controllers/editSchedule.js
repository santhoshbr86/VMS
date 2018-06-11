var app = angular.module('editSchedule', []);

app.controller('editScheduleCtrl', ['$scope', '$location', '$routeParams', '$window', 'teamsite', function($scope, $location, $routeParams, $window, teamsite) {
    $scope.include = {
        Vol430_top: teamsite + "/VOL430_top.html",
        Vol430_pallet: teamsite + "/VOL430_pallet.html",
    };
    $scope.tabs = [{
        title: "Calendar View",
        templateUrl: '/partials/calendar-view.html'
    }];
    $scope.fair = $scope.$eval($window.sessionStorage.getItem('susData'));
    var signUpSheetID = $window.sessionStorage.getItem('signUpSheetID');
    $scope.gotoVolunteers = function() {
        $location.path('/volunteers/' + $routeParams.orgId + "/" + $routeParams.eventId);
    };
    $scope.stepBack = function() {
        if (angular.isDefined(signUpSheetID) && signUpSheetID !== null && signUpSheetID !== '') {
            $scope.sid = signUpSheetID;
        } else if ($scope.fair.previousSignUpId !== -1) {
            $scope.sid = $scope.fair.previousSignUpId + '/new';
        } else {
            $scope.sid = '-1/new';
        }
        $location.path('/volunteers/builder/' + $routeParams.orgId + '/' + $routeParams.eventId + '/' + $scope.sid);
    };

}]);

app.controller('calenderSchedulerCtrl', ['$scope', 'teamsite', '$location', 'urlprefix', '$routeParams', 'adminRoles', '$window', '$filter', 'jqService', 'fairStore', 'dateService', '$http', 'timeandtaskSheet', 'signupSheetService', function($scope, teamsite, $location, urlprefix, $routeParams, adminRoles, $window, $filter, jqService, fairStore, dateService, $http, timeandtaskSheet, signupSheetService) {
    var days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'];
    $scope.hours = ['12 AM', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM'];
    $scope.weekDays = [];
    $scope.weekSize = 7;
    // TODOCHRIS: Document what this does
    $scope.beginWith = 29;
    $scope.disableNext = false;
    $scope.showDupOverlay = false;
    $scope.showListPopup = true;
    $scope.smallDevice = false;
    $scope.items = [];
    $scope.adminroles = [];
    $scope.fair = {};
    $scope.customRoles = [];
    $scope.tasksToDelete = [];
    $scope.include = {
        Vol430_pallet: teamsite + "/VOL430_pallet.html"
    };

    $scope.adminroles = fairStore.getAdminRoles();
    if (!$scope.adminroles) {
        // Get Admin Roles from Service.
        adminRoles.getAdminRoles($routeParams.eventId).then(function(data) {
            $scope.adminroles = data.data;
            fairStore.setAdminRoles($scope.adminroles);
        }, function(data) {
            console.log('Fails to get Admin Roles: ' + data);
        });
    }

    $scope.customRoles = fairStore.getCustomRoles();
    if (!$scope.customRoles) {
        //Get Custom Roles from Service.
        adminRoles.getCustomRoles($routeParams.orgId).then(function(data) {
            $scope.customRoles = data.data;
            fairStore.setCustomRoles($scope.customRoles);
        }, function(data) {
            console.log('Fails to get Custom tasks: ' + data);
        });
    }


    if ((/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase())) === true) {
        $scope.smallDevice = true;
    }

    $scope.deleteCustomTaskConfirm = function(customrole, e) {
        angular.element('.deletectaskpopUp').css('top', e.clientY); //Setting cursor position.
        $scope.showDelOverlay = true;
        $scope.showTaskPopUp = true;
        signupSheetService.setCustomTaskId(customrole);
    };

    $scope.closeCustomTaskDeletePopup = function() {
        $scope.showDelOverlay = false;
        $scope.showTaskPopUp = false;
    };

    $scope.closeListPopup = function() {
        $scope.showListPopup = false;
    };

    $scope.deleteRole = function() {
        var customRole = signupSheetService.getCustomTaskId();
        signupSheetService.setCustomTaskId("");
        $scope.closeCustomTaskDeletePopup();
        $http.delete(urlprefix + "/volunteer-manager/signupsheet/remove/task/" + customRole.id).then(
            function(data) {
                fairStore.deleteCustomRole(customRole);
            },
            function(data) {
                console.error('failed to remove task');
                $scope.error = data.data.errors[0].message;
            });
    };

    // Each click scrolls calender in up and down, Calender get recreated.
    $scope.prevDates = function() {
        $scope.beginWith = $scope.beginWith - 1;
        $scope.disableNext = false;
        // TODOCHRIS: Why are the no bounds checks here?
        jqService.addStyle();
    };

    $scope.nextDates = function() {
        $scope.beginWith = $scope.beginWith + 1;
        if ($scope.beginWith === $scope.weekDays.length - 7) {
            $scope.disableNext = true;
        } else {
            $scope.disableNext = false;
        }
        jqService.addStyle();
    };

    // Checking task belongs to particular blocks.
    $scope.isInTimeBlock = function(task, hour, day) {
        // TODO: This only works for tasks start on the hour, expand to :30/:15.
        if (!task.anyTime) {
            var taskEnd = new Date(task.endTime);
            var taskHour = task.startTime.split('T')[1];
            var taskHourP = parseInt(taskHour);

            // TODO:IE11: parseInt() less often
            if (taskHourP >= 12) {
                var offTime = taskHour.split(':');
                offTime[0] = offTime[0] % 12;
                taskHour = offTime.join(':');
                taskHourP = parseInt(taskHour);

                if (parseInt(taskHour) !== 0) {
                    taskHour = parseInt(taskHour) + ' PM';
                } else {
                    taskHour = '12 PM';
                }
            } else {
                if (taskHourP !== 0) {
                    taskHour = taskHourP + ' AM';
                } else {
                    taskHour = '12 AM';
                }
            }
            return taskHour === hour && (new Date(day.dateYear)).getTime() === (new Date(task.activityDate)).getTime();
        }
        return;
    };

    //Adding spacers for overlaping task.
    $scope.overlapSpacer = function(task, hour, day) {
        if (task.activityDate !== day.dateYear) {
            //if task.activityDate is not the same as day row then return false. this will speed up performance
            return false;
        } else {
            //ng-if will add this spacer within the hour if there is a task extending into the hour
            //if end time is midnight then what is new Date(taskEndMoment) ?
            //hourStartMoment and hourEndMoment will only be on the hour not 30 mins
            var hourStartMoment = moment(day.dateYear + " " + hour, "MM/DD/YYYY h:mm A");
            var hourEndMoment = hourStartMoment.add(1, 'h'); // except if hourStartMoment = 11 PM then add 1 h would be next day
            //task.startTime and task.endTime format 2016-09-06T10:00
            var taskStartMoment = moment(task.startTime, "YYYY-MM-DDTHH:mm"); //"2016-05-13T08:00"
            var taskEndMoment; //"2016-05-13T09:00"
            if (task.endTime.split('T')[1] === "00:00") { // task.endTime.split('T')[1] === "0:00"
                //endTime 12:00 AM as "00:00" or "0:00"
                taskEndMoment = moment(day.dateYear + " " + "12:00 AM", "MM/DD/YYYY h:mm A").add(1, 'd').format("YYYY-MM-DDTHH:mm");
            } else {
                taskEndMoment = moment(task.endTime, "YYYY-MM-DDTHH:mm");
            }
            //var taskDuration = moment.utc(taskEndMoment).diff(taskStartMoment, 'minutes') / 60;
            var fastDuration = new Date(taskEndMoment) - new Date(taskStartMoment);

            if (fastDuration >= 3600000 && !task.anyTime) {
                //if task duration is greater than 1 hour then
                //create this overlap spacer in that hour
                hourStartMoment = moment(day.dateYear + " " + hour, "MM/DD/YYYY h:mm A");

                if (hourStartMoment.isAfter(taskStartMoment) && hourStartMoment.isBefore(taskEndMoment)) {
                    return true;
                }
            }
            return false; // returning is false NOT "undefined"
        }
    };


    //Hightlight Calendar dates from start and end dates. 
    $scope.DateRangeCheck = function(obj) {
        if ($scope.tasks !== undefined) {
            if (moment(obj.dateYear).isSameOrAfter(moment($scope.tasks.fairStartDate).format('MM/DD/YYYY'), 'day') && moment(obj.dateYear).isSameOrBefore(moment($scope.tasks.fairEndDate).format('MM/DD/YYYY'), 'day')) {
                return obj;
            }
        } else {
            if (moment(obj.dateYear).isSameOrAfter(moment($scope.dummypastFair.startDate).format('MM/DD/YYYY'), 'day') && moment(obj.dateYear).isSameOrBefore(moment($scope.dummypastFair.endDate).format('MM/DD/YYYY'), 'day')) {
                return obj;
            }
        }
    };

    // Generate  Calender from fair Info
    $scope.createCalendar = function(fairInfo) {
        var start, end;
        $scope.tasks = fairInfo;
        if ($scope.tasks !== null) {
            $scope.tasks.fairStartDate = dateService.utcConversion($scope.tasks.fairStartDate);
            $scope.tasks.fairEndDate = dateService.utcConversion($scope.tasks.fairEndDate);
            start = moment($scope.tasks.fairStartDate).subtract(30, 'day');
            end = moment($scope.tasks.fairEndDate).add(30, 'day');
            $scope.weekDays = dateService.dateRange(start, end, days);
            jqService.addStyle();
        }
    };
    $scope.getTasks = function() {
        if ($scope.sid === null) {
            console.log('no signup sheet id, skipping!');
            return;
        } else {
            timeandtaskSheet.getPublishedTasks($scope.sid).then(function(res) {
                $scope.fair = res.data;
                //console.log($scope.fair);
                fairStore.storeTasks($scope.fair);
                $scope.createCalendar($scope.fair);
            }, function(res) {
                console.log(res);
            });
        }
    };

    //this gets fair infomation from signup sheet builder page.
    if ($location.url().indexOf('editSchedule') === -1) {
        $scope.$watch('sid', $scope.getTasks, true);
    } else {
        $scope.fair = fairStore.getStoreTasks();
        if ($scope.fair.length === 0) {
            $scope.fair = JSON.parse($window.sessionStorage.getItem('susData'));
        }

        if ($scope.fair !== null && !$scope.fair.hasOwnProperty('signupSheetActivities')) {
            $scope.fair.signupSheetActivities = [];
        } else {
            for (var i = 0; i < $scope.fair.signupSheetActivities.length; i++) {
                $scope.fair.signupSheetActivities[i].uid = i;
                $scope.fair.signupSheetActivities[i].schoolId = $routeParams.orgId;
            }
        }
        fairStore.storeTasks($scope.fair);
        $scope.createCalendar($scope.fair);
    }
    //Include empty signupSheetActivities array so we can add tasking into

    $scope.updateCalendar = function() {
        var tempFairTasks = fairStore.getStoreTasks();
        if (tempFairTasks.length !== 0) {
            //Trigger digest cycle to update calendar in html after droping elements.
            $scope.$apply(function() {
                $scope.tasks = tempFairTasks;
                jqService.addStyle();
            });
        }
    };

    // TODO: This should really be in app/js/directive/calendarDirective.js - emit an update from there!
    $scope.handleDrop = function(e) {
        e.preventDefault();
        e.stopPropagation();
        var dataObj = JSON.parse(e.dataTransfer.getData('text'));
        var dateString = $(this).find('#hiddenDate')[0].innerHTML.trim(' ');
        var dateArr = dateString.split(',');
        if (dateArr[2] === "") {
            dateArr[2] = '12 AM';
        }

        // TODO: On drop create temp var, some properties will be removed during ingeration.
        if (dataObj.uid) {
            $scope.item = {
                activityDate: dateArr[0],
                uid: parseInt(dataObj.uid),
                anyTime: false,
                description: dataObj.activityName,
                dupsCount: 0,
                endTime: fairStore.timeFormat(dateArr[2]),
                eventName: dataObj.activityName,
                mode: "Unpub",
                schoolId: $routeParams.orgId,
                signupSheetActivityId: null,
                startTime: fairStore.timeFormat(dateArr[1]),
                volunteerName: undefined
            };
        } else {
            $scope.item = {
                activityDate: dateArr[0],
                roleId: parseInt(dataObj.roleId),
                description: dataObj.description,
                activityId: undefined,
                anyTime: false,
                dupsCount: 0,
                endTime: fairStore.timeFormat(dateArr[2]),
                eventName: dataObj.activityName,
                mode: "Unpub",
                schoolId: $routeParams.orgId,
                signupSheetActivityId: null,
                startTime: fairStore.timeFormat(dateArr[1]),
                volunteerName: undefined
            };
        }

        if ($scope.item.roleId === -1) {
            $window.sessionStorage.setItem('taskDetail', JSON.stringify($scope.item));
            $location.path('/taskDetails/' + $routeParams.orgId + '/' + $routeParams.eventId);
        } else {
            fairStore.updateStore($scope.item);
        }

        $scope.updateCalendar();
    };

    $scope.saveFair = function() {
        console.log('edit schedule ctrl' + $scope.fair);
        $scope.fair.fairId = $routeParams.eventId;
        $scope.fair.schoolId = $routeParams.orgId;
        $scope.fair.startDate = $scope.fair.fairStartDate;
        $scope.fair.endDate = $scope.fair.fairEndDate;
        if (angular.isDefined($scope.fair.signUpSheetId) && $scope.fair.signUpSheetId !== null &&
            $scope.fair.signUpSheetId !== '' && $scope.fair.signUpSheetId !== -1) {
            $scope.fair.signupSheetId = $scope.fair.signUpSheetId;
            $http.put(urlprefix + '/volunteer-manager/signupsheet/basic/update', $scope.fair).then(
                function(data) {
                    console.log("updated successfully");
                    $scope.fair.signUpSheetId = data.data.signupSheetId;
                    $scope.fair.previousSignUpId = data.data.signupSheetId;
                    signupSheetService.setId(data.data.signupSheetId);
                    $location.path('/volunteers/builder/' + $routeParams.orgId + '/' + $routeParams.eventId + '/' + $scope.fair.signUpSheetId);
                },
                function(data) {
                    console.error('error!');
                });
            if ($scope.tasksToDelete.length > 0) {
                timeandtaskSheet.deleteTaskBackend($scope.tasksToDelete).then(function(data) {
                    console.log(data);
                }, function(err) {
                    console.log(err);
                });
            }
        } else {
            $scope.fair.signupSheetId = -1;
            $http.post(urlprefix + '/volunteer-manager/signupsheet/basic/create', $scope.fair).then(
                function(data) {
                    console.log("saved successfully");
                    $scope.fair.signUpSheetId = data.data.signupSheetId;
                    $scope.fair.previousSignUpId = data.data.signupSheetId;
                    signupSheetService.setId(data.data.signupSheetId);
                    $location.path('/volunteers/builder/' + $routeParams.orgId + '/' + $routeParams.eventId + '/' + $scope.fair.signUpSheetId);
                },
                function(data) {
                    console.error('error!');
                });
        }

    };
    $scope.loadTaskDetails = function(t) {
        console.log(t); // t=caledar tasks.
        $window.sessionStorage.setItem('taskDetail', JSON.stringify(t));
        $location.path('/taskDetails/' + $routeParams.orgId + '/' + $routeParams.eventId);
    };

    $scope.toggleDupOverlay = function(d) {
        $scope.showDupOverlay = true;
        console.log(d);
        console.log($scope.fair.signupSheetActivities);
        $scope.duplicateDayFrom = moment(d.dateYear)._d;
        $scope.duplicateDayTo = moment(d.dateYear).add('day', 1)._d;
        $scope.dateOptions = {
            formatYear: 'yy',
            maxDate: moment($scope.weekDays[$scope.weekDays.length - 1].dateYear),
            minDate: moment($scope.weekDays[0].dateYear),
        };
    };
}]);

app.controller('duplicateDayCtrl', ['$scope', 'teamsite', 'jqService', '$filter', 'fairStore', function($scope, teamsite, jqService, $filter, fairStore) {
    $scope.popup = {
        datePickerOpened: false
    };
    $scope.include = {
        VOL430_Duplicate_top: teamsite + "/VOL430_Duplicate_top.html",
        VOL430_Duplicate_bottom: teamsite + "/VOL430_Duplicate_bottom.html"
    };
    $scope.closeOverlay = function() {
        $scope.$parent.showDupOverlay = false;
    };
    $scope.openDatePicker = function($event) {
        $scope.popup.datePickerOpened = true;
        jqService.styleCalPopUp($event);
    };
    $scope.duplicateDayTasks = function() {
        $scope.$parent.showDupOverlay = false;
        $scope.$parent.tasksToDelete = [];
        // FROM and TO date are same the return
        if (moment($scope.duplicateDayFrom).isSame($scope.duplicateDayTo)) {
            return;
        }
        angular.forEach($scope.fair.signupSheetActivities, function(val, key) {
            if (moment($scope.duplicateDayTo).isSame(val.activityDate)) {
                //Keep tasks to delete in Array.
                $scope.$parent.tasksToDelete.push(val);
            }
            if (moment($scope.duplicateDayFrom).isSame(val.activityDate)) {
                var temp = angular.copy(val); // just to deep copy avoid changes in prototype chain.
                //Reintializing each task.
                temp.activityDate = $filter('date')($scope.duplicateDayTo, 'MM/dd/yyyy');
                temp.startTime = moment(temp.startTime.substr(temp.startTime.indexOf('T') + 1), 'HH:mm').format('hh:mm A');
                temp.endTime = moment(temp.endTime.substr(temp.endTime.indexOf('T') + 1), 'HH:mm').format('hh:mm A');
                temp.activityId = undefined;
                temp.volunteerName = undefined;
                //Delete uid from each task.
                delete temp.uid;
                fairStore.updateStore(temp);
            }
        });
        // Below delete all the task under TODATE.
        angular.forEach($scope.$parent.tasksToDelete, function(val, key) {
            fairStore.deleteTask(val);
        });
        $scope.tasks = fairStore.getStoreTasks();
        jqService.addStyle();
    };

}]);
