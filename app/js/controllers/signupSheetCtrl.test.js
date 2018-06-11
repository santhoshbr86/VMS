'use strict';
describe('VMS.signupSheetController', function() {
    var $controller,
        $scope,
        $routeParams,
        $rootScope,
        $q,
        $httpBackend,
        $window,
        signupSheetService,
        socialMediaService,
        mockStore,
        dumble,
        fairStore,
        $location,
        contactService,
        getController;

    beforeEach(module('signupSheetModule'));

    beforeEach(inject(function($injector, _$rootScope_, _$controller_, _$q_) {
        $scope = _$rootScope_.$new();
        $scope.$parent = {};
        $controller = _$controller_;
        $q = _$q_;
        $httpBackend = $injector.get('$httpBackend');

        $routeParams = {
            orgId: 123,
            eventId: 456,
        };

        $rootScope = {
            $on: function(a, b) {},
            $digest: function() {},
            $apply: function() {},
            resetDuration: function() {},
        };
        spyOn($rootScope, '$on');
        spyOn($rootScope, '$digest').and.callThrough();
        spyOn($rootScope, '$apply').and.callThrough();
        spyOn($rootScope, 'resetDuration');

        signupSheetService = {
            getContacts: function() {
                return {};
            },
            getsignupsheetStore: function() {
                return {};
            },
            getSignupSheets: function(orgId, eventId) {
                var q = $q.defer();
                q.resolve({
                    data: {
                        active: [{}],
                    }
                });
                return q.promise;
            },
            setsignupsheetStore: function(signupsheet) {},
            clearId: function() {},
            setId: function() {},
            setFairId: function(a) {},
            setPastfairId: function() {},
            setOrgId: function(a) {},
        };
        spyOn(signupSheetService, 'getContacts').and.callThrough();
        spyOn(signupSheetService, 'getsignupsheetStore').and.callThrough();
        spyOn(signupSheetService, 'getSignupSheets').and.callThrough();
        spyOn(signupSheetService, 'setsignupsheetStore').and.callThrough();
        spyOn(signupSheetService, 'clearId');
        spyOn(signupSheetService, 'setId');
        spyOn(signupSheetService, 'setFairId');
        spyOn(signupSheetService, 'setPastfairId');
        spyOn(signupSheetService, 'setOrgId');

        socialMediaService = {
            getFBError: function() {},
        };
        spyOn(socialMediaService, 'getFBError');

        mockStore = {};
        $window = {
            open: function(a, b) {},
            sessionStorage: {
                setItem: function(item, stuff) {
                    console.log('chris set some stuff');
                    console.log(stuff);
                    mockStore[item] = stuff;
                    console.log(mockStore);
                },
                getItem: function(item) {
                    return mockStore[item];
                },
                removeItem: function(item) {
                    delete mockStore[item];
                },
            },
        };
        spyOn($window, 'open');
        spyOn($window.sessionStorage, 'getItem').and.callThrough();
        spyOn($window.sessionStorage, 'setItem').and.callThrough();
        spyOn($window.sessionStorage, 'removeItem').and.callThrough();

        $location = {
            path: function() {},
        };
        spyOn($location, 'path');

        dumble = {
            setDumbleData: function() {

            },
        };
        spyOn(dumble, 'setDumbleData');

        fairStore = {
            storeTasks: function(a) {},
            clearStoreTasks: function() {},
            getPublishedFlag: function() {},
            setPublishedFlag: function(b) {}
        };
        spyOn(fairStore, 'clearStoreTasks');
        spyOn(fairStore, 'storeTasks');
        spyOn(fairStore, 'getPublishedFlag');
        spyOn(fairStore, 'setPublishedFlag');
        contactService = {
            getGroups: function(a, b) {
                var deferred = $q.defer();
                deferred.resolve({
                    status: 200,
                    data: {
                        defaultGroups: [{
                            id: 100
                        }, {
                            id: 200
                        }],
                        userGroups: [{
                            id: 10
                        }, {
                            id: 20
                        }],
                    }
                });
                return deferred.promise;
            },
            getContacts: function(a, b) {
                var deferred = $q.defer();
                deferred.resolve({
                    data: {}
                });
                return deferred.promise;
            },
            getUserGroups: function(d) {
                return [{
                    id: 20
                }];
            },
        };
        spyOn(contactService, 'getGroups').and.callThrough();
        spyOn(contactService, 'getContacts').and.callThrough();

        getController = function() {
            return $controller('signupSheetController', {
                $scope: $scope,
                //$http: null,
                $location: $location,
                $window: $window,
                signupSheetService: signupSheetService,
                $q: null,
                $routeParams: $routeParams,
                $rootScope: $rootScope,
                $timeout: null,
                $filter: null,
                fairStore: fairStore,
                contactService: contactService,
                socialMediaService: socialMediaService,
                timeandtaskSheet: null,
                dumble: dumble,
                urlprefix: '',
                teamsite: '',
            });
        };
    }));

    it('Should have controller', function() {
        var controller = getController();
        expect(controller).toBeDefined();
    });

    it('Should go to send message page with contacts and groups', function() {
        var controller = getController();

        $window.sessionStorage.setItem('emailContacts', {});

        $scope.goToMessages({});
        $scope.$digest();

        expect($window.sessionStorage.getItem('allgroups')).toBeDefined();
        expect($window.sessionStorage.getItem('fairDetails')).toBeDefined();
        expect($window.sessionStorage.getItem('emailcontacts')).toBeUndefined();
        expect($location.path).toHaveBeenCalledWith('/volunteers/invite/' + $routeParams.orgId + '/' + $routeParams.eventId);
    });

    it('Should toggle class based on fair status', function() {
        var controller = getController();

        expect($scope.toggleClass('sdf')).toBe('col-md-9');
        expect($scope.toggleClass('PUBLISHED_W_UNPUBLISHED_ACT')).toBe('col-md-5');
    });

    it('Should get groups when going to messages', function() {
        var controller = getController();

        $scope.goToMessages();
        $scope.$digest();

        expect($scope.groupList).toBeDefined();
        expect($scope.usrGroups).toBeDefined();
        expect($scope.usrGroups).toEqual([{
            id: 20
        }]);
    });

    xit('Should fail to get groups 4xx when going to messages', function() {
        var controller = getController();

        $scope.goToMessages();
        $scope.$digest();

        expect($scope.$parent.showWarning4xx).toBeTruthy();
    });

    it('Should go to social share page', function() {
        var controller = getController();

        $scope.socialShare();

        expect($window.sessionStorage.setItem).toHaveBeenCalled();
        expect($location.path).toHaveBeenCalledWith('/volunteers/share/' + $scope.orgId + '/' + $scope.eventId);
    });

    it('Should go to contacts page', function() {
        var controller = getController();

        $scope.goToContacts();

        expect($location.path).toHaveBeenCalledWith('/contacts/all/' + $scope.orgId + '/' + $scope.eventId);
    });

    it('Should create a signup sheet', function() {
        var controller = getController();

        $scope.createSheetRedirect($scope.orgId, $scope.eventId);

        expect(signupSheetService.clearId).toHaveBeenCalled();
        expect(fairStore.clearStoreTasks).toHaveBeenCalled();
        expect($location.path).toHaveBeenCalledWith('/volunteers/builder/' + $scope.orgId + '/' + $scope.eventId + '/-1/new');
    });

    it('Should not create new fair from past signup sheet', function() {
        var controller = getController();

        $scope.loadPastSheetRedirect({}, "");

        expect($scope.nofairPopover).toBeTruthy();
    });

    it('Should not create new fair from past signup sheet', function() {
        var controller = getController();

        $scope.loadPastSheetRedirect({}, 123);

        expect(signupSheetService.clearId).toHaveBeenCalled();
        expect(fairStore.clearStoreTasks).toHaveBeenCalled();
        expect($location.path).toHaveBeenCalledWith('/volunteers/builder/' + $routeParams.orgId + '/' + $routeParams.eventId + '/123/new');
        expect($scope.nofairPopover).toBeFalsy();
    });

    it('Should hide no past fair pop up', function() {
        var controller = getController();
        $scope.nofairPopover = true;

        $scope.hidePopover();

        expect($scope.nofairPopover).toBeFalsy();
    });

    it('Should load signup sheet edit page', function() {
        var controller = getController();

        $scope.loadSheetRedirect($routeParams.orgId, $routeParams.eventId, 123);

        expect($location.path).toHaveBeenCalledWith('/volunteers/builder/' + $routeParams.orgId + '/' + $routeParams.eventId + '/123');
    });

    it('Should go to print signup sheet page', function() {
        var controller = getController();

        $scope.printSignupSheet(123);

        expect($window.open).toHaveBeenCalledWith('/#/signupsheet/print/123', '_blank');
    });

    it('Should remove confirm task', function() {
        var controller = getController();

        $scope.showViewAssigned = true;
        $scope.showDeleteTask = false;

        $scope.deleteTaskConfirm();

        expect($scope.showViewAssigned).toBeFalsy();
        expect($scope.showDeleteTask).toBeTruthy();
    });

    it('Should remove delete pop up', function() {
        var controller = getController();

        $scope.showDeleteMsg = true;

        $scope.closeDeletePopUp();

        expect($scope.showDeleteMsg).toBeFalsy();
    });
    it('Should to navigate to live signup sheet', function() {
        var controller = getController();
        $scope.fair = {
            signUpSheetId: 123,
            address: 'https://vms-qa.scholastic.com/#/signup/354345'
        };
        $scope.viewSignUpSheet($scope.fair);
        expect($window.open).toHaveBeenCalledWith('https://vms-qa.scholastic.com/#/signup/354345', '_blank');
    });
    it('Should show overlay', function() {
        var controller = getController();
        expect(fairStore.getPublishedFlag).toHaveBeenCalled();
    });
});

