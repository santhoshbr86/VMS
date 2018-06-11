"use strict";
describe('VMS.calendarDirective', function() {
    describe('Horizontal Scroll', function() {
        var $compile,
            $scope,
            $document,
            $rootScope;

        beforeEach(module('calendarDirective'));

        beforeEach(inject(function(_$compile_, _$document_, _$rootScope_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            $scope = _$rootScope_.$new();
            $document = _$document_;
        }));

        // NOTE: This misses a lot of cases, but is a good start.
        it('Should hide previous', function() {
            var foo = "<div scroll-horizontal><div style='position: absolute;' class='innerWrap'></div></div>";
            var element = $compile(foo)($scope);
            angular.element($document[0].body).append(element);

            element.triggerHandler('click');
            $scope.$digest();
            expect(1).toBe(1);
        });
    });

    describe('Draggable', function() {
        var $compile,
            $scope,
            $document,
            $rootScope,
            template;

        beforeEach(module('calendarDirective'));

        beforeEach(inject(function(_$compile_, _$rootScope_, _$document_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            $scope = _$rootScope_.$new();
            $document = _$document_;
            //template = "<div id='blah' draggable='true'><span>name</span><div class='taskEventName'></div></div>";
            template = "<div id='blah' draggable='true'><span>name</span><span class='taskEventName'></span></div>";
        }));

        // NOTE: This should be way more strict
        it('Should drag start', function() {
            var foo = $compile(template)($scope);
            var element = $compile(foo)($scope);
            angular.element($document[0].body).append(element);
            var theElement = $document[0].getElementById('blah');
            var mockEvent = new Event('dragstart');
            mockEvent.dataTransfer = {
                setData: jasmine.createSpy("setData() spy"),
            };

            theElement.dispatchEvent(mockEvent);
            $scope.$digest();

            expect(mockEvent.dataTransfer.setData).toHaveBeenCalledWith('text', '{"activityName":"name","roleId":""}');
            expect(theElement.style.opacity).toBe('0.4');
        });

        it('Should skip setting name and description when default', function() {
            var foo = $compile("<div id='blah45' draggable='true'><span>Create Your Own</span><span>-1,custom role</span></div>")($scope);
            var element = $compile(foo)($scope);
            angular.element($document[0].body).append(element);
            var theElement = $document[0].getElementById('blah45');
            var mockEvent = new Event('dragstart');
            mockEvent.dataTransfer = {
                setData: jasmine.createSpy("setData() spy"),
            };

            theElement.dispatchEvent(mockEvent);
            $scope.$digest();

            expect(mockEvent.dataTransfer.setData).toHaveBeenCalledWith('text', '{"activityName":"","roleId":"-1","description":""}');
            expect(theElement.style.opacity).toBe('0.4');
        });

        it('Should reset opacity on drag end', function() {
            var foo = $compile(template)($scope);
            var element = $compile(foo)($scope);
            angular.element($document[0].body).append(element);
            var theElement = $document[0].getElementById('blah');
            theElement.dispatchEvent(new Event('dragend'));
            $scope.$digest();

            expect(theElement.style.opacity).toBe('1');
        });
    });

    describe('Droppable', function() {
        var $compile,
            $scope,
            $document,
            template,
            $rootScope;

        beforeEach(module('calendarDirective'));

        beforeEach(inject(function(_$compile_, _$rootScope_, _$document_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            $document = _$document_;
            $scope = _$rootScope_.$new();
            template = "<div id='blah1' droppable='true'></div>";
        }));

        // NOTE: Not testing this until it's brought in to the directive
        xit('Should drop');

        // NOTE: This should be way more strict
        it('Should drag over', function() {
            var foo = $compile(template)($scope);
            var element = $compile(foo)($scope);
            angular.element($document[0].body).append(element);
            var theElement = $document[0].getElementById('blah1');
            var mockEvent = new Event('dragover');
            mockEvent.preventDefault = jasmine.createSpy("preventDefault() spy");
            mockEvent.dataTransfer = {
                setData: jasmine.createSpy("setData() spy"),
            };

            theElement.dispatchEvent(mockEvent);
            $scope.$digest();

            expect(mockEvent.preventDefault).toHaveBeenCalled();
        });
    });
});
describe('VMS.duplicateOverlay', function() {
    var $compile,
        $rootScope,
        element,
        $httpBackend,
        $scope;
    beforeEach(module('calendarDirective'));

    beforeEach(inject(function($injector, _$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
        $httpBackend = $injector.get('$httpBackend');
        $httpBackend = $httpBackend.whenGET('/partials/duplicate-tasks-overlay.html').respond(200, '');
        element = $compile('<duplicate-overlay class="duplicateOverlayWrap"></duplicate-overlay>')($scope);
    }));
    it("Should have duplicate-overlay", function() {
        expect(element.length).toEqual(1);
    });

});
