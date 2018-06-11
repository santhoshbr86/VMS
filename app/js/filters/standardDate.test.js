describe('VMS.standardDate', function() {
    var $filter;

    beforeEach(module('appDirectives'));

    beforeEach(function() {
        inject(function(_$filter_) {
            $filter = _$filter_;
        });
    });

    xit('Should format the date', function() {
        var result = $filter('standardDate')('2017-01-06T19:44:58.463Z');
        expect(result).toBe('01/06/2017');

        result = $filter('standardDate')('2017-01-06T00:00:00.000Z');
        expect(result).toBe('01/06/2017');

        result = $filter('standardDate')('2017-01-06');
        expect(result).toBe('01/06/2017');

        result = $filter('standardDate')(null);
        expect(result).toBe('');
        /* Disabling this because StackOverflow is telling me this format of input is unreliable.
        result = $filter('standardDate')('2017-01-06');
        expect(result).toBe('01/06/2017');
        */
    });
});
