'use strict';

describe('VMS.scheduleCarouselCtrl', function() {
    var $controller,
        getController,
        $window,
        mockStore,
        $scope;

    beforeEach(module('volScheduleModule'));

    beforeEach(inject(function($injector, _$rootScope_, _$controller_) {
        $scope = _$rootScope_.$new();
        $controller = _$controller_;

        mockStore = {};
        $window = {
            localStorage: {
                getItem: function(fs) {
                    return '{}';
                },
                setItem: function(item, stuff) {
                    mockStore[item] = stuff;
                },
                removeItem: function() {},
            },
        };
        spyOn($window.localStorage, 'getItem').and.callThrough();
        spyOn($window.localStorage, 'setItem').and.callThrough();

        getController = function() {
            return $controller('scheduleCarouselCtrl', {
                $scope: $scope,
                $http: null,
                $window: $window,
            });
        };
    }));

    it('Should have a controller', function() {
        var controller = getController();
        expect(controller).toBeDefined();
    });
    it('Should hide overlay', function() {
        var controller = getController();
        $scope.donotShowOverLay();
        expect($window.localStorage.setItem).toHaveBeenCalled();
    });

});
