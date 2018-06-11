"use strict";
describe('VMS.socialContactsModule', function() {

    var $controller,
        $scope,
        $window,
        getController;

    beforeEach(module('socialContactsModule'));

    beforeEach(inject(function($injector, _$rootScope_, _$controller_) {
        $scope = _$rootScope_.$new();
        $controller = _$controller_;

        $window = {
            localStorage: {
                setItem: function(thing) {}
            },
            close: function() {},
        };

        spyOn($window, 'close');
        spyOn($window.localStorage, 'setItem').and.callThrough();

        getController = function() {
            return $controller('socialContactsController', {
                $scope: $scope,
                $window: $window,
            });
        };
    }));

    it('Should have controller', function() {
        var controller = getController();
        expect(controller).toBeDefined();
    });


    it('Should import', function() {
        var controller = getController();
        expect($window.close).toHaveBeenCalled();
    });

});
