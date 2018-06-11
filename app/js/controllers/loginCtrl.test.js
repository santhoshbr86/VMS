'use strict';
describe('VMS.adminLoginController', function() {
    var $controller,
        $scope,
        $httpBackend,
        $http,
        $window,
        $location,
        dumble,
        urlprefix,
        getController;

    beforeEach(module('loginModule'));

    beforeEach(inject(function($injector, _$rootScope_, _$controller_) {
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
        $httpBackend = $injector.get('$httpBackend');

        dumble = {
            setDumbleData: function() {},
        };
        spyOn(dumble, 'setDumbleData');

        $window = {
            localStorage: {
                setItem: function(a) {},
            },
        };
        spyOn($window.localStorage, 'setItem');

        $location = {
            path: function() {},
        };
        spyOn($location, 'path');

        getController = function() {
            return $controller('adminLoginController', {
                $scope: $scope,
                //$http: null,
                $location: $location,
                $window: $window,
                dumble: dumble,
                urlprefix: '',
                teamsite: '',
            });
        };
    }));

    it('Should have controller defined', function() {
        var controller = getController();
        expect(controller).toBeDefined();
    });

    it('Should POST login data', function() {
        var controller = getController();

        $httpBackend.whenPOST('/volunteer-manager/admin/login').respond({});
        $scope.loginForm = {
            $valid: true
        };
        $scope.login();

        $httpBackend.flush();
        expect($scope.submitted).toBeTruthy();
        expect($location.path).toHaveBeenCalledWith('/admin/home');
    });

    it('Should not POST login data', function() {
        var controller = getController();

        $httpBackend.whenPOST('/volunteer-manager/admin/login').respond(401, {});
        $scope.loginForm = {
            $valid: true
        };
        $scope.login();

        $httpBackend.flush();
        expect($scope.showError).toBeTruthy();
        expect($scope.error).toBeDefined();
    });

    it('Should do nothing if form is invalid', function() {
        var controller = getController();

        $httpBackend.whenPOST('/volunteer-manager/admin/login').respond(401, {});
        $scope.loginForm = {
            $valid: false
        };
        $scope.login();
        expect($scope.showError).toBeFalsy();
        expect($scope.error).toBeUndefined();
    });

    it('Should close pop up', function() {
        var controller = getController();
        $scope.showError = true;
        $scope.closePopUp();
        expect($scope.showError).toBeFalsy();
    });
});
