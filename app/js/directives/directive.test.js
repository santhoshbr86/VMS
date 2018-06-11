'use strict';

describe('VMS.contactCarousel', function() {});

describe('VMS.signupsheetHelper', function() {});

describe('VMS.taskDuplicate', function() {});

// NOTE: These get code coverage, but I don't know how to verify the code ran.
//       So I am not running them until I can verify the functionality.
describe('VMS.ngPosition', function() {
    var $compile,
        $scope,
        element,
        mockEvent,
        $rootScope;

    beforeEach(module('appDirectives'));

    beforeEach(inject(function(_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();

        mockEvent = new Event('click');
        mockEvent.clientY = 0;



        // Spy on jQuery
        spyOn($.fn, 'css');
    }));

    it('Should shift up 120px', function() {
        element = $compile('<div ng-position></div>')($scope);
        var element2 = $compile('<div id="a" class="popUp"></div>')($scope);
        element.append(element2);
        element.triggerHandler(mockEvent);
        $scope.$digest();

        expect($.fn.css).toHaveBeenCalledWith('top', -120);
    });

    // TODO: Having trouble mocking 'Delete Selected' part
    xit('Should shift up 30px with text', function() {
        element = $compile('<div ng-position></div>')($scope);
        var element2 = $compile('<div id="a" class="addGroup"></div>')($scope);
        mockEvent.currentTarget = {};
        spyOn(mockEvent.currentTarget, 'innerText').and.returnValue('Delete Selected');

        element.append(element2);
        element.triggerHandler(mockEvent);
        $scope.$digest();

        expect($.fn.css).toHaveBeenCalledWith('top', -30);
    });
});

describe('VMS.formatPhone', function() {
    var $compile,
        $scope,
        $document,
        element,
        $rootScope;

    beforeEach(module('appDirectives'));

    beforeEach(inject(function(_$compile_, _$document_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
        $document = _$document_;

        element = $compile('<input ng-model="phone" type="tel" format-phone>')($scope);
    }));

    // We set the number with .val, and fetch it with $scope.phone
    it('Should return null', function() {
        $scope.phone = '';
        element.val('GARBAGE').trigger('change');

        expect($scope.phone).toBeUndefined();
        // expect(element.$error.length).toBe(true); // I am having trouble mocking this
    });

    it('Should remove leading 1 and strip special chars', function() {
        $scope.phone = '';
        element.val('1 555{555}5555').trigger('change');

        $scope.$digest();
        expect($scope.phone).toBe('5555555555');
    });
});

describe('VMS.numbersOnly', function() {
    var $compile,
        $scope,
        element,
        $rootScope;

    beforeEach(module('appDirectives'));

    beforeEach(inject(function(_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();

        element = $compile('<input ng-model="foo" type="tel" numbers-only>')($scope);
    }));

    it('Should strip non numbers', function() {
        $scope.foo = '';
        element.val('abc+_{}=-,`💩123').trigger('change');

        $scope.$digest();
        expect($scope.foo).toBe('123');
    });

    it('Should return blank', function() {
        $scope.foo = '';
        element.val('').trigger('change');

        $scope.$digest();
        expect($scope.foo).toBe('');
    });
});

describe('VMS.fileModel', function() {
    // TODO
});

describe('VMS.slideTog', function() {
    var $compile,
        $scope,
        element,
        $rootScope;

    beforeEach(module('appDirectives'));

    beforeEach(inject(function(_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();

        element = $compile('<div><a class="slideDown"></a><slide-tog></slide-tog></a>')($scope);
    }));

    it('Should blah', function() {
        spyOn($.fn, 'slideToggle');

        element.find('a').click();

        expect($.fn.slideToggle).toHaveBeenCalledWith(300);
    });

});

describe('VMS.showScheduler', function() {

});

describe('VMS.actionPanel', function() {});

describe('VMS.showScheduler', function() {});