describe('VMS.signupSheetBuilderController', function() {
    var $controller,
        $scope,
        $routeParams,
        $httpBackend,
        dumble,
        $location,
        $window,
        $q,
        mockStore,
        signupSheetService,
        contactService,
        $timeout,
        fairStore,
        getController;

    beforeEach(module('signupSheetModule'));

    beforeEach(inject(function($injector, _$rootScope_, _$controller_, _$q_, _$timeout_) {
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
        $q = _$q_;
        $httpBackend = $injector.get('$httpBackend');
        $timeout = _$timeout_;
        $routeParams = {
            orgId: 456,
            eventId: 789,
            sid: 123,
        };

        $location = {
            path: function(p) {},
        };
        spyOn($location, 'path');

        mockStore = {};
        $window = {
            open: function(a, b) {},
            sessionStorage: {
                setItem: function(item, stuff) {
                    mockStore[item] = stuff;
                },
                getItem: function(item) {
                    return mockStore[item];
                },
                removeItem: function(item) {
                    delete mockStore[item];
                },
            },
        };
        spyOn($window, 'open');
        spyOn($window.sessionStorage, 'getItem').and.callThrough();
        spyOn($window.sessionStorage, 'setItem').and.callThrough();
        spyOn($window.sessionStorage, 'removeItem').and.callThrough();

        signupSheetService = {
            getContacts: function() {
                return {};
            },
            getsignupsheetStore: function() {
                return {};
            },
            getSignupSheets: function(orgId, eventId) {
                var q = $q.defer();
                q.resolve({
                    data: {
                        active: [{}],
                    }
                });
                return q.promise;
            },
            setsignupsheetStore: function(signupsheet) {},
            clearId: function() {},
            setId: function() {},
            setFairId: function(a) {},
            setPastfairId: function() {},
            setOrgId: function(a) {},
            publishFair: function(eventId) {
                var q = $q.defer();
                q.resolve({
                    data: {
                        active: [{}],
                    }
                });
                return q.promise;
            }
        };
        spyOn(signupSheetService, 'getContacts').and.callThrough();
        spyOn(signupSheetService, 'getsignupsheetStore').and.callThrough();
        spyOn(signupSheetService, 'getSignupSheets').and.callThrough();
        spyOn(signupSheetService, 'setsignupsheetStore').and.callThrough();
        spyOn(signupSheetService, 'clearId');
        spyOn(signupSheetService, 'setId');
        spyOn(signupSheetService, 'setFairId');
        spyOn(signupSheetService, 'setPastfairId');
        spyOn(signupSheetService, 'setOrgId');
        spyOn(signupSheetService, 'publishFair').and.callThrough();

        $httpBackend.whenGET('/volunteer-manager/signupsheet/basic/info/' + $routeParams.orgId + "/" + $routeParams.eventId + "/" + $routeParams.sid).respond({
            eventName: 'test',
        });

        dumble = {
            setDumbleData: function() {

            },
        };
        spyOn(dumble, 'setDumbleData');
        fairStore = {
            setPublishedFlag: function(t) {

            },
            getPublishedFlag: function() {
                return;
            }
        };
        spyOn(fairStore, 'setPublishedFlag');
        spyOn(fairStore, 'getPublishedFlag');
        contactService = {
            getGroups: function(a, b) {
                var deferred = $q.defer();
                deferred.resolve({
                    status: 200,
                    data: {
                        defaultGroups: [{
                            id: 100
                        }, {
                            id: 200
                        }],
                        userGroups: [{
                            id: 10
                        }, {
                            id: 20
                        }],
                    }
                });
                return deferred.promise;
            },
            getContacts: function(a, b) {
                var deferred = $q.defer();
                deferred.resolve({
                    data: {}
                });
                return deferred.promise;
            },
            getUserGroups: function(d) {
                return [{
                    id: 20
                }];
            },
        };
        spyOn(contactService, 'getGroups').and.callThrough();
        spyOn(contactService, 'getContacts').and.callThrough();

        getController = function() {
            return $controller('signupSheetBuilderController', {
                $scope: $scope,
                $window: $window,
                signupSheetService: signupSheetService,
                contactService: contactService,
                $location: $location,
                $routeParams: $routeParams,
                dumble: dumble,
                fairStore: fairStore,
                urlprefix: '',
                teamsite: '',
                $timeout: $timeout
            });
        };
    }));

    it('Should have controller', function() {
        var controller = getController();
        expect(controller).toBeDefined();
    });

    it('Should navigate to volunteers', function() {
        var controller = getController();
        $scope.cancel();
        expect($location.path).toHaveBeenCalledWith('/volunteers/' + $routeParams.orgId + '/' + $routeParams.eventId);
    });

    it('Should load edit info', function() {
        var controller = getController();
        $scope.loadEditInfo();
        expect($location.path).toHaveBeenCalledWith('/editBasicInfo/' + $routeParams.orgId + "/" + $routeParams.eventId);
    });

    it('Should load contact info', function() {
        var controller = getController();

        $window.sessionStorage.setItem('emailContacts', {});

        $scope.loadContactInfo();
        $scope.$digest();

        expect($window.sessionStorage.getItem('emailcontacts')).toBeUndefined();
        expect($location.path).toHaveBeenCalledWith('/editContactInfo/' + $routeParams.orgId + "/" + $routeParams.eventId);
    });

    it('Should get required data for view', function() {
        var controller = getController();
        $httpBackend.flush();
        $timeout.flush();
        expect($scope.susData).toBeDefined();
    });
    it('Should publish the signupsheet', function() {
        var controller = getController();
        $scope.publishNow();
        expect(signupSheetService.publishFair).toHaveBeenCalled();
    });
    it('Should set publish overlay flag to true', function() {
        var controller = getController();
        $scope.publishNow(12, 'Y');
        $scope.$digest();
        expect(fairStore.setPublishedFlag).toHaveBeenCalled();
    });
});

