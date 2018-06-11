'use strict';
describe('VMS.contactController', function() {
    var $controller,
        $scope,
        $httpBackend,
        $routeParams,
        $location,
        contactService,
        $importService,
        $rootScope,
        $window,
        dumble,
        urlprefix,
        getController,
        $timeout;

    beforeEach(module('contactsModule'));

    beforeEach(inject(function($injector, _$rootScope_, _$controller_, $q, _$timeout_) {
        $scope = _$rootScope_.$new();
        $rootScope = _$rootScope_;
        $controller = _$controller_;
        $httpBackend = $injector.get('$httpBackend');
        $routeParams = {
            orgId: 123,
            eventId: 456,
        };
        $timeout = _$timeout_;
        $rootScope.resetDuration = function() {};
        spyOn($rootScope, 'resetDuration');

        contactService = {
            setOrgId: function(orgId) {},
            setEventId: function(eventId) {},
            getOrgId: function() {
                return 123;
            },
            getEventId: function() {
                return 456;
            },
            deleteContact: function(aList) {
                var deferred = $q.defer();
                deferred.resolve({
                    data: {}
                });
                return deferred.promise;
            },
            clearinfo: function() {},
            setinfo: function() {},
            getContacts: function(a, b) {
                var deferred = $q.defer();
                deferred.resolve({
                    status: 200,
                    statusText: "OK",
                    data: {
                        volunteers: [{
                            checked: true,
                            email: '',
                        }, {
                            checked: false,
                            email: 'email@example.com',
                        }],
                        schoolName: '',
                        fairName: '',
                        fairStartEndRange: '',
                    }
                });
                return deferred.promise;
            },
            getGroups: function(a, b) {
                var deferred = $q.defer();
                deferred.resolve({
                    data: {}
                });
                return deferred.promise;
            },
            getVolunteerHistory: function(a) {
                var deferred = $q.defer();
                deferred.resolve({
                    data: {}
                });
                return deferred.promise;
            },
        };
        spyOn(contactService, 'setinfo');
        spyOn(contactService, 'clearinfo');
        spyOn(contactService, 'setOrgId');
        spyOn(contactService, 'setEventId');
        spyOn(contactService, 'getOrgId').and.callThrough();
        spyOn(contactService, 'getEventId').and.callThrough();
        spyOn(contactService, 'deleteContact').and.callThrough();
        spyOn(contactService, 'getContacts').and.callThrough();
        spyOn(contactService, 'getGroups').and.callThrough();
        spyOn(contactService, 'getVolunteerHistory').and.callThrough();

        $importService = {
            getItem: function() {},
            setItem: function(v) {}
        };
        spyOn($importService, 'getItem');
        spyOn($importService, 'setItem').and.callThrough();
        $location = {
            path: function(url) {},
        };
        spyOn($location, 'path');

        $window = {
            localStorage: {
                removeItem: function(thing) {},
                setItem: function(thing) {},
            },
            sessionStorage: {
                removeItem: function(thing) {},
                setItem: function(thing) {},
                getItem: function() {},
            },
            open: function(urls, target) {}

        };
        spyOn($window.localStorage, 'removeItem').and.callThrough();
        spyOn($window.localStorage, 'setItem').and.callThrough();
        spyOn($window.sessionStorage, 'removeItem').and.callThrough();
        spyOn($window.sessionStorage, 'setItem').and.callThrough();
        spyOn($window.sessionStorage, 'getItem').and.callThrough();
        spyOn($window, 'open').and.callThrough();
        // TODO: Expand on this and make sure it's ran each time.
        dumble = {
            setDumbleData: function() {},
        };
        spyOn(dumble, 'setDumbleData');
        urlprefix = '';
        getController = function() {
            return $controller('contactController', {
                $scope: $scope,
                dumble: dumble,
                contactService: contactService,
                $location: $location,
                $document: null,
                $window: $window,
                $timeout: $timeout,
                $route: null,
                $routeParams: $routeParams,
                importService: $importService,
                $rootScope: $rootScope,
                urlprefix: '',
                teamsite: ''
            });
        };
    }));

    it('Should have a controller', function() {
        var controller = getController();
        expect(controller).toBeDefined();
    });

    it('Should sort contacts with first name', function() {
        var controller = getController();
        $scope.fixSort();
        expect($scope.sortOrder).toEqual(['volunteerExt.firstName', 'volunteerExt.lastName']);
    });
    it('Should sort contacts with last name', function() {
        var controller = getController();
        $scope.contactSort = 'last';
        $scope.fixSort();
        expect($scope.sortOrder).toEqual(['volunteerExt.lastName', 'volunteerExt.firstName']);
    });
    it('Should convert time miliseconds', function() {
        var controller = getController();
        var expTime = moment('8:00 AM', "h:mm A").format("x");
        expect($scope.sortTimeAscending(['8:00 AM'])).toBe(expTime);
    });
    it('Should open new window and hide importing pop up with 1 sec delay', function() {
        var controller = getController();
        $scope.importData();
        $timeout.flush();
        expect($window.open).toHaveBeenCalledWith('/volunteer-manager/contact-migration/export/' + $routeParams.orgId + '/' + $routeParams.eventId, '_self');
        expect($scope.importing).toBeFalsy();
        expect($importService.setItem).toHaveBeenCalledWith(null);
    });
    it('Should call import service and set to null', function() {
        var controller = getController();
        $scope.importData();
        $timeout.flush();
        expect($importService.setItem).toHaveBeenCalled();
        expect($importService.setItem).toHaveBeenCalledWith(null);
    });

    it('Should have basic things set', function() {
        var controller = getController();

        $scope.getContactList();
        $scope.$digest();

        expect($scope.contactList).toBeDefined();
        expect($scope.sendmsgContacts).toBeDefined();
        expect($scope.schoolName).toBeDefined();
        expect($scope.fairName).toBeDefined();
        expect($scope.fairStartEndRange).toBeDefined();
        expect($scope.contactslength).toBeDefined();
        expect($scope.tableHeader).toBe('All Contacts');
    });

    it('Should have all contacts unchecked by default', function() {
        var controller = getController();
        $scope.$digest();

        angular.forEach($scope.contactList, function(contact) {
            expect(contact.checked).toBe(false);
        });
    });

    it('Should uncheck all conatcts', function() {
        var controller = getController();

        // Check one to see that it unchecks.
        $scope.unCheckContacts();
        $scope.$digest();

        angular.forEach($scope.contactList, function(contact) {
            expect(contact.checked).toBe(false);
        });
    });

    it('Should contain empty email address', function() {
        var controller = getController();
        $scope.$digest();
        expect($scope.containsEmptyEmail($scope.contactList)).toBe(true);
    });

    it('Should not contain empty email address', function() {
        var controller = getController();

        // Set any email address on the contacts.
        angular.forEach($scope.contactList, function(contact) {
            contact.email = "email@example.com";
        });

        expect($scope.containsEmptyEmail($scope.contactList)).toBe(false);
    });

    it('Should show empty email warning', function() {
        var controller = getController();
        $scope.showEmptyEmailGroupComplaint();
        expect($scope.addGroupNoEmail).toBeTruthy();
        expect($scope.overLay).toBeTruthy();
    });

    it('Should count number of contacts to delete', function() {
        var controller = getController();
        $scope.$digest();

        $scope.contactList[0].showDelete = false;
        $scope.contactList[1].showDelete = false;
        expect($scope.getDelCount($scope.contactList)).toBe(0);

        $scope.contactList[0].showDelete = false;
        $scope.contactList[1].showDelete = true;
        expect($scope.getDelCount($scope.contactList)).toBe(1);

        $scope.contactList[0].showDelete = true;
        $scope.contactList[1].showDelete = true;
        expect($scope.getDelCount($scope.contactList)).toBe(2);
    });

    it('Should go to add contact', function() {
        var controller = getController();

        $scope.performAction({}, 'addContacts');

        expect(contactService.clearinfo).toHaveBeenCalled();
        expect($location.path).toHaveBeenCalledWith('/contacts/add/' + $routeParams.orgId + '/' + $routeParams.eventId);
    });

    it('Should go to edit contacts', function() {
        var controller = getController();

        $scope.performAction({}, 'edit');

        expect(contactService.setinfo).toHaveBeenCalled();
        expect($location.path).toHaveBeenCalledWith('/contacts/add/' + $routeParams.orgId + '/' + $routeParams.eventId);
    });

    it('Should show delete selected confirmation', function() {
        var controller = getController();

        $scope.performAction({}, 'delete');

        expect($scope.delCount).toBe(0);
        expect($scope.eleSelected).toBeTruthy();
        expect($scope.overLay).toBeTruthy();
    });

    it('Should show delete all confirmation', function() {
        var controller = getController();

        $scope.performAction({}, 'DeleteAll');

        expect($scope.delCount).toBe(0);
        expect($scope.showDeleteAlla).toBeTruthy();
        expect($scope.overLay).toBeTruthy();
    });


    it('Should not show delete single confirmation', function() {
        var controller = getController();

        $scope.performAction({
            showDelete: false,
            id: 5,
            volunteerExt: {
                transId: 5
            },
        }, 'deleteOne');

        expect($scope.eledeleteOne).toBeFalsy();
        expect($scope.overLay).toBeFalsy();
    });

    it('Should show delete single confirmation', function() {
        var controller = getController();

        $scope.performAction({
            showDelete: true,
            id: 5,
            volunteerExt: {
                transId: 5
            },
        }, 'deleteOne');

        expect($scope.eledeleteOne).toBeTruthy();
        expect($scope.overLay).toBeTruthy();
    });

    it('Should show warning when trying to add an emailless contact to a group', function() {
        var controller = getController();

        $scope.showEmptyEmailGroupComplaint();

        expect($scope.addGroupNoEmail).toBeTruthy();
        expect($scope.overLay).toBeTruthy();
    });

    it('Should close open popups', function() {
        var controller = getController();

        $scope.closePopUp();

        expect($scope.overLay).toBeFalsy();
        expect($scope.showDeleteAlla).toBeFalsy();
        expect($scope.eleSelected).toBeFalsy();
        expect($scope.addGroup).toBeFalsy();
        expect($scope.eledeleteOne).toBeFalsy();
        expect($scope.importElement).toBeFalsy();
        expect($scope.exportElement).toBeFalsy();
        expect($scope.sendNoEmail).toBeFalsy();
        expect($scope.addGroupNoEmail).toBeFalsy();
        expect($scope.emptyContact).toBeFalsy();
    });

    it('Should load contacts page', function() {
        var controller = getController();

        $scope.goToContacts();

        expect($location.path).toHaveBeenCalledWith('/contacts/all/123/456');
    });

    it('Should load contact import page', function() {
        var controller = getController();

        $scope.goToImport();

        expect($location.path).toHaveBeenCalledWith('/contacts/import/123/456');
        expect(dumble.setDumbleData).toHaveBeenCalled();
    });

    it('Should load contact export page', function() {
        var controller = getController();

        $scope.goToExport();

        expect($location.path).toHaveBeenCalledWith('/contacts/export/123/456');
        expect(dumble.setDumbleData).toHaveBeenCalled();
    });

    it('Should use prefetched volunteer history', function() {
        var controller = getController();
        $scope.$digest();

        $scope.contactList[0].hasHistory = true;
        $scope.viewVolunteerHistory($scope.contactList[0]);

        expect($scope.contactList[0].hasHistory).toBeTruthy();
        expect($scope.contactList[0].volunteerHistory).toBeUndefined();
    });

    it('Should fetch volunteer history', function() {
        var controller = getController();
        $scope.$digest();

        $scope.contactList[0].id = 1;
        $scope.viewVolunteerHistory($scope.contactList[0]);
        $scope.$digest();

        expect($scope.contactList[0].hasHistory).toBeTruthy();
        expect($scope.contactList[0].volunteerHistory).toBeDefined();
    });

    it('Should not show the option delete selected', function() {
        var controller = getController();
        $scope.selectedContacts = [{
            showDelete: true
        }, {
            showDelete: false
        }];
        expect($scope.showDeleteSelected()).toBeFalsy();

        $scope.selectedContacts = [{
            showDelete: true
        }, {
            showDelete: true
        }];
        expect($scope.showDeleteSelected()).toBeTruthy();
    });

    it('Should disable add to group save button', function() {
        var controller = getController();
        $scope.selectGrp = [{}];
        expect($scope.disableAddToGroupSave()).toBeFalsy();

        $scope.selectGrp = [];
        $scope.newGroupBox = [];
        $scope.newGrp = [{}];
        expect($scope.disableAddToGroupSave()).toBeFalsy();

        $scope.selectGrp = {};
        $scope.newGroupBox = [];
        $scope.newGrp = [];
        expect($scope.disableAddToGroupSave()).toBeTruthy();
    });

    it('Should show city and state', function() {
        var controller = getController();
        expect($scope.showCityState({
            volunteerExt: {
                city: null,
                state: null
            }
        })).toBeFalsy();
        expect($scope.showCityState({
            volunteerExt: {
                city: 'nyc',
                state: null
            }
        })).toBeFalsy();
        expect($scope.showCityState({
            volunteerExt: {
                city: null,
                state: 'ny'
            }
        })).toBeFalsy();
        expect($scope.showCityState({
            volunteerExt: {
                city: 'nyc',
                state: 'ny'
            }
        })).toBeTruthy();
    });

    it('Should uncheck all groups', function() {
        var controller = getController();
        $scope.selectGrp = [{}];
        $scope.groupList = [{
            checked: true
        }, {
            checked: true
        }];
        $scope.unCheckGroups();
        expect($scope.selectGrp).toEqual([]);
        expect($scope.groupList).toEqual([{
            checked: false
        }, {
            checked: false
        }]);
    });

    it('Should show empty email complaint when trying to send a message to someone who has no email', function() {
        var controller = getController();
        $scope.selectedContacts = [];

        $scope.showEmptyEmailComplaint();
        expect($scope.sendNoEmail).toBeTruthy();
        expect($scope.overLay).toBeTruthy();
        expect($scope.emptyContact).toBeTruthy();

        $scope.selectedContacts = [{
            email: 'example@example.com'
        }, {
            email: ''
        }];
        $scope.showEmptyEmailComplaint();
        expect($scope.emptyContacts).toBe(1);
        expect($scope.validContacts).toBe(1);
        expect($scope.emptyContact).toBeTruthy();
    });

    it('Should go to send message', function() {
        var controller = getController();
        // No contacts
        $scope.contactList = [];
        $scope.groupList = [];
        $scope.goToSendMessage();
        expect($scope.checkAll).toBeFalsy();

        // Empty email
        $scope.contactList = [{
            email: 'example@example.com'
        }, {
            email: ''
        }];
        $scope.goToSendMessage();
        expect($scope.checkAll).toBeTruthy();

        // All good
        $scope.contactList = [{
            email: 'example@example.com'
        }, {
            email: 'example2@example.com'
        }];
        $scope.goToSendMessage();
        expect($scope.checkAll).toBeTruthy();

    });

    it('Should send a message', function() {
        var controller = getController();
        $scope.sendmsgContacts = [{
            email: ''
        }, {
            email: 'example@example.com'
        }];
        $scope.groupList = [{
            id: 10
        }, {
            id: 20
        }];
        $scope.selectedContacts = [];

        $scope.sendMessage();

        expect($window.sessionStorage.setItem.calls.allArgs()).toEqual([
            ['emailcontacts', '[]'],
            ['allContacts', '[{"email":"example@example.com"}]'],
            ['allgroups', '[{"id":20}]']
        ]);
        expect($location.path).toHaveBeenCalledWith('/contacts/message/' + $routeParams.orgId + '/' + $routeParams.eventId);
    });

    it('Should delete all contacts', function() {
        var controller = getController();
        $scope.deleteAll = [];
        $scope.contactList = [{
                checked: true,
                id: 5,
                volunteerExt: {
                    transId: 10
                }
            }, {
                checked: true,
                id: 6,
                volunteerExt: {
                    transId: 20
                }
            },

        ];

        expect($scope.deleteList.length).toBe($scope.deleteList.length);

        $scope.deleteAllContacts();
        $scope.$root.$digest();

        expect($scope.contactList[0].checked).toBeFalsy();
        expect($scope.contactList[1].checked).toBeFalsy();
        expect(contactService.deleteContact).toHaveBeenCalled();
        expect($scope.deleteList.length).toBe(0);
        expect($scope.checkAll).toBeFalsy();
    });

    it('Should delete single contact', function() {
        var controller = getController();

        $scope.singleContact = {
            id: 5
        };

        $scope.deleteContact();
        $scope.$root.$digest();

        expect(contactService.deleteContact).toHaveBeenCalled();
    });

    it('Should delete selected', function() {
        var controller = getController();

        $scope.selectedContacts = [{}, {}, {}];
        $scope.deleteList = [{}, {}, {}];

        $scope.deleteSelected();
        $scope.$root.$digest();

        // TODO: This expect is pretty weak
        expect($scope.selectedContacts.length).toBe(0);
    });

    // XXX: Since reset is not on the scope weird things happen. Investigate putting it on the scope. Might not be worth it.
    xit('Should reset things', function() {
        var controller = getController();

        $scope.deleteList = [{}, {}, {}];
        $scope.checkAll = true;
        $scope.newGroupBox = true;
        $scope.selectGrp = [{}, {}, {}];
        $scope.deleteAll = [{}, {}, {}];
        $scope.newGrp = '123';
        $scope.allContacts = '123';
        $scope.contactList = [{
            checked: true
        }, {
            checked: true
        }];

        // NOTE: Not on scope.
        $scope.reset();

        expect($scope.deleteList).toBe([]);
        expect($scope.checkAll).toBeFalsy();
        expect($scope.newGroupBox).toBeFalsy();
        expect($scope.selectGrp).toBe([]);
        expect($scope.deleteAll).toBe([]);
        expect($scope.newGrp).toBe('');
        expect($scope.allContacts).toBe('');
        expect($scope.contactList[0].checked).toBeTruthy();
    });

});

