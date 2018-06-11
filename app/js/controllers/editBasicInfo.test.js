'use strict';
describe('VMS.EditBasicInfo', function() {
    var $scope,
        $controller,
        getController,
        $location,
        $routeParams,
        $httpBackend,
        $timeout,
        $window,
        urlprefix,
        signupSheetService,
        teamsite;
    beforeEach(module('editBasicInfo'));
    beforeEach(inject(function($injector, _$rootScope_, _$controller_, _$timeout_) {
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
        $timeout = _$timeout_;
        $httpBackend = $injector.get('$httpBackend');
        $location = {
            path: function(url) {},
        };
        $window = {
            sessionStorage: {
                getItem: function(a) {},
            }
        };
        spyOn($location, 'path');
        spyOn($window.sessionStorage, 'getItem');

        $routeParams = {
            orgId: 200,
            eventId: 100,
        };
        signupSheetService = {
            updateSchoolId: function(a, b) {
                return a;
            }
        };
        spyOn(signupSheetService, 'updateSchoolId');
        getController = function() {
            return $controller('editBasicInfoCtrl', {
                $scope: $scope,
                $routeParams: $routeParams,
                $location: $location,
                teamsite: '',
                $timeout: $timeout,
                $window: $window,
                signupSheetService: signupSheetService,
                urlprefix: ''
            });
        };

    }));

    it('Should have a controller', function() {
        var controller = getController();
        expect(controller).toBeDefined();
    });
    it('Should go back to Volunteers page', function() {
        var controller = getController();
        $scope.gotoVolunteers();
        expect($location.path).toHaveBeenCalledWith('/volunteers/200/100');
    });
    it('Should open start date Calender popup', function() {
        var controller = getController();
        $scope.openedStartDate = false;
        $scope.startDatePopup();
        expect($scope.openedStartDate).toBeTruthy();
    });
    it('Should open end date Calender popup', function() {
        var controller = getController();
        $scope.openedEndDate = false;
        $scope.endDatePopup();
        expect($scope.openedEndDate).toBeTruthy();
    });
    it('Should close Calender pop up background', function() {
        var controller = getController();
        $scope.PopupBg = true;
        $scope.closeCalender();
        expect($scope.PopupBg).toBeFalsy();
    });
    it('Should go back to signUp sheet builder', function() {
        var controller = getController();
        $scope.fair = {
            signUpSheetId: 300,
            previousSignUpId: 300,
            description: 'test data',
            fairStartDate: '02/07/2017',
            fairEndDate: '02/27/2017',
        };
        $scope.stepBack();
        expect($location.path).toHaveBeenCalledWith('/volunteers/builder/200/100/300');
    });
    it('Should save edit basic info', function() {
        var controller = getController();
        $scope.basicInfo = {
            $valid: true,
        };
        $scope.fair = {
            fairId: 1,
            schoolId: 2,
            startDate: '04/01/2017',
            endDate: '04/10/2017',
            signupSheetId: -1
        };
        $scope.editFormSubmit();
        $httpBackend.whenPOST('/volunteer-manager/signupsheet/basic/create').respond(200, {
            statusMessage: 'success',
            signupSheetId: 123
        });
        $httpBackend.flush();

        expect($scope.fair.signUpSheetId).toBe(123);
        expect($scope.fair.previousSignUpId).toBe(123);
    });
    it('Should update SchoolId to signupSheet Activities', function() {
        var controller = getController();
        $scope.basicInfo = {
            $valid: true,
        };
        $scope.fair = {
            fairStartDate: '12/12/12',
            fairEndDate: '12/13/12'
        };
        $scope.editFormSubmit();
        expect(signupSheetService.updateSchoolId).toHaveBeenCalled();
    });
    it('Should update basic info', function() {
        var controller = getController();
        $scope.basicInfo = {
            $valid: true,
        };
        $scope.fair = {
            fairId: 1,
            schoolId: 2,
            startDate: '04/01/2017',
            endDate: '04/10/2017',
            signUpSheetId: 123
        };
        $scope.editFormSubmit();
        $httpBackend.whenPUT('/volunteer-manager/signupsheet/basic/update').respond(200, {
            statusMessage: 'success',
            signupSheetId: 123
        });
        $httpBackend.flush();

        expect($scope.fair.signUpSheetId).toBe(123);
        expect($scope.fair.previousSignUpId).toBe(123);
    });


});