describe('VMS.volunteersExperienceSignupController', function() {
    var $controller,
        $scope,
        signupSheetService,
        $routeParams,
        $httpBackend,
        dumble,
        getController;

    beforeEach(module('signupSheetModule'));

    beforeEach(inject(function($injector, _$rootScope_, _$controller_) {
        $scope = _$rootScope_.$new();
        $httpBackend = $injector.get('$httpBackend');
        $controller = _$controller_;

        signupSheetService = {
            getId: function() {
                return 123;
            },
        };
        spyOn(signupSheetService, 'getId');

        $routeParams = {
            sid: 5,
        };

        $httpBackend.whenGET('/volunteer-manager/chairperson/experience/published/' + $routeParams.sid).respond({});

        dumble = {
            setDumbleData: function() {},
        };
        spyOn(dumble, 'setDumbleData');

        getController = function() {
            return $controller('volunteersExperienceSignupController', {
                $scope: $scope,
                //$http: null
                $location: null,
                signupSheetService: signupSheetService,
                $routeParams: $routeParams,
                dumble: dumble,
                urlprefix: '',
            });
        };
    }));

    it('Should have controller', function() {
        var controller = getController();
        expect(controller).toBeDefined();
    });

    it('Should get da thing', function() {
        var controller = getController();
        $httpBackend.flush();

        expect($scope.volExpData).toBeDefined();
    });
});

