"use strict";
describe("VMS.sendEmailController", function() {
    var $controller,
        $scope,
        $httpBackend,
        emailAddress,
        $window,
        $location,
        $routeParams,
        $rootScope,
        $log,
        $timeout,
        contactService,
        dumble,
        getController;

    beforeEach(module('sendEmailModule'));

    beforeEach(inject(function($injector, _$rootScope_, _$controller_, _$timeout_) {
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
        $timeout = _$timeout_;
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        spyOn($rootScope, '$broadcast');

        $window = {
            sessionStorage: {
                setItem: function(s) {

                },
                getItem: function(fs) {
                    return '{}';
                },
            },
            location: {
                hash: function() {
                    return '';
                },
            }
        };
        spyOn($window.sessionStorage, 'setItem').and.callThrough();
        spyOn($window.sessionStorage, 'getItem').and.callThrough();
        spyOn($window.location, 'hash').and.callThrough();

        $log = {
            log: function() {},
        };
        spyOn($log, 'log');

        $location = {
            url: function() {
                return '';
            },
            path: function() {},
        };
        spyOn($location, 'url').and.callThrough();
        spyOn($location, 'path');

        $routeParams = {
            orgId: function() {
                return 1;
            },
            eventId: function() {
                return 2;
            },
        };
        spyOn($routeParams, 'orgId');
        spyOn($routeParams, 'eventId');

        dumble = {
            setDumbleData: function() {},
        };
        spyOn(dumble, 'setDumbleData');


        emailAddress = {
            getInviteFlag: function() {
                return false;
            }
        };
        spyOn(emailAddress, 'getInviteFlag').and.callThrough();

        contactService = {
            getGroups: function(a, b) {},
            getContacts: function(a, b) {},
        };
        spyOn(contactService, 'getGroups');
        spyOn(contactService, 'getContacts');


        getController = function() {
            return $controller('sendEmailController', {
                $scope: $scope,
                $log: $log,
                //$http: null,
                $timeout: $timeout,
                $compile: null,
                contactService: contactService,
                $location: $location,
                $window: $window,
                emailAddress: emailAddress,
                $routeParams: $routeParams,
                $rootScope: $rootScope,
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

    it('Should set dumble', function() {
        var controller = getController();
        expect(dumble.setDumbleData).toHaveBeenCalled();
    });

    it('Should clear error message', function() {
        var controller = getController();
        $scope.allConsel = true;
        $scope.emailExist = true;

        $scope.updateSelection();

        expect($scope.allConsel).toBeFalsy();
        expect($scope.emailExist).toBeFalsy();
    });

    it('Should clear send message', function() {
        var controller = getController();
        $scope.errorPopUp = true;

        $scope.closeSendMessagePopUp();

        expect($scope.errorPopUp).toBeFalsy();
    });

    it('Should clear send message and redirect', function() {
        var controller = getController();
        $scope.errorPopUp = true;

        $scope.closeSendMessagePopUpAndRedirect();

        expect($scope.errorPopUp).toBeFalsy();
        expect($location.path).toHaveBeenCalledWith('/contacts/all/' + $routeParams.orgId + '/' + $routeParams.eventId);
    });

    it('Should clear send invite and redirect', function() {
        var controller = getController();
        $scope.errorPopUp = true;

        $scope.closeSendInvitePopUpAndRedirect();

        expect($scope.errorPopUp).toBeFalsy();
        expect($rootScope.$broadcast).toHaveBeenCalledWith('redirectToVolunteers');
        expect($location.path).toHaveBeenCalledWith('/volunteers/' + $routeParams.orgId + '/' + $routeParams.eventId);
    });

    it('Should monitor length of message', function() {
        var controller = getController();
        $scope.email = {
            message: "Hello test !!!"
        };
        $scope.monitorLength(12);
        expect($scope.email.message).toBe($scope.email.message.substring(0, 12));
    });

    it('Should check for existing email', function() {
        var controller = getController();
        $scope.contactList = [{
            email: "sujit@dubey.com"
        }];
        expect($scope.isExist("sujit@dubey.com")).toBeTruthy();
    });

    it('Should check for non existing email', function() {
        var controller = getController();
        $scope.contactList = [{
            email: "sujit@dubey.com"
        }];
        expect($scope.isExist("sujit@kumar.com")).toBeFalsy();
    });

    it('Should display templates for published', function() {
        var controller = getController();
        $scope.publishedTemplates();
        expect($window.sessionStorage.getItem('published')).toBeDefined();
        expect($window.sessionStorage.setItem).toHaveBeenCalled();
    });
});

describe("VMS.invitePreviewController", function() {
    var $controller,
        $scope,
        $window,
        $location,
        $routeParams,
        emailAddress,
        getController;

    beforeEach(module('sendEmailModule'));

    beforeEach(inject(function($injector, _$rootScope_, _$controller_) {
        $scope = _$rootScope_.$new();
        $controller = _$controller_;

        emailAddress = {
            getEmailData: function() {
                return {};
            },
            getChairPerson: function() {
                return {};
            },
        };
        spyOn(emailAddress, 'getEmailData');
        spyOn(emailAddress, 'getChairPerson');

        $location = {
            url: function() {
                return '';
            },
            path: function() {},
        };
        spyOn($location, 'url').and.callThrough();
        spyOn($location, 'path');

        $routeParams = {
            action: 'foo',
        };

        $window = {
            sessionStorage: {
                getItem: function(fs) {
                    return '{}';
                },
            },
        };
        spyOn($window.sessionStorage, 'getItem').and.callThrough();

        getController = function() {
            return $controller('invitePreviewController', {
                $scope: $scope,
                //$http: null,
                emailAddress: emailAddress,
                $routeParams: $routeParams,
                $location: $location,
                $rootScope: null,
                $window: $window,
                teamsite: '',
                urlprefix: '',
            });
        };
    }));

    it('Should have controller', function() {
        var controller = getController();
        expect(controller).toBeDefined();
    });

    it('Should go to volunteers invite page', function() {
        var controller = getController();

        $scope.goBack();

        expect($location.path).toHaveBeenCalledWith('/volunteers/invite/' + $routeParams.orgId + '/' + $routeParams.eventId);
    });

    it('Should go to volunteers page', function() {
        var controller = getController();

        $scope.gotoVolunteers();

        expect($location.path).toHaveBeenCalledWith('/volunteers/' + $routeParams.orgId + '/' + $routeParams.eventId);
    });
});