describe('VMS.contactGroupController', function() {
    var $controller,
        getController,
        $scope,
        $httpBackend,
        teamsite,
        urlprefix,
        contactService,
        $q,
        $window;

    beforeEach(module('contactsModule'));

    beforeEach(inject(function($injector, _$rootScope_, _$controller_, _$q_) {
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
        $q = _$q_;
        $httpBackend = $injector.get('$httpBackend');

        teamsite = '';
        urlprefix = '';

        $scope.$parent.include = {
            top_contact: teamsite + '/CON100_Contact.html'
        };

        contactService = {
            getOrgId: function() {
                return 123;
            },
            getEventId: function() {
                return 456;
            },
            getGroups: function(a, b) {
                var deferred = $q.defer();
                deferred.resolve({
                    data: {}
                });
                return deferred.promise;
            },
            getGroupMembers: function(a, b, c) {
                var deferred = $q.defer();
                deferred.resolve({
                    data: {}
                });
                return deferred.promise;
            },

        };
        spyOn(contactService, 'getOrgId');
        spyOn(contactService, 'getEventId');
        spyOn(contactService, 'getGroups').and.callThrough();
        spyOn(contactService, 'getGroupMembers').and.callThrough();

        $window = {
            localStorage: {
                removeItem: function(thing) {},
                setItem: function(thing) {},
            },
            sessionStorage: {
                removeItem: function(thing) {},
                setItem: function(thing) {},
                getItem: function() {},
            }
        };
        spyOn($window.localStorage, 'removeItem').and.callThrough();
        spyOn($window.localStorage, 'setItem').and.callThrough();
        spyOn($window.sessionStorage, 'removeItem').and.callThrough();
        spyOn($window.sessionStorage, 'setItem').and.callThrough();
        spyOn($window.sessionStorage, 'getItem').and.callThrough();

        var groupRegExp = new RegExp(urlprefix + '/volunteer-manager/group/listContacts/*./*./*.');
        $httpBackend.whenGET(groupRegExp).respond({});

        getController = function() {
            return $controller('contactGroupController', {
                $scope: $scope,
                //$http: null,
                $window: $window,
                contactService: contactService,
                $location: null,
                urlprefix: urlprefix,
                teamsite: teamsite,
            });
        };
    }));

    it('Should have a controller', function() {
        var controller = getController();
        expect(controller).toBeDefined();
    });

    it('Should swap out include file when a groups are clicked', function() {
        var controller = getController();
        // This is how it is by default.
        expect($scope.$parent.include.top_contact).toBe(teamsite + '/CON100_Contact.html');

        $scope.updateDefaultContactList({
            id: -1
        });
        expect($scope.$parent.include.top_contact).toBe(teamsite + '/CON100_Contact-current.html');

        $scope.updateDefaultContactList({
            id: -2
        });
        expect($scope.$parent.include.top_contact).toBe(teamsite + '/CON100_Contact.html');

        $scope.updateDefaultContactList({
            id: -3
        });
        expect($scope.$parent.include.top_contact).toBe(teamsite + '/CON100_Contact-toolkit.html');

        $scope.updateDefaultContactList({
            id: -4
        });
        expect($scope.$parent.include.top_contact).toBe(teamsite + '/CON100_Contact-sfr.html');

        $scope.updateDefaultContactList({
            id: -5
        });
        expect($scope.$parent.include.top_contact).toBe(teamsite + '/CON100_Contact-bfc.html');

        $scope.updateContactList({
            id: 123
        });

        expect($scope.$parent.include.top_contact).toBe(teamsite + '/CON100_Contact.html');

    });

});

