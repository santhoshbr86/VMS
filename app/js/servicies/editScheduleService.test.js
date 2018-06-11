'use strict';
describe('VMS.adminRoles', function() {
    var urlprefix = '',
        adminRoles,
        $httpBackend;

    beforeEach(module("editScheduleService", function($provide) {
        $provide.value("urlprefix", urlprefix);
    }));

    beforeEach(inject(function(_adminRoles_, _$httpBackend_) {
        adminRoles = _adminRoles_;
        $httpBackend = _$httpBackend_;
    }));

    it('Should have a service', function() {
        expect(adminRoles).toBeDefined();
    });

    it('Should get roles', function() {
        $httpBackend.whenGET('/volunteer-manager/admin/volunteer/roles/').respond({});
        adminRoles.getAdminRoles(2);
        var response = $httpBackend.expectGET('/volunteer-manager/admin/volunteer/roles/');
        expect(response).toBeDefined();
    });

    it('Should get custom roles', function() {
        $httpBackend.whenGET('/volunteer-manager/signupsheet/custom/tasks/').respond({});
        adminRoles.getCustomRoles(1);
        var response = $httpBackend.expectGET('/volunteer-manager/signupsheet/custom/tasks/');
        expect(response).toBeDefined();
    });
});

describe('VMS.editScheduleService', function() {
    var urlprefix = '',
        dateService,
        $httpBackend;

    beforeEach(module("editScheduleService", function($provide) {
        $provide.value("urlprefix", urlprefix);
    }));

    beforeEach(inject(function(_dateService_, _$filter_) {
        dateService = _dateService_;
    }));

    it('Should have a service', function() {
        expect(dateService).toBeDefined();
    });

    xit('Should get date ranges', function() {
        expect(dateService.dateRange(1, 2, 3)).toBe();
    });

    it('Should convert to UTC', function() {
        expect(dateService.utcConversion('2017/04/04')).toBe('04/04/2017');
    });
});
