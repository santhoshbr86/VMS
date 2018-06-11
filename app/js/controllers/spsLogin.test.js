'use strict';
describe('VMS.headerController', function() {
    var $controller,
        getController,
        $window,
        $routeParams,
        $scope,
        $location,
        $rootScope;

    beforeEach(module('spsLoginModule'));

    beforeEach(inject(function($injector, _$rootScope_, _$controller_) {
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
        $rootScope = {
            $on: function() {},
        };
        spyOn($rootScope, '$on');

        $window = {
            MA_show2: function() {},
            maLogOut: function() {},
            spsConfig: {
                setWrapperTop: function(a) {},
            },
            setViewType: function() {},
            setMyScholasticLaunchAsModal: function() {},
            localStorage: {
                clear: function() {},
            },
            open: function(a, b) {},
        };
        spyOn($window, 'open');
        spyOn($window, 'MA_show2');
        spyOn($window, 'setViewType');
        spyOn($window, 'maLogOut');
        spyOn($window, 'setMyScholasticLaunchAsModal');
        spyOn($window.spsConfig, 'setWrapperTop');
        spyOn($window.localStorage, 'clear');

        $routeParams = {
            sid: '',
        };

        $location = {
            path: function(a) {},
        };
        spyOn($location, 'path');

        getController = function() {
            return $controller('headerController', {
                $scope: $scope,
                $rootScope: $rootScope,
                $location: $location,
                $window: $window,
                $routeParams: $routeParams,
                urlprefix: '',
            });
        };
    }));

    it('Should have a controller', function() {
        var controller = getController();
        expect(controller).toBeDefined();
    });

    it('Should open my account', function() {
        var controller = getController();

        $scope.callMyAccount();

        expect($window.open).toHaveBeenCalled();

    });

    it('Should sign out', function() {
        var controller = getController();

        $scope.user = {
            some: 'attr'
        };
        $scope.loggedIn = true;

        $scope.signOut();

        expect($scope.user).toEqual({});
        expect($scope.loggedIn).toBeFalsy();
        expect($window.maLogOut).toHaveBeenCalled();
    });
});

