(function() {
    "use strict";
    var app = angular.module('sendEmailModule', []);
    app.controller('sendEmailController', ['$scope', '$log', '$http', '$timeout', '$compile', 'contactService', '$location', '$window', 'emailAddress', '$routeParams', '$rootScope', 'dumble', 'urlprefix', 'teamsite', function($scope, $log, $http, $timeout, $compile, contactService, $location, $window, emailAddress, $routeParams, $rootScope, dumble, urlprefix, teamsite) {
        var tempContacts = JSON.parse($window.sessionStorage.getItem('allContacts'));
        var emailPattren = /^[a-z]+[a-z0-9._\-\']+@[a-z]+\.[a-z.]{2,5}$/i;
        var addedEmails = [];
        $scope.errorPopUp = false;
        $scope.email = {};
        $scope.chairPerson = {};
        $scope.emails = [];
        $scope.defAllCon = [];
        $scope.selectedEmails = [];
        $scope.currFairGrp = [];
        $scope.actualConCount = null;
        $scope.allConsel = false;
        $scope.emailnotValid = false;
        $scope.emailExist = false;
        $scope.showSelect = false;
        $scope.formHide = true;
        $scope.templates = false;
        $scope.include = {
            top_send: teamsite + "/VOL550_email_message.html",
            top_invite: teamsite + "/VOL550_invite_message.html",
            whatgetSent: teamsite + '/whatgetSent.html'
        };

        $scope.publishedTemplates = function() {
            $scope.templates = ($window.sessionStorage.getItem('published') === 'true');
            $window.sessionStorage.setItem('published', undefined);
        };

        $scope.publishedTemplates();

        if (angular.isDefined($window.sessionStorage.getItem('selectedTemplate')) &&
            $window.sessionStorage.getItem('selectedTemplate') !== '' &&
            $window.sessionStorage.getItem('selectedTemplate') !== null) {
            $scope.selectedTemplate = $window.sessionStorage.getItem('selectedTemplate');
        } else {
            $scope.selectedTemplate = "signUp";
        }

        if (angular.isDefined($window.sessionStorage.getItem('emailCopy')) &&
            $window.sessionStorage.getItem('emailCopy') !== null) {
            $scope.bccFlag = ($window.sessionStorage.getItem('emailCopy') === 'true');
        } else {
            $scope.bccFlag = true;
        }


        angular.element('#signUp').addClass('activeTemplate');

        $scope.$watch('selectedTemplate', function(newValue, oldValue) {
            console.log("new : " + newValue + "oldValue: " + oldValue);
            angular.element('.activeTemplate').removeClass('activeTemplate');
            if (newValue === 'thankYou') {
                angular.element('#thankYou').addClass('activeTemplate');
                inviteMessage('inviteWithBanner');
            } else if (newValue === 'blank') {
                angular.element('#blank').addClass('activeTemplate');
                inviteMessage('inviteWithNoBanner');
            } else if (newValue === 'signUp') {
                if (angular.element('#signUp').length > 0) {
                    angular.element('#signUp').addClass('activeTemplate');
                    inviteMessage('invite');
                } else {
                    inviteMessage('send');
                }

            }
        });

        function inviteMessage(type) {
            var url = urlprefix;

            if (type === 'inviteWithBanner') {
                url += '/volunteer-manager/invite/banner/template/';
            } else if (type === 'invite') {
                url += '/volunteer-manager/invite/template/';
            } else if (type === 'inviteWithNoBanner') {

                if (angular.isDefined($window.sessionStorage.getItem('blankEmailMsg')) &&
                    $window.sessionStorage.getItem('blankEmailMsg') !== null) {
                    $scope.email.message = $window.sessionStorage.getItem('blankEmailMsg');
                } else {
                    $scope.email.message = '';
                }
            }

            if (type === 'inviteWithBanner' || type === 'invite') {
                $http.get(url + $routeParams.orgId + '/' + $routeParams.eventId).then(
                    function(data) {
                        if (data.data.emailBody.length > 0) {
                            $scope.email.message = data.data.emailBody;
                        }
                        $scope.email.message = data.data.emailBody;
                        $scope.chairPerson = data.data.chairPersonBean;
                        emailAddress.setChairPerson($scope.chairPerson);
                    },
                    function(data) {
                        console.error('error!');
                    });
            }

        }

        $timeout(function() {
            // Do not show the selection menu until after it's made correctly.
            // Without this, there is an ugly flicker due to select2 setting everything up later than it should.
            $scope.showSelect = true;

            /* Disabled because of VMS-2165 , QA thinks it's uglier with the fix!
            // We want this to load AFTER select2 has been able to do some magic.
            // This whole block is to hide some flicker issues on IE (VMS-2165).
            $('#selectBox')
                .on("select2-removed", function(e) {
                    $('.select2-choices').css('opacity', '0');
                })
                .on("change", function(e) {
                    $('.select2-choices').css('opacity', '1');
                });
            */
        }, 0);

        $timeout(function() {
            $scope.formHide = false;
        }, 100);

        $scope.monitorLength = function(maxLength) {
            if ($scope.email.message.length > maxLength) {
                $scope.email.message = $scope.email.message.substring(0, maxLength);
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
                /*
                if (!$scope.$$phase) {
                    $scope.$apply(function() {
                        $scope.noResultsTag = term;
                    });
                }
                */
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

                    if (email.match(emailPattren)) {
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

                if (singleEmail.trim().match(emailPattren)) {
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
            } else if ($scope.noResultsTag.trim().match(emailPattren)) {
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

        $scope.goToContacts = function() {
            $window.sessionStorage.setItem('addedcontacts', "[]");
            $window.sessionStorage.setItem('selectedTemplate', '');
            $window.sessionStorage.setItem('blankEmailMsg', '');
            if ($location.url().indexOf('invite') !== -1) {
                $location.path('/volunteers/' + $routeParams.orgId + '/' + $routeParams.eventId);
                // $rootScope.$broadcast('redirectToVolunteers');
            } else {
                $location.path('/contacts/all/' + $routeParams.orgId + '/' + $routeParams.eventId);
            }
        };

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

        $scope.sendEmail = function() {
            $scope.submitted = true;
            $scope.emails = emailAddress.getEmailAddress($scope.selectedEmails, $scope.contactList, $scope.grpList);
            if ($scope.sendMessage.$valid && $scope.emails.length > 0) {
                console.log(urlprefix + "/volunteer-manager/volunteer/sendemail");

                var emailType;
                if ($scope.selectedTemplate === 'signUp') {
                    emailType = 'invite';
                } else if ($scope.selectedTemplate === 'thankYou') {
                    emailType = 'inviteWithBanner';
                } else {
                    emailType = 'inviteWithNoBanner';
                }

                var email_data = {
                    email: $scope.emails,
                    bccFlag: $scope.bccFlag,
                    emailBody: $scope.email.message,
                    senderName: $scope.chairPerson.chairPersonName,
                    senderPhone: $scope.chairPerson.chairPersonPhone,
                    senderEmail: $scope.chairPerson.chairPersonEmail,
                    orgId: $routeParams.orgId,
                    businessEventId: $routeParams.eventId,
                    managerId: 1032,
                    emailType: emailType,
                    crmId: $window.sessionStorage.getItem('CrmId'),
                    type: $window.sessionStorage.getItem('ContactType'),
                    spsId: $window.sessionStorage.getItem('SpsId'),
                };

                if (emailType === "invite") {
                    var tempObj = {
                        allConsel: $scope.allConsel,
                        actualConCount: $scope.actualConCount,
                        conCount: $scope.conCount,
                        emailLength: $scope.emails
                    };
                    var emailsObj = [];
                    for (var i = 0; i < $scope.selectedEmails.length; i++) {
                        for (var j = 0; j < $scope.contactList.length; j++) {
                            if (parseInt($scope.selectedEmails[i]) === $scope.contactList[j].id) {
                                emailsObj.push($scope.contactList[j]);
                            }
                        }
                    }
                    $window.sessionStorage.setItem('emailcontacts', JSON.stringify(emailsObj));
                    emailAddress.setEmaildata(email_data, tempObj);
                    $window.sessionStorage.setItem('selectedTemplate', $scope.selectedTemplate);
                    $window.sessionStorage.setItem('addedcontacts', JSON.stringify(addedEmails));
                    $window.sessionStorage.setItem('emailCopy', $scope.bccFlag);
                    if ($scope.selectedTemplate === "blank") {
                        $window.sessionStorage.setItem('blankEmailMsg', $scope.email.message);
                    }
                    $location.path('/volunteers/invitePreview/' + $routeParams.orgId + '/' + $routeParams.eventId);
                } else {
                    $http.post(urlprefix + "/volunteer-manager/volunteer/sendemail", email_data).then(
                        function(data) {
                            var diffEmailCount = $scope.actualConCount - $scope.conCount;
                            var msg;
                            if ($scope.allConsel === true && $scope.emails.length === $scope.conCount) {

                                if ($scope.actualConCount > 1) {
                                    msg = 'Your email has been sent to ' + $scope.conCount + ' contacts. ';
                                } else if ($scope.actualConCount === 1) {
                                    msg = 'Your email has been sent to ' + $scope.conCount + ' contact. ';
                                }

                                if (diffEmailCount > 1) {
                                    msg += diffEmailCount + ' contacts did not contain email addresses and were not deliverable.'; //data.data.statusMessage;
                                } else if (diffEmailCount === 1) {
                                    msg += diffEmailCount + ' contact did not contain email address and were not deliverable.';
                                }

                            } else if ($scope.allConsel === true && $scope.emails.length > $scope.conCount) {
                                var diffcount = $scope.emails.length - $scope.conCount;
                                var totalCount = $scope.conCount + diffcount;

                                if (totalCount > 1) {
                                    msg = 'Your email has been sent to ' + totalCount + ' contacts. ';
                                } else if (totalCount === 1) {
                                    msg = 'Your email has been sent to ' + totalCount + ' contact. ';
                                }

                                if (diffEmailCount > 1) {
                                    msg += diffEmailCount + ' contacts did not contain email addresses and were not deliverable.';
                                } else if (diffEmailCount === 1) {
                                    msg += diffEmailCount + ' contact did not contain email address and were not deliverable.';
                                }

                            } else if ($scope.emails.length === 1) {
                                msg = 'Your email has been sent to ' + $scope.emails.length + ' contact.'; //;data.data.statusMessage;
                            } else {
                                msg = 'Your email has been sent to ' + $scope.emails.length + ' contacts.'; //;data.data.statusMessage;
                            }

                            $scope.error = msg;
                            $scope.errorPopUp = true;
                            /*if ($location.url().indexOf('invite') !== -1) {
                                $location.path('/volunteers/' + $routeParams.orgId + '/' + $routeParams.eventId);
                                $rootScope.$broadcast('redirectToVolunteers');
                            }*/
                        },
                        function(data) {
                            $scope.error = data.data.errors[0].message;
                            $scope.errorPopUp = true;
                        });
                }
            }
        };

        $scope.closeSendMessagePopUpAndRedirect = function() {
            $scope.errorPopUp = false;
            $location.path('/contacts/all/' + $routeParams.orgId + '/' + $routeParams.eventId);
        };

        $scope.closeSendInvitePopUpAndRedirect = function() {
            $scope.errorPopUp = false;
            $window.sessionStorage.setItem('selectedTemplate', '');
            $rootScope.$broadcast('redirectToVolunteers');
            $location.path('/volunteers/' + $routeParams.orgId + '/' + $routeParams.eventId);
        };

        $scope.closeSendMessagePopUp = function() {
            $scope.errorPopUp = false;
        };

        $scope.sendAction = function(emailData) {
            var tempObj = emailAddress.getTempObj();
            $scope.allConsel = tempObj.allConsel;
            $scope.actualConCount = tempObj.actualConCount;
            $scope.conCount = tempObj.conCount;
            $scope.emails = tempObj.emailLength;
            $http.post(urlprefix + "/volunteer-manager/volunteer/sendemail", emailData).then(
                function(data) {
                    if (angular.isDefined($window._satellite)) {
                        $window._satellite.track('send_email');
                    }
                    var diffEmailCount = $scope.actualConCount - $scope.conCount;
                    var msg;
                    if ($scope.allConsel === true && $scope.emails.length === $scope.conCount) {

                        if ($scope.actualConCount > 1) {
                            msg = 'Your email has been sent to ' + $scope.conCount + ' contacts. ';
                        } else if ($scope.actualConCount === 1) {
                            msg = 'Your email has been sent to ' + $scope.conCount + ' contact. ';
                        }

                        if (diffEmailCount > 1) {
                            msg += diffEmailCount + ' contacts did not contain email addresses and were not deliverable.'; //data.data.statusMessage;
                        } else if (diffEmailCount === 1) {
                            msg += diffEmailCount + ' contact did not contain email address and were not deliverable.';
                        }


                    } else if ($scope.allConsel === true && $scope.emails.length > $scope.conCount) {
                        var diffcount = $scope.emails.length - $scope.conCount;
                        var totalCount = $scope.conCount + diffcount;

                        if (totalCount > 1) {
                            msg = 'Your email has been sent to ' + totalCount + ' contacts. ';
                        } else if (totalCount === 1) {
                            msg = 'Your email has been sent to ' + totalCount + ' contact. ';
                        }

                        if (diffEmailCount > 1) {
                            msg += diffEmailCount + ' contacts did not contain email addresses and were not deliverable.';
                        } else if (diffEmailCount === 1) {
                            msg += diffEmailCount + ' contact did not contain email address and were not deliverable.';
                        }


                    } else if ($scope.emails.length === 1) {
                        msg = 'Your email has been sent to ' + $scope.emails.length + ' contact.'; //;data.data.statusMessage;
                    } else {
                        msg = 'Your email has been sent to ' + $scope.emails.length + ' contacts.'; //;data.data.statusMessage;
                    }

                    $scope.error = msg;
                    $scope.errorPopUp = true;
                    $window.sessionStorage.removeItem('emailcontacts');
                    /*if ($location.url().indexOf('invite') !== -1) {
                        $location.path('/volunteers/' + $routeParams.orgId + '/' + $routeParams.eventId);
                        $rootScope.$broadcast('redirectToVolunteers');
                    }*/
                },
                function(data) {
                    $scope.error = data.data.errors[0].message;
                    $scope.errorPopUp = true;
                });
        };

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

        // console.log($scope.actualConCount);
        // console.log($scope.conCount);
        // $log.log($scope.grpListt); // VMS-1642 To check grouplist in $log (console was not working)
        // console.log($scope.contactList);

        var locStringUrl = "#/volunteers/invite";
        if ($routeParams.orgId !== undefined) {
            locStringUrl = locStringUrl + "/" + $routeParams.orgId;
        }
        if ($routeParams.eventId !== undefined) {
            locStringUrl = locStringUrl + "/" + $routeParams.eventId;
        }
        if ($window.location.hash === locStringUrl) {
            var tempEmailData = emailAddress.getEmailData();
            dumble.setDumbleData('ChairPerson:Email Invite', 'Landing Page', '', '', 1, '', '', '', '');
            if (Object.keys(tempEmailData).length === 0) {
                $scope.email.message = "It's time to start planning our next Scholastic Book Fair and I would like to invite " +
                    "you to help our school pull off the best Book Fair ever! \n" +

                    "\nI'm building a team of enthusiastic and talented volunteers from our school\n" +
                    "community and could really use YOUR help. Please take a moment to view our sign-up" +
                    " sheet and consider volunteering to help out. Even an hour of your time would be valuable.\n" +

                    "\nI hope you'll join our team of volunteers!";

                // TODO: Fix these numbers
                // $http.get(urlprefix + '/volunteer-manager/invite/template/' + $routeParams.orgId + '/' + $routeParams.eventId).then(
                //     function(data) {
                //         console.log("Invite Template Email Body ", data.data.emailBody);
                //         if (data.data.emailBody.length > 0) {
                //             $scope.email.message = data.data.emailBody;
                //         }
                //         $scope.email.message = data.data.emailBody;
                //         $scope.chairPerson = data.data.chairPersonBean;
                //         emailAddress.setChairPerson($scope.chairPerson);
                //     },
                //     function(data) {
                //         console.error('error!');
                //     });
            } else {
                $scope.email.message = tempEmailData.emailBody;
            }
        } else {
            console.log("Text is not prepopulated. Since this is not invite email page.");
            dumble.setDumbleData('ChairPerson:Contact Send Email', 'Landing Page', '', '', 1, '', '', '', '');
        }
        var previewReturnObj = emailAddress.getInviteFlag();
        if (previewReturnObj.inviteFlag) {

            $scope.error = emailAddress.getFormMessage();
            $scope.errorPopUp = previewReturnObj.errorPopupFlag;
            $window.sessionStorage.removeItem('emailcontacts');
            emailAddress.setInviteFlag(false);
        }

    }]);

    app.controller('invitePreviewController', ['$scope', '$http', 'emailAddress', '$routeParams', '$location', '$rootScope', '$window', 'teamsite', 'urlprefix', function($scope, $http, emailAddress, $routeParams, $location, $rootScope, $window, teamsite, urlprefix) {
        $scope.popover = false;
        $scope.include = {
            video: teamsite + '/brightCove.html',
            title: teamsite + '/previewInvitationTitle.html'
        };
        $scope.emailData = emailAddress.getEmailData();
        $scope.chairPerson = emailAddress.getChairPerson();
        $scope.fairDetails = JSON.parse($window.sessionStorage.getItem('fairDetails'));
        $scope.selectedTemplate = $window.sessionStorage.getItem('selectedTemplate');
        $scope.templateView = 'Invite Volunteers';

        if ($scope.selectedTemplate === 'thankYou') {
            $scope.templateView = 'Volunteer Thank You';
        } else if ($scope.selectedTemplate === 'blank') {
            $scope.templateView = 'Blank Message';
        }

        console.log("the chair person is ");
        console.log($scope.chairPerson);

        $scope.goBack = function() {
            $location.path('/volunteers/invite/' + $routeParams.orgId + '/' + $routeParams.eventId);
        };

        $scope.send = function() {
            var tempObj = emailAddress.getTempObj();
            var emailData = emailAddress.getEmailData();
            /** reinitialize manually added emails, messages and selected template **/
            $window.sessionStorage.setItem('addedcontacts', "[]");
            //$window.sessionStorage.setItem('selectedTemplate', '');
            $window.sessionStorage.setItem('blankEmailMsg', '');
            $window.sessionStorage.setItem('emailCopy', true);

            $http.post(urlprefix + "/volunteer-manager/volunteer/sendemail", emailData).then(
                function(data) {
                    emailAddress.setFormMessage(tempObj);
                    emailAddress.setInviteFlag(true, true);
                    if (angular.isDefined($window._satellite)) {
                        $window._satellite.track('email_invite');
                    }
                    $location.path('/volunteers/invite/' + $routeParams.orgId + '/' + $routeParams.eventId);
                },
                function(data) {
                    emailAddress.setFormMessage(data.data.errors[0].message);
                    emailAddress.setInviteFlag(true, true);
                    $location.path('/volunteers/invite/' + $routeParams.orgId + '/' + $routeParams.eventId);
                });
        };

        $scope.gotoVolunteers = function() {
            $location.path('/volunteers/' + $routeParams.orgId + '/' + $routeParams.eventId);
        };

    }]);
})();