describe('VMS.volunteersExperienceLoginController', function() {
    var $controller,
        $scope,
        $httpBackend,
        $routeParams,
        $location,
        signupSheetService,
        getController,
        teamsite;

    beforeEach(module('signupSheetModule'));

    beforeEach(inject(function($injector, _$rootScope_, _$controller_) {
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
        $httpBackend = $injector.get('$httpBackend');

        signupSheetService = {
            hideHeaderAndFooter: function() {},
        };
        spyOn(signupSheetService, 'hideHeaderAndFooter');

        $location = {
            url: function() {
                return '';
            },
        };

        $routeParams = {
            sid: 10,
        };

        getController = function() {
            return $controller('volunteersExperienceLoginController', {
                $scope: $scope,
                //$http:null,
                $location: $location,
                signupSheetService: signupSheetService,
                $routeParams: $routeParams,
                $route: null,
                $rootScope: null,
                $window: null,
                dumble: null,
                urlprefix: '',
                teamsite: '',
            });
        };
    }));

    it('Should have controller', function() {
        var controller = getController();
        expect(controller).toBeDefined();
    });
});

describe('VMS.thankyouVolunteerSignUpController', function() {
    var $controller,
        $scope,
        $window,
        signupSheetService,
        socialMediaService,
        twilioService,
        getController,
        $q,
        $httpBackend;

    beforeEach(module('signupSheetModule'));

    beforeEach(inject(function($injector, _$rootScope_, _$controller_, _$q_, _$httpBackend_) {
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
        $q = _$q_;
        $httpBackend = _$httpBackend_;

        signupSheetService = {
            showHeaderAndFooter: function() {},
        };
        spyOn(signupSheetService, 'showHeaderAndFooter');

        $window = {
            localStorage: {
                getItem: function() {
                    return '{}';
                },
            },
        };

        socialMediaService = {
            getFBError: function() {},
        };
        spyOn(socialMediaService, 'getFBError');

        var twilioService = {
            getTwilioBean: function() {
                var d = $q.defer();
                d.resolve('Remote call result');
                return d.promise;
            },
        };
        spyOn(twilioService, 'getTwilioBean').and.callThrough();

        getController = function() {
            return $controller('thankyouVolunteerSignUpController', {
                $scope: $scope,
                //$http: null,
                $location: null,
                signupSheetService: signupSheetService,
                $window: $window,
                socialMediaService: socialMediaService,
                twilioService: twilioService,
                urlprefix: '',
                teamsite: ''
            });
        };
    }));

    it('Should have controller', function() {
        var controller = getController();
        expect(controller).toBeDefined();
    });

    it('Should check unchecked Checkboxes', function() {
        var controller = getController();
        $scope.submitted = true;
        $scope.reminderSubmit = true;
        $scope.resetError();
        expect($scope.submitted).toBeFalsy();
        expect($scope.reminderSubmit).toBeFalsy();
    });

    it('Should remove error for number submit', function() {
        var controller = getController();
        $scope.submitted = true;
        $scope.offSubmit();
        expect($scope.submitted).toBeFalsy();
    });

    it('Should validate user opted phone number', function() {
        var controller = getController();
        $scope.userHasPhoneDetails = 0;
        $scope.validateUserOptedPhoneNumber('739586');
        $httpBackend
            .when('GET', '/volunteer-manager/sms/phone/739586')
            .respond(200, {
                "statusCode": 200,
                "statusMessage": "OptIn/OptOut Success",
                "smsOptInOutBean": null,
                "hasOptInPhones": 1
            });
        $httpBackend.flush();
        expect($scope.userHasPhoneDetails).toEqual(1);
    });

    it('Should not save text reminder', function() {
        var controller = getController();
        $scope.submitted = false;
        $scope.bottom.Useroption = 0;
        $scope.reminderSubmit = true;
        $scope.textRemiderError = true;
        $scope.textRemiderView = true;
        $scope.textReminder = {
            $valid: true,
            phoneNumber: {
                $modelValue: 'asd',
            },
        };
        $scope.saveTextreminder(11);
        expect($scope.reminderSubmit).toBeFalsy();
        expect($scope.textRemiderError).toBeFalsy();
        expect($scope.textRemiderView).toBeFalsy();
        expect($scope.textReminder.phoneNumber.$modelValue).toBe('');
    });

    it('Should save text reminder', function() {
        var controller = getController();
        spyOn($scope, 'saveTextreminderMessage');
        $scope.submitted = false;
        $scope.bottom.Useroption = 1;
        $scope.textRemiderError = true;
        $scope.textRemiderView = true;
        $scope.textReminder = {
            $valid: true,
            phoneNumber: {
                $modelValue: '1122213231',
            },
        };
        $scope.saveTextreminder(11);
        $httpBackend.whenPOST('/volunteer-manager/twilio/validation').respond(200, {
            statusMessage: 'success',
        });
        $httpBackend.flush();
        expect($scope.saveTextreminderMessage).toHaveBeenCalled();
        expect($scope.textRemiderError).toBeFalsy();
        expect($scope.textRemiderView).toBeFalsy();
    });

    it('Should save phoneNumber', function() {
        var controller = getController();
        $scope.twilioBean.phoneNumber = '1122213231';
        $scope.bottom.Useroption = 1;
        $scope.textRemiderView = true;
        $scope.saveTextreminderMessage(11);
        $httpBackend.whenPOST('/volunteer-manager/sms/optinout').respond(200, {
            statusMessage: 'success',
        });
        $httpBackend.flush();
        expect($scope.textRemiderView).toBeFalsy();
    });

});

