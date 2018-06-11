(function() {
    "use strict";
    var app = angular.module('appService', []);
    /* This is never used anywhere.
    app.service('rolesSer', ['$http', '$q', 'urlprefix', function($http, $q, urlprefix) {
        //NOTE: We should probably get rid of $q and just return the $http promise
        var defered = $q.defer();
        $http.get(urlprefix + '/volunteer-manager/admin/roles').then(function(data) {
            defered.resolve(data);
        });

        this.getRoles = function() {
            return defered.promise;
        };
    }]);
    */

    app.service('messSer', ['$http', '$q', 'urlprefix', function($http, $q, urlprefix) {
        //NOTE: We should probably get rid of $q and just return the $http promise
        var defered = $q.defer();
        $http.get(urlprefix + '/volunteer-manager/admin/message').then(
            function(data) {
                defered.resolve(data);
            });

        this.getMessages = function() {
            return defered.promise;
        };
    }]);

    app.factory("httpRequestInterceptor", ['$rootScope', function($rootScope) {
        return {
            request: function($config) {
                $config.headers['auth-token'] = localStorage.getItem('token');
                $config.headers['accept-language'] = "en-US";
                return $config;
            }
        };
    }]);

    app.service('contactService', ['$http', '$window', 'urlprefix', function($http, $window, urlprefix) {
        var contact = {};
        contact.volunteerExt = {};
        console.log('contactService contact.volunteerExt.state', contact.volunteerExt.state);
        contact.volunteerExt.state = null; //WHY was contact.volunteerExt.state being set to null?

        var orgId = -1;
        var eventId = -1;
        var defaultGroupId = 10;

        this.setOrgId = function(o) {
            orgId = o;
        };
        this.getOrgId = function() {
            return orgId;
        };

        this.setEventId = function(o) {
            eventId = o;
        };
        this.getEventId = function() {
            return eventId;
        };

        this.setinfo = function(data) {
            contact = data;
            contact.firstName = data.volunteerExt.firstName;
            contact.lastName = data.volunteerExt.lastName;
            contact.phone = data.volunteerExt.phone;
            contact.address1 = data.volunteerExt.address1;
            contact.address2 = data.volunteerExt.address2;
            contact.city = data.volunteerExt.city;
            contact.state = data.volunteerExt.state;
            contact.postalCode = data.volunteerExt.zip;
            contact.transId = data.volunteerExt.transId;
            contact.schoolId = this.getOrgId();
            contact.type = data.volunteerExt.type;
            contact.note = data.volunteerExt.notes;
            contact.internalType = data.volunteerExt.internalType;
            contact.currentBFC = data.volunteerExt.currentBFC;
        };

        this.clearinfo = function(data) {
            if (data === '') {
                contact = {};
                contact.volunteerExt = {};
            } else {
                contact = data;
            }

            contact.firstName = "";
            contact.lastName = "";
            contact.email = "";
            contact.phone = "";
            contact.address1 = "";
            contact.address2 = "";
            contact.city = "";
            contact.state = "";
            contact.volunteerExt.state = "";
            contact.postalCode = "";
            contact.schoolId = this.getOrgId();
        };

        this.getinfo = function() {
            return contact;
        };

        this.addContact = function(data, met) {
            console.log('data: %o', data);
            data.fairId = this.getEventId();
            data.schoolId = this.getOrgId();
            data.groupId = defaultGroupId;
            data.chairPersonId = 1032;
            if (!angular.isUndefined(data.type)) {
                data.type = data.type;
            } else {
                data.type = 'Volunteer';
            }

            return $http({
                method: met,
                url: urlprefix + '/volunteer-manager/contact',
                data: data
            });
        };

        this.getStates = function() {
            // NOTE: Should this use urlprefix?
            // NOTE: We can also make a heavy cache here
            return $http({
                method: 'get',
                url: 'resources/stateList.json'
            });
        };

        this.deleteContact = function(item) {
            console.log('deleting the list: {}', item);
            var deleteContact = {
                fairId: this.getEventId(),
                schoolId: this.getOrgId(),
                groupId: defaultGroupId,
                chairPersonId: 1032,
                type: 'Parent',
                idList: item
            };
            console.log(deleteContact);
            return $http.put(urlprefix + '/volunteer-manager/contact/remove', deleteContact);
        };

        this.saveGroup = function(groupInfo) {
            return $http.post(urlprefix + '/volunteer-manager/group/save', groupInfo);
        };

        this.getGroupMembers = function(orgId, eventId, groupId) {
            return $http.get(urlprefix + '/volunteer-manager/group/listContacts/' + orgId + '/' + eventId + '/' + groupId);
        };

        this.addtoGroup = function(contacts, groups, newGrp) {
            var temp = [];
            for (var i = 0; i < groups.length; i++) {
                temp.push({
                    id: groups[i],
                    volunteerIds: contacts
                });
            }

            if (newGrp !== null && newGrp.trim() !== '') {
                console.log('add a new group!');
                temp.push({
                    name: newGrp,
                    volunteerIds: contacts
                });
            } else {
                console.log('do not add a new group');
            }

            var groupList = {
                schoolId: this.getOrgId(),
                modifiedBy: 1032,
                userGroups: temp
            };
            return $http.post(urlprefix + '/volunteer-manager/group/addContacts', groupList);
        };

        this.removefromGroup = function(list, gp) {
            var postparams = {
                volunteersList: list,
                groupId: gp,
                schoolId: this.getOrgId(),
                modifiedBy: 1032
            };
            return $http.post(urlprefix + '/volunteer-manager/group/removeContacts', postparams);
        };

        this.getGroups = function(orgId, eventId) {
            var path = urlprefix + '/volunteer-manager/group/all/' + orgId + '/' + eventId;
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
            return $http.get(path);
        };

        this.getUserGroups = function(data) {
            var userGroups = [];
            angular.forEach(data.userGroups, function(group) {
                if (group.id !== 10) {
                    userGroups.push(group);
                }
            });

            $window.sessionStorage.setItem('allgroups', JSON.stringify(userGroups));
            $window.sessionStorage.setItem('curFairGroupList', JSON.stringify(data.defaultGroups));
            return userGroups;
        };

        this.getContacts = function(orgId, eventId) {
            var path = urlprefix + '/volunteer-manager/contact/' + orgId + '/' + eventId;
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
            return $http.get(path).then(function(data) {
                $window.sessionStorage.setItem('allContacts', JSON.stringify(data.data.volunteers));
                return data;
            });
        };

        this.getVolunteerHistory = function(orgId, eventId, contactId) {
            return $http.get(urlprefix + '/volunteer-manager/volunteer/history/' + orgId + '/' + eventId + '/' + contactId);
        };

        this.cancelGroom = function(orgId, eventId) {
            return $http.delete(urlprefix + "/volunteer-manager/contact/groom/" + orgId + '/' + eventId);
        };

        this.saveImported = function(groomList) {
            return $http.post(urlprefix + '/volunteer-manager/contact/savegroomedcontacts', groomList);
        };

        this.getGroomContacts = function(orgId, eventId) {
            return $http.get(urlprefix + '/volunteer-manager/contact/groom/' + orgId + '/' + eventId);
        };
    }]);

    app.service('signupSheetService', ['$http', '$window', '$location', 'urlprefix', function($http, $window, $location, urlprefix) {
        var sheet = {};
        var sheets = [];
        var signUpSheetId = {};
        var volSignUpActData = {};
        var spsUserDetails = {};
        var orgId = {};
        var fairId = {};
        var customTaskId = {};
        var signupsheetStore = {};
        var taskDetail = '';
        var pastSignupsheetId;

        this.getSignupSheetsByCrmIdTypeSpsId = function(orgId, eventId, crmId, type, spsid) {
            console.log('service: {orgId: {}, eventId: {}, crmId: {}, type: {}, spsid: {}}', orgId, eventId, crmId, type, spsid);
            return $http.get(urlprefix + '/volunteer-manager/signup/' + orgId + '/' + eventId + '/' + crmId + '/' + type + '/' + spsid);
        };
        this.getSignupSheetsByCrmIdType = function(orgId, eventId, crmId, type) {
            console.log('service: {orgId: {}, eventId: {}, crmId: {}, type: {}}', orgId, eventId, crmId, type);
            return $http.get(urlprefix + '/volunteer-manager/signup/' + orgId + '/' + eventId + '/' + crmId + '/' + type);
        };
        this.getSignupSheets = function(orgId, eventId) {
            console.log('service: {orgId: {}, eventId: {}}', orgId, eventId);
            var path = urlprefix + '/volunteer-manager/signup/' + orgId + '/' + eventId;
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
            return $http.get(path);
        };

        this.loadSheet = function(orgId, eventId) {
            console.log("GET: create {eventId: " + eventId + ", orgId: " + orgId + "}");
            return $http.get(urlprefix + '/volunteer-manager/signupsheet/basic/info/' + orgId + '/' + eventId);
        };

        this.publishFair = function(eventId) {
            console.log("Publish {eventId: " + eventId + "}");
            return $http({
                url: urlprefix + '/volunteer-manager/signupsheet/' + eventId + '/publish/now',
                method: 'POST',
                data: {}
            });
        };

        this.basicUpdate = function(fair) {
            console.log('create new fair with ');
            console.log(fair);
            return $http.put(urlprefix + '/volunteer-manager/signupsheet/basic/update', fair);
        };

        this.basicCreate = function(fair) {
            console.log('create new fair with ');
            console.log(fair);
            return $http.post(urlprefix + '/volunteer-manager/signupsheet/basic/create', fair);
        };

        this.saveFairDetails = function(fair, orgId, eventId) {
            var post_params = {
                eventName: fair.eventName,
                schoolName: fair.schoolName,
                volunteerSignAlert: fair.volunteerSignAlert,
                volunteerCancelAlert: fair.volunteerCancelAlert,
                description: fair.description,
                fairId: eventId,
                schoolId: orgId,
                //chairPersonId: "1207",
                //address: "http://volunteers.scholastic.com",
                address: fair.address,
                signupSheetId: fair.signUpSheetId + "",
                coordinatorFirstName: fair.coordinatorFirstName,
                coordinatorLastName: fair.coordinatorLastName,
                coordinatorEmail: fair.coordinatorEmail,
                coordinatorPhone: fair.coordinatorPhone,
                showEmail: fair.showEmail,
                showPhone: fair.showPhone,
            };
            console.log(post_params);

            return $http({
                url: urlprefix + '/volunteer-manager/signupsheet/basic/update',
                method: 'PUT',
                data: post_params
            });
        };

        this.createFairDetails = function(fair, orgId, eventId) {
            var post_params = {
                eventName: fair.eventName,
                schoolName: fair.schoolName,
                volunteerSignAlert: fair.volunteerSignAlert,
                volunteerCancelAlert: fair.volunteerCancelAlert,
                //address: "http://volunteers.scholastic.com",
                address: fair.address,
                description: fair.description,
                eventType: "Book Fair",
                fairId: eventId,
                schoolId: orgId,
                //chairPersonId: "1207",
                coordinatorFirstName: fair.coordinatorFirstName,
                coordinatorLastName: fair.coordinatorLastName,
                coordinatorEmail: fair.coordinatorEmail,
                coordinatorPhone: fair.coordinatorPhone,
                showEmail: fair.showEmail,
                showPhone: fair.showPhone,
            };
            console.log(post_params);

            return $http({
                url: urlprefix + '/volunteer-manager/signupsheet/basic/create',
                method: 'POST',
                data: post_params
            });
        };
        this.setPastfairId = function(id) {
            pastSignupsheetId = id;
        };
        this.getPastfairId = function() {
            return pastSignupsheetId;
        };
        this.createfairFromPastFair = function(fair, orgId, eventId, pastSignupId) {
            var post_params = {
                eventName: fair.eventName,
                schoolName: fair.schoolName,
                volunteerSignAlert: fair.volunteerSignAlert,
                volunteerCancelAlert: fair.volunteerCancelAlert,
                //address: "http://volunteers.scholastic.com",
                address: fair.address,
                description: fair.description,
                eventType: "Book Fair",
                fairId: eventId,
                schoolId: orgId,
                //chairPersonId: "1207",
                coordinatorFirstName: fair.coordinatorFirstName,
                coordinatorLastName: fair.coordinatorLastName,
                coordinatorEmail: fair.coordinatorEmail,
                coordinatorPhone: fair.coordinatorPhone,
                showEmail: fair.showEmail,
                showPhone: fair.showPhone,
            };
            console.log(post_params);

            return $http({
                url: urlprefix + '/volunteer-manager/signupsheet/basic/create-old/' + pastSignupId,
                method: 'POST',
                data: post_params
            });
        };

        this.setId = function(data) {
            signUpSheetId = data;
            $window.sessionStorage.setItem('signUpSheetID', data);
        };

        this.setFairId = function(data) {
            fairId = data;
            $window.sessionStorage.setItem('fairId', data);
        };

        this.setOrgId = function(data) {
            orgId = data;
            $window.sessionStorage.setItem('orgId', data);
        };

        this.clearId = function(data) {
            signUpSheetId = "";
            pastSignupsheetId = undefined;
            $window.sessionStorage.removeItem('signUpSheetID');
            $window.sessionStorage.removeItem('fairId');
            $window.sessionStorage.removeItem('orgId');
        };

        this.getId = function() {
            return signUpSheetId;
        };

        this.getFairId = function() {
            return fairId;
        };

        this.getOrgId = function() {
            return orgId;
        };

        this.setVolSignUpActDetails = function(data) {
            volSignUpActData = data;
        };

        this.getVolSignUpActDetails = function(data) {
            return volSignUpActData;
        };

        this.setSpsUserDetails = function(data) {
            spsUserDetails = data;
        };

        this.getSpsUserDetails = function(data) {
            return spsUserDetails;
        };

        this.setTaskDetails = function(t) {
            taskDetail = t;
        };

        this.getTaskDetails = function() {
            return taskDetail;
        };

        this.getCustomTaskId = function() {
            return customTaskId;
        };

        this.setCustomTaskId = function(t) {
            customTaskId = t;
        };

        this.hideHeaderAndFooter = function() {
            $("#cpt_header-holder").hide();
            $("#cpt_footer-holder").hide();
        };

        this.showHeaderAndFooter = function() {
            $("#cpt_header-holder").show();
            $("#cpt_footer-holder").show();
        };

        this.setsignupsheetStore = function(signupsheets) {
            signupsheetStore = signupsheets;
        };

        this.getsignupsheetStore = function() {
            return signupsheetStore;
        };
        this.updateSchoolId = function(activities, schoolId) {
            if (activities.length === 0) {
                return activities;
            }
            angular.forEach(activities, function(activity) {
                activity.schoolId = schoolId;
            });
            return activities;
        };
    }]);

    app.service('emailAddress', [function() {
        var chairPerson = {};

        this.setChairPerson = function(chair) {
            console.log('set chairperson');
            console.log(chair);
            chairPerson = chair;
        };

        this.getChairPerson = function() {
            return chairPerson;
        };

        // I don't know what this does
        // TODO: Change name of function since it is not a boolean.
        // NOTE: This has side-effects.
        this.isgroupIDExist = function(selectedEmails, groupList) {
            if (groupList !== null) {
                for (var i = 0; i < selectedEmails.length; i++) {
                    for (var j = 0; j < groupList.length; j++) {
                        if (parseInt(selectedEmails[i]) === groupList[j].id) {
                            selectedEmails.splice(i, 1);
                            selectedEmails.push('');
                            i--;
                            if (groupList[j].volunteerIds !== null && groupList[j].volunteerIds !== undefined) {
                                for (var k = 0; k < groupList[j].volunteerIds.length; k++) {
                                    selectedEmails.push(groupList[j].volunteerIds[k].volId);
                                }
                            }
                        }
                    }
                }
            }
            return selectedEmails;
        };

        // Given the selected emails, all our contacts, and all our groups, figure out the emails we will send to.
        this.getEmailAddress = function(selectedEmails, contactList, groupList) {
            var emails = [],
                selectedEmailsTmp = [],
                groupListTmp = [];

            // Add default groups to the contact list if we encounter them.
            angular.forEach(contactList, function(item) {
                switch (item.id) {
                    case -1:
                    case -2:
                    case -3:
                    case -4:
                    case -5:
                        groupList.push(item);
                        break;
                    default:
                        break;
                }
            });

            // Use a new array so we do not modify the model that is displayed to the user
            // This prevents side-effects
            selectedEmailsTmp = selectedEmails.slice();
            groupListTmp = groupList.slice();
            if (!this.isgroupIDExist(selectedEmailsTmp, groupListTmp)) {
                selectedEmailsTmp = this.isgroupIDExist(selectedEmailsTmp, groupListTmp.slice());
            }

            // Suppress duplicates and get the email addresses of group members.
            for (var m = 0; m < selectedEmailsTmp.length; m++) {
                for (var n = 0; n < contactList.length; n++) {
                    if (parseInt(selectedEmailsTmp[m]) === contactList[n].id) {
                        // Only add if we have not seen the email address yet.
                        if (emails.indexOf(contactList[n].email) === -1) {
                            emails.push(contactList[n].email);
                        }
                    }
                }
            }

            return emails;
        };

        var previewReturnObj = {
                inviteFlag: false
            },
            emailData = {},
            msg,
            tempObj = {};

        this.setEmaildata = function(d, t) {
            emailData = d;
            tempObj = t;
        };

        this.getEmailData = function() {
            return emailData;
        };

        this.getTempObj = function() {
            return tempObj;
        };

        this.setInviteFlag = function(f, errorPopupFlag) {
            previewReturnObj.inviteFlag = f;
            previewReturnObj.errorPopupFlag = errorPopupFlag;
        };

        this.getInviteFlag = function() {
            return previewReturnObj;
        };

        this.setFormMessage = function(tempObj) {
            if (tempObj.hasOwnProperty('actualConCount')) {
                var diffEmailCount = tempObj.actualConCount - tempObj.conCount;
                if (tempObj.allConsel === true && tempObj.emailLength.length === tempObj.conCount) {
                    if (tempObj.actualConCount > 1) {
                        msg = 'Your email has been sent to ' + tempObj.conCount + ' contacts. ';
                    } else if (tempObj.actualConCount === 1) {
                        msg = 'Your email has been sent to ' + tempObj.conCount + ' contact. ';
                    }

                    if (diffEmailCount > 1) {
                        msg += diffEmailCount + ' contacts did not contain email addresses and were not deliverable.'; //data.data.statusMessage;
                    } else if (diffEmailCount === 1) {
                        msg += diffEmailCount + ' contact did not contain email address and were not deliverable.';
                    }

                } else if (tempObj.allConsel === true && tempObj.emailLength.length > tempObj.conCount) {
                    var diffcount = tempObj.emailLength.length - tempObj.conCount;
                    var totalCount = tempObj.conCount + diffcount;

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


                } else if (tempObj.emailLength.length === 1) {
                    msg = 'Your email has been sent to ' + tempObj.emailLength.length + ' contact.'; //;data.data.statusMessage;
                } else {
                    msg = 'Your email has been sent to ' + tempObj.emailLength.length + ' contacts.'; //;data.data.statusMessage;
                }
            } else {
                msg = tempObj;
            }
        };

        this.getFormMessage = function() {
            return msg;
        };
    }]);

    app.service('importService', [function() {
        var temp = null;
        this.setItem = function(imp) {
            temp = imp;
        };
        this.getItem = function() {
            return temp;
        };
    }]);

    app.service('twilioService', ['$http', function($http) {
        this.getTwilioBean = function() {
            return $http({
                method: 'get',
                // NOTE: Should this use urlprefix?
                url: 'resources/twilioConfig.json'
            });
        };
    }]);

    app.service('janRainService', ['$window', '$routeParams', 'urlprefix', function($window, $routeParams, urlprefix) {
        console.log("In janRainService ... urlPrefix = " + urlprefix);

        this.initJanRain = function(param) {
            console.log("In initJanRain() ... urlPrefix = " + urlprefix + " :: Param " + param);
            var path = null;
            if (param === "login") {
                path = "/volunteer-manager/janrain/loginorregistration\?sheetId=" + $routeParams.sid;
            }
            if (param === "import") {

                path = "/volunteer-manager/janrain/import/contacts\?schoolId=" + $routeParams.orgId + "&fairId=" + $routeParams.eventId;

                if (angular.isDefined($window.sessionStorage.getItem('CrmId'))) {
                    path = path + '&crmId=' + $window.sessionStorage.getItem('CrmId');
                }
                if (angular.isDefined($window.sessionStorage.getItem('ContactType'))) {
                    path = path + "&type=" + $window.sessionStorage.getItem('ContactType');
                }
            }

            var janRainImportContactsUrl = urlprefix + path;
            console.log("janRainImportContactsUrl " + janRainImportContactsUrl);

            //var janRainAppServer = "login.scholastic.com";
            var janRainAppServer = "scholastic-dev";

            if (urlprefix === 'https://vms-qa.scholastic.com') {
                janRainAppServer = 'login.scholastic.com';
            } else if (urlprefix === 'https://volunteer.scholastic.com') {
                janRainAppServer = 'login.scholastic.com';
            }

            if (typeof $window.janrain !== 'object') {
                $window.janrain = {};
            }
            if (typeof $window.janrain.settings !== 'object') {
                $window.janrain.settings = {};
            }

            $window.janrain.settings.tokenAction = 'url';
            $window.janrain.settings.tokenUrl = janRainImportContactsUrl;
            $window.janrain.settings.custom = true;
            $window.janrain.ready = true;

            var scriptElement = $window.document.createElement('script');
            scriptElement.type = 'text/javascript';
            scriptElement.id = 'janrainAuthWidget';
            //scriptElement.src = 'https://rpxnow.com/js/lib/' + scope.applicationId + '/engage.js';
            if ($window.document.location.protocol === 'https:') {
                scriptElement.src = 'https://rpxnow.com/js/lib/' + janRainAppServer + '/engage.js';
            } else {
                scriptElement.src = 'http://widget-cdn.rpxnow.com/js/lib/' + janRainAppServer + '/engage.js';
            }
            //element.prepend(scriptElement);
            var s = $window.document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(scriptElement, s);

        };

    }]);

})();