describe('VMS.contactAddController', function() {
    var $controller,
        getController,
        contactService,
        $routeParams,
        $httpBackend,
        $location,
        $scope,
        $window,
        $compile,
        $q;

    beforeEach(module('contactsModule'));
    beforeEach(inject(function($injector, _$rootScope_, _$controller_, _$q_, _$compile_) {
        $scope = _$rootScope_.$new();
        $compile = _$compile_;
        $controller = _$controller_;
        $httpBackend = $injector.get('$httpBackend');
        $q = _$q_;
        $routeParams = {
            orgId: 123,
            eventId: 456,
        };
        $scope.addcontact = {
            $valid: false,
            $setPristine: function() {}
        };
        $window = {
            parentIFrame: {
                scrollTo: function(a, b) {}
            }
        };
        $location = {
            path: function(url) {},
        };
        spyOn($location, 'path');
        contactService = {
            getinfo: function() {
                return {
                    toolKitAccess: 'Y',
                    volunteerExt: {
                        state: 'NJ',
                    },
                };
            },
            getStates: function() {
                var d = $q.defer();
                d.resolve('Remote call result');
                return d.promise;
            },
            setOrgId: function(org) {},
            getOrgId: function() {
                return;
            },
            setEventId: function(event) {},
            getEventId: function() {
                return;
            },
            addContact: function(user, verb) {
                var d = $q.defer();
                d.resolve('Remote call result');
                return d.promise;
            }
        };
        spyOn(contactService, 'getinfo').and.callThrough();
        spyOn(contactService, 'getStates').and.callThrough();
        spyOn(contactService, 'setOrgId');
        spyOn(contactService, 'getOrgId').and.callThrough();
        spyOn(contactService, 'setEventId');
        spyOn(contactService, 'getEventId').and.callThrough();
        spyOn(contactService, 'addContact').and.callThrough();
        spyOn($window.parentIFrame, 'scrollTo');
        getController = function() {
            return $controller('contactAddController', {
                $scope: $scope,
                //$http: '',
                $location: $location,
                $compile: $compile,
                $window: $window,
                contactService: contactService,
                $routeParams: $routeParams,
                urlprefix: '',
                teamsite: '',
            });
        };
    }));
    it('Should have a controller', function() {
        var controller = getController();
        expect(controller).toBeDefined();
    });
    it('Should redirects to All contacts page', function() {
        var controller = getController();
        $scope.goToContacts();
        expect($location.path).toHaveBeenCalled();
        expect($scope.submitted).toBeFalsy();
    });
    it('Should check tool kit Access', function() {
        var controller = getController();
        $scope.getToolKitValue();
        expect($scope.toolkitChecked).toBeFalsy();
    });
    it('Should submit the form', function() {
        var controller = getController();
        $scope.addContactDetails();
        expect($scope.submitted).toBeTruthy();
    });
    it('Should validate the form', function() {
        var controller = getController();
        $scope.addcontact.$valid = true;
        $scope.addContactDetails();
        expect(contactService.addContact).toHaveBeenCalled();
    });
    it('Should get states details', function() {
        var controller = getController();
        expect(contactService.getStates).toHaveBeenCalled();
    });

    it('Should Scroll top', function() {
        var controller = getController();
        $scope.addContactDetails();
        expect($window.parentIFrame.scrollTo).toHaveBeenCalled();
    });
});