describe('VMS.printVolunteerSignUpController', function() {
    var $controller,
        $scope,
        signupSheetService,
        dumble,
        $window,
        urlprefix,
        getController;

    beforeEach(module('signupSheetModule'));

    beforeEach(inject(function($injector, _$rootScope_, _$controller_) {
        $scope = _$rootScope_.$new();
        $controller = _$controller_;

        signupSheetService = {
            hideHeaderAndFooter: function() {},
        };
        spyOn(signupSheetService, 'hideHeaderAndFooter');

        $window = {
            localStorage: {
                getItem: function() {
                    return '{\"spsUserReturn\":{\"spsId\":123}}';
                },
            },
        };

        urlprefix = '';

        dumble = {
            setDumbleData: function() {},
        };
        spyOn(dumble, 'setDumbleData');

        getController = function() {
            return $controller('printVolunteerSignUpController', {
                $scope: $scope,
                //$http: null,
                $location: null,
                $window: $window,
                dumble: dumble,
                signupSheetService: signupSheetService,
            });
        };
    }));

    it('Should have controller', function() {
        var controller = getController();
        expect(controller).toBeDefined();
    });
});

describe('VMS.signupUrlController', function() {
    var $controller,
        $scope,
        $routeParams,
        $location,
        getController;

    beforeEach(module('signupSheetModule'));

    beforeEach(inject(function($injector, _$rootScope_, _$controller_) {
        $scope = _$rootScope_.$new();
        $controller = _$controller_;

        $routeParams = {
            sid: 123,
        };

        $location = {
            path: function(p) {},
        };
        spyOn($location, 'path');

        getController = function() {
            return $controller('signupUrlController', {
                $scope: $scope,
                //$http: null,
                $location: $location,
                signupSheetService: null,
                $routeParams: $routeParams,
            });
        };
    }));

    it('Should have controller', function() {
        var controller = getController();
        expect(controller).toBeDefined();
    });
});

