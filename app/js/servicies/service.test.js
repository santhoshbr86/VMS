'use strict';
/*
describe('VMS.rolesSer', function() {
    var rolesSer,
        $q,
        $httpBackend;

    beforeEach(module("appService", function($provide) {
        $provide.value("urlprefix", "");
    }));

    beforeEach(inject(function(_rolesSer_, _$q_, _$httpBackend_) {
        rolesSer = _rolesSer_;
        $q = _$q_;
        $httpBackend = _$httpBackend_;
    }));

    it('Should have a service', function() {
        expect(rolesSer).toBeDefined();
    });
});
*/

describe('VMS.mesSer', function() {
    var messSer,
        $q,
        $httpBackend;

    beforeEach(module("appService", function($provide) {
        $provide.value("urlprefix", "");
    }));

    beforeEach(inject(function(_messSer_, _$q_, _$httpBackend_) {
        messSer = _messSer_;
        $q = _$q_;
        $httpBackend = _$httpBackend_;
    }));

    it('Should have a service', function() {
        expect(messSer).toBeDefined();
    });

});

describe('VMS.contactService', function() {
    var contactService,
        urlprefix = '',
        $httpBackend;

    beforeEach(module("appService", function($provide) {
        $provide.value("$window", {});
        $provide.value("urlprefix", urlprefix);
    }));

    beforeEach(inject(function(_contactService_, _$httpBackend_) {
        contactService = _contactService_;
        $httpBackend = _$httpBackend_;
    }));

    it('Should have a service', function() {
        expect(contactService).toBeDefined();
    });

    it('Should have orgId defaulted to -1', function() {
        expect(contactService.getOrgId()).toBe(-1);
    });

    it('Should set orgId', function() {
        contactService.setOrgId(1337);
        expect(contactService.getOrgId()).toBe(1337);
    });

    it('Should have eventId defaulted to -1', function() {
        expect(contactService.getEventId()).toBe(-1);
    });

    it('Should set eventId', function() {
        contactService.setEventId(1337);
        expect(contactService.getEventId()).toBe(1337);
    });

    it('Should set and get contact info', function() {
        contactService.setinfo({
            volunteerExt: {
                firstName: "first",
                // DON'T USE MY NAME ANYWHERE
                lastName: "last",
                phone: "5551231234",
                address1: "1600 Pennsylvania Ave",
                address2: "apt 2",
                city: "Washington",
                state: "NJ",
                postalCode: "00000",
                transId: "123",
                type: "BFC",
                note: "super cool",
                internalType: "contact",
                currentBFC: "false",
            },
            schoolId: "456",
        });

        expect(contactService.getinfo().firstName).toBe("first");

        //contactService.clearinfo();
        //expect(contactService.getinfo().firstName).toBe("");
    });

    // TODO: Check the other getters and setters

    it('Should add contact', function() {
        $httpBackend.whenPOST(urlprefix + '/volunteer-manager/contact').respond({});
        contactService.addContact({}, 'POST');
        $httpBackend.flush();
        var response = $httpBackend.expectPOST(urlprefix + '/volunteer-managet/contact', {});
        expect(response).toBeDefined();
    });

    it('Should get states json', function() {
        $httpBackend.whenGET('resources/stateList.json').respond({});
        contactService.getStates();
        $httpBackend.flush();
        var response = $httpBackend.expectGET('response/stateList.json');
        expect(response).toBeDefined();
    });

});

describe('VMS.signupSheetService', function() {
    var signupSheetService,
        $httpBackend;

    beforeEach(module("appService", function($provide) {
        $provide.value("$window", {});
        $provide.value("$location", "");
        $provide.value("urlprefix", "");
    }));

    beforeEach(inject(function(_signupSheetService_, _$httpBackend_) {
        signupSheetService = _signupSheetService_;
        $httpBackend = _$httpBackend_;
    }));

    it('Should have a service', function() {
        expect(signupSheetService).toBeDefined();
    });

    it('Should get signup sheets by CRMId/Type/SpsId', function() {
        $httpBackend.whenGET('' + '/volunteer-manager/signup/1/2/3/4/5').respond({});
        var ret = signupSheetService.getSignupSheetsByCrmIdTypeSpsId(1, 2, 3, 4, 5);
        console.log(ret);
        $httpBackend.flush();
        $httpBackend.expectGET('' + '/volunteer-manager/signup/1/2/3/4/5');
        expect(ret).toBeDefined();
    });
});

describe('VMS.emailAddressService', function() {
    var emailAddress;

    beforeEach(module("appService", function($provide) {}));

    beforeEach(inject(function(_emailAddress_) {
        emailAddress = _emailAddress_;
    }));

    it('Should have a service', function() {
        expect(emailAddress).toBeDefined();
    });
});

describe('VMS.importService', function() {
    var importService;

    beforeEach(module("appService", function($provide) {}));

    beforeEach(inject(function(_importService_) {
        importService = _importService_;
    }));

    it('Should have a service', function() {
        expect(importService).toBeDefined();
    });
});

describe('VMS.twilioService', function() {
    var twilioService,
        $httpBackend;

    beforeEach(module("appService", function($provide) {}));

    beforeEach(inject(function(_twilioService_, _$httpBackend_) {
        twilioService = _twilioService_;
        $httpBackend = _$httpBackend_;
    }));

    it('Should have a service', function() {
        expect(twilioService).toBeDefined();
    });

    it('Should get twilio config', function() {
        twilioService.getTwilioBean();
        $httpBackend.whenGET('resources/twilioConfig.json').respond({});
        $httpBackend.flush();
        var response = $httpBackend.expectGET('resources/twilioConfig.json');
        expect(response).toBeDefined();
    });
});

describe('VMS.janRainService', function() {
    var janRainService;

    beforeEach(module("appService", function($provide) {
        $provide.value("$window", {});
        $provide.value("$routeParams", {});
        $provide.value("urlprefix", "");

    }));

    beforeEach(inject(function(_janRainService_) {
        janRainService = _janRainService_;
    }));

    it('Should have a service', function() {
        expect(janRainService).toBeDefined();
    });
});