describe('VMS.carousel', function() {
    var $controller,
        getController,
        $window,
        mockStore,
        $scope;

    beforeEach(module('contactsModule'));
    beforeEach(inject(function($injector, _$rootScope_, _$controller_) {
        $scope = _$rootScope_.$new();
        $controller = _$controller_;

        mockStore = {},

            $window = {
                localStorage: {
                    getItem: function(item) {
                        return true;
                    },
                    setItem: function(item) {},
                },
                sessionStorage: {
                    setItem: function(item, stuff) {
                        mockStore[item] = stuff;
                    },
                    getItem: function(item) {
                        return mockStore[item];
                    },
                },
            };
        //spyOn($window.localStorage, 'getItem');
        //spyOn($window.localStorage, 'setItem');
        spyOn($window.sessionStorage, 'getItem').and.callThrough();
        spyOn($window.sessionStorage, 'setItem').and.callThrough();

        getController = function() {
            return $controller('carousel', {
                $scope: $scope,
                //$http: null,
                $window: $window,
            });
        };
    }));

    it('Should have a controller', function() {
        var controller = getController();
        expect(controller).toBeDefined();
    });

    it('Should close carousel', function() {
        var controller = getController();

        $scope.carouselWrap = true;
        $scope.carouselEle = true;

        $scope.CloseCarousel();

        expect($scope.carouselWrap).toBeFalsy();
        expect($scope.carouselEle).toBeFalsy();
    });
});

