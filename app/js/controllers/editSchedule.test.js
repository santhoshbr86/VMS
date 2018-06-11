'use strict';
describe('VMS.editScheduleCtrl', function() {
    var $scope,
        $controller,
        $routeParams,
        $location,
        $window,
        getController,
        mockStore,
        teamsite;
    beforeEach(module('editSchedule'));
    beforeEach(inject(function($injector, _$rootScope_, _$controller_) {
        $scope = _$rootScope_.$new();
        $controller = _$controller_;

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

        getController = function() {
            return $controller('editScheduleCtrl', {
                $scope: $scope,
                $location: $location,
                $routeParams: $routeParams,
                $window: $window,
                teamsite: ''
            });
        };
    }));

    it('Should have a controller', function() {
        var controller = getController();
        expect(controller).toBeDefined();
    });
    it('Should link tab to calendar View', function() {
        var controller = getController();
        expect($scope.tabs[0].templateUrl).toBe('/partials/calendar-view.html');
    });
    it('Should navigate to volunteers', function() {
        var controller = getController();
        $scope.gotoVolunteers();
        expect($location.path).toHaveBeenCalledWith('/volunteers/' + $routeParams.orgId + '/' + $routeParams.eventId);
    });
    it('Should navigate to signUp sheet builder', function() {
        var controller = getController();
        $scope.fair = {
            previousSignUpId: 123
        };
        $scope.stepBack();
        expect($location.path).toHaveBeenCalledWith('/volunteers/builder/' + $routeParams.orgId + '/' + $routeParams.eventId + '/123/new');
    });

});

