'use strict';
describe('VMS.importContactsController', function() {
    var $controller,
        $scope,
        $routeParams,
        $location,
        $window,
        $httpBackend,
        $interval,
        janRainService,
        importService,
        contactService,
        mockStore,
        getController;

    beforeEach(module('importContactsModule'));

    beforeEach(inject(function($injector, _$rootScope_, _$controller_, _$interval_) {
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
        $httpBackend = $injector.get('$httpBackend');
        $interval = _$interval_;

        janRainService = {
            initJanRain: function(thing) {}
        };
        spyOn(janRainService, 'initJanRain');

        $location = {
            path: function(url) {},
        };
        spyOn($location, 'path');

        $routeParams = {
            orgId: 123,
            eventId: 456,
        };

        mockStore = {};
        $window = {
            janrain: {
                engage: {
                    signin: {
                        triggerFlow: function(jh) {},
                    },
                },
            },
            sessionStorage: {
                setItem: function(item, stuff) {
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
            open: function(a, b, c) {},
        };
        spyOn($window.janrain.engage.signin, 'triggerFlow');
        spyOn($window.sessionStorage, 'getItem').and.callThrough();
        spyOn($window.sessionStorage, 'setItem').and.callThrough();
        spyOn($window.sessionStorage, 'removeItem').and.callThrough();
        spyOn($window, 'open');

        importService = {
            setItem: function(thing) {},
        };
        spyOn(importService, 'setItem');

        contactService = {
            getContacts: function(a, b) {},
        };
        spyOn(contactService, 'getContacts');

        getController = function() {
            return $controller('contactImportController', {
                $scope: $scope,
                //$http: null,
                $location: $location,
                contactService: contactService,
                $rootScope: null,
                $routeParams: $routeParams,
                $window: $window,
                $interval: $interval,
                importService: importService,
                janRainService: janRainService,
                urlprefix: '',
                teamsite: '',
            });
        };
    }));

    it('Should have controller', function() {
        var controller = getController();
        expect(controller).toBeDefined();
    });

    it('Should get Yahoo', function() {
        var controller = getController();
        //$scope.getYahooJanRain();
        //expect($window.janrain.engage.signin.triggerFlow).toHaveBeenCalledWith('yahoo');
        $interval.flush(200);

        $scope.getYahooContacts();

        expect($window.open).toHaveBeenCalled();
    });

    it('Should get Google+', function() {
        var controller = getController();
        //$scope.getGooglePlusJanRain();
        //expect($window.janrain.engage.signin.triggerFlow).toHaveBeenCalledWith('googleplus');
        $interval.flush(200);

        $scope.getGooglePlusContacts();

        expect($window.open).toHaveBeenCalled();
    });

    it('Should go to contacts', function() {
        var controller = getController();
        $scope.goToContacts();
        expect($location.path).toHaveBeenCalledWith('/contacts/all/123/456');
    });

    it('Should not upload file', function() {
        var controller = getController();
        $scope.myFile = {
            size: 0
        };

        $scope.uploadFile();

        expect($scope.invalid).toBeTruthy();
    });

    it('Should upload file', function() {
        var controller = getController();
        $scope.myFile = {
            size: 20
        };

        $scope.uploadFile();

        expect($scope.invalid).toBeFalsy();
    });

    // TODO: This is a pretty weak test, it needs to check the parameters of open
    // TODO: This also needs to check what happens in $interval
    it('Should get Outlook contacts', function() {
        var controller = getController();

        $interval.flush(200);

        $scope.getOutLookContacts();

        expect($window.open).toHaveBeenCalled();
    });
});

describe('VMS.exportContactsController', function() {
    var $controller,
        $scope,
        $location,
        $routeParams,
        $httpBackend,
        importService,
        getController;

    beforeEach(module('importContactsModule'));

    beforeEach(inject(function($injector, _$rootScope_, _$controller_) {
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
        $httpBackend = $injector.get('$httpBackend');

        importService = {
            setItem: function() {},
        };
        spyOn(importService, 'setItem');

        $location = {
            path: function() {},
        };
        spyOn($location, 'path');

        $routeParams = {
            orgId: function() {
                return 1;
            },
            eventId: function() {
                return 2;
            },
        };

        getController = function() {
            return $controller('contactExportController', {
                $scope: $scope,
                $location: $location,
                importService: importService,
                $routeParams: $routeParams,
                teamsite: '',
            });
        };
    }));

    it('Should have controller defined', function() {
        var controller = getController();
        expect(controller).toBeDefined();
    });

    it('Should set export and redirect', function() {
        var controller = getController();
        $scope.export();
        expect(importService.setItem).toHaveBeenCalled();
        expect($location.path).toHaveBeenCalled();
    });

    it('Should go to contacts', function() {
        var controller = getController();
        $scope.goToContacts();
        expect($location.path).toHaveBeenCalled();
    });
});
