(function() {
    "use strict";
    var app = angular.module('contactsModule', []);
    app.controller('contactController', ['$scope', '$sce', 'contactService', '$location', '$document', '$window', '$timeout', '$route', '$routeParams', 'importService', '$rootScope', 'dumble', 'urlprefix', 'teamsite', function($scope, $sce, contactService, $location, $document, $window, $timeout, $route, $routeParams, importService, $rootScope, dumble, urlprefix, teamsite) {
        $scope.selectedContacts = [];
        $scope.contactList = [];
        $scope.sendmsgContacts = [];
        $scope.deleteList = [];
        $scope.deleteAll = [];
        $scope.selectGrp = [];
        $scope.tableHeader = '';
        $scope.allContacts = '';
        $scope.newGrp = '';
        $scope.schoolName = '';
        $scope.fairName = '';
        $scope.fairStartEndRange = '';
        $scope.limit = 10;
        $scope.delCount = 0;
        $scope.include = {
            top_contact: teamsite + "/CON100_Contact.html",
            delete_contact: teamsite + "/Delete_Contacts.html",
        };
        $scope.checkAll = false;
        $scope.showWarning4xx = false;
        $scope.showWarning5xx = false;
        $scope.loading = false;
        $scope.saveBtn = false;
        $scope.showRemoveGrp = false;
        $scope.selectAllChecked = false;
        $scope.addGroupNoEmail = false;
        $scope.sendNoEmail = false;
        $scope.addGroup = false;
        $scope.eledeleteOne = false;
        $scope.eleSelected = false;
        $scope.exportElement = false;
        $scope.importElement = false;
        $scope.showDeleteAlla = false;
        $scope.overLay = false;
        $scope.emptyContact = false;
        // NOTE: Do not let this be user input, if it is it's easy to hack the site.
        //       Since this is hardcoded we can trust it.
        $scope.cannotDeletePopup = $sce.trustAsHtml('Chairpeople & active volunteers cannot be deleted. <a target="_blank" href="https://scholastic-bookfairs.custhelp.com/app/answers/list/p/1242">More details</a>');

        $scope.sortOrder = ['volunteerExt.firstName', 'volunteerExt.lastName'];
        $scope.contactSort = 'first';

        $scope.fixSort = function() {
            if ($scope.contactSort === 'first') {
                $scope.sortOrder = ['volunteerExt.firstName', 'volunteerExt.lastName'];
            } else {
                $scope.sortOrder = ['volunteerExt.lastName', 'volunteerExt.firstName'];
            }
        };

        $scope.sortTimeAscending = function(timeArr) {
            var timeStr = timeArr[0];
            var startMoment = moment(timeStr, "h:mm A").format("x");
            // is there ever a case: "Any Time" or "Midnight"
            return startMoment;
        };

        $scope.importData = function() {
            var path = urlprefix + '/volunteer-manager/contact-migration/export/' + $routeParams.orgId + '/' + $routeParams.eventId;
            var crmId = $window.sessionStorage.getItem('CrmId');
            var ContactType = $window.sessionStorage.getItem('ContactType');
            var SpsId = $window.sessionStorage.getItem('SpsId');
            if (angular.isDefined(crmId)) {
                path = path + "/" + crmId;
            }
            if (angular.isDefined(ContactType)) {
                path = path + "/" + ContactType;
            }
            if (angular.isDefined(SpsId)) {
                path = path + "/" + SpsId;
            }
            $timeout(function() {
                $window.open(path, '_self');
                $scope.importing = false;
                importService.setItem(null);
            }, 1000);
        };

        $scope.goToContacts = function() {
            $location.path('/contacts/all/' + contactService.getOrgId() + '/' + contactService.getEventId());
        };

        $scope.goToImport = function() {
            $location.path('/contacts/import/' + contactService.getOrgId() + '/' + contactService.getEventId());
            dumble.setDumbleData('ChairPerson:Import Contacts', 'Landing Page', '',
                'BFC', 1, $scope.schoolName, $scope.fairName,
                $scope.schoolName, $scope.fairStartEndRange);
        };

        $scope.goToExport = function() {
            $location.path('/contacts/export/' + $routeParams.orgId + '/' + $routeParams.eventId);
            dumble.setDumbleData('ChairPerson:Export Contacts', 'Landing Page', '',
                'BFC', 1, $scope.schoolName, $scope.fairName,
                $scope.schoolName, $scope.fairStartEndRange);
        };

        $scope.disableAddToGroupSave = function() {
            return !($scope.selectGrp.length > 0 || ($scope.newGroupBox && $scope.newGrp.length > 0));
        };

        $scope.showCityState = function(contact) {
            return contact.volunteerExt.city !== null && contact.volunteerExt.state !== null;
        };

        $scope.showDeleteSelected = function() {
            var count = 0;
            // I only need one. But which one?!
            angular.forEach($scope.selectedContacts, function(contact) {
                if (contact.showDelete === false) {
                    count += 1;
                }
            });
            return count === 0;
        };

        $scope.getContactList = function() {
            $scope.showRemoveGrp = false;

            contactService.getContacts($routeParams.orgId, $routeParams.eventId).then(
                function(data) {
                    $scope.contactList = data.data.volunteers;
                    $scope.sendmsgContacts = data.data.volunteers;
                    $scope.schoolName = data.data.schoolName;
                    $scope.fairName = data.data.fairName;
                    $scope.fairStartEndRange = data.data.fairStartEndRange;
                    $scope.tableHeader = 'All Contacts';
                    dumble.setDumbleData('ChairPerson:My Contacts', 'Landing Page', '', 'BFC', 1, $scope.schoolName, $scope.fairName, $scope.schoolName, $scope.fairStartEndRange);
                    if ($scope.contactList) {
                        $scope.contactslength = $scope.contactList.length;
                    } else {
                        $scope.contactslength = 0;
                    }
                    $window.sessionStorage.setItem('published', data.data.published);

                    if (importService.getItem() === 'exporting') {
                        $scope.importData();
                    }
                    $scope.unCheckContacts();
                },
                function(data) {
                    console.error('getting contacts failed.');
                    if (data.status >= 400 && data.status < 500) {
                        $scope.showWarning4xx = true;
                    } else {
                        $scope.showWarning5xx = true;
                    }
                    $scope.importing = false;
                    importService.setItem(null);
                    console.log('fail dat: %o', data);
                });
        };

        /**
         * @description
         * Orders the volunteers by first or last name.
         * @example
         * ng-click="sort()"
         */
        $scope.sort = function() {
            $scope.reverse = !$scope.reverse;
            $scope.sort_direction = $scope.order[$scope.reverse + 0];
        };

        $scope.goToSendMessage = function() {
            if ($scope.containsEmptyEmail($scope.contactList)) {
                $scope.checkAll = true;
                $scope.showEmptyEmailComplaint();
                return;
            }
            $window.sessionStorage.setItem('emailcontacts', JSON.stringify($scope.contactList));
            $window.sessionStorage.setItem('allContacts', JSON.stringify($scope.contactList));
            $window.sessionStorage.setItem('allgroups', JSON.stringify($scope.groupList));
            $location.path('/contacts/message/' + $routeParams.orgId + '/' + $routeParams.eventId);
        };

        $scope.viewVolunteerHistory = function(contact) {
            console.log($('#content > div.popover.fade.in.top'));
            $('#content > div.popover.fade.in.top').hide();
            // Janky caching
            if (!angular.isUndefined(contact.hasHistory) && contact.hasHistory) {
                console.log('hit that cache');
                return;
            }
            contact.hasHistory = true;

            console.log('volunteer history data: %o', contact);
            contactService.getVolunteerHistory(contactService.getOrgId(), contactService.getEventId(), contact.id).then(
                function(response) {
                    console.log(response.data);
                    contact.volunteerHistory = response.data;
                },
                function(response) {
                    console.error('no volunteer history');
                });
        };

        $scope.showEmptyEmailGroupComplaint = function() {
            $scope.addGroupNoEmail = true;
            $scope.overLay = true;
        };

        $scope.showEmptyEmailComplaint = function() {
            console.log('complain about the empty email');
            var count = 0;

            if ($scope.selectedContacts.length > 0) {

                angular.forEach($scope.selectedContacts, function(contact) {
                    if (contact.email === '') {
                        count += 1;
                    }
                });
                $scope.validContacts = Number($scope.selectedContacts.length - count);
                $scope.emptyContacts = count;

            } else {
                $scope.emptyContact = true;
            }

            $scope.sendNoEmail = true;
            $scope.overLay = true;
        };

        $scope.sendMessage = function() {
            var tmpVol = [],
                tmpGrp = [];
            // Get rid of people who have no email address.
            angular.forEach($scope.sendmsgContacts, function(contact) {
                if (contact.email !== '') {
                    tmpVol.push(contact);
                }
            });

            // Remove the empty group
            angular.forEach($scope.groupList, function(group) {
                if (group.id !== 10) {
                    tmpGrp.push(group);
                }
            });

            $window.sessionStorage.setItem('emailcontacts', JSON.stringify($scope.selectedContacts));
            $window.sessionStorage.setItem('allContacts', JSON.stringify(tmpVol));
            $window.sessionStorage.setItem('allgroups', JSON.stringify(tmpGrp));
            console.log("Send Message From Contacts /contacts/message/" + $routeParams.orgId + "/" + $routeParams.eventId);
            $location.path('/contacts/message/' + $routeParams.orgId + '/' + $routeParams.eventId);
        };

        $scope.containsEmptyEmail = function(list) {
            var count = 0;

            // I only need one. But which one?!
            angular.forEach(list, function(contact) {
                if (contact.email === '') {
                    count += 1;
                }
            });

            if (count > 0) {
                return true;
            }
            return false;
        };

        $scope.getDelCount = function(list) {
            var count = 0;
            angular.forEach(list, function(contact) {
                if (contact.showDelete === false) {
                    count += 1;
                }
            });
            return list.length - count;
        };

        $scope.performAction = function(data, act) {
            switch (act) {
                case 'addContacts':
                    contactService.clearinfo(data);
                    $location.path('/contacts/add/' + contactService.getOrgId() + '/' + contactService.getEventId());
                    dumble.setDumbleData('ChairPerson:Add Contacts', 'Landing Page', '',
                        'BFC', 1, $scope.schoolName, $scope.fairName,
                        $scope.schoolName, $scope.fairStartEndRange);
                    break;
                case 'edit':
                    dumble.setDumbleData('ChairPerson:Edit Contacts', 'Landing Page', '',
                        'BFC', 1, $scope.schoolName, $scope.fairName,
                        $scope.schoolName, $scope.fairStartEndRange);
                    contactService.setinfo(data);
                    $location.path('/contacts/add/' + contactService.getOrgId() + '/' + contactService.getEventId());
                    break;
                case 'delete':
                    $scope.delCount = $scope.getDelCount($scope.selectedContacts);
                    $scope.eleSelected = true;
                    $scope.overLay = true;
                    break;
                case 'DeleteAll':
                    $scope.delCount = $scope.getDelCount($scope.contactList);
                    $scope.showDeleteAlla = true;
                    $scope.overLay = true;
                    break;
                case 'deleteOne':
                    if (!data.showDelete) {
                        return;
                    }
                    $scope.singleContact = {
                        'volId': data.id,
                        'extId': data.volunteerExt.transId,
                        'type': data.volunteerExt.type,
                        'pastFairVolunteer': data.volunteerExt.pastFairVolunteer
                    };
                    $scope.eledeleteOne = true;
                    $scope.overLay = true;
                    break;
                case 'addGroup':
                    console.log('add to group!!! ', $scope.selectedContacts);
                    if ((data && data.email === '') || $scope.containsEmptyEmail($scope.selectedContacts)) {
                        $scope.showEmptyEmailGroupComplaint();
                        return;
                    }
                    $scope.overLay = true;

                    if ($scope.groupList.length === 0) {
                        console.log('set the thing true');
                        $scope.newGroupBox = true;
                    }

                    $scope.selectGrp = [];
                    // When we are only adding one contact.
                    if (data !== null) {
                        $scope.deleteList.push({
                            'volId': data.id,
                            'extId': data.volunteerExt.transId
                        });
                        console.log('add contact %i', data.id);
                    }
                    console.log('deleteList %o to group(s) %o', $scope.deleteList, $scope.selectGrp);
                    $scope.addGroup = true;
                    break;
                case 'allContacts':
                    // Add all contacts to group

                    // Weird hack needed for VMS-1233
                    $scope.checkAll = true;
                    if ($scope.containsEmptyEmail($scope.contactList)) {
                        $scope.showEmptyEmailGroupComplaint();
                        return;
                    }
                    $scope.allContacts = 'All';
                    $scope.overLay = true;
                    $scope.addGroup = true;
                    break;
                case 'removefromGroup':
                    console.log($scope.deleteList);
                    console.log($scope.removeGro);
                    contactService.removefromGroup($scope.deleteList, $scope.removeGro).then(
                        function(data) {
                            $scope.$broadcast('getAllGroups', '');
                            $scope.$broadcast('getSpecificContactList', $scope.removeGro);

                            angular.forEach($scope.contactList, function(contact) {
                                contact.checked = false;
                                $('.actionPanel').hide();
                            });
                            $scope.deleteList = [];
                            $scope.checkAll = false;

                            $scope.selectAllChecked = false;
                            $scope.deleteList = [];
                            $scope.unCheckContacts();
                        },
                        function(data) {
                            console.error('failed to remove from group');
                        });
                    break;
                case 'sendmsg':
                    //console.log("selected: ", $scope.selectedContacts);
                    if ($scope.containsEmptyEmail($scope.selectedContacts)) {
                        $scope.showEmptyEmailComplaint();
                        return;
                    }

                    var tmpVol = [],
                        tmpGrp = [];

                    // Get rid of people who have no email address.
                    angular.forEach($scope.sendmsgContacts, function(contact) {
                        if (contact.email !== '') {
                            tmpVol.push(contact);
                        }
                    });

                    // Remove the empty group
                    angular.forEach($scope.groupList, function(group) {
                        if (group.id !== 10) {
                            tmpGrp.push(group);
                        }
                    });
                    if (data !== "") {
                        $window.sessionStorage.setItem('emailcontacts', JSON.stringify($scope.selectedContacts));
                    } else {
                        $window.sessionStorage.removeItem('emailcontacts');
                    }
                    $window.sessionStorage.setItem('allContacts', JSON.stringify(tmpVol));
                    $window.sessionStorage.setItem('allgroups', JSON.stringify(tmpGrp));
                    console.log("Send Message From Contacts /contacts/message/" + $routeParams.orgId + "/" + $routeParams.eventId);
                    $location.path('/contacts/message/' + $routeParams.orgId + '/' + $routeParams.eventId);
                    break;
                case 'indSendmsg':
                    if (data.email === "") {
                        $scope.showEmptyEmailComplaint();
                        return;
                    }
                    $window.sessionStorage.setItem('emailcontacts', JSON.stringify([data]));
                    $window.sessionStorage.setItem('allContacts', JSON.stringify($scope.contactList));
                    $window.sessionStorage.setItem('allgroups', JSON.stringify($scope.groupList));
                    console.log("Send Message From Contacts /contacts/message/" + $routeParams.orgId + "/" + $routeParams.eventId);
                    $location.path('/contacts/message/' + $routeParams.orgId + '/' + $routeParams.eventId);
                    break;
                default:
                    break;
            }
        };

        $scope.closePopUp = function() {
            $rootScope.resetDuration();
            $scope.overLay = false;
            $scope.showDeleteAlla = false;
            $scope.eleSelected = false;
            $scope.addGroup = false;
            $scope.eledeleteOne = false;
            $scope.importElement = false;
            $scope.exportElement = false;
            $scope.sendNoEmail = false;
            $scope.addGroupNoEmail = false;
            $scope.emptyContact = false;
        };

        $scope.closeGroupPopup = function() {
            $scope.closePopUp();
            $scope.unCheckGroups();
        };

        $scope.unCheckGroups = function() {
            angular.forEach($scope.groupList, function(group) {
                group.checked = false;
            });
            $scope.selectGrp.length = 0;
            $scope.selectGrp = [];
        };

        $scope.unCheckContacts = function() {
            angular.forEach($scope.contactList, function(contact) {
                contact.checked = false;
            });
            $scope.deleteList = [];
            $scope.deleteList.length = 0;
            angular.element('.actionPanel').hide();
        };

        $scope.deleteAllContacts = function() {
            angular.forEach($scope.contactList, function(contact) {
                $scope.deleteAll.push({
                    'volId': contact.id,
                    'extId': contact.volunteerExt.transId
                });
            });

            contactService.deleteContact($scope.deleteAll).then(
                function(data) {
                    $scope.closePopUp();
                    $scope.unCheckContacts();

                    // TODO / CHRIS: Disable the all button here?
                    angular.forEach($scope.contactList, function(contact) {
                        contact.checked = false;
                        $('.actionPanel').hide();
                    });
                    $scope.deleteList = [];
                    $scope.checkAll = false;

                    $scope.getContactList();
                    $scope.$broadcast('getAllGroups', '');
                },
                function(data) {
                    console.error('failed to delete all contacts');
                });
        };

        $scope.deleteContact = function() {
            console.log('delete selected contact');
            contactService.deleteContact([$scope.singleContact]).then(
                function(data) {
                    $scope.closePopUp();
                    $scope.getContactList();
                    $scope.$broadcast('getAllGroups', '');
                },
                function(data) {
                    console.error('failed to delete contact');
                });
        };

        $scope.deleteSelected = function() {
            console.log('deleteList: {}', $scope.deleteList);
            contactService.deleteContact($scope.deleteList).then(
                function(data) {
                    $scope.closePopUp();
                    $scope.getContactList();
                    $scope.$broadcast('getAllGroups', '');
                    $scope.selectedContacts = [];
                    $scope.selectedContacts.length = 0;
                },
                function(data) {
                    console.error('failed to delete selected contacts');
                });
        };

        function reset() {
            $scope.deleteList = [];
            $scope.checkAll = false;
            $scope.newGroupBox = false;
            $scope.selectGrp = [];
            $scope.deleteAll = [];
            $scope.newGrp = '';
            $scope.allContacts = '';
            $scope.$broadcast('getAllGroups', '');
            $scope.unCheckContacts();
            $scope.closePopUp();
        }

        $scope.addToGroup = function() {
            console.log('deleteAll: %o, selectGroup: %o, newGroup: %o', $scope.deleteAll, $scope.selectGrp, $scope.newGrp);

            if ($scope.allContacts === 'All') {
                // When we want to add/delete everyone
                angular.forEach($scope.contactList, function(contact) {
                    if (contact.email === '') {
                        console.error('empty email, cry');
                        return;
                    }
                    $scope.deleteAll.push({
                        'volId': contact.id,
                        'extId': contact.volunteerExt.transId
                    });
                });

                contactService.addtoGroup($scope.deleteAll, $scope.selectGrp, $scope.newGrp).then(
                    function(data, status) {
                        reset();
                    },
                    function(data, status) {
                        console.error('failed to add to group');
                    });

            } else {
                // When we want to add/delete only some people
                angular.forEach($scope.deleteList, function(contact) {
                    if (contact.email === '') {
                        console.error('empty email, cry');
                        return;
                    }
                    console.log('$scope.deleteList, $scope.selectGrp, $scope.newGrp');
                });

                contactService.addtoGroup($scope.deleteList, $scope.selectGrp, $scope.newGrp).then(
                    function(data, status) {
                        reset();
                    },
                    function(data, status) {
                        console.error('failed to add to group');
                    });
            }

            // Clear everyone we submitted.
            $scope.deleteList = [];
        };

        $scope.selectAll = function() {
            $scope.unCheckContacts();
            if ($scope.checkAll) {
                angular.forEach($scope.contactList, function(contact) {
                    contact.checked = true;
                    $scope.deleteList.push({
                        'volId': contact.id,
                        'extId': contact.volunteerExt.transId
                    });
                    $scope.selectedContacts.push(contact); //VMS-1658
                });
            } else {
                angular.forEach($scope.contactList, function(contact) {
                    contact.checked = false;
                    $('.actionPanel').hide();
                });
                $scope.deleteList = [];
                $scope.selectedContacts = []; //VMS-1658
                $scope.checkAll = false;
            }
        };

        $scope.reload = function() {
            $scope.getContactList();
            $scope.$broadcast('getAllGroups', '');
            $scope.closePopUp();
        };

        $scope.$on('groupContacts', function(e, data) {
            console.log('clear sendmesgContacts');
            $scope.checkAll = false;
            $scope.selectedContacts = [];
            $scope.deleteList = [];
            $scope.contactList = data;
        });

        $scope.$on('getContacts', function(e, data) {
            console.log('clear sendmesgContacts');
            $scope.checkAll = false;
            $scope.selectedContacts = [];
            $scope.deleteList = [];
            $scope.getContactList();
        });

        //
        // MAIN
        //
        contactService.setOrgId($routeParams.orgId);
        contactService.setEventId($routeParams.eventId);

        if (angular.isDefined($routeParams.crmid) && $routeParams.crmid !== null) {
            $window.sessionStorage.setItem('CrmId', $routeParams.crmid);
        }
        if (angular.isDefined($routeParams.type) && $routeParams.type !== null) {
            $window.sessionStorage.setItem('ContactType', $routeParams.type);
        }
        if (angular.isDefined($routeParams.spsid) && $routeParams.spsid !== null) {
            $window.sessionStorage.setItem('SpsId', $routeParams.spsid);
        }

        //console.log("orgId: %i ; eventId: %i ; janrain: %i", $routeParams.orgId, $routeParams.eventId, $routeParams.janrain);

        if (!angular.isUndefined($routeParams.janrain)) {
            console.log("janrain parameter is set , show Import Contacts Popup");
            importService.setItem('importing');
        }

        if (importService.getItem() === 'importing') {
            $scope.overLay = true;
            $scope.importElement = true;
            $scope.importing = true;
            $timeout(function() {
                $scope.importing = false;
            }, 1000);
            importService.setItem(null);
        }
        if (importService.getItem() === 'exporting') {
            $scope.overLay = true;
            $scope.exportElement = true;
            $scope.importing = true;
        }

        $scope.getContactList();
    }]);

    app.controller('contactGroupController', ['$scope', '$http', '$window', 'contactService', '$location', 'urlprefix', 'teamsite', function($scope, $http, $window, contactService, $location, urlprefix, teamsite) {
        $scope.groupList = [];
        $scope.defaultGroupList = [];
        $scope.updateGrp = [];
        $scope.hideThis = false;
        $scope.orgId = contactService.getOrgId();
        $scope.eventId = contactService.getEventId();
        $scope.selectedGroup = -2;

        $scope.getGroups = function() {
            console.log('get all groups');
            contactService.getGroups($scope.orgId, $scope.eventId)
                .then(function(response) {
                        $scope.groupList = response.data.userGroups;
                        $scope.defaultGroupList = response.data.defaultGroups;
                        $window.sessionStorage.setItem('curFairGroupList', JSON.stringify($scope.defaultGroupList));
                        $scope.$parent.groupList = response.data.userGroups;
                    },
                    function(response) {
                        console.error('getting groups failed, redirecting to main page.');
                        if (response.data > 500) {
                            if (response.status >= 400 && response.status < 500) {
                                $scope.$parent.showWarning4xx = true;
                            }
                            if (response.status >= 500 && response.status < 600) {
                                $scope.$parent.showWarning5xx = true;
                            }
                        }
                    });
        };

        $scope.saveGrps = function() {
            if (!angular.isUndefined($scope.newGroup)) {
                $scope.updateGrp.push({
                    name: $scope.newGroup,
                    action: 'NEW'
                });
            }
            var groupInfo = {
                modifiedBy: 1032,
                schoolId: $scope.orgId,
                userGroups: $scope.updateGrp
            };

            contactService.saveGroup(groupInfo).then(
                function(response) {
                    console.log('POST added to group');
                    $scope.getGroups();
                    $scope.showfilds = false;
                    $scope.newGroup = '';
                },
                function(response) {
                    console.error('failed to POST new group');
                });
            $scope.updateGrp = [];
        };

        $scope.action = function(grp, act) {
            switch (act) {
                case 'EDIT':
                    grp.action = act;
                    $scope.updateGrp.push(grp);
                    break;
                case 'DELETE':
                    grp.action = act;
                    $scope.updateGrp.push(grp);
                    break;
                default:
                    break;
            }
        };

        $scope.updateContactList = function(gp) {
            $scope.$parent.showRemoveGrp = true;
            $scope.$parent.removeGro = gp.id;
            $scope.$parent.include.top_contact = teamsite + '/CON100_Contact.html';

            $scope.selectedGroup = gp.id;

            contactService.getGroupMembers($scope.orgId, $scope.eventId, gp.id).then(
                function(response) {
                    $scope.$emit('groupContacts', response.data.volunteers);
                    $scope.$parent.tableHeader = gp.name;
                },
                function(response) {
                    console.error('error getting group');
                });
        };

        $scope.updateDefaultContactList = function(gp) {
            var url = '';
            $scope.$parent.showRemoveGrp = false;
            $scope.$parent.removeGro = gp.id;

            $scope.selectedGroup = gp.id;

            switch (gp.id) {
                case -1: // Current Fair Volunteers
                    $scope.$parent.include.top_contact = teamsite + '/CON100_Contact-current.html';
                    url = '/volunteer-manager/volunteers/fairs/' + $scope.orgId + '/' + $scope.eventId;
                    break;
                case -2: // All contacts
                    $scope.$parent.include.top_contact = teamsite + '/CON100_Contact.html';
                    $scope.$emit('getContacts');
                    return;
                case -3: // Toolkit users
                    $scope.$parent.include.top_contact = teamsite + '/CON100_Contact-toolkit.html';
                    url = '/volunteer-manager/volunteers/toolkit/' + $scope.orgId + '/' + $scope.eventId;
                    break;
                case -4: // SFR/BOKC
                    $scope.$parent.include.top_contact = teamsite + '/CON100_Contact-sfr.html';
                    url = '/volunteer-manager/volunteers/toolkit/sfr/' + $scope.orgId + '/' + $scope.eventId;
                    break;
                case -5: // BFCs
                    $scope.$parent.include.top_contact = teamsite + '/CON100_Contact-bfc.html';
                    url = '/volunteer-manager/volunteers/toolkit/bfc/' + $scope.orgId + '/' + $scope.eventId;
                    break;
                default: // ???
                    url = '';
                    break;
            }

            $http.get(urlprefix + url).then(
                function(response) {
                    $scope.$emit('groupContacts', response.data);
                    $scope.$parent.tableHeader = gp.name;
                },
                function(response) {
                    console.error('failed to get default group');
                });
        };

        $scope.$on('getSpecificContactList', function(e, data) {
            console.log('data: %o', data);
            $scope.updateContactList({
                id: data,
                name: $scope.$parent.tableHeader
            });
        });

        $scope.$on('getAllGroups', function(e, data) {
            console.log('get all contact groups');
            $scope.selectedGroup = -2;
            $scope.getGroups();
        });

        $scope.grpList = function() {
            $scope.showfilds = false;
            $scope.hideThis = false;
            $scope.getGroups();
        };

        //
        // MAIN
        //
        $scope.getGroups();
    }]);

    app.controller('contactAddController', ['$scope', '$location', '$window', 'contactService', '$routeParams', 'teamsite', function($scope, $location, $window, contactService, $routeParams, teamsite) {
        $scope.master = contactService.getinfo();
        $scope.user = contactService.getinfo();
        $scope.submitted = false;
        $scope.showWarning5xx = false;
        $scope.cptkErrorMessage = null;
        $scope.stateList = {};
        $scope.toolkitChecked = false;
        $scope.include = {
            top: teamsite + "/AddContact.html",
        };

        $scope.goToContacts = function() {
            $location.path('/contacts/all/' + contactService.getOrgId() + '/' + contactService.getEventId());
            console.log('clear add contacts form');
            $scope.submitted = false;
            $scope.addcontact.$setPristine(true);
            $scope.reset();
        };

        $scope.getToolKitValue = function() {
            if ($("#toolKitValue").is(':checked')) {
                $scope.toolkitChecked = true;
            } else {
                $scope.toolkitChecked = false;
            }
            console.log("$scope.toolkitChecked", $scope.toolkitChecked);
        };

        $scope.addContactDetails = function(temp) {
            $scope.cptkErrorMessage = null;
            $scope.submitted = true;
            console.log('temp: %o', temp);
            console.log('errors: %o', $scope.addcontact.$error);
            console.log('phone: %s', $scope.user.phone);
            console.log('city: %s', $scope.user.city);
            console.log('state: %s', $scope.user.state);
            console.log('note: %s', $scope.user.note);
            console.log('$scope.user', $scope.user);
            $("#saveConId").prop("disabled", true);
            $("#saveAnotherConId").prop("disabled", true);
            $scope.user.toolKitAccess = $scope.toolkitChecked ? 'Y' : 'N';
            if ($scope.addcontact.$valid) {
                var verb = 'post';
                if ($scope.user.hasOwnProperty('id')) {
                    verb = 'put';
                }
                if (angular.isUndefined($scope.user.volunteerExt)) {
                    $scope.user.volunteerExt = {};
                    console.log("$scope.user.volunteerExt is NOT undefined");
                    console.log("$scope.user", $scope.user);
                    console.log("$scope.user.volunteerExt", $scope.user.volunteerExt);
                    if ($scope.user.phone) {
                        console.log($scope.user.volunteerExt.phone, $scope.user.phone);
                        $scope.user.volunteerExt.phone = $scope.user.phone;
                    }
                    if ($scope.user.city) {
                        console.log($scope.user.volunteerExt.city, $scope.user.city);
                        $scope.user.volunteerExt.city = $scope.user.city;
                    }
                    if ($scope.user.state) {
                        console.log($scope.user.volunteerExt.state, $scope.user.state);
                        $scope.user.volunteerExt.state = $scope.user.state;
                    }
                    if ($scope.user.postalCode) {
                        console.log($scope.user.volunteerExt.postalCode, $scope.user.postalCode);
                        $scope.user.volunteerExt.postalCode = $scope.user.postalCode;
                    }
                    if ($scope.user.address1) {
                        console.log($scope.user.volunteerExt.address1, $scope.user.address1);
                        $scope.user.volunteerExt.address1 = $scope.user.address1;
                    }
                    if ($scope.user.address2) {
                        console.log($scope.user.volunteerExt.address2, $scope.user.address2);
                        $scope.user.volunteerExt.address2 = $scope.user.address2;
                    }
                    if ($scope.user.note) {
                        console.log($scope.user.volunteerExt.note, $scope.user.note);
                        $scope.user.volunteerExt.note = $scope.user.note;
                    }
                    console.log("$scope.user.volunteerExt.note", $scope.user.volunteerExt.note);
                    console.log("$scope.user.volunteerExt.state", $scope.user.volunteerExt.state);
                    console.log("$scope.user.volunteerExt", $scope.user.volunteerExt);
                } else {
                    console.log("$scope.user.volunteerExt is undefined");
                }

                contactService.addContact($scope.user, verb).then(
                    function(data) {
                        if (data.data.cptkErrorMessage !== undefined && data.data.cptkErrorMessage !== null) {
                            $scope.cptkErrorMessage = data.data.statusMessage;
                            $("#saveConId").prop("disabled", false);
                            $("#saveAnotherConId").prop("disabled", false);
                        } else {
                            $scope.cptkErrorMessage = null;
                            switch (temp) {
                                case 'Save':
                                    $scope.goToContacts();
                                    break;
                                case 'addAnother':
                                    // TODO: This should clear the form and not reload.
                                    $window.location.reload();
                                    break;
                                default:
                                    break;
                            }
                        }
                        console.log(data.data.statusMessage);
                    },
                    function(data) {
                        $("#saveConId").prop("disabled", false);
                        $("#saveAnotherConId").prop("disabled", false);
                        if (data.data !== null && data.data !== undefined) {
                            $scope.status = data.data.errors[0].code;
                            $scope.data = data.data.errors[0].message;
                        } else {
                            $scope.showWarning5xx = true;
                        }
                        console.error($scope.data);
                    });
            } else {
                $window.parentIFrame.scrollTo(0, 0); //if errors scroll Iframe (VMS hosted) to top.
                console.log('something is invalid: {}', $scope.addcontact.$error);
                $("#saveConId").prop("disabled", false);
                $("#saveAnotherConId").prop("disabled", false);
            }
        };

        //
        // MAIN
        //
        if ($scope.user.toolKitAccess) {
            $scope.toolkitChecked = $scope.user.toolKitAccess === 'Y' ? true : false;
            $scope.user.toolKitAccess = $scope.user.toolKitAccess === 'Y' ? 'Y' : 'N';
        }

        if ($scope.user !== '') {
            $scope.user.state = $scope.user.volunteerExt.state;
        }

        $scope.reset = function() {
            $scope.user = angular.copy($scope.master);
        };

        contactService.getStates().then(
            function(data) {
                $scope.stateList = data.data;
            },
            function(data) {
                console.error('get states failed');
            });

        $scope.reset();

        contactService.setOrgId($routeParams.orgId);
        contactService.setEventId($routeParams.eventId);

        console.log("orgId: %i ; eventId: %i", $routeParams.orgId, $routeParams.eventId);
    }]);

    app.controller('carousel', ['$scope', '$window', function($scope, $window) {
        $scope.carouselWrap = true;
        $scope.carouselEle = true;
        $scope.CloseCarousel = function() {
            $scope.carouselWrap = false;
            $scope.carouselEle = false;
            $window.localStorage.setItem('sessionContactOverlay', true);
        };

        //
        // MAIN
        //
        if (JSON.parse($window.localStorage.getItem('contactOverlay')) === true || JSON.parse($window.localStorage.getItem('sessionContactOverlay')) === true) {
            $scope.carouselWrap = false;
            $scope.carouselEle = false;
        }
        $scope.donotShowOverLay = function() {
            $window.localStorage.setItem('contactOverlay', true);
        };
        $(window).unload(function() {
            $window.localStorage.removeItem('sessionContactOverlay');
        });
    }]);

    app.controller('contactsGroomController', ['$scope', 'contactService', '$location', '$routeParams', 'urlprefix', 'importService', 'teamsite', '$anchorScroll', '$window', function($scope, contactService, $location, $routeParams, urlprefix, importService, teamsite, $anchorScroll, $window) {

        $scope.selectedContacts = [];
        $scope.groomContacts = {};
        $scope.groomList = [];
        $scope.checkAll = false;
        $scope.include = {
            top_groom: teamsite + "/CON100_GroomContacts.html",
        };
        $scope.contactSort = 'first';
        $scope.fixSort = function() {
            if ($scope.contactSort === 'first') {
                $scope.sortOrder = ['volunteerExt.firstName', 'volunteerExt.lastName'];
            } else {
                $scope.sortOrder = ['volunteerExt.lastName', 'volunteerExt.firstName'];
            }
        };
        $scope.cancelImportContacts = function() {
            console.log("In cancelImportContacts");
            $window.localStorage.removeItem("manuallyClosed");
            contactService.cancelGroom($routeParams.orgId, $routeParams.eventId).then(
                function(data) {
                    console.log("Removed groomed contacts");
                },
                function(data) {
                    console.error('failed to remove groomed contacts');
                });
            console.log("Going back to Import Contacts");
            $location.path('/contacts/import/' + $routeParams.orgId + '/' + $routeParams.eventId);
        };

        $scope.saveImportedContacts = function() {
            console.error("In saveImportedContacts");
            $window.localStorage.removeItem("manuallyClosed");
            $scope.groomList = [];
            $scope.submitted = true;
            angular.forEach($scope.selectedContacts, function(contact) {
                if (contact.checked) {
                    $scope.groomList.push(contact.volunteerExt.transId);
                }
            });

            if ($scope.groomList.length === 0) {
                var id = $location.hash();
                $location.hash('importTop');
                $anchorScroll();
                $location.hash(id);
                return;
            }

            var groomContactsList = {
                schoolId: $routeParams.orgId,
                groomIds: $scope.groomList
            };

            contactService.saveImported(groomContactsList).then(
                function(data) {
                    console.log("Added groomed contacts successfully");
                },
                function(data) {
                    console.error('getting contacts failed.');
                });

            console.log("Going back to Contacts");
            importService.setItem('importing');
            $window.localStorage.setItem('sessionContactOverlay', true);
            $location.path('/contacts/all/' + $routeParams.orgId + '/' + $routeParams.eventId);

        };

        $scope.groomCount = function() {
            console.error("In groomCount");
            $scope.groomList = [];
            angular.forEach($scope.selectedContacts, function(contact) {
                if (contact.checked) {
                    $scope.groomList.push(contact.volunteerExt.transId);
                }
            });
        };

        $scope.getGroomContactsList = function() {
            console.error("In contactsGroomController");
            $window.localStorage.removeItem("manuallyClosed");
            contactService.getGroomContacts($routeParams.orgId, $routeParams.eventId).then(
                function(data) {
                    $scope.contactList = data.data.volunteers;
                    if (angular.isDefined(data.data.volunteers) && data.data.volunteers.length === 0) {
                        $location.path('/contacts/import/' + $routeParams.orgId + '/' + $routeParams.eventId);
                        $window.sessionStorage.setItem('Empty_Import_Contacts', 'true');
                    }
                    angular.forEach($scope.contactList, function(contact) {
                        contact.checked = true;
                        $scope.selectedContacts.push(contact);
                        $scope.groomList = $scope.selectedContacts;
                    });
                    $scope.checkAll = true;
                },
                function(data) {
                    console.error('getting contacts failed.');
                });
        };

        $scope.getGroomContactsList();

        $scope.selectAll = function() {
            if (!$scope.checkAll) {
                angular.forEach($scope.contactList, function(contact) {
                    contact.checked = false;
                });
                $scope.groomCount();
            } else {
                angular.forEach($scope.contactList, function(contact) {
                    contact.checked = true;
                });
                $scope.groomCount();
            }
        };

    }]);

})();
