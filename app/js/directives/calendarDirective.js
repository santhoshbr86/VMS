"use strict";
var app = angular.module('calendarDirective', []);
//Book-449,450,452 Default hours and scroll left and right.
app.directive('scrollHorizontal', function() {
    return {
        restrict: 'A',
        link: function(scope, ele, attr) {
            // Hide prevTime (left) buttons.
            function hidePrev(left) {
                switch (left) {
                    case -90:
                        scope.$apply(function() {
                            scope.disablePrevTime = true;
                        });
                        break;
                    case -1440:
                        scope.$apply(function() {
                            scope.disableNextTime = false;
                        });
                        break;
                    default:
                        break;
                }
            }
            // Hide NextTime (right) buttons.
            function hideNext(left) {
                switch (left) {
                    case 0:
                        scope.$apply(function() {
                            scope.disablePrevTime = false;
                        });
                        break;
                    case -1350:
                        scope.$apply(function() {
                            scope.disableNextTime = true;
                        });
                        break;
                    default:
                        break;
                }
            }
            ele.on('click', function(e) {
                //Horizontal width of innerWrap div is 1440px.
                // Intial set left to 630px, and move left/right, -/+, 90px
                // var innerWrap = angular.element('.innerWrap');
                var innerWrap = $(e.target).parent().parent().parent().find('.innerWrap');
                if (innerWrap.is(':animated')) {
                    return false; // return false if it's already animating
                }
                var pos = innerWrap.position();
                var leftPos = Math.round(pos.left);
                if (attr.class === 'preWrap') {
                    if (leftPos !== 0) {
                        // Animate all innerWrap class elements tp left/right here 90 width of each cell.
                        $(e.target).parent().parent().parent().find('.innerWrap').animate({
                            left: leftPos + 90
                        }, 300);
                        hidePrev(leftPos);
                    }
                } else {
                    if (leftPos !== -1440) {
                        // Animate all innerWrap class elements to left/right
                        $(e.target).parent().parent().parent().find('.innerWrap').animate({
                            left: leftPos - 90
                        }, 300);
                        hideNext(leftPos);
                    }
                }

            });
        }
    };
});
//Element drag and drop.
app.directive('draggable', function() {
    var handleDragEnd = function(e) {
        this.style.opacity = '1.0';
    };

    var handleDragStart = function(e) {
        if (this.parentElement.parentElement.className === "dataBox") {
            console.log("this should not be dragged");
            return;
        }
        this.style.opacity = '0.4';
        var dragEle = angular.element(this);
        //fairStore.startPoint(e.target.offsetX);
        var activity = {};
        if (this.children.length > 2 && angular.isDefined(dragEle.find('.taskEventName')[0])) {
            activity = {
                activityName: dragEle.find('.taskEventName')[0].innerText,
                uid: $(this).find('span')[0].innerHTML
            };
        } else {
            var temp = this.children[1].innerHTML.split(',');
            activity = {
                activityName: this.children[0].innerText,
                roleId: temp[0],
                description: temp[1]
            };
        }
        // If we see Create Your Own, we don't want to pass that name on
        if (activity.activityName === "Create Your Own") {
            activity.activityName = '';
            activity.description = '';
        }
        e.dataTransfer.setData('text', JSON.stringify(activity));
    };

    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element[0].addEventListener('dragstart', handleDragStart, false);
            element[0].addEventListener('dragend', handleDragEnd, false);
        }
    };
});
app.directive('droppable', function() {
    var handleDragOver = function(e) {
        e.preventDefault(); // Necessary. Allows us to drop.
        e.dataTransfer.dropEffect = 'move'; // See the section on the DataTransfer object.
        return false;
    };

    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element[0].addEventListener('drop', scope.handleDrop, false);
            element[0].addEventListener('dragover', handleDragOver, false);
        }
    };
});
app.directive('duplicateOverlay', function() {
    return {
        restrict: 'E',
        templateUrl: '/partials/duplicate-tasks-overlay.html',
        controller: 'duplicateDayCtrl'
    };
});