describe('VMS.calenderSchedulerCtrl', function() {
    var $scope,
        $controller,
        getController,
        $routeParams,
        adminRoles,
        $q,
        $httpBackend,
        teamsite,
        $window,
        $filter,
        jqService,
        fairStore,
        $location,
        dateService,
        timeandtaskSheet,
        signupSheetService;
    beforeEach(module('editSchedule'));
    beforeEach(inject(function($injector, _$rootScope_, _$controller_, _$q_) {
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
        $q = _$q_;
        $httpBackend = $injector.get('$httpBackend');
        $routeParams = {
            orgId: 1,
            eventId: 2
        };
        adminRoles = {
            getAdminRoles: function(a) {
                var q = $q.defer();
                q.resolve({
                    data: {
                        statusCode: 200,
                        rolesStatus: [{
                                "id": "10392",
                                "title": "Advertising Coordinator",
                            },
                            {
                                "id": "10391",
                                "title": "All for Books Coordinator",

                            }
                        ]
                    }
                });
                return q.promise;
            },
            getCustomRoles: function(a) {
                var q = $q.defer();
                q.resolve({
                    data: {
                        statusCode: 200,
                        rolesStatus: [{
                                "id": "101",
                                "title": "Volunteer",
                            },
                            {
                                "id": "102",
                                "title": "Helper",

                            }
                        ]
                    }
                });
                return q.promise;
            }
        };
        spyOn(adminRoles, 'getCustomRoles').and.callThrough();
        spyOn(adminRoles, 'getAdminRoles').and.callThrough();



        jqService = {
            addStyle: function() {}
        };
        spyOn(jqService, 'addStyle');

        fairStore = {
            storeTasks: function(a) {},
            updateStore: function(a) {},
            getStoreTasks: function() {
                return [''];
            },
            setAdminRoles: function(a) {},
            getAdminRoles: function() {
                return false;
            },
            setCustomRoles: function(a) {},
            deleteCustomRole: function(a) {},
            getCustomRoles: function() {
                return false;
            }
        };
        spyOn(fairStore, 'updateStore');
        spyOn(fairStore, 'storeTasks');
        spyOn(fairStore, 'getStoreTasks').and.callThrough();
        spyOn(fairStore, 'setAdminRoles');
        spyOn(fairStore, 'getAdminRoles').and.callThrough();
        spyOn(fairStore, 'setCustomRoles');
        spyOn(fairStore, 'getCustomRoles').and.callThrough();
        spyOn(fairStore, 'deleteCustomRole').and.callThrough();

        dateService = {
            dateRange: function() {},
            utcConversion: function() {},
        };
        timeandtaskSheet = {
            getPublishedTasks: function(arg) {
                var q = $q.defer();
                q.resolve({
                    data: {
                        statusCode: 200,
                        fairStatus: "PUBLISHED",
                        statusMessage: "Volunteer Activities Retrieved Sucessfully"
                    }
                });
                return q.promise;
            }
        };
        signupSheetService = {
            setId: function() {},
            getId: function() {
                return 123;
            },
            setCustomTaskId: function() {},
            getCustomTaskId: function() {
                return {
                    id: 123,
                };
            },
        };
        spyOn(dateService, 'dateRange');
        spyOn(dateService, 'utcConversion');
        spyOn(timeandtaskSheet, 'getPublishedTasks').and.callThrough();
        spyOn(signupSheetService, 'setCustomTaskId').and.callThrough();
        spyOn(signupSheetService, 'getCustomTaskId').and.callThrough();
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

        $location = {
            path: function(p) {},
            url: function() {
                return '/volunteers/99018886/8111231';
            }
        };
        spyOn($location, 'path');

        $httpBackend.whenGET('/volunteer-manager/signupsheet/basic/info/' + $routeParams.orgId + "/" + $routeParams.eventId + "/" + $routeParams.sid).respond({
            eventName: 'test',
        });

        getController = function() {
            return $controller('calenderSchedulerCtrl', {
                $scope: $scope,
                teamsite: '',
                $routeParams: $routeParams,
                adminRoles: adminRoles,
                jqService: jqService,
                fairStore: fairStore,
                dateService: dateService,
                urlprefix: '',
                $location: $location,
                $window: $window,
                $filter: null,
                timeandtaskSheet: timeandtaskSheet,
                signupSheetService: signupSheetService
            });
        };
    }));

    it('Should have a controller', function() {
        var controller = getController();
        expect(controller).toBeDefined();
    });

    it('Should get Admin roles', function() {
        var controller = getController();
        expect(adminRoles.getAdminRoles).toHaveBeenCalled();
        expect(adminRoles.getAdminRoles).toHaveBeenCalledWith($routeParams.eventId);
    });

    it('Should get Custom roles', function() {
        var controller = getController();
        expect(adminRoles.getCustomRoles).toHaveBeenCalled();
        expect(adminRoles.getCustomRoles).toHaveBeenCalledWith($routeParams.orgId);
    });
    it('Should get Published tasks', function() {
        var controller = getController();
        $scope.sid = 121;
        $scope.getTasks();
        expect($scope.sid).not.toEqual(null);
        expect(timeandtaskSheet.getPublishedTasks).toHaveBeenCalledWith($scope.sid);
    });

    it('Should scroll left', function() {
        var controller = getController();
        $scope.prevDates();
        expect($scope.beginWith).toBe(28);
        expect(jqService.addStyle).toHaveBeenCalled();
    });

    it('Should scroll right', function() {
        var controller = getController();
        $scope.weekDays = ['sat', 'sun'];
        $scope.nextDates();
        expect($scope.beginWith).toBe(30);
        expect(jqService.addStyle).toHaveBeenCalled();
    });

    it('Should check if a time belongs in a block', function() {
        var controller = getController();
        // TODO: I need to mock a bunch of data here
        expect($scope.isInTimeBlock({
            anyTime: true
        }, {}, {})).toBe(undefined);
        expect($scope.isInTimeBlock({
                anyTime: false,
                activityDate: '06/13/2016',
                startTime: '2016-06-13T11:00',
                endTime: '2016-06-13T12:00'
            },
            '11 AM', {
                dateYear: '06/13/2016'
            })).toBe(true);

        expect($scope.isInTimeBlock({
                anyTime: false,
                activityDate: '06/13/2016',
                startTime: '2016-06-13T19:00',
                endTime: '2016-06-13T19:00'
            },
            '7 PM', {
                dateYear: '06/13/2016'
            })).toBe(true);

        expect($scope.isInTimeBlock({
            anyTime: false,
            activityDate: '06/13/2016',
            startTime: '2016-06-14T11:00',
            endTime: '2016-06-14T12:00'
        }, '11 AM', {
            dateYear: '06/13/2017'
        })).toBe(false);
    });

    // NOTE: Skipping this for now
    it('Should add space where there are overlaps', function() {
        var controller = getController();

        expect($scope.overlapSpacer({
            activityDate: '03/13/2016'
        }, '', {
            dateYear: '06/13/2017'
        })).toBe(false);
        expect($scope.overlapSpacer({
            activityDate: '06/13/2017',
            endTime: '2016-06-14T12:00'
        }, '', {
            dateYear: '06/13/2017'
        })).toBe(false);

        // TODO: This is annoying to test, do it eventually tho!
        //expect($scope.overlapSpacer({anyTime:false,activityDate:'06/14/2016',startTime:'2016-06-14T09:00',endTime:'2016-06-15T15:00'},'11 AM',{dateYear:'06/14/2017'})).toBe(true);
    });

    it('Should check date range', function() {
        var controller = getController();

        $scope.tasks = {
            fairStartDate: '06/02/2016',
            fairEndDate: '06/05/2016'
        };
        expect($scope.DateRangeCheck({
            dateYear: '06/03/2016'
        })).toEqual({
            dateYear: '06/03/2016'
        });
        expect($scope.DateRangeCheck({
            dateYear: '06/01/2016'
        })).toEqual(undefined);

        $scope.tasks = undefined;

        $scope.dummypastFair = {
            startDate: '06/02/2016',
            endDate: '06/05/2016'
        };
        expect($scope.DateRangeCheck({
            dateYear: '06/03/2016'
        })).toEqual({
            dateYear: '06/03/2016'
        });
        expect($scope.DateRangeCheck({
            dateYear: '06/01/2016'
        })).toEqual(undefined);
    });

    it('Should create calendar', function() {
        var controller = getController();

        $scope.createCalendar({
            fairStartDate: '03/13/2016',
            fairEndDate: '03/14/2016',
        });

        expect(dateService.dateRange).toHaveBeenCalled();
    });

    it('Should update calendar', function() {
        var controller = getController();

        $scope.updateCalendar();

        expect(jqService.addStyle).toHaveBeenCalled();
    });

    it('Should update fair', function() {
        var controller = getController();

        $scope.fair = {
            fairId: 1,
            schoolId: 2,
            startDate: '04/01/2017',
            endDate: '04/10/2017',
            signUpSheetId: 123
        };
        $scope.saveFair();
        $httpBackend.whenPUT('/volunteer-manager/signupsheet/basic/update').respond(200, {
            statusMessage: 'success',
            signupSheetId: 123
        });
        $httpBackend.flush();

        expect($scope.fair.signUpSheetId).toBe(123);
        expect($scope.fair.previousSignUpId).toBe(123);
    });

    it('Should create fair', function() {
        var controller = getController();

        $scope.fair = {
            fairId: 1,
            schoolId: 2,
            startDate: '04/01/2017',
            endDate: '04/10/2017',
            signupSheetId: -1
        };
        $scope.saveFair();
        $httpBackend.whenPOST('/volunteer-manager/signupsheet/basic/create').respond(200, {
            statusMessage: 'success',
            signupSheetId: 123
        });
        $httpBackend.flush();

        expect($scope.fair.signUpSheetId).toBe(123);
        expect($scope.fair.previousSignUpId).toBe(123);
    });
    it('Should navigate to taskDetails', function() {
        var controller = getController();
        $scope.loadTaskDetails();
        expect($location.path).toHaveBeenCalledWith('/taskDetails/' + $routeParams.orgId + '/' + $routeParams.eventId);
    });
    it('Should get required data for view', function() {
        var controller = getController();
        //$httpBackend.flush();
        expect($scope.fair).toBeDefined();
    });
    it('Should show delete custom task confirm', function() {
        var controller = getController();
        var e = {
            clientY: 50
        };
        $scope.deleteCustomTaskConfirm({}, e);
        expect(signupSheetService.setCustomTaskId).toHaveBeenCalled();
        expect($scope.showDelOverlay).toBe(true);
        expect($scope.showTaskPopUp).toBe(true);
    });
    it('Should close delete custom task confirm', function() {
        var controller = getController();
        $scope.closeCustomTaskDeletePopup();
        expect($scope.showDelOverlay).toBe(false);
        expect($scope.showTaskPopUp).toBe(false);
    });
    it('Should delete custom tasks', function() {
        var controller = getController();
        $scope.deleteRole();
        $httpBackend.whenDELETE('/volunteer-manager/signupsheet/remove/task/123').respond(200, {
            statusMessage: 'Removed Custom Role Successfully',
            statusCode: 200
        });
        $httpBackend.flush();
        expect(fairStore.deleteCustomRole).toHaveBeenCalled();
    });
    it('Should close list popUp', function() {
        var controller = getController();
        $scope.showListPopup = true;
        $scope.closeListPopup();
        expect($scope.showListPopup).toBeFalsy();
    });
    it('Should toggle duplicate overlay', function() {
        var controller = getController();
        $scope.showDupOverlay = false;
        $scope.weekDays = [{
                dat: "01/22",
                dateYear: "01/22/2017",
                day: "Sun"
            },
            {
                dat: "01/23",
                dateYear: "01/23/2017",
                day: "Mon"
            }
        ];
        var dateObj = {
            dat: "02/21",
            dateYear: "02/21/2017",
            day: "Tues"
        };
        $scope.toggleDupOverlay(dateObj);
        expect($scope.showDupOverlay).toBeTruthy();
        expect($scope.duplicateDayFrom).toEqual(new Date(dateObj.dateYear));
        expect($scope.duplicateDayTo).toEqual(new Date("02/22/2017"));
    });
});
describe('VMS.duplicateDayCtrl', function() {
    var $scope,
        $controller,
        getController,
        teamsite,
        jqService,
        $filter,
        fairStore;
    beforeEach(module('editSchedule'));
    beforeEach(inject(function($injector, _$rootScope_, _$controller_) {
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
        $scope.fair = {
            fairId: 1,
            schoolId: 2,
            startDate: '04/01/2017',
            endDate: '04/10/2017',
            signupSheetId: -1,
            signupSheetActivities: [{
                "startTime": "2017-04-27T08:00",
                "endTime": "2017-04-27T09:00",
                "eventName": "Theme &amp; Decorations",
                "activityDate": "04/27/2017",
                "activityId": 295904,
            }]
        };
        jqService = {
            addStyle: function() {},
            styleCalPopUp: function() {}
        };
        spyOn(jqService, 'addStyle');
        spyOn(jqService, 'styleCalPopUp');
        fairStore = {
            updateStore: function(a) {},
            getStoreTasks: function() {
                return [''];
            },
            deleteTask: function(t) {
                return {};
            }
        };
        spyOn(fairStore, 'updateStore');
        spyOn(fairStore, 'getStoreTasks').and.callThrough();
        spyOn(fairStore, 'deleteTask');
        spyOn(angular, "forEach").and.callThrough();
        getController = function() {
            return $controller('duplicateDayCtrl', {
                $scope: $scope,
                teamsite: '',
                $filter: null,
                fairStore: fairStore,
                jqService: jqService
            });
        };
    }));
    it('Should have a controller', function() {
        var controller = getController();
        expect(controller).toBeDefined();
    });
    it('Should close overlay', function() {
        var controller = getController();
        $scope.closeOverlay();
        expect($scope.showDupOverlay).toBe(false);
    });
    it('Should update calendar with duplicated day tasks', function() {
        var controller = getController();
        $scope.duplicateDayFrom = new Date('27/04/2017');
        $scope.duplicateDayTo = new Date('28/04/2017');
        $scope.duplicateDayTasks();
        expect($scope.showDupOverlay).toBe(false);
        expect(fairStore.getStoreTasks).toHaveBeenCalled();
        expect(jqService.addStyle).toHaveBeenCalled();
    });
    it('Should open Date Picker Widget', function() {
        var controller = getController();
        $scope.openDatePicker();
        expect($scope.popup.datePickerOpened).toBe(true);
        expect(jqService.styleCalPopUp).toHaveBeenCalled();
    });
});
