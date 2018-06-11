'use strict';
describe('VMS.dumble', function() {

    var dumble;

    beforeEach(module("taggingService", function($provide) {
        $provide.value("$document", {});
        $provide.value("$window", {});
    }));

    beforeEach(inject(function(_dumble_) {
        dumble = _dumble_;
    }));

    // NOTE: Having trouble mocking right now
    xit('Should have a service', function() {
        console.log(dumble);
        expect(dumble).toBeDefined();
    });

});
