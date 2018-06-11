'use strict';
describe('VMS.app', function() {
    it('Should have Angular.js', function() {
        expect(angular).toBeDefined();
    });

    it('Should have Angular.js mocks', function() {
        expect(angular.mock).toBeDefined();
    });

    it('Should have JQuery', function() {
        expect($).toBeDefined();
    });

    it('Should have JSON object', function() {
        expect(JSON).toBeDefined();
    });
});
