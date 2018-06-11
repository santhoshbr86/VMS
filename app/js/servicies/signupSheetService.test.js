'use strict';
describe('VMS.timeandtaskSheet', function() {
    var timeandtaskSheet,
        urlprefix = '',
        timeanddate = {},
        $window,
        $httpBackend;
    beforeEach(module("signUpService", function($provide) {
        $provide.value("$window", {});
        $provide.value("urlprefix", urlprefix);
    }));

    beforeEach(inject(function(_timeandtaskSheet_, _$httpBackend_) {
        timeandtaskSheet = _timeandtaskSheet_;
        $httpBackend = _$httpBackend_;

    }));
    it('Should have a service', function() {
        expect(timeandtaskSheet).toBeDefined();
    });
    it('Should set and get time and date', function() {
        timeandtaskSheet.setTimeandDay('11AM', 'monday');
        expect(timeandtaskSheet.getTimeandDay().hourNext).toBe('12:00 PM');
    });
    it('Should get tasks', function() {
        $httpBackend.whenGET('/volunteer-manager/signupsheet/122').respond({});
        timeandtaskSheet.getTasks(122);
        $httpBackend.flush();
        var response = $httpBackend.expectGET('/volunteer-manager/signupsheet/122');
        expect(response).toBeDefined();
    });
    it('Should get all tasks from signupsheet', function() {
        $httpBackend.whenGET('/volunteer-manager/signupsheet/122').respond({});
        timeandtaskSheet.getTasks(122);
        $httpBackend.flush();
        var response = $httpBackend.expectGET('/volunteer-manager/signupsheet/122');
        expect(response).toBeDefined();
    });
    it('Should get published tasks signupsheet', function() {
        $httpBackend.whenGET('/volunteer-manager/signupsheet/published/122').respond({});
        timeandtaskSheet.getPublishedTasks(122);
        $httpBackend.flush();
        var response = $httpBackend.expectGET('/volunteer-manager/signupsheet/published/122');
        expect(response).toBeDefined();
    });
    it('Should delete tasks from signupsheet table', function() {
        var deletetask = [{
                activityId: 12
            },
            {
                activityId: 13,
            },
            {
                activityId: 14
            }
        ];
        $httpBackend.whenDELETE('/volunteer-manager/signupsheet/activities/12,13,14').respond({});
        timeandtaskSheet.deleteTaskBackend(deletetask);
        $httpBackend.flush();
        var response = $httpBackend.expectDELETE('/volunteer-manager/signupsheet/activities/12,13,14');
        expect(response).toBeDefined();
    });
});

describe('VMS.fairStore', function() {
    var fairStore,
        urlprefix = '',
        tempStore = {},
        $window,
        $httpBackend;

    beforeEach(module("signUpService", function($provide) {
        $window = {
            sessionStorage: {
                getItem: function() {
                    return [];
                },
                setItem: function(a) {}
            }
        };
        $provide.value("$window", $window);
        $provide.value("urlprefix", urlprefix);

    }));

    beforeEach(inject(function(_fairStore_, _$httpBackend_) {
        fairStore = _fairStore_;
        $httpBackend = _$httpBackend_;
        tempStore = {
            signupSheetActivities: [{
                startTime: '10:00 AM',
                endTime: '11:00 AM',
                activityDate: '02/19/2017'
            }]
        };


    }));
    it('Should have a service', function() {
        expect(fairStore).toBeDefined();
    });
    it('Should add tasks and get fair tasks', function() {
        fairStore.storeTasks(tempStore);
        expect(fairStore.getStoreTasks()).toBe(tempStore);
    });
    it('Should update tasks and get updated tasks', function() {
        fairStore.storeTasks(tempStore);
        fairStore.updateStore({
            startTime: '10:00 AM',
            endTime: '12:00 AM',
            activityDate: '02/19/2017'
        });
        expect(fairStore.getStoreTasks()).toBe(tempStore);
    });

    it('Should clear the tasks', function() {
        fairStore.storeTasks(tempStore);
        fairStore.clearStoreTasks();
        expect(fairStore.getStoreTasks().length).toBe(0);
    });

    it('Should set and get fair info', function() {
        fairStore.setFair({
            fairID: 11,
            SchoolID: 100,
            fairName: 'XYZ'
        });
        expect(fairStore.getFair().fairID).toBe(11);
    });
    it('Should set and get admin Roles', function() {
        fairStore.setAdminRoles({
            statusCode: 200,
            rolesStatus: [{
                    roleID: 11,
                    roleName: 'Coordinator'
                },
                {
                    roleID: 12,
                    roleName: 'cashier'
                }
            ]
        });
        expect(fairStore.getAdminRoles().rolesStatus[1].roleID).toBe(12);
    });
    it('Should set and get custom Roles', function() {
        fairStore.setCustomRoles({
            statusCode: 200,
            signupSheetCustomRolesMessagesList: [{
                id: 11,
                title: 'book fair helper'
            }, {
                customRoleId: 12,
                title: 'mock test'
            }]
        });
        expect(fairStore.getCustomRoles().signupSheetCustomRolesMessagesList[1].title).toBe('mock test');
    });
    it('Should update custom roles', function() {
        fairStore.setCustomRoles({
            statusCode: 200,
            signupSheetCustomRolesMessagesList: [{
                id: 11,
                title: 'book fair helper'
            }]
        });
        fairStore.updateCustomRoles({
            customRoleId: 12,
            eventName: 'mock test'
        });
        expect(fairStore.getCustomRoles().signupSheetCustomRolesMessagesList[1].title).toBe('mock test');
    });
    it('Should delete custom roles', function() {
        var customRoles = {
            statusCode: 200,
            signupSheetCustomRolesMessagesList: [{
                id: 11,
                title: 'book fair helper'
            }]
        };
        fairStore.setCustomRoles(customRoles);
        fairStore.deleteCustomRole({
            id: 11,
            title: 'book fair helper'
        });
        expect(customRoles.signupSheetCustomRolesMessagesList).toEqual([]);
    });
    it('Should set and get contact List', function() {
        fairStore.setContactsList([{
                id: 11,
                volunteerExt: {
                    name: 'Santhosh'
                }

            },
            {
                id: 12,
                volunteerExt: {
                    name: 'Sujith'
                }

            }
        ]);
        spyOn(JSON, 'parse');
        spyOn($window.sessionStorage, 'getItem');
        fairStore.getContactsList();
        expect(JSON.parse).toHaveBeenCalled();
        expect($window.sessionStorage.getItem).toHaveBeenCalled();
    });
    it('Should format Time', function() {
        expect(fairStore.timeFormat('10 AM')).toBe('10:00 AM');
    });
    it('Should set and get publish flag', function() {
        fairStore.setPublishedFlag(true);
        expect(fairStore.getPublishedFlag()).toBeTruthy();
    });
});
