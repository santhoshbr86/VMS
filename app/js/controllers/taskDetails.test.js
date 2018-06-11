'use strict';
describe('VMS.taskDetails', function() {
    var $controller,
        $scope,
        dumble,
        timeandtaskSheet,
        $window,
        $location,
        $routeParams,
        signupSheetService,
        fairStore,
        $timeout,
        $filter,
        getController;

    beforeEach(module('taskDetails'));

    beforeEach(inject(function($injector, _$rootScope_, _$controller_, _$timeout_, _$filter_) {
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
        $timeout = _$timeout_;
        $filter = _$filter_;

        dumble = {
            setDumbleData: function() {},
        };
        spyOn(dumble, 'setDumbleData');

        timeandtaskSheet = {
            getTimeandDay: function() {
                return {
                    hour: '',
                    day: {
                        dateYear: '',
                    },
                };
            },
        };
        //spyOn(timeandtaskSheet, 'getTimeandDay');

        $routeParams = {
            orgId: 123,
            eventId: 456,
            sId: 789,
        };

        signupSheetService = {
            setOrgId: function(orgId) {},
            setFairId: function(orgId) {},
            setId: function(sId) {},
            getId: function() {},
        };
        spyOn(signupSheetService, 'setOrgId');
        spyOn(signupSheetService, 'setFairId');
        spyOn(signupSheetService, 'setId');
        spyOn(signupSheetService, 'getId');

        $window = {
            sessionStorage: {
                getItem: function(a) {
                    return '{}';
                },
                setItem: function(b) {
                    return '{}';
                },
            }
        };
        spyOn($window.sessionStorage, 'getItem').and.callThrough();

        $location = {
            path: function(p) {},
        };
        spyOn($location, 'path');

        fairStore = {
            getContactsList: function() {
                return {};
            },
            deleteTask: function() {
                return {};
            },
            getStoreTasks: function() {
                return [''];
            }
        };
        spyOn(fairStore, 'getContactsList');
        spyOn(fairStore, 'deleteTask');
        spyOn(fairStore, 'getStoreTasks').and.callThrough();
        getController = function() {
            return $controller('taskDetailsCtrl', {
                $scope: $scope,
                $window: $window,
                $rootScope: null,
                $filter: $filter,
                $location: $location,
                timeandtaskSheet: timeandtaskSheet,
                signupSheetService: signupSheetService,
                $route: null,
                $routeParams: $routeParams,
                fairStore: fairStore,
                httpErrorLoggingService: null,
                $timeout: $timeout,
                dumble: dumble,
                urlprefix: '',
                teamsite: '',
            });
        };
    }));

    it('Should have a controller', function() {
        var controller = getController();
        expect(controller).toBeDefined();
    });

    it('Should navigate to volunteers', function() {
        var controller = getController();
        $scope.gotoVolunteers();
        expect($location.path).toHaveBeenCalledWith('/volunteers/' + $routeParams.orgId + '/' + $routeParams.eventId);
    });

    it('Should navigate to signUp sheet builder', function() {
        var controller = getController();
        $scope.sId = signupSheetService.getId();
        $scope.gotoSignupBuilder();
        expect($location.path).toHaveBeenCalledWith('/volunteers/builder/' + $routeParams.orgId + '/' + $routeParams.eventId + '/' + $scope.sId);
    });
    it('Should navigate to new signUp sheet builder', function() {
        var controller = getController();
        $scope.sid = '-1/new';
        $scope.gotoSignupBuilder();
        expect($location.path).toHaveBeenCalledWith('/volunteers/builder/' + $routeParams.orgId + '/' + $routeParams.eventId + '/' + $scope.sId);
    });

    it('Should navigate to edit schedule', function() {
        var controller = getController();
        $scope.stepBack();
        expect($location.path).toHaveBeenCalledWith('/editSchedule/' + $routeParams.orgId + "/" + $routeParams.eventId);
    });

    it('Should add new contact', function() {
        var controller = getController();

        $scope.task.volName = "Mock Test";
        $scope.noVolunteer = true;
        $scope.showlist = true;
        $scope.noMatch = true;
        $scope.addNewContact();

        expect($scope.noVolunteer).toBeFalsy();
        expect($scope.showlist).toBeFalsy();
        expect($scope.noMatch).toBeFalsy();
    });

    it('Should add duplicate', function() {
        var controller = getController();

        $scope.task = {
            start: '08:00 AM',
            end: '10:00 AM',
            startDate: '05/15/2017',
            volName: 'I should go away'
        };
        $scope.duplicates = [];
        $scope.duplicate();
        expect($scope.duplicates.length).toEqual(1);
        expect($scope.duplicates[0].volName).toEqual('');
    });

    it('Should delete duplicate', function() {
        var controller = getController();

        $scope.duplicates = [{
            start: '08:00 AM',
            end: '10:00 AM'
        }];
        $scope.deleteDuplicate(0);
        expect($scope.duplicates.length).toEqual(0);
    });

    it('Should close the popup', function() {
        var controller = getController();
        $scope.cancelTaskDetailPopUp();
        expect($scope.overLay).toBeFalsy();
        expect($scope.taskConfirmPopUp).toBeFalsy();
    });

    it('Should check task start time lesser than actual', function() {
        var controller = getController();
        $scope.task = {
            start: '09:00 AM',
            end: '10:00 AM',
            startDate: '05/15/2017'
        };
        expect($scope.isAfterTimeBlock($scope.task.start, '08:00 AM')).toBeTruthy();
    });

    it('Should check task start time greater than actual', function() {
        var controller = getController();
        $scope.task = {
            start: '09:00 AM',
            end: '10:00 AM',
            startDate: '05/15/2017'
        };
        expect($scope.isBeforeTimeBlock($scope.task.start, '10:00 AM')).toBeTruthy();
    });

    it('Should check task start date greater than actual', function() {
        var controller = getController();
        $scope.task = {
            start: '09:00 AM',
            end: '10:00 AM',
            startDate: '05/15/2017'
        };
        expect($scope.thisIsAfter($scope.task.startDate, '05/14/2017')).toBeTruthy();
    });

    it('Should check task start date lesser than actual', function() {
        var controller = getController();
        $scope.task = {
            start: '09:00 AM',
            end: '10:00 AM',
            startDate: '05/15/2017'
        };
        expect($scope.thisIsBefore($scope.task.startDate, '05/16/2017')).toBeTruthy();
    });

    it('Should go back to Edit Volunteer Schedule page', function() {
        var controller = getController();
        $scope.stepBack();
        expect($location.path).toHaveBeenCalledWith('/editSchedule/' + $routeParams.orgId + '/' + $routeParams.eventId);
    });

    it('Should check date and time block changed for task', function() {
        var controller = getController();
        $scope.task = {
            start: '09:00 AM',
            end: '10:00 AM',
            startDate: '05/15/2017'
        };
        var taskDetail = {
            startTime: '2016-06-14T09:00',
            endTime: '2016-06-14T10:00',
            activityDate: '05/15/2016',
        };
        $scope.IsDateAndTimeBlockChanged(taskDetail);
        expect($scope.overLay).toBeTruthy();
        expect($scope.taskConfirmPopUp).toBeTruthy();
    });

    it('Should add new duplicate contact', function() {
        var controller = getController();
        $scope.duplicates = [{
            volName: 'Sujit Dubey'
        }];
        $scope.addNewDuplicateContact(0);
        expect($scope.duplicates[0].firstName).toBe('Sujit');
        expect($scope.duplicates[0].lastName).toBe('Dubey');
        expect($scope.duplicates[0].noVolunteer).toBeFalsy();
        expect($scope.duplicates[0].showlist).toBeFalsy();
    });

    it('Should check duplicate volunteer', function() {
        var controller = getController();
        $scope.duplicates = [{
            volName: 'Sujit Dubey'
        }];
        $scope.checkDuplicateVolunteer(0);
        expect($scope.duplicates[0].showlist).toBeTruthy();
    });

    it('Should check duplicate contact validity', function() {
        var controller = getController();
        $scope.duplicates = [{
            volName: 'Sujit Dubey',
            firstName: 'Sujit',
            lastName: 'Dubey'
        }];
        $scope.checkDuplicateContactValidity(0);
        expect($scope.duplicates[0].submitted).toBeTruthy();
        expect($scope.duplicates[0].addContactFirstNameError).toBeFalsy();
        expect($scope.duplicates[0].addContactLastNameError).toBeFalsy();
    });

    it('Should show delete task overlay', function() {
        var controller = getController();
        $scope.task.volName = "Venkatesh";
        $scope.checkvolunteername();
        expect($scope.deletetasktetails).toBeFalsy();
        expect($scope.overLay).toBeFalsy();
    });

    it('Should go back when delete is clicked', function() {
        var controller = getController();
        $scope.checkvolunteername();
        expect($scope.deletetasktetails).toBeFalsy();
        expect($scope.overLay).toBeFalsy();
        expect($location.path).toHaveBeenCalledWith('/editSchedule/' + $routeParams.orgId + '/' + $routeParams.eventId);
    });

    it('Should close delete task overlay popup', function() {
        var controller = getController();
        $scope.closePopUp();
        expect($scope.overLay).toBeFalsy();
        expect($scope.deletetasktetails).toBeFalsy();
    });

    it('Should navigate for no duplicates', function() {
        var controller = getController();
        $scope.noVolunteer = true;
        $scope.duplicates = [];
        $scope.saveDuplicates();
        expect($location.path).toHaveBeenCalledWith('/editSchedule/' + $routeParams.orgId + '/' + $routeParams.eventId);
    });

    it('Should check volunteer', function() {
        var controller = getController();
        $scope.task = {
            volName: 'Sujit Dubey'
        };
        $scope.filteredContact = [{
            name: 'test'
        }];
        $scope.checkVolunteer();
        expect($scope.showlist).toBeTruthy();
        expect($scope.noMatch).toBeFalsy();
    });

    it('Should select volunteer', function() {
        var controller = getController();
        var contact = {
            email: "sujit@test.in",
            volunteerExt: {
                firstName: 'Sujit',
                lastName: 'Dubey'
            }
        };
        $scope.onSelect(contact);
        expect($scope.noMatch).toBeFalsy();
        expect($scope.showlist).toBeFalsy();
        expect($scope.noVolunteer).toBeTruthy();
    });

    it('Should select volunteer for duplicate', function() {
        var controller = getController();
        $scope.duplicates = [{
            phone: '11113333222'
        }];
        var contact = {
            email: "sujit@test.in",
            volunteerExt: {
                firstName: 'Sujit',
                lastName: 'Dubey'
            }
        };
        $scope.onSelectDuplicate(contact, 0);
        expect($scope.duplicates[0].showlist).toBeFalsy();
        expect($scope.duplicates[0].noVolunteer).toBeTruthy();
    });

    it('Should select delete contact ', function() {
        var controller = getController();
        $scope.task = {};
        $scope.deleteContact($scope.task);
        expect($scope.deletetasktetails).toBeFalsy();
        expect($scope.overLay).toBeFalsy();
        expect($location.path).toHaveBeenCalledWith('/editSchedule/' + $routeParams.orgId + '/' + $routeParams.eventId);
    });

    it('Should validate contact ', function() {
        var controller = getController();
        $scope.task = {
            firstName: 'Sujit',
            lastName: 'Dubey',
            email: 'sjt@schlstc.com'
        };
        $scope.checkContactValidity();
        expect($scope.addContactFirstNameError).toBeFalsy();
        expect($scope.addContactLastNameError).toBeFalsy();
        expect($scope.addContactEmailError).toBeFalsy();
    });
});
