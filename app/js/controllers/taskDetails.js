var app = angular.module('taskDetails', []);

app.controller('taskDetailsCtrl', ['$scope', '$window', '$rootScope', '$filter', '$http', '$location', 'timeandtaskSheet', 'signupSheetService', '$route', '$routeParams', 'fairStore', 'httpErrorLoggingService', '$timeout', 'dumble', 'urlprefix', 'teamsite', function($scope, $window, $rootScope, $filter, $http, $location, timeandtaskSheet, signupSheetService, $route, $routeParams, fairStore, httpErrorLoggingService, $timeout, dumble, urlprefix, teamsite) {
    $scope.noVolunteer = true;
    $scope.showHow = false;
    $scope.dupsHide = false;
    $scope.addContactErrors = false;
    $scope.addContactFirstNameError = false;
    $scope.addContactLastNameError = false;
    $scope.addContactEmailError = false;
    $scope.runingSaveTask = false;
    $scope.runingSaveTaskDup = false;
    $scope.wrongTime = false;
    $scope.showlist = false;
    $scope.noMatch = false;
    $scope.addContactErrorsMsg = "";
    $scope.deletetasktetails = false;
    $scope.roleId = "";
    $scope.duplicates = [];
    $scope.taskConfirmPopUp = false;
    $scope.overLay = false;
    $scope.noRemove = false;
    $scope.isKeep = false;
    $scope.cancelOperation = false;
    var ANY_TIME = 'ANY_TIME';
    var MIDNIGHT = 'Mignight';

    $scope.include = {
        topText: teamsite + "/VOL655_Top.html",
        volText: teamsite + "/VOL655_Volunteer.html",
        volDuplicate: teamsite + "/VOL655_Duplicate.html",
    };
    $scope.hours = [
        'Any Time', '12:00 AM', '12:30 AM', '1:00 AM', '1:30 AM', '2:00 AM', '2:30 AM', '3:00 AM', '3:30 AM', '4:00 AM',
        '4:30 AM', '5:00 AM', '5:30 AM', '6:00 AM', '6:30 AM', '7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM', '9:00 AM',
        '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM',
        '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM',
        '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM', '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM'
    ];

    $scope.task = {
        start: $scope.hours[0],
        end: $scope.hours[0],
        dups: '1',
        maxPastDate: null,
        maxFutureDate: null
    };

    var timeandDay = timeandtaskSheet.getTimeandDay();
    var phoneStr = "";
    var orgId = 0;

    $scope.gotoVolunteers = function() {
        $location.path('/volunteers/' + $routeParams.orgId + '/' + $routeParams.eventId);
    };
    $scope.gotoSignupBuilder = function() {
        if (signupSheetService !== null && signupSheetService.getId() !== '') {
            $scope.sid = signupSheetService.getId();
        } else if ($scope.fair.previousSignUpId !== -1) {
            $scope.sid = $scope.fair.previousSignUpId + '/new';
        } else {
            $scope.sid = '-1/new';
        }
        $location.path('/volunteers/builder/' + $routeParams.orgId + '/' + $routeParams.eventId + '/' + $scope.sid);
    };

    $scope.stepBack = function() {
        $location.path('/editSchedule/' + $routeParams.orgId + "/" + $routeParams.eventId);
    };

    $scope.duplicate = function() {
        var duplicate = angular.copy($scope.task);
        duplicate.noVolunteer = true;
        duplicate.volName = '';
        $scope.duplicates.push(duplicate);
    };

    $scope.checkvolunteername = function() {
        if (angular.isDefined($scope.task.volunteerName) && $scope.task.volunteerName !== null &&
            $scope.task.volunteerName !== '' && angular.isDefined($scope.task.volExtId) &&
            $scope.task.volExtId !== null &&
            $scope.task.volExtId !== '') {
            $scope.deletetasktetails = true;
            $scope.overLay = true;
        } else {
            $scope.deletetasktetails = false;
            $scope.overLay = false;
            if (angular.isDefined($scope.task.activityId) && $scope.task.activityId !== null &&
                $scope.task.activityId !== '') {
                $http.delete(urlprefix + "/volunteer-manager/signupsheet/activity/" + $scope.task.activityId).then(
                    function(data) {
                        fairStore.deleteTask(taskDetail);
                        $location.path('/editSchedule/' + $routeParams.orgId + "/" + $routeParams.eventId);
                    },
                    function(data) {
                        console.error('error!');
                    });
            } else {
                fairStore.deleteTask(taskDetail);
                $location.path('/editSchedule/' + $routeParams.orgId + "/" + $routeParams.eventId);
            }
        }
    };

    $scope.closePopUp = function() {
        $scope.deletetasktetails = false;
        $scope.overLay = false;
    };

    $scope.deleteContact = function(task) {
        if (angular.isDefined(task.activityId) && task.activityId !== null &&
            task.activityId !== '' && angular.isDefined(task.volExtId) &&
            task.volExtId !== null &&
            task.volExtId !== '') {
            $http.delete(urlprefix + "/volunteer-manager/signupsheet/activity/" + task.activityId).then(
                function(data) {
                    $location.path('/editSchedule/' + $routeParams.orgId + "/" + $routeParams.eventId);
                    fairStore.deleteTask(taskDetail);
                },
                function(data) {
                    console.error('error!');
                });
        } else {
            fairStore.deleteTask(taskDetail);
            $scope.closePopUp();
            $location.path('/editSchedule/' + $routeParams.orgId + "/" + $routeParams.eventId);
        }
    };

    $scope.thisIsBefore = function(a, b) {
        return moment(a).isBefore(b);
    };

    $scope.thisIsAfter = function(a, b) {
        return moment(a).isAfter(b);
    };

    $scope.isSameOrAfter = function(a, b) {
        // 3/10/2015 12 AM - 3/10/2015 1 AM
        if (b === '12:00 AM') {
            // is endTime is midnight then nothing can be after it so don't show the validation error,
            //San: Object prototype changes this to "12:00 AM".
            return false;
        } else {
            a = moment(moment($scope.task.startDate).format("MM/DD/YYYY") + " " + a).format("MM/DD/YYYY h:mm A");
            b = moment(moment($scope.task.startDate).format("MM/DD/YYYY") + " " + b).format("MM/DD/YYYY h:mm A");
            //console.log('$scope.isSameOrAfter false a', a, b);
            return moment(a).isSameOrAfter(b);
        }
    };

    $scope.isAfterTimeBlock = function(a, b) {
        // 3/10/2015 12 AM - 3/10/2015 1 AM
        if (b === '12:00 AM') {
            // is endTime is midnight then nothing can be after it so don't show the validation error,
            //San: Object prototype changes this to "12:00 AM".
            return false;
        } else {
            a = moment(moment($scope.task.startDate).format("MM/DD/YYYY") + " " + a).format("MM/DD/YYYY h:mm A");
            b = moment(moment($scope.task.startDate).format("MM/DD/YYYY") + " " + b).format("MM/DD/YYYY h:mm A");
            //console.log('$scope.isSameOrAfter false a', a, b);
            return moment(a).isAfter(b);
        }
    };

    $scope.isBeforeTimeBlock = function(a, b) {
        // 3/10/2015 12 AM - 3/10/2015 1 AM
        if (b === '12:00 AM') {
            // is endTime is midnight then nothing can be after it so don't show the validation error,
            //San: Object prototype changes this to "12:00 AM".
            return false;
        } else {
            a = moment(moment($scope.task.startDate).format("MM/DD/YYYY") + " " + a).format("MM/DD/YYYY h:mm A");
            b = moment(moment($scope.task.startDate).format("MM/DD/YYYY") + " " + b).format("MM/DD/YYYY h:mm A");
            //console.log('$scope.isSameOrAfter false a', a, b);
            return moment(a).isBefore(b);
        }
    };

    $scope.cancelTaskDetailPopUp = function() {
        var formatterStartTime = $filter('date')(taskDetail.startTime, 'h:mm a');
        var formatterEndTime = $filter('date')(taskDetail.endTime, 'h:mm a');
        $scope.task.startDate = taskDetail.activityDate;
        $scope.task.start = formatterStartTime;
        $scope.task.end = formatterEndTime;
        $scope.overLay = false;
        $scope.taskConfirmPopUp = false;
        $scope.runingSaveTask = false;
        $scope.cancelOperation = true;
        $scope.isKeep = false;
        $scope.noRemove = false;
    };

    $scope.keepChanges = function() {
        $scope.isKeep = true;
        $scope.noRemove = false;
        $scope.cancelOperation = false;
        $scope.saveTask();
    };

    $scope.noRemoveChanges = function() {
        $scope.noRemove = true;
        $scope.cancelOperation = false;
        $scope.isKeep = false;
        $scope.saveTask();
    };

    $scope.checkContactValidity = function() {
        $scope.submitted = true;
        $scope.addContactFirstNameError = false;
        $scope.addContactLastNameError = false;
        $scope.addContactEmailError = false;
        if (angular.isUndefined($scope.task.firstName) || angular.isUndefined($scope.task.lastName) || angular.isUndefined($scope.task.email) || $scope.task.firstName === "" || $scope.task.lastName === "" || $scope.task.email === "") {
            if (angular.isUndefined($scope.task.firstName) || $scope.task.firstName === "") {
                $scope.addContactFirstNameError = true;
            } else {
                $scope.addContactFirstNameError = false;
            }

            if (angular.isUndefined($scope.task.lastName) || $scope.task.lastName === "") {
                $scope.addContactLastNameError = true;
            } else {
                $scope.addContactLastNameError = false;
            }

            if (angular.isUndefined($scope.task.email) || $scope.task.email === "") {
                $scope.addContactEmailError = true;
            } else {
                $scope.addContactEmailError = false;
            }
        }
    };

    $scope.checkDuplicateContactValidity = function(index) {
        $scope.duplicates[index].submitted = true;
        $scope.duplicates[index].addContactFirstNameError = false;
        $scope.duplicates[index].addContactLastNameError = false;
        $scope.duplicates[index].addContactEmailError = false;
        if (angular.isUndefined($scope.duplicates[index].firstName) || angular.isUndefined($scope.duplicates[index].lastName) || angular.isUndefined($scope.duplicates[index].email) || $scope.duplicates[index].firstName === "" || $scope.duplicates[index].lastName === "" || $scope.duplicates[index].email === "") {
            if (angular.isUndefined($scope.duplicates[index].firstName) || $scope.duplicates[index].firstName === "") {
                $scope.duplicates[index].addContactFirstNameError = true;
            } else {
                $scope.duplicates[index].addContactFirstNameError = false;
            }

            if (angular.isUndefined($scope.duplicates[index].lastName) || $scope.duplicates[index].lastName === "") {
                $scope.duplicates[index].addContactLastNameError = true;
            } else {
                $scope.duplicates[index].addContactLastNameError = false;
            }

            if (angular.isUndefined($scope.duplicates[index].email) || $scope.duplicates[index].email === "") {
                $scope.duplicates[index].addContactEmailError = true;
            } else {
                $scope.duplicates[index].addContactEmailError = false;
            }
        }
    };

    $scope.onSelectDuplicate = function(contact, index) {
        $scope.duplicates[index].volName = contact.volunteerExt.firstName + ' ' + contact.volunteerExt.lastName;
        $scope.duplicates[index].volName = $scope.duplicates[index].volName.replace('null', '');
        if (contact.email === null || contact.email === "" || $scope.task.volName === " ") {
            $scope.duplicates[index].contact = contact;
            $scope.duplicates[index].showlist = false;
            $scope.duplicates[index].noVolunteer = false;
            $scope.duplicates[index].firstName = contact.volunteerExt.firstName === null ? undefined : contact.volunteerExt.firstName;
            $scope.duplicates[index].lastName = contact.volunteerExt.lastName === null ? undefined : contact.volunteerExt.lastName;
            $scope.duplicates[index].email = contact.email === null ? undefined : contact.email;
            $scope.duplicates[index].phone = contact.volunteerExt.phone;
            $scope.duplicates[index].submitted = true;
            $scope.checkDuplicateContactValidity(index);
        } else {
            $scope.duplicates[index].showlist = false;
            $scope.duplicates[index].contact = contact;
            $scope.duplicates[index].noVolunteer = true;
        }
    };

    $scope.onSelect = function(contact) {
        $scope.task.volName = contact.volunteerExt.firstName + ' ' + contact.volunteerExt.lastName;
        $scope.task.volName = $scope.task.volName.replace('null', '');
        if (contact.email === null || contact.email === "" || $scope.task.volName === " ") {
            $scope.contact = contact;
            $scope.showlist = false;
            $scope.noVolunteer = false;
            $scope.task.firstName = contact.volunteerExt.firstName === null ? undefined : contact.volunteerExt.firstName;
            $scope.task.lastName = contact.volunteerExt.lastName === null ? undefined : contact.volunteerExt.lastName;
            $scope.task.email = contact.email === null ? undefined : contact.email;
            $scope.task.phone = contact.volunteerExt.phone;
            $scope.submitted = true;
            $scope.checkContactValidity();
        } else {
            $scope.showlist = false;
            $scope.contact = contact;
            $scope.noVolunteer = true;
        }
        $scope.noMatch = false;
    };

    $scope.checkVolunteer = function() {
        var elHeight;
        //DEV-GONOGO
        if ($scope.task.volName.length > 0) {
            $scope.showlist = true;
        } else {
            $scope.showlist = false;
        }
        if ($scope.filteredContact.length === 0) {
            $scope.noMatch = true;
        } else {
            elHeight = $scope.filteredContact.length * 20;
            console.log('00 get elHeight', elHeight);
            $scope.resizerStyle = {
                height: elHeight.toString() + "px"
            };
            $scope.noMatch = false;
        }
    };

    $scope.checkDuplicateVolunteer = function(index) {
        if ($scope.duplicates[index].volName.length > 0) {
            $scope.duplicates[index].showlist = true;
        } else {
            $scope.duplicates[index].showlist = false;
        }
    };

    $scope.addNewContact = function() {
        $scope.noVolunteer = false;
        $scope.showlist = false;
        $scope.noMatch = false;
        $scope.contact = undefined;
        $scope.task.firstName = $scope.task.volName.split(' ')[0] || '';
        $scope.task.lastName = $scope.task.volName.split(' ')[1] || '';
    };

    $scope.addNewDuplicateContact = function(index) {
        $scope.duplicates[index].noVolunteer = false;
        $scope.duplicates[index].showlist = false;
        $scope.duplicates[index].contact = undefined;
        $scope.duplicates[index].firstName = $scope.duplicates[index].volName.split(' ')[0] || '';
        $scope.duplicates[index].lastName = $scope.duplicates[index].volName.split(' ')[1] || '';
    };

    $scope.deleteDuplicate = function(index) {
        $scope.duplicates.splice(index, 1);
    };

    $scope.openDuplicate = function($index, $event) {
        $event.stopPropagation();
        $event.preventDefault();
        $scope.duplicates[$index].opened = true;

        var taskDate = new Date($scope.duplicates[$index].fairStartDate);
        limitCalendar(taskDate);
    };

    var limitCalendar = function(taskDate) {
        $timeout(function() {

            var curDate = new Date(angular.element('strong').text().trim());
            if (curDate.getMonth() < taskDate.getMonth()) {
                angular.element('.glyphicon-chevron-left').css('color', '#888');
                angular.element('.glyphicon-chevron-right').css('color', '#3090CD');
            } else if (curDate.getMonth() > taskDate.getMonth()) {
                angular.element('.glyphicon-chevron-left').css('color', '#3090CD');
                angular.element('.glyphicon-chevron-right').css('color', '#888');
            }

            angular.element('.glyphicon-chevron-left').bind('click', function(e) {
                curDate = new Date(angular.element('strong').text().trim());
                if (taskDate.getDate() === 31 || (curDate.getMonth() < taskDate.getMonth())) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                } else if (curDate.getMonth() === taskDate.getMonth()) {
                    angular.element('.glyphicon-chevron-left').css('color', '#888');
                    angular.element('.glyphicon-chevron-right').css('color', '#3090CD');
                }
            });
            angular.element('.glyphicon-chevron-right').bind('click', function(e) {
                curDate = new Date(angular.element('strong').text().trim());
                if (curDate.getMonth() > taskDate.getMonth()) {
                    angular.element('.glyphicon-chevron-right').css('color', '#888');
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                } else if (curDate.getMonth() === taskDate.getMonth()) {
                    angular.element('.glyphicon-chevron-right').css('color', '#888');
                } else if (curDate.getMonth() < taskDate.getMonth()) {
                    angular.element('.glyphicon-chevron-left').css('color', '#3090CD');
                }

            });
        }, 1000);
    };

    $scope.open = function($event) {
        $scope.showButtonBar = false;
        $event.stopPropagation();
        $event.preventDefault();
        $scope.opened = true;

        var taskDate = new Date($scope.task.fairStartDate);
        limitCalendar(taskDate);
    };

    $scope.$watch('task.volName', function(val) {
        if ($scope.task.volName !== undefined) {
            if ($scope.task.volName === '') {
                $scope.noMatch = false;
                console.log("onwatch $scope.noVolunteer = " + $scope.noVolunteer);
                //VMS-1711
                $scope.noVolunteer = true;
                console.log("onwatch $scope.noVolunteer = " + $scope.noVolunteer);
            } else {
                if ($scope.task.volName !== null) {
                    if ($filter('filter')($scope.contactList, {
                            name: $scope.task.volName
                        }).length === 0) {
                        $scope.noMatch = true;
                        //VMS-1624
                        if (!angular.isUndefined($routeParams.action) && $routeParams.action === "update") {
                            $scope.noMatch = false;
                            console.log("onwatch in edit mode" + $scope.noMatch);
                        }
                    } else {
                        $scope.noMatch = false;
                    }
                }
            }
        }

    });

    function parseTime(s) {
        var c = s.split(':');
        return parseInt(c[0]) * 60 + parseInt(c[1]);
    }

    $scope.isGreaterthan12 = function(s, e) {
        var mins;
        if (e === MIDNIGHT || e === '12:00 AM') {
            mins = parseTime('24:00') - parseTime(moment(s, ["h:mm A"]).format("HH:mm"));
        } else {
            mins = parseTime(moment(e, ["h:mm A"]).format("HH:mm")) - parseTime(moment(s, ["h:mm A"]).format("HH:mm"));
        }
        var diff = Math.floor(mins / 60) + '.' + mins % 60;
        var cas = parseFloat(diff);
        if (cas < 0 || cas > 12) {
            return true;
        } else {
            return false;
        }
    };

    $scope.formatAMPM = function(t) {
        var timeAM = t.toLowerCase().indexOf('am');
        var timePM = t.toLowerCase().indexOf('pm');

        if (timeAM !== -1) {
            if (t.charAt(timeAM) !== ' ' && t.indexOf(' ') === -1) {
                return t.substring(0, timeAM) + ' ' + t.substring(timeAM, t.length);
            } else {
                return t;
            }
        }
        if (timePM !== -1) {
            if (t.charAt(timePM) !== ' ' && t.indexOf(' ') === -1) {
                return t.substring(0, timePM) + ' ' + t.substring(timePM, t.length);
            } else {
                return t;
            }
        }
    };

    $scope.IsDateAndTimeBlockChanged = function(taskDetail) {
        var formatterStartTime = $filter('date')(taskDetail.startTime, 'h:mm a');
        var formatterEndTime = $filter('date')(taskDetail.endTime, 'h:mm a');
        if ($scope.thisIsBefore($scope.task.startDate, taskDetail.activityDate) ||
            $scope.thisIsAfter($scope.task.startDate, taskDetail.activityDate)) {
            console.log("start date is changed");
            $scope.overLay = true;
            $scope.taskConfirmPopUp = true;
            $scope.cancelOperation = true;
        } else if ($scope.isAfterTimeBlock($scope.task.start, formatterStartTime) ||
            $scope.isBeforeTimeBlock($scope.task.start, formatterStartTime)) {
            console.log("start time is changed");
            $scope.overLay = true;
            $scope.taskConfirmPopUp = true;
            $scope.cancelOperation = true;
        } else if ($scope.isBeforeTimeBlock($scope.task.end, formatterEndTime) ||
            $scope.isAfterTimeBlock($scope.task.end, formatterEndTime)) {
            console.log("end time is changed");
            $scope.overLay = true;
            $scope.taskConfirmPopUp = true;
            $scope.cancelOperation = true;
        } else {
            $scope.cancelOperation = false;
        }
    };

    $scope.saveDuplicates = function() {
        $scope.runingSaveTask = true;
        var anyTimeVar = false;
        fairId = $window.sessionStorage.getItem('fairId');
        orgId = $window.sessionStorage.getItem('orgId');
        if ($scope.duplicates.length > 0) {
            /*$scope.fair.signupSheetActivities = [];
            fairStore.storeTasks($scope.fair);*/
            var tempFair = {};
            angular.copy($scope.fair, tempFair);
            tempFair.signupSheetActivities = [];
            //tempFair.signupSheetActivities.push(task_data);
        }
        for (var j = 0; j < $scope.duplicates.length; j++) {
            var dup_task_data = {};
            var con_data = {};
            if ($scope.duplicates[j].start === "12:00 AM" && $scope.duplicates[j].end === MIDNIGHT) {
                // 12:00 AM to Midnight
                console.log('saveTask 12:00 AM to Midnight');
                $scope.duplicates[j].end = "12:00 AM";
            }
            var dupStrDate = $filter('date')(new Date($scope.duplicates[j].startDate), 'MM/dd/yyyy');
            if ($scope.duplicates[j].volName === "" && $scope.duplicates[j].firstName === "" && $scope.duplicates[j].lastName === "" && $scope.duplicates[j].email === "") {
                $scope.duplicates[j].noVolunteer = true;
            }
            if ($scope.duplicates[j].noVolunteer === false) {
                if ($scope.duplicates[j].volName.length > 0) {
                    var dupPhoneStr = $scope.duplicates[j].phone;
                    if (!angular.isUndefined(dupPhoneStr) && dupPhoneStr !== null) {
                        dupPhoneStr = dupPhoneStr.replace(/-/g, "");
                        dupPhoneStr = dupPhoneStr.replace('(', '');
                        dupPhoneStr = dupPhoneStr.replace(')', '');
                        console.log("New Phone Str " + dupPhoneStr);
                    }
                }
                if (!angular.isUndefined($scope.duplicates[j].contact) &&
                    $scope.duplicates[j].contact.hasOwnProperty('id') &&
                    $scope.duplicates[j].contact !== null &&
                    $scope.duplicates[j].contact !== '') {
                    con_data = {
                        firstName: $scope.duplicates[j].firstName,
                        lastName: $scope.duplicates[j].lastName,
                        email: $scope.duplicates[j].email,
                        phone: dupPhoneStr,
                        fairId: fairId,
                        schoolId: orgId,
                        groupId: 10,
                        chairPersonId: 1032,
                        id: $scope.duplicates[j].contact.id,
                        transId: $scope.duplicates[j].volunteerExt.transId
                    };
                } else {
                    con_data = {
                        firstName: $scope.duplicates[j].firstName,
                        lastName: $scope.duplicates[j].lastName,
                        email: $scope.duplicates[j].email,
                        phone: dupPhoneStr,
                        fairId: fairId,
                        schoolId: orgId,
                        groupId: 10,
                        chairPersonId: 1032,
                        type: 'Volunteer'
                    };
                }

                dup_task_data = {
                    startTime: $scope.duplicates[j].start,
                    endTime: $scope.duplicates[j].end,
                    eventName: $scope.task.title,
                    volunteerName: $scope.duplicates[j].firstName + ' ' + $scope.duplicates[j].lastName,
                    description: $scope.task.description,
                    activityDate: dupStrDate,
                    anyTime: anyTimeVar,
                    dupsCount: 0,
                    schoolId: orgId,
                    activityId: 0,
                    volunteerEmail: $scope.duplicates[j].email,
                    volunteerPhone: dupPhoneStr,
                    mode: 'Unpub',
                    roleId: $scope.task.roleId,
                    contact: con_data
                };
                //fairStore.updateStore(dup_task_data);
                dup_task_data = fairStore.convertUtcFormat(dup_task_data);
                tempFair.signupSheetActivities.push(dup_task_data);

            } else {
                dup_task_data = {
                    startTime: $scope.duplicates[j].start,
                    endTime: $scope.duplicates[j].end,
                    eventName: $scope.task.title,
                    volunteerName: $scope.duplicates[j].volName === '' ? null : $scope.duplicates[j].volName,
                    description: $scope.task.description,
                    activityDate: dupStrDate,
                    anyTime: anyTimeVar,
                    dupsCount: 0,
                    schoolId: orgId,
                    activityId: 0,
                    mode: 'Unpub',
                    roleId: $scope.task.roleId
                };
                if (!angular.isUndefined($scope.duplicates[j].contact) &&
                    $scope.duplicates[j].contact !== null &&
                    $scope.duplicates[j].contact !== '') {
                    dup_task_data.volunteerEmail = $scope.duplicates[j].contact.email !== null ? $scope.duplicates[j].contact.email : null;
                    dup_task_data.volunteerPhone = $scope.duplicates[j].contact.volunteerExt.phone !== null ? $scope.duplicates[j].contact.volunteerExt.phone : null;
                    dup_task_data.volExtId = $scope.duplicates[j].contact.volunteerExt.transId;
                }
                //fairStore.updateStore(dup_task_data);
                dup_task_data = fairStore.convertUtcFormat(dup_task_data);
                tempFair.signupSheetActivities.push(dup_task_data);
            }
        }
        if ($scope.duplicates.length > 0) {
            tempFair.signupSheetId = $scope.fair.signUpSheetId;
            $http.post(urlprefix + '/volunteer-manager/signupsheet/duplicate/persist', tempFair).then(
                function(data) {
                    console.log("updated duplicate successfully");
                    $scope.fair.signUpSheetId = data.data.signupSheetId;
                    $scope.fair.previousSignUpId = data.data.signupSheetId;
                    if (angular.isDefined(data.data.signupSheetActivities)) {
                        for (var i = 0; i < data.data.signupSheetActivities.length; i++) {
                            fairStore.updateStore(data.data.signupSheetActivities[i]);
                        }
                    }
                    $location.path('/editSchedule/' + $routeParams.orgId + '/' + $routeParams.eventId);
                },
                function(data) {
                    console.error('error!');
                    $scope.error = data.data.errors[0].message;
                    $scope.runingSaveTask = false;
                });


        } else {
            $location.path('/editSchedule/' + $routeParams.orgId + '/' + $routeParams.eventId);
        }
    };

    $scope.saveTask = function(mockError) {
        $scope.runingSaveTask = true;
        // for performance testing of applywidth
        $rootScope.resetDuration();
        // for testing httpErrorLogging by sending
        // requests which generate 400 and 500 errors
        mockError = mockError | false;

        console.log("In saveTask .. " + $scope.taskDetailsFrm.$valid);
        console.log("In saveTask noVolunteer .. " + $scope.noVolunteer);
        console.log("$scope.contact .. %o", $scope.contact);
        $scope.submitted = true;
        $scope.addContactFirstNameError = false;
        $scope.addContactLastNameError = false;
        $scope.addContactEmailError = false;
        signUpSheetId = $window.sessionStorage.getItem('signUpSheetID');
        fairId = $window.sessionStorage.getItem('fairId');
        orgId = $window.sessionStorage.getItem('orgId');
        $scope.fair.startDate = $scope.fair.fairStartDate;
        $scope.fair.endDate = $scope.fair.fairEndDate;
        $scope.fair.fairId = $routeParams.eventId;
        $scope.fair.schoolId = $routeParams.orgId;

        var strDate = $filter('date')(new Date($scope.task.startDate), 'MM/dd/yyyy');

        if ($scope.task.start === "12:00 AM" && $scope.task.end === MIDNIGHT) {
            // 12:00 AM to Midnight
            console.log('saveTask 12:00 AM to Midnight');
            $scope.task.end = MIDNIGHT;
        } else if ($scope.task.start === ANY_TIME && $scope.task.end !== ANY_TIME) {
            // VMS-1516
            $scope.task.end = ANY_TIME;
        }

        if ($scope.taskDetailsFrm.$valid && !($scope.thisIsBefore($scope.task.startDate, $scope.task.maxPastDate)) && !($scope.thisIsAfter($scope.task.startDate, $scope.task.maxFutureDate)) && !$scope.isSameOrAfter($scope.task.start, $scope.task.end) && !($scope.task.start !== ANY_TIME && $scope.task.end === ANY_TIME) && !$scope.wrongTime && !($scope.isGreaterthan12($scope.task.start, $scope.task.end))) {
            // convert task.end = 'Midnight' to end = '12:00 AM'
            if ($scope.task.end === MIDNIGHT) {
                $scope.task.end = "12:00 AM";
            }

            console.log("In saveTask Formvalid .. " + $scope.taskDetailsFrm.$valid);

            var anyTimeVar = false;
            var task_data = {};
            if ($scope.task.start === "Any Time" || $scope.task.end === "Any Time") {
                anyTimeVar = true;
            }
            if ($scope.task.volName === "" && $scope.task.firstName === "" && $scope.task.lastName === "" && $scope.task.email === "") {
                $scope.noVolunteer = true;
            }
            if ($scope.noVolunteer === false) {
                console.log("********* TASKDETAILS with noVolunteer 1 " + $scope.task.firstName + " :: " + $scope.task.lastName + " :: " + $scope.task.email + " :: " + $scope.task.phone);
                if ($scope.task.volName.length > 0) {
                    if (angular.isUndefined($scope.task.firstName) || angular.isUndefined($scope.task.lastName) || angular.isUndefined($scope.task.email) || $scope.task.firstName === "" || $scope.task.lastName === "" || $scope.task.email === "") {
                        console.log("********* TASKDETAILS with noVolunteer 2 " + $scope.task.firstName + " :: " + $scope.task.lastName + " :: " + $scope.task.email + " :: " + $scope.task.phone);

                        if (angular.isUndefined($scope.task.firstName) || $scope.task.firstName === "") {
                            $scope.addContactFirstNameError = true;
                        } else {
                            $scope.addContactFirstNameError = false;
                        }

                        if (angular.isUndefined($scope.task.lastName) || $scope.task.lastName === "") {
                            $scope.addContactLastNameError = true;
                        } else {
                            $scope.addContactLastNameError = false;
                        }

                        if (angular.isUndefined($scope.task.email) || $scope.task.email === "") {
                            $scope.addContactEmailError = true;
                        } else {
                            $scope.addContactEmailError = false;
                        }

                        $scope.runingSaveTask = false;
                        console.log("Incomplete Contact Details .. Returning ..." + $scope.addContactFirstNameError + " " + $scope.addContactLastNameError + " " + $scope.addContactEmailError);
                        return false;
                    }

                    phoneStr = $scope.task.phone;

                    if (!angular.isUndefined(phoneStr) && phoneStr !== null) {
                        phoneStr = phoneStr.replace(/-/g, "");
                        phoneStr = phoneStr.replace('(', '');
                        phoneStr = phoneStr.replace(')', '');
                        console.log("New Phone Str " + phoneStr);
                    }
                }
                if (!angular.isUndefined($scope.contact) &&
                    $scope.contact.hasOwnProperty('id')) {
                    task_data = {
                        firstName: $scope.task.firstName,
                        lastName: $scope.task.lastName,
                        email: $scope.task.email,
                        phone: phoneStr,
                        fairId: fairId,
                        schoolId: orgId,
                        groupId: 10,
                        chairPersonId: 1032,
                        id: $scope.contact.id,
                        transId: $scope.contact.volunteerExt.transId
                    };
                } else {
                    task_data = {
                        firstName: $scope.task.firstName,
                        lastName: $scope.task.lastName,
                        email: $scope.task.email,
                        phone: phoneStr,
                        fairId: fairId,
                        schoolId: orgId,
                        groupId: 10,
                        chairPersonId: 1032,
                        type: 'Volunteer'
                    };
                }
                $http.post(urlprefix + "/volunteer-manager/contact/persist", task_data).then(
                    function(data) {
                        console.log("********* TASKDETAILS with noVolunteer success " + data.data);
                        console.log("********* TASKDETAILS with noVolunteer success " + data.data.contactId);
                        $scope.addContactErrorsMsg = "";
                        $scope.addContactErrors = false;

                        task_data = {
                            startTime: $scope.task.start,
                            endTime: $scope.task.end,
                            eventName: $scope.task.title,
                            volunteerName: $scope.task.firstName + ' ' + $scope.task.lastName,
                            description: $scope.task.description,
                            activityDate: strDate,
                            anyTime: anyTimeVar,
                            dupsCount: 0,
                            schoolId: orgId,
                            volunteerId: data.data.contactId,
                            volExtId: data.data.contactExtId,
                            activityId: $scope.task.activityId,
                            volunteerEmail: $scope.task.email,
                            volunteerPhone: phoneStr,
                            mode: 'Unpub',
                            roleId: $scope.task.roleId
                        };

                        // DJ-httpErrorLogging
                        if (mockError) {
                            task_data = {};
                            console.log('1a mockError', mockError, 'new task_data', task_data);
                        }
                        var reqId,
                            postData = {
                                signUpSheetId: signUpSheetId,
                                fairId: fairId,
                                orgId: orgId,
                                task_data: task_data
                            };
                        // 
                        task_data = fairStore.convertUtcFormat(task_data);
                        var tempFair = {};
                        angular.copy($scope.fair, tempFair);
                        tempFair.signupSheetActivities = [];
                        tempFair.signupSheetActivities.push(task_data);
                        if (angular.isDefined($scope.fair.signUpSheetId) && $scope.fair.signUpSheetId !== null &&
                            $scope.fair.signUpSheetId !== '' && $scope.fair.signUpSheetId !== -1) {
                            tempFair.signupSheetId = $scope.fair.signUpSheetId;
                            reqId = httpErrorLoggingService.setRequestData('ADD task with noVolunteer', 'put', urlprefix + "/volunteer-manager/signupsheet/basic/update", $scope.fair);

                            $http.put(urlprefix + '/volunteer-manager/signupsheet/basic/update', tempFair).then(
                                function(data) {
                                    console.log("updated successfully");
                                    $scope.fair.signUpSheetId = data.data.signupSheetId;
                                    $scope.fair.previousSignUpId = data.data.signupSheetId;
                                    signupSheetService.setId(data.data.signupSheetId);
                                    fairStore.deleteTask(taskDetail);
                                    fairStore.assignSignupId(data.data.signupSheetId);
                                    task_data.activityId = data.data.signupSheetActivities[0].activityId;
                                    if (data.data.signupSheetActivities[0].hasOwnProperty('customRoleId') && data.data.signupSheetActivities[0].customRoleId) {
                                        fairStore.updateCustomRoles(data.data.signupSheetActivities[0]);
                                    }
                                    fairStore.updateStore(task_data);
                                    $scope.saveDuplicates();
                                },
                                function(data) {
                                    console.error('error!');
                                    $scope.error = data.data.errors[0].message;
                                    $scope.runingSaveTask = false;
                                    httpErrorLoggingService.sendRequestData(reqId, data);
                                });

                        } else {
                            $scope.fair.signupSheetId = -1;
                            reqId = httpErrorLoggingService.setRequestData('ADD task with noVolunteer', 'post', urlprefix + "/volunteer-manager/signupsheet/basic/create", $scope.fair);

                            $http.post(urlprefix + '/volunteer-manager/signupsheet/basic/create', tempFair).then(
                                function(data) {
                                    console.log("saved successfully");
                                    $scope.fair.signUpSheetId = data.data.signupSheetId;
                                    $scope.fair.signupSheetId = $scope.fair.signUpSheetId;
                                    $scope.fair.previousSignUpId = data.data.signupSheetId;
                                    signupSheetService.setId(data.data.signupSheetId);
                                    fairStore.assignSignupId(data.data.signupSheetId);
                                    fairStore.deleteTask(taskDetail);
                                    task_data.activityId = data.data.signupSheetActivities[0].activityId;
                                    if (data.data.signupSheetActivities[0].hasOwnProperty('customRoleId') && data.data.signupSheetActivities[0].customRoleId) {
                                        fairStore.updateCustomRoles(data.data.signupSheetActivities[0]);
                                    }
                                    fairStore.updateStore(task_data);
                                    $scope.saveDuplicates();
                                },
                                function(data) {
                                    console.error('error!');
                                    $scope.error = data.data.errors[0].message;
                                    $scope.runingSaveTask = false;
                                    httpErrorLoggingService.sendRequestData(reqId, data);
                                });
                        }
                    },
                    function(data) {
                        $scope.runingSaveTask = false;
                        console.error("********* TASKDETAILS with noVolunteer error " + data.data.errors[0].message);
                        $scope.addContactErrorsMsg = data.data.errors[0].message;
                        $scope.addContactErrors = true;
                    });
            } else {
                console.log("********* TASKDETAILS with Volunteer");
                if (!$scope.noRemove && !$scope.isKeep && angular.isDefined($scope.task.volExtId) &&
                    $scope.task.volExtId !== null &&
                    $scope.task.volExtId !== '') {
                    $scope.IsDateAndTimeBlockChanged(taskDetail);
                } else {
                    $scope.cancelOperation = false;
                }
                if (!$scope.cancelOperation) {
                    task_data = {
                        startTime: $scope.task.start,
                        endTime: $scope.task.end,
                        eventName: $scope.task.title,
                        volunteerName: $scope.task.volName === '' ? null : $scope.task.volName,
                        description: $scope.task.description,
                        activityDate: strDate,
                        anyTime: anyTimeVar,
                        dupsCount: 0,
                        schoolId: orgId,
                        activityId: $scope.task.activityId,
                        mode: 'Unpub',
                        roleId: $scope.task.roleId
                    };
                    if (!angular.isUndefined($scope.contact) && !$scope.noRemove) {
                        task_data.volunteerEmail = $scope.contact.email !== null ? $scope.contact.email : null;
                        task_data.volunteerPhone = $scope.contact.volunteerExt.phone !== null ? $scope.contact.volunteerExt.phone : null;
                        task_data.volExtId = $scope.contact.volunteerExt.transId;
                        $scope.noRemove = false;
                    } else if (!$scope.noRemove && $scope.task.volExtId !== null && $scope.task.volExtId !== '') {
                        task_data.volExtId = $scope.task.volExtId;
                    }
                    if ($scope.noRemove) {
                        task_data.volunteerName = null;
                    }
                    console.log("Tasks ... %o", $scope.task);
                    console.log("********* TASKDETAILS with signUpSheetId " + signUpSheetId + " Fair Id " + fairId + " OrgId " + orgId);

                    // DJ-httpErrorLogging
                    if (mockError) {
                        task_data = {};
                        console.log('2a mockError', mockError, 'new task_data', task_data);
                    }
                    var postData = {
                            signUpSheetId: signUpSheetId,
                            fairId: fairId,
                            orgId: orgId,
                            task_data: task_data
                        },
                        reqId;
                    task_data = fairStore.convertUtcFormat(task_data);
                    var tempFair = {};
                    angular.copy($scope.fair, tempFair);
                    tempFair.signupSheetActivities = [];
                    tempFair.signupSheetActivities.push(task_data);
                    // fairStore.updateStore(task_data);
                    if (angular.isDefined($scope.fair.signUpSheetId) && $scope.fair.signUpSheetId !== null &&
                        $scope.fair.signUpSheetId !== '' && $scope.fair.signUpSheetId !== -1) {
                        tempFair.signupSheetId = $scope.fair.signUpSheetId;
                        reqId = httpErrorLoggingService.setRequestData('ADD task with noVolunteer', 'put', urlprefix + "/volunteer-manager/signupsheet/basic/update", tempFair);

                        $http.put(urlprefix + '/volunteer-manager/signupsheet/basic/update', tempFair).then(
                            function(data) {
                                console.log("updated successfully");
                                $scope.fair.signUpSheetId = data.data.signupSheetId;
                                $scope.fair.previousSignUpId = data.data.signupSheetId;
                                signupSheetService.setId(data.data.signupSheetId);
                                fairStore.assignSignupId(data.data.signupSheetId);
                                fairStore.deleteTask(taskDetail);
                                task_data.activityId = data.data.signupSheetActivities[0].activityId;
                                if (data.data.signupSheetActivities[0].hasOwnProperty('customRoleId') && data.data.signupSheetActivities[0].customRoleId) {
                                    fairStore.updateCustomRoles(data.data.signupSheetActivities[0]);
                                }
                                fairStore.updateStore(task_data);
                                $scope.saveDuplicates();
                            },
                            function(data) {
                                console.error('error!');
                                $scope.error = data.data.errors[0].message;
                                $scope.runingSaveTask = false;
                                httpErrorLoggingService.sendRequestData(reqId, data);
                            });

                    } else {
                        $scope.fair.signupSheetId = -1;
                        reqId = httpErrorLoggingService.setRequestData('ADD task with noVolunteer', 'post', urlprefix + "/volunteer-manager/signupsheet/basic/create", tempFair);

                        $http.post(urlprefix + '/volunteer-manager/signupsheet/basic/create', tempFair).then(
                            function(data) {
                                console.log("saved successfully");
                                $scope.fair.signUpSheetId = data.data.signupSheetId;
                                $scope.fair.signupSheetId = $scope.fair.signUpSheetId;
                                $scope.fair.previousSignUpId = data.data.signupSheetId;
                                signupSheetService.setId(data.data.signupSheetId);
                                fairStore.assignSignupId(data.data.signupSheetId);
                                fairStore.deleteTask(taskDetail);
                                task_data.activityId = data.data.signupSheetActivities[0].activityId;
                                if (data.data.signupSheetActivities[0].hasOwnProperty('customRoleId') && data.data.signupSheetActivities[0].customRoleId) {
                                    fairStore.updateCustomRoles(data.data.signupSheetActivities[0]);
                                }
                                fairStore.updateStore(task_data);
                                $scope.saveDuplicates();
                            },
                            function(data) {
                                console.error('error!');
                                $scope.error = data.data.errors[0].message;
                                $scope.runingSaveTask = false;
                                httpErrorLoggingService.sendRequestData(reqId, data);
                            });
                    }
                }
            }

        } else {
            $scope.runingSaveTask = false;
            console.log("In saveTask Form not valid .. " + $scope.taskDetailsFrm.$valid);
        }
    };

    //
    // MAIN
    //

    $("#cpt_header-holder").hide();
    $("#cpt_footer-holder").hide();
    dumble.setDumbleData('ChairPerson:Task Details', 'Landing Page', '', '', 1, '', '', '', '');

    // $scope.startDateSensitivity is just for testing max past and future date validations
    var startDateSensitivity = 30; //this should be 30 days.
    if (!angular.isUndefined($routeParams.orgId)) {
        signupSheetService.setOrgId($routeParams.orgId);
        orgId = $routeParams.orgId;
    }
    if (!angular.isUndefined($routeParams.eventId)) {
        signupSheetService.setFairId($routeParams.eventId);
    }
    var signUpSheetId = $window.sessionStorage.getItem('signUpSheetID');
    var fairId = $window.sessionStorage.getItem('fairId');
    orgId = $window.sessionStorage.getItem('orgId');

    if (!angular.isUndefined($routeParams.action) && $routeParams.action === "update") {
        $scope.task = signupSheetService.getTaskDetails();
        console.log("In Edit unpub %o", $scope.task);
        $scope.task.dups = '1';
        $scope.task.startDate = $filter('date')(new Date($scope.task.startDate), 'MM/dd/yyyy');
        $scope.dupsHide = true;
        if (!angular.isUndefined($scope.contact)) {
            $scope.contact.id = $scope.task.volunteerId;
            if (!angular.isUndefined($scope.contact.volunteerExt)) {
                $scope.contact.volunteerExt.transId = $scope.task.volExtId;
            } else {
                $scope.contact.volunteerExt = {};
                $scope.contact.volunteerExt.transId = $scope.task.volExtId;
            }
        } else {
            $scope.contact = {};
            $scope.contact.id = $scope.task.volunteerId;
            if (!angular.isUndefined($scope.contact.volunteerExt)) {
                $scope.contact.volunteerExt.transId = $scope.task.volExtId;
            } else {
                $scope.contact.volunteerExt = {};
                $scope.contact.volunteerExt.transId = $scope.task.volExtId;
            }
        }
        console.log("$scope.contact EDIT MODE %o", $scope.contact);
        console.log("$scope.dupsHide " + $scope.dupsHide);
    }

    var taskDetail = $scope.$eval($window.sessionStorage.getItem('taskDetail'));
    $scope.fair = fairStore.getStoreTasks();

    if (angular.isDefined(taskDetail)) {
        $scope.task = taskDetail;
        $scope.task.start = $filter('date')(taskDetail.startTime, 'h:mm a');
        $scope.task.end = $filter('date')(taskDetail.endTime, 'h:mm a');
        $scope.task.title = taskDetail.eventName;
        $scope.task.startDate = taskDetail.activityDate;
        $scope.task.volName = taskDetail.volunteerName;
        $window.sessionStorage.setItem('taskDetail', "");
    } else if (angular.isUndefined($routeParams.action)) {
        $scope.task.start = timeandDay.hour;
        $scope.task.end = timeandDay.hourNext;
        $scope.task.startDate = $filter('date')(new Date(timeandDay.day.dateYear), 'MM/dd/yyyy');
    }

    if (angular.isDefined($scope.fair)) {
        $scope.task.fairStartDate = $scope.fair.fairStartDate;
        $scope.task.fairEndDate = $scope.fair.fairEndDate;
    }

    if (timeandDay === null) {
        var d = new Date();
        // Default to today if none is provided.
        timeandDay = {
            hour: ANY_TIME,
            day: {
                dat: $filter('date')(new Date(), 'MM/dd'),
                dateYear: $filter('date')(new Date(), 'MM/dd/yyyy'),
                day: $filter('date')(new Date(), 'EEE')
            }
        };
        timeandDay.fairStartDate = moment(new Date($scope.task.fairStartDate)).format("MM/DD/YYYY");
        timeandDay.fairEndDate = moment(new Date($scope.task.fairEndDate)).format("MM/DD/YYYY");
    }

    // DJ VMS-1132 fair start date validation logic
    if (timeandDay) {
        // ?? DJ TODO: timeandDay.fairStartDate and timeandDay.fairEndDate not set", $scope.task;
        if (timeandDay.fairStartDate) {
            $scope.task.maxPastDate = moment(timeandDay.fairStartDate, "MM/DD/YYYY")
                .subtract(29, "days").format("MM/DD/YYYY");
            var leftArrow = angular.element('.uib-left');
            leftArrow.css('visibility', 'hidden');
        } else {
            $scope.fairStartDate = moment(new Date($scope.task.fairStartDate), "MM/DD/YYYY")
                .subtract(29, "days").format("MM/DD/YYYY");

        }
        if (timeandDay.fairEndDate) {
            $scope.task.maxFutureDate = moment(timeandDay.fairEndDate, "MM/DD/YYYY")
                .add(startDateSensitivity, "days").format("MM/DD/YYYY");
            var rightArrow = angular.element('.uib-right');
            rightArrow.css('visibility', 'hidden');
        } else {
            $scope.fairEndDate = moment(new Date($scope.task.fairEndDate), "MM/DD/YYYY")
                .subtract(startDateSensitivity, "days").format("MM/DD/YYYY");
        }
        $scope.task.mode = timeandDay.mode;
        console.log("^^^ Setting Mode to " + $scope.task.mode);
    } else {
        console.log("no time and date? timeandDay=", timeandDay);
    }

    $scope.contactList = fairStore.getContactsList();

    var path = urlprefix + '/volunteer-manager/contact/' + orgId + '/' + fairId;
    var crmId = $window.sessionStorage.getItem('CrmId');
    var ContactType = $window.sessionStorage.getItem('ContactType');
    var SpsId = $window.sessionStorage.getItem('SpsId');

    if (angular.isDefined(crmId) && crmId !== null) {
        path = path + "/" + crmId;
    }
    if (angular.isDefined(ContactType) && ContactType !== null) {
        path = path + "/" + ContactType;
    }
    if (angular.isDefined(SpsId) && SpsId !== null) {
        path = path + "/" + SpsId;
    }

    $http.get(path + '/' + false).then(
        function(data) {
            $scope.contactList = data.data.volunteers;
            if ($scope.contactList !== []) {
                angular.forEach($scope.contactList, function(con) {
                    con.name = con.volunteerExt.firstName + ' ' + con.volunteerExt.lastName;
                });
            }
            fairStore.setContactsList($scope.contactList);
        });

}]);