describe('VMS.volunteersExperienceLoginController', function() {
    var $controller,
        $scope,
        signupSheetService,
        $routeParams,
        $location,
        getController;

    beforeEach(module('signupSheetModule'));

    beforeEach(inject(function($injector, _$rootScope_, _$controller_) {
        $scope = _$rootScope_.$new();
        $controller = _$controller_;

        signupSheetService = {
            hideHeaderAndFooter: function() {},
        };
        spyOn(signupSheetService, 'hideHeaderAndFooter');

        $routeParams = {
            sid: 123,
        };

        $location = {
            url: function() {
                return '';
            },
        };
        spyOn($location, 'url').and.callThrough();

        getController = function() {
            return $controller('volunteersExperienceLoginController', {
                $scope: $scope,
                //$http: null,
                $location: $location,
                signupSheetService: signupSheetService,
                $routeParams: $routeParams,
                $route: null,
                dumble: null,
                urlprefix: '',
                teamsite: '',
            });
        };
    }));

    it('Should have controller', function() {
        var controller = getController();
        expect(controller).toBeDefined();
    });
});

describe('VMS.volunteersActivityPreviewCtrl', function() {
    var $controller,
        $scope,
        signupSheetService,
        $routeParams,
        getController;

    beforeEach(module('signupSheetModule'));

    beforeEach(inject(function($injector, _$rootScope_, _$controller_) {
        $scope = _$rootScope_.$new();
        $controller = _$controller_;

        signupSheetService = {
            getId: function() {
                return {};
            },
        };
        spyOn(signupSheetService, 'getId');

        $routeParams = {
            sid: 123,
        };

        getController = function() {
            return $controller('volunteersActivityPreviewCtrl', {
                $scope: $scope,
                //$http: null,
                $location: null,
                signupSheetService: signupSheetService,
                $routeParams: $routeParams,
                dumble: null,
                urlprefix: '',
            });
        };
    }));

    it('Should have controller', function() {
        var controller = getController();
        expect(controller).toBeDefined();
    });

});

