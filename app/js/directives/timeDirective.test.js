'use strict';

describe('VMS.timeStart', function() {
    var $compile,
        $scope,
        element,
        mockEvent,
        template,
        removeClass,
        $rootScope;

    beforeEach(module('timeings'));
    beforeEach(inject(function(_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
        template = '<ul class="hoursDropdown hide">' +
            '<li ng-repeat="hour in hours">' +
            '<a href="javascript:void(0);" ng-mousedown="onselectTime($event,hour)">{{hour}}</a>' +
            '</li>' +
            '</ul>';
        spyOn($.fn, 'removeClass');
        spyOn($.fn, 'addClass');
    }));
    it('Should show start time hours dropdown.', function() {
        var ele1 = $compile('<div class="timeWrap"><input type="text"><time-start></time-start></div>')($scope);
        var ele2 = $compile(template)($scope);
        // ele1.append(ele2);
        $scope.$digest();
        ele1.find('input').click();
        expect($.fn.removeClass).toHaveBeenCalledWith('hide');
        expect($.fn.addClass).toHaveBeenCalledWith('show');
    });
});
describe('VMS.timeEnd', function() {
    var $compile,
        $scope,
        element,
        mockEvent,
        template,
        removeClass,
        $rootScope;

    beforeEach(module('timeings'));
    beforeEach(inject(function(_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
        template = '<ul class="hoursDropdown hide">' +
            '<li ng-repeat="hour in hours">' +
            '<a href="javascript:void(0);" ng-mousedown="onselectTime($event,hour)">{{hour}}</a>' +
            '</li>' +
            '</ul>';
        spyOn($.fn, 'removeClass');
        spyOn($.fn, 'addClass');
    }));
    it('Should show end time hours dropdown.', function() {
        var ele1 = $compile('<div class="timeWrap"><input type="text"><time-start></time-start></div>')($scope);
        var ele2 = $compile(template)($scope);
        // ele1.append(ele2);
        $scope.$digest();
        ele1.find('input').click();
        expect($.fn.removeClass).toHaveBeenCalledWith('hide');
        expect($.fn.addClass).toHaveBeenCalledWith('show');
    });
});
describe('VMS.validateStart', function() {
    var $compile,
        $scope,
        element,
        mockEvent,
        template,
        removeClass,
        $rootScope;

    beforeEach(module('timeings'));
    beforeEach(inject(function(_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
        spyOn($.fn, 'removeClass');
        spyOn($.fn, 'addClass');
        $scope = {
            formatAMPM: function(t) {
                return '';
            },
            $apply: function() {

            }
        };
        spyOn($scope, 'formatAMPM').and.callThrough();
        spyOn($scope, '$apply').and.callThrough();
        $scope.task = {
            start: '10 AM',
            end: '11 AM'
        };
    }));
    it('Should close start hours dropdown.', function() {
        var ele1 = $compile('<input type="text" validate-start>')($scope);
        ele1.blur();
        expect($.fn.removeClass).toHaveBeenCalledWith('show');
        expect($.fn.addClass).toHaveBeenCalledWith('hide');
    });
    // Need to more test cases.
});
describe('VMS.validateEnd', function() {
    var $compile,
        $scope,
        element,
        mockEvent,
        template,
        removeClass,
        $rootScope;

    beforeEach(module('timeings'));
    beforeEach(inject(function(_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
        spyOn($.fn, 'removeClass');
        spyOn($.fn, 'addClass');
        $scope = {
            formatAMPM: function(t) {
                return '';
            },
            $apply: function() {

            }
        };
        spyOn($scope, 'formatAMPM').and.callThrough();
        spyOn($scope, '$apply').and.callThrough();
        $scope.task = {
            start: '10 AM',
            end: '11 AM'
        };
    }));
    it('Should close start hours dropdown.', function() {
        var ele1 = $compile('<input type="text" validate-end>')($scope);
        ele1.blur();
        expect($.fn.removeClass).toHaveBeenCalledWith('show');
        expect($.fn.addClass).toHaveBeenCalledWith('hide');
    });
    // Need to more test cases.
});
