(function() {
    "use strict";
    var app = angular.module('timeings', []);
    var ANY_TIME = 'Any Time';
    var MIDNIGHT = 'Midnight';
    app.directive('timeStart', function() {
        return {
            restrict: 'E',
            //replace: true,
            transclude: true,
            template: '<ul class="hoursDropdown hide">' +
                '<li ng-repeat="hour in hours">' +
                '<a href="javascript:void(0);" ng-mousedown="onselectTime($event,hour)">{{hour}}</a>' +
                '</li>' +
                '</ul>',
            link: function(scope, element, attr) {
                element.parent('.timeWrap').find('input').bind('click', function(e) {
                    e.stopPropagation();
                    element.removeClass('hide');
                    element.addClass('show');
                });

            }
        };
    });
    app.directive('timeEnd', function() {
        return {
            restrict: 'E',
            //replace: true,
            transclude: true,
            template: '<ul class="hoursDropdown hide">' +
                '<li ng-repeat="endHour in endHours">' +
                '<a href="javascript:void(0);" ng-mousedown="onselectTime($event,endHour)">{{endHour}}</a>' +
                '</li>' +
                '</ul>',
            link: function(scope, element, attr) {
                element.parent('.timeWrap').find('input').bind('click', function(e) {
                    e.stopPropagation();
                    element.removeClass('hide');
                    element.addClass('show');
                });

            }
        };
    });
    app.directive('validateStart', function() {
        return {
            restrict: 'A',
            link: function(scope, ele, attr) {
                ele.bind('blur', function() {
                    ele.next('ul.hoursDropdown').removeClass('show');
                    ele.next('ul.hoursDropdown').addClass('hide');
                    if (parseInt(scope.task.start.split(':')[0]) > 12 || parseInt(scope.task.start.split(':')[1]) > 59) {
                        scope.wrongTime = true;
                        scope.$apply();
                    } else {
                        if (scope.task.start.toUpperCase().indexOf('AM') === -1) {
                            if (scope.task.start.match(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/) && scope.task.start !== ANY_TIME) {
                                if (scope.task.end.split(' ')[1] === 'AM') {
                                    scope.task.start = scope.task.start + ' ' + 'AM';

                                } else {
                                    scope.task.start = scope.task.start + ' ' + 'PM';

                                }
                                scope.wrongTime = false;
                                scope.$apply();
                                return;
                            } else {
                                if (scope.task.start !== ANY_TIME) {
                                    scope.wrongTime = true;
                                    scope.$apply();
                                }
                            }

                        } else {
                            if (scope.task.start !== ANY_TIME) {
                                scope.task.start = scope.formatAMPM(scope.task.start).toUpperCase();
                                scope.wrongTime = false;
                                scope.$apply();
                            }
                            return;
                        }

                        if (scope.task.start.toUpperCase().indexOf('PM') === -1) {
                            if (scope.task.start.match(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/) && scope.task.start !== ANY_TIME) {
                                if (scope.task.end.split(' ')[1] === 'PM') {
                                    scope.task.start = scope.task.start + ' ' + 'PM';

                                } else {
                                    scope.task.start = scope.task.start + ' ' + 'AM';

                                }
                                scope.wrongTime = false;
                                scope.$apply();
                                return;
                            } else {
                                if (scope.task.start !== ANY_TIME) {
                                    scope.wrongTime = true;
                                    scope.$apply();
                                }
                            }
                        } else {
                            if (scope.task.start !== ANY_TIME) {
                                scope.task.start = scope.formatAMPM(scope.task.start).toUpperCase();
                                scope.wrongTime = false;
                                scope.$apply();
                            }
                            return;
                        }
                    }

                });
            }
        };
    });
    app.directive('validateEnd', function() {
        return {
            restrict: 'A',
            link: function(scope, ele, attr) {
                ele.bind('blur', function() {
                    ele.next('ul.hoursDropdown').removeClass('show');
                    ele.next('ul.hoursDropdown').addClass('hide');
                    if (parseInt(scope.task.end.split(':')[0]) > 12 || parseInt(scope.task.end.split(':')[1]) > 59) {
                        scope.wrongTime = true;
                        scope.$apply();
                    } else {

                        if (scope.task.end.toUpperCase().indexOf('AM') === -1) {
                            if (scope.task.end.match(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/) && scope.task.end !== ANY_TIME && scope.task.end !== MIDNIGHT) {
                                if (scope.task.start.split(' ')[1] === 'AM') {
                                    scope.task.end = scope.task.end + ' ' + 'AM';

                                } else {
                                    scope.task.end = scope.task.end + ' ' + 'PM';

                                }
                                scope.wrongTime = false;
                                scope.$apply();
                                return;
                            } else {
                                if (scope.task.end !== ANY_TIME && scope.task.end !== MIDNIGHT) {
                                    scope.wrongTime = true;
                                    scope.$apply();
                                }
                            }

                        } else {
                            if (scope.task.end !== ANY_TIME && scope.task.end !== MIDNIGHT) {
                                scope.task.end = scope.formatAMPM(scope.task.end).toUpperCase();
                                scope.wrongTime = false;
                                scope.$apply();
                            }
                            return;
                        }

                        if (scope.task.end.toUpperCase().indexOf('PM') === -1) {
                            if (scope.task.end.match(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/) && scope.task.end !== ANY_TIME && scope.task.end !== MIDNIGHT) {
                                if (scope.task.start.split(' ')[1] === 'PM') {
                                    scope.task.end = scope.task.end + ' ' + 'PM';

                                } else {
                                    scope.task.end = scope.task.end + ' ' + 'AM';

                                }
                                scope.wrongTime = false;
                                scope.$apply();
                                return;
                            } else {
                                if (scope.task.end !== ANY_TIME && scope.task.end !== MIDNIGHT) {
                                    scope.wrongTime = true;
                                    scope.$apply();
                                }
                            }
                        } else {
                            if (scope.task.end !== ANY_TIME && scope.task.end !== MIDNIGHT) {
                                scope.task.end = scope.formatAMPM(scope.task.end).toUpperCase();
                                scope.wrongTime = false;
                                scope.$apply();
                            }

                            return;
                        }
                    }

                });
            }
        };
    });
    app.directive('applyWidth', function() {
        return {
            link: function(scope, element, attr) {
                function parseTime(s) {
                    var c = s.split(':');
                    return parseInt(c[0]) * 60 + parseInt(c[1]);
                }

                function lessthanTen(t) {
                    return t < 10 ? '0' + t : t;
                }
                var s = parseFloat(scope.t.startTime.split('T')[1].replace(':', '.'));
                var e = parseFloat(scope.t.endTime.split('T')[1].replace(':', '.'));
                var minutes;
                if (scope.t.endTime.split('T')[1] === '00:00') {
                    minutes = parseTime('24:00') - parseTime(scope.t.startTime.split('T')[1]);
                } else {
                    minutes = parseTime(scope.t.endTime.split('T')[1]) - parseTime(scope.t.startTime.split('T')[1]);
                }
                var diff = Math.floor(minutes / 60) + '.' + lessthanTen(minutes % 60);
                var cas = parseFloat(diff);
                var startPoint = parseFloat((s % 1).toFixed(2));

                if (startPoint < 0.15) {
                    element.css({
                        'left': '0'
                    });
                }
                if (startPoint >= 0.15 && startPoint < 0.30) {
                    element.css({
                        'left': '23%'
                    });
                }
                if (startPoint >= 0.30 && startPoint < 0.45) {
                    element.css({
                        'left': '47%'
                    });
                }
                if (startPoint >= 0.45) {
                    element.css({
                        'left': '74%'
                    });
                }

                switch (true) {
                    case (cas <= 0.15):
                        element.css({
                            'width': '25%',
                            'height': '18px',
                            'overflow': 'hidden'
                        });
                        scope.$root.applyWidthCounter++;
                        break;
                    case (cas > 0.15 && cas <= 0.30):
                        element.css({
                            'width': '50%', // DJ VMS-1567 Exact % chrome and ff 47
                            // 'width': '50%',
                            'height': '22px',
                            'overflow': 'hidden'
                        });
                        element.find(".taskEventContainer").css({
                            // VMS-1544-SaveDup-Role-Truncations
                            // width for notAssinged role should be 34 and for assigned role 22
                            //'width': '22px',
                            'width': '34px', // DJ VMS-1567 Exact % chrome and ff 34
                            'height': '18px',
                            'overflow': 'hidden'
                        });
                        scope.$root.applyWidthCounter++;
                        break;
                    case (cas > 0.30 && cas <= 0.45):
                        element.css({
                            'width': '75%', // DJ VMS-1567 Exact % chrome and ff 47
                            'height': '18px',
                            'overflow': 'hidden',
                            // DJ VMS-1567 Exact % 1 space between halfs
                        });
                        element.find(".taskEventContainer").css({
                            //'width': '22px',
                            'width': '34px', // DJ VMS-1567 Exact % chrome and ff 34
                            'height': '18px',
                            'overflow': 'hidden'
                        });
                        scope.$root.applyWidthCounter++;
                        break;
                    case (cas > 0.45 && cas <= 1.00):
                        element.css({
                            'width': '96%' // DJ VMS-1566 Exact % chrome and ff 95
                        });
                        element.find(".taskEventContainer").css({
                            //'width': '59px',
                            'width': '71px', // DJ VMS-1566 Exact % chrome and ff 71
                            'height': '18px',
                            'overflow': 'hidden'
                        });
                        scope.$root.applyWidthCounter++;
                        break;
                    case (cas > 1.00 && cas <= 1.15):
                        element.css({
                            'width': '124%' // DJ VMS-1566 Exact % chrome and ff 148
                            //'width': '250%'
                        });
                        element.find(".taskEventContainer").css({
                            'width': '112px', // DJ VMS-1566 Exact % chrome and ff 124
                            'height': '18px',
                            'overflow': 'hidden'
                        });
                        scope.$root.applyWidthCounter++;
                        break;
                    case (cas > 1.15 && cas <= 1.30):
                        element.css({
                            'width': '148%' // DJ VMS-1566 Exact % chrome and ff 148
                            //'width': '250%'
                        });
                        element.find(".taskEventContainer").css({
                            'width': '112px', // DJ VMS-1566 Exact % chrome and ff 124
                            'height': '18px',
                            'overflow': 'hidden'
                        });
                        scope.$root.applyWidthCounter++;
                        break;
                    case (cas > 1.30 && cas <= 1.45):
                        element.css({
                            'width': '176%' // DJ VMS-1566 Exact % chrome and ff 148
                            //'width': '250%'
                        });
                        element.find(".taskEventContainer").css({
                            'width': '112px', // DJ VMS-1566 Exact % chrome and ff 124
                            'height': '18px',
                            'overflow': 'hidden'
                        });
                        scope.$root.applyWidthCounter++;
                        break;
                    case (cas > 1.45 && cas <= 2):
                        element.css({
                            'width': '196%' // DJ VMS-1566 Exact % chrome and ff 148
                            //'width': '250%'
                        });
                        scope.$root.applyWidthCounter++;
                        break;
                    case (cas > 2 && cas <= 2.15):
                        element.css({
                            'width': '224%' // DJ VMS-1566 Exact % chrome and ff 148
                            //'width': '250%'
                        });
                        scope.$root.applyWidthCounter++;
                        break;
                    case (cas > 2.15 && cas <= 2.30):
                        element.css({
                            'width': '248%' // DJ VMS-1566 Exact % chrome and ff 148
                            //'width': '250%'
                        });
                        scope.$root.applyWidthCounter++;
                        break;
                    case (cas > 2.30 && cas <= 2.45):
                        element.css({
                            'width': '274%'

                        });
                        scope.$root.applyWidthCounter++;
                        break;
                    case (cas > 2.45 && cas <= 3):
                        element.css({
                            'width': '297.3%'

                        });
                        scope.$root.applyWidthCounter++;
                        break;
                    case (cas > 3 && cas <= 3.15):
                        element.css({
                            'width': '324%'

                        });
                        scope.$root.applyWidthCounter++;
                        break;
                    case (cas > 3.15 && cas <= 3.30):
                        element.css({
                            'width': '348%'

                        });
                        scope.$root.applyWidthCounter++;
                        break;
                    case (cas > 3.30 && cas <= 3.45):
                        element.css({
                            'width': '374%'

                        });
                        scope.$root.applyWidthCounter++;
                        break;
                    case (cas > 3.45 && cas <= 4):
                        element.css({
                            'width': '398.8%'

                        });
                        scope.$root.applyWidthCounter++;
                        break;
                    case (cas > 4 && cas <= 4.15):
                        element.css({
                            'width': '426%'

                        });
                        scope.$root.applyWidthCounter++;
                        break;
                    case (cas > 4.15 && cas <= 4.30):
                        element.css({
                            'width': '452%'

                        });
                        scope.$root.applyWidthCounter++;
                        break;
                    case (cas > 4.30 && cas <= 4.45):
                        element.css({
                            'width': '478%'

                        });
                        scope.$root.applyWidthCounter++;
                        break;
                    case (cas > 4.45 && cas <= 5):
                        element.css({
                            'width': '499.6%'

                        });
                        scope.$root.applyWidthCounter++;
                        break;
                    case (cas > 5 && cas <= 5.15):
                        element.css({
                            'width': '526%'

                        });
                        scope.$root.applyWidthCounter++;
                        break;
                    case (cas > 5.15 && cas <= 5.30):
                        element.css({
                            'width': '552%'

                        });
                        scope.$root.applyWidthCounter++;
                        break;
                    case (cas > 5.30 && cas <= 5.45):
                        element.css({
                            'width': '578%'

                        });
                        scope.$root.applyWidthCounter++;
                        break;
                    case (cas > 5.45 && cas <= 6):
                        element.css({
                            'width': '601.2%'

                        });
                        scope.$root.applyWidthCounter++;
                        break;
                    case (cas > 6 && cas <= 6.15):
                        element.css({
                            'width': '626%'

                        });
                        scope.$root.applyWidthCounter++;
                        break;
                    case (cas > 6.15 && cas <= 6.30):
                        element.css({
                            'width': '652%'

                        });
                        scope.$root.applyWidthCounter++;
                        break;
                    case (cas > 6.30 && cas <= 6.45):
                        element.css({
                            'width': '678%'

                        });
                        scope.$root.applyWidthCounter++;
                        break;
                    case (cas > 6.45 && cas <= 7):
                        element.css({
                            'width': '703.3%'

                        });
                        scope.$root.applyWidthCounter++;
                        break;
                    case (cas > 7 && cas <= 7.15):
                        element.css({
                            'width': '730%'

                        });
                        scope.$root.applyWidthCounter++;
                        break;
                    case (cas > 7.15 && cas <= 7.30):
                        element.css({
                            'width': '760%'

                        });
                        scope.$root.applyWidthCounter++;
                        break;
                    case (cas > 7.30 && cas <= 7.45):
                        element.css({
                            'width': '785%'

                        });
                        scope.$root.applyWidthCounter++;
                        break;
                    case (cas > 7.45 && cas <= 8):
                        element.css({
                            'width': '804%'

                        });
                        scope.$root.applyWidthCounter++;
                        break;

                    case (cas > 8 && cas <= 8.15):
                        element.css({
                            'width': '830%'

                        });
                        scope.$root.applyWidthCounter++;
                        break;
                    case (cas > 8.15 && cas <= 8.30):
                        element.css({
                            'width': '860%'

                        });
                        scope.$root.applyWidthCounter++;
                        break;
                    case (cas > 8.30 && cas <= 8.45):
                        element.css({
                            'width': '885%'

                        });
                        scope.$root.applyWidthCounter++;
                        break;
                    case (cas > 8.45 && cas <= 9):
                        element.css({
                            'width': '905%'

                        });
                        scope.$root.applyWidthCounter++;
                        break;
                    case (cas > 9 && cas <= 9.15):
                        element.css({
                            'width': '930%'

                        });
                        scope.$root.applyWidthCounter++;
                        break;
                    case (cas > 9.15 && cas <= 9.30):
                        element.css({
                            'width': '960%'

                        });
                        scope.$root.applyWidthCounter++;
                        break;
                    case (cas > 9.30 && cas <= 9.45):
                        element.css({
                            'width': '985%'

                        });
                        scope.$root.applyWidthCounter++;
                        break;
                    case (cas > 9.45 && cas <= 10):
                        element.css({
                            'width': '1005%'

                        });
                        scope.$root.applyWidthCounter++;
                        break;
                    case (cas > 10 && cas <= 10.15):
                        element.css({
                            'width': '1030%'

                        });
                        scope.$root.applyWidthCounter++;
                        break;
                    case (cas > 10.15 && cas <= 10.30):
                        element.css({
                            'width': '1060%'

                        });
                        scope.$root.applyWidthCounter++;
                        break;
                    case (cas > 10.30 && cas <= 10.45):
                        element.css({
                            'width': '1085%'

                        });
                        scope.$root.applyWidthCounter++;
                        break;
                    case (cas > 10.45 && cas <= 11):
                        element.css({
                            'width': '1105%'

                        });
                        scope.$root.applyWidthCounter++;
                        break;
                    case (cas > 11 && cas <= 11.15):
                        element.css({
                            'width': '1130%'

                        });
                        scope.$root.applyWidthCounter++;
                        break;
                    case (cas > 11.15 && cas <= 11.30):
                        element.css({
                            'width': '1160%'

                        });
                        scope.$root.applyWidthCounter++;
                        break;
                    case (cas > 11.30 && cas <= 11.45):
                        element.css({
                            'width': '1185%'

                        });
                        scope.$root.applyWidthCounter++;
                        break;
                    case (cas > 11.45 && cas <= 12):
                        element.css({
                            'width': '1205%'

                        });
                        scope.$root.applyWidthCounter++;
                        break;
                    default:
                        scope.$root.applyWidthCounter++;
                        break;
                }
            }
        };

    });
})();
