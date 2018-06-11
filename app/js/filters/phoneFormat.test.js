'use strict';
describe('VMS.phoneFormat', function() {
    var $filter;

    beforeEach(function() {
        module('appDirectives');
    });

    beforeEach(function() {
        inject(function(_$filter_) {
            $filter = _$filter_;
        });
    });

    it('Should be blank with blank phone number', function() {
        var input = null,
            result = $filter('phoneFormat')(input);
        expect(result).toBe('');
    });

    it('Should be blank with invalid input', function() {
        var input = 'NoTaPhoNe',
            result = $filter('phoneFormat')(input);
        expect(result).toBe('');
    });

    it('Should format phone number (7 digits)', function() {
        var input = '1231234',
            result = $filter('phoneFormat')(input);
        expect(result).toBe('123-1234');
    });

    it('Should format phone number (10 digits)', function() {
        var input = '5551231234',
            result = $filter('phoneFormat')(input);
        expect(result).toBe('555-123-1234');
    });

});

describe('VMS.htmlEscape', function() {
    var $filter;

    beforeEach(function() {
        module('appDirectives');
    });

    beforeEach(function() {
        inject(function(_$filter_) {
            $filter = _$filter_;
        });
    });

    it('Should filter out malicious characters', function() {
        var input = 'abcdefghijklmnopqrstuvwxyz&<>\'\"',
            result = $filter('htmlEscape')(input);
        expect(result).toBe('abcdefghijklmnopqrstuvwxyz&amp;&lt;&gt;&#39;&quot;');
    });
});

describe('VMS.textToHTML', function() {
    var $filter;

    beforeEach(function() {
        module('appDirectives');
    });

    beforeEach(function() {
        inject(function(_$filter_) {
            $filter = _$filter_;
        });
    });

    it('Should return blank with blank input', function() {
        var input = null,
            result = $filter('textToHtml')(input);
        expect(result).toBe('');
    });

    it('Should make a new <p> at newlines', function() {
        var input = 'hello\nthis is a unit test. woooo. \n :)',
            result = $filter('textToHtml')(input);

        expect(result.$$unwrapTrustedValue()).toBe('<p>hello</p><p>this is a unit test. woooo. </p><p> :)</p>'); // eslint-disable-line angular/no-private-call
    });
});
