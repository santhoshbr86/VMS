"use strict";
describe('VMS.printSignupSheetsModule', function() {

    var $controller,
        $scope,
        $httpBackend,
        $location,
        $routeParams,
        dumble,
        urlprefix,
        getController;

    beforeEach(module('printSignupSheetsModule'));

    beforeEach(inject(function($injector, _$rootScope_, _$controller_) {
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
        $httpBackend = $injector.get('$httpBackend');
        urlprefix = '';

        dumble = {
            setDumbleData: function() {},
        };
        spyOn(dumble, 'setDumbleData');

        $routeParams = {
            sid: 123,
        };

        var printRegExp = new RegExp(urlprefix + '/volunteer-manager/signupsheet/.*/print');
        $httpBackend.whenGET(printRegExp).respond({});

        getController = function() {
            return $controller('signupSheetPrintController', {
                $scope: $scope,
                //$http: null,
                $location: $location,
                $routeParams: $routeParams,
                dumble: dumble,
                urlprefix: urlprefix,
            });
        };
    }));

    it('Should have controller', function() {
        var controller = getController();
        $httpBackend.flush();
        expect(controller).toBeDefined();
    });

    it('Should set dumble', function() {
        var controller = getController();
        $httpBackend.flush();
        expect(dumble.setDumbleData).toHaveBeenCalled();
    });

});
