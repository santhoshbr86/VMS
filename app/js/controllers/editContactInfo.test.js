'use strict';
describe('VMS.EditContactInfo', function() {
    var $scope,
        $controller,
        getController,
        $location,
        $window,
        $routeParams,
        dumble,
        signupSheetService,
        emailAddress,
        $q,
        teamsite;

    beforeEach(module('editContactInfo'));
    beforeEach(inject(function($injector, _$rootScope_, _$controller_, _$q_) {
        $scope = _$rootScope_.$new();
        $q = _$q_;
        $controller = _$controller_;

        $location = {
            path: function(url) {},
        };
        $window = {
            sessionStorage: {
                getItem: function(a) {
                    return '{}';
                },
            }
        };
        spyOn($location, 'path');
        spyOn($window.sessionStorage, 'getItem').and.callThrough();
        $routeParams = {
            orgId: 200,
            eventId: 100,
        };

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

        signupSheetService = {
            basicUpdate: function() {
                var deferred = $q.defer();
                deferred.resolve({
                    data: {}
                });
                return deferred.promise;

            },
            basicCreate: function() {
                var deferred = $q.defer();
                deferred.resolve({
                    data: {}
                });
                return deferred.promise;
            },
            updateSchoolId: function(a, b) {
                return a;
            }
        };
        spyOn(signupSheetService, 'basicUpdate').and.callThrough();
        spyOn(signupSheetService, 'basicCreate').and.callThrough();
        spyOn(signupSheetService, 'updateSchoolId');

        getController = function() {
            return $controller('editContactInfo', {
                $scope: $scope,
                $routeParams: $routeParams,
                $location: $location,
                teamsite: '',
                $window: $window,
                dumble: dumble,
                emailAddress: emailAddress,
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

    it('Should go back to signUp sheet builder', function() {
        var controller = getController();
        $scope.fair = {
            signUpSheetId: 300,
            previousSignUpId: 300,
        };
        $scope.stepBack();
        expect($location.path).toHaveBeenCalledWith('/volunteers/builder/200/100/300');
    });

    it('Should not submit due to invalid contact information', function() {
        var controller = getController();

        $scope.contactInfo = {
            $valid: false
        };
        $scope.selectedEmails = [];

        $scope.editFormSubmit();

        expect(signupSheetService.basicCreate).not.toHaveBeenCalled();
        expect(signupSheetService.basicUpdate).not.toHaveBeenCalled();
    });

    xit('Should set email alerts', function() {});

    xit('Should set email alerts 2', function() {});

    it('Should submit form for new fair', function() {
        var controller = getController();

        $scope.fair = {
            //signUpSheetId: 'intentionally blank',
            fairStartDate: '12/12/12',
            fairEndDate: '12/13/12',
            startDate: '12/12/12',
            endDate: '12/13/12',
            fairId: 100,
            schoolId: 200,
            signupSheetEmailAlerts: [],
            signupSheetActivities: [],
            signupSheetId: -1,
            signUpSheetId: undefined,
            previousSignUpId: undefined

        };
        $scope.contactInfo = {
            $valid: true
        };
        $scope.selectedEmails = [];

        $scope.editFormSubmit();
        $scope.$digest();

        expect($scope.submitted).toBeTruthy();
        expect($scope.fair.fairId).toBe($routeParams.eventId);
        expect($scope.fair.schoolId).toBe($routeParams.orgId);
        expect($scope.fair.startDate).toBe("12/12/12");
        expect($scope.fair.endDate).toBe("12/13/12");
        expect(signupSheetService.basicCreate).toHaveBeenCalledWith($scope.fair);
    });
    it('Should update SchoolId to signupSheet Activities', function() {
        var controller = getController();
        $scope.contactInfo = {
            $valid: true
        };
        $scope.editFormSubmit();
        expect(signupSheetService.updateSchoolId).toHaveBeenCalled();
    });
    it('Should submit form for existing fair', function() {
        var controller = getController();

        $scope.fair = {
            signUpSheetId: "123",
            fairStartDate: "12/12/12",
            fairEndDate: "12/13/12",
        };
        $scope.contactInfo = {
            $valid: true
        };
        $scope.selectedEmails = [];

        $scope.editFormSubmit();

        $scope.$digest();

        expect($scope.submitted).toBeTruthy();
        expect($scope.fair.fairId).toBe($routeParams.eventId);
        expect($scope.fair.schoolId).toBe($routeParams.orgId);
        expect($scope.fair.startDate).toBe("12/12/12");
        expect($scope.fair.endDate).toBe("12/13/12");
        expect(signupSheetService.basicUpdate).toHaveBeenCalledWith({
            signUpSheetId: undefined,
            fairStartDate: '12/12/12',
            fairEndDate: '12/13/12',
            startDate: '12/12/12',
            endDate: '12/13/12',
            fairId: 100,
            schoolId: 200,
            signupSheetEmailAlerts: [],
            signupSheetActivities: [],
            signupSheetId: '123',
            previousSignUpId: undefined
        });
    });

    it('Should check vaild emails', function() {
        var controller = getController();
        expect($scope.isEmail('dfsdf')).toBeFalsy();
        expect($scope.isEmail('dfsdf@')).toBeFalsy();
        expect($scope.isEmail('dfsdf@example')).toBeFalsy();
        expect($scope.isEmail('dfsdf@example.')).toBeFalsy();
        expect($scope.isEmail('dfsdf@example.c')).toBeFalsy();
        expect($scope.isEmail('dfsdf@example.com')).toBeTruthy();
    });

    it('Should determine if an email is already selected', function() {
        var controller = getController();
        $scope.contactList = [{
            email: 'foo@example.com'
        }];

        expect($scope.isExist('blah@example.com')).toBeFalsy();
        expect($scope.isExist('foo@example.com')).toBeTruthy();
    });

    it('Should update selection', function() {
        var controller = getController();
        $scope.allConsel = true;
        $scope.emailExist = true;
        $scope.updateSelection();
        expect($scope.allConsel).toBeFalsy();
        expect($scope.emailExist).toBeFalsy();
    });


});
