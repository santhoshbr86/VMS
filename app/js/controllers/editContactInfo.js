var app = angular.module('editContactInfo', []);
app.controller('editContactInfo', ['$scope', '$filter', '$timeout', 'teamsite', '$compile', '$routeParams', '$rootScope', 'dumble', '$location', 'emailAddress', '$window', 'urlprefix', 'signupSheetService', function($scope, $filter, $timeout, teamsite, $compile, $routeParams, $rootScope, dumble, $location, emailAddress, $window, urlprefix, signupSheetService) {
    $scope.fair = $scope.$eval($window.sessionStorage.getItem('susData'));
    $scope.submitted = false;
    var tempContacts = JSON.parse($window.sessionStorage.getItem('allContacts'));
    var emailPattern = /^[a-z]+[a-z0-9._\-\']+@[a-z]+\.[a-z.]{2,5}$/i;
    var addedEmails = [];
    $scope.defAllCon = [];
    $scope.selectedEmails = [];
    $scope.currFairGrp = [];
    $scope.actualConCount = null;
    $scope.allConsel = false;
    $scope.emailnotValid = false;
    $scope.emailExist = false;
    $scope.include = {
        VOL420_top: teamsite + '/VOL420_top.html',
        VOL420_email: teamsite + '/VOL420_email.html',
        VOL420_phone: teamsite + '/VOL420_phone.html',
        VOL420_sendto: teamsite + '/VOL420_Sendto.html'
    };

    /*Navigations*/
    $scope.gotoVolunteers = function() {
        $location.path('/volunteers/' + $routeParams.orgId + '/' + $routeParams.eventId);
    };

    $scope.stepBack = function() {
        var appendUrlStr = $scope.fair.previousSignUpId;
        if (appendUrlStr === -1) {
            appendUrlStr = appendUrlStr + '/new';
        }
        $location.path('/volunteers/builder/' + $routeParams.orgId + '/' + $routeParams.eventId + '/' + appendUrlStr);
    };

    $scope.isEmail = function(email) {
        return email.match(emailPattern);
    };

    $scope.editFormSubmit = function() {
        $scope.submitted = true;
        $scope.fair.startDate = $scope.fair.fairStartDate;
        $scope.fair.endDate = $scope.fair.fairEndDate;
        $scope.fair.fairId = $routeParams.eventId;
        $scope.fair.schoolId = $routeParams.orgId;

        var emailAlerts = [];
        angular.forEach($scope.selectedEmails, function(obj) {
            var selectedContact = $filter('filter')($scope.contactList, {
                'id': Number(obj)
            }, true);

            if (selectedContact.length > 0) {
                if (!angular.isDefined(selectedContact[0].email)) {
                    /** it's a group **/
                    angular.forEach(selectedContact[0].volunteerIds, function(grpObj) {

                        var selectedGroupContact = $filter('filter')($scope.contactList, {
                            'id': Number(grpObj.volId)
                        }, true);

                        var objCheck = $filter('filter')(emailAlerts, {
                            'email': selectedGroupContact[0].email
                        }, true);

                        if (objCheck.length === 0) {
                            /** it's not already updated in emailAlerts **/
                            var emailGrpObj = {};
                            emailGrpObj.email = selectedGroupContact[0].email;
                            if (angular.isDefined(selectedGroupContact[0].volunteerExt) &&
                                angular.isDefined(selectedGroupContact[0].volunteerExt.transId)) {
                                emailGrpObj.volExtId = selectedGroupContact[0].volunteerExt.transId;
                            }
                            emailAlerts.push(emailGrpObj);

                        }
                    });
                } else {
                    var emailObj = {};
                    emailObj.email = selectedContact[0].email;
                    if (angular.isDefined(selectedContact[0].volunteerExt) &&
                        angular.isDefined(selectedContact[0].volunteerExt.transId)) {
                        emailObj.volExtId = selectedContact[0].volunteerExt.transId;
                    }
                    emailAlerts.push(emailObj);
                }
            }
        });
        $scope.fair.signupSheetEmailAlerts = emailAlerts;

        if ($scope.contactInfo.$valid) {
            console.log($scope.fair);
            var editBasicInfoPayload = angular.copy($scope.fair);
            $scope.fair.signupSheetActivities = [];
            if (angular.isDefined($scope.fair.signUpSheetId) && $scope.fair.signUpSheetId !== null &&
                $scope.fair.signUpSheetId !== '' && $scope.fair.signUpSheetId !== -1) {
                $scope.fair.signupSheetId = $scope.fair.signUpSheetId;
                //$http.put(urlprefix + '/volunteer-manager/signupsheet/basic/update', $scope.fair).then(
                signupSheetService.basicUpdate($scope.fair).then(
                    function(data) {
                        console.log("updated successfully");
                        $scope.fair.signUpSheetId = data.data.signupSheetId;
                        $scope.fair.previousSignUpId = data.data.signupSheetId;
                        $scope.stepBack();
                    },
                    function(data) {
                        console.error('error!');
                    });
            } else {
                if (angular.isUndefined($scope.fair.signupSheetId) && $scope.fair.previousSignUpId !== '-1') {
                    $scope.fair.signupSheetActivities = signupSheetService.updateSchoolId(editBasicInfoPayload.signupSheetActivities, $routeParams.orgId);
                }
                $scope.fair.signupSheetId = -1;
                //$http.post(urlprefix + '/volunteer-manager/signupsheet/basic/create', $scope.fair).then(
                signupSheetService.basicCreate($scope.fair).then(
                    function(data) {
                        console.log("saved successfully");
                        $scope.fair.signUpSheetId = data.data.signupSheetId;
                        $scope.fair.previousSignUpId = data.data.signupSheetId;
                        $scope.stepBack();
                    },
                    function(data) {
                        console.error('error!');
                    });
            }
        }
    };

    $scope.select2Options = {
        allowClear: true,
        multiple: true,
        autoComplete: true,
        formatNoMatches: function(term) {
            var message;
            if (term.indexOf(',') > -1 || term.indexOf(';') > -1) {
                message = '<a href="javascript:void(0);" ng-click="addEmail()">Click to add email addresses: "' + term + '"</a>';
            } else {
                message = '<a href="javascript:void(0);" ng-click="addEmail()">Click to add email address: "' + term + '"</a>';
            }
            $timeout(function() {
                $scope.noResultsTag = term;
            }, 0);
            return message;
        }
    };

    $scope.isExist = function(email) {
        var isExist = false;
        for (var k = 0; k < $scope.contactList.length; k++) {
            if ($scope.contactList[k].email === email) {
                isExist = true;
                break;
            } else {
                isExist = false;
            }
        }
        return isExist;
    };

    $scope.addEmail = function() {
        $scope.noResultsTag = $scope.noResultsTag.replace(/(?!\s+$)\s+/g, ",");
        $scope.noResultsTag = $scope.noResultsTag.replace(/[';']/g, ",");
        if ($scope.noResultsTag.indexOf(',') > -1 ||
            $scope.noResultsTag.indexOf(';') > -1 || $scope.noResultsTag.indexOf(' ') > -1) {

            var emails, validEmailsCount;

            if ($scope.noResultsTag.indexOf(',') > -1) {
                emails = $scope.noResultsTag.split(',');
            } else if ($scope.noResultsTag.indexOf(';') > -1) {
                emails = $scope.noResultsTag.split(';');
            } else {
                emails = $scope.noResultsTag.split(' ');
            }

            validEmailsCount = emails.length;

            for (var i = 0; i < emails.length; i++) {
                var email;
                if (emails[i].indexOf('<') > -1) {
                    email = emails[i].substring(emails[i].indexOf('<') + 1, emails[i].indexOf('>')).trim();
                } else {
                    email = emails[i].trim();
                }

                if ($scope.isEmail(email)) {
                    if (!$scope.isExist(email)) {
                        $scope.contactList.push({
                            id: $scope.contactList.length,
                            email: email,
                            name: email
                        });
                        $scope.emailExist = false;
                    } else {
                        $scope.emailExist = true;
                    }

                    $('.select2-drop-active').hide();
                    $('.select2-drop-mask').hide();
                    $('.select2-drop').hide();
                    $('.select2-container').removeClass('select2-container-active');
                    $('.select2-container').removeClass('select2-dropdown-open');
                } else {
                    validEmailsCount--;
                }
            }

            $scope.$watch('contactList', function(newVal, oldVal) {
                for (var j = 1; j <= validEmailsCount; j++) {
                    $scope.selectedEmails.push($scope.contactList.length - j);
                    addedEmails.push($scope.contactList[$scope.contactList.length - j]);
                }
            });

        } else if ($scope.noResultsTag.trim().indexOf('<') > -1) {
            /** for sigle mail copied from gmail or yahoo **/
            var singleEmail = $scope.noResultsTag.trim().substring($scope.noResultsTag.indexOf('<') + 1,
                $scope.noResultsTag.indexOf('>')).trim();

            if ($scope.isEmail(singleEmail.trim())) {
                if (!$scope.isExist(singleEmail)) {
                    $scope.contactList.push({
                        id: $scope.contactList.length,
                        email: singleEmail,
                        name: singleEmail
                    });
                    $scope.emailExist = false;
                } else {
                    $scope.emailExist = true;
                }
                $('.select2-drop-active').hide();
                $('.select2-drop-mask').hide();
                $('.select2-drop').hide();
                $('.select2-container').removeClass('select2-container-active');
                $('.select2-container').removeClass('select2-dropdown-open');

                $scope.$watch('contactList', function(newVal, oldVal) {
                    $scope.selectedEmails.push($scope.contactList.length - 1);
                    addedEmails.push($scope.contactList[$scope.contactList.length - 1]);
                });

            }
        } else if ($scope.isEmail($scope.noResultsTag.trim())) {
            if (!$scope.isExist($scope.noResultsTag.trim())) {
                $scope.contactList.push({
                    id: $scope.contactList.length,
                    email: $scope.noResultsTag.trim(),
                    name: $scope.noResultsTag.trim()
                });
                $scope.emailExist = false;
            } else {
                $scope.emailExist = true;
            }

            $('.select2-drop-active').hide();
            $('.select2-drop-mask').hide();
            $('.select2-drop').hide();
            $('.select2-container').removeClass('select2-container-active');
            $('.select2-container').removeClass('select2-dropdown-open');
            $scope.$watch('contactList', function(newVal, oldVal) {
                $scope.selectedEmails.push($scope.contactList.length - 1);
                addedEmails.push($scope.contactList[$scope.contactList.length - 1]);
            });
        } else {
            $scope.emailnotValid = true;
            $timeout(function() {
                $scope.emailnotValid = false;
            }, 4000);
        }
    };

    $scope.$watch('noResultsTag', function(newVal, oldVal) {
        if (newVal && newVal !== oldVal) {
            $timeout(function() {
                var noResultsLink = $('.select2-no-results');
                $compile(noResultsLink.contents())($scope);
            });
        }
    }, true);

    $scope.updateSelection = function() {
        $scope.allConsel = false;
        $scope.emailExist = false;
    };

    $scope.$watch('groupExpand', function(newValue, oldValue) {
        if (!newValue) {
            return;
        }
        var newObj = JSON.parse(newValue);
        if (newValue !== undefined && $scope.groupExpand !== null) {
            var grpID = JSON.parse(newValue);
            if ($scope.grpList !== null) {
                for (var j = 0; j < $scope.grpList.length; j++) {
                    if (parseInt(grpID.id) === $scope.grpList[j].id) {
                        $scope.selectedEmails.splice(grpID.ind, 1);
                        // $scope.selectedEmails.push('');
                        // i--;
                        if ($scope.grpList[j].volunteerIds !== null) {
                            for (var k = 0; k < $scope.grpList[j].volunteerIds.length; k++) {
                                $scope.selectedEmails.push($scope.grpList[j].volunteerIds[k].volId);
                            }
                        }
                    }
                }

            }
            if (newObj.text === 'Current Fair Volunteers' && $scope.currFairGrp !== null && $scope.currFairGrp.length > 0) {
                for (var e = 0; e < $scope.selectedEmails.length; e++) {
                    if ($scope.currFairGrp[0].id === parseInt($scope.selectedEmails[e])) {
                        $scope.selectedEmails.splice(e, 1);
                        $scope.selectedEmails.push('');
                        e--;
                        if ($scope.currFairGrp[0].volunteerIds !== null) {
                            for (var f = 0; f < $scope.currFairGrp[0].volunteerIds.length; f++) {
                                $scope.selectedEmails.push($scope.currFairGrp[0].volunteerIds[f].volId);
                            }
                        }
                    }
                }
            }
            if (newObj.text === 'All Contacts' && $scope.allContactDef !== null) {
                for (var c = 0; c < $scope.selectedEmails.length; c++) {
                    if ($scope.allContactDef.id === parseInt($scope.selectedEmails[c])) {
                        $scope.selectedEmails.splice(c, 1);
                        $scope.selectedEmails.push('');
                        c--;
                        if ($scope.allContactDef.allcon !== null) {
                            for (var d = 0; d < $scope.allContactDef.allcon.length; d++) {
                                $scope.allConsel = true;
                                $scope.selectedEmails.push($scope.allContactDef.allcon[d].id);
                            }
                        }
                    }
                }
            }
            if ($scope.toolKitaccessUser !== null && grpID.id === '-3') {
                for (var v = 0; v < $scope.selectedEmails.length; v++) {
                    if (parseInt(grpID.id) === parseInt($scope.selectedEmails[v])) {
                        $scope.selectedEmails.splice(v, 1);
                        $scope.selectedEmails.push('');
                        v--;
                        for (var t = 0; t < $scope.toolKitaccessUser.length; t++) {
                            $scope.selectedEmails.push($scope.toolKitaccessUser[t].volId);
                        }
                    }
                }
            }
            $scope.groupExpand = null;
        }
        if (grpID.id === '-4') {
            for (var uu = 0; uu < $scope.selectedEmails.length; uu++) {
                if (parseInt(grpID.id) === parseInt($scope.selectedEmails[uu])) {
                    $scope.selectedEmails.splice(uu, 1);
                    $scope.selectedEmails.push('');
                    uu--;
                    for (var ww = 0; ww < $scope.reps.length; ww++) {
                        $scope.selectedEmails.push($scope.reps[ww].volId);
                    }
                }
            }
        }
        if (grpID.id === '-5') {
            for (var aa = 0; aa < $scope.selectedEmails.length; aa++) {
                if (parseInt(grpID.id) === parseInt($scope.selectedEmails[aa])) {
                    $scope.selectedEmails.splice(aa, 1);
                    $scope.selectedEmails.push('');
                    aa--;
                    for (var rr = 0; rr < $scope.pastBFCs.length; rr++) {
                        $scope.selectedEmails.push($scope.pastBFCs[rr].volId);
                    }
                }
            }
        }
    });

    //
    // MAIN
    //
    $scope.fairContacts = JSON.parse($window.sessionStorage.getItem('curFairGroupList'));

    var a = {
        foo: 1
    };
    a.foo++;

    angular.forEach(JSON.parse($window.sessionStorage.getItem('emailcontacts')), function(obj) {
        $scope.selectedEmails.push(obj.id);
    });

    console.log(JSON.parse($window.sessionStorage.getItem('allContacts')));
    console.log('LOOK HERE');

    angular.forEach(JSON.parse($window.sessionStorage.getItem('allContacts')), function(contact) {
        if (contact.email !== '') {
            $scope.defAllCon.push(contact);
        }
    });
    if ($scope.defAllCon.length > 0) {
        tempContacts = $scope.defAllCon;
    }

    $scope.conCount = tempContacts.length;
    console.log(tempContacts.length);

    angular.forEach(tempContacts, function(obj) {
        if (!obj.volunteerExt.firstName && !obj.volunteerExt.lastName) {
            obj.name = 'no name <' + obj.email + ">";
        } else {
            obj.name = obj.volunteerExt.firstName + ' ' + obj.volunteerExt.lastName;
        }
    });
    $scope.contactList = tempContacts;
    $scope.allContactDef = {
        id: -2,
        allcon: JSON.parse($window.sessionStorage.getItem('allContacts'))
    };


    /** populate bfc's email address in send to box **/
    if (angular.isDefined($scope.fair.signupSheetEmailAlerts) &&
        $scope.fair.signupSheetEmailAlerts !== null &&
        $scope.fair.signupSheetEmailAlerts.length > 0) {
        angular.forEach($scope.fair.signupSheetEmailAlerts, function(obj) {
            var savedContact = $filter('filter')($scope.contactList, {
                'email': obj.email
            }, true);

            if (savedContact.length > 0) {
                $scope.selectedEmails.push(savedContact[0].id);
            } else {
                $scope.contactList.push({
                    id: $scope.contactList.length,
                    email: obj.email,
                    name: obj.email
                });
                $scope.selectedEmails.push($scope.contactList.length - 1);
                addedEmails.push($scope.contactList[$scope.contactList.length - 1]);
            }
        });
    } else {
        if ($scope.fair.previousSignUpId === '-1') {
            angular.forEach($scope.contactList, function(obj) {
                if ($scope.fair.coordinatorEmail === obj.email) {
                    $scope.selectedEmails.push(obj.id);
                    return false;
                }
            });
        }
    }

    // console.log($scope.allContactDef.allcon.length);
    // $log.log($window.sessionStorage.getItem('allgroups')); // VMS-1642 To check groups in log
    $scope.grpList = JSON.parse($window.sessionStorage.getItem('allgroups'));
    angular.forEach($scope.grpList, function(obj) {
        $scope.contactList.push(obj);

    });

    $scope.pastBFCs = [];
    $scope.reps = [];
    $scope.toolKitaccessUser = [];
    $scope.allVolunteerIds = [];
    angular.forEach($scope.fairContacts, function(obj) {
        if (obj.id === -1) {
            $scope.contactList.push(obj);
            $scope.currFairGrp.push(obj);
        }
        if (obj.id === -2) {
            $scope.actualConCount = obj.count;
            angular.forEach($scope.contactList, function(item) {
                if (item.hasOwnProperty('volunteerExt')) {
                    $scope.allVolunteerIds.push({
                        volId: item.id,
                        extId: item.volunteerExt.transId
                    });
                }

            });
            obj.volunteerIds = $scope.allVolunteerIds;
            $scope.contactList.push(obj);
        }
        if (obj.id === -3) {
            $scope.actualConCount = obj.count;
            angular.forEach($scope.contactList, function(item) {
                if (item.toolKitAccess === "Y") {
                    $scope.toolKitaccessUser.push({
                        volId: item.id,
                        extId: item.volunteerExt.transId
                    });
                }
            });
            obj.volunteerIds = $scope.toolKitaccessUser;
            $scope.contactList.push(obj);
        }
        if (obj.id === -4) {
            $scope.reps = obj.volunteerIds;
            $scope.contactList.push(obj);
        }
        if (obj.id === -5) {
            $scope.pastBFCs = obj.volunteerIds;
            $scope.contactList.push(obj);
        }
    });

    /** find manually added contacts and add them to contactList **/
    if ($window.sessionStorage.getItem('addedcontacts') !== null) {
        addedEmails = JSON.parse($window.sessionStorage.getItem('addedcontacts'));
        for (var i = 0; i < addedEmails.length; i++) {
            $scope.contactList.push(addedEmails[i]);
            $scope.selectedEmails.push(addedEmails[i].id);
        }

    }

}]);
