'use strict';
describe('VMS.adminController', function() {
    var $controller,
        $location,
        getController,
        dumble,
        $scope,
        teamsite;

    beforeEach(module('adminModule'));

    beforeEach(inject(function($injector, _$rootScope_, _$controller_, _$q_) {
        $scope = _$rootScope_.$new();
        $controller = _$controller_;

        dumble = {
            setDumbleData: function() {},
        };
        spyOn(dumble, 'setDumbleData');

        $location = {
            url: function() {
                return '';
            },
            path: function() {},
        };
        spyOn($location, 'url').and.callThrough();
        spyOn($location, 'path');

        getController = function() {
            return $controller('adminController', {
                $scope: $scope,
                dumble: dumble,
                $location: $location,
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

    it('Should go to roles', function() {
        var controller = getController();
        $scope.goToRoles();
        expect($location.path).toHaveBeenCalledWith('/admin/roles');
    });

    it('Should go to messages', function() {
        var controller = getController();
        $scope.goToMessages();
        expect($location.path).toHaveBeenCalledWith('/admin/message');
    });
});

describe('VMS.adminRoleController', function() {
    var $controller,
        $scope,
        $httpBackend,
        $location,
        getController,
        dumble;

    beforeEach(module('adminModule'));

    beforeEach(inject(function($injector, _$rootScope_, _$controller_, _$q_) {
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
        $httpBackend = $injector.get('$httpBackend');

        dumble = {
            setDumbleData: function() {},
        };
        spyOn(dumble, 'setDumbleData');

        $location = {
            path: function(url) {},
        };
        spyOn($location, 'path');

        getController = function() {
            return $controller('adminRoleController', {
                $scope: $scope,
                //$http: null,
                $location: $location,
                $timeout: null,
                $document: null,
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

    it('Should go to home', function() {
        var controller = getController();
        $scope.goToHome();
        expect($location.path).toHaveBeenCalledWith('/admin/home');
    });
    it('Should get Admin roles and Fair types', function() {
        var controller = getController();
        $httpBackend
            .when('GET', '/volunteer-manager/admin/roles')
            .respond({
                "statusCode": 200,
                "statusMessage": "FETCHED ROLES AND ASSETS SUCCESSFULLY",
                "rolesStatus": {
                    "id": "10262",
                    "title": "Theme & Decorations"
                },
                "adminFairTypes": ["Preschool", "Elementary", "Middle", "BOGO Preschool / Elementary", "BOGO MS", "Tabletop Preschool / Elementary", "Tabletop MS"]
            });
        $scope.initRoles();
        $httpBackend.flush();
        expect($scope.roles).toEqual({
            "id": "10262",
            "title": "Theme & Decorations"
        });
        expect($scope.fairTypes).toEqual(["Preschool", "Elementary", "Middle", "BOGO Preschool / Elementary", "BOGO MS", "Tabletop Preschool / Elementary", "Tabletop MS"]);
    });


});

describe('VMS.adminMessageController', function() {
    var $controller,
        $messSer,
        $httpBackend,
        $scope,
        $q,
        getController,
        $location,
        deferred,
        messageReturn,
        urlprefix,
        dumble;

    beforeEach(module('adminModule'));

    beforeEach(inject(function($injector, _$rootScope_, _$controller_, _$q_) {
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
        $httpBackend = $injector.get('$httpBackend');
        $q = _$q_;
        urlprefix = '';

        messageReturn = {
            data: {
                message: '',
                status: ''
            }
        };

        deferred = $q.defer();
        $messSer = {
            getMessages: function() {
                return deferred.promise;
            }
        };
        //spyOn($messSer, 'getMessages');

        dumble = {
            setDumbleData: function() {},
        };
        spyOn(dumble, 'setDumbleData');

        $location = {
            path: function(url) {},
        };
        spyOn($location, 'path');

        getController = function() {
            return $controller('adminMessageController', {
                $scope: $scope,
                //$http: null,
                messSer: $messSer,
                $location: $location,
                dumble: dumble,
                urlprefix: urlprefix,
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

    it('Should have all buttons enabled by default', function() {
        var controller = getController();

        expect($scope.disabledSave).toBeFalsy();
        expect($scope.disablePublishLater).toBeFalsy();
        expect($scope.disablePublishNow).toBeFalsy();
        expect($scope.disablePublishLater).toBeFalsy();
        expect($scope.disablePublishLater).toBeFalsy();
    });

    it('Should have \'publish now\' and \'publish later\' buttons disabled when message is of type PUBLISH_NOW', function() {
        var controller = getController();

        messageReturn.data.status = "PUBLISH_NOW";
        deferred.resolve(messageReturn);
        $scope.$apply();

        expect($scope.disablePublishNow).toBeTruthy();
        expect($scope.disablePublishLater).toBeTruthy();
    });

    it('Should have \'save\' button disabled when message is of type SAVE', function() {
        var controller = getController();

        messageReturn.data.status = "SAVE";
        deferred.resolve(messageReturn);
        $scope.$apply();

        expect($scope.disabledSave).toBeTruthy();
    });

    it('Should have \'publish later\' button disabled when message is of type PUBLISH_LATER', function() {
        var controller = getController();

        messageReturn.data.status = "PUBLISH_LATER";
        deferred.resolve(messageReturn);
        $scope.$apply();

        expect($scope.disablePublishLater).toBeTruthy();
    });

    it('Should add message of type SAVE', function() {
        var controller = getController();
        $scope.messageform = {
            $valid: true,
        };
        $httpBackend.whenPUT(urlprefix + '/volunteer-manager/admin/message').respond({
            status: "SAVE",
            message: "123",
        });
        $scope.addMessage('SAVE');

        $httpBackend.flush();
        expect($scope.message).toBe('123');
        expect($scope.disabledSave).toBeTruthy();
    });

    it('Should add message of type PUBLISH_LATER', function() {
        var controller = getController();
        $scope.messageform = {
            $valid: true,
        };
        $httpBackend.whenPUT(urlprefix + '/volunteer-manager/admin/message').respond({
            status: "PUBLISH_LATER",
            message: "123",
        });
        $scope.addMessage('PUBLISH_LATER');

        $httpBackend.flush();
        expect($scope.message).toBe('123');
        expect($scope.disablePublishLater).toBeTruthy();
    });

    it('Should add message of type PUBLISH_NOW', function() {
        var controller = getController();
        $scope.messageform = {
            $valid: true,
        };
        $httpBackend.whenPUT(urlprefix + '/volunteer-manager/admin/message').respond({
            status: "PUBLISH_NOW",
            message: "123",
        });
        $scope.addMessage('PUBLISH_NOW');

        $httpBackend.flush();
        expect($scope.message).toBe('123');
        expect($scope.disablePublishNow).toBeTruthy();
        expect($scope.disablePublishLater).toBeTruthy();
    });

    it('Should do nothing when message of type UNKNOWN', function() {
        var controller = getController();
        $scope.messageform = {
            $valid: true,
        };
        $httpBackend.whenPUT(urlprefix + '/volunteer-manager/admin/message').respond({
            status: "UNKNOWN",
            message: "123",
        });
        $scope.addMessage('UNKNOWN');

        $httpBackend.flush();
        expect($scope.disablePublishNow).toBeFalsy();
        expect($scope.disablePublishLater).toBeFalsy();
    });


    it('Should do nothing when POSTing breaks', function() {
        var controller = getController();
        $scope.messageform = {
            $valid: true,
        };
        $httpBackend.whenPUT(urlprefix + '/volunteer-manager/admin/message').respond(400, {});
        $scope.addMessage('UNKNOWN');

        $httpBackend.flush();
        expect($scope.disablePublishNow).toBeFalsy();
        expect($scope.disablePublishLater).toBeFalsy();
    });

    it('Should do nothing when the form is invalid', function() {
        var controller = getController();
        $scope.messageform = {
            $valid: false,
        };

        $scope.addMessage('UNKNOWN');

        expect($scope.disablePublishNow).toBeFalsy();
        expect($scope.disablePublishLater).toBeFalsy();

    });

    it('Should clear message', function() {
        var controller = getController();

        $scope.message = "hello";

        $scope.clear();

        expect($scope.message).toEqual("");
    });

    it('Should disable buttons on change status', function() {
        var controller = getController();

        $scope.disablePublishLater = true;
        $scope.disablePublishNow = true;
        $scope.disabledSave = true;

        $scope.changeStatus();

        expect($scope.disablePublishLater).toBeFalsy();
        expect($scope.disablePublishNow).toBeFalsy();
        expect($scope.disableSave).toBeFalsy();
    });

    it('Should go to home', function() {
        var controller = getController();
        $scope.goToHome();
        expect($location.path).toHaveBeenCalledWith('/admin/home');
    });

    it('Should disable publish and save', function() {
        var controller = getController();
        $scope.disablePublishLater = true;
        $scope.disablePublishNow = true;
        $scope.disabledSave = true;

        $scope.changeStatus();

        expect($scope.disablePublishLater).toBeFalsy();
        expect($scope.disablePublishNow).toBeFalsy();
        expect($scope.disableSave).toBeFalsy();
    });
});