describe('VMS.contactsGroomController', function() {
    var $controller,
        getController,
        getRegEx,
        delRegEx,
        contactService,
        $scope,
        $httpBackend,
        $location,
        $routeParams,
        $q,
        $urlprefix,
        $teamsite;

    beforeEach(module('contactsModule'));
    beforeEach(inject(function($injector, _$rootScope_, _$controller_, _$q_) {
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
        $q = _$q_;
        $httpBackend = $injector.get('$httpBackend');
        $urlprefix = '';

        getRegEx = new RegExp($urlprefix + '/volunteer-manager/contact/groom/.*/.*');
        delRegEx = new RegExp($urlprefix + '/volunteer-manager/contact/groom/.*/.*');

        $routeParams = {
            orgId: 100,
            eventId: 200,
        };

        $location = {
            path: function(a) {},
        };
        spyOn($location, 'path');

        contactService = {
            getGroups: function(a, b) {
                var deferred = $q.defer();
                deferred.resolve({
                    data: {},
                });
                return deferred.promise;
            },
            getGroomContacts: function(a, b) {
                var deferred = $q.defer();
                deferred.resolve({
                    data: {
                        volunteers: [{}],
                    },
                });
                return deferred.promise;
            },
            cancelGroom: function(a) {
                var deferred = $q.defer();
                deferred.resolve({
                    data: {},
                });
                return deferred.promise;
            },
        };
        spyOn(contactService, 'getGroups').and.callThrough();
        spyOn(contactService, 'getGroomContacts').and.callThrough();
        spyOn(contactService, 'cancelGroom').and.callThrough();

        getController = function() {
            return $controller('contactsGroomController', {
                $scope: $scope,
                contactService: contactService,
                //$http: null,
                $location: $location,
                $routeParams: $routeParams,
                teamsite: '',
                urlprefix: $urlprefix,
                importService: null,
                $anchorScroll: null,
            });
        };

    }));

    it('Should have a controller', function() {
        var controller = getController();
        expect(controller).toBeDefined();
    });

    it('Should get groomed contacts', function() {
        var controller = getController();

        $scope.getGroomContactsList();
        $scope.$digest();

        expect($scope.selectedContacts[0]).toBeTruthy();
        expect($scope.checkAll).toBeTruthy();
    });

    it('Should cancel import', function() {
        var controller = getController();

        $httpBackend.whenGET(getRegEx).respond({});
        $httpBackend.whenDELETE(delRegEx).respond({});

        $scope.cancelImportContacts();

        expect($location.path).toHaveBeenCalledWith('/contacts/import/' + $routeParams.orgId + '/' + $routeParams.eventId);
    });

    it('Should get groom count', function() {
        var controller = getController();
        $scope.selectedContacts = [{
            checked: true,
            volunteerExt: {
                transId: 10,
            },
        }, {
            checked: false,
            volunteerExt: {
                transId: 20,
            },
        }, {
            checked: true,
            volunteerExt: {
                transId: 30,
            },
        }, ];

        $scope.groomCount();

        expect($scope.groomList.length).toBe(2);
    });

});