describe('VMS.spsController', function() {
    var $controller,
        getController,
        dumble,
        janRainService,
        $routeParams,
        $httpBackend,
        $window,
        signupSheetService,
        urlprefix,
        $location,
        $scope;

    beforeEach(module('spsLoginModule'));

    beforeEach(inject(function($injector, _$rootScope_, _$controller_) {
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
        $httpBackend = $injector.get('$httpBackend');

        urlprefix = '';

        $window = {
            sessionStorage: {
                getItem: function(fs) {
                    return '';
                },
                removeItem: function(fs) {},
            },
            location: {
                hash: {
                    indexOf: function() {
                        return 1;
                    },
                },
            },
            MA_show2: function() {},
            setViewType: function() {},
            setParentAppName: function() {},
            setMyScholasticLaunchAsModal: function() {},
        };
        spyOn($window.sessionStorage, 'getItem').and.callThrough();
        spyOn($window.sessionStorage, 'removeItem');
        spyOn($window, 'MA_show2');
        spyOn($window, 'setViewType');
        spyOn($window, 'setParentAppName');
        spyOn($window, 'setMyScholasticLaunchAsModal');

        dumble = {
            setDumbleData: function() {},
        };
        spyOn(dumble, 'setDumbleData');

        janRainService = {
            initJanRain: function() {},
        };
        spyOn(janRainService, 'initJanRain');

        $routeParams = {
            email: '',
            sid: undefined,
        };

        signupSheetService = {
            setId: function(a) {},
            setSpsUserDetails: function(a) {},
        };
        spyOn(signupSheetService, 'setId');
        spyOn(signupSheetService, 'setSpsUserDetails');

        $location = {
            path: function(a) {},
        };
        spyOn($location, 'path');

        getController = function() {
            return $controller('spsController', {
                $scope: $scope,
                $rootScope: null,
                //$http: null,
                $location: $location,
                $routeParams: $routeParams,
                $document: null,
                $window: $window,
                signupSheetService: signupSheetService,
                janRainService: janRainService,
                dumble: dumble,
                urlprefix: urlprefix,
                teamsite: '',
            });
        };
    }));

    it('Should have a controller', function() {
        var controller = getController();
        expect(controller).toBeDefined();
    });

    it('Should set dumble', function() {
        var controller = getController();
        expect(dumble.setDumbleData).toHaveBeenCalled();
    });

    it('Should be a kids username', function() {
        var controller = getController();
        expect($scope.looksLikeKidsUsername('cryingSnake')).toBeTruthy();
    });

    it('Should not be a kids username', function() {
        var controller = getController();
        expect($scope.looksLikeKidsUsername(undefined)).toBeFalsy();
        expect($scope.looksLikeKidsUsername('cryingSnake@example.com')).toBeFalsy();
        expect($scope.looksLikeKidsUsername('cryingSnakeexample.com')).toBeFalsy();
        expect($scope.looksLikeKidsUsername('cryingSnake@examplecom')).toBeFalsy();
    });

    it('Should should be a bad email address according to SPS', function() {
        var controller = getController();

        expect($scope.looksLikeBadEmail(undefined)).toBeFalsy();
        expect($scope.looksLikeBadEmail('')).toBeFalsy();
        expect($scope.looksLikeBadEmail('some okay response')).toBeFalsy();
        expect($scope.looksLikeBadEmail('The email information is wrong')).toBeTruthy();
    });

    it('Should look like a missing email according to SPS', function() {
        var controller = getController();

        expect($scope.looksLikeMissingEmail(undefined)).toBeFalsy();
        expect($scope.looksLikeMissingEmail('')).toBeFalsy();
        expect($scope.looksLikeMissingEmail('some okay response')).toBeFalsy();
        expect($scope.looksLikeMissingEmail('The ID can\'t be found')).toBeTruthy();
    });

    it('Should fail to log in', function() {
        var controller = getController();
        $scope.signup_form = {
            $valid: true,
        };

        $httpBackend.whenPOST(urlprefix + '/volunteer-manager/sps/login').respond(500, {
            message: 'ayy clifford'
        });

        $scope.login();
        $httpBackend.flush();

        expect($scope.errorMessage).toEqual('ayy clifford');
    });

    it('Should log in', function() {
        var controller = getController();
        $scope.signup_form = {
            $valid: true,
        };
        $scope.signup = {
            email: 'clifford@example.com',
            password: 'kliffordisevil',
        };

        $httpBackend.whenPOST(urlprefix + '/volunteer-manager/sps/login').respond(200, {
            message: 'success'
        });

        $scope.login();
        $httpBackend.flush();

        expect($scope.errorMessage).toEqual(null);
        expect($location.path).toHaveBeenCalledWith('/experience/dashboard');
    });

    it('Should log in with signupsheetid', function() {
        var controller = getController();
        $scope.signup_form = {
            $valid: true,
        };
        $scope.signup = {
            email: 'clifford@example.com',
            password: 'kliffordisevil',
        };
        $routeParams.sid = 'asd';

        $httpBackend.whenPOST(urlprefix + '/volunteer-manager/sps/login/' + $routeParams.sid).respond(200, {
            message: 'success',
            requestParamList: ['asd'],
        });

        $scope.login();
        $httpBackend.flush();

        expect($scope.errorMessage).toEqual(null);
        expect($location.path).toHaveBeenCalledWith('/experience/signup/' + $routeParams.sid);
    });

    it('Should cancel registration', function() {
        var controller = getController();
        $routeParams.sid = undefined;

        $scope.cancelRegistration();

        expect($location.path).toHaveBeenCalledWith('/experience/login');
    });

    it('Should cancel registration with signupsheetid', function() {
        var controller = getController();
        $routeParams.sid = 'asd';

        $scope.cancelRegistration();

        expect($location.path).toHaveBeenCalledWith('/experience/login/' + 'asd');
    });

    it('Should fail to register due to mismatch email', function() {
        var controller = getController();

        $scope.user.email = 'clifford@example.com';
        $scope.user.confirmEmail = 'klifford@example.kom';

        $scope.register();

        expect($scope.errorMessage).toBe('Email and Confirm Email Don\'t Match');
    });

    it('Should fail to register due to mismatch password', function() {
        var controller = getController();

        $scope.user.email = 'clifford@example.com';
        $scope.user.confirmEmail = $scope.user.email;

        $scope.user.password = 'clifford123';
        $scope.user.confirmpassword = 'klifford123';

        $scope.register();

        expect($scope.errorMessage).toBe('Password and Confirm Passwords Don\'t Match');
    });

    it('Should register new SPS user', function() {
        var controller = getController();

        $scope.user.email = 'clifford@example.com';
        $scope.user.confirmEmail = $scope.user.email;
        $scope.user.password = 'clifford123';
        $scope.user.confirmpassword = $scope.user.password;
        $scope.registration = {
            $valid: true,
        };
        $httpBackend.whenPOST(urlprefix + '/volunteer-manager/sps/new').respond(200, {
            message: 'success'
        });

        $scope.register();
        $httpBackend.flush();

        expect($window.sessionStorage.removeItem).toHaveBeenCalled();
        expect($location.path).toHaveBeenCalledWith('/experience/dashboard');
    });

    it('Should redirect to forgot password screen', function() {
        var controller = getController();
        $scope.redirectToForgot();
        expect($window.MA_show2).toHaveBeenCalled();
        expect($window.setViewType).toHaveBeenCalled();
        expect($window.setParentAppName).toHaveBeenCalled();
        expect($window.setMyScholasticLaunchAsModal).toHaveBeenCalled();
    });

});
