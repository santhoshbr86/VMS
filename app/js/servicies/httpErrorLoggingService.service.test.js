describe('VMS.httpErrorLoggingService', function() {
    var httpErrorLoggingService,
        urlprefix,
        $httpBackend;

    beforeEach(module("adminTool", function($provide) {
        $provide.value("urlprefix", "");
        $provide.value("uuid4", {});
        $provide.constant('_', {});
    }));

    beforeEach(inject(function(_httpErrorLoggingService_, _$httpBackend_) {
        httpErrorLoggingService = _httpErrorLoggingService_;
        $httpBackend = _$httpBackend_;
    }));

    xit('Should have a service', function() {
        expect(httpErrorLoggingService).toBeDefined();
    });

});