describe('VMS.volunteersActivityPreviewCtrl', function() {
    var $controller,
        $scope,
        $routeParams,
        $window,
        socialMediaService,
        getController;

    beforeEach(module('signupSheetModule'));
    beforeEach(inject(function($injector, _$rootScope_, _$controller_) {
        $scope = _$rootScope_.$new();
        $controller = _$controller_;

        $routeParams = {
            orgId: 100,
            eventId: 200,
        };

        socialMediaService = {
            getFBError: function() {
                return 'foo';
            },
            fbHasSDK: function() {
                return true;
            },
            fbShare: function() {},
            twShare: function() {},
        };
        spyOn(socialMediaService, 'fbHasSDK').and.callThrough();
        spyOn(socialMediaService, 'getFBError');
        spyOn(socialMediaService, 'fbShare');
        spyOn(socialMediaService, 'twShare');

        $window = {
            sessionStorage: {
                getItem: function() {},
                setItem: function() {},
                removeItem: function() {},
            },
            location: {
                protocol: 'http://',
            },
        };
        spyOn($window.sessionStorage, 'getItem').and.callThrough();
        spyOn($window.sessionStorage, 'setItem').and.callThrough();
        spyOn($window.sessionStorage, 'removeItem').and.callThrough();

        getController = function() {
            return $controller('shareController', {
                $scope: $scope,
                $location: null,
                $window: $window,
                $routeParams: $routeParams,
                socialMediaService: socialMediaService,
                signupSheetService: null,
                urlprefix: '',
            });
        };
    }));

    it('Should have a controller', function() {
        var controller = getController();
        expect(controller).toBeDefined();
    });

    it('Should share to FB', function() {
        var controller = getController();
        $scope.openFBStatic('123');
        expect(socialMediaService.fbShare).toHaveBeenCalled();
    });

    it('Should share to TWIT', function() {
        var controller = getController();
        $scope.openTwitter('123');
        expect(socialMediaService.twShare).toHaveBeenCalled();
    });

    it('Should close FB error', function() {
        var controller = getController();
        expect($scope.showOverlay).toBeFalsy();
        expect($scope.showFBError).toBeFalsy();
    });

    /* NOTE: I am having trouble mocking window.FB.
    xit('Should fail to share to FB', function() {
        expect(false).toToBeTruthy();
    });
    */
});

describe('VMS.signupSheetCarousel', function() {
    var $controller,
        $scope,
        $window,
        $rootScope,
        teamsite,
        getController;

    beforeEach(module('signupSheetModule'));
    beforeEach(inject(function($injector, _$rootScope_, _$controller_) {
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
        $scope.include = {};
        $window = {
            localStorage: {
                getItem: function(fs) {
                    return '{}';
                },
                setItem: function(boo) {},
                removeItem: function() {},
            },
            angular: {
                element: function(selector) {
                    return {};
                },
            }

        };
        spyOn($window.localStorage, 'getItem').and.callThrough();
        spyOn($window.localStorage, 'setItem').and.callThrough();
        spyOn($window.angular, 'element');

        getController = function() {
            return $controller('signupSheetCarousel', {
                $scope: $scope,
                $window: $window,
                teamsite: ''
            });
        };
    }));

    it('Should have a controller', function() {
        var controller = getController();
        expect(controller).toBeDefined();
    });

});
