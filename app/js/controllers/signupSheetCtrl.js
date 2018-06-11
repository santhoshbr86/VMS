(function() {
    "use strict";
    var app = angular.module('signupSheetModule', []);
    var MIDNIGHT = 'MIDNIGHT';
    app.controller('signupSheetController', ['$scope', '$http', '$location', '$window', "signupSheetService", "$q", "$routeParams", '$rootScope', '$timeout', '$filter', 'fairStore', 'socialMediaService', "timeandtaskSheet", 'dumble', 'contactService', 'urlprefix', 'teamsite', '$document', function($scope, $http, $location, $window, signupSheetService, $q, $routeParams, $rootScope, $timeout, $filter, fairStore, socialMediaService, timeandtaskSheet, dumble, contactService, urlprefix, teamsite, $document) {
        $scope.showOverlay = false;
        $scope.showPublishNow = false;
        $scope.showMessageSent = false;
        $scope.showViewAssigned = false;
        $scope.showDeleteTask = false;
        $scope.showMessageSent = false;
        $scope.showWarning5xx = false;
        $scope.showMessageSent = false;
        $scope.submitted = false;
        $scope.showPublish = true;
        $scope.showFBError = false;
        $scope.showFBErrorPublishNow = false;
        $scope.showCopyError = false;
        $scope.showDeleteMsg = false;
        $scope.fbError = socialMediaService.getFBError();
        $scope.selectedPastFair = "";
        $scope.orgId = $routeParams.orgId;
        $scope.eventId = $routeParams.eventId;
        $scope.isPublishedNow = false;
        $scope.groupList = []; // VMS-1642 Adding to populate group list
        $scope.signupSheets = {};
        $scope.assignTaskDetails = {};
        $scope.curSignupSheetId;
        $scope.nofairPopover = false;
        $scope.include = {
            top: teamsite + '/VOL510_vol_top.html',
            middle: teamsite + '/VOL510_middle.html',
            video: teamsite + '/VOL500.html',
            noFairMsg: teamsite + '/VOL550_noFairMsg.html',
            createSheetTitle: teamsite + '/createNewfairTitle.html',
            blankSheetbuttonTagline: teamsite + '/blankSheetbuttonTagline.html',
            pastsheetbuttonTagline: teamsite + '/pastsheetbuttonTagline.html',
            deleteSignUpMsg: teamsite + '/deleteSignUpSheet.html',
            calendarView: '/partials/calendar-view-dashboard.html',
            shareOverlay: teamsite + '/Share_Overlay.html'
        };
        if ('parentIFrame' in $window) {
            $window.parentIFrame.scrollTo(0, 0);
        }

        //vms-2497 toggling class.
        $scope.toggleClass = function(status) {
            if (status === 'PUBLISHED_W_UNPUBLISHED_ACT') {
                return 'col-md-5';
            } else {
                return 'col-md-9';
            }
        };

        // VMS-1517
        $scope.goToMessages = function(tempFair) {
            contactService.getGroups($scope.orgId, $scope.eventId)
                .then(function(response) {
                    $scope.groupList = response.data.userGroups;
                    $scope.defaultGroupList = response.data.defaultGroups;
                    $scope.usrGroups = contactService.getUserGroups(response.data);
                    if ($scope.$parent !== null) {
                        $scope.$parent.groupList = response.data.userGroups;
                    }
                    return contactService.getContacts($routeParams.orgId, $routeParams.eventId);
                })
                .then(function(response) {
                    if (!tempFair) {
                        console.error('tempFair is empty, make sure you are in the right scope');
                    }
                    // VMS - 1642 Creating tmpGroup to remove the empty group
                    var tmpGroup = [];
                    angular.forEach($scope.groupList, function(group) {
                        if (group.id !== 10) {
                            tmpGroup.push(group);
                        }
                    });
                    // VMS - 1642 Populating the groups
                    $window.sessionStorage.setItem('allgroups', JSON.stringify(tmpGroup));
                    $window.sessionStorage.setItem('fairDetails', JSON.stringify(tempFair));
                    $window.sessionStorage.removeItem('emailcontacts');
                    $location.path('/volunteers/invite/' + $scope.orgId + '/' + $scope.eventId);
                })
                .catch(function(response) {
                    console.error('getting groups failed, redirecting to main page.');
                    if (response.status >= 400 && response.status < 500) {
                        $scope.$parent.showWarning4xx = true;
                    }
                    if (response.status >= 500 && response.status < 600) {
                        $scope.$parent.showWarning5xx = true;
                    }
                });
        };

        $scope.socialShare = function(signupSheetId) {
            $window.sessionStorage.setItem('fairMask', signupSheetId);
            $location.path('/volunteers/share/' + $scope.orgId + '/' + $scope.eventId);
        };

        $scope.goToContacts = function() {
            $location.path('/contacts/all/' + $scope.orgId + '/' + $scope.eventId);
        };

        $scope.createSheetRedirect = function(orgId, eventId) {
            signupSheetService.clearId();
            fairStore.clearStoreTasks();
            //$location.path('/volunteers/schedule/' + orgId + '/' + eventId + '/new');
            $location.path('/volunteers/builder/' + orgId + '/' + eventId + '/-1/new');
        };

        $scope.loadPastSheetRedirect = function(fair, selectedPastFair) {
            if (selectedPastFair === "") {
                $scope.nofairPopover = true;
            } else {
                $scope.nofairPopover = false;
                signupSheetService.clearId();
                signupSheetService.setPastfairId(selectedPastFair);
                fairStore.clearStoreTasks();
                //$location.path('/volunteers/schedule/' + $routeParams.orgId + '/' + $routeParams.eventId + '/new');
                $location.path('/volunteers/builder/' + $routeParams.orgId + '/' + $routeParams.eventId + '/' + selectedPastFair + '/new');
            }
        };

        $scope.hidePopover = function() {
            $scope.nofairPopover = false;
        };

        $scope.loadSheetRedirect = function(orgId, eventId, signUpSheetId) {
            $rootScope.resetDuration();
            signupSheetService.setId(signUpSheetId);
            signupSheetService.setFairId(eventId);
            signupSheetService.setOrgId(orgId);
            fairStore.storeTasks([]);
            //$location.path('/volunteers/schedule/' + orgId + '/' + eventId);
            $location.path('/volunteers/builder/' + orgId + '/' + eventId + '/' + signUpSheetId);
        };

        $scope.printSignupSheet = function(sid) {
            console.log("in printSignupSheet with " + sid);
            if (angular.isDefined($window._satellite)) {
                $window._satellite.track('invite_twitter');
            }
            $window.open('/#/signupsheet/print/' + sid, '_blank');
        };

        $scope.publishNow = function(eventId) {
            $scope.showOverlay = true;
            $scope.showPublishNow = true;

            signupSheetService.publishFair(eventId).then(
                function(data) {
                    $scope.reloadEverything();
                    console.log(data);
                },
                function(data) {
                    console.error('something went wrong in publishNow controller!');
                });
        };

        // Reloads the main controller, and the subcontroller that holds the calendar.
        $scope.reloadEverything = function() {
            $scope.main();
            $rootScope.$broadcast('id', $scope.signupSheets.active[0].signUpSheetId);
        };
        if (fairStore.getPublishedFlag()) {
            $scope.showPublishNow = true;
            $scope.showOverlay = true;
        }
        $scope.closePopUp = function() {
            if ($scope.showPublishNow) {
                $scope.main();
                $scope.signupSheets.active[0].status = 'PUBLISHED';
            }
            fairStore.setPublishedFlag(false);
            $scope.showOverlay = false;
            $scope.showPublishNow = false;
            $scope.showViewAssigned = false;
            $scope.showMessageSent = false;
            $scope.showDeleteTask = false;
            $scope.showFBError = false;
            $scope.showFBErrorPublishNow = false;
        };

        // NOTE: there is a duplicate function of this in signupSheetAddController
        $scope.openAssigned = function(task, orgId, fairId, signUpSheetId) {
            console.log("openAssigned signupSheet");
            console.log('signupSheetController');
            $scope.showOverlay = true;
            $scope.showViewAssigned = true;

            $scope.assignTaskDetails.activityId = task.activityId;
            $scope.assignTaskDetails.orgId = orgId;
            $scope.assignTaskDetails.fairId = fairId;
            $scope.assignTaskDetails.signUpSheetId = signUpSheetId;
            $scope.assignTaskDetails.title = task.eventName;
            $scope.assignTaskDetails.description = task.description;
            $scope.assignTaskDetails.volName = task.volunteerName;
            $scope.assignTaskDetails.volunteerId = task.volunteerId;
            $scope.assignTaskDetails.volExtId = task.volExtId;
            $scope.assignTaskDetails.startDate = task.activityDate;
            $scope.assignTaskDetails.comments = task.comments;
            $scope.assignTaskDetails.volunteerEmail = task.volunteerEmail;
            $scope.assignTaskDetails.start = $filter('date')(task.startTime, 'h:mm a');
            $scope.assignTaskDetails.end = $filter('date')(task.endTime, 'h:mm a');
            if ($scope.assignTaskDetails.start === '12:00 AM' && $scope.assignTaskDetails.end === '12:00 AM') {
                $scope.assignTaskDetails.start = 'Any Time';
                $scope.assignTaskDetails.end = 'Any Time';
            } else if ($scope.assignTaskDetails.start !== '12:00 AM' && $scope.assignTaskDetails.end === '12:00 AM') {
                //midnight
                $scope.assignTaskDetails.end = MIDNIGHT;
            }

            $scope.assignTaskDetails.volunteerPhone = task.volunteerPhone;

            $scope.assignTaskDetails.fairStartDate = $scope.signupSheets.active[0].startDate;
            $scope.assignTaskDetails.fairEndDate = $scope.signupSheets.active[0].endDate;
            console.log("First Screen Edit Schedule");
            if (!angular.isUndefined(timeandtaskSheet) && timeandtaskSheet !== null) {
                console.log("Resetting Mode ..");
                timeandtaskSheet.resetMode();
                console.log("Reset Mode");
            }
            signupSheetService.setFairId(fairId);
            signupSheetService.setOrgId(orgId);
            signupSheetService.setId(signUpSheetId);
        };

        // NOTE: There is a duplicate function of this in signupSheetAddController
        $scope.editTask = function() {
            // DJ VMS-1132 fair start date validation logic
            console.log("$$$$$1 editTask {}", $scope.assignTaskDetails);
            signupSheetService.setTaskDetails($scope.assignTaskDetails);
            $location.path("/tasks/update");
        };

        // NOTE: There is a duplicate function of this in signupSheetAddController
        $scope.deleteTask = function(task) {
            console.log("1 In delete Task ... %o", task);
            $http.delete(urlprefix + "/volunteer-manager/signupsheet/activity/" + task.activityId).then(
                function(data) {
                    console.log("task " + task.activityId + " deleted");
                    console.log("New Redirecting to " + "/volunteers/" + $routeParams.orgId + "/" + $routeParams.eventId);
                    $scope.closePopUp();
                    $scope.reloadEverything();
                },
                function(data) {
                    console.error('failed to remove task');
                    $scope.error = data.data.errors[0].message;
                });
        };

        // NOTE: There is a duplicate function of this in signupSheetAddController
        $scope.deleteTaskConfirm = function() {
            $scope.showViewAssigned = false;
            $scope.showDeleteTask = true;
        };

        $scope.viewSignUpSheet = function(fair) {
            signupSheetService.setId(fair.signUpSheetId);
            console.log("Opening CP View SignupSheet ...");
            $window.open(fair.address, '_blank');
        };

        $scope.deleteSignUpSheet = function() {
            $http.put(urlprefix + "/volunteer-manager/signupsheet/delete/" + $scope.curSignupSheetId).then(
                function(data) {
                    console.log("successfully deleted");
                    $scope.showDeleteMsg = false;
                    $window.location.reload();
                },
                function(data) {
                    $scope.showDeleteMsg = false;
                    console.log("delete signup sheet failed");

                });
        };

        $scope.closeDeletePopUp = function() {
            $scope.showDeleteMsg = false;
        };

        $scope.openDeletePopUp = function(signUpSheetId) {
            console.log("signUpSheet  id is: " + signUpSheetId);
            $scope.curSignupSheetId = signUpSheetId;
            $scope.showDeleteMsg = true;
        };

        //Social Media - Start
        $scope.openFBStatic = function(signUpSheetId) {
            if (!socialMediaService.fbHasSDK()) {
                $scope.showOverlay = true;
                $scope.showFBError = true;
                return;
            }
            socialMediaService.fbShare($window.location.protocol + '//' + $window.location.host + '/#/experience/login/' + signUpSheetId);
        };

        $scope.openFBPublishNow = function(signUpSheetId) {
            if (!socialMediaService.fbHasSDK()) {
                $scope.showFBErrorPublishNow = true;
                return;
            }
            socialMediaService.fbShare($window.location.protocol + '//' + $window.location.host + '/#/experience/login/' + signUpSheetId);
        };

        $scope.openTwitter = function(signUpSheetId) {
            console.log("in openTwitter() with sid " + signUpSheetId);
            socialMediaService.twShare('https://' + $window.location.hostname, 'It\'s Book Fair time! We need volunteers. View my sign-up sheet.', "https://volunteer.scholastic.com/#/experience/login/" + signUpSheetId);
        };

        $rootScope.$on('redirectToVolunteers', function(e) {
            console.log('Time to show Sent message Pop Up');
            $scope.signupSheets.active[0].status = 'PUBLISHED';
            $timeout(function() {
                $scope.showOverlay = true;
                $scope.showMessageSent = true;
            }, 500);
        });

        // NOTE: There is a duplicate of this
        $scope.copyUrl = function() {
            // DJ VMS-1458 copyURL Safari
            var copySuccess = false;
            $scope.showCopyError = !$document[0].queryCommandSupported('copy');
            if (!$scope.showCopyError) {
                console.log('VMS-1458 showCopyError', $scope.showCopyError);
            }
            var url = $document[0].getElementById("fairaddress");
            console.log("In copyfieldvalue with url " + url.value);
            url.focus();
            url.setSelectionRange(0, url.value.length);
            try {
                copySuccess = $document[0].execCommand("copy");
                console.log("Copied url " + url.value + " to clipboard " + copySuccess);
            } catch (e) {
                console.log("Not able to copy url to clipboard " + e);
            }
        };

        //
        // MAIN
        //
        $scope.main = function() {
            // VMS-2425 Store the crmid/type/spsid
            if (angular.isDefined($routeParams.crmid)) {
                $window.sessionStorage.setItem('CrmId', $routeParams.crmid);
            }
            if (angular.isDefined($routeParams.type)) {
                $window.sessionStorage.setItem('ContactType', $routeParams.type);
            }
            if (angular.isDefined($routeParams.spsid)) {
                $window.sessionStorage.setItem('SpsId', $routeParams.spsid);
            }

            // VMS-2148 This stops a flickering after you publish a fair.
            if ($scope.signupSheets.active) {
                $scope.signupSheets.active[0].status = 'PUBLISHED';
            }
            $scope.signupSheets = signupSheetService.getsignupsheetStore();

            if (!angular.isUndefined($routeParams.crmid) && !angular.isUndefined($routeParams.type) && !angular.isUndefined($routeParams.spsid)) {
                signupSheetService.getSignupSheetsByCrmIdTypeSpsId($routeParams.orgId, $routeParams.eventId, $routeParams.crmid, $routeParams.type, $routeParams.spsid).then(
                    function(response) {
                        // only allow the first active fair to be used
                        response.data.active = response.data.active.splice(0, 1);
                        $scope.signupSheets = response.data;
                        signupSheetService.setsignupsheetStore(response.data);
                        dumble.setDumbleData('Chair Person:Create signup', 'Landing Page', '', 'BFC', 1, '', '', '', '');
                    },
                    function(response) {
                        $scope.showWarning5xx = true;
                        console.error('failure getting signupSheets: ', response);
                    });
            } else if (!angular.isUndefined($routeParams.crmid) && !angular.isUndefined($routeParams.type) && angular.isUndefined($routeParams.spsid)) {
                signupSheetService.getSignupSheetsByCrmIdType($routeParams.orgId, $routeParams.eventId, $routeParams.crmid, $routeParams.type).then(
                    function(response) {
                        // only allow the first active fair to be used
                        response.data.active = response.data.active.splice(0, 1);
                        $scope.signupSheets = response.data;
                        signupSheetService.setsignupsheetStore(response.data);
                        dumble.setDumbleData('Chair Person:Create signup', 'Landing Page', '', 'BFC', 1, '', '', '', '');
                    },
                    function(response) {
                        $scope.showWarning5xx = true;
                        console.error('failure getting signupSheets: ', response);
                    });
            } else {
                signupSheetService.getSignupSheets($routeParams.orgId, $routeParams.eventId).then(
                    function(response) {
                        // only allow the first active fair to be used
                        response.data.active = response.data.active.splice(0, 1);
                        $scope.signupSheets = response.data;
                        signupSheetService.setsignupsheetStore(response.data);
                        dumble.setDumbleData('Chair Person:Create signup', 'Landing Page', '', 'BFC', 1, '', '', '', '');
                    },
                    function(response) {
                        $scope.showWarning5xx = true;
                        console.error('failure getting signupSheets : ', response);
                    });
            }

        };

        $scope.main();
    }]);

    app.controller('signupSheetBuilderController', ['$scope', '$http', '$location', '$window', "$routeParams", 'dumble', 'contactService', 'urlprefix', 'teamsite', "$q", "signupSheetService", "$timeout", 'fairStore', function($scope, $http, $location, $window, $routeParams, dumble, contactService, urlprefix, teamsite, $q, signupSheetService, $timeout, fairStore) {
        $scope.fair = {};
        $scope.susData = {};
        $scope.include = {
            top: teamsite + '/VOL400_top.html',
            middle: teamsite + '/VOL600_desc.html',
            fairMoveMessage: teamsite + '/VOL400_Publish.html',
            editBasicInfo: teamsite + '/VOL400_Information.html',
            editVolSchedule: teamsite + '/VOL400_Schedule.html',
            editContactInfo: teamsite + '/VOL400_Contact.html',
            basicTop: teamsite + '/VOL400_volunteer.html',
            right: teamsite + '/VOL400_right.html',
        };
        $scope.showPublishNow = false;
        $scope.isPublishedNow = false;
        $scope.cancel = function() {
            $location.path('/volunteers/' + $routeParams.orgId + "/" + $routeParams.eventId);
        };
        $scope.loadEditSchedule = function() {
            fairStore.clearStoreTasks();
            $window.sessionStorage.setItem('susData', JSON.stringify($scope.susData));
            $location.path('/editSchedule/' + $routeParams.orgId + "/" + $routeParams.eventId);
        };
        $scope.loadEditInfo = function() {
            $window.sessionStorage.setItem('susData', JSON.stringify($scope.susData));
            $location.path('/editBasicInfo/' + $routeParams.orgId + "/" + $routeParams.eventId);
        };
        $scope.loadContactInfo = function() {
            $window.sessionStorage.setItem('susData', JSON.stringify($scope.susData));

            contactService.getGroups($routeParams.orgId, $routeParams.eventId)
                .then(function(response) {
                    $scope.groupList = response.data.userGroups;
                    $scope.defaultGroupList = response.data.defaultGroups;
                    $scope.usrGroups = contactService.getUserGroups(response.data);
                    if ($scope.$parent !== null) {
                        $scope.$parent.groupList = response.data.userGroups;
                    }
                    return contactService.getContacts($routeParams.orgId, $routeParams.eventId);
                })
                .then(function(response) {
                    var tmpGroup = [];
                    angular.forEach($scope.groupList, function(group) {
                        if (group.id !== 10) {
                            tmpGroup.push(group);
                        }
                    });
                    // VMS - 1642 Populating the groups
                    // $window.sessionStorage.setItem('allgroups', JSON.stringify(tmpGroup));
                    $window.sessionStorage.removeItem('emailcontacts');
                    $location.path('/editContactInfo/' + $routeParams.orgId + "/" + $routeParams.eventId);
                })
                .catch(function(response) {
                    console.error('getting groups failed, redirecting to main page.');
                    if (response.status >= 400 && response.status < 500) {
                        $scope.$parent.showWarning4xx = true;
                    }
                    if (response.status >= 500 && response.status < 600) {
                        $scope.$parent.showWarning5xx = true;
                    }
                });
        };

        $http.get(urlprefix + '/volunteer-manager/signupsheet/basic/info/' + $routeParams.orgId + "/" + $routeParams.eventId + "/" + $routeParams.sid).then(
            function(data) {
                $scope.susData = data.data;
                $scope.susData.previousSignUpId = $routeParams.sid;
                $scope.fair.fairStartDate = moment(data.data.fairStartDate).format("MM/DD");
                $scope.fair.fairEndDate = moment(data.data.fairEndDate).format("MM/DD/YY");
                if ($scope.susData.eventName.length > 34) {
                    angular.element('.editSection').css('top', '170px');
                }
                if ($scope.susData.description === '') {
                    $http.get(urlprefix + '/volunteer-manager/signupsheet/message').then(
                        function(resp) {
                            $scope.susData.description = resp.data.message;
                        },
                        function(data) {
                            console.error('failed to get admin volunteer roles');
                        });
                }
                /** open panel for first activity **/
                $timeout(function() {
                    angular.element('.activityPanel .panel-body:first').addClass('show');
                    angular.element('.activityPanel .glyphicon-menu-down:first').addClass('hide');
                    angular.element('.activityPanel .glyphicon-menu-up:first').addClass('show');
                }, 1000);

                dumble.setDumbleData('Volunteer:Signup sheet Builder', 'Landing Page', '',
                    'BFC', 1, $scope.susData.schoolName, $scope.susData.eventName,
                    $scope.susData.schoolName, '');
            },
            function(data) {
                console.error('error!');
            });



        function centerPublishNow(e) {
            var popUp = angular.element('.publishNow');
            if (e.target.classList[3] === 'custom-margin') {
                popUp.css('top', e.clientY);
            } else {
                popUp.css('top', '70%');
            }
        }

        $scope.publishNow = function(eventId, redirectFlag) {
            signupSheetService.publishFair(eventId).then(
                function(data) {
                    $scope.susData.status = 'PUBLISHED';
                    if (redirectFlag === 'Y') {
                        fairStore.setPublishedFlag(true);
                        $scope.cancel();
                    }
                    console.log(data);
                },
                function(data) {
                    console.error('something went wrong in publishNow controller!');
                });
        };

    }]);

    app.controller('volunteersExperienceSignupController', ['$scope', '$http', '$location', 'signupSheetService', '$routeParams', 'dumble', 'urlprefix', function($scope, $http, $location, signupSheetService, $routeParams, dumble, urlprefix) {
        $scope.volExpData = {};
        var signUpSheetId = signupSheetService.getId();

        //
        // MAIN
        //
        $http.get(urlprefix + '/volunteer-manager/chairperson/experience/published/' + $routeParams.sid).then(
            function(data) {
                $scope.volExpData = data.data;
                dumble.setDumbleData('ChairPerson:View Signup', 'Landing Page', '',
                    'BFC', 1, $scope.volExpData.schoolName, $scope.volExpData.eventName,
                    $scope.volExpData.schoolName, $scope.volExpData.fairStartEndRange);
            },
            function(data) {
                console.error('error!');
            });
    }]);

    app.controller('volunteersExperienceLoginController', ['$scope', '$http', '$location', 'signupSheetService', '$routeParams', '$route', '$rootScope', '$window', 'dumble', 'urlprefix', 'teamsite', function($scope, $http, $location, signupSheetService, $routeParams, $route, $rootScope, $window, dumble, urlprefix, teamsite) {
        signupSheetService.hideHeaderAndFooter();
        $scope.include = {
            noSignupSheetMsg: teamsite + '/noSignupSheetMsg.html',
        };
        $scope.showWarningForInvalidData = 'N';
        $scope.showWarning5xx = false;
        $scope.volExpData = {};
        $scope.taskList = [];
        $scope.getSignUpResponse = false;
        $scope.spsUserDet = {};
        $scope.addActivity = function(act, ind) {
            act.volunteerId = $scope.spsUserDet.volId;
            act.volExtId = $scope.spsUserDet.volExtId;
            $scope.taskList.push(act);
            console.log($scope.taskList);
        };

        $scope.removeActivity = function(activity) {
            for (var i = 0; i < $scope.taskList.length; i++) {
                if ($scope.taskList[i].activityId === activity.activityId) {
                    activity.comments = "";
                    $scope.taskList.splice(i, 1);
                }
            }
        };

        $scope.getSignupSheetActivities = function() {
            var urlSignup = null;
            if ($location.url().indexOf('register') !== -1) {
                urlSignup = urlprefix + '/volunteer-manager/volunteer/experience/activity/signup/' + signUpSheetId + '/' + true;
            } else {
                urlSignup = urlprefix + '/volunteer-manager/volunteer/experience/activity/signup/' + signUpSheetId + '/' + false;
            }
            $http.get(urlSignup).then(
                function(data) {
                    console.log(data);
                    if (data.data.message !== undefined && data.data.message === 'redirect') {
                        signupSheetService.setId(data.data.signUpSheetId);
                        $rootScope.$broadcast('userlogged', data.data);
                        $location.path('/experience/login/' + data.data.requestParamList[0]);
                    } else {
                        $scope.volExpData = data.data;
                        if ($scope.volExpData.signupSheetId === "0") {
                            $scope.showWarningForInvalidData = 'Y';
                        }
                        $scope.getSignUpResponse = true;
                        $scope.spsUserDet = data.data.spsUserReturn;
                        $rootScope.$broadcast('userlogged', data.data);
                        dumble.setDumbleData('Volunteer Signup', 'Landing Page', $scope.volExpData.spsUserReturn.spsId,
                            'Volunteer', 1, $scope.volExpData.schoolName, $scope.volExpData.eventName,
                            $scope.volExpData.schoolName, $scope.volExpData.fairStartEndRange);
                    }
                    signupSheetService.showHeaderAndFooter();
                },
                function(data) {
                    console.error('error!');
                    $scope.getSignUpResponse = true;
                    $scope.showWarningForInvalidData = 'Y';
                    $scope.volExpData = data.data;
                    signupSheetService.showHeaderAndFooter();
                    $rootScope.$broadcast('userlogged', data.data);
                    //$location.path('/experience/dashboard');
                });
        };

        $scope.redirectTologin = function() {
            $rootScope.$broadcast('userlogged', {});
            $location.path('/experience/login/' + signUpSheetId);
        };

        $scope.signUpActivitiesForVolunteer = function() {
            var signupSheetActivitiesBean = {
                signupSheetActivities: $scope.taskList
            };
            $http.post(urlprefix + '/volunteer-manager/volunteer/experience/signup/' + signUpSheetId, signupSheetActivitiesBean).then(
                function(data) {
                    console.log('success ' + JSON.stringify(data.data));
                    $window.localStorage.setItem('volSignUpData', JSON.stringify(data.data));

                    if (data.data.organizerInfo === null) {
                        // "organizerInfo":{
                        //  "id":21258,
                        //  "fairId":3572428,
                        //  "schoolId":66,
                        //  "email":"qadenise.isaac@floyd.kyschools.usqa",
                        //  "firstName":"Denise",
                        //  "lastName":"Isaac",
                        //  "phone":null
                        // }
                        // DJ VMS-1634 Patch
                        var organizerInfoObj = {};
                        organizerInfoObj.fairId = data.data.organizerInfo.fairId | $scope.volExpData.fairId | $window.localStorage.getItem('fairId') | null;
                        organizerInfoObj.id = data.data.organizerInfo.id | null;
                        organizerInfoObj.schoolId = data.data.organizerInfo.schoolId | $scope.volExpData.schoolId | null;
                        organizerInfoObj.email = data.data.organizerInfo.email | null;
                        organizerInfoObj.firstName = data.data.organizerInfo.firstName | null;
                        organizerInfoObj.lastName = data.data.organizerInfo.lastName | null;
                        organizerInfoObj.phone = data.data.organizerInfo.phone | null;
                        organizerInfoObj.showEmail = data.data.organizerInfo.showEmail | null;
                        organizerInfoObj.showPhone = data.data.organizerInfo.showPhone | null;

                        data.data.organizerInfo = organizerInfoObj;
                    }

                    var volId = data.data.signupSheetActivities[0].volunteerId;
                    var fairId = data.data.organizerInfo.fairId;
                    var cpId = data.data.organizerInfo.id;
                    var schoolId = data.data.organizerInfo.schoolId;

                    /*$http.get(urlprefix + '/volunteer-manager/signupsheet/signupemails/' + signUpSheetId).then(
                        function(data) {

                            console.log("Can Send Signup Emails : " + data.data);

                            if (data.data === true) {*/

                    // Send SignUp Emails To ChairPerson

                    var signup_template_data = {
                        orgId: schoolId,
                        businessEventId: fairId,
                        volunteerId: volId,
                        managerId: cpId, // TODO : DJ VMS-1634 Patch
                        maskedSignUpSheetId: signUpSheetId
                    };

                    console.log("Signup Template Date : %o " + signup_template_data);

                    $http.post(urlprefix + '/volunteer-manager/create/template/signup', signup_template_data).then(
                        function(data) {

                            console.log("Signup Template Data : " + data);

                            $http.post(urlprefix + "/volunteer-manager/volunteer/sendemails", data.data).then(
                                function(data) {
                                    console.log("Success in Sending Signup Emails");
                                },
                                function(data) {
                                    console.error("Failure in Sending Signup Emails");
                                });
                        },
                        function(data) {
                            console.error('error!');
                        });
                    /*} else {
                                console.log("Not Allowed to Send Signup Emails");
                            }
                        },
                        function(data) {
                            console.error('error!');
                        });*/

                    //Send Thank You Email

                    var thankyou_template_data = {
                        orgId: schoolId,
                        businessEventId: fairId,
                        volunteerId: volId,
                        managerId: cpId, // TODO : DJ VMS-1634
                        maskedSignUpSheetId: signUpSheetId,
                    };

                    $http.post(urlprefix + '/volunteer-manager/create/template/thankyou', thankyou_template_data).then(
                        function(data) {
                            console.log("thank you template data : %o " + data.data);
                            $http.post(urlprefix + "/volunteer-manager/volunteer/sendemails", data.data).then(
                                function(data) {
                                    console.log("Success in Sending Thank You Emails");
                                },
                                function(data) {
                                    console.error("Failure in Sending Thank You Emails");
                                });
                        });

                    $location.path('/experience/signup/thankyou/' + signUpSheetId);
                },
                function(data) {
                    console.error('failure sumbit');
                    $scope.showWarning5xx = true;
                });
        };

        $scope.cancelSignUpActivityForVolunteer = function(activity, signUpSheetInfo) {
            var volId = activity.volunteerId;
            var volunteerCancelBean = {
                activityId: activity.activityId
            };
            $http.put(urlprefix + '/volunteer-manager/volunteer/experience/cancel', volunteerCancelBean).then(
                function(data) {

                    //if (signUpSheetInfo.cancelEmailRequired === 'Y') {
                    var cancel_template_data = {
                        orgId: signUpSheetInfo.organizerInfo.schoolId,
                        businessEventId: signUpSheetInfo.organizerInfo.fairId,
                        activityId: activity.activityId,
                        managerId: signUpSheetInfo.organizerInfo.id,
                        maskedSignUpSheetId: signUpSheetId,
                        volunteerId: volId
                    };
                    $http.post(urlprefix + '/volunteer-manager/create/template/cancel', cancel_template_data).then(
                        function(data) {
                            console.log('Cancel Template Data : %o ', data.data);

                            $http.post(urlprefix + "/volunteer-manager/volunteer/sendemails", data.data).then(
                                function(data) {
                                    console.log("Success in Sending Cancel Emails");
                                },
                                function(data) {
                                    console.error("Failure in Sending Cancel Emails");
                                });
                        },
                        function(data) {
                            console.error('error!');
                        });
                    //}

                    //TODO: DJ AJ Pretty awful hack
                    //$window.location.reload();

                },
                function(data) {
                    console.error('error!');
                });
        };

        $scope.viewDashboard = function(id, signUpId) {
            $location.path('/experience/dashboard/' + signUpId + '/' + id);
        };

        //
        // MAIN
        //
        var signUpSheetId = null;
        if ($routeParams.sid !== undefined) {
            signUpSheetId = $routeParams.sid;
        } else {
            signUpSheetId = signupSheetService.getId();
        }

        $scope.getSignupSheetActivities();

    }]);

    app.controller('thankyouVolunteerSignUpController', ['$scope', '$http', '$location', 'signupSheetService', '$window', 'socialMediaService', 'urlprefix', 'teamsite', 'twilioService', '$rootScope', function($scope, $http, $location, signupSheetService, $window, socialMediaService, urlprefix, teamsite, twilioService, $rootScope) {
        signupSheetService.showHeaderAndFooter();
        $scope.volSignUpActData = {};
        $scope.showWarning5xx = false;
        $scope.showOverLay = false;
        $scope.submitted = false;
        $scope.reminderSubmit = false;
        $scope.twilioBean = {};
        $scope.userHasPhoneDetails = false;
        $scope.volSignUpActData = JSON.parse($window.localStorage.getItem('volSignUpData'));
        $scope.dateFormat = "MM/DD/YYYY";
        $scope.isincludeLoaded = false;
        $scope.textRemiderView = true;
        $scope.include = {
            top: teamsite + "/VOL250_ThankYou.html",
            textReminder1: teamsite + "/VOL250_NeedPhone.html",
            checkbox1: teamsite + "/VOL250_Checkbox1.html",
            textReminder2: teamsite + "/VOL250_TextReminder.html",
            checkbox2: teamsite + "/VOL250_Checkbox2.html",
            VOL250_Alerts: teamsite + "/VOL250_Alerts.html",
            VOL250_NoText: teamsite + "/VOL250_NoText.html",
            VOL250_YesText: teamsite + "/VOL250_YesText.html",
            VOL250_TextTerms: teamsite + "/VOL250_TextTerms.html",
            VOL250_TextRemError: teamsite + "/VOL250_TextRemError.html",
        };
        $scope.bottomCheckbox = false;
        $scope.topCheckbox = false;
        $scope.fbError = socialMediaService.getFBError();
        $scope.bottom = {};
        $scope.bottom.Useroption = 0;
        $scope.textRemiderError = false;
        $scope.finishLoading = function() {
            $scope.isincludeLoaded = true;
        };
        /*
        dumble.setDumbleData('Volunteer Thankyou', 'Success Page',
            $scope.volSignUpActData.spsUserReturn.spsId,
            'Volunteer', 1, $scope.volSignUpActData.schoolName, $scope.volSignUpActData.eventName,
            $scope.volSignUpActData.schoolName, $scope.volSignUpActData.fairStartEndRange);
            */

        console.log('the thank you data: %o', $scope.volSignUpActData);

        $scope.printSignUpData = function() {
            $window.open('/#/experience/signup/print', '_blank');
        };

        //Social Media - Start
        $scope.openFaceBookThankYou = function() {
            console.log("In angular openFaceBook ...");
            if (!socialMediaService.fbHasSDK()) {
                $scope.showOverLay = true;
                return;
            }
            socialMediaService.fbShare('http://www.scholastic.com/bookfairs/findafair');
        };


        $scope.openTwitterThankYou = function() {
            console.log(":In angular openTwitter ...");
            socialMediaService.twShare('https://' + $window.location.hostname, 'Get involved in volunteering, find more details and schools in your area.', 'http://www.scholastic.com/fair');
        };
        //Social Media - End

        $scope.closePopUp = function() {
            $scope.showOverLay = false;
        };

        $scope.viewDashboard = function(id, signUpId) {
            $location.path('/experience/dashboard/' + signUpId + '/' + id);
        };
        $scope.resetError = function() {
            if (!$scope.topCheckbox) {
                $scope.submitted = false;
            }
            if (!$scope.bottomCheckbox) {
                $scope.reminderSubmit = false;
            }
        };

        function animateTop() {
            angular.element('body,html').animate({
                scrollTop: "0px"
            }, 500);
        }
        $scope.offSubmit = function() {
            $scope.submitted = false;
        };
        $scope.savePhoneDetails = function(volId, schoolId) {
            $scope.submitted = true;
            $scope.reminderSubmit = false;
            if ($scope.updatePhone.$valid) {
                console.log("phone number is: " + $scope.updatePhone.phone.$modelValue);
                var signupSheetActivityBean = {
                    volunteerId: volId,
                    schoolId: schoolId,
                    volunteerPhone: $scope.updatePhone.phone.$modelValue
                };
                $http.put(urlprefix + '/volunteer-manager/signupsheet/volunteer/phone/update', signupSheetActivityBean).then(
                    function(data) {
                        console.log(data);
                        $scope.volSignUpActData.signupSheetActivities[0].volunteerPhone = $scope.updatePhone.phone.$modelValue;
                        $window.localStorage.setItem('volSignUpData', JSON.stringify($scope.volSignUpActData));
                    },
                    function(data) {
                        $scope.showWarning5xx = true;
                        console.error('failed to update phone number.');
                    });
            }
        };
        twilioService.getTwilioBean().then(
            function(data) {
                $scope.twilioBean = data.data;
            },
            function(data) {
                console.error('get twilioBean failed');
            });
        $scope.validateUserOptedPhoneNumber = function(volExtId) {
            $http.get(urlprefix + '/volunteer-manager/sms/phone/' + volExtId).then(
                function(data) {
                    console.log(data.data);
                    $scope.userHasPhoneDetails = data.data.hasOptInPhones;
                    if ($scope.userHasPhoneDetails === true) {
                        $scope.twilioBean.phoneNumber = null;
                        $scope.saveTextreminderMessage(volExtId);
                    } else {
                        console.log(data.data.hasOptInPhones);
                    }
                },
                function(data) {
                    console.error('failed to get optin phone number response.');
                });
        };
        $scope.saveTextreminderMessage = function(volExtId) {
            var optObj = {};
            optObj.phone = $scope.twilioBean.phoneNumber;
            optObj.optInOrOptOut = $scope.bottom.Useroption;
            optObj.userExtId = volExtId;
            $http.post(urlprefix + '/volunteer-manager/sms/optinout', optObj).then(
                function(data) {
                    console.log("saved successfully");
                    $scope.textRemiderView = false;
                },
                function(data) {
                    console.error('error!');
                });
        };
        $scope.saveTextreminder = function(volExtId) {
            $scope.submitted = false;
            if ($scope.textReminder.$valid && $scope.bottom.Useroption) {
                $scope.twilioBean.phoneNumber = $scope.textReminder.phoneNumber.$modelValue;
                $http.post(urlprefix + '/volunteer-manager/twilio/validation', $scope.twilioBean).then(
                    function(data) {
                        if (angular.isDefined(data.data) && data.data.statusMessage !== 'success') {
                            $scope.textRemiderError = true;
                            animateTop();
                        } else if (angular.isDefined(data.data) && data.data.statusMessage === 'success') {
                            $scope.textRemiderView = false;
                            $scope.textRemiderError = false;
                            $scope.saveTextreminderMessage(volExtId);
                        }
                    },
                    function(data) {
                        console.error('error!');
                        if (angular.isDefined(data.data) && data.data.errors[0].message !== 'success') {
                            $scope.textRemiderError = true;
                            animateTop();
                        }
                    });
            } else if ($scope.bottom.Useroption) {
                $scope.reminderSubmit = true;
                $scope.textRemiderError = false;
                animateTop();
            } else if (!$scope.bottom.Useroption) {
                $scope.reminderSubmit = false;
                $scope.textRemiderError = false;
                $scope.textReminder.phoneNumber.$modelValue = '';
                $scope.validateUserOptedPhoneNumber(volExtId);
                $scope.textRemiderView = false;
            }

        };
    }]);
    app.controller('printVolunteerSignUpController', ['$scope', '$http', '$location', '$window', 'dumble', 'signupSheetService', function($scope, $http, $location, $window, dumble, signupSheetService) {
        $scope.volSignUpActData = {};
        signupSheetService.hideHeaderAndFooter();
        $scope.volSignUpActData = JSON.parse($window.localStorage.getItem('volSignUpData'));

        //
        // MAIN
        //

        dumble.setDumbleData('Volunteer Thankyou Print', 'Print Page',
            $scope.volSignUpActData.spsUserReturn.spsId,
            'Volunteer', 1, $scope.volSignUpActData.schoolName, $scope.volSignUpActData.eventName,
            $scope.volSignUpActData.schoolName, $scope.volSignUpActData.fairStartEndRange);
    }]);

    app.controller('signupUrlController', ['$scope', '$http', '$location', 'signupSheetService', '$routeParams', function($scope, $http, $location, signupSheetService, $routeParams) {
        //
        // MAIN
        //
        console.log("signupUrlController sid " + $routeParams.sid);
        $location.path('/experience/signup/' + $routeParams.sid);
    }]);

    app.controller('volunteerDashboardController', ['$scope', '$window', '$http', '$location', 'signupSheetService', '$routeParams', '$rootScope', 'dumble', 'urlprefix', 'teamsite', function($scope, $window, $http, $location, signupSheetService, $routeParams, $rootScope, dumble, urlprefix, teamsite) {
        $scope.volDashBoardData = {};
        signupSheetService.hideHeaderAndFooter();
        $scope.getDashResponse = false;
        $scope.showWarning5xx = false;
        $scope.include = {
            top: teamsite + "/VOL100_Dashboard.html",
        };

        $scope.redirectTologin = function() {
            $rootScope.$broadcast('userlogged', {});
            var urlRegister = "/experience/login";
            if ($routeParams.sid !== undefined) {
                urlRegister = urlRegister + "/" + $routeParams.sid;
            }
            $location.path(urlRegister);
        };

        $scope.viewSignUp = function(id) {
            console.log('info ::: ' + id);
            $location.path('/experience/signup/' + id);
        };

        $scope.callMyAccount = function() {
            $window.open($window.MY_SCHOLASTIC_HOST + '/my-scholastic/profile/my-profile.html', '_blank');
        };

        $scope.cancelSignUpActivity = function(activity, signUpSheetInfo) {
            var volunteerCancelBean = {
                activityId: activity.activityId,
                volunteerId: $routeParams.vid
            };

            $http.put(urlprefix + '/volunteer-manager/volunteer/experience/dashboard/cancel', volunteerCancelBean).then(
                function(data) {
                    //if (signUpSheetInfo.cancelEmailRequired === 'Y') {
                    var cancel_template_data = {
                        orgId: signUpSheetInfo.organizerInfo.schoolId,
                        businessEventId: signUpSheetInfo.organizerInfo.fairId,
                        activityId: activity.activityId,
                        managerId: signUpSheetInfo.organizerInfo.id,
                        signUpSheetId: signUpSheetInfo.signupSheetId,
                        volunteerId: $routeParams.vid
                    };

                    $http.post(urlprefix + '/volunteer-manager/create/template/cancel', cancel_template_data).then(
                        function(data) {

                            console.log('Cancel Template Data : %o ', data.data);

                            $http.post(urlprefix + "/volunteer-manager/volunteer/sendemails", data.data).then(
                                function(data) {
                                    console.log("Success in Sending Cancel Emails");
                                },
                                function(data) {
                                    console.error("Failure in Sending Cancel Emails");
                                });
                        });
                    //}
                },
                function() {
                    console.error('error!');
                });
        };

        $scope.updateActivityList = function(activity, index, parentIndex, parentparentInd) {
            $scope.volDashBoardData.currentSignupSheetMessageList[parentparentInd].orderedsignupSheetActivities[parentIndex].signupSheetActivities.splice(index, 1);
            var actLength = $scope.volDashBoardData.currentSignupSheetMessageList[parentparentInd].orderedsignupSheetActivities[parentIndex].signupSheetActivities.length;
            if (actLength === 0) {
                $scope.volDashBoardData.currentSignupSheetMessageList[parentparentInd].orderedsignupSheetActivities.splice(parentIndex, 1);
            }
            var parentListLength = $scope.volDashBoardData.currentSignupSheetMessageList[parentparentInd].orderedsignupSheetActivities.length;
            var f = $scope.volDashBoardData.currentSignupSheetMessageList[parentparentInd].signupSheetActivities;
            for (var i = 0; i < f.length; i++) {
                if (f[i].activityId === activity.activityId) {
                    f.splice(i, 1);
                    break;
                }
            }
            if (parentListLength === 0) {
                var ele = angular.element('.panel-body');
                ele.removeClass('show');
                ele.addClass('hide');
            }
            $scope.$digest();
        };

        $scope.updateOtherFairsActivityList = function(activity, index, parentIndex, parentparentInd) {
            $scope.volDashBoardData.signupSheetMessageList[parentparentInd].orderedsignupSheetActivities[parentIndex].signupSheetActivities.splice(index, 1);
            var actLength = $scope.volDashBoardData.signupSheetMessageList[parentparentInd].orderedsignupSheetActivities[parentIndex].signupSheetActivities.length;
            if (actLength === 0) {
                $scope.volDashBoardData.signupSheetMessageList[parentparentInd].orderedsignupSheetActivities.splice(parentIndex, 1);
            }
            var parentListLength = $scope.volDashBoardData.signupSheetMessageList[parentparentInd].orderedsignupSheetActivities.length;
            var f = $scope.volDashBoardData.signupSheetMessageList[parentparentInd].signupSheetActivities;
            for (var i = 0; i < f.length; i++) {
                if (f[i].activityId === activity.activityId) {
                    f.splice(i, 1);
                    break;
                }
            }
            if (parentListLength === 0) {
                var ele = angular.element('.panel-body');
                ele.removeClass('show');
                ele.addClass('hide');
            }
            $scope.$digest();
        };

        //
        // MAIN
        //
        var signupSheetActivitiesBean = {};
        var url = "";
        if ($routeParams.sid !== undefined && $routeParams.vid !== undefined) {
            url = "/volunteer-manager/volunteer/experience/dashboard/fairs/all/" + $routeParams.sid + "/" + $routeParams.vid;
        } else {
            url = "/volunteer-manager/volunteer/experience/dashboard/logged/user/all";
        }
        $http.get(urlprefix + url, signupSheetActivitiesBean).then(
            function(data) {
                if (data.data.message !== undefined && data.data.message === 'redirect') {
                    $rootScope.$broadcast('userlogged', data.data);
                    if ($routeParams.sid !== undefined) {
                        $location.path('/experience/login/' + data.data.requestParamList[0]);
                    } else {
                        $location.path('/experience/login');
                    }
                } else {
                    $scope.volDashBoardData = data.data;
                    $scope.getDashResponse = true;
                    $rootScope.$broadcast('userlogged', data.data);
                    dumble.setDumbleData('Volunteer Dashboard', 'Landing Page',
                        $scope.volDashBoardData.spsUserReturn.spsId,
                        'Volunteer', 1, '', '', '', '');
                }
                signupSheetService.showHeaderAndFooter();
            },
            function(data) {
                console.error('error!');
                $scope.getDashResponse = true;
                $scope.showWarning5xx = true;
                signupSheetService.showHeaderAndFooter();
                $rootScope.$broadcast('userlogged', data.data);
            });
    }]);

    app.controller('volunteersActivityPreviewCtrl', ['$scope', '$http', '$location', 'signupSheetService', '$routeParams', 'dumble', 'urlprefix', function($scope, $http, $location, signupSheetService, $routeParams, dumble, urlprefix) {
        $scope.volExpData = {};
        var signUpSheetId = signupSheetService.getId();

        //
        // MAIN
        //

        $http.get(urlprefix + '/volunteer-manager/chairperson/activity/preview/' + $routeParams.sid).then(
            function(data) {
                $scope.volExpData = data.data;
                dumble.setDumbleData('ChairPerson:Preview Signup', 'Landing Page', '',
                    'BFC', 1, $scope.volExpData.schoolName, $scope.volExpData.eventName,
                    $scope.volExpData.schoolName, $scope.volExpData.fairStartEndRange);
            },
            function(data) {
                console.error('error!');
            });
    }]);

    app.controller('signupSheetCarousel', ['$scope', '$http', '$window', 'teamsite', function($scope, $http, $window, teamsite) {
        $("#cpt_header-holder").hide();
        $("#cpt_footer-holder").hide();
        $scope.include.VOL500_description = teamsite + '/VOL500_description.html';

        var carouseloverLay = $window.angular.element('.carouselWrap');
        var carouselEle = $window.angular.element('.carousel');

        $scope.CloseCarousel = function() {
            carouseloverLay.hide();
            carouselEle.hide();
            $window.localStorage.setItem('sessionSignupsheetOverlay', true);
        };

        $scope.donotShowOverLay = function() {
            $window.localStorage.setItem('signupsheetOverlay', true);
        };

        if (JSON.parse($window.localStorage.getItem('signupsheetOverlay')) === true || JSON.parse($window.localStorage.getItem('sessionSignupsheetOverlay')) === true) {
            carouseloverLay.hide();
            carouselEle.hide();
        }

        $(window).unload(function() {
            $window.localStorage.removeItem('sessionSignupsheetOverlay');
        });
    }]);

    app.controller('shareController', ['$scope', '$location', 'signupSheetService', '$window', "$routeParams", 'socialMediaService', 'urlprefix', function($scope, $location, signupSheetService, $window, $routeParams, socialMediaService, urlprefix) {
        $scope.orgId = $routeParams.orgId;
        $scope.eventId = $routeParams.eventId;
        $scope.fbError = socialMediaService.getFBError();
        $scope.showOverlay = false;
        $scope.showFBError = false;
        $scope.maskedSignUpStr = $window.sessionStorage.getItem('fairMask');
        $window.sessionStorage.removeItem('fairMask');

        $scope.gotoVolunteers = function() {
            $location.path('/volunteers/' + $routeParams.orgId + '/' + $routeParams.eventId);
        };

        $scope.fbBookfairs = function() {
            var fair = signupSheetService.getsignupsheetStore().fairURL;
            socialMediaService.fbShare(urlprefix + '/partials/social-media-proxy-bookfairs.html?fair=' + fair);
        };

        $scope.twBookfairs = function() {
            var fair = signupSheetService.getsignupsheetStore().fairURL;
            socialMediaService.twShare('', "A heartfelt thanks to everyone who helped us host a successful Book Fair. " + urlprefix + "/partials/social-media-proxy-bookfairs.html?fair=" + fair);
        };

        //Social Media - Start
        $scope.openFBStatic = function(signUpSheetId) {
            if (!socialMediaService.fbHasSDK()) {
                $scope.showOverlay = true;
                $scope.showFBError = true;
                return;
            }
            socialMediaService.fbShare($window.location.protocol + '//' + $window.location.host + '/#/experience/login/' + signUpSheetId);
        };

        $scope.openTwitter = function(signUpSheetId) {
            console.log("in openTwitter() with sid " + signUpSheetId);
            socialMediaService.twShare('https://' + $window.location.hostname, 'It\'s Book Fair time! We need volunteers. View my sign-up sheet.', urlprefix + "/#/experience/login/" + signUpSheetId);
        };

        $scope.closePopUp = function() {
            $scope.showOverlay = false;
            $scope.showFBError = false;
        };
    }]);

})();
