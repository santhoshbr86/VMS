'use strict';
describe('VMS.jqServices', function() {
    var urlprefix = '',
        jqService,
        $httpBackend;

    beforeEach(module("jqServices", function($provide) {
        $provide.value("$window", {});
        $provide.value("$timeout", {});
    }));

    beforeEach(inject(function(_jqService_, _$httpBackend_) {
        jqService = _jqService_;
        $httpBackend = _$httpBackend_;
    }));

    it('Should have a service', function() {
        expect(jqService).toBeDefined();
    });
});
